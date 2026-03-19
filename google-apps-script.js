// ============================================
// PASTE THIS ENTIRE SCRIPT INTO GOOGLE APPS SCRIPT
// ============================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var type = data.type; // 'entries' or 'codes'
    
    if (type === 'entries') {
      var sheet = ss.getSheetByName('New Items') || ss.insertSheet('New Items');
      // Clear and write headers
      sheet.clear();
      sheet.appendRow(['Barcode (UPC)', 'Item Name', 'Dept #', 'Department Name', 'Base Price', 'Customer Pays', 'Taxed', 'Age Check', 'Date Added']);
      // Bold headers
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      // Write data
      var items = data.items;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        sheet.appendRow([it.u, it.n, it.dn, it.d || '', it.bp, it.cp, it.tx ? 'Yes' : 'No', it.ac ? 'Yes' : 'No', new Date(it.ts)]);
      }
      // Auto resize columns
      for (var c = 1; c <= 9; c++) sheet.autoResizeColumn(c);
      
    } else if (type === 'codes') {
      var sheet = ss.getSheetByName('Barcodes') || ss.insertSheet('Barcodes');
      sheet.clear();
      sheet.appendRow(['Barcode', 'In Database', 'Item Name', 'Department', 'Date Scanned']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      var items = data.items;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        sheet.appendRow([it.c, it.inDb ? 'Yes' : 'No', it.name || '', it.dept || '', new Date(it.ts)]);
      }
      for (var c = 1; c <= 5; c++) sheet.autoResizeColumn(c);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'ok', count: data.items.length}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// This handles the preflight request from browsers
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok', message: 'PriceCheck sync endpoint ready'}))
    .setMimeType(ContentService.MimeType.JSON);
}
