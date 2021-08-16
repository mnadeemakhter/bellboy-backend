const CustomerService = require("../../services/customer");
const mongoose=require("mongoose");
const ResponseService = require("../../common/response");
const OrderService = require("../../services/order");
const HiringService = require("../../services/hirings");
const ApiError = require("../../common/api-errors");
const messages = require("../../common/messages");
const config = require("../../config/constants");
const bcrypt = require("bcryptjs");
const customer = require("../../models/customer");
const Country = require("../../common/countries");
class CustomerController {
  async addCustomer(req, res) {}

  async getCustomers(req, res) {
    try {
      let data = Object.assign({}, req.query);

      let pageNo = parseInt(req.query.pageNo || 1);
      let perPage = parseInt(req.query.perPage || 10);
      let search = req.query.search || "";
      let mobile = req.query.mobile || "";
      let sortBy = req.query.sortBy || "-created_at";
      let filters = {
        name: new RegExp(search, "i"),
        mobile: RegExp(mobile, "i"),
      };

      //   console.log(mobile);
      //   if (data.mobile != null) filters.mobile = data.mobile;

      if (req.query.status != null) {
        if (req.query.status === "false") {
          filters.status = false;
        } else {
          filters.status = true;
        }
      }

      let total = await CustomerService.customerTotalCount(filters);
      let customers = await CustomerService.getCustomersForAdmin(
        filters,
        perPage,
        pageNo,
        sortBy
      );

      if (!customers) throw new apiErrors.ResourceNotFoundError();
      let customersData = customers.map((cust) => {
        return {
          ...cust,
          country: Country.getCountry(cust.mobile),
        };
      });

      return res.send(
        ResponseService.success({ customers: customersData, count: total })
      );
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
  async getCustomer(req, res) {
    try {
      let pageNo = parseInt(req.query.pageNo || 1);
      let perPage = parseInt(req.query.perPage || 10);
      let data = Object.assign({}, req.params);

      let customer = await CustomerService.getCustomerForAdmin({
        _id: mongoose.Types.ObjectId(data.customer),
      },mongoose.Types.ObjectId(data.customer));
      if (!customer.length) throw new apiErrors.ResourceNotFoundError();

      const [orders] = await Promise.all([
        OrderService.getOrderForAdminCustomer({
          customer: data.customer,
        }),
      ]);
      return res.send(ResponseService.success({ customer:customer[0], orders }));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }

  async updateCustomer(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data.customer)
        throw new apiErrors.ValidationError("customer", messages.ID_VALIDATION);

      let customer = await CustomerService.getCustomerForAdmin({
        _id: data.customer,
      },mongoose.Types.ObjectId(data.customer));
      if (!customer) throw new apiError.ResourceNotFoundError("customer");

      customer = await CustomerService.updateCustomer(
        { status: data.status },
        { _id: data.customer }
      );
      customer = await CustomerService.getCustomerForAdmin({
        _id: data.customer,
      },mongoose.Types.ObjectId(data.customer));
      if (!customer) throw new apiError.UnexpectedError();

      return res
        .status(200)
        .send(ResponseService.success({ customer: customer }));
    } catch (e) {
      return res.status(500).send(ResponseService.failure(e));
    }
  }
}

module.exports = new CustomerController();
