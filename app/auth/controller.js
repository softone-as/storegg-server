const fs = require('fs');
const path = require('path');
const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Player = require('../player/model');

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const payload = req.body;

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
                        const player = await Player({
                            ...payload,
                            avatar: filename,
                        });
                        await player.save();

                        delete player._doc.password;
                        return res.status(201).json({ data: player });
                    } catch (error) {
                        if (error && error.name === 'ValidationError') {
                            res.status(422).json({
                                error: 1,
                                message: error.message,
                                fields: error.errors,
                            });
                        }
                        next(error);
                    }
                });
            } else {
                let player = new Player(payload);
                await player.save();

                delete player._doc.password;
                return res.status(201).json({ data: player });
            }
        } catch (error) {
            if (error && error.name === 'ValidationError') {
                res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors,
                });
            }
            next(error);
        }
    },

    signIn: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const player = await Player.findOne({ email });

            if (player) {
                const checkPassword = await bcrypt.compareSync(
                    password,
                    player.password
                );
                if (checkPassword) {
                    const token = jwt.sign(
                        {
                            player: {
                                id: player._id,
                                username: player.username,
                                email: player.email,
                                password: player.password,
                                avatar: player.avatar,
                                phoneNumber: player.phoneNumber,
                            },
                        },
                        config.jwtKey
                    );

                    res.status(200).json({
                        message: 'Login Successfully!',
                        data: { token },
                    });
                } else {
                    res.status(400).json({
                        message: 'Email / username is invalid!',
                    });
                }
            } else {
                res.status(400).json({
                    message: 'Email / username is invalid!',
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
            next(error);
        }
    },
};
