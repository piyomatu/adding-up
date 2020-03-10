'use strict';
//require("fs"); → FileSystem（ファイルシステム）の要求(呼び出し)
const fs = require("fs");
//require("readline"); → ファイルを一行ずつ読み込むためのモジュール
const readline = require("readline");
const rs = fs.createReadStream("./popu-pref.csv");

const rl = readline.createInterface({ "input": rs, "output": {} });
//new Map();→ keyとvalueを入れた配列が作れる
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェク


rl.on("line", (lineString) => {
    const columns = lineString.split(",");
    //parseInt →　String();的な数値を文字列として出力する
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }

        if (year === 2010){
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
        /*console.log(year);
        console.log(prefecture);
        console.log(popu);*/
    }


    //console.log(lineString);

});

rl.on("close", () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    //prefectureDataMap(連想配列)→ 普通配列Arrayに変換

    const rankingArray = Array.from(prefectureDataMap).sort(
        (pair1, pair2)  => {
        return pair2[1].change - pair1[1].change;
        /*
            if (a > b){} else if ..と同意味
        */ 
    })

    const rankingString = rankingArray.map(([key, value]) => {
        return key + ": " + value.popu10 + " => " + value.popu15 + " 変化率:" + value.change
    });

    console.log(rankingString);
});