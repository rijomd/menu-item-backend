
const MiscService = require("../../Services/MiscServices");
const { create, update, list } = require("../../General/CrudOperations");

const modelName = "Category";

const insertCategory = async (req, res) => {
    let query = req.body;
    let response;
    query = { ...query, image: query.file }
    try {
        if (query._id) {
            response = await update(modelName, query, { _id: query._id });
        }
        else {
            response = await create(modelName, query);
        }
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}

const categoryList = async (req, res) => {
    const query = req.body || {};
    let user = req.user;
    try {
        const fields = '_id name image status createdAt';
        user.location ? query.location = { $eq: user.location } : '';

        let CategoryList = await list(modelName, query, fields);
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { CategoryList: CategoryList }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

const categoryCompo = async (req, res) => {
    try {
        const fields = '_id name';
        const CategoryList = await list(modelName, { status: 'Active' }, fields);
        const compo = CategoryList.map((item) => {
            return { label: item.name, value: item._id }
        });
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { CategoryCompo: compo || [] }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    categoryCompo, categoryList, insertCategory
}