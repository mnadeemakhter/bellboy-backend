const Customer = require("../models/customer");
const messages = require("../common/messages");
const Hiring = require("../models/hiring");
class CustomerReportService {
  getCustomersForAdminReport(request, sortBy) {
    const sortbyText = sortBy[0] === "-" ? sortBy.slice(1) : sortBy;
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
        $project: {
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
      //   {
      //     $skip: (pageNo - 1) * perPage,
      //   },
      //   {
      //     $limit: perPage,
      //   },
    ]);
    // return Customer.find(request).select('name avatar email mobile gender birth_date status created_at last_active current_device signup_device total_logins last_seen').sort(sortBy).skip((pageNo - 1) * perPage).limit(perPage);
  }

  getCustomerByMonth = (year,month) => {
    return Customer.aggregate([
      {
        $addFields: {
          year: {
            $year: "$created_at",
          },
          month: {
            $month: "$created_at",
          },
        },
      },
      {
        $match: {
          year: year,
          month: {
            $gte: month,
            $lte: month,
          },
        },
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
        $project: {
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
      // {
      //   $sort: {
      //     // 'total_hirings': -1
      //     [sortbyText]: sortBy[0] === "-" ? -1 : 1,
      //   },
      // },
      //
    ]);
  };

  getHiringForAdminCustomer(request, perPage, pageNo) {
    return Hiring.find(request)
      .populate([
        { path: "bellboyType", select: "title icon" },
        { path: "bellboy", select: "name mobile avatar" },
      ])
      .select("hiring_id actions created_at status bellboy charges bellboyType")
      .sort("-created_at")
  }
}

module.exports = new CustomerReportService();
