
const MiscService = require("../../Services/MiscServices");
const { create, update, list } = require("../../General/CrudOperations");

const modelName = "Misc";

const insertMisc = async (req, res) => {
    let query = req.body;
    let response;
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

const MiscList = async (req, res) => {
    const query = req.body || {};
    let user = req.user;
    try {
        const fields = '_id amountLimit countLimit multipleCategorySelection location updatedAt';
        user?.location ? query.location = { $eq: user?.location } : '';

        let MiscList = await list(modelName, query, fields, ['location'], 'name');
        const lists = MiscList?.length > 0 && [...MiscList].map((Misc) => {
            const { _id, amountLimit, countLimit, multipleCategorySelection, location, updatedAt } = Misc;
            return {
                _id, amountLimit, countLimit, multipleCategorySelection, updatedAt,
                location: location?.name, locationId: location?._id || '',
            }
        });
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { MiscList: lists }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    MiscList, insertMisc
}