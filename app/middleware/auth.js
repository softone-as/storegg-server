const config = require('../../config');
const jwt = require('jsonwebtoken');
const Player = require('../player/model');

module.exports = {
    isAdminLoggedIn: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', `Sorry, your session has expired!`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        } else {
            next();
        }
    },

    isClientLoggedIn: async (req, res, next) => {
        try {
            const token = req.headers.authorization
                ? req.headers.authorization.replace('Bearer ', '')
                : null;

            const data = jwt.verify(token, config.jwtKey);

            const player = await Player.findOne({ _id: data.player.id });

            if (!player) {
                throw new Error();
            }

            req.player = player;
            req.token = token;
            next();
        } catch (error) {
            console.log(
                '🚀 ~ file: auth.js ~ line 42 ~ isClientLoggedIn: ~ error',
                error
            );
            res.status(401).json({
                error: 'Not authorized to access this resource!',
            });
        }
    },
};
