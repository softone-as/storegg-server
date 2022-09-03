const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            const payment = await Payment.find().populate('banks');
            const { name } = req.session.user;

            res.render('admin/payment/view_payment', {
                payment,
                alert,
                title: 'Payment',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },

    viewCreate: async (req, res) => {
        try {
            const banks = await Bank.find();
            const { name } = req.session.user;
            res.render('admin/payment/create', {
                banks,
                title: 'Payment',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { type, banks } = req.body;

            let payment = await Payment({ type, banks });
            await payment.save();

            req.flash('alertMessage', 'New payment has been created!');
            req.flash('alertStatus', 'success');

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const payment = await Payment.findById(id).populate('banks');
            const bank = await Bank.find();
            const { name } = req.session.user;

            res.render('admin/payment/edit', {
                payment,
                bank,
                title: 'Payment',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },

    actionUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { type, banks } = req.body;

            await Payment.findOneAndUpdate(
                { _id: id },
                {
                    type,
                    banks,
                }
            );

            req.flash('alertMessage', 'Payment has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await Payment.findByIdAndRemove(id);

            req.flash('alertMessage', 'Payment has been deleted!');
            req.flash('alertStatus', 'success');

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            let payment = await Payment.findById(id);

            let status = payment.status === 'Y' ? 'N' : 'Y';

            await Payment.findOneAndUpdate({ _id: id }, { status });

            req.flash('alertMessage', 'Payment status has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/payment');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },
};
