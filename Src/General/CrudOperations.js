const mongoose = require("mongoose");
const general = require("../Config/DatabaseSample/configDBModels");

const getModalPath = async (table) => {
    let Modal;
    general?.modelsPath?.length > 0 && general?.modelsPath.map((item) => {
        if (item.modalName === table) {
            let schemaService = require(`../Model/${item.path}`);
            Modal = mongoose.model(item.modalName, schemaService?.[item.schemaName])
        }
    });
    return Modal ? Modal : "Table";
}

const create = async (table, body) => {
    try {
        const Modal = await getModalPath(table);
        const modalInstance = new Modal(body);
        return await modalInstance.save();
    } catch (error) {
        throw new Error(error);
    }
}

const update = async (table, body, filter) => {
    try {
        const Modal = await getModalPath(table);
        const doc = await Modal.findOneAndUpdate(filter, body, { new: true });
        return doc;
    } catch (error) {
        throw new Error(error);
    }
}

const list = async (table, body, fields) => {
    try {
        const Modal = await getModalPath(table);
        return await Modal.find(body, fields);
    } catch (error) {
        throw new Error(error);
    }
}

const deleteData = async (table, filter) => {
    try {
        const Modal = await getModalPath(table);
        const doc = await Modal.findOneAndDelete(filter);
        return doc;
    } catch (error) {
        throw new Error(error);
    }
}

const getSingleData = async (table, filter) => {
    try {
        const Modal = await getModalPath(table);
        const doc = await Modal.findOne(filter);
        return doc;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    create, list, update, deleteData, getSingleData
}