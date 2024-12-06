const Template = require('../models/Template');
const { validateTemplate } = require('../validators/templateValidator');
const analyticsService = require('../services/analytics');
const cacheService = require('../services/cache');
const QueryOptimizer = require('../utils/queryOptimizer');
const logger = require('../utils/logger');
const { sanitizeInput } = require('../utils/validation');

// Get all templates with advanced filtering and caching
exports.getAllTemplates = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            status,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            featured,
            authorId
        } = req.query;

        const cacheKey = `templates:${JSON.stringify(req.query)}`;
        const cachedResult = await cacheService.get(cacheKey);

        if (cachedResult) {
            return res.json(JSON.parse(cachedResult));
        }

        const pipeline = QueryOptimizer.createAggregationPipeline({
            match: {
                isActive: true,
                ...(category && { category }),
                ...(status && { type: status }),
                ...(featured && { isFeatured: true }),
                ...(authorId && { author: authorId }),
                ...(minPrice || maxPrice) && {
                    price: {
                        ...(minPrice && { $gte: parseFloat(minPrice) }),
                        ...(maxPrice && { $lte: parseFloat(maxPrice) })
                    }
                },
                ...(search && {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { tags: { $in: [new RegExp(search, 'i')] } }
                    ]
                })
            },
            sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit),
            project: {
                name: 1,
                category: 1,
                price: 1,
                thumbnailUrl: 1,
                type: 1,
                averageRating: 1,
                numberOfReviews: 1,
                downloads: 1,
                author: 1,
                tags: 1,
                createdAt: 1
            },
            lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
                pipeline: [{ $project: { name: 1, email: 1 } }]
            }
        });

        const [results, totalCount] = await Promise.all([
            Template.aggregate(pipeline),
            Template.countDocuments(pipeline[0].$match)
        ]);

        const response = {
            docs: results,
            totalDocs: totalCount,
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            page: parseInt(page),
            pagingCounter: (parseInt(page) - 1) * parseInt(limit) + 1,
            hasPrevPage: parseInt(page) > 1,
            hasNextPage: parseInt(page) * parseInt(limit) < totalCount,
            prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null,
            nextPage: parseInt(page) * parseInt(limit) < totalCount ? parseInt(page) + 1 : null
        };

        await cacheService.set(cacheKey, JSON.stringify(response), 300);
        res.json(response);

    } catch (error) {
        logger.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Error fetching templates' });
    }
};

// Get template by ID with caching
exports.getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `template:${id}`;

        let template = await cacheService.get(cacheKey);

        if (!template) {
            template = await Template.findOne({ _id: id, isActive: true })
                .populate('author', 'name email')
                .populate({
                    path: 'reviews',
                    populate: { path: 'user', select: 'name' }
                });

            if (!template) {
                return res.status(404).json({ error: 'Template not found' });
            }

            await cacheService.set(cacheKey, JSON.stringify(template));
            await analyticsService.trackEvent('template_view', { templateId: id });
        } else {
            template = JSON.parse(template);
        }

        res.json(template);
    } catch (error) {
        logger.error('Error fetching template:', error);
        res.status(500).json({ error: 'Error fetching template details' });
    }
};

// Create new template with image upload
exports.createTemplate = async (req, res) => {
    try {
        const templateData = {
            ...req.body,
            features: JSON.parse(req.body.features || '[]'),
            tags: JSON.parse(req.body.tags || '[]'),
            compatibility: JSON.parse(req.body.compatibility || '{}'),
            author: req.user._id
        };

        if (req.file) {
            templateData.thumbnailUrl = req.file.location;
        }

        // Sanitize user input
        Object.keys(templateData).forEach(key => {
            if (typeof templateData[key] === 'string') {
                templateData[key] = sanitizeInput(templateData[key]);
            }
        });

        const validationResult = validateTemplate(templateData);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message });
        }

        const template = new Template(templateData);
        await template.save();

        await cacheService.clearPattern('templates:*');
        await analyticsService.trackEvent('template_created', { templateId: template._id });

        res.status(201).json(template);
    } catch (error) {
        logger.error('Error creating template:', error);
        res.status(500).json({ error: 'Error creating template' });
    }
};

// Update template with image handling
exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.thumbnailUrl = req.file.location;
        }

        // Parse JSON strings if present
        ['features', 'tags', 'compatibility'].forEach(field => {
            if (updateData[field]) {
                updateData[field] = JSON.parse(updateData[field]);
            }
        });

        // Sanitize user input
        Object.keys(updateData).forEach(key => {
            if (typeof updateData[key] === 'string') {
                updateData[key] = sanitizeInput(updateData[key]);
            }
        });

        const validationResult = validateTemplate(updateData, true);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message });
        }

        const template = await Template.findById(id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        if (template.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this template' });
        }

        Object.assign(template, updateData);
        template.lastUpdated = new Date();
        await template.save();

        await cacheService.del(`template:${id}`);
        await cacheService.clearPattern('templates:*');
        await analyticsService.trackEvent('template_updated', { templateId: id });

        res.json(template);
    } catch (error) {
        logger.error('Error updating template:', error);
        res.status(500).json({ error: 'Error updating template' });
    }
};

// Soft delete template
exports.deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        if (template.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this template' });
        }

        template.isActive = false;
        template.deletedAt = new Date();
        await template.save();

        await cacheService.del(`template:${id}`);
        await cacheService.clearPattern('templates:*');
        await analyticsService.trackEvent('template_deleted', { templateId: id });

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        logger.error('Error deleting template:', error);
        res.status(500).json({ error: 'Error deleting template' });
    }
};

// Restore deleted template (admin only)
exports.restoreTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        template.isActive = true;
        template.deletedAt = null;
        await template.save();

        await cacheService.del(`template:${id}`);
        await cacheService.clearPattern('templates:*');
        await analyticsService.trackEvent('template_restored', { templateId: id });

        res.json({ message: 'Template restored successfully' });
    } catch (error) {
        logger.error('Error restoring template:', error);
        res.status(500).json({ error: 'Error restoring template' });
    }
};

// Upgrade free template to paid
exports.upgradeToPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        if (!price || price <= 0) {
            return res.status(400).json({ error: 'Valid price is required for paid templates' });
        }

        const template = await Template.findById(id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        if (template.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to upgrade this template' });
        }

        if (template.type === 'paid') {
            return res.status(400).json({ error: 'Template is already a paid template' });
        }

        template.type = 'paid';
        template.price = price;
        await template.save();

        await cacheService.del(`template:${id}`);
        await cacheService.clearPattern('templates:*');
        await analyticsService.trackEvent('template_upgraded', { templateId: id });

        res.json(template);
    } catch (error) {
        logger.error('Error upgrading template:', error);
        res.status(500).json({ error: 'Error upgrading template to paid' });
    }
};

// Get featured templates
exports.getFeaturedTemplates = async (req, res) => {
    try {
        const cacheKey = 'templates:featured';
        let templates = await cacheService.get(cacheKey);

        if (!templates) {
            templates = await Template.find({ isActive: true, isFeatured: true })
                .select('name category price thumbnailUrl type averageRating')
                .populate('author', 'name')
                .limit(6);

            await cacheService.set(cacheKey, JSON.stringify(templates), 3600);
        } else {
            templates = JSON.parse(templates);
        }

        res.json(templates);
    } catch (error) {
        logger.error('Error fetching featured templates:', error);
        res.status(500).json({ error: 'Error fetching featured templates' });
    }
};

// Get templates by author
exports.getTemplatesByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const templates = await Template.paginate(
            { author: authorId, isActive: true },
            {
                page: parseInt(page),
                limit: parseInt(limit),
                select: 'name category price thumbnailUrl type averageRating createdAt',
                sort: { createdAt: -1 }
            }
        );

        res.json(templates);
    } catch (error) {
        logger.error('Error fetching author templates:', error);
        res.status(500).json({ error: 'Error fetching author templates' });
    }
};

// Increment template downloads
exports.incrementDownloads = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        template.downloads += 1;
        await template.save();

        await cacheService.del(`template:${id}`);
        await analyticsService.trackEvent('template_downloaded', { templateId: id });

        res.json({ downloads: template.downloads });
    } catch (error) {
        logger.error('Error incrementing downloads:', error);
        res.status(500).json({ error: 'Error updating download count' });
    }
};