
const HiringActionType = require('./../models/hiring-action-type')
const Hirings = require("../models/hiring");
class HiringActionTypeService {
    addHiringActionType(request) {
        return new HiringActionType(request).save();
    }

    getHiringActionTypes(request, perPage, pageNo,sortBy) {
        let isAssecnding=1;
        let sortFiled=sortBy;
        if(sortBy[0]==="-"){
            isAssecnding=-1;
            sortFiled=sortBy.slice(1);
        }
        return Hirings
            .aggregate()
            .unwind("actions")
            .group({
                _id: "$actions.actionType",
                actionCount: { $sum: 1 }
            })
            .lookup({
                from: "hiring-action-types",
                localField: "_id",
                foreignField: "_id",
                as: "actionType"
            })
            .unwind("actionType")
            .unwind("actionType.locales")
            .unwind("actionType.labels")
            .lookup({
                from: "locales",
                localField: "actionType.locales",
                foreignField: "_id",
                as: "actionType.locales"
            })
            .lookup({
                from: "labels",
                localField: "actionType.labels",
                foreignField: "_id",
                as: "actionType.labels"
            })
            .replaceRoot(
                { $mergeObjects: ["$actionType", "$$ROOT"] }
            )
            .project({
                actionType: false
            })
            .match(request)
            .sort({
                [sortFiled]:isAssecnding
            })
        // .match({
        //     "actionType": request
        // })

        // return HiringActionType
        //     // .aggregate([
        //     //     {
        //     //         "$match": request
        //     //     }
        //     // ])
        //     .aggregate()
        //     .match(request)
        //     .lookup({
        //         from: "locales",
        //         localField: "locales",
        //         foreignField: "_id",
        //         as: "locales"
        //     })
        //     .lookup({
        //         from: "labels",
        //         localField: "labels",
        //         foreignField: "_id",
        //         as: "labels"
        //     })


        // Dany code
        // return HiringActionType.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);

    }

    getHiringActionTypesForCustomer(request) {
        return HiringActionType.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]).select('-created_at -updated_at -__v');
    }

    getHiringActionType(request) {
        return HiringActionType.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }

    HiringActionTypeTotalCount(request) {
        return HiringActionType.countDocuments(request)
    }

    updateHiringActionType(request, criteria) {
        return HiringActionType.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }

    deleteHiringActionType(request) {
        return HiringActionType.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }
    isActive(request) {

        return HiringActionType.findOne(request).where({ status: true });
    }
}

module.exports = new HiringActionTypeService();