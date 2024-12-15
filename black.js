const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Tokyo');

registerFont('fonts/MPLUSRounded1c-Regular.ttf', { family: 'Rounded Mplus 1c' });

const canvas = createCanvas(720, 600);
const context = canvas.getContext('2d');

context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

const today = dayjs.tz();

function calc_percentage(today) {
    const this_year = today.year();
    const start_of_year = dayjs.tz(new Date(this_year, 0, 1));
    const end_of_year = dayjs.tz(new Date(this_year, 11, 31));
    const total_year = end_of_year.diff(start_of_year, 'millisecond');
    const elapsed_year = today.diff(start_of_year, 'millisecond');
    const percentage_year = (elapsed_year / total_year) * 100;

    const start_of_month = today.startOf('month');
    const end_of_month = today.endOf('month');
    const total_month_hours = end_of_month.diff(start_of_month, 'hour');
    const elapsed_month_hours = today.diff(start_of_month, 'hour');
    const percentage_month = (elapsed_month_hours / total_month_hours) * 100;

    const seconds_in_day = today.hour() * 3600 + today.minute() * 60 + today.second();
    const percentage_date = (seconds_in_day / 86400) * 100;

    return {
        percentage_year: percentage_year.toFixed(1),
        percentage_month: percentage_month.toFixed(1),
        percentage_date: percentage_date.toFixed(1)
    };
}

const percentages = calc_percentage(today);

function draw_text(text, x, y, context, font_size = 100, align = 'center') {
    context.font = `${font_size}px 'Rounded Mplus 1c'`;
    context.fillStyle = 'white';
    context.textAlign = align; // テキスト揃えを設定
    context.textBaseline = 'middle';
    context.fillText(text, x, y);
}

const center_y = canvas.height / 2;
const text_margin = 200;

draw_text(`今年: ${percentages.percentage_year}%`, canvas.width / 2, center_y - text_margin, context);
draw_text(`今月: ${percentages.percentage_month}%`, canvas.width / 2, center_y, context);
draw_text(`今日: ${percentages.percentage_date}%`, canvas.width / 2, center_y + text_margin, context);

const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
const margin = 20;
draw_text(`Generated time: ${now} (UTC+9)`, canvas.width - margin, canvas.height - margin, context, 20, 'right');

const out_path = path.join('images/black.png');
const out = fs.createWriteStream(out_path);
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
    console.log('Generated png file.');
    console.log('Location:', out_path);
});
