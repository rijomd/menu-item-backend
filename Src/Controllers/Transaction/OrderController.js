
const MiscService = require("../../Services/MiscServices");
const { create, update, list } = require("../../General/CrudOperations");
const { Order } = require("../../Model/orderModel");
const { Misc } = require("../../Model/miscModel");

const modelName = "Order";

const insertOrder = async (req, res) => {
    let query = req.body;
    let response;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const newQuery = {
            createdAt: { $gte: today },
            userId: req.user._id
        };
        const orderCountByToday = await Order.countDocuments(newQuery);
        const settings = await Misc.find({ location: req.user?.location });

        if (orderCountByToday <= settings[0]?.orderLimit) {
            if (query._id) {
                response = await update(modelName, query, { _id: query._id });
            }
            else {
                response = await create(modelName, { ...query, userId: req.user._id });
            }
            res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
        }
        else {
            res.status(400).json(MiscService.response(400, `Exceeded order limit per day ${settings[0]?.orderLimit}`, {}));
        }
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}

const orderList = async (req, res) => {
    const query = {};
    let user = req.user;
    if (user.userRole === "User") {
        query['userId'] = user._id;
    }

    try {
        const fields = '_id totalAmount totalItems  status cancelComment createdAt updatedAt userId itemList';

        let OrderList = await list(modelName, query, fields, ['userId', 'itemList']);
        let lists = [];
        lists = OrderList?.length > 0 && [...OrderList].map((Order) => {
            const { _id, totalAmount, totalItems, status, createdAt, cancelComment, updatedAt, userId, itemList } = Order;
            return {
                _id, totalAmount, totalItems, status,
                createdAt, cancelComment, updatedAt,
                userName: userId?.name, itemList,
                location: userId?.location,
            }
        });

        if (user.userRole === "Admin") {
            lists = lists.filter(order => order?.location.toString() === user?.location?.toString());
        }

        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { OrderList: lists }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    orderList, insertOrder
}