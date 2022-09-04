const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Transaction = require('../transaction/model');

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
};
