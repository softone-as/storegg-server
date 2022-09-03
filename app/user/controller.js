const User = require('./model');
const bcrypt = require('bcryptjs');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            if (req.session.user === null || req.session.user === undefined) {
                res.render('admin/user/view_sign-in', { alert });
            } else {
                res.redirect('/dashboard');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/user');
        }
    },

    actionSignIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (user) {
                if (user.status === 'Y') {
                    const checkPassword = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (checkPassword) {
                        req.session.user = {
                            id: user._id,
                            email: user.email,
                            status: user.status,
                            name: user.name,
                        };
                        res.redirect('/dashboard');
                    } else {
                        req.flash('alertMessage', `Invalid password!`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/');
                    }
                } else {
                    req.flash(
                        'alertMessage',
                        `Sorry, you're not activated yet!`
                    );
                    req.flash('alertStatus', 'danger');
                    res.redirect('/');
                }
            } else {
                req.flash('alertMessage', `Invalid Email!`);
                req.flash('alertStatus', 'danger');
                res.redirect('/');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    },

    actionSignOut: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },
};
