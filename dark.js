const dayjs = require('dayjs');

import * as dayjs from 'dayjs'

// 最大値・最小値の計算するための拡張プラグイン
import * as minMax from 'dayjs/plugin/minMax'

// 日本時間に変換する
import 'dayjs/locale/ja'

// プラグイン拡張
dayjs.extend(minMax)
dayjs.locale('ja')

export default dayjs

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// フォントを読み込む
registerFont('fonts/MPLUSRounded1c-Regular.ttf', { family: 'Rounded Mplus 1c' });

// Canvas要素の生成
const canvas = createCanvas(720, 400);
const context = canvas.getContext('2d');

// 背景色を設定
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

// 今日の日付を取得
const today = dayjs();
const thisYear = today.year();
const thisMonth = today.month() + 1;
const thisDay = today.day();
const thisDate = today.date();

// 今年/今月/今週/今日の何%が終わったかを計算する関数
function calculatePercentage(year, month, day, date) {
    const totalYear = dayjs(new Date(year, 11, 31)).diff(dayjs(new Date(year, 0, 1)), 'millisecond');
    const totalMonth = dayjs(new Date(year, month, 0)).date();
    const totalDay = 7;
    
    const percentageYear = ((today - dayjs(new Date(year, 0, 1))) / totalYear) * 100;
    const percentageMonth = ((today.date() - 1) / totalMonth) * 100;
    const percentageWeek = (day / totalDay) * 100;
    const percentageDate = ((today.hour() * 3600 + today.minute() * 60 + today.second()) / 86400) * 100;

    return {
        year: percentageYear.toFixed(1),
        month: percentageMonth.toFixed(1),
        week: percentageWeek.toFixed(1),
        date: percentageDate.toFixed(1)
    };
}

// 経過率を取得
const percentages = calculatePercentage(thisYear, thisMonth, thisDay, thisDate);

// テキストを描画する関数（ローカルフォントを使う）
function drawText(text, x, y, fontFamily) {
    context.font = "100px 'Rounded Mplus 1c'"; // フォントを設定
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, x, y); // テキストを描画
}

// テキストを描画
drawText(`今年: ${percentages.year}%`, canvas.width / 2, 100, 30);
drawText(`今月: ${percentages.month}%`, canvas.width / 2, 180, 30);
drawText(`今日: ${percentages.date}%`, canvas.width / 2, 270, 30);

const outPath = path.join('images/dark.png'); // 保存場所のパス
const out = fs.createWriteStream(outPath); // ratio.pngを出力ディレクトリに保存
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
  console.log('PNGファイルが作成されました。');
  console.log('保存場所:', outPath); // 保存場所をコンソールログに表示
});
