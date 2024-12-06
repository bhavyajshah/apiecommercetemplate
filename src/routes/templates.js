const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const cache = require('../middleware/cache');
const { apiLimiter } = require('../middleware/rateLimiter');

// Public routes with caching
router.get('/', cache(3600), templateController.getAllTemplates);
router.get('/:id', cache(3600), templateController.getTemplateById);

// Protected routes
router.use(auth);
router.use(apiLimiter);

router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);
router.post('/:id/restore', admin, templateController.restoreTemplate);
router.post('/:id/upgrade-to-paid', templateController.upgradeToPaid);

module.exports = router;