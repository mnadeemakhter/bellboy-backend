const CustomerService = require("../../services/customer");
const ResponseService = require("../../common/response");
const BellboyReportService = require("../../services/bellboy_reports");
const HiringService = require("../../services/hirings");
var xl = require("excel4node");
const mongoose = require("mongoose");

const Country = require("../../common/countries");
const fs = require("fs");
const path = require("path");
//Error Handling
const messages = require("../../common/messages");
const apiErrors = require("../../common/api-errors");

class customerReports {
  genrateFile = async (customers, keys, filename, data = {}) => {
    return new Promise(async (resolve, reject) => {
      var wb = new xl.Workbook({ sheetFormat: {} });
      const headerCellStyle = wb.createStyle({
        font: {
          color: "#ff0800",
          bold: true,
        },
        size: 12,
        alignment: {
          horizontal: "center",
        },
      });
      const bodyCellStyle = wb.createStyle({
        font: {
          color: "#000000",
        },
        alignment: {
          horizontal: "center",
        },
      });
      const _idLength = Math.max(
        ...customers.map((el) => {
          return el._id.toString().length + 2;
        })
      );
      const nameLength = Math.max(...customers.map((el) => el.name.length));
      const emailLength = Math.max(
        ...customers.map((el) => el.email.length + 2)
      );
      const genderLength = Math.max(
        ...customers.map((el) => el.gender.length + 2)
      );
      const signupLength = Math.max(
        ...customers.map((el) => (el.current_device || "").length + 2)
      );
      const currentLength = Math.max(
        ...customers.map((el) => (el.signup_device || "").length + 2)
      );
      const mobileLength = Math.max(
        ...customers.map((el) => el.mobile.length + 2)
      );
      const lastSeenLength = Math.max(
        ...customers.map((el) => (el.last_seen || "").length + 2)
      );
      const joinLength = Math.max(
        ...customers.map((el) => el.created_at.length + 2)
      );
      const countryLength = Math.max(
        ...customers.map((el) => el.country.name.length + 2)
      );
      let total_customer;
      let total_customer_block;
      let total_customer_active;
      total_customer = await CustomerService.customerTotalCount({});
      if (data.month) {
        total_customer_block = customers.length;
      } else {
        total_customer_block = await CustomerService.customerTotalCount({
          status: false,
        });
        total_customer_active = await CustomerService.customerTotalCount({
          status: true,
        });
      }
      let column = 1,
        row = 8;
      var ws = wb.addWorksheet(filename.split(".")[0]);
      ws.cell(2, 1).string("Total Customer").style(headerCellStyle);
      ws.cell(2, 2).number(total_customer).style(bodyCellStyle);
      if (data.month) {
        ws.cell(3, 1)
          .string(`Customer ${data.year}-${data.month}`)
          .style(headerCellStyle);
        ws.cell(3, 2).number(total_customer_block).style(bodyCellStyle);
      } else {
        ws.cell(3, 1).string("Total Active Customer").style(headerCellStyle);
        ws.cell(3, 2).number(total_customer_active).style(bodyCellStyle);

        ws.cell(4, 1).string("Total Blocked Customer").style(headerCellStyle);
        ws.cell(4, 2).number(total_customer_block).style(bodyCellStyle);
      }
      const iosCount = customers.filter((c) => c.signup_device == 2);
      const androidCount = customers.filter((c) => c.signup_device == 1);

      ws.cell(2, 4).string("Android customer").style(headerCellStyle);
      ws.cell(2, 5).number(androidCount.length).style(bodyCellStyle);

      ws.cell(3, 4).string("iOS customer").style(headerCellStyle);
      ws.cell(3, 5).number(iosCount.length).style(bodyCellStyle);

      ws.cell(4, 4).string("unknown").style(headerCellStyle);
      ws.cell(4, 5)
        .number(customers.length - androidCount.length - iosCount.length)
        .style(bodyCellStyle);

      keys.forEach((element) => {
        ws.cell(row, column).string(element).style(headerCellStyle);
        ++column;
      });

      row = 8;
      customers.forEach((element) => {
        column = 0;
        ++column;
        ++row;
        ws.column(column).setWidth(_idLength);
        ws.cell(row, column)
          .string(element._id.toString())
          .style(bodyCellStyle);
        ++column;
        ws.column(column).setWidth(nameLength);

        ws.cell(row, column)
          .string(element.name.toString())
          .style(bodyCellStyle);

        ++column;
        ws.column(column).setWidth(emailLength);
        ws.cell(row, column)
          .string(!element.email ? "-" : element.email.toString())
          .style(bodyCellStyle);

        ++column;
        ws.column(column).setWidth(genderLength);
        ws.cell(row, column)
          .string(element.gender.toString())
          .style(bodyCellStyle);

        ++column;
        ws.cell(row, column)
          .string(element.status ? "true" : "false")
          .style(bodyCellStyle);

        ++column;
        ws.cell(row, column)
          .string((element.total_logins || "0").toString())
          .style(bodyCellStyle);

        ++column;
        ws.column(column).setWidth(currentLength);
        if (element.current_device === 1) {
          ws.cell(row, column).string("Android").style(bodyCellStyle);
        } else if (element.current_device === column) {
          ws.cell(row, column).string("iOS").style(bodyCellStyle);
        } else {
          ws.cell(row, column).string("-").style(bodyCellStyle);
        }

        ++column;
        ws.column(column).setWidth(signupLength);
        if (element.signup_device === 1) {
          ws.cell(row, column).string("Android").style(bodyCellStyle);
        } else if (element.signup_device === column) {
          ws.cell(row, column).string("iOS").style(bodyCellStyle);
        } else {
          ws.cell(row, column).string("-").style(bodyCellStyle);
        }

        ++column;
        ws.column(column).setWidth(mobileLength);
        ws.cell(row, column).string(element.mobile).style(bodyCellStyle);
        ++column;
        ws.column(column).setWidth(joinLength);

        ws.cell(row, column)
          .date(element.last_seen || element.created_at)
          .style(bodyCellStyle);

        ++column;
        ws.column(column).setWidth(joinLength);
        ws.cell(row, column).date(element.created_at).style(bodyCellStyle);
        ++column;

        ws.cell(row, column)
          .string((element.total_hirings || "0").toString())
          .style(bodyCellStyle);

        ++column;
        ws.column(column).setWidth(countryLength);
        ws.cell(row, column)
          .string(element.country.name.toString())
          .style(bodyCellStyle);
      });
      // wb.write(`reports/Excel.xlsx`);
      const address = path.join(__dirname, "../../reports", filename);
      wb.write(address, () => {
        resolve(address);
      });
      // path.join(__dirname,"niktoResults","result.txt")
      // console.log("address",address)
    });
  };
  genrateFileForSingleCustomer = async (
    customer,
    keys,
    hirings,
    filename,
    data = {}
  ) => {
    return new Promise(async (resolve, reject) => {
      var wb = new xl.Workbook({ sheetFormat: {} });

      const headerCellStyle = wb.createStyle({
        font: {
          color: "#ff0800",
          bold: true,
          size: 15,
        },
        size: 12,
        alignment: {
          horizontal: "center",
        },
      });
      const bodyCellStyle = wb.createStyle({
        font: {
          color: "#000000",
        },
        alignment: {
          horizontal: "center",
        },
      });
      var ws = wb.addWorksheet(filename.split(".")[0]);
      // ws.cell(1, 1).string("Contact Detail").style(headerCellStyle);
      const col2 = [
        customer.mobile.length || 0,
        customer.email.length || 0,
        customer.created_at.length || 0,
        customer.name.length || 0,
      ];
      // first group
      // Contact Details
      ws.cell(1, 1, 1, 2, true).string("Contact Detail").style(headerCellStyle);

      ws.column(2).setWidth(Math.max(...col2) + 3);
      ws.column(1).setWidth(Math.max(...col2) + 3);
      let row = 1;
      row++;
      ws.cell(row, 1).string("Cell No").style(bodyCellStyle);
      ws.cell(row, 2).string(customer.mobile).style(bodyCellStyle);
      row++;
      ws.cell(row, 1).string("Name").style(bodyCellStyle);
      ws.cell(row, 2).string(customer.name).style(bodyCellStyle);

      row++;
      ws.cell(row, 1).string("Email").style(bodyCellStyle);
      ws.cell(row, 2)
        .string(customer.email || "-")
        .style(bodyCellStyle);

      row++;
      ws.cell(row, 1).string("Joining Date").style(bodyCellStyle);
      ws.cell(row, 2).date(customer.created_at).style(bodyCellStyle);

      row++;
      ws.cell(row, 1).string("Gender").style(bodyCellStyle);
      ws.cell(row, 2).string(customer.gender).style(bodyCellStyle);

      row++;
      ws.cell(row, 1).string("Date Of Birth").style(bodyCellStyle);
      ws.cell(row, 2).date(customer.birth_date).style(bodyCellStyle);
      row = 1;

      // second Group
      // Customer States
      ws.cell(1, 4, 1, 5, true).string("Contact Detail").style(headerCellStyle);

      ws.column(4).setWidth(Math.max(...col2) + 3);
      ws.column(5).setWidth(Math.max(...col2) + 3);

      row++;
      ws.cell(row, 4).string("Last Login").style(bodyCellStyle);
      ws.cell(row, 5).date(customer.last_active).style(bodyCellStyle);

      row++;
      ws.cell(row, 4).string("Last Seen").style(bodyCellStyle);
      ws.cell(row, 5).date(customer.last_seen).style(bodyCellStyle);

      row++;
      ws.cell(row, 4).string("Sign Up Device").style(bodyCellStyle);
      if (customer.signup_device === 1) {
        ws.cell(row, 5).string("Android").style(bodyCellStyle);
      } else if (element.signup_device === column) {
        ws.cell(row, 5).string("iOS").style(bodyCellStyle);
      } else {
        ws.cell(row, 5).string("-").style(bodyCellStyle);
      }

      row++;
      ws.cell(row, 4).string("Current Device").style(bodyCellStyle);
      if (customer.current_device === 1) {
        ws.cell(row, 5).string("Android").style(bodyCellStyle);
      } else if (element.current_device === column) {
        ws.cell(row, 5).string("iOS").style(bodyCellStyle);
      } else {
        ws.cell(row, 5).string("-").style(bodyCellStyle);
      }

      row++;
      ws.cell(row, 4).string("Total Logins").style(bodyCellStyle);
      ws.cell(row, 5).number(customer.total_logins).style(bodyCellStyle);

      row++;
      ws.cell(row, 4).string("Total Hirings").style(bodyCellStyle);
      ws.cell(row, 5).number(customer.total_hirings).style(bodyCellStyle);

      row++;
      ws.cell(row, 4).string("Total Amount Spent").style(bodyCellStyle);
      ws.cell(row, 5)
        .string(customer.total_spend.toString() + "/-")
        .style(bodyCellStyle);

      // hirings
      row = 12;
      let column = 0;
      ws.cell(11, 1, 11, 3, true)
        .string("Hiring Detail")
        .style(headerCellStyle);
      keys.forEach((k) => {
        column++;
        ws.cell(row, column).string(k).style(bodyCellStyle);
      });

      hirings.forEach((h) => {
        column = 0;

        row++;

        column++;
        ws.cell(row, column).string(h.hiring_id).style(bodyCellStyle);

        column++;
        ws.cell(row, column).number(h.actions.length).style(bodyCellStyle);

        column++;
        ws.cell(row, column)
          .string((h.bellboy && h.bellboy.name) || "")
          .style(bodyCellStyle);

        column++;
        ws.cell(row, column)
          .string((h.bellboy && h.bellboy._id.toString()) || "")
          .style(bodyCellStyle);

        column++;
        ws.cell(row, column)
          .string((h.bellboyType && h.bellboyType.title) || "")
          .style(bodyCellStyle);

        column++;
        if (h.status === 1) {
          ws.cell(row, column).string("pending").style(bodyCellStyle);
        } else if (h.status === 2) {
          ws.cell(row, column).string("Assigned").style(bodyCellStyle);
        } else if (h.status === 3) {
          ws.cell(row, column).string("Inprogress").style(bodyCellStyle);
        } else if (h.status === 4) {
          ws.cell(row, column).string("Completed").style(bodyCellStyle);
        } else if (h.status === 4) {
          ws.cell(row, column).string("Cancelled").style(bodyCellStyle);
        }
        column++;
        ws.cell(row, column)
          .number(h.charges.totalBill || 0)
          .style(bodyCellStyle);

        column++;
        ws.cell(row, column)
          .number(h.charges.graceTime || 0)
          .style(bodyCellStyle);

        column++;
        ws.cell(row, column)
          .number(h.charges.totalTime || 0)
          .style(bodyCellStyle);

        column++;
        ws.cell(row, column).date(h.created_at).style(bodyCellStyle);
      });

      const address = path.join(__dirname, "../../reports", filename);
      wb.write(address, () => {
        resolve(address);
      });
    });
  };

  // above all code is for genrating files
  getTotalBellboyReport = async (req, res) => {
    try {
      const data = req.query;
      let sortBy = req.query.sortBy || "-created_at";
      const status = Number(req.status);
      const dbQuery = {};
      let filename;

      if (status === 0) {
        dbQuery.status = 1;
        filename = "total_bellboy_pending.xlsx";
      } else if (status === 1) {
        dbQuery.status = 1;
        filename = "total_bellboy_active.xlsx";
      } else if (status === 2) {
        dbQuery.status = 2;
        filename = "total_bellboy_rejected.xlsx";
      } 
      else if (status === 3) {
        dbQuery.status = 3;
        filename = "total_bellboy_blocked.xlsx";
      } 
      else {
        filename = "total_bellboy.xlsx";
      }
      const customers = await BellboyReportService.getCustomersForAdminReport(
        dbQuery,
        sortBy
      );
      if (!customers) throw new apiErrors.ResourceNotFoundError();
      let customersData = customers.map((cust) => {
        return {
          ...cust,
          country: Country.getCountry(cust.mobile),
        };
      });
      const keys = [
        "ID",
        "name",
        "email",
        "gender",
        "status",
        "Total Logins",
        "Current Device",
        "Signup Device",
        "mobile",
        "Last Seen",
        "Joining Date",
        "Total Hiring",
        "Country",
      ];
      const address = await this.genrateFile(customersData, keys, filename);
      // const file = `${__dirname}/reports/Excel.xlsx`;
      const file = path.join(__dirname, "../../reports/", `${filename}`);

      return res.download(address); // Set disposition and send it.
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  };
  getMonthReport = async (req, res) => {
    try {
      const data = req.query;
      const year = Number(data.year);
      const month = Number(data.month);
      let filename;
      if (isNaN(year) || isNaN(month)) {
        throw new apiErrors.ModelValidationError("invalid year or month");
      } else {
        filename = `total_customer_By_${year}_${month}.xlsx`;
      }

      const customers = await BellboyReportService.getCustomerByMonth(
        year,
        month
      );
      if (!customers) throw new apiErrors.ResourceNotFoundError();
      let customersData = customers.map((cust) => {
        return {
          ...cust,
          country: Country.getCountry(cust.mobile),
        };
      });
      const keys = [
        "ID",
        "name",
        "email",
        "gender",
        "status",
        "Total Logins",
        "Current Device",
        "Signup Device",
        "mobile",
        "Last Seen",
        "Joining Date",
        "Total Hiring",
        "Country",
      ];
      const address = await this.genrateFile(customersData, keys, filename, {
        year,
        month,
      });
      // const file = `${__dirname}/reports/Excel.xlsx`;
      const file = path.join(__dirname, "../../reports/", `${filename}`);

      return res.download(address);
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  };

  getSingleBellboyReport = async (req, res) => {
    try {
      const customer_id = req.params.id;
      let customer = await CustomerService.getCustomerForAdmin(
        {
          _id: mongoose.Types.ObjectId(customer_id),
        },
        mongoose.Types.ObjectId(customer_id)
      );
      if (!customer.length)
        return res.status(404).json({ msg: "customer not found" });
      let filename = `customer-${customer_id}.xlsx`;
      const [hirings] = await Promise.all([
        BellboyReportService.getHiringForAdminCustomer({
          customer: mongoose.Types.ObjectId(customer_id),
        }),
      ]);
      const keys = [
        "Hiring ID",
        "No of Task",
        "Bellboy Name",
        "Bellboy ID",
        "Bellboy Type",
        "Status",
        "Amount",
        "Grace Time",
        "Time (min)",
        "Date",
      ];
      const address = await this.genrateFileForSingleCustomer(
        customer[0],
        keys,
        hirings,
        filename
      );
      return res.status(200).json({ customer, hirings });
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  };
}

module.exports = new customerReports();
