module.exports = {
    index: async (req, res) => {
        try {
            res.render('index', { title: 'Bro' });
        } catch (error) {
            console.log(error);
        }
    },
};
