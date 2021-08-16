const CustomerNotification = require("../models/customerNotification");
const Notification = require("../models/notification");
class NotificationService {
  addNotification(request) {
    return new Notification(request).save();
  }
  getNotificationforAdmin(request) {
    return Notification.aggregate([
      {
        $match: request,
      },
      {
        $lookup: {
          from: "customernotifications",
          localField: "_id",
          foreignField: "notification",
          as: "customers",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "admin",
          foreignField: "_id",
          as: "admin",
        },
      },
      {
        $unwind: {
          path: "$admin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customers.customer",
          foreignField: "_id",
          as: "customers",
        },
      },
      {
        $project: {
          admin: {
            name: 1,
            _id: 1,
            avatar: 1,
            name: 1,
            email: 1,
          },
          imageUrl: 1,
          created_at: 1,
          title: 1,
          body: 1,
          customers: {
            name: 1,
            avatar: 1,
            email: 1,
            mobile: 1,
            gender: 1,
            birth_date: 1,
            status: 1,
            created_at: 1,
            last_active: 1,
            current_device: 1,
            signup_device: 1,
            total_logins: 1,
            last_seen: 1,
          },
        },
      },
    ]);

    // return Notification.findOne(request);
  }

  getNotificationsforAdminCount(request, perPage, pageNo) {
    return Notification.find(request).countDocuments();
  }

  getNotificationsforAdmin(request, perPage, pageNo) {
    return Notification.aggregate()
      .match(request)
      .lookup({
        from: "customernotifications",
        localField: "_id",
        foreignField: "notification",
        as: "customers",
      })
      .lookup({
        from: "admins",
        localField: "admin",
        foreignField: "_id",
        as: "admin",
      })
      .unwind("admin")
      .project({
        customerCount: {
          $size: "$customers",
        },
        admin: {
          name: 1,
          _id: 1,
        },
        title: 1,
        body: 1,
        from: 1,
        imageUrl: 1,
        created_at: 1,
      })
      .sort({ created_at: -1 })
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
  }

  addNotificationSingleUser(request) {
    return new CustomerNotification(request).save();
  }
  addNotificationManyUser(request) {
    return CustomerNotification.insertMany(request);
  }
  // getNotificationsforCustomer(request) {
  //   return CustomerNotification.find(request)
  //     .populate("notification", "title body imageUrl")
  //     .select("-deleted -__v -updated_at");
  // }

  // getNotificationforCustomer(request) {
  //   return CustomerNotification.findOne(request)
  //     .populate("notification", "title body imageUrl")
  //     .select("-deleted -__v -updated_at");
  // }
  getNotificationByCustomerId(request) {
    return CustomerNotification.find(request)
      .populate("notification", "title body imageUrl")
      .sort("-created_at");
  }
  getSingleNotificationforCustomer(request) {
    return CustomerNotification.findOne(request)
      .populate("notification", "title body imageUrl")
      .sort("-created_at");
  }
  markNotificationasRead(request) {
    return CustomerNotification.findOneAndUpdate(
      request,
      { read: true },
      { new: true }
    ).populate("notification", "title body imageUrl");
  }

  deleteNotification(request, id) {
    return CustomerNotification.delete(request, id);
  }
}

module.exports = new NotificationService();
