const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// ローカルフォントを読み込む関数
function loadLocalFont(fontPath, fontFamily) {
    try {
        fs.accessSync(fontPath, fs.constants.R_OK);
        return fontFamily;
    } catch (err) {
        console.error(`Font file "${fontPath}" not found or inaccessible.`);
        return null;
    }
}

// Canvas要素の生成
const canvas = createCanvas(1080, 720);
const context = canvas.getContext('2d');

// ローカルフォントのパスとファミリー名
const fontPath = 'MPLUSRounded1c-Regular.ttf';
const fontFamily = 'Rounded Mplus 1c';

// ローカルフォントを読み込む
const loadedFontFamily = loadLocalFont(fontPath, fontFamily);

// 背景色を設定
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

// 今日の日付を取得
const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = today.getMonth() + 1;
const thisDay = today.getDate();
// 今年/今月/今週/今日の何%が終わったかを計算する関数
function calculatePercentage(year, month, day) {
    const totalYear = new Date(year, 11, 31).getTime() - new Date(year, 0, 1).getTime();
    const totalMonth = new Date(year, month, 0).getDate();
    const totalWeek = Math.ceil((new Date(year, month - 1, totalMonth).getDay() + totalMonth) / 7);
    const totalDay = new Date(year, month - 1, day).getTime() - new Date(year, month - 1, 1).getTime();
    
    const percentageYear = ((today - new Date(year, 0, 1)) / totalYear) * 100;
    const percentageMonth = ((today.getDate() - 1) / totalMonth) * 100;
    const percentageWeek = ((today.getDay() + today.getDate()) / (totalWeek * 7)) * 100;
    const percentageDay = ((today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds()) / 86400) * 100;

    return {
        year: percentageYear.toFixed(1),
        month: percentageMonth.toFixed(1),
        week: percentageWeek.toFixed(1),
        day: percentageDay.toFixed(1)
    };
}

// 今日の経過率を取得
const percentages = calculatePercentage(thisYear, thisMonth, thisDay);

// テキストを描画する関数（ローカルフォントを使う）
function drawText(text, x, y, fontFamily) {
    context.font = `100px 'Rounded Mplus 1c'`; // フォントを設定
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, x, y); // テキストを描画
}

// テキストを描画
drawText(`今年: ${percentages.year}%`, canvas.width / 2, 100, 30);
drawText(`今月: ${percentages.month}%`, canvas.width / 2, 290, 30);
drawText(`今週: ${percentages.week}%`, canvas.width / 2, 480, 30);
drawText(`今日: ${percentages.day}%`, canvas.width / 2, 670, 30);

const outPath = path.join('./rate.png'); // 保存場所のパス
const out = fs.createWriteStream(outPath); // ratio.pngを出力ディレクトリに保存
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
  console.log('PNGファイルが作成されました。');
  console.log('保存場所:', outPath); // 保存場所をコンソールログに表示
});

