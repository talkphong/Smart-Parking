exports.isAdmin = (req, res, next) => {
    if (req.session.user.phanquyen == 'admin') {
        next();
    } else {
        res.send('Access denied');
    }
};

exports.isStaff = (req, res, next) => {
    if (req.session.user.phanquyen == 'nhanvien' || req.session.user.phanquyen == 'admin') {
        next();
    } else {
        res.send('Access denied');
    }
};

exports.isClient = (req, res, next) => {
    if (req.session.user.phanquyen == 'khachhang' || req.session.user.phanquyen == 'admin') {
        next();
    } else {
        res.send('Access denied');
    }
};
