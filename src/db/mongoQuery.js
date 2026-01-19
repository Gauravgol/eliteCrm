exports.findOne = async ({ model, filter = {}, projection = null, options = {} }) => {
    try { return await model.findOne(filter, projection, options).lean(); }
    catch (e) { throw new Error(`findOne failed: ${e.message}`); }
};

exports.findMany = async ({ model, filter = {}, projection = null, options = {} }) => {
    try { return await model.find(filter, projection, options).lean(); }
    catch (e) { throw new Error(`findMany failed: ${e.message}`); }
};

exports.insertOne = async ({ model, data }) => {
    try { return await new model(data).save(); }
    catch (e) { throw new Error(`insertOne failed: ${e.message}`); }
};

exports.insertMany = async ({ model, data, options = {} }) => {
    try { return await model.insertMany(data, options); }
    catch (e) { throw new Error(`insertMany failed: ${e.message}`); }
};

exports.updateOne = async ({ model, filter = {}, update = {}, options = { new: true } }) => {
    try { return await model.findOneAndUpdate(filter, update, options).lean(); }
    catch (e) { throw new Error(`updateOne failed: ${e.message}`); }
};

exports.updateMany = async ({ model, filter = {}, update = {}, options = {} }) => {
    try { return await model.updateMany(filter, update, options); }
    catch (e) { throw new Error(`updateMany failed: ${e.message}`); }
};

exports.deleteOne = async ({ model, filter = {} }) => {
    try { return await model.findOneAndDelete(filter).lean(); }
    catch (e) { throw new Error(`deleteOne failed: ${e.message}`); }
};

exports.deleteMany = async ({ model, filter = {} }) => {
    try { return await model.deleteMany(filter); }
    catch (e) { throw new Error(`deleteMany failed: ${e.message}`); }
};

exports.count = async ({ model, filter = {} }) => {
    try { return await model.countDocuments(filter); }
    catch (e) { throw new Error(`count failed: ${e.message}`); }
};

exports.exists = async ({ model, filter = {} }) => {
    try { return await model.exists(filter); }
    catch (e) { throw new Error(`exists failed: ${e.message}`); }
};

exports.aggregate = async ({ model, pipeline = [], options = {} }) => {
    try { return await model.aggregate(pipeline, options); }
    catch (e) { throw new Error(`aggregate failed: ${e.message}`); }
};
