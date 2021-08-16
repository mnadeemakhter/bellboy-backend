const express = require("express");
const router = express.Router();

const AuthRoutes = require("./auth");
const AdminUserRoutes = require("./user");
const RoleRoutes = require("./role");
const CategoryRoutes = require("./category");
const DepartmentRoutes = require("./department");
const CustomerRoutes = require("./customer");
const BrandRoutes = require("./brands");
const ProductRoutes = require("./product");
const BellBoyRoutes = require("./bellboy");
const LocaleRoutes = require("./locale");
const VehicleTypeRoutes = require("./vehicle-type");
const VehicleBrandRoutes = require("./vehicle-brand");
const VehicleModelRoutes = require("./vehicle-model");
const VehicleRoutes = require("./vehicle");
const WalletTypeRoutes = require("./wallet-types");
const HiringActionTypeRoutes = require("./hiring-action-type");
const BellBoyTypeRoutes = require("./bellboy-type");
const ChargesRoutes = require("./charges");
const OrdersRoutes = require("./order");
const HiringsRoutes = require("./hiring");
const ComplaintsRoutes = require("./complaint");
const AdvertisementRoutes = require("./advertisement");
const DashboardRoutes = require("./dashboard");
const Notification = require("./notification");
const VersionRoutes = require("./version");
const Reports = require("./reports");
const isSuperAdmin = require("../../../middlewares/is-super-admin");

const ResponseService = require("../../../common/response");
const jwtAuth = require("../../../middlewares/jwt-auth");

const isAdmin = (req, res, next) => {
  try {
    const user = req._user_info;
    if (user._user_type == 1) {
      return next();
    } else {
      throw new Error("unauthorized");
    }
  } catch (e) {
    console.log(e);
    return res.status(401).send(ResponseService.failure(e));
  }
};

router.use("/auth", AuthRoutes);
router.use("/user", AdminUserRoutes);
router.use("/role", RoleRoutes);
router.use("/customer", CustomerRoutes);
router.use("/category", CategoryRoutes);
router.use("/department", DepartmentRoutes);
router.use("/brand", BrandRoutes);
router.use("/vehicleType", VehicleTypeRoutes);
router.use("/vehicleBrand", VehicleBrandRoutes);
router.use("/vehicleModel", VehicleModelRoutes);
router.use("/vehicle", VehicleRoutes);
router.use("/product", ProductRoutes);
router.use("/bellboy", BellBoyRoutes);
router.use("/locale", LocaleRoutes);
router.use("/wallet-type", WalletTypeRoutes);
router.use("/hiring-action-type", HiringActionTypeRoutes);
router.use("/bellboy-type", BellBoyTypeRoutes);
router.use("/charges", ChargesRoutes);
router.use("/order", OrdersRoutes);
router.use("/hiring", HiringsRoutes);
router.use("/complaint", ComplaintsRoutes);
router.use("/advertisement", AdvertisementRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/notification", jwtAuth, isAdmin, Notification);
router.use(
  "/reports",
  // jwtAuth,
  Reports
);

// version controll
router.use("/version", jwtAuth, isAdmin, VersionRoutes);

//router.use('/',isSuperAdmin,AdminUserRoutes)

module.exports = router;
