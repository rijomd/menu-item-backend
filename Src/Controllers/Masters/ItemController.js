
const MiscService = require("../../Services/MiscServices");
const { create, update, list } = require("../../General/CrudOperations");
const ObjectId = require('mongoose').Types.ObjectId;

const modelName = "Item";

const insertItem = async (req, res) => {
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

const ItemList = async (req, res) => {
    const query = {};
    if (req.query?.category) {
        query.category = new ObjectId(req.query.category)
    }
    let user = req.user;
    try {
        const fields = '_id name image status offer createdAt location sellingPrice quantity category';
        user?.location ? query.location = { $eq: user?.location } : '';

        let ItemList = await list(modelName, query, fields, ['category', 'location'], 'name');
        const lists = ItemList?.length > 0 && [...ItemList].map((item) => {
            const { _id, name, sellingPrice, status, createdAt, quantity, category, location, offer, image } = item;
            return {
                _id, name, sellingPrice, status, createdAt, sellingPrice, quantity, offer, image,
                location: location?.name, locationId: location?._id || '',
                category: category?.name, categoryId: category?._id || ''
            }
        });
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { ItemList: lists }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    ItemList, insertItem
}