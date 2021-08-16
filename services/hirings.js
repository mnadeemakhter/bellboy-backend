const Hiring = require("../models/hiring");
const messages = require("../common/messages");
const moment = require("moment");
const mongoose = require("mongoose");
class HiringService {
  getHiring(request) {
    return Hiring.findOne(request).populate([
      { path: "bellboy", select: "name mobile avatar fcm_token" },
      {
        path: "cancellation_admin",
        select: "name contact_number avatar email fcm_token",
      },
      { path: "bellboyType", select: "title icon" },
      { path: "customer", select: "name mobile avatar fcm_token location" },
      {
        path: "actions.actionType",
        populate: [
          { path: "locales" },
          {
            path: "labels",
            populate: { path: "locale" },
          },
        ],
        select: "-created_at -updated_at -__v",
      },
    ]);
  }
  getTotalEarningDate(start, end, status, isFree) {
    const startDateObj = {
      year: start.getFullYear(),
      month: start.getMonth() + 1,
      day: start.getDate(),
    };
    const endDateObj = {
      year: end.getFullYear(),
      month: end.getMonth() + 1,
      day: end.getDate(),
    };
    console.log(startDateObj, endDateObj);
    // return Hiring.aggregate([
    //   {
    //     $match: {
    //       status,
    //       isFree:{
    //         $in:[isFree,null]
    //       },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       querydate: {
    //         year: {
    //           $year: "$created_at",
    //         },
    //         month: {
    //           $month: "$created_at",
    //         },
    //         day: {
    //           $dayOfMonth: "$created_at",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $match: {
    //       "querydate.year": {
    //         $gte: startDateObj.year,
    //         $lte: endDateObj.year,
    //       },
    //       "querydate.month": {
    //         $gte: startDateObj.month,
    //         $lte: endDateObj.month,
    //       },
    //       "querydate.day": {
    //         $gte: startDateObj.day,
    //         $lte: endDateObj.day,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       earning: {
    //         $sum: "$amount",
    //       },
    //     },
    //   },
    // ]);

    //
    return Hiring.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(start.toISOString()),
            $lte: new Date(end.toISOString()),
          },
          status: 4,
          isFree: {
            $in: [false, null],
          },
        },
      },
      {
        $group: {
          _id: null,
          earning: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // return Hiring.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         { created_at: { $gt: start, $lt: end } },
    //         {
    //           status: status,
    //         },
    //       ],
    //       // $or:{
    //       //   isFree:{
    //       //     $exists:true
    //       //   }
    //       // }
    //       isFree: {
    //         $in: [isFree]
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       earning: {
    //         $sum: "$amount",
    //       },
    //     },
    //   },
    // ]);
  }

  getTotalEarning(status, isFree) {
    return Hiring.aggregate([
      {
        $match: {
          status: status,
          isFree: {
            $ne: !isFree,
          },
        },
      },
      {
        $group: {
          _id: null,
          earning: {
            $sum: "$amount",
          },
        },
      },
    ]);
  }
  getHiringDetailForBellBoy(request) {
    return Hiring.findOne(request)
      .populate([
        { path: "bellboy", select: "name mobile avatar fcm_token" },
        { path: "bellboyType", select: "title icon" },
        { path: "customer", select: "name mobile avatar fcm_token" },
        {
          path: "actions.actionType",
          populate: [
            { path: "locales" },
            {
              path: "labels",
              populate: { path: "locale" },
            },
          ],
          select: "-created_at -updated_at -__v",
        },
      ])
      .sort("-created_at");
  }
  getHiringSimply(request) {
    return Hiring.findOne(request);
  }
  getHirings(request) {
    return Hiring.find(request)
      .populate([
        { path: "bellboyType", select: "title icon" },
        {
          path: "cancellation_admin",
          select: "name contact_number avatar email",
        },
        { path: "customer", select: "name mobile avatar" },
        { path: "bellboy", select: "name mobile avatar" },
        {
          path: "actions.actionType",
          populate: [
            { path: "locales" },
            {
              path: "labels",
              populate: { path: "locale" },
            },
          ],
          select: "-created_at -updated_at -__v",
        },
      ])
      .select("-actions")
      .sort("-created_at");
  }
  getTotalWorkingTimebyId(request) {
    return Hiring.aggregate([
      {
        $match: {
          ...request,
        },
      },
      {
        $project: {
          time: {
            $subtract: ["$end_time", "$start_time"],
          },
          bellboy: 1,
        },
      },
      {
        $project: {
          minute: {
            $divide: ["$time", 60000],
          },
          bellboy: 1,
        },
      },
      {
        $group: {
          _id: "$bellboy",
          workingTime: {
            $sum: "$minute",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  }
  getHiringsPaginated(request, perPage, pageNo) {
    return Hiring.find(request)
      .populate([
        { path: "bellboyType", select: "title icon" },
        {
          path: "cancellation_admin",
          select: "name contact_number avatar email",
        },
        { path: "customer", select: "name mobile avatar" },
        // { path: 'bellboy', select: 'name mobile avatar' },
        {
          path: "actions.actionType",
          populate: [
            { path: "locales" },
            {
              path: "labels",
              populate: { path: "locale" },
            },
          ],
          select: "-created_at -updated_at -__v",
        },
      ])
      .select(
        "-actions -bellboy -feedback -location -__v -updated_at -bellboyType.icon"
      )
      .sort("-created_at")
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
  }
  getHiringsSimply(request) {
    return Hiring.find(request);
  }

  getHiringsForCustomer(request, perPage, pageNo) {
    return Hiring.find(request)
      .populate([
        { path: "bellboyType", select: "title icon" },
        { path: "customer", select: "name mobile avatar" },
        { path: "bellboy", select: "name mobile avatar" },
        {
          path: "actions.actionType",
          populate: [
            { path: "locales" },
            {
              path: "labels",
              populate: { path: "locale" },
            },
          ],
          select: "-created_at -updated_at -__v",
        },
      ])
      .select(
        "actions customer hours amount bellboy bellboyType created_at status is_completed hiring_id"
      )
      .sort("-created_at")
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
  }

  getHiringsForBellBoyDashboard(request) {
    return Hiring.find(request)
      .populate([
        { path: "customer", select: "name mobile avatar" },
        {
          path: "cancellation_admin",
          select: "name contact_number avatar email",
        },
        { path: "bellboy", select: "name mobile avatar" },
      ])
      .select("customer bellboy hiring_id location totalActions status")
      .sort("-created_at");
  }
  getHiringByDateForAdmin(start, end) {
    return Hiring.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }],
        },
      },
      {
        $lookup: {
          from: "bellboys",
          localField: "bellboy",
          foreignField: "_id",
          as: "bellboy",
        },
      },
      {
        $unwind: {
          path: "$bellboy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bellboy-type",
          localField: "bellboyType",
          foreignField: "_id",
          as: "bellboyType",
        },
      },
      {
        $unwind: {
          path: "$bellboyType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cancellation_admin",
          localField: "admins",
          foreignField: "_id",
          as: "cancellation_admin",
        },
      },
      {
        $unwind: {
          path: "$cancellation_admin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          hiring_id: 1,
          bellboy: {
            name: 1,
            avatar: 1,
            _id: 1,
            mobile: 1,
          },
          cancellation_admin: {
            name: 1,
            contact_number: 1,
            avatar: 1,
            email: 1,
          },
          bellboyType: {
            title: 1,
            icon: 1,
            _id: 1,
          },
          customer: {
            name: 1,
            _id: 1,
            avatar: 1,
            mobile: 1,
          },
          totalActions: {
            $size: "$actions",
          },
          __v: 1,
          amount: 1,
          cancellation_reason: 1,
          cancellation_time: 1,
          cancelled_by: 1,
          charges: 1,
          closing_reason: 1,
          created_at: 1,
          end_time: 1,
          feedback: 1,
          hasFeedback: 1,
          for_verification: 1,
          hours: 1,
          is_completed: 1,
          isFree: 1,
          pricePerHour: 1,
          security_code: 1,
          start_time: 1,
          status: 1,
          updated_at: 1,
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);
  }
  getHiringsForAdmin(request, perPage, pageNo, sortBy) {
    return (
      Hiring.find(request)
        .select("-location")
        // .select("-actions -location")
        .populate([
          { path: "bellboyType", select: "title icon" },
          { path: "customer", select: "name mobile avatar" },
          {
            path: "cancellation_admin",
            select: "name contact_number avatar email",
          },
          { path: "bellboy", select: "name mobile avatar" },
          // {
          //     path: 'actions.actionType', populate: [
          //         { path: 'locales' },
          //         {
          //             path: 'labels',
          //             populate:
          //                 { path: 'locale' }
          //         },
          //     ],
          //     select: '-created_at -updated_at -__v'
          // }
        ])
        .skip((pageNo - 1) * perPage)
        .limit(perPage)
        .sort(sortBy)
    );
  }
  getHiringForAdminCustomer(request, perPage, pageNo) {
    return Hiring.find(request)
      .populate([
        { path: "bellboyType", select: "title icon" },
        { path: "bellboy", select: "name mobile avatar" },
      ])
      .select("hiring_id actions created_at status bellboy charges bellboyType")
      .sort("-created_at")
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
  }
  HiringTotalCount(request) {
    return Hiring.countDocuments(request);
  }
  HiringTotalCountForAdmin(request, perPage, pageNo) {
    return Hiring.countDocuments(request)
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
  }
  createHiring(request) {
    return new Hiring(request).save();
  }
  updateHiring(request, criteria) {
    console.log("request" + messages.arrowHead, request);
    console.log("criteria" + messages.arrowHead, criteria);
    return Hiring.findOneAndUpdate(request, criteria, { new: true }).populate([
      { path: "bellboy", select: "name mobile avatar" },
      { path: "customer", select: "name mobile avatar" },
      { path: "actions.actionType" },
      { path: "bellboy", select: "name mobile avatar" },
    ]);
  }
  deleteHiring(criteria) {
    return Hiring.findOneAndDelete(criteria).populate([
      { path: "bellboy", select: "name mobile avatar" },
      { path: "customer", select: "name mobile avatar" },
      { path: "actions.actionType" },
      { path: "bellboy", select: "name mobile avatar" },
    ]);
  }
  countHiringForAdminDashboardWithRequest(start, end, status) {
    return Hiring.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }, { status: status }],
        },
      },
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$created_at" },
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          count: { $sum: 1 },
          date: { $first: "$created_at" },
        },
      },
      {
        $project: {
          formattedDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
  }
  countHiringForAdminDashboard(start, end) {
    return Hiring.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }],
        },
      },
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$created_at" },
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          count: { $sum: 1 },
          date: { $first: "$created_at" },
        },
      },
      {
        $project: {
          formattedDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
  }
  getHiringsWithDateRange(start, end) {
    return Hiring.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }],
        },
      },
      {
        $lookup: {
          from: "bellboys",
          localField: "bellboy",
          foreignField: "_id",
          as: "bellboy",
        },
      },
      {
        $unwind: {
          path: "$bellboy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          hiring_id: 1,
          bellboy: {
            name: 1,
            _id: 1,
          },
          customer: {
            name: 1,
            _id: 1,
          },
          actions: {
            $size: "$actions",
          },
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ]);
  }
  getHiringsWithDateRangeWithRequest(start, end) {
    return Hiring.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }],
        },
      },
      { $sort: { created_at: -1 } },
    ]);
  }
  countData(start, end, dummyArray) {
    return Hiring.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }],
        },
      },
      // { '$sort': { 'created_at': -1 } },
      {
        $group: {
          _id: { $substr: ["$created_at", 0, 10] },
          count: { $sum: 1 },
          //  "time": { "$avg": "$created_at" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", views: "$count" } },
      { $group: { _id: null, data: { $push: "$$ROOT" } } },
      {
        $project: {
          data: {
            $map: {
              input: dummyArray,
              in: {
                k: "$$this",
                v: { $cond: [{ $in: ["$$this", "$data.date"] }, 1, 0] },
              },
            },
          },
        },
      },
      { $unwind: "$data" },
      { $group: { _id: "$data.k", count: { $sum: "$data.v" } } },
    ]);
  }
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  }
  getMonthHiring(id, month, year, status) {
    return Hiring.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
          status,
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$created_at",
            },
            month: {
              $month: "$created_at",
            },
          },
          hiringCount: {
            $sum: 1,
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $match: {
          "_id.month": month,
          "_id.year": year,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }

  getCurrentDayHiring(id, month, year, day,status=4) {
    return Hiring.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
          status
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: {
              $month: "$created_at",
            },
            day: {
              $dayOfMonth: "$created_at",
            },
          },
          hiringCount: {
            $sum: 1,
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $match: {
          "_id.day": day,
          "_id.month": month,
          "_id.year": year,
        },
      },
      // {
      //   $sort: {
      //     _id: -1,
      //   },
      // },
    ]);
  }

  getCurrentWeekHiring(id,status=4) {
    return Hiring.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
          status
        },
      },
      {
        $group: {
          _id: {
            week: {
              $week: "$created_at",
            },
          },
          hiringCount: {
            $sum: 1,
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
  }
}

module.exports = new HiringService();
