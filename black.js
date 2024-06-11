const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Tokyo');

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

// 今年/今月/今日の何%が終わったかを計算する関数
function calculatePercentage(today) {
    const thisYear = today.year();
    const startOfYear = dayjs.tz(new Date(thisYear, 0, 1));
    const endOfYear = dayjs.tz(new Date(thisYear, 11, 31));
    const totalYear = endOfYear.diff(startOfYear, 'millisecond');
    const elapsedYear = today.diff(startOfYear, 'millisecond');
    const percentageYear = (elapsedYear / totalYear) * 100;

    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const totalMonthHours = endOfMonth.diff(startOfMonth, 'hour');
    const elapsedMonthHours = today.diff(startOfMonth, 'hour');
    const percentageMonth = (elapsedMonthHours / totalMonthHours) * 100;

    const secondsInDay = today.hour() * 3600 + today.minute() * 60 + today.second();
    const percentageDate = (secondsInDay / 86400) * 100;

    return {
        percentageYear: percentageYear.toFixed(1),
        percentageMonth: percentageMonth.toFixed(1),
        percentageDate: percentageDate.toFixed(1)
    };
}

// 経過率を取得
const percentages = calculatePercentage(today);

// テキストを描画する関数（ローカルフォントを使う）
function drawText(text, x, y) {
    const fontSize = 100; // フォントサイズを100pxに設定
    context.font = `${fontSize}px 'Rounded Mplus 1c'`; // フォントを設定
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle'; // テキストのベースラインを中央に設定
    context.fillText(text, x, y); // テキストを描画
}

// テキストを描画
const centerY = canvas.height / 2;
const textMargin = 200; // テキスト間のマージン

drawText(`今年: ${percentages.percentageYear}%`, canvas.width / 2, centerY - textMargin);
drawText(`今月: ${percentages.percentageMonth}%`, canvas.width / 2, centerY);
drawText(`今日: ${percentages.percentageDate}%`, canvas.width / 2, centerY + textMargin);

// 画像を保存する
const outPath = path.join('images/black.png');
const out = fs.createWriteStream(outPath);
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
  console.log('PNGファイルが作成されました。');
  console.log('保存場所:', outPath);
});
