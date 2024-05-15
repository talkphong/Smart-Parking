exports.isAdmin = (req, res, next) => {
    if (req.session.user == 'Admin') {
        next();
    } else {
        res.send('Access denied');
    }
};

exports.isStaff = (req, res, next) => {
    if (req.session.user == 'Nhân viên' || req.session.user == 'Admin') {
        next();
    } else {
        res.send('Access denied');
    }
};

exports.isClient = (req, res, next) => {
    if (req.session.user == 'Khách hàng' || req.session.user == 'Admin') {
        next();
    } else {
        res.send('Access denied');
    }
};
