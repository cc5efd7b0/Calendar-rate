// Canvas要素の生成
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 720;
const context = canvas.getContext('2d');

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
function drawTextWithLocalFont(text, x, y, fontFamily) {
    context.font = `100px '${fontFamily}'`; // フォントを設定
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, x, y); // テキストを描画
}

// テキストを描画
drawTextWithLocalFont(`今年: ${percentages.year}%`, canvas.width / 2, 100, 'Rounded Mplus 1c');
drawTextWithLocalFont(`今月: ${percentages.month}%`, canvas.width / 2, 290, 'Rounded Mplus 1c');
drawTextWithLocalFont(`今週: ${percentages.week}%`, canvas.width / 2, 480, 'Rounded Mplus 1c');
drawTextWithLocalFont(`今日: ${percentages.day}%`, canvas.width / 2, 670, 'Rounded Mplus 1c');

// Canvasをページに表示する
document.body.appendChild(canvas);

// Canvasから画像データを取得し、それをファイルとして保存
canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    
    // ダウンロード用のリンクを作成
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'calendar.jpg';
    
    // ダウンロードリンクをクリックして自動的にダウンロードを開始
    downloadLink.click();
    
    // 使用したURLを解放する
    URL.revokeObjectURL(url);
}, 'image/jpeg', 0.9); // 画像の形式と品質を指定
