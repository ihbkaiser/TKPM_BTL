/**
 * Export Routes
 * Các endpoint để xuất báo cáo CSV và PDF
 */

const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { ROLES } = require('../config/roles');
const { attachViewContext } = require('../middleware/view.middleware');

// Tất cả routes đều cần authentication
router.use(auth, attachViewContext, authorize(ROLES.USER, ROLES.HOMEMAKER));

// Purchase statistics export
router.get('/purchases/csv', exportController.exportPurchaseStatisticsCSV);
router.get('/purchases/pdf', exportController.exportPurchaseStatisticsPDF);

// Waste statistics export
router.get('/waste/csv', exportController.exportWasteStatisticsCSV);
router.get('/waste/pdf', exportController.exportWasteStatisticsPDF);

// Consumption statistics export
router.get('/consumption/csv', exportController.exportConsumptionStatisticsCSV);
router.get('/consumption/pdf', exportController.exportConsumptionStatisticsPDF);

// Dashboard overview export
router.get('/dashboard/csv', exportController.exportDashboardOverviewCSV);
router.get('/dashboard/pdf', exportController.exportDashboardOverviewPDF);

module.exports = router;
