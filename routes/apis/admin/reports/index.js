const express = require('express');
const router = express.Router();
const customerReports= require("./customer")

router.use("/customer",customerReports);
// router.use("/bellboy")
// router.use("/finance")

module.exports=router