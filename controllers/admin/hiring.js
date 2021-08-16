const CategoryService = require("../../services/category");
const ProductService = require("../../services/product");
const BellBoyService = require("../../services/bell-boy");
const BellBoyTypeService = require("../../services/bellboy-type");
const CustomerService = require("../../services/customer");
const CartService = require("../../services/cart");
const HiringService = require("../../services/hirings");
const ResponseService = require("../../common/response");
const apiErrors = require("../../common/api-errors");
const PushNotificationService = require("../../common/push-notification");
const messages = require("../../common/messages");

const LocalizationService = require("../../common/localization");
const LocaleService = require("../../services/locales");
var axios = require("axios");

const mongoose = require("mongoose");
const cryptoRandomString = require("crypto-random-string");
const { token } = require("morgan");
const hiring = require("../../models/hiring");

var Pusher = require("pusher");
const dashboard = require("./dashboard");
const customer = require("../../models/customer");
const requestPromise = require("request-promise");
const config = require("../../config/config");
class HiringController {
  // /api/admin/hiring?perPage=10&pageNo=1&searchByBellBoyType=&searchByTime=&searchById=&searchByActions=&searchByName=a&searchByPhone=&searchByBellBoyName=&status=4
  async getHirings(req, res) {
    try {
      let data = Object.assign({}, req.query);
      console.log("query data", data);
      let pageNo = parseInt(req.query.pageNo || 1);
      let perPage = parseInt(req.query.perPage || 10);
      let searchById = req.query.searchById || "";
      let searchByBellBoyType = req.query.searchByBellBoy || "";
      let searchByTime = req.query.searchByTime;
      let searchByPhone = req.query.searchByPhone || "";
      let searchByName = req.query.searchByName || "";
      let searchByActions = Number(req.query.searchByActions);
      let searchByBellBoyName = req.query.searchByBellBoyName || "";
      searchByName = new RegExp(searchByName, "i");
      searchByPhone = new RegExp(searchByPhone, "ig");
      let sortBy = req.query.sortBy || "-created_at";

      let filters = {};
      // i dont kow
      filters["hiring_id"] = new RegExp(searchById.toLowerCase(), "i");

      searchByBellBoyType = new RegExp(searchByBellBoyType.toLowerCase(), "i");

      if (searchByActions) {
        filters["actions"] = { $size: searchByActions };
      } else if (searchByTime) {
        filters["hours"] = searchByTime;
      } else if (req.query.searchByName) {
        let customers = await CustomerService.getCustomers({
          name: searchByName,
        });
        let customerIds = [];
        if (customers.length > 0) {
          // get only ids of customers
          customerIds = customers.map((customer) => customer._id);

          filters["customer"] = { $in: customerIds };
        }
      } else if (req.query.searchByPhone) {
        let customers = await CustomerService.getCustomers({
          mobile: searchByPhone,
        });
        let customerIds = [];
        console.log("customers.length", customers.length);
        if (customers.length > 0) {
          // get only ids of customers
          customerIds = customers.map((customer) => customer._id);

          filters["customer"] = { $in: customerIds };
        }
      }

      if (req.query.searchByBellBoy) {
        let bellboyTypes = await BellBoyTypeService.getBellBoyTypes({
          title: searchByBellBoyType,
        });
        let bellboyTypesIds = [];
        if (bellboyTypes.length > 0) {
          bellboyTypesIds = bellboyTypes.map((bellboyType) => bellboyType._id);
          // bellboyTypes.forEach(bellboyType => {
          //     bellboyTypesIds.push(bellboyType._id);
          // });

          filters["bellboyType"] = { $in: bellboyTypesIds };
        }
      }
      if (req.query.searchByBellBoyName) {
        console.log(
          "req.query.searchByBellBoyName=>",
          req.query.searchByBellBoyName
        );

        let bellboys = await BellBoyService.getBellboysSimply({
          name: new RegExp(req.query.searchByBellBoyName || "", "i"),
        });
        console.log("bellboys==>>", bellboys);
        let bellboyIds = [];
        if (bellboys.length > 0 && searchByBellBoyName) {
          bellboyIds = bellboys.map((bellboy) => bellboy._id);
          filters["bellboy"] = { $in: bellboyIds };
        }
      }

      //      filters['searchByBellBoy']= new RegExp(searchByBellBoy, 'i');
      //      filters['hiring_id']= new RegExp(searchByBellBoy, 'i');

      if (data.status) {
        filters.status = data.status;
      }
      if (data.customer) {
        filters.customer = data.customer;
      }

      if (data.bellboy) {
        filters.bellboy = data.bellboy;
      }

      if (data.bellboyType) {
        filters.bellboyType = data.bellboyType;
      }
      // let data = Object.assign({}, req.query);
      if(data.currentStartDate){
        console.log(data.currentStartDate);
        var currentStartDate = data.currentStartDate
          ? new Date(data.currentStartDate)
          : new Date();
  
        var currentEndDate = data.currentEndDate
          ? new Date(data.currentEndDate)
          : currentStartDate;
        filters["$and"]= [{ created_at: { $gt: new Date(currentStartDate.setUTCHours(0, 0, 0, 0)), $lt: new Date(currentEndDate.setUTCHours(24)) } }];
      }

      let total = await HiringService.HiringTotalCount(filters);

      let hirings = await HiringService.getHiringsForAdmin(
        filters,
        perPage,
        pageNo,
        sortBy
      );
      hirings = hirings.map((hire) => {
        return {
          ...hire._doc,
          totalActions: hire.actions.length,
          actions: undefined,
        };
      });

      return res
        .status(200)
        .send(ResponseService.success({ hirings: hirings, count: total }));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  async getHiringDetail(req, res) {
    try {
      let data = Object.assign({}, req.params);

      if (!data.hiring_id)
        throw new apiErrors.ValidationError(
          "hiring_id",
          messages.ID_VALIDATION
        );

      let request = { hiring_id: data.hiring_id };

      let hiring = await HiringService.getHiring(request);

      if (!hiring) throw new apiErrors.ResourceNotFoundError("hiring_id");

      return res.status(200).send(ResponseService.success(hiring));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  async getBellBoys(req, res) {
    try {
      let request = {
        working_status: true,
        is_busy: false,
        status: { $ne: 3 },
      };
      let total = await BellBoyService.bellboyTotalCount(request);

      let bellBoys = await BellBoyService.getBellboysForAdmin(request);

      return res
        .status(200)
        .send(ResponseService.success({ bellBoys, count: total }));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async assignBellBoy(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data.hiring_id)
        throw new apiErrors.ValidationError(
          "hiring_id",
          messages.HIRING_ID_VALIDATION
        );
      if (!data.bellboy)
        throw new apiErrors.ValidationError(
          "bellboy",
          messages.BELLBOY_ID_VALIDATION
        );

      let hiring = await HiringService.getHiring({ _id: data.hiring_id });
      if (!hiring)
        throw new apiErrors.ResourceNotFoundError("hiring", "No Hiring Found");

      hiring = await HiringService.getHiring({
        _id: data.hiring_id,
        status: { $gt: 1, $lt: 3 },
        is_completed: false,
      });
      if (hiring)
        return res.send(ResponseService.success({}, "Already Assigned", false));

      hiring = await HiringService.getHiring({
        _id: data.hiring_id,
        status: { $gte: 6 },
      });
      if (hiring)
        return res.send(
          ResponseService.success({}, "No Operations can be perform", false)
        );

      hiring = await HiringService.getHiring({ _id: data.hiring_id });

      let bellboy = await BellBoyService.getBellboy({ _id: data.bellboy });
      if (!bellboy)
        throw new apiErrors.ResourceNotFoundError(
          "bellboy",
          "No BellBoy exists with this ID"
        );
      else {
        bellboy = await BellBoyService.getBellboy({
          _id: data.bellboy,
          working_status: true,
          is_busy: false,
          status: { $eq: 1 },
        });
        if (!bellboy)
          throw new apiErrors.ResourceNotFoundError(
            "bellboy",
            "This BellBoy is either not approved or is busy in another work"
          );
        else {
          hiring.bellboy = data.bellboy;

          hiring.status = 2;

          await BellBoyService.updateBellboy(
            { busy_in: 2, is_busy: true },
            { _id: data.bellboy }
          );

          hiring = await hiring.save();
          hiring = await HiringService.getHiring({ _id: data.hiring_id });

          await PushNotificationService.notifySingleDevice(
            {
              title: "Hiring Recieved",
              body: "BellBoy " + hiring.bellboy.name + " is at your service ",
            },
            hiring.customer.fcm_token,
            { _id: hiring._id.toString(), type: "1" }
          );

          await PushNotificationService.notifySingleDevice(
            {
              title: "Hiring Recieved",
              body: "BellBoy " + hiring.bellboy.name + " you have being hired",
            },
            hiring.bellboy.fcm_token,
            { _id: hiring._id.toString(), type: "2" }
          );
          var pusher = new Pusher({
            appId: "1066075",
            key: "f5e123fc41355db6d971",
            secret: "b2eb6db623527a7656af",
            cluster: "ap2",
            encrypted: true,
          });
          console.log("customer =>", hiring.customer.location);
          pusher.trigger("my-channel", hiring.bellboy._id.toString(), {
            _id: hiring._id.toString(),
            hours: hiring.hours.toString(),
            hiring_id: hiring.hiring_id.toString(),
            customer: {
              name: hiring.customer.name,
              _id: hiring.customer._id,
              mobile: hiring.customer.mobile,
              address: hiring.location.address || "",
            },
          });

          // for real time but not tested
          // const socketUser = req.app.io;
          // const DashboardDetails=await dashboard.getDashboardDetails({});
          // socketUser.emit(`dashboard`,DashboardDetails);
          return res.send(
            ResponseService.success(hiring, "BellBoy Assigned", true)
          );
        }
      }
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async closeHiring(req, res) {
    try {
      let data = Object.assign({}, req.body);
      const user_id = req._user_info._user_id;
      if (!data.hiring_id)
        throw new apiErrors.ValidationError(
          "hiring_id",
          messages.ID_VALIDATION
        );
      if (!data.reason)
        throw new apiErrors.ValidationError(
          "reason",
          messages.REASON_VALIDATION
        );

      let hiring = await HiringService.getHiring({ _id: data.hiring_id });
      var status = Number(hiring.status);
      if (status === 5)
        return res
          .status(200)
          .send(ResponseService.success({}, "Hiring Already cancelled", false));
      if (status >= 1 && status < 4) {
        if (status == 3) {
          hiring.is_completed = true;
          hiring.for_verification = false;

          hiring.closing_reason = data.reason;
          hiring.status = 4;
          hiring.cancellation_time = Date.now();

          await hiring.save();
          await BellBoyService.updateBellboy(
            { busy_in: 0, is_busy: false },
            { _id: hiring.bellboy }
          );
          hiring = await HiringService.getHiring({ _id: data.hiring_id });
          await PushNotificationService.notifySingleDevice(
            {
              title: "Great Work",
              body:
                "BellBoy " + hiring.bellboy.name + " you have done a great job",
            },
            hiring.bellboy.fcm_token,
            { _id: hiring._id.toString(), type: "2" }
          );
        } else if (status === 1) {
          hiring.status = 5;
          hiring.cancellation_reason = data.reason;
          hiring.cancelled_by = 3;
          hiring.cancellation_admin = user_id;
          hiring.cancellation_time = Date.now();
          hiring = await hiring.save();
          console.log("hiring==>>", hiring.bellboy);
          console.log(hiring.customer);
          // await PushNotificationService.notifySingleDevice({
          //     title: 'Sorry Champ',
          //     body: 'BellBoy ' + hiring.bellboy.name + ' your hiring has been cancelled',
          // }, hiring.bellboy.fcm_token, { _id: hiring._id.toString(), type: '1' });
          await PushNotificationService.notifySingleDevice(
            {
              title: "Sorry for inconvenience",
              body:
                "Customer " +
                hiring.customer.name +
                " your hiring has been closed by admin",
            },
            hiring.customer.fcm_token,
            { _id: hiring._id.toString(), type: "1" }
          );
        } else {
          hiring.status = 5;
          hiring.cancellation_reason = data.reason;
          hiring.cancelled_by = 3;
          hiring.cancellation_admin = user_id;
          hiring.cancellation_time = Date.now();
          hiring = await hiring.save();
          await PushNotificationService.notifySingleDevice(
            {
              title: "Sorry Champ",
              body:
                "BellBoy " +
                hiring.bellboy.name +
                " your hiring has been cancelled",
            },
            hiring.bellboy.fcm_token,
            { _id: hiring._id.toString(), type: "1" }
          );
          await PushNotificationService.notifySingleDevice(
            {
              title: "Sorry for inconvenience",
              body:
                "Customer " +
                hiring.customer.name +
                " your hiring has been closed by admin",
            },
            hiring.customer.fcm_token,
            { _id: hiring._id.toString(), type: "1" }
          );
        }
        await BellBoyService.updateBellboy(
          { busy_in: 0, is_busy: false },
          { _id: hiring.bellboy._id || "" }
        );
        // // for real time but not tested
        // const socketUser = req.app.io;
        // const DashboardDetails=await dashboard.getDashboardDetails({});
        // socketUser.emit(`dashboard`,DashboardDetails);
        return res.status(200).send(ResponseService.success(hiring));
      } else {
        return res
          .status(200)
          .send(
            ResponseService.success(
              {},
              "Hiring Cannot be cancelled at this stage",
              false
            )
          );
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  }

  async getHiringByCustomerIdAdmin(req, res) {
    try {
      let pageNo = parseInt(req.query.pageNo || 1);
      let perPage = parseInt(req.query.perPage || 10);
      let data = Object.assign({}, req.params);

      let hirings = [];
      let customer = await CustomerService.getCustomerForAdmin({
        _id: data.customer,
      });

      hirings = await HiringService.getHiringForAdminCustomer(
        {
          customer: data.customer,
        },
        perPage,
        pageNo
      );
      return res.send(ResponseService.success({ hirings }));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async getEstimatedDistance(req, res) {
    try {
      const data = req.query;

      var axiosConfig = {
        method: "get",
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${data.origin}&destination=${data.destination}&key=${config.googleMapApiKey}`,
        headers: {},
      };

      const responce = await axios(axiosConfig);

      return res.send(ResponseService.success({ distance: responce.data }));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  // async getHiringByDate(req, res) {
  //   try {
  //     // let pageNo = parseInt(req.query.pageNo || 1);
  //     // let perPage = parseInt(req.query.perPage || 10);
  //     let data = Object.assign({}, req.query);
  //     console.log(data.currentStartDate);
  //     var currentStartDate = data.currentStartDate
  //       ? new Date(data.currentStartDate)
  //       : new Date();
  //     // let valid = !isNaN(currentStartDate.valueOf());
  //     // if (!valid) currentStartDate = new Date();
  //     currentStartDate.setUTCHours(0, 0, 0, 0);

  //     var currentEndDate = data.endDateForRecords
  //       ? new Date(data.endDateForRecords)
  //       : currentStartDate;
  //     // valid = !isNaN(currentEndDate.valueOf());
  //     // if (!valid) currentEndDate = new Date();

  //     currentEndDate.setHours(23, 59, 59, 999);
  //     console.log(currentStartDate, currentEndDate);
  //     let hirings = [];
  //     hirings = await HiringService.getHiringByDateForAdmin(
  //       new Date(currentStartDate.setUTCHours(0, 0, 0, 0)),
  //       new Date(currentEndDate.setUTCHours(24))
  //     );
  //     // hirings = await HiringService.getHiringsForAdmin(
  //     //   new Date(currentStartDate.setUTCHours(0, 0, 0, 0)),
  //     //   new Date(currentEndDate.setUTCHours(24))
  //     // );
  //     // $and: [{ created_at: { $gt: start, $lt: end } }],
  //     return res.send(ResponseService.success({ hirings }));
  //   } catch (error) {
  //     res.send(ResponseService.failure(error));
  //   }
  // }
}

module.exports = new HiringController();
