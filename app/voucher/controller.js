const Voucher = require('./model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            const voucher = await Voucher.find()
                .populate('category')
                .populate('nominals');
            const { name } = req.session.user;

            res.render('admin/voucher/view_voucher', {
                voucher,
                alert,
                username: name,
                title: 'Voucher',
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },

    viewCreate: async (req, res) => {
        try {
            const category = await Category.find();
            const nominal = await Nominal.find();
            const { name } = req.session.user;

            res.render('admin/voucher/create', {
                category,
                nominal,
                username: name,
                title: 'Voucher',
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { name, category, nominals, user } = req.body;

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt =
                    req.file.originalname.split('.')[
                        req.file.originalname.split('.').length - 1
                    ];
                let filename = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(
                    config.rootPath,
                    `public/uploads/${filename}`
                );

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);
                src.on('end', async () => {
                    try {
                        const voucher = await Voucher({
                            name,
                            thumbnail: filename,
                            category,
                            nominals,
                            user,
                        });
                        await voucher.save();
                        req.flash(
                            'alertMessage',
                            'New voucher has been created!'
                        );
                        req.flash('alertStatus', 'success');

                        res.redirect('/voucher');
                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/voucher');
                    }
                });
            } else {
                const voucher = await Voucher({
                    name,
                    category,
                    nominals,
                    user,
                });
                await voucher.save();
                req.flash('alertMessage', 'New voucher has been created!');
                req.flash('alertStatus', 'success');

                res.redirect('/voucher');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const voucher = await Voucher.findById(id)
                .populate('category')
                .populate('nominals');
            const category = await Category.find();
            const nominal = await Nominal.find();
            const { name } = req.session.user;

            res.render('admin/voucher/edit', {
                voucher,
                category,
                nominal,
                username: name,
                title: 'Voucher',
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },

    actionUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, nominals, user } = req.body;

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt =
                    req.file.originalname.split('.')[
                        req.file.originalname.split('.').length - 1
                    ];
                let filename = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(
                    config.rootPath,
                    `public/uploads/${filename}`
                );

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);
                src.on('end', async () => {
                    try {
                        const voucher = await Voucher.findById(id);
                        const currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }

                        await Voucher.findOneAndUpdate(
                            { _id: id },
                            {
                                name,
                                thumbnail: filename,
                                category,
                                nominals,
                                user,
                            }
                        );

                        req.flash('alertMessage', 'Voucher has been updated!');
                        req.flash('alertStatus', 'success');

                        res.redirect('/voucher');
                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/voucher');
                    }
                });
            } else {
                await Voucher.findOneAndUpdate(
                    { _id: id },
                    {
                        name,
                        category,
                        nominals,
                    }
                );

                req.flash('alertMessage', 'Voucher has been updated!');
                req.flash('alertStatus', 'success');

                res.redirect('/voucher');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const voucher = await Voucher.findOneAndRemove({ _id: id });

            const currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage);
            }

            req.flash('alertMessage', 'Voucher has been deleted!');
            req.flash('alertStatus', 'success');

            res.redirect('/voucher');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            let voucher = await Voucher.findById(id);

            let status = voucher.status === 'Y' ? 'N' : 'Y';

            await Voucher.findOneAndUpdate({ _id: id }, { status });

            req.flash('alertMessage', 'Voucher status has been updated!');
            req.flash('alertStatus', 'success');

            res.redirect('/voucher');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
};
