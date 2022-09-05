const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Player = require('../player/model');
const Transaction = require('../transaction/model');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucher = await Voucher.find()
                .select('_id name status category thumbnail')
                .populate('category');

            res.status(200).json({ data: voucher });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const voucher = await Voucher.findById(id)
                .populate('category')
                .populate('nominals')
                .populate('user', '_id name phoneNumber');

            if (!voucher) {
                return res
                    .status(404)
                    .json({ message: `Data with ${id} not found!` });
            }

            res.status(200).json({ data: voucher });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    category: async (req, res) => {
        try {
            const category = await Category.find();
            res.status(200).json({ data: category });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    checkout: async (req, res) => {
        try {
            const {
                accountUser,
                name,
                nominalId,
                voucherId,
                paymentId,
                bankId,
            } = req.body;

            const voucher = await Voucher.findOne({ _id: voucherId })
                .select('_id name category thumbnail user')
                .populate('category')
                .populate('user');

            if (!voucher)
                return res
                    .status(404)
                    .json({ message: 'Voucher is not found!' });

            const nominal = await Nominal.findOne({ _id: nominalId });
            if (!nominal)
                return res
                    .status(404)
                    .json({ message: 'Nominal is not found!' });

            const payment = await Payment.findOne({ _id: paymentId });
            if (!payment)
                return res
                    .status(404)
                    .json({ message: 'Payment is not found!' });

            const bank = await Bank.findOne({ _id: bankId });
            if (!bank)
                return res.status(404).json({ message: 'Bank is not found!' });

            const tax = (10 / 100) * nominal._doc.price;
            const value = nominal._doc.price - tax;

            const payload = {
                historyVoucherTopUp: {
                    game: voucher._doc.name,
                    category: voucher._doc.category._id
                        ? voucher._doc.category._id
                        : '-',
                    thumbnail: voucher._doc.thumbnail,
                    coinName: nominal._doc.coinName,
                    coinQuantity: nominal._doc.coinQuantity,
                    price: nominal._doc.price,
                },

                historyPayment: {
                    username: bank._doc.username,
                    type: payment._doc.type,
                    accountNumber: bank._doc.accountNumber,
                    bank: bank._doc.name,
                },

                name,
                accountUser,
                tax,
                value,
                player: req.player._id,

                historyUser: {
                    name: voucher._doc.user?.name,
                    phoneNumber: voucher._doc.user?.phoneNumber,
                },

                category: voucher._doc.category?._id,
                user: voucher._doc.user?._id,
            };

            const transaction = await Transaction(payload);
            await transaction.save();

            res.status(200).json({
                data: transaction,
                message: 'Checkout successfully!',
            });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    history: async (req, res) => {
        try {
            const { status = '' } = req.query;

            let criteria = {};

            if (status.length > 0) {
                criteria = {
                    ...criteria,
                    status: {
                        $regex: `${status}`,
                        $options: 'i',
                    },
                };
            }

            if (req.player._id) {
                criteria = {
                    ...criteria,
                    player: req.player._id,
                };
            }

            const total = await Transaction.aggregate([
                { $match: criteria },
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: '$value' },
                    },
                },
            ]);

            const history = await Transaction.find(criteria);

            res.status(200).json({
                data: history,
                totalPrice: total.length > 0 ? total[0].totalPrice : 0,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    detailHistory: async (req, res) => {
        try {
            const { id } = req.params;

            const history = await Transaction.findOne({ _id: id });

            if (!history)
                return res.status(404).json({ message: 'History not found!' });

            res.status(200).json({ data: history });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    dashboard: async (req, res) => {
        try {
            const totalPayment = await Transaction.aggregate([
                {
                    $match: {
                        player: req.player._id,
                    },
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$value' },
                    },
                },
            ]);

            const categories = await Category.find();

            categories.forEach((category) => {
                totalPayment.forEach((total) => {
                    if (total._id.toString() === category._id.toString()) {
                        total.name = category.name;
                    }
                });
            });

            const history = await Transaction.find({ player: req.player._id })
                .populate('category')
                .sort({ updatedAt: -1 });

            res.status(200).json({ data: history, totalPayment });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    profile: async (req, res) => {
        try {
            const { _id, name, username, email, phoneNumber, avatar } =
                req.player;

            const player = { _id, name, username, email, phoneNumber, avatar };

            res.status(200).json({ data: player });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },

    editProfile: async (req, res, next) => {
        try {
            const { name = '', phoneNumber = '' } = req.body;
            const { _id } = req.player;

            const payload = {};

            if (name.length) payload.name = name;
            if (phoneNumber.length) payload.phoneNumber = phoneNumber;

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
                        let player = await Player.findById(_id);
                        const currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;

                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }

                        player = await Player.findOneAndUpdate(
                            { _id },
                            {
                                ...payload,
                                id: player._id,
                                avatar: filename,
                            },
                            {
                                new: true,
                                runValidators: true,
                            }
                        );

                        res.status(201).json({
                            data: {
                                ...payload,
                                id: player._id,
                                avatar: filename,
                            },
                        });
                    } catch (error) {
                        res.status(500).json({
                            message: error.message || 'Internal Server Error!',
                        });
                    }
                });

                src.on('error', async () => next());
            } else {
                const player = await Player.findOneAndUpdate({ _id }, payload, {
                    new: true,
                    runValidators: true,
                });
                res.status(201).json({
                    data: {
                        id: player._id,
                        name: player.name,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar,
                    },
                });
            }
        } catch (error) {
            if (error && error.name === 'ValidationError') {
                res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors,
                });
            }
            res.status(500).json({
                message: error.message || 'Internal Server Error!',
            });
        }
    },
};
