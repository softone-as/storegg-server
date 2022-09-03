const Nominal = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            const nominal = await Nominal.find();
            const { name } = req.session.user;

            res.render('admin/nominal/view_nominal', {
                nominal,
                alert,
                title: 'Nominal',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/nominal');
        }
    },

    viewCreate: async (req, res) => {
        try {
            const { name } = req.session.user;
            res.render('admin/nominal/create', {
                title: 'Nominal',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/nominal');
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { coinQuantity, coinName, price } = req.body;

            let nominal = await Nominal({ coinQuantity, coinName, price });
            await nominal.save();

            req.flash('alertMessage', 'New Nominal has been created!');
            req.flash('alertStatus', 'success');

            res.redirect('/nominal');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/nominal');
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const nominal = await Nominal.findById(id);
            const { name } = req.session.user;
            res.render('admin/nominal/edit', {
                nominal,
                title: 'Nominal',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/nominal');
        }
    },

    actionUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { coinQuantity, coinName, price } = req.body;

            await Nominal.findOneAndUpdate(
                { _id: id },
                {
                    coinQuantity,
                    coinName,
                    price,
                }
            );

            req.flash('alertMessage', 'Nominal has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/nominal');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/nominal');
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await Nominal.findByIdAndRemove(id);

            req.flash('alertMessage', 'Nominal has been deleted!');
            req.flash('alertStatus', 'success');

            res.redirect('/nominal');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/nominal');
        }
    },
};
