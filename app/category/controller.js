const Category = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };
            const category = await Category.find();
            const { name } = req.session.user;

            res.render('admin/category/view_category', {
                category,
                alert,
                username: name,
                title: 'Category',
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },

    viewCreate: async (req, res) => {
        try {
            const { name } = req.session.user;
            res.render('admin/category/create', {
                username: name,
                title: 'Category',
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;

            let category = await Category({ name });
            await category.save();

            req.flash('alertMessage', 'New Category has been created!');
            req.flash('alertStatus', 'success');

            res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            const { name } = req.session.user;
            res.render('admin/category/edit', {
                category,
                title: 'Category',
                username: name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },

    actionUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            await Category.findOneAndUpdate({ _id: id }, { name });

            req.flash('alertMessage', 'Category has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await Category.findByIdAndRemove(id);

            req.flash('alertMessage', 'Category has been deleted!');
            req.flash('alertStatus', 'success');

            res.redirect('/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },
};
