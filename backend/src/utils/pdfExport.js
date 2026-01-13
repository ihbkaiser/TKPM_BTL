/**
 * PDF Export Utility
 * Các hàm tiện ích để xuất dữ liệu ra PDF
 */

const PDFDocument = require('pdfkit');

/**
 * Format currency number
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

/**
 * Tạo PDF document với header và footer
 */
const createPDFDocument = (title) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });
  
  // Header
  doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).font('Helvetica').text(`Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`, { align: 'center' });
  doc.moveDown(2);
  
  return doc;
};

/**
 * Xuất dữ liệu thống kê mua sắm ra PDF
 */
exports.exportPurchaseStatistics = (data) => {
  const doc = createPDFDocument('BÁO CÁO THỐNG KÊ MUA SẮM');
  
  // Summary
  doc.fontSize(14).font('Helvetica-Bold').text('TỔNG QUAN', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica');
  doc.text(`Kỳ báo cáo: ${data.period || 'month'}`);
  doc.text(`Tổng số lượng: ${data.totalItems || 0} kg`);
  doc.text(`Tổng số tiền: ${formatCurrency(data.totalAmount || 0)} VNĐ`);
  doc.moveDown();
  
  // Top items
  if (data.topItems && data.topItems.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('TOP THỰC PHẨM MUA NHIỀU NHẤT', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.topItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.foodItemName || 'N/A'}`, { indent: 20 });
      doc.text(`   Số lượng: ${item.totalQuantity || 0} kg`, { indent: 30 });
      doc.text(`   Tổng tiền: ${formatCurrency(item.totalAmount || 0)} VNĐ`, { indent: 30 });
      doc.moveDown(0.3);
    });
    doc.moveDown();
  }
  
  // By category
  if (data.byCategory && data.byCategory.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('PHÂN BỐ THEO DANH MỤC', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.byCategory.forEach(cat => {
      doc.text(`• ${cat.categoryName || 'Chưa phân loại'}`, { indent: 20 });
      doc.text(`  Số lượng: ${cat.totalQuantity || 0} kg`, { indent: 30 });
      doc.text(`  Tổng tiền: ${formatCurrency(cat.totalAmount || 0)} VNĐ`, { indent: 30 });
      doc.moveDown(0.3);
    });
  }
  
  doc.end();
  return doc;
};

/**
 * Xuất dữ liệu thống kê lãng phí ra PDF
 */
exports.exportWasteStatistics = (data) => {
  const doc = createPDFDocument('BÁO CÁO THỐNG KÊ LÃNG PHÍ');
  
  // Summary
  doc.fontSize(14).font('Helvetica-Bold').text('TỔNG QUAN', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica');
  doc.text(`Tổng số items lãng phí: ${data.totalWastedItems || 0}`);
  doc.text(`Tổng số lượng lãng phí: ${data.totalWastedQuantity || 0} kg`);
  doc.text(`Tổng giá trị lãng phí: ${formatCurrency(data.totalWastedAmount || 0)} VNĐ`);
  doc.moveDown();
  
  // Top wasted items
  if (data.topWastedItems && data.topWastedItems.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('TOP THỰC PHẨM LÃNG PHÍ NHIỀU NHẤT', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.topWastedItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.foodItemName || 'N/A'}`, { indent: 20 });
      doc.text(`   Số lượng: ${item.totalQuantity || 0} kg`, { indent: 30 });
      doc.text(`   Giá trị: ${formatCurrency(item.totalAmount || 0)} VNĐ`, { indent: 30 });
      doc.moveDown(0.3);
    });
    doc.moveDown();
  }
  
  // By category
  if (data.byCategory && data.byCategory.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('LÃNG PHÍ THEO DANH MỤC', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.byCategory.forEach(cat => {
      doc.text(`• ${cat.categoryName || 'Chưa phân loại'}`, { indent: 20 });
      doc.text(`  Số lượng: ${cat.totalQuantity || 0} kg`, { indent: 30 });
      doc.text(`  Giá trị: ${formatCurrency(cat.totalAmount || 0)} VNĐ`, { indent: 30 });
      doc.moveDown(0.3);
    });
  }
  
  doc.end();
  return doc;
};

/**
 * Xuất dữ liệu thống kê tiêu thụ ra PDF
 */
exports.exportConsumptionStatistics = (data) => {
  const doc = createPDFDocument('BÁO CÁO THỐNG KÊ TIÊU THỤ');
  
  // Summary
  doc.fontSize(14).font('Helvetica-Bold').text('TỔNG QUAN', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica');
  doc.text(`Tỷ lệ lãng phí: ${data.wasteRate || 0}%`);
  doc.moveDown();
  
  // Consumption trend (limited to first 20 items to avoid PDF too long)
  if (data.consumptionTrend && data.consumptionTrend.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('XU HƯỚNG TIÊU THỤ THEO THỜI GIAN', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    const displayItems = data.consumptionTrend.slice(0, 20);
    displayItems.forEach(item => {
      doc.text(`Ngày ${item.date || 'N/A'}:`, { indent: 20 });
      doc.text(`  Đã mua: ${item.purchased || 0} kg`, { indent: 30 });
      doc.text(`  Đã tiêu thụ: ${item.used || 0} kg`, { indent: 30 });
      doc.text(`  Đã lãng phí: ${item.wasted || 0} kg`, { indent: 30 });
      doc.moveDown(0.3);
    });
    
    if (data.consumptionTrend.length > 20) {
      doc.moveDown(0.5);
      doc.fontSize(9).font('Helvetica-Oblique').text(`(Hiển thị 20/${data.consumptionTrend.length} mục đầu tiên)`, { indent: 20 });
    }
    doc.moveDown();
  }
  
  // Top consumed items
  if (data.topConsumedItems && data.topConsumedItems.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('TOP THỰC PHẨM TIÊU THỤ NHIỀU NHẤT', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.topConsumedItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.foodItemName || 'N/A'}`, { indent: 20 });
      doc.text(`   Số lần sử dụng: ${item.timesUsed || 0}`, { indent: 30 });
      doc.text(`   Tổng số lượng: ${item.totalQuantity || 0} kg`, { indent: 30 });
      doc.moveDown(0.3);
    });
  }
  
  doc.end();
  return doc;
};

/**
 * Xuất dữ liệu dashboard tổng quan ra PDF
 */
exports.exportDashboardOverview = (data) => {
  const doc = createPDFDocument('BÁO CÁO TỔNG QUAN DASHBOARD');
  
  // Summary
  doc.fontSize(14).font('Helvetica-Bold').text('TỔNG QUAN', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica');
  doc.text(`Tổng số thực phẩm trong tủ lạnh: ${data.totalFridgeItems || 0}`);
  doc.text(`Số thực phẩm sắp hết hạn: ${data.expiringSoon || 0}`);
  doc.text(`Số danh sách mua sắm: ${data.shoppingListCount || 0}`);
  doc.text(`Giảm lãng phí: ${data.wasteReduction || 0}%`);
  doc.moveDown();
  
  // Waste data by month
  if (data.wasteData && data.wasteData.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('LÃNG PHÍ THEO THÁNG (6 THÁNG GẦN NHẤT)', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.wasteData.forEach(item => {
      doc.text(`• ${item.month || 'N/A'}: ${item.waste || 0} kg`, { indent: 20 });
    });
    doc.moveDown();
  }
  
  // Category distribution
  if (data.categoryData && data.categoryData.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('PHÂN BỐ THEO DANH MỤC', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    data.categoryData.forEach(item => {
      doc.text(`• ${item.name || 'Chưa phân loại'}: ${item.value || 0} kg (${item.percentage || 0}%)`, { indent: 20 });
    });
  }
  
  doc.end();
  return doc;
};
