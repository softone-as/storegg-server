const Transaction = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            const transaction = await Transaction.find().populate('player');
            const { name } = req.session.user;

            res.render('admin/transaction/view_transaction', {
                transaction,
                alert,
                title: 'Transaction',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/transaction');
        }
    },

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.query;
            let transaction = await Transaction.findById(id);
            console.log(
                '🚀 ~ file: controller.js ~ line 31 ~ actionStatus: ~ transaction',
                transaction
            );

            await Transaction.findOneAndUpdate({ _id: id }, { status });

            req.flash('alertMessage', 'Transaction status has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/transaction');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/transaction');
        }
    },
};
