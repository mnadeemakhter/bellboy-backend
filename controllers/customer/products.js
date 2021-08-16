const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const ProductService = require('./../../services/product')
const LocaleService = require('../../services/locales')
const LocalizationService = require('../../common/localization')
const mongoose = require('mongoose')

class CustomerProductController {

    async getActiveProducts(req, res) {
        try {


            let data = Object.assign({}, req.query);
            let filters = {};

            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);

            filters['categories.category'] = new mongoose.Types.ObjectId(data.category);
            filters['brands'] = { $exists: true, $ne: [] }

            let code = data.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });
         //   console.log(locale);
            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));


            let linearProducts = await ProductService.getProductsForCustomer(filters)
            let aggregatedProducts = await ProductService.getProductsAggregate(filters)


            linearProducts = LocalizationService.getLabels(linearProducts, code);


            linearProducts.forEach(product => {
                let brands = product.brands;
                product.brands = LocalizationService.getLabelsWithKey(brands, code, 'brand');
            });
            let products = [];
            linearProducts.forEach(linearProduct => {
                var keys = Object.keys(linearProduct);
           //     console.log('Linear Product', linearProduct)
                aggregatedProducts.forEach(aggregatedProduct => {
                //    console.log('Aggregated Product', aggregatedProduct)
                    let p = {};
                    if (linearProduct._id.toString() === aggregatedProduct._id.toString()) {
                  //      console.log('Matched Product', aggregatedProduct)
                        keys.forEach(key => {
                            if (key != 'brands')
                                p[key] = linearProduct[key];
                        })
                        linearProduct.brands.forEach(brand => {
                            if (brand._id.toString() === aggregatedProduct.brands._id.toString() && aggregatedProduct.brands.active) {
                                p['brand'] = brand.brand;
                            }
                        })
                        products.push(p);
                    }
                   
                })
            });



            return res.status(200).send(ResponseService.success(products))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new CustomerProductController();