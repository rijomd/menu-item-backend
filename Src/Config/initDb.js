const { connectMultiDB } = require("./db");
const { modelsPath } = require("./DatabaseSample/configDBStudy");

const switchDB = async (dbName, dbSchema) => {
    const mongoose = await connectMultiDB();
    if (mongoose.connection.readyState === 1) {
        const db = mongoose.connection.useDb(dbName);
        if (!Object.keys(db.models).length) {
            dbSchema.map((schema) => {
                db.model(schema.modelName, schema.schema)
            })
        }
        return db
    }
    throw new Error('error');
}

const schemaSelection = () => {
    let ModalSchema = [];
    modelsPath?.length > 0 && modelsPath.map((item) => {
        let schemaService = require(`../Model/${item.path}`);
        ModalSchema.push({ modelName: item.modalName, schema: schemaService?.[item.schemaName] })
    });
    return ModalSchema;
}

const initTenants = async (DBName) => {
    try {
        const schema = schemaSelection();
        await switchDB(DBName, schema); //current db
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    initTenants
}