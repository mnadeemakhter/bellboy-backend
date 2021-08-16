const ResponseService = require("./../../common/response");

const HiringService = require("../../services/hirings");
const BellBoyService = require("../../services/bell-boy");
const BellBoy = require("../../models/bellboys");
const Customer = require("../../models/customer");
const CustomerService = require("../../services/customer");

//Error Handling
const messages = require("../../common/messages");
const apiErrors = require("../../common/api-errors");
const bellBoy = require("../../services/bell-boy");

class DashboardController {
  getDashboardDetails = async (data) => {
    var currentStartDate = data.startDateForRecords
      ? new Date(data.startDateForRecords)
      : new Date();
    let valid = !isNaN(currentStartDate.valueOf());
    if (!valid) currentStartDate = new Date();
    currentStartDate.setUTCHours(0, 0, 0, 0);
    // above line replace to below line if it make issues
    // currentStartDate.setHours()

    var currentEndDate = data.endDateForRecords
      ? new Date(data.endDateForRecords)
      : new Date();
    valid = !isNaN(currentEndDate.valueOf());
    if (!valid) currentEndDate = new Date();

    currentEndDate.setHours(23, 59, 59, 999);

    var start = data.startDateForGraph
      ? new Date(data.startDateForGraph)
      : new Date();
    valid = !isNaN(start.valueOf());
    if (!valid) start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = data.endDateForGraph
      ? new Date(data.endDateForGraph)
      : new Date();
    valid = !isNaN(end.valueOf());
    if (!valid) end = new Date();
    end.setHours(23, 59, 59, 999);
    let [
      hiringData,
      // HiringService.countHiringForAdminDashboard(start, end),
      customerData,
      // CustomerService.countCustomerForAdminDashboard(start, end),
      bellboyData,
      // BellBoyService.countBellBoyForAdminDashboard(start, end),

      totalCurrentDayHirings,
      // HiringService.countHiringForAdminDashboard(currentStartDate, currentEndDate),
      totalCurrentDayCustomers,
      // CustomerService.countCustomerForAdminDashboard(currentStartDate, currentEndDate),
      totalCurrentDayBellBoys,
      // BellBoyService.countBellBoyForAdminDashboard(currentStartDate, currentEndDate),

      totalPendingHirings,
      // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 1),
      totalAssignedHirings,
      // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2),
      totalInProgressHirings,
      // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2),
      totalCompletedHirings,
      // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 4),
      totalCancelledHirings,
      // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 5),
      totalCustomersWithHirings,
      // CustomerService.getCustomerWithorder(start,end)

      hiringsCount,
      // HiringService.HiringTotalCount({status:4}),

      totalEarningDate,

      // HiringService.getTotalEarningDate(currentStartDate,currentStartDate,3,false)

      totalEarning,
      // HiringService.getTotalEarning(currentStartDate,currentEndDate,4,false)
    ] = await Promise.all([
      HiringService.countHiringForAdminDashboard(start, end),
      CustomerService.countCustomerForAdminDashboard(start, end),
      BellBoyService.countBellBoyForAdminDashboard(start, end),

      HiringService.countHiringForAdminDashboard(
        currentStartDate,
        currentEndDate
      ),
      CustomerService.countCustomerForAdminDashboard(
        currentStartDate,
        currentEndDate
      ),
      BellBoyService.countBellBoyForAdminDashboard(
        currentStartDate,
        currentEndDate
      ),

      HiringService.countHiringForAdminDashboardWithRequest(
        currentStartDate,
        currentEndDate,
        1
      ),
      HiringService.countHiringForAdminDashboardWithRequest(
        currentStartDate,
        currentEndDate,
        2
      ),
      HiringService.countHiringForAdminDashboardWithRequest(
        currentStartDate,
        currentEndDate,
        2
      ),
      HiringService.countHiringForAdminDashboardWithRequest(
        currentStartDate,
        currentEndDate,
        4
      ),
      HiringService.countHiringForAdminDashboardWithRequest(
        currentStartDate,
        currentEndDate,
        5
      ),

      CustomerService.getCustomerWithorder(currentStartDate, currentEndDate),
      HiringService.HiringTotalCount({ status: 4 }),

      HiringService.getTotalEarningDate(
        currentStartDate,
        currentEndDate,
        4,
        false
      ),
      HiringService.getTotalEarning(currentStartDate, currentEndDate, 4, false),
    ]);

    // let hiringData = await HiringService.countHiringForAdminDashboard(start, end);
    // // const dummyArray =await HiringService.getDates(start, end);
    // // let newData = await HiringService.countData(start,end,dummyArray)
    // let customerData = await CustomerService.countCustomerForAdminDashboard(start, end);
    // let bellboyData = await BellBoyService.countBellBoyForAdminDashboard(start, end);

    // let totalCurrentDayHirings = await HiringService.countHiringForAdminDashboard(currentStartDate, currentEndDate);
    // let totalCurrentDayCustomers = await CustomerService.countCustomerForAdminDashboard(currentStartDate, currentEndDate);
    // let totalCurrentDayBellBoys = await BellBoyService.countBellBoyForAdminDashboard(currentStartDate, currentEndDate);

    // let totalPendingHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 1);
    // let totalAssignedHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2);
    // let totalInProgressHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 3);
    // let totalCompletedHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 4);
    // let totalCancelledHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 5);

    let currentDayHirings = await HiringService.getHiringsWithDateRange(
      currentStartDate,
      currentEndDate
    );
    let totalCustomers = await CustomerService.customerTotalCount({});

    // let currentDayPendingHirings = await HiringService.getHiringsWithDateRange(currentStartDate, currentEndDate);
    // currentDayHirings = await BellBoy.populate(currentDayHirings, { path: 'bellboy', select: 'name mobile email avatar' });
    // currentDayHirings = await Customer.populate(currentDayHirings, { path: 'customer', select: 'name mobile email avatar' });

    let currentDayCustomers = await CustomerService.getCustomersWithDateRange(
      currentStartDate,
      currentEndDate
    );
    let currentDayBellBoys = await BellBoyService.getBellBoyWithDateRange(
      currentStartDate,
      currentEndDate
    );
    // console.log("totalCompletedHirings",totalCompletedHirings);
    console.log("totalEarningDate=>", totalEarningDate);
    return {
      graph: {
        hiringData,
        customerData,
        bellboyData,
      },
      total: {
        totalCurrentDayHirings: totalCurrentDayHirings
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalCurrentDayCustomers: totalCurrentDayCustomers
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalCurrentDayBellBoys: totalCurrentDayBellBoys
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalPendingHirings: totalPendingHirings
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalAssignedHirings: totalAssignedHirings
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalInProgressHirings: totalInProgressHirings
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalCompletedHirings: totalCompletedHirings
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalCancelledHirings: totalCancelledHirings
          .map((h) => h.count)
          .reduce((a, b) => a + b, 0),
        totalCustomers,
        totalCustomersWithHirings: totalCustomersWithHirings[0]
          ? totalCustomersWithHirings[0].total
          : 0,
        hiringsCount,
        totalEarning: totalEarning[0] ? totalEarning[0].earning : 0,
        totalEarningDate: totalEarningDate[0] ? totalEarningDate[0].earning : 0,
      },
      totalWithDetail: {
        currentDayHirings,
        currentDayCustomers,
        currentDayBellBoys,
      },
    };
  };

  getDashboard = async (req, res) => {
    try {
      let data = Object.assign({}, req.query);
      const responceData = await this.getDashboardDetails(data);
      // var currentStartDate = data.startDateForRecords ? new Date(data.startDateForRecords) : new Date();
      // let valid = !isNaN(currentStartDate.valueOf());
      // if (!valid) currentStartDate = new Date();
      // currentStartDate.setUTCHours(-5, 0, 0, 0);
      // // above line replace to below line if it make issues
      // // currentStartDate.setHours()

      // var currentEndDate = data.endDateForRecords ? new Date(data.endDateForRecords) : new Date();
      // valid = !isNaN(currentEndDate.valueOf());
      // if (!valid) currentEndDate = new Date();

      // currentEndDate.setHours(23, 59, 59, 999);

      // var start = data.startDateForGraph ? new Date(data.startDateForGraph) : new Date();
      // valid = !isNaN(start.valueOf());
      // if (!valid) start = new Date();
      // start.setHours(0, 0, 0, 0);

      // var end = data.endDateForGraph ? new Date(data.endDateForGraph) : new Date();
      // valid = !isNaN(end.valueOf());
      // if (!valid) end = new Date();
      // end.setHours(23, 59, 59, 999);
      // let [
      //     hiringData,
      //     // HiringService.countHiringForAdminDashboard(start, end),
      //     customerData,
      //     // CustomerService.countCustomerForAdminDashboard(start, end),
      //     bellboyData,
      //     // BellBoyService.countBellBoyForAdminDashboard(start, end),

      //     totalCurrentDayHirings,
      //     // HiringService.countHiringForAdminDashboard(currentStartDate, currentEndDate),
      //     totalCurrentDayCustomers ,
      //     // CustomerService.countCustomerForAdminDashboard(currentStartDate, currentEndDate),
      //     totalCurrentDayBellBoys ,
      //     // BellBoyService.countBellBoyForAdminDashboard(currentStartDate, currentEndDate),

      //     totalPendingHirings,
      //     // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 1),
      //     totalAssignedHirings,
      //     // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2),
      //     totalInProgressHirings,
      //     // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2),
      //     totalCompletedHirings,
      //     // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 4),
      //     totalCancelledHirings,
      //     // HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 5),
      //     totalCustomersWithHirings,
      //     // CustomerService.getCustomerWithorder(start,end)

      //     hiringsCount,
      //     // HiringService.HiringTotalCount({status:4}),

      //     totalEarningDate,

      //     // HiringService.getTotalEarningDate(currentStartDate,currentStartDate,3,false)

      //     totalEarning
      //     // HiringService.getTotalEarning(currentStartDate,currentEndDate,4,false)

      // ]= await Promise.all([
      //     HiringService.countHiringForAdminDashboard(start, end),
      //     CustomerService.countCustomerForAdminDashboard(start, end),
      //     BellBoyService.countBellBoyForAdminDashboard(start, end),

      //     HiringService.countHiringForAdminDashboard(currentStartDate, currentEndDate),
      //     CustomerService.countCustomerForAdminDashboard(currentStartDate, currentEndDate),
      //     BellBoyService.countBellBoyForAdminDashboard(currentStartDate, currentEndDate),

      //     HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 1),
      //     HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2),
      //     HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2),
      //     HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 4),
      //     HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 5),

      //     CustomerService.getCustomerWithorder(currentStartDate,currentEndDate),
      //     HiringService.HiringTotalCount({status:4}),

      //     HiringService.getTotalEarningDate(currentStartDate,currentEndDate,4,false),
      //     HiringService.getTotalEarning(currentStartDate,currentEndDate,4,false)

      // ]);

      // // let hiringData = await HiringService.countHiringForAdminDashboard(start, end);
      // // // const dummyArray =await HiringService.getDates(start, end);
      // // // let newData = await HiringService.countData(start,end,dummyArray)
      // // let customerData = await CustomerService.countCustomerForAdminDashboard(start, end);
      // // let bellboyData = await BellBoyService.countBellBoyForAdminDashboard(start, end);

      // // let totalCurrentDayHirings = await HiringService.countHiringForAdminDashboard(currentStartDate, currentEndDate);
      // // let totalCurrentDayCustomers = await CustomerService.countCustomerForAdminDashboard(currentStartDate, currentEndDate);
      // // let totalCurrentDayBellBoys = await BellBoyService.countBellBoyForAdminDashboard(currentStartDate, currentEndDate);

      // // let totalPendingHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 1);
      // // let totalAssignedHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 2);
      // // let totalInProgressHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 3);
      // // let totalCompletedHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 4);
      // // let totalCancelledHirings = await HiringService.countHiringForAdminDashboardWithRequest(currentStartDate, currentEndDate, 5);

      // let currentDayHirings = await HiringService.getHiringsWithDateRange(currentStartDate, currentEndDate);
      // currentDayHirings = await BellBoy.populate(currentDayHirings, { path: 'bellboy', select: 'name mobile email avatar' });
      // currentDayHirings = await Customer.populate(currentDayHirings, { path: 'customer', select: 'name mobile email avatar' });
      // let totalCustomers=await CustomerService.customerTotalCount({});

      // // let currentDayPendingHirings = await HiringService.getHiringsWithDateRange(currentStartDate, currentEndDate);
      // // currentDayHirings = await BellBoy.populate(currentDayHirings, { path: 'bellboy', select: 'name mobile email avatar' });
      // // currentDayHirings = await Customer.populate(currentDayHirings, { path: 'customer', select: 'name mobile email avatar' });

      // let currentDayCustomers = await CustomerService.getCustomersWithDateRange(currentStartDate, currentEndDate);
      // let currentDayBellBoys = await BellBoyService.getBellBoyWithDateRange(currentStartDate, currentEndDate);
      // // console.log("totalCompletedHirings",totalCompletedHirings);

      return res.status(200).send(ResponseService.success(responceData));
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  };

  getDashboardDaysRecords = async (req, res) => {
    try {
      let data = Object.assign({}, req.query);
      var currentStartDate = data.startDateForRecords
        ? new Date(data.startDateForRecords)
        : new Date();
      let valid = !isNaN(currentStartDate.valueOf());
      if (!valid) currentStartDate = new Date();
      currentStartDate.setUTCHours(0, 0, 0, 0);
      // above line replace to below line if it make issues
      // currentStartDate.setHours()

      var currentEndDate = data.endDateForRecords
        ? new Date(data.endDateForRecords)
        : new Date();
      valid = !isNaN(currentEndDate.valueOf());
      if (!valid) currentEndDate = new Date();

      currentEndDate.setHours(23, 59, 59, 999);
      const [
        totalCurrentDayHirings,
        totalCurrentDayCustomers,
        totalCurrentDayBellBoys,
        totalPendingHirings,
        totalAssignedHirings,
        totalInProgressHirings,
        totalCompletedHirings,
        totalCancelledHirings,
        totalEarningDate,
      ] = await Promise.all([
        // totalCurrentDayHirings
        HiringService.countHiringForAdminDashboard(
          currentStartDate,
          currentEndDate
        ),
        // totalCurrentDayCustomers
        CustomerService.countCustomerForAdminDashboard(
          currentStartDate,
          currentEndDate
        ),
        // totalCurrentDayBellBoys
        BellBoyService.countBellBoyForAdminDashboard(
          currentStartDate,
          currentEndDate
        ),
        // totalPendingHirings
        HiringService.countHiringForAdminDashboardWithRequest(
          currentStartDate,
          currentEndDate,
          1
        ),
        // totalAssignedHirings
        HiringService.countHiringForAdminDashboardWithRequest(
          currentStartDate,
          currentEndDate,
          2
        ),
        // totalInProgressHirings
        HiringService.countHiringForAdminDashboardWithRequest(
          currentStartDate,
          currentEndDate,
          2
        ),
        // totalCompletedHirings
        HiringService.countHiringForAdminDashboardWithRequest(
          currentStartDate,
          currentEndDate,
          4
        ),
        // totalCancelledHirings
        HiringService.countHiringForAdminDashboardWithRequest(
          currentStartDate,
          currentEndDate,
          5
        ),
        // totalEarningDate
        HiringService.getTotalEarningDate(
          currentStartDate,
          currentEndDate,
          4,
          false
        ),
      ]);

      const responceData = {
        total: {
          totalCurrentDayHirings: totalCurrentDayHirings
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalCurrentDayCustomers: totalCurrentDayCustomers
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalCurrentDayBellBoys: totalCurrentDayBellBoys
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalPendingHirings: totalPendingHirings
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalAssignedHirings: totalAssignedHirings
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalInProgressHirings: totalInProgressHirings
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalCompletedHirings: totalCompletedHirings
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalCancelledHirings: totalCancelledHirings
            .map((h) => h.count)
            .reduce((a, b) => a + b, 0),
          totalEarningDate: totalEarningDate[0]
            ? totalEarningDate[0].earning
            : 0,
        },
      };
      return res.status(200).send(ResponseService.success(responceData));
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  };
  getTotalRecords = async (req, res) => {
    try {
      let [
        hiringsCount,
        totalCancelledHirings,
        totalCustomers,
        totalCustomersWithHirings,
        totalFreeHiring,
        totalEarning,
        totalBellboys,
        totalPendingBellboys,
        totalApprovedBellboys,
        totalBlockBellboys,
      ] = await Promise.all([
        HiringService.HiringTotalCount({ status: 4 }),
        HiringService.HiringTotalCount({ status: 5 }),
        CustomerService.customerTotalCount({}),
        CustomerService.getCustomerWithorder(),
        HiringService.HiringTotalCount({ isFree: true }),
        HiringService.getTotalEarning(4, false),
        BellBoyService.bellboyTotalCount({}),
        BellBoyService.bellboyTotalCount({ status: 0 }),
        BellBoyService.bellboyTotalCount({ status: 1 }),
        BellBoyService.bellboyTotalCount({ status: 2 }),
      ]);
      const responceData = {
        hiringsCount,
        totalCancelledHirings,
        totalCustomers,
        totalCustomersWithHirings: totalCustomersWithHirings[0]
          ? totalCustomersWithHirings[0].total
          : 0,
        totalFreeHiring,
        totalEarning: totalEarning[0] ? totalEarning[0].earning : 0,
        totalBellboys,
        totalPendingBellboys,
        totalApprovedBellboys,
        totalBlockBellboys,
      };
      return res.status(200).send(ResponseService.success(responceData));
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  };

  getDashboardGraphData = async (req, res) => {
    try {
      let data = Object.assign({}, req.query);
      var start = data.startDateForGraph
        ? new Date(data.startDateForGraph)
        : new Date();
      let valid = !isNaN(start.valueOf());
      if (!valid) start = new Date();
      start.setHours(0, 0, 0, 0);

      var end = data.endDateForGraph
        ? new Date(data.endDateForGraph)
        : new Date();
      valid = !isNaN(end.valueOf());
      if (!valid) end = new Date();
      end.setHours(23, 59, 59, 999);

      let [hiringData, customerData, bellboyData] = await Promise.all([
        HiringService.countHiringForAdminDashboard(start, end),
        CustomerService.countCustomerForAdminDashboard(start, end),
        BellBoyService.countBellBoyForAdminDashboard(start, end),
      ]);

      const responceData = {
        graph: {
          hiringData,
          customerData,
          bellboyData,
        },
      };

      return res.status(200).send(ResponseService.success(responceData));
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  };
  getDashboardDetailsData = async (req, res) => {
    try {
      let data = Object.assign({}, req.query);
      var currentStartDate = data.startDateForRecords
        ? new Date(data.startDateForRecords)
        : new Date();
      let valid = !isNaN(currentStartDate.valueOf());
      if (!valid) currentStartDate = new Date();
      currentStartDate.setUTCHours(0, 0, 0, 0);
      // above line replace to below line if it make issues
      // currentStartDate.setHours()

      var currentEndDate = data.endDateForRecords
        ? new Date(data.endDateForRecords)
        : new Date();
      valid = !isNaN(currentEndDate.valueOf());
      if (!valid) currentEndDate = new Date();

      currentEndDate.setHours(23, 59, 59, 999);

      let currentDayHirings = await HiringService.getHiringsWithDateRange(
        currentStartDate,
        currentEndDate
      );

      let currentDayCustomers = await CustomerService.getCustomersWithDateRange(
        currentStartDate,
        currentEndDate
      );

      let currentDayBellBoys = await BellBoyService.getBellBoyWithDateRange(
        currentStartDate,
        currentEndDate
      );
      const responceData = {
        currentDayHirings,
        currentDayCustomers,
        currentDayBellBoys,
      };
      return res.status(200).send(ResponseService.success(responceData));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  };
}

module.exports = new DashboardController();
