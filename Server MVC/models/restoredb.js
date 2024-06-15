const { exec } = require('child_process');
const path = require('path');

function restoreDatabase(user, password, database, backupFile, callback) {
    const filePath = path.join(__dirname, '../bin/db-backup', backupFile);
    const passwordPart = password ? `-p${password}` : '';

    const mysqlPath = `"C:\\xampp\\mysql\\bin\\mysql.exe"`; // Đường dẫn tới mysql.exe của bạn
    const command = `${mysqlPath} -u ${user} ${passwordPart} ${database} < "${filePath}"`;

    exec(`cmd.exe /c ${command}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Khôi phục thất bại: ${error.message}`);
            callback(error, null);
            return;
        }
        if (stderr) {
            console.error(`Khôi phục thất bại: ${stderr}`);
            callback(new Error(stderr), null);
            return;
        }
        console.log('Khôi phục cơ sở dữ liệu thành công!');
        callback(null, { type: 'success', text: 'Khôi phục cơ sở dữ liệu thành công!' });
    });
}

module.exports = { restoreDatabase };
