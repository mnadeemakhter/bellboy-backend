const BrandService = require('./../../services/brand')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const LocalizationService = require('../../common/localization')

class BrandController {

    async addBrand(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Brand Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)




            let Brand = await BrandService.getBrand({ title: data.title });

            if (Brand) throw new apiErrors.ResourceAlreadyExistError('brand', messages.RESOURCE_ALREADY_EXISTS)

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            // data.icon = req.file.destination + '/' + req.file.filename;
            data.icon = req.file.key;

            console.log(req.file)

            let newData = await BrandService.addBrand(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title, type: 'b' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);


            let updatedData = await newData.save();

            // let code = req.query.locale || 'en';
            // let localeE = await LocaleService.getLocale({ code: code });
            // if (!localeE) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await BrandService.getBrand({ _id: updatedData._id });

            // let brands = LocalizationService.getLabels([fetchData], code);
            // brands = brands[0];

            return res.status(200).send(ResponseService.success({ Brand: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getBrands(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = req.query.search || ''

            let total = await BrandService.BrandTotalCount({ title: new RegExp(search, 'i') }, perPage, pageNo)
            // let code = req.query.locale || 'en';
            // let locale = await LocaleService.getLocale({ code: code });
            // console.log(locale);
            // if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let brands = await BrandService.getBrands({ title: new RegExp(search, 'i') }, perPage, pageNo)
            // brands = LocalizationService.getLabels(brands,code);
            return res.status(200).send(ResponseService.success({ brands, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getAllBrands(req, res) {
        try {

            let brands = [];
            brands = await BrandService.getAllBrands({ status: true })
            // brands = LocalizationService.getLabels(brands,code);
            return res.status(200).send(ResponseService.success({ brands, count: brands.length }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getBrand(req, res) {
        try {

            let data = Object.assign({}, req.params);
            // let code = req.params.locale || 'en';
            // let locale = await LocaleService.getLocale({ code: code });
            // console.log(locale);
            // if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let brand = await BrandService.getBrand({ _id: data.id })
            if (!brand) throw new apiErrors.ResourceNotFoundError('brand', 'Invalid brand id')
            // brand = LocalizationService.getLabels([brand], code);
            // brand = brand[0];
            return res.status(200).send(ResponseService.success(brand))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async assignLabel(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log(messages.arrowHead, data)
            if (!data.label) throw new apiErrors.ValidationError('label', messages.LABEL_VALIDATION);
            if (!data.locale) throw new apiErrors.ValidationError('locale', messages.LOCALE_VALIDATION);
            if (!data.brand) throw new apiErrors.ValidationError('brand', messages.Brand_VALIDATION);

            data.type = 'b';
            let locale = await LocaleService.getLocale({ _id: data.locale });
            if (!locale) throw new apiErrors.ResourceNotFoundError('locale', 'Invalid Locale');
            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await BrandService.getBrand({ _id: data.brand, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label, type: data.type });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await BrandService.updateBrand({ _id: data.brand }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }

    async updateBrand(req, res) {
        try {
            let data = Object.assign({}, req.body);

            if (!data.brand_id) throw new apiErrors.ValidationError('brand_id', messages.BRAND_ID_VALIDATION)





            let brand = await BrandService.getBrand({ _id: data.brand_id });

            if (!brand) throw new apiErrors.ResourceNotFoundError('brand', messages.RESOURCE_NOT_FOUND)


            if (data.title) {
                if (!data.label_id) throw new apiErrors.ValidationError('label_id', messages.LABEL_VALIDATION)


                let checkLabel = await LabelService.getLabel({ _id: data.label_id });

                if (!checkLabel) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND)

                let duplicate = await LabelService.getLabel({ label: data.title, _id: { $ne: data.label_id } });

                if (duplicate) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)



                let locale = await LocaleService.getLocale({ code: 'en' });
                if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);


                if (locale._id.toString() === checkLabel.locale.toString()) {
                    brand.title = data.title;
                }

                checkLabel.label = data.title;
                await checkLabel.save();
            }

            if (data.status) brand.status = data.status;


            if (req.file) 
            brand.icon = req.file.key;

            // brand.icon = req.file.destination + '/' + req.file.filename;


            brand = await brand.save();
            if (!brand) throw new apiErrors.UnexpectedError();



            brand = await BrandService.getBrand({ _id: brand._id });

            // let brands = LocalizationService.getLabels([fetchData], code);
            // brands = brands[0];

            return res.status(200).send(ResponseService.success({ Brand: brand }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }


}

module.exports = new BrandController();