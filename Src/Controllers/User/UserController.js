const MiscService = require("../../Services/MiscServices");

const { create, update, deleteData, list } = require("../../General/CrudOperations");

const modelName = "User";

const insertUser = async (req, res) => {
    let response;
    let decryptedData = MiscService.deCryptQuery(req.body.encryptedCredentials);

    try {
        if (decryptedData._id) {
            response = await update(modelName, decryptedData, { email: decryptedData.email });
        }
        else {
            decryptedData.password = await MiscService.encryptPassword(decryptedData.password)
            response = await create(modelName, decryptedData);
        }
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}


const userList = async (req, res) => {
    const query = req.body || {};
    // let user = req.user;
    try {
        // query._id = { $ne: user._id  };
        // query.location = { $eq: user.location };

        const fields = '_id name email location userRole status createdAt';
        const userList = await list(modelName, query, fields, ['location'], 'name');
        const lists = userList?.length > 0 && [...userList].map((item) => {
            const {_id, name, email, userRole, status, createdAt } = item;
            return {
                _id, name, email, userRole, status, createdAt,
                location: item?.location?.name || 'Head Location', locationId: item?.location?._id || ''
            }
        });
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { UserList: lists || [] }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error?.message || process.env.WRONG_SOMETHING, {}));
    }
}

const deleteUser = async (req, res) => {
    let user = req.body;
    let response;
    try {
        response = await deleteData(modelName, user);
        res.status(200).json(MiscService.response(200, process.env.SUCCESS, { _id: response?._id || "" }));
    } catch (error) {
        console.log(error)
        res.status(400).json(MiscService.response(400, error.message || process.env.WRONG_SOMETHING, {}));
    }
}




module.exports = {
    insertUser, userList, deleteUser
}