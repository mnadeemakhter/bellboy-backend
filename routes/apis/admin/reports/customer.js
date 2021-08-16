const express = require('express');
const router = express.Router();
const customerReportsController=require("../../../../controllers/admin/customer_reports");

router.get("/total",customerReportsController.getTotalCustomerReport)
router.get("/reportByMonth",customerReportsController.getMonthReport)
router.get("/reportByDevice",customerReportsController.getCustomerReportByDevice)
router.get("/:id",customerReportsController.getSingleCustomerReport)

module.exports=router