module.exports = {
    index: async (req, res) => {
        try {
            const { name } = req.session.user;
            res.render('index', { username: name, title: 'Dashboard' });
        } catch (error) {
            console.log(error);
        }
    },
};
