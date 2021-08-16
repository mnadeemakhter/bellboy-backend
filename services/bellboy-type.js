const BellBoyType = require('./../models/bellboy-type')

class BellBoyTypeService {
    addBellBoyType(request) {
        return new BellBoyType(request).save();
    }

    getBellBoyTypes(request) {
        return BellBoyType.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }

    getBellBoyType(request) {
        return BellBoyType.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }

    getBellBoyTypeSimply(request) {
        return BellBoyType.findOne(request);
    }

    BellBoyTypeTotalCount(request) {
        return BellBoyType.countDocuments(request)
    }

    updateBellBoyType(request, criteria) {
        return BellBoyType.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }

    deleteBellBoyType(request) {
        return BellBoyType.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }
}

module.exports = new BellBoyTypeService();