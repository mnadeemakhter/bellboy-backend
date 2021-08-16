const bcrpyt = require("bcryptjs");
//Services
const AdminService = require("../../services/admin");
const RoleService = require("../../services/role");
const ResponseService = require("../../common/response");
//Helpers
const apiError = require("../../common/api-errors");
const messages = require("../../common/messages");
const apiErrors = require("../../common/api-errors");

class AdminUserController {
  async addAdmin(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data.email)
        throw new apiError.ValidationError("email", messages.EMAIL_VALIDATION);
      if (!data.password)
        throw new apiError.ValidationError(
          "password",
          messages.PASSWORD_VALIDATION
        );

      data.email = data.email.toLowerCase();

      let admin = await AdminService.getAdmin({ email: data.email });
      if (admin)
        throw new apiError.ValidationError(
          "email",
          messages.EMAIL_ALREADY_EXISTS
        );

      var salt = await bcrpyt.genSaltSync(10);
      var hash = await bcrpyt.hashSync(data.password, salt);

      if (!hash) throw errorHandler.InternalServerError();

      data.password = hash;

      if (!data.role)
        throw new apiError.ValidationError(
          "role required",
          messages.ROLE_ID_REQUIRED
        );

      let newAdmin = AdminService.createAdmin(data);
      if (!newAdmin) throw new apiError.UnexpectedError();

      return res.status(200).send(ResponseService.success({ admin: newAdmin }));
    } catch (e) {
      return res.status(500).send(ResponseService.failure(e));
    }
  }
  async getAdmins(req, res) {
    try {
      let pageNo = parseInt(req.query.pageNo);
      let perPage = parseInt(req.query.perPage);
      let search = req.query.search || "";
      let data = Object.assign({}, req.query);
      let filters = { email: new RegExp(search, "i") };

      if (data.status) {
        filters.status = data.status;
      }
      if (data.name) {
        filters.name = data.name;
      }

      if (data.contact_number) {
        filters.contact_number = data.contact_number;
      }

      if (data.role) {
        let role = await RoleService.getRole({ _id: data.role });
        if (!role) throw new apiError.ResourceNotFoundError("role");
        filters.role = data.role;
      }

      let total = await AdminService.adminTotalCount(filters);

      let admins = await AdminService.getAdmins(filters, perPage, pageNo);

      return res
        .status(200)
        .send(ResponseService.success({ admins, count: total }));
    } catch (e) {
      return res.status(500).send(ResponseService.failure(e));
    }
  }
  async getAdmin(req, res) {
    try {
      let data = Object.assign({}, req.params);
      if (!data._id)
        throw new apiErrors.ValidationError("_id", messages.ID_VALIDATION);

      let admin = await AdminService.getAdmin({ _id: data._id });
      if (!admin) throw new apiError.ResourceNotFoundError("admin");
      return res.status(200).send(ResponseService.success(admin));
    } catch (e) {
      return res.status(500).send(ResponseService.failure(e));
    }
  }
  async updateAdmin(req, res) {
    try {
      let data = Object.assign({}, req.body);
      if (!data._id)
        throw new apiErrors.ValidationError("_id", messages.ID_VALIDATION);

      let admin;
      admin = await AdminService.getAdminSimply({ _id: data._id });
      if (!admin)
        throw new apiError.ResourceNotFoundError(
          "admin",
          messages.RESOURCE_NOT_FOUND
        );
      if (data.email) {
        admin = await AdminService.getAdminSimply({
          _id: { $ne: data._id },
          email: data.email,
        });
        if (!data._id)
          throw new apiErrors.ResourceAlreadyExistError(
            "email",
            messages.RESOURCE_ALREADY_EXISTS
          );
        data.email = data.email.toLowerCase();
      }
      if (data.contact_number) {
        admin = await AdminService.getAdminSimply({
          _id: { $ne: data._id },
          contact_number: data.contact_number,
        });
        if (!data._id)
          throw new apiErrors.ResourceAlreadyExistError(
            "contact_number",
            messages.RESOURCE_ALREADY_EXISTS
          );
        data.contact_number = data.contact_number.toLowerCase();
      }
      if (data.name) data.name = data.name;

      if (data.password) {
        var salt = await bcrpyt.genSaltSync(10);
        var hash = await bcrpyt.hashSync(data.password, salt);

        if (!hash) throw errorHandler.InternalServerError();
        data.password = hash;
      }

      if (data.role) {
        let role = await RoleService.getRole({ _id: data.role });
        if (!role)
          throw new apiError.ResourceNotFoundError(
            "role",
            messages.RESOURCE_NOT_FOUND
          );
      }

      console.log(data);
      if (req.file) {
        const img = {
          exists: true,
          value: req.file.key,
        };
        data.avatar = img;
      }
      // advertisement.image = req.file.destination + '/' + req.file.filename;

      admin = await AdminService.updateAdmin(data, { _id: data._id });
      if (!admin) throw new apiError.UnexpectedError();

      return res.status(200).send(ResponseService.success({ admin: admin }));
    } catch (e) {
      return res.status(500).send(ResponseService.failure(e));
    }
  }

  async registerToken(req, res) {
    try {
      let user_id = req._user_info._user_id;
      let data = Object.assign({}, req.body);

      let admin = await AdminService.getAdmin({ _id: user_id });
      if (!admin) throw new apiErrors.NotFoundError("admin");

      admin.fcm_token = data.token;
      admin = await admin.save();
      res.send(ResponseService.success(admin));
    } catch (error) {
      res.send(ResponseService.failure(error));
    }
  }
}

module.exports = new AdminUserController();
