const { createCanvas } = require('canvas');
const fs = require('fs');

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

if (loadedFontFamily) {
    // テキストを描画する関数
    function drawText(text, x, y, fontFamily) {
        context.font = `100px '${fontFamily}'`; // フォントを設定
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, x, y); // テキストを描画
    }

    // 背景色を白に設定
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 今日の日付を取得
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;
    const thisDay = today.getDate();

    // 今年/今月/今週/今日の何%が終わったかを計算する関数
    function calculatePercentage(year, month, day) {
        // 省略
    }

    // 今日の経過率を取得
    const percentages = calculatePercentage(thisYear, thisMonth, thisDay);

    // テキストを描画
    drawText(`今年: ${percentages.year}%`, canvas.width / 2, 100, loadedFontFamily);
    drawText(`今月: ${percentages.month}%`, canvas.width / 2, 290, loadedFontFamily);
    drawText(`今週: ${percentages.week}%`, canvas.width / 2, 480, loadedFontFamily);
    drawText(`今日: ${percentages.day}%`, canvas.width / 2, 670, loadedFontFamily);

    // 画像を保存
    const out = fs.createWriteStream(__dirname + '/calendar.jpg');
    const stream = canvas.createJPEGStream({ quality: 0.9 });
    stream.pipe(out);
    out.on('finish', () => console.log('The JPEG file was created.'));
}
