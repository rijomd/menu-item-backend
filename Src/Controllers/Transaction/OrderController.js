
const MiscService = require("../../Services/MiscServices");
const { create, update, list } = require("../../General/CrudOperations");

const modelName = "Order";

const insertOrder = async (req, res) => {
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

const orderList = async (req, res) => {
    const query = {};
    let user = req.user;
    try {
        const fields = '_id totalAmount totalItems status cancelComment createdAt updatedAt userId';
        user?.location ? query.location = { $eq: user?.location } : '';

        let OrderList = await list(modelName, query, fields, ['userId'], 'name');
        const lists = OrderList?.length > 0 && [...OrderList].map((Order) => {
            const { _id, totalAmount, totalItems, status, createdAt, cancelComment, updatedAt, userId } = Order;
            return {
                _id, totalAmount, totalItems, status,
                createdAt, cancelComment, updatedAt, userId,
                userName: location?.name
            }
        });
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { OrderList: lists }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    orderList, insertOrder
}