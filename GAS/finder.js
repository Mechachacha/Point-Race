function findAndOutputNumber(sheetName, name) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    return "指定されたシートが見つかりませんでした。";
  }
  
  var data = sheet.getDataRange().getValues();
  
  // 名前が含まれる行を探す
  var rowFound = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] === name) { // B列に名前があると仮定
      rowFound = i;
      break;
    }
  }
  
  // 名前が見つかった場合、その行のL列の値を出力
  if (rowFound !== -1) {
    var number = data[rowFound][11]; // L列の値を取得
    return number;
  } else {
    return 0;
  }
}


//名前出力用
function extractUniqueStringsVertically() {
  var sheetNames = Array.prototype.slice.call(arguments); // 可変長引数を配列に変換
  
  var columnLetter = "B"; // 列Bを指定
  var startRow = 14; // 14行目から開始
  var uniqueStrings = [];
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  for (var i = 0; i < sheetNames.length; i++) {
    var sheetName = sheetNames[i];
    var sheet = spreadsheet.getSheetByName(sheetName);
  
    if (!sheet) {
      return "シート '" + sheetName + "' が見つかりませんでした。";
    }
  
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(startRow, sheet.getRange(columnLetter + startRow).getColumn(), lastRow - startRow + 1);
    var values = range.getValues();
  
    // 列Bの14行目から最後の行までの文字列をuniqueStringsに追加
    for (var j = 0; j < values.length; j++) {
      var cellValue = values[j][0];
      if (cellValue !== "" && uniqueStrings.indexOf(cellValue) === -1) {
        uniqueStrings.push(cellValue);
      }
    }
  }
  
  // 文字列がある場合はuniqueStringsをそのまま返す
  if (uniqueStrings.length > 0) {
    return uniqueStrings;
  } else {
    return "指定されたシートの列Bには文字列がありませんでした。";
  }
}
