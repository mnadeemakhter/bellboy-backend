const BellBoyService = require("../../services/bell-boy");
const BellboyactivityService = require("../../services/bellboyactivity");
const BellBoyTypeService = require("../../services/bellboy-type");
const ResponseService = require("../../common/response");
const apiErrors = require("../../common/api-errors");
const messages = require("../../common/messages");
const VehicleService = require("../../services/vehicle");
const HiringService = require("../../services/hirings");
const {
  addPoliceCertificateValidationData,
} = require("../../validation/bellboy");

const mongoose = require("mongoose");
class UserController {
  async getProfile(req, res) {
    try {
      const user_id = req._user_info._user_id;
      let bellBoy = await BellBoyService.getBellboy({ _id: user_id });
      if (!bellBoy)
        throw new apiErrors.ValidationError(
          "token",
          messages.AUTHENTICATION_ERROR
        );

      let fetchedData = [];
      fetchedData = await VehicleService.getVehicles({ bellboy: user_id });
      let countData = fetchedData.length;

      var b = bellBoy.toJSON();
      var obj = Object.assign(b, { totalVehicles: countData });

      return res.send(ResponseService.success(obj));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async bellboyActivity(req, res) {
    try {
      console.log("[bellboyActivity]");
      const user_id = req._user_info._user_id;
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
        HiringService.getMonthHiring(user_id, month,date.getFullYear(), 4),
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
        hiringByMonth: byMonthHiring.length
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
        hiringByDay: byDayHiring.length
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
        hiringByWeek: byWeekHiring.length
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
            activityByMonth: yearActivity,
            activityByCurrentDay: dayActivity,
            activityByWeek: weekActivity,
          },
          hiring,
        })
      );
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }

  async updateProfile(req, res) {
    try {
      let data = Object.assign({}, req.body);
      console.log(data);
      console.log(data);
      const user_id = req._user_info._user_id;

      if (!data.name)
        throw new apiErrors.ValidationError("name", messages.NAME_VALIDATION);
      if (!data.gender)
        throw new apiErrors.ValidationError(
          "gender",
          messages.GENDER_VALIDATION
        );
      if (!data.email)
        throw new apiErrors.ValidationError("email", messages.EMAIL_VALIDATION);
      if (!data.mobile)
        throw new apiErrors.ValidationError(
          "mobile",
          messages.MOBILE_VALIDATION
        );

      if (data.mobile) {
        let dupBellBoy = await BellBoyService.getBellboy({
          mobile: data.mobile,
          _id: { $ne: user_id },
        });
        if (dupBellBoy)
          throw new apiErrors.ResourceAlreadyExistError(
            "mobile",
            messages.RESOURCE_ALREADY_EXISTS
          );
      }

      if (data.email) {
        let dupBellBoy = await BellBoyService.getBellboy({
          email: data.email,
          _id: { $ne: user_id },
        });
        if (dupBellBoy)
          throw new apiErrors.ResourceAlreadyExistError(
            "email",
            messages.RESOURCE_ALREADY_EXISTS
          );
      }

      let avatar;
      if (req.file) {
        // avatar = req.file.destination + '/' + req.file.filename;
        avatar = req.file.key;

        data.avatar = {
          value: avatar,
          exists: true,
        };
      }
      let bellBoy = await BellBoyService.updateBellboy(data, { _id: user_id });

      if (!bellBoy) throw new apiErrors.UnexpectedError();

      return res.send(ResponseService.success(data));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }

  async addNIC(req, res) {
    try {
      let user_id = req._user_info._user_id;
      let data = Object.assign({}, req.body);

      if (!req.files["front_image"])
        throw new apiErrors.ValidationError(
          "front_image",
          messages.IMAGE_VALIDATION
        );
      if (!req.files["back_image"])
        throw new apiErrors.ValidationError(
          "back_image",
          messages.IMAGE_VALIDATION
        );
      if (!data.expiry_date)
        throw new apiErrors.ValidationError(
          "expiry_date",
          messages.EXPIRY_DATE_VALIDATION
        );
      if (!data.value)
        throw new apiErrors.ValidationError(
          "value",
          messages.NIC_NUMBER_VALIDATION
        );
      let nicLength = data.value.toString().length;
      console.log(nicLength);
      if (!(nicLength > 1 && nicLength < 14))
        throw new apiErrors.ValidationError(
          "value",
          messages.NIC_LENGTH_VALIDATION
        );

      data.expiry_date = Date.now();
      let front_image = req.files.front_image[0];
      let back_image = req.files.back_image[0];

      data.front_image = front_image.key;
      data.back_image = back_image.key;
      data.exists = true;

      let updatedBellBoy = await BellBoyService.updateBellboy(
        { "legals.nic": data },
        { _id: user_id }
      );
      if (!updatedBellBoy) throw new apiErrors.UnexpectedError();
      res.send(ResponseService.success(updatedBellBoy));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }

  async addDrivingLicense(req, res) {
    try {
      let user_id = req._user_info._user_id;
      let data = Object.assign({}, req.body);

      if (!req.files["front_image"])
        throw new apiErrors.ValidationError(
          "front_image",
          messages.IMAGE_VALIDATION
        );
      if (!req.files["back_image"])
        throw new apiErrors.ValidationError(
          "back_image",
          messages.IMAGE_VALIDATION
        );
      if (!data.expiry_date)
        throw new apiErrors.ValidationError(
          "expiry_date",
          messages.EXPIRY_DATE_VALIDATION
        );
      if (!data.value)
        throw new apiErrors.ValidationError(
          "value",
          messages.NIC_NUMBER_VALIDATION
        );

      let front_image = req.files.front_image[0].key;
      let back_image = req.files.back_image[0].key;

      data.front_image = front_image;
      data.back_image = back_image;
      data.exists = true;

      let updatedBellBoy = await BellBoyService.updateBellboy(
        { "legals.driving_license": data },
        { _id: user_id }
      );
      if (!updatedBellBoy) throw new apiErrors.UnexpectedError();
      res.send(ResponseService.success(updatedBellBoy));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }

  async addPoliceCertificate(req, res, next) {
    try {
      let user_id = req._user_info._user_id;
      let data = Object.assign({}, req.body);

      let validationResult = addPoliceCertificateValidationData(req.body);
      if (validationResult) {
        return next({ code: 422, message: validationResult });
      }
      if (!req.file)
        throw new apiErrors.ValidationError("image", messages.IMAGE_VALIDATION);
      let image = req.file.key;

      data.image = image;
      data.exists = true;
      data.no = data.character_certificate_no;
      data.date_of_issue = data.date_of_issue;
      console.log(data);
      let updatedBellBoy = await BellBoyService.updateBellboy(
        { "legals.character_certificate": data },
        { _id: user_id }
      );
      if (!updatedBellBoy) throw new apiErrors.NotFoundError();
      res.send(ResponseService.success(updatedBellBoy));
    } catch (error) {
      console.log(error);
      res.send(ResponseService.failure(error));
    }
  }

  async registerToken(req, res) {
    try {
      let user_id = req._user_info._user_id;
      let data = Object.assign({}, req.body);

      let bellBoy = await BellBoyService.getBellboy({ _id: user_id });
      if (!bellBoy) throw new apiErrors.NotFoundError("bellboy");

      bellBoy.fcm_token = data.fcm_token;
      bellBoy = await bellBoy.save();
      res.send(ResponseService.success(bellBoy));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }

  async toggleOnlineStatus(req, res) {
    try {
      const user_id = req._user_info._user_id;

      let bellBoy = await BellBoyService.getBellboy({ _id: user_id });

      let reasons = [];

      if (!bellBoy) throw new apiErrors.ResourceNotFoundError("bellboy");

      if (bellBoy.status != 1) {
        reasons.push("You are not allowed by admins");
      }

      // if (bellBoy.legals.nic.approval != 1) {
      //     if (!bellBoy.legals.nic.exists)
      //         reasons.push('Please provide your id card details')
      //     else
      //         reasons.push('Your ID Card is not Approved Yet')

      // }

      // if (bellBoy.legals.driving_license.approval != 1) {
      //     if (!bellBoy.legals.driving_license.exists)
      //         reasons.push('Please provide your driving license details')
      //     else
      //         reasons.push('Your Driving License is not Approved Yet')

      // }

      if (reasons.length > 0)
        res.send(
          ResponseService.success(
            reasons,
            "Please provide these details",
            false
          )
        );
      else {
        bellBoy.working_status = !bellBoy.working_status;

        bellBoy = await bellBoy.save();

        return res.send(ResponseService.success(reasons));
      }
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async toggleBellBoyType(req, res) {
    try {
      let data = Object.assign({}, req.body);
      const user_id = req._user_info._user_id;

      let bellBoy = await BellBoyService.getBellboy({ _id: user_id });

      if (!bellBoy) throw new apiErrors.ResourceNotFoundError("bellboy");

      bellBoy.bellboyType = data.bellboyType;

      bellBoy = await BellBoyService.updateBellboy(
        { bellboyType: data.bellboyType },
        { _id: user_id }
      );

      return res.send(ResponseService.success(bellBoy));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
}

module.exports = new UserController();
