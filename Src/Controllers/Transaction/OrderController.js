
const mongoose = require('mongoose');

const { Order } = require("../../Model/orderModel");
const { Misc } = require("../../Model/miscModel");

const MiscService = require("../../Services/MiscServices");
const { create, update, list } = require("../../General/CrudOperations");
const { updateItemQuantity } = require("../../Controllers/Masters/ItemController");

const modelName = "Order";
const billModel = "Bill";

const itemAvailability = async (itemList) => {
    const ids = [];
    const errors = [];
    const entries = [];

    itemList.map(item => ids.push(item._id));
    let listAll = await list("Item", { _id: { $in: ids } }, '_id quantity');

    listAll.map((item1) => {
        const match = itemList.find(item2 => item2._id?.toString() === item1._id?.toString());
        if (match) {
            if (match.count > item1.quantity) {
                errors.push(`${match.name} not available`)
            }
            entries.push({ _id: match._id, quantity: (item1.quantity - match.count) });
        }
    });

    if (errors.length === 0) {
        return { entries, errors }
    }
    else {
        return { entries, errors }
    }
}

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

        if (query._id) {
            response = await update(modelName, query, { _id: query._id });
            res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
        }
        else {
            const { entries, errors } = await itemAvailability(query?.itemList);
            if (errors.length === 0 && entries.length > 0) {
                if (orderCountByToday <= settings[0]?.orderLimit) {
                    response = await create(modelName, { ...query, userId: req.user._id });
                    await updateItemQuantity(entries);
                    res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
                }
                else {
                    res.status(400).json(MiscService.response(400, `Exceeded order limit per day ${settings[0]?.orderLimit}`, {}));
                }
            }
            else {
                res.status(400).json(MiscService.response(400, `Currently some item is not available`, errors));
            }
        }

    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}

const orderList = async (req, res) => {
    const query = req?.query || {};
    let user = req.user;

    if (user.userRole === "User") {
        query['userId'] = user._id;
    }

    if (req?.query?.date) {
        const currentDate = new Date();
        const startOfCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endOfCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        query['createdAt'] = {
            $gte: startOfCurrentDay,
            $lt: endOfCurrentDay
        };
        query['status'] = 'Approved';
        delete query['date'];
    }

    try {
        const fields = '_id totalAmount totalItems  status cancelComment createdAt updatedAt userId itemList';

        let OrderList = await list(modelName, query, fields, ['userId']);
        let lists = [];
        lists = OrderList?.length > 0 ? [...OrderList].map((Order) => {
            const { _id, totalAmount, totalItems, status, createdAt, cancelComment, updatedAt, userId, itemList } = Order;
            return {
                _id, totalAmount, totalItems, status,
                createdAt, cancelComment, updatedAt,
                userName: userId?.name, itemList,
                location: userId?.location,
            }
        }) : []

        if (user.userRole === "Admin" || user.userRole === "superAdmin") {
            lists = lists?.length > 0 ? lists.filter(order => order?.location.toString() === user?.location?.toString()) : [];
        }

        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { OrderList: lists }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}


const closeOrder = async (req, res) => {
    try {
        const orderList = req.body.orderList.map(id => new mongoose.Types.ObjectId(id));

        const result = await Order.updateMany(
            { _id: { $in: orderList } },
            { $set: { status: 'Closed' } }
        );
        if (result.nModified === 0) {
            res.status(404).json(MiscService.response(400, "No orders were updated", {}));
        }
        const response = await create(billModel, { closedOn: new Date(), closedBy: req.user._id, document: req.file.filename });
        res.status(200).json(MiscService.response(200, "All Order closed successfully", response._id));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    orderList, insertOrder, closeOrder
}