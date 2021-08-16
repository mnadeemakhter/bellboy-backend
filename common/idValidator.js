const mongoose = require("mongoose")

const isValidId = (id) => {
    return mongoose.isValidObjectId(id);
};

exports.idValidator = (req, res, next) => {
    if (isValidId(req.params.id)) {
        return next()
    }
    return res.status(200).json({ success: true, data: {}, msg: "ObjectId must be a single String of 12 bytes or a string of 24 hex characters", status: 422 });

}
