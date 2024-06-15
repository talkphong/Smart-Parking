const { exec } = require('child_process');
const path = require('path');
const moment = require('moment-timezone');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

function backupDatabase(host, user, password, database, callback) {
    const now = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH-mm-ss');
    const fileName = path.join(__dirname, '../bin/db-backup', `backup_${now}.sql`);
    const passwordPart = password ? `-p${password}` : '';

    const mysqldumpPath = `"C:\\xampp\\mysql\\bin\\mysqldump.exe"`;
    const command = `${mysqldumpPath} -h ${host} -u ${user} ${passwordPart} ${database}`;

    exec(`cmd.exe /c ${command} > "${fileName}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Sao lưu thất bại: ${error.message}`);
            callback(error, null);
            //sendEmail('Sao lưu thất bại', `Sao lưu thất bại: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Sao lưu thất bại: ${stderr}`);
            callback(new Error(stderr), null);
            //sendEmail('Sao lưu thất bại', `Sao lưu thất bại: ${stderr}`);
            return;
        }
        console.log('Sao lưu cơ sở dữ liệu thành công!');
        callback(null, { type: 'success', text: 'Sao lưu cơ sở dữ liệu thành công!' });
        //sendEmail('Sao lưu thành công', 'Sao lưu cơ sở dữ liệu thành công!');
    });
}

// Hàm để gửi email thông báo
function sendEmail(subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phat86940@st.vimaru.edu.vn', // Thay bằng email của bạn
            pass: 'csfn zvqm uddh njpw' // Thay bằng mật khẩu ứng dụng bảo mật 2 lớp của google
        }
    });

    let mailOptions = {
        from: 'phat86940@st.vimaru.edu.vn',
        to: 'talkphong@gmail.com', // Thay bằng email của khách hàng
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error(`Không thể gửi email: ${error.message}`);
        } else {
            console.log('Email đã được gửi: ' + info.response);
        }
    });
}

// Hàm để lên lịch sao lưu tự động
function scheduleBackup(host, user, password, database) {
    cron.schedule('30 15 * * *', () => {
        backupDatabase(host, user, password, database, (error, result) => {
            if (error) {
                console.error(`Sao lưu tự động thất bại: ${error.message}`);
                sendEmail('Đây là email tự động về việc sao lưu cơ sở dữ liệu đồ án tự động','Sao lưu cơ sở dữ liệu tự động thất bại!');
                return;
            }
            console.log('Sao lưu tự động cơ sở dữ liệu thành công!');
            sendEmail('Đây là email tự động về việc sao lưu cơ sở dữ liệu tự động','Sao lưu cơ sở dữ liệu tự động thành công!');
        });
    });
}

module.exports = { backupDatabase, scheduleBackup };
