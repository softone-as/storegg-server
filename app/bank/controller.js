const Bank = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            const bank = await Bank.find();

            res.render('admin/bank/view_bank', { bank, alert });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },

    viewCreate: async (req, res) => {
        try {
            res.render('admin/bank/create');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { name, username, accountNumber } = req.body;

            let bank = await Bank({ name, username, accountNumber });
            await bank.save();

            req.flash('alertMessage', 'New bank has been created!');
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findById(id);

            res.render('admin/bank/edit', { bank });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },

    actionUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, username, accountNumber } = req.body;

            await Bank.findOneAndUpdate(
                { _id: id },
                {
                    name,
                    username,
                    accountNumber,
                }
            );

            req.flash('alertMessage', 'Bank has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await Bank.findByIdAndRemove(id);

            req.flash('alertMessage', 'Bank has been deleted!');
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
};
