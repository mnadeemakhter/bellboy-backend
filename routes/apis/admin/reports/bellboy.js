const express = require('express');
const router = express.Router();
const BellboyReportsController=require("../../../../controllers/admin/bellboy-reports");

router.get("/total",BellboyReportsController.getTotalBellboyReport)
router.get("/reportByMonth",BellboyReportsController.getMonthReport)
router.get("/:id",BellboyReportsController.getSingleCustomerReport)

module.exports=router