var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database');

router.get('/', authMiddleware.isAdmin, async (req, res) => {
    const year = new Date().getFullYear(); // Năm hiện tại

    try {
        const vaoQuery = `
            SELECT YEAR(thoigianmo) AS nam, MONTH(thoigianmo) AS thang, COUNT(*) AS so_luot_vao
            FROM lichsu
            WHERE YEAR(thoigianmo) = ? AND id_cong = 1
            GROUP BY nam, thang
            ORDER BY nam, thang
        `;

        const raQuery = `
            SELECT YEAR(thoigianmo) AS nam, MONTH(thoigianmo) AS thang, COUNT(*) AS so_luot_ra
            FROM lichsu
            WHERE YEAR(thoigianmo) = ? AND id_cong = 2
            GROUP BY nam, thang
            ORDER BY nam, thang
        `;

        const taotheQuery = `
            SELECT YEAR(ngaytaothe) AS nam, MONTH(ngaytaothe) AS thang, COUNT(*) AS so_luot_tao_the
            FROM the
            WHERE YEAR(ngaytaothe) = ?
            GROUP BY nam, thang
            ORDER BY nam, thang
        `;

        const doanhthuvanglaiQuery = `
            SELECT YEAR(thoigianmo) AS nam, MONTH(thoigianmo) AS thang, COUNT(*) AS so_luot_vao_vang_lai
            FROM lichsu LEFT JOIN the
            ON lichsu.sothe = the.sothe
            WHERE YEAR(thoigianmo) = ? AND id_cong = 1 AND the.loaithe LIKE 'Thẻ vãng lai'
            GROUP BY nam, thang
            ORDER BY nam, thang
        `;

        const vaoResults = Array(12).fill(0);
        const raResults = Array(12).fill(0);
        const taotheResults = Array(12).fill(0);
        const doanhthuvanglaiResults = Array(12).fill(0);

        db.query(vaoQuery, [year], (vaoErr, vaoData) => {
            if (vaoErr) {
                console.error('Database query error (vao): ', vaoErr);
                res.status(500).send('Internal Server Error');
                return;
            }

            vaoData.forEach(result => {
                vaoResults[result.thang - 1] = result.so_luot_vao;
            });

            db.query(raQuery, [year], (raErr, raData) => {
                if (raErr) {
                    console.error('Database query error (ra): ', raErr);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                raData.forEach(result => {
                    raResults[result.thang - 1] = result.so_luot_ra;
                });

                db.query(taotheQuery, [year], (taotheErr, taotheData) => {
                    if (taotheErr) {
                        console.error('Database query error (taothe): ', taotheErr);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    taotheData.forEach(result => {
                        taotheResults[result.thang - 1] = result.so_luot_tao_the;
                    });

                    db.query(doanhthuvanglaiQuery, [year], (doanhthuvanglaiErr, doanhthuvanglaiData) => {
                        if (doanhthuvanglaiErr) {
                            console.error('Database query error (doanhthuvanglai): ', doanhthuvanglaiErr);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        doanhthuvanglaiData.forEach(result => {
                            doanhthuvanglaiResults[result.thang - 1] = result.so_luot_vao_vang_lai * 5000;
                        });

                        res.render('thongke', {
                            year: year,
                            vaoResults: vaoResults,
                            raResults: raResults,
                            taotheResults: taotheResults,
                            doanhthuvanglaiResults: doanhthuvanglaiResults
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
