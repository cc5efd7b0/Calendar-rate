const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault("Asia/Tokyo")

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// フォントを読み込む
registerFont('fonts/MPLUSRounded1c-Regular.ttf', { family: 'Rounded Mplus 1c' });

// Canvas要素の生成
const canvas = createCanvas(720, 600);
const context = canvas.getContext('2d');

// 背景色を設定
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

// 今日の日付を取得
const today = dayjs.tz();
const thisYear = today.year();
const thisMonth = today.month();
const thisDate = today.date();

// 今年/今月/今日の何%が終わったかを計算する関数
function calculatePercentage(year, month, date) {
    const totalYear = dayjs.tz(new Date(year, 11, 31)).diff(dayjs.tz(new Date(year, 0, 1)), 'millisecond');
    const totalMonth = dayjs.tz(new Date(year, month, 0)).date();
    const totalDay = 7;
    
    const percentageYear = ((today - dayjs.tz(new Date(year, 0, 1))) / totalYear) * 100;
    const percentageMonth = ((today.date()) / (today.daysInMonth())) * 100;
    const percentageDate = ((today.hour() * 3600 + today.minute() * 60 + today.second()) / 86400) * 100;

    return {
        year: percentageYear.toFixed(1),
        month: percentageMonth.toFixed(1),
        date: percentageDate.toFixed(1)
    };
}

// 経過率を取得
const percentages = calculatePercentage(thisYear, thisMonth, thisDate);

// テキストを描画する関数（ローカルフォントを使う）
function drawText(text, x, y, fontFamily) {
    context.font = "100px 'Rounded Mplus 1c'"; // フォントを設定
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, x, y); // テキストを描画
}

// テキストを描画
drawText(`今年: ${percentages.year}%`, canvas.width / 2, 100);
drawText(`今月: ${percentages.month}%`, canvas.width / 2, 300);
drawText(`今日: ${percentages.date}%`, canvas.width / 2, 500);

const outPath = path.join('images/dark.png'); // 保存場所のパス
const out = fs.createWriteStream(outPath); // ratio.pngを出力ディレクトリに保存
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
  console.log('PNGファイルが作成されました。');
  console.log('保存場所:', outPath); // 保存場所をコンソールログに表示
});
