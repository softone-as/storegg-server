module.exports = {
    isAdminLoggedIn: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', `Sorry, your session has expired!`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        } else {
            next();
        }
    },
};
