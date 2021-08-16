const BellboyService = require("./bell-boy");
const BellboyActivity = require("../models/bellboyactivity");
// const BellBoyService = require('./bell-boy')
const mongoose = require("mongoose");
class ActivityService {
  newActivity(request) {
    return new BellboyActivity(request);
  }
  addActivity(request) {
    return BellboyActivity.findOne(request);
  }
  findActivity(request) {
    return BellboyActivity.findOne(request);
  }
  BellboyTotalActiveTime(Id) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(Id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
        },
      },
      {
        $group: {
          _id: "$bellboy",
          totalTime: {
            $sum: "$time",
          },
        },
      },
    ]);
  }

  bellboyActivityByYear(id) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
        },
      },
      {
        $group: {
          _id: {
            bellboy: "$bellboy",
            year: {
              $year: "$created_at",
            },
          },
          totalTime: {
            $sum: "$time",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }

  // bellboyActivityByYearForBellboy(id, year) {
  //   return BellboyActivity.aggregate([
  //     {
  //       $match: {
  //         bellboy: mongoose.Types.ObjectId(id),
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$track",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $addFields: {
  //         time: {
  //           $subtract: ["$track.end", "$track.start"],
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           bellboy: "$bellboy",
  //           year: {
  //             $year: "$created_at",
  //           },
  //         },
  //         totalTime: {
  //           $sum: "$time",
  //         },
  //       },
  //     },
  //     {
  //       $match: {
  //         "_id.year": year,
  //       },
  //     },
  //     {
  //       $sort: {
  //         _id: -1,
  //       },
  //     },
  //   ]);
  // }

  bellboyActivityByMonth(id) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
        },
      },
      {
        $group: {
          _id: {
            bellboy: "$bellboy",
            year: {
              $year: "$created_at",
            },
            month: {
              $month: "$created_at",
            },
          },
          totalTime: {
            $sum: "$time",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }
  bellboyActivityByday(id) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
          year: {
            $year: "$created_at",
          },
        },
      },
      {
        $group: {
          _id: {
            bellboy: "$bellboy",
            year: "$year",
            month: {
              $month: "$created_at",
            },
            day: {
              $dayOfMonth: "$created_at",
            },
          },
          totalTime: {
            $sum: "$time",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }
  bellboyActivityByWeekForBellboy(id) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
        },
      },
      {
        $group: {
          _id: {
            bellboy: "$bellboy",
            week: {
              $week: "$created_at",
            },
          },
          totalTime: {
            $sum: "$time",
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
  bellboyActivityByMonthForBellboy(id, month) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
        },
      },
      {
        $group: {
          _id: {
            bellboy: "$bellboy",
            year: {
              $year: "$created_at",
            },
            month: {
              $month: "$created_at",
            },
          },
          totalTime: {
            $sum: "$time",
          },
        },
      },
      {
        $match: {
          "_id.month": month,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }

  bellboyActivityByCurrentDayBellBoy(id, day) {
    return BellboyActivity.aggregate([
      {
        $match: {
          bellboy: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$track",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          time: {
            $subtract: ["$track.end", "$track.start"],
          },
          year: {
            $year: "$created_at",
          },
        },
      },
      {
        $group: {
          _id: {
            bellboy: "$bellboy",
            year: "$year",
            month: {
              $month: "$created_at",
            },
            day: {
              $dayOfMonth: "$created_at",
            },
          },
          totalTime: {
            $sum: "$time",
          },
        },
      },
      {
        $match: {
          "_id.day": day,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }
  async main(removedUser) {
    console.log(removedUser);
    const date = new Date();

    let activity = await this.findActivity({
      bellboy: removedUser._id,
      $expr: {
        $and: [
          {
            $eq: [{ $year: "$created_at" }, date.getFullYear()],
          },
          {
            $eq: [{ $month: "$created_at" }, date.getMonth() + 1],
          },
          {
            $eq: [{ $dayOfMonth: "$created_at" }, date.getDate()],
          },
        ],
      },
    });
    if (!activity) {
      activity = this.newActivity({
        bellboy: removedUser._id,
      });
    }

    activity.track.push({
      start: removedUser.start,
      end: Date.now(),
      date: Date.now(),
    });

    await Promise.all([
      activity.save(),
      BellboyService.updateBellboyLastSeen({ _id: removedUser._id }),
    ]);
  }
}

module.exports = new ActivityService();
