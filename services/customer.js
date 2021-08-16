const Customer = require("../models/customer");
const messages = require("../common/messages");
class CustomerService {
  getCustomer(request) {
    return Customer.findOne(request).sort("-created_at");
  }
  updateCustomerLastSeen(request) {
    console.log("updateCustomerLastSeen");
    return Customer.updateOne(request, { last_seen: Date.now() });
  }

  getCustomersForAdmin(request, perPage, pageNo, sortBy) {
    const sortbyText = sortBy[0] === "-" ? sortBy.slice(1) : sortBy;
    console.log(sortbyText);
    return Customer.aggregate([
      {
        $match: request,
      },
      {
        $lookup: {
          from: "hirings",
          localField: "_id",
          foreignField: "customer",
          as: "hirings",
        },
      },
      {
        $lookup: {
          from: "hirings",
          let: {
            customer:"$_id"
          },
          pipeline: [
            {
              $match: {
                $expr:{
                  $eq:["$$customer","$customer"]
                },
                status: 4,
              },
            },
          ],
          as: "totalspent",
        },
      },
      {
        $addFields: {
          total_spend: {
            $sum: "$totalspent.amount",
          },
        },
      },
      {
        $project: {
          total_spend:1,
          name: 1,
          avatar: 1,
          email: 1,
          mobile: 1,
          gender: 1,
          birth_date: 1,
          status: 1,
          created_at: 1,
          created_at: {
            $dateToString: { format: "%G-%m-%d", date: "$created_at" },
          },
          last_active: 1,
          current_device: 1,
          signup_device: 1,
          total_logins: 1,
          last_seen: 1,
          total_hirings: {
            $size: "$hirings",
          },
        },
      },
      {
        $sort: {
          // 'total_hirings': -1
          [sortbyText]: sortBy[0] === "-" ? -1 : 1,
        },
      },
      {
        $skip: (pageNo - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ]);
    // return Customer.find(request).select('name avatar email mobile gender birth_date status created_at last_active current_device signup_device total_logins last_seen').sort(sortBy).skip((pageNo - 1) * perPage).limit(perPage);
  }

  getCustomerForAdmin(request,id) {
  //   return Customer.aggregate([
  //     {
  //       $match: request,
  //     },
  //     {
  //       $lookup: {
  //         from: "hirings",
  //         localField: "_id",
  //         foreignField: "customer",
  //         as: "hirings",
  //       },
  //     },
  //     {
  //       $addFields: {
  //         total_hirings: {
  //           $size: "$hirings",
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         hirings: 0,
  //         fcm_token: 0,
  //         auth_token: 0,
  //       },
  //     },
  //   ]);

    return Customer.aggregate([
      {
        $match: request,
      },
      {
        $lookup: {
          from: "hirings",
          localField: "_id",
          foreignField: "customer",
          as: "hirings",
        },
      },
      {
        $addFields: {
          total_hirings: {
            $size: "$hirings",
          },
        },
      },
      {
        $lookup: {
          from: "hirings",
          let: {},
          pipeline: [
            {
              $match: {
                customer: id,
                status: 4,
              },
            },
          ],
          as: "totalspent",
        },
      },
      {
        $addFields: {
          total_spend: {
            $sum: "$totalspent.amount",
          },
        },
      },
      {
        $project: {
          hirings: 0,
          fcm_token: 0,
          auth_token: 0,
          totalspent:0
        },
      },
    ]);
    // return Customer.findOne(request).select("-fcm_token -auth_token");
  }
  getCustomerFcmToken(request) {
    return Customer.findOne(request).select("fcm_token name");
  }
  getCustomersFcmToken(request) {
    return Customer.find(request).select("fcm_token name");
  }
  getCustomers(request) {
    return Customer.find(request).sort("-created_at");
  }
  customerTotalCount(request) {
    return Customer.countDocuments(request);
  }
  customerTotalCountForAdmin(request, perPage, pageNo) {
    return Customer.countDocuments(request)
      .skip((pageNo - 1) * perPage)
      .limit(perPage);
  }
  createCustomer(request) {
    return new Customer(request).save();
  }
  updateCustomer(details, criteria) {
    console.log("details" + messages.arrowHead, details);
    console.log("criteria" + messages.arrowHead, criteria);
    return Customer.findOneAndUpdate(criteria, details, { new: true });
  }
  deleteCustomer(criteria) {
    return Customer.findOneAndDelete(criteria);
  }
  countCustomerForAdminDashboard(start, end) {
    return Customer.aggregate([
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
  getCustomersWithDateRange(start, end) {
    return Customer.aggregate([
      {
        $match: {
          $and: [{ created_at: { $gt: start, $lt: end } }],
        },
      },
      { $sort: { created_at: -1 } },
      {
        $project: {
          name: 1,
          mobile: 1,
        },
      },
    ]);
  }
  getCustomerWithorder(start, end) {
    // return Customer.aggregate(
    // [
    //     {
    //         '$match': {
    //             '$and': [
    //                 { 'created_at': { '$gt': start, '$lt': end } },
    //             ]
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'hirings',
    //             localField: '_id',
    //             foreignField: 'customer',
    //             as: 'order'
    //         }
    //     }, {
    //         $project: {
    //             total_order: {
    //                 $size: "$order"
    //             }
    //         }
    //     }, {
    //         $match: {
    //             total_order: {
    //                 $gt: 0
    //             }
    //         }
    //     }, {
    //         $count: 'total'
    //     }
    // ]);
    return Customer.aggregate([
      // {
      //     '$match': {
      //         '$and': [
      //             { 'created_at': { '$gt': start, '$lt': end } },
      //         ]
      //     }
      // },
      {
        $lookup: {
          from: "hirings",
          localField: "_id",
          foreignField: "customer",
          as: "order",
        },
      },
      {
        $project: {
          total_order: {
            $size: "$order",
          },
        },
      },
      {
        $match: {
          total_order: {
            $gt: 0,
          },
        },
      },
      {
        $count: "total",
      },
    ]);
  }
}

module.exports = new CustomerService();
