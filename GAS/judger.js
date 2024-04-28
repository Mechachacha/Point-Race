function judger(betsRange, betType) {
    // アクティブなシートを取得
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    //betsRange = "1-3・1-4・1-8・1-10・1-12";
    //betType = "quinellaPlacebox";
  
    // 馬券の組み合わせが記録されているセルの値を取得
    var betsCell = betsRange; // 馬券の組み合わせが記録されているセルから値を取得
    var bets = betsCell.split("・"); // 馬券の組み合わせを配列に分割
    
    // 馬券の組み合わせを判定
    var matchedBets = judgeBets(bets, betType);
    
    // 的中情報をセルに書き込む
    var totalOdds = 0;
    matchedBets.forEach(function(bet) {
      totalOdds += parseFloat(bet.オッズ);
    });
  
    if (matchedBets.length > 0) {
      return totalOdds;
    } else {
      return 0;
    }
  }
  
  function judgeBets(bets, betType) {
  
    // シート内の特定のセルから winningBets のデータを取得
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var winningBetsRange = sheet.getRange("M1:O12");
    var winningBetsData = winningBetsRange.getValues();
  
    var winningBets = [];
    winningBetsData.forEach(function(row) {
      winningBets.push({
        type: row[0],
        combination: row[1],
        odds: row[2]
      });
    });
    
    // 的中した馬券の組み合わせを格納する配列
    var matchedBets = [];
  
    // 的中した馬券の組み合わせと一致するものを検索
    winningBets.forEach(function(winningBet) {
      bets.forEach(function(bet) {
        if (bet === winningBet.combination && winningBet.type === betType) {
          // 一致した組み合わせがすでに存在しない場合に追加
          if (!matchedBets.some(function(matchedBet) {
            return matchedBet.種類 === winningBet.type && matchedBet.組み合わせ === winningBet.combination;
          })) {
            matchedBets.push({
              種類: winningBet.type,
              組み合わせ: winningBet.combination,
              オッズ: winningBet.odds
            });
          }
        }
        // 追加の処理: quinellaPlacebox, quinellabox, triobox の場合
        else if ((betType === "quinellaPlacebox" && winningBet.type === "quinellaPlace") ||
                 (betType === "quinellabox" && winningBet.type === "quinella") ||
                 (betType === "triobox" && winningBet.type === "trio") ||
                 (betType === "bracketQuinellabox" && winningBet.type === "bracketQuinella")) {
          var betParts = bet.split("-");
          var winningBetParts = winningBet.combination.split("-");
          if (betParts.every(part => winningBetParts.includes(part))) {
            // 一致した組み合わせがすでに存在しない場合に追加
            if (!matchedBets.some(function(matchedBet) {
              return matchedBet.種類 === winningBet.type && matchedBet.組み合わせ === winningBet.combination;
            })) {
              matchedBets.push({
                種類: winningBet.type,
                組み合わせ: winningBet.combination,
                オッズ: winningBet.odds
              });
            }
          }
        }
        // "winPlace"の場合、"win"と"place"の両方を判定する
        else if (betType === "winPlace") {
          // "win"の判定
          if (bet === winningBet.combination && winningBet.type === "win") {
            if (!matchedBets.some(function(matchedBet) {
              return matchedBet.種類 === winningBet.type && matchedBet.組み合わせ === winningBet.combination;
            })) {
              matchedBets.push({
                種類: winningBet.type,
                組み合わせ: winningBet.combination,
                オッズ: winningBet.odds
              });
            }
          }
          // "place"の判定
          else if (bet === winningBet.combination && winningBet.type === "place") {
            if (!matchedBets.some(function(matchedBet) {
              return matchedBet.種類 === winningBet.type && matchedBet.組み合わせ === winningBet.combination;
            })) {
              matchedBets.push({
                種類: winningBet.type,
                組み合わせ: winningBet.combination,
                オッズ: winningBet.odds
              });
            }
          }
        }
      });
    });
  
    // 一致した組み合わせを戻り値として返す
    return matchedBets;
  }
  
