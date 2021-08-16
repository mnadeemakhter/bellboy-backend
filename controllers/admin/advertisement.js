const AdvertisementService = require("./../../services/advertisement");
const LabelService = require("./../../services/labels");
const LocaleService = require("./../../services/locales");
const ResponseService = require("./../../common/response");

//Error Handling
const messages = require("../../common/messages");
const apiErrors = require("../../common/api-errors");
const Advertisement = require("../../models/advertisement");

class AdvertisementController {
  async addAdvertisement(req, res) {
    try {
      let data = Object.assign({}, req.body);
      const admin = req._user_info._user_id;
      if (!req.file)
        throw new apiErrors.ResourceNotFoundError(
          "icon",
          messages.IMAGE_VALIDATION
        );

      // data.image = req.file.destination + '/' + req.file.filename;
      data.image = req.file.key;
      data.uploadBy = admin;

      // data.image = req.file.location;

      let newData = await AdvertisementService.addAdvertisement(data);
      if (!newData) throw new apiErrors.UnexpectedError();

      return res
        .status(200)
        .send(ResponseService.success({ advertisement: newData }));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }

  async getAdvertisements(req, res) {
    try {
      let data = Object.assign({}, req.query);
      let query = {};
      if (data.year && data.month) {
        const year = Number(data.year);
        const month = Number(data.month);
        if (isNaN(year) || isNaN(month))
          throw new apiErrors.ValidationError(
            "year/month",
            "Invalid year or Month"
          );
        query = {
          $expr: {
            $and: [
              {
                $eq: [{ $year: "$created_at" }, year],
              },
              {
                $eq: [{ $month: "$created_at" }, month],
              },
            ],
          },
        };
      }

      let total = await AdvertisementService.AdvertisementTotalCount();
      let totalActive = await AdvertisementService.AdvertisementTotalCount({
        status: true,
      });
      let totalDeactive = await AdvertisementService.AdvertisementTotalCount({
        status: false,
      });

      let advertisements = await AdvertisementService.getAdvertisements(query);

      return res.status(200).send(
        ResponseService.success({
          advertisements,
          total: total,
          totalActive: totalActive,
          totalDeactive: totalDeactive,
        })
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send(ResponseService.failure(error));
    }
  }
  async deleteAdvertisement(req, res) {
    try {
      // let advertisements = await AdvertisementService.getAdvertisements({_id:})
      let advertisement = await AdvertisementService.getAdvertisement({
        _id: req.params.id,
      });
      console.log(advertisement);
      if (!advertisement) throw new apiErrors.NotFoundError("Advertisement");
      advertisement.delete(req._user_info._user_id);
      return res.status(200).send(ResponseService.success({ advertisement }));
    } catch (error) {
      return res.status(error.constructor).send(ResponseService.failure(error));
    }
  }

  async updateAdvertisement(req, res) {
    try {
      let data = Object.assign({}, req.body);
      const admin = req._user_info._user_id;

      if (!data._id)
        throw new apiErrors.ValidationError(
          "Advertisement",
          messages.ID_VALIDATION
        );

      let advertisement = await AdvertisementService.getAdvertisementSimply({
        _id: data._id,
      });

      if (!advertisement)
        throw new apiErrors.ResourceNotFoundError(
          "advertisement",
          messages.RESOURCE_NOT_FOUND
        );

      if (req.file)
        // advertisement.image = req.file.destination + '/' + req.file.filename;
        advertisement.image = req.file.key;

      if (data.title) advertisement.title = data.title;

      if (data.body) advertisement.title = data.body;

      if (data.status) {
        advertisement.status = data.status;
        advertisement.actionDate = new Date();
        if (data.status === false) {
          advertisement.deActiveBy = admin;
        } else if (advertisement.status === true) {
          advertisement.activeBy = admin;
        }
      }

      advertisement = await advertisement.save();
      return res
        .status(200)
        .send(ResponseService.success({ advertisement: advertisement }));
    } catch (error) {
      return res.status(500).send(ResponseService.failure(error));
    }
  }
}

module.exports = new AdvertisementController();
