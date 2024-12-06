const Template = require('../models/Template');
const { validateTemplate } = require('../validators/templateValidator');
const analyticsService = require('../services/analytics');
const cacheService = require('../services/cache');
const logger = require('../utils/logger');

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
            search
        } = req.query;

        const query = {};
        if (category) query.category = category;
        if (status) query.type = status;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            populate: {
                path: 'author',
                select: 'name email'
            }
        };

        const templates = await Template.paginate(query, options);
        res.json(templates);
    } catch (error) {
        logger.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Error fetching templates' });
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `template:${id}`;

        let template = await cacheService.get(cacheKey);

        if (!template) {
            template = await Template.findById(id)
                .populate('author', 'name email')
                .populate({
                    path: 'reviews',
                    populate: { path: 'user', select: 'name' }
                });

            if (!template) {
                return res.status(404).json({ error: 'Template not found' });
            }

            await cacheService.set(cacheKey, template);
            analyticsService.trackEvent('template_view', { templateId: id });
        }

        res.json(template);
    } catch (error) {
        logger.error('Error fetching template:', error);
        res.status(500).json({ error: 'Error fetching template details' });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const validationResult = validateTemplate(req.body);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message });
        }

        const template = new Template({
            ...req.body,
            author: req.user._id
        });

        await template.save();
        await cacheService.clearPattern('templates:*');

        res.status(201).json(template);
    } catch (error) {
        logger.error('Error creating template:', error);
        res.status(500).json({ error: 'Error creating template' });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const validationResult = validateTemplate(req.body, true);
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

        Object.assign(template, req.body);
        template.lastUpdated = new Date();
        await template.save();

        await cacheService.del(`template:${id}`);
        await cacheService.clearPattern('templates:*');

        res.json(template);
    } catch (error) {
        logger.error('Error updating template:', error);
        res.status(500).json({ error: 'Error updating template' });
    }
};

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

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        logger.error('Error deleting template:', error);
        res.status(500).json({ error: 'Error deleting template' });
    }
};

exports.restoreTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to restore templates' });
        }

        template.isActive = true;
        template.deletedAt = null;
        await template.save();

        await cacheService.del(`template:${id}`);
        await cacheService.clearPattern('templates:*');

        res.json({ message: 'Template restored successfully' });
    } catch (error) {
        logger.error('Error restoring template:', error);
        res.status(500).json({ error: 'Error restoring template' });
    }
};

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

        res.json(template);
    } catch (error) {
        logger.error('Error upgrading template:', error);
        res.status(500).json({ error: 'Error upgrading template to paid' });
    }
};