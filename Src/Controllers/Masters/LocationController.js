const MiscService = require("../../Services/MiscServices");
const { create, update, deleteData, list } = require("../../General/CrudOperations");

const modelName = "Location";

const insertLocation = async (req, res) => {
    let decryptedData = MiscService.deCryptQuery(req.body.encryptedCredentials);
    let response;
    try {
        if (decryptedData._id) {
            response = await update(modelName, decryptedData, { _id: decryptedData._id });
        }
        else {
            response = await create(modelName, decryptedData);
        }

        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}

const locationList = async (req, res) => {
    const query = req.body || {};
    try {
        const fields = '_id name code  status createdAt';
        let locationList = await list(modelName, query, fields);
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { locationList: locationList }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

const deleteLocation = async (req, res) => {
    let location = req.body;
    let response;
    try {
        response = await deleteData(modelName, location);
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}

module.exports = {
    insertLocation, locationList, deleteLocation
}