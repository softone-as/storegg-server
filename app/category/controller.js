const Category = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const category = await Category.find();
            res.render('admin/category/view_category', { category });
        } catch (error) {
            console.log(error);
        }
    },

    viewCreate: async (req, res) => {
        try {
            res.render('admin/category/create');
        } catch (error) {
            console.log(error);
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;

            let category = await Category({ name });
            await category.save();

            res.redirect('/category');
        } catch (error) {
            console.log(error);
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);

            res.render('admin/category/edit', { category });
        } catch (error) {
            console.log(error);
        }
    },

    actionUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            await Category.findOneAndUpdate(id, { name });
            res.redirect('/category');
        } catch (error) {
            console.log(error);
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await Category.findByIdAndRemove(id);
            res.redirect('/category');
        } catch (error) {
            console.log(error);
        }
    },
};
