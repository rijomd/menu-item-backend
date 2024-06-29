
const { list } = require("../../General/CrudOperations");
const MiscService = require("../../Services/MiscServices");

const modelName = "Bill";

const billList = async (req, res) => {
    const query = req?.query || {};
    if(req.user?.location){
        query['location'] = req.user?.location;
    }
    try {
        const fields = '_id closedOn document closedBy ';

        let billLists = await list(modelName, query, fields, ['location','closedBy']);
        let lists = [];
        lists = billLists?.length > 0 ? [...billLists].map((bill) => {
            const { _id, document, closedBy, closedOn, location } = bill;
            return {
                _id, closedOn, document,
                ClosedBy: closedBy?.name,
                location: location?.name,
            }
        }) : []

        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { billLists: lists }));
    } catch (error) {
        console.error(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = { billList };