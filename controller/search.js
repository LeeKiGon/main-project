const SearchService = require('../services/search');

const Search = async (req, res) => {
    const { user } = res.locals.user;
    let { page, query, style } = req.query;

    const Search = await SearchService.getSearch({ page, query, style, user });

    return res.json({ result: 'success', plans: Search });
};

module.exports = {
    Search,
};