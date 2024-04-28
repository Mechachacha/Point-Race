// トリガーをフォーム入力時に指定して使用すること
function onFormSubmit(e) {
  var formResponse = e.values;
  var sheetName = formResponse[2].replace(/'/g, "'"); // 2つ目の質問で指定されたシートの名前を取得し、シングルクォートをエスケープする
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // 指定された名前のシートが存在しない場合は新しく作成する
    sheet = ss.insertSheet(sheetName);
    sheet.getRange('A1').setValue('タイムスタンプ');
    sheet.getRange('B1').setValue('名前');
  }

  // 最終行の次の行を取得
  var lastRow = sheet.getLastRow();
  var nextRow = lastRow + 1;

  // タイムスタンプをA列に書き込む
  sheet.getRange(nextRow, 1).setValue(formResponse[0]);

  // 名前をB列に書き込む
  sheet.getRange(nextRow, 2).setValue(formResponse[1]);

  // 3つ目以降の回答をカンマで分割してそれぞれの列に書き込む
  var answers = formResponse.slice(3); // 最初の3つの要素はタイムスタンプ、名前、シート名なので除外
  var currentRow = nextRow; // 最終行の次の行から始める
  var currentColumn = 3; // C列から始める

  for (var i = 0; i < answers.length; i++) {
    var splitAnswers = answers[i].split(',');

    for (var j = 0; j < splitAnswers.length; j++) {
      var value = splitAnswers[j];
      
      if (value.includes("特定の文字列")) {
        // 特定の文字列が含まれている場合、次の行にずらす
        currentRow++;
        currentColumn = 3; // C列から再び始める
      } else {
        // 特定の文字列が含まれない場合、セルに値をセット
        sheet.getRange(currentRow, currentColumn).setValue(value);
        currentColumn++;
      }
    }
  }
}
