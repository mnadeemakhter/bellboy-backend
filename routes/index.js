const express = require("express");
const router = express.Router();
const apiRoutes = require("./apis");
const DatabaseService = require('../common/push-notification')

const dashboard= require("../controllers/admin/dashboard")
router.use("/api", apiRoutes);
// router.get("/da",async (req, res, next) => {
//   // for real time but not tested
//   const socketUser = req.app.io;
//   const DashboardDetails=await dashboard.getDashboardDetails({});
//   socketUser.emit(`dashboard`,DashboardDetails);
//   return res.status(200).json({
//       msg:"Working"
//   })
// });

module.exports = router;
