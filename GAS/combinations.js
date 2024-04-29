function pairCheck(umaRange, umbRange, umcRange, betType) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // シートから値を読み取る
  var umaValues = parseValues(umaRange); // "uma" の値
  var umbValues = parseValues(umbRange); // "umb" の値
  var umcValues = parseValues(umcRange); // "umc" の値
  
  // 各種変数の初期化
  var aa = bb = cc = ab = bc = ac = abc = oa = ob = oc = oab = obc = oac = oabc = wa = wb = wk = wab = 0;
  
  // チェックボックスの状態に基づいて計算を行う
  for (var i = 0; i < 18; i++) {
    if (umaValues[i] == true) { aa++; }
    if (umbValues[i] == true) { bb++; }
    if (umcValues[i] == true) { cc++; }
    
    // ab, bc, ac, abcを計算
    ab += (umaValues[i] == true && umbValues[i] == true) ? 1 : 0;
    bc += (umbValues[i] == true && umcValues[i] == true) ? 1 : 0;
    ac += (umaValues[i] == true && umcValues[i] == true) ? 1 : 0;
    abc += (umaValues[i] == true && umbValues[i] == true && umcValues[i] == true) ? 1 : 0;
  }
  //枠連時の処理
  for (var i = 0; i < 8; i++) {
    if (umaValues[i] == true) { wa++; }
    if (umbValues[i] == true) { wb++; }
    if(umaValues[i] == umbValues[i]){ wk++; }
    if(umaValues[i] == umbValues[i]){ wab++; }
  }

  // その他の計算
  oa = aa - ab - ac + abc;
  ob = bb - ab - bc + abc;
  oc = cc - bc - ac + abc;
  oab = ab - abc;
  obc = bc - abc;
  oac = ac - abc;
  oabc = abc;
  
  // フォーメーション組数計算
  var wakuren = wa * wb - wab - wab * (wab - 1) / 2 + wk;
  var umaren = aa * bb - ab - ab * (ab - 1) / 2;
  var umatan = aa * bb - ab;
  var sanfuku = oa * ((oab + ob) * (obc + oc + oac + oabc) + obc * (oc + oac) + oabc * (obc + oc + oac) + obc * (obc - 1) / 2 + oabc * (oabc - 1) / 2) + oab * (ob * (obc + oc + oac + oabc) + obc * (oc + oac + oabc) + oabc * (oc + oac) + obc * (obc - 1) / 2 + oabc * (oabc - 1) / 2) + oab * (oab - 1) / 2 * (obc + oc + oac + oabc) + oac * (ob * (obc + oc + oabc) + obc * (oc + oabc) + oc * (oab + oabc) + obc * (obc - 1) / 2 + oabc * (oabc - 1) / 2) + oac * (oac - 1) / 2 * (oab + ob + obc + oabc) + oabc * (ob * (obc + oc) + obc * oc + obc * (obc - 1) / 2) + oabc * (oabc - 1) / 2 * (ob + obc + oc) + oabc * (oabc - 1) * (oabc - 2) / 6;
  var santan = aa * bb * cc - (cc * ab + bb * ac + aa * bc) + abc * 2;

  var sumforbox = parseValuesLegacy(umaRange);

  var umarenbox = combination(sumforbox, 2);
  var sanfukubox = combination(sumforbox, 3);
  

  switch (betType) {
    case "win":
    case "place":
      return aa;
    case "winPlace":
      return aa*2;
    case "quinella":
    case "quinellaPlace":
      return umaren;
    case "bracketQuinella":
      return wakuren;
    case "exacta":
      return umatan;
    case "trio":
      return sanfuku;
    case "trifecta":
      return santan;
    case "quinellabox":
    case "quinellaPlacebox":
    case "bracketQuinellabox":
      return umarenbox;
    case "triobox":
      return sanfukubox;
    default:
      return "Invalid BetType";
  }
  
  
  //return umaValues;
}

// セルから値を読み取り、数字の配列を返す関数

function allpairs(arrayrange1, arrayrange2, arrayrange3,betType) {

  //arrayrange1 = "1・3";
  //arrayrange2 = "1・2・5";
  //arrayrange3 = "2・4";
  //betType = 


    const array1 = parseValuesJustlengh(arrayrange1).sort((a, b) => a - b);
    const array2 = parseValuesJustlengh(arrayrange2).sort((a, b) => a - b);
    const array3 = parseValuesJustlengh(arrayrange3).sort((a, b) => a - b);

    // 新しいリストを初期化する
    var combinations = [];

    // 重複を防ぐための組み合わせのセットを初期化する
    var combinationSet = new Set();

    // ネストされたループを使用して組み合わせを生成する
    if (betType === "win" || betType === "place" || betType === "winPlace") {
        if (array1.length === 1) {
            combinations.push(array1[0]);
        } else {
            combinations = array1;
        }
    } else if (betType === "exacta") {
        if (array1.length === 1 && array2.length === 1) {
            combinations.push(array1[0] + ">" + array2[0]);
        } else {
            for (let i = 0; i < array1.length; i++) {
                for (let j = 0; j < array2.length; j++) {
                    if (array1[i] !== array2[j]) {
                        combinations.push(array1[i] + ">" + array2[j]);
                    }
                }
            }
        }
    } else if (betType === "quinella" || betType === "quinellaPlace") {
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                if (array1[i] !== array2[j]) { // M ≠ N の場合のみ処理する
                    const firstNumber = Math.min(array1[i], array2[j]);
                    const secondNumber = Math.max(array1[i], array2[j]);
                    const combination = firstNumber + "-" + secondNumber;
                    if (!combinationSet.has(combination)) {
                        combinations.push(combination);
                        combinationSet.add(combination);
                    }
                }
            }
        }
    } else if (betType === "bracketQuinella") {
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                
                    const firstNumber = Math.min(array1[i], array2[j]);
                    const secondNumber = Math.max(array1[i], array2[j]);
                    const combination = firstNumber + "-" + secondNumber;
                    if (!combinationSet.has(combination)) {
                        combinations.push(combination);
                        combinationSet.add(combination);
                    }
                
            }
        }
    } else if (betType === "quinellaPlacebox" || betType === "quinellabox" || betType === "bracketQuinellabox") {
        for (let i = 0; i < array1.length; i++) {
            for (let j = i + 1; j < array1.length; j++) {
                combinations.push(array1[i] + "-" + array1[j]);
            }
        }
    } else if (betType === "trifecta") {
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < (array2.length || 1); j++) {
                for (let k = 0; k < (array3.length || 1); k++) {
                    if (array1[i] === array2[j] || array1[i] === array3[k] || (array2[j] && array2[j] === array3[k])) {
                        continue;
                    }
                    // 現在の組み合わせを作成して新しいリストに追加する
                    const combination = [array1[i], array2[j], array3[k]].filter(Boolean).join('>'); // 数字を>で区切って文字列にする
                    combinations.push(combination);
                }
            }
        }
    } else if (betType === "trio") {
        // trifectaと同様の組み合わせを生成
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < (array2.length || 1); j++) {
                for (let k = 0; k < (array3.length || 1); k++) {
                    if (array1[i] === array2[j] || array1[i] === array3[k] || (array2[j] && array2[j] === array3[k])) {
                        continue;
                    }
                    // 現在の組み合わせを作成して新しいリストに追加する
                    const combination = [array1[i], array2[j], array3[k]].filter(Boolean).join('-'); // 数字を-で区切って文字列にする
                    combinations.push(combination);
                }
            }
        }
        // M-N-Oの組み合わせが出力された際に、M、N、Oの3つに出てくる数字の組み合わせが同じものが存在する場合、数字が小さい方のみをcombinationsに挿入する
        const sortedCombinations = combinations.map(combination => {
            const numbers = combination.split('-').map(Number);
            numbers.sort((a, b) => a - b);
            return numbers.join('-');
        });
        const uniqueCombinations = [...new Set(sortedCombinations)];
        combinations = uniqueCombinations;
    } else if (betType === "triobox") {
        for (let i = 0; i < array1.length; i++) {
            for (let j = i + 1; j < array1.length; j++) {
                for (let k = j + 1; k < array1.length; k++) {
                    combinations.push(array1[i] + "-" + array1[j] + "-" + array1[k]);
                }
            }
        }
    }

  if(Array.isArray(combinations)){
    const jcombinations = combinations.join('・')
    return(jcombinations);
  } else{
    return(combinations);
  }

  /*if(Array.isArray(array2)){
    const jcombinations = array2.join('・');
    return jcombinations;
  } else{
    return(array2);
  }
  */
}

//以下、副次的な関数

function parseValues(cellValue) {
  var parsedValues = [];
  
  // cellValue が文字列でない場合は、そのまま返す
  if (typeof cellValue !== "string") {
    parsedValues[cellValue - 1] = true;
    return parsedValues;
  }
  var values = cellValue.split("・"); // ・で区切る
  var parsedValues = [];
  for (var i = 0; i < values.length; i++) {
    parsedValues[parseInt(values[i]) - 1] = true; // 数字に変換して配列に挿入
  }
  return parsedValues;
}

function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function combination(n, r) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function parseValuesLegacy(cellValue) {
  if (!isNaN(cellValue)) {
        return [cellValue];
    }
  
  var values = cellValue.split("・"); // ・で区切る
  return values.length;
}

function parseValuesJustlengh(cellValue) {
  if (typeof cellValue !== "string") {
    return [cellValue.toString()]; // 文字列でない場合はcellValueを返す
  }
  
  var values = cellValue.split("・"); // ・で区切る
  return values || []; // 配列が空の場合は空の配列を返す
}
