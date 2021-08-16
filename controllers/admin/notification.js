const CustomerService = require("./../../services/customer");
const NotificationService = require("./../../services/notification");
const ResponseService = require("./../../common/response");

//Error Handling
const messages = require("../../common/messages");
const apiErrors = require("../../common/api-errors");
const PushNotificationService = require("../../common/push-notification");

const mongoose = require("mongoose")
class NotificationController {
  // done
  async sendNotificationToSingleDevice(req, res) {
    try {
      let data = req.body;
      console.log("data==>>",data)
      if (!data.title)
        throw new apiErrors.ValidationError("title", messages.TITLE_VALIDATION);
      if (!data.body)
        throw new apiErrors.ValidationError("body", messages.BODY_VALIDATION);

      let query = Object.assign({}, req.query);
      if (query.type === "3") {
        let imageUrl = {};
        if (req.file) {
          imageUrl.exists = true;
          imageUrl.value = req.file.key;
        } else {
          imageUrl.exists = false;
          imageUrl.value = "";
        }
        const { _id } = await NotificationService.addNotification({
          ...data,
          type: 3,
          from: "admin",
          admin: req._user_info._user_id,
          imageUrl,
        });
        await NotificationService.addNotificationSingleUser({
          notification: _id,
          customer: req.body.userId,
        });
        const customer = await CustomerService.getCustomerFcmToken({
          _id: req.body.userId,
        });
        if (!customer) throw new apiErrors.NotFoundError();
        await PushNotificationService.notifySingleDevice(
          {
            title: data.title,
            body: data.body,
            imageUrl:
              "https://bellboy-global-bucket.s3.amazonaws.com/" +
              imageUrl.value,
          },
          customer.fcm_token,
          { _id: customer._id.toString(), type: "3" }
        );

        return res.status(200).send(
          ResponseService.success({
            message: `Notification sent to  ${customer.name}`,
          })
        );
      }

      return res.status(200).send(ResponseService.success({}));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  // done
  async sendNotificationToMultipleDevice(req, res) {
    try {
      let data = req.body;
      if (!data.title)
        throw new apiErrors.ValidationError("title", messages.TITLE_VALIDATION);
      if (!data.body)
        throw new apiErrors.ValidationError("body", messages.BODY_VALIDATION);
      
        if (!data.userId)
        throw new apiErrors.ValidationError("userId", messages.BODY_VALIDATION);


      let query = Object.assign({}, req.query);
      let customersFcmToken;
      if (query.type === "3") {
        const customers = await CustomerService.getCustomersFcmToken({
          _id: {
            $in: req.body.userId,
          },
        });

        if (!customers) {
          throw new apiErrors.NotFoundError();
        } else {
          customersFcmToken = customers.filter((customer) => {
            if (customer.fcm_token) {
              return customer.fcm_token;
            }
          });
          customersFcmToken = customersFcmToken.map((customer) => {
            if (customer.fcm_token) {
              return customer.fcm_token;
            }
          });
        }

        let imageUrl = {};
        if (req.file) {
          imageUrl.exists = true;
          imageUrl.value = req.file.key;
        } else {
          imageUrl.exists = false;
          imageUrl.value = "";
        }

        await PushNotificationService.notifyMultipleDevices(
          {
            title: data.title,
            body: data.body,
            imageUrl:
              "https://bellboy-global-bucket.s3.amazonaws.com/" +
              imageUrl.value,
          },
          customersFcmToken,
          { type: "3" }
        );
        const { _id } = await NotificationService.addNotification({
          ...data,
          type: 3,
          from: "admin",
          admin: req._user_info._user_id,
          imageUrl,
        });
        const notificationData = customers.map((customer) => {
          return {
            notification: _id,
            customer: customer._id,
          };
        });
        await NotificationService.addNotificationManyUser(notificationData);

        return res.status(200).send(
          ResponseService.success({
            message: `Notification sent to selected devices`,
          })
        );
      }

      // let newData = await AdvertisementService.addAdvertisement(data);
      // if (!newData) throw new apiErrors.UnexpectedError();

      return res.status(200).send(ResponseService.success({}));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  
  async getNotfications(req, res) {
    try {
      let perPage = parseInt(req.query.perPage || 10);
      let pageNo = parseInt(req.query.pageNo || 1);
      const notificationCount=await NotificationService.getNotificationsforAdminCount();
      const notifications = await NotificationService.getNotificationsforAdmin({},perPage,pageNo);
      if (!notifications) throw new apiErrors.NotFoundError();
      if (notifications)
        return res.status(200).send(
          ResponseService.success({
            notifications,
            notificationCount
          })
        );
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  async deleteNotfication(req, res) {
    try {
      let data = req.body;
      await NotificationService.deleteNotification(
        { _id: req.params.id },
        req._user_info._user_id
      );

      return res.status(200).send(
        ResponseService.success({
          message: "Notification Delete",
        })
      );
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  async getSingleNotification(req, res) {
    try {
      let notification = await NotificationService.getNotificationforAdmin({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (!notification) throw new apiErrors.NotFoundError();

      return res.status(200).send(
        ResponseService.success({
          notification,
        })
      );
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }

  // working on it
  async sendNotificationToTopic(req, res) {
    try {
      let data = req.body;
      if (!data.title)
        throw new apiErrors.ValidationError("title", messages.TITLE_VALIDATION);
      if (!data.body)
        throw new apiErrors.ValidationError("body", messages.BODY_VALIDATION);
      if (!data.topic)
        throw new apiErrors.ValidationError("Topic", messages.TOPIC_VALIDATION);

      // let query = Object.assign({}, req.query);
      // let customersFcmToken;
      // if (query.type === "3") {
      //   console.log(req.body.userIds);
      //   const customers = await CustomerService.getCustomersFcmToken({
      //     _id: {
      //       $in: req.body.userIds,
      //     },
      //   });

      //   if (!customers) {
      //     throw new apiErrors.NotFoundError();
      //   } else {
      //     console.log("customers,=>", customers);
      //     customersFcmToken = customers.filter((customer) => {
      //       if (customer.fcm_token) {
      //         return customer.fcm_token;
      //       }
      //     });
      //     customersFcmToken = customersFcmToken.map((customer) => {
      //       if (customer.fcm_token) {
      //         return customer.fcm_token;
      //       }
      //     });
      //   }

      //   console.log("customersFcmToken==>>", customersFcmToken);

      //   await PushNotificationService.notifyMultipleDevices(
      //     {
      //       title: "About Bellboy",
      //       body: `Filling the gap in daily household and outdoor needs, our mobile application offers a unique service for you to conveniently hire-a-bellboy as “your personal assistant” for a certain period of time, to do multiple or specific outdoor jobs, for example, research of any product or market (sanitary market prices & latest pictures or school’s visits to collect prospectus), distribute marriage invitations on your behalf, get the laundry, parcel/gift delivery or courier, exchange from a certain store etc.`,
      //     },
      //     customersFcmToken,
      //     { type: "3" }
      //   );
      //   await NotificationService.addNotification({
      //     ...data,
      //     type: 3,
      //     customers: req.body.userIds,
      //     to: "Multiple Customer",
      //     count: 1,
      //   });

      //   return res.status(200).send(
      //     ResponseService.success({
      //       message: `Notification sent to selected devices`,
      //     })
      //   );
      // }

      return res.status(200).send(ResponseService.success({ data: req.body }));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
// done
  async sendNotificationToPakistaniUser(req, res) {
    try {
      let data = req.body;
      if (!data.title)
        throw new apiErrors.ValidationError("title", messages.TITLE_VALIDATION);
      if (!data.body)
        throw new apiErrors.ValidationError("body", messages.BODY_VALIDATION);

      let query = Object.assign({}, req.query);
      let customersFcmToken,
        customersids = [];

      if (query.type === "3") {
        const customers = await CustomerService.getCustomersFcmToken({
          mobile: /^\+923/,
        });
        if (!customers) {
          throw new apiErrors.NotFoundError();
        } else {
          customersFcmToken = customers.filter((customer) => {
            if (customer.fcm_token) {
              return customer.fcm_token;
            }
          });
          customersids = customersFcmToken.map((customer) => customer._id);
          customersFcmToken = customersFcmToken.map((customer) => {
            if (customer.fcm_token) {
              return customer.fcm_token;
            }
          });
        }
        let imageUrl = {};
        if (req.file) {
          imageUrl.exists = true;
          imageUrl.value = req.file.key;
        } else {
          imageUrl.exists = false;
          imageUrl.value = "";
        }
        // uncomment this code when in production
        await PushNotificationService.notifyMultipleDevices(
          {
            title: data.title,
            body: data.body,
            imageUrl:
              "https://bellboy-global-bucket.s3.amazonaws.com/" +
              imageUrl.value,
          },
          customersFcmToken,
          { type: "3" }
        );
        console.log("customersids=>", customersids);
        const { _id } = await NotificationService.addNotification({
          ...data,
          type: 3,
          from: "admin",
          admin: req._user_info._user_id,
          imageUrl,
        });
        const notificationData = customers.map((customer) => {
          return {
            notification: _id,
            customer: customer._id,
          };
        });
        await NotificationService.addNotificationManyUser(notificationData);
        return res.status(200).send(
          ResponseService.success({
            message: `Notification sent To all Pakistani Users`,
          })
        );
      }

      return res.status(200).send(ResponseService.success({ data: {} }));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
}
module.exports = new NotificationController();
