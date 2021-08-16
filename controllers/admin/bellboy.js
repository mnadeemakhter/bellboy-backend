const BellBoyService = require("../../services/bell-boy");
const HiringService = require("../../services/hirings");
const VehicleService = require("../../services/vehicle");
const ResponseService = require("../../common/response");
const apiError = require("../../common/api-errors");
const messages = require("../../common/messages");
const config = require("../../config/constants");
const helper = require("../../common/helper");
const apiErrors = require("../../common/api-errors");
const BellboyactivityService = require("../../services/bellboyactivity");
const nodemailer = require("nodemailer");
class BellBoyController {
  async getBellBoys(req, res) {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let perPage = parseInt(req.query.perPage) || 10;
      let search = req.query.search || "";
      let sortBy = req.query.sortBy || "-created_at";

      let filters = {
        name: new RegExp(search, "i"),
      };
      const count = {};

      if (
        req.query.status != 4 &&
        req.query.status >= 0 &&
        req.query.status <= 3
      ) {
        filters.status = parseInt(req.query.status) || 0;
        count.status = parseInt(req.query.status) || 0;
      }

      let total = await BellBoyService.bellboyTotalCount({ ...count });

      let bellBoys = await BellBoyService.getBellboys(
        filters,
        perPage,
        pageNo,
        sortBy
      );

      return res
        .status(200)
        .send(ResponseService.success({ bellBoys, count: total }));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async sendMail(req, res) {
    try {
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"danyroyal3786@gmail.com', // sender address
        to: "danyroyal3786@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      return res.status(200).send(ResponseService.success(info));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async getBellboyCompletedOrder(req, res) {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let perPage = parseInt(req.query.perPage) || 10;
      let data = Object.assign({}, req.params);

      let bellBoy = await BellBoyService.getBellboy({ _id: data.bellboy });

      if (!bellBoy) throw new apiErrors.ResourceNotFoundError("bellboy");

      // let hirings = await HiringService.getHiringsForAdmin({ bellboy: data.bellboy },pageNo,perPage);
      let hirings = await HiringService.getHiringsPaginated(
        { bellboy: data.bellboy },
        perPage,
        pageNo
      );
      const totalHiringsCount = await HiringService.HiringTotalCount({
        bellboy: data.bellboy,
      });
      const totalHiringsCountCompleted = await HiringService.HiringTotalCount({
        bellboy: data.bellboy,
        status: 4,
      });
      const totalHiringsCountCanclled = await HiringService.HiringTotalCount({
        bellboy: data.bellboy,
        status: 5,
      });

      return res.status(200).send(
        ResponseService.success({
          totalHiringsCountCompleted,
          totalHiringsCountCanclled,
          totalHiringsCount,
          hirings:hirings.map(h=>({...h._doc,hours:h.charges.totalTime,charges:undefined})),
        })
      );
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async getBellboyActivity(req, res) {
    try {
      let data = Object.assign({}, req.params);
      let query = req.query;
      let bellBoy = await BellBoyService.getBellboy({ _id: data.bellboy });
      if (!bellBoy) throw new apiErrors.ResourceNotFoundError("bellboy");
      let activity;
      if (query.by === "year") {
        activity = await BellboyactivityService.bellboyActivityByYear(
          req.params.bellboy
        );
      } else if (query.by === "month") {
        activity = await BellboyactivityService.bellboyActivityByMonth(
          req.params.bellboy
        );
      } else if (query.by === "day") {
        activity = await BellboyactivityService.bellboyActivityByday(
          req.params.bellboy
        );
      } else {
        return res.status(409).json({
          message: "invalid type",
          code: 409,
          data: {},
        });
      }
      return res.status(200).send(ResponseService.success({ activity }));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async getBellBoyDetail(req, res) {
    try {
      let data = Object.assign({}, req.params);

      let bellBoy = await BellBoyService.getBellboy({ _id: data.bellboy });

      if (!bellBoy) throw new apiErrors.ResourceNotFoundError("bellboy");
      const activity = await BellboyactivityService.BellboyTotalActiveTime(
        data.bellboy
      );

      let hirings = await HiringService.getHirings({
        bellboy: data.bellboy,
        status: 4,
      });
      let totalWorkingTime = await HiringService.getTotalWorkingTimebyId({
        bellboy: bellBoy._id,
        status: 4,
      });

      if (hirings.length > 0) {
        let total_hirings = hirings.length;
        let total_earnings = 0.0;
        // let total_working_hours = 0.0;
        hirings.forEach((hiring) => {
          total_earnings += hiring.charges.totalBill;
          // total_working_hours += hiring.charges.billingTime;
        });

        bellBoy.total_hirings = total_hirings;
        bellBoy.total_earnings = total_earnings;

        bellBoy.total_working_hours =
          totalWorkingTime.length > 0
            ? totalWorkingTime[0].workingTime / 60
            : 0;
        bellBoy = await bellBoy.save();
        console.log("==bellboy==", bellBoy);
      }
      let vehicles = [];
      vehicles = await VehicleService.getVehicles({ bellboy: data.bellboy });

      //            let detail = Object.assign(bellBoy,ve)

      return res
        .status(200)
        .send(ResponseService.success({ bellBoy, vehicles, activity }));
    } catch (error) {
      console.log(error);
      res.send(ResponseService.failure(error));
    }
  }
  async approveNIC(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data.status)
        throw new apiError.ValidationError(
          "status",
          messages.STATUS_VALIDATION
        );
      if (!(data.status >= 0 && data.status <= 2))
        throw new apiError.ValidationError(
          "status",
          messages.STATUS_ENUM_VALIDATION
        );
      if (!data.userId)
        throw new apiError.ValidationError(
          "userId",
          messages.USER_ID_VALIDATION
        );
      if (!helper.isValidMongoID(data.userId))
        throw new apiError.ValidationError(
          "userId",
          messages.INVALID_ID_VALIDATION
        );
      let user = await BellBoyService.updateBellboy(
        { "legals.nic.approval": data.status },
        { _id: data.userId }
      );
      if (!user) throw new apiError.UnexpectedError();
      return res.status(200).send(ResponseService.success(user));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async approveDrivingLicense(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data.status)
        throw new apiError.ValidationError(
          "status",
          messages.STATUS_VALIDATION
        );
      if (!(data.status >= 0 && data.status <= 2))
        throw new apiError.ValidationError(
          "status",
          messages.STATUS_ENUM_VALIDATION
        );
      if (!data.userId)
        throw new apiError.ValidationError(
          "userId",
          messages.USER_ID_VALIDATION
        );
      if (!helper.isValidMongoID(data.userId))
        throw new apiError.ValidationError(
          "userId",
          messages.INVALID_ID_VALIDATION
        );
      let user = await BellBoyService.updateBellboy(
        { "legals.driving_license.approval": data.status },
        { _id: data.userId }
      );
      if (!user) throw new apiError.UnexpectedError();
      return res.status(200).send(ResponseService.success(user));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async toggle(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data.bellboy)
        throw new apiErrors.ValidationError(
          "bellboy",
          messages.BELLBOY_ID_VALIDATION
        );
      if (!data.status)
        throw new apiErrors.ValidationError(
          "status",
          messages.STATUS_VALIDATION
        );
      if (!(data.status >= 0 && data.status <= 3))
        throw new apiError.ValidationError(
          "status",
          messages.STATUS_ENUM_VALIDATION
        );
      let user = await BellBoyService.getBellboy({ _id: data.bellboy });
      user.status = data.status;
      user = await user.save();
      if (!user) throw new apiError.UnexpectedError();
      return res.status(200).send(ResponseService.success(user));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async bellboyActivityForcurrent(req, res) {
    try {
      console.log("[bellboyActivity]");
      const user_id = req.params.id;
      const date = new Date();
      const month = date.getMonth() + 1;

      let [
        byMonthHiring,
        byDayHiring,
        byWeekHiring,
        byMonth,
        byCurrentDay,
        byWeek,
      ] = await Promise.all([
        HiringService.getMonthHiring(user_id, month, date.getFullYear(), 4),
        HiringService.getCurrentDayHiring(
          user_id,
          month,
          date.getFullYear(),
          date.getDate()
        ),
        HiringService.getCurrentWeekHiring(user_id),
        BellboyactivityService.bellboyActivityByMonthForBellboy(user_id, month),
        BellboyactivityService.bellboyActivityByCurrentDayBellBoy(
          user_id,
          date.getDate()
        ),
        BellboyactivityService.bellboyActivityByWeekForBellboy(user_id),
      ]);
      console.log("byMonthHiring =>", byMonthHiring);
      console.log("byDayHiring =>", byDayHiring);
      console.log("byWeekHiring =>", byWeekHiring);
      //   const byMonthHiring = await HiringService.getMonthHiring(
      //     user_id,
      //     month,
      //     4
      //   );
      //   const byDayHiring = await HiringService.getCurrentDayHiring(
      //     user_id,
      //     date.getDate()
      //   );
      //   const byWeekHiring = await HiringService.getCurrentWeekHiring(user_id);
      //   let byMonth =
      //     await BellboyactivityService.bellboyActivityByMonthForBellboy(
      //       user_id,
      //       month
      //     );
      //   let byCurrentDay =
      //     await BellboyactivityService.bellboyActivityByCurrentDayBellBoy(
      //       user_id,
      //       date.getDate()
      //     );
      //   let byWeek = await BellboyactivityService.bellboyActivityByWeekForBellboy(
      //     user_id
      //   );
      const yearActivity = byMonth.length
        ? { month: month, time: byMonth[0].totalTime }
        : { year: month, time: 0 };
      const dayActivity = byCurrentDay.length
        ? { date: date.toLocaleDateString(), time: byCurrentDay[0].totalTime }
        : { year: date.toLocaleDateString(), time: 0 };
      const weekActivity = byWeek.length
        ? { week: byWeek[0]._id.week, time: byWeek[0].totalTime }
        : { week: 0, time: 0 };
      const hiring = {
        byMonth: byMonthHiring.length
          ? {
              month: month,
              amount: byMonthHiring[0].amount,
              hiringCount: byMonthHiring[0].hiringCount,
            }
          : {
              month: month,
              amount: 0,
              hiringCount: 0,
            },
        byDay: byDayHiring.length
          ? {
              date: date.toLocaleDateString(),
              amount: byDayHiring[0].amount,
              hiringCount: byDayHiring[0].hiringCount,
            }
          : {
              date: date.toLocaleDateString(),
              amount: 0,
              hiringCount: 0,
            },
        byWeek: byWeekHiring.length
          ? {
              week: byWeekHiring[0]._id.week,
              amount: byWeekHiring[0].amount,
              hiringCount: byWeekHiring[0].hiringCount,
            }
          : {
              week: 0,
              amount: 0,
              hiringCount: 0,
            },
      };
      return res.send(
        ResponseService.success({
          activity: {
            byMonth: yearActivity,
            byCurrentDay: dayActivity,
            byWeek: weekActivity,
          },
          hiring,
        })
      );
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
}

module.exports = new BellBoyController();
