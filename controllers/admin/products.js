const ProductService = require('./../../services/product')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

const HelperService = require('./../../common/helper')
const BrandService = require('./../../services/brand')
const DepartmentService = require('./../../services/department')
const CategoryService = require('./../../services/category')
//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const LocalizationService = require('../../common/localization')
const mongoose = require('mongoose')
class ProductController {

    async addProduct(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Product Data', messages.arrowHead, data)
            console.table(data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            if (!data.brands || data.brands.length == 0) throw new apiErrors.ValidationError('brands', messages.BRAND_ID_VALIDATION)
            if (!data.categories || data.categories.length == 0) throw new apiErrors.ValidationError('categories', messages.CATEGORY_ID_VALIDATION)


            let dep;
            dep = data;
            var brands = [];
            var categories = [];
            var brandIds = data.brands.toString().split(",").map(function (element) {

                return element;
            });
            brandIds.forEach(async element => {
                //      let brand = await BrandService.getBrand({ _id: element });
                //    if (!brand) throw new apiErrors.ResourceNotFoundError('brand', 'Invalid Brand ID')
                brands.push({ brand: element, active: true });
            });
            var categoryIds = data.categories.toString().split(",").map(function (element) {

                return element;
            });

            categoryIds.forEach(async value => {
                //   let category = await CategoryService.getCategory({ _id: value });
                //  if (!category) throw new apiErrors.ResourceNotFoundError('category', 'Invalid Category ID')
                categories.push({ category: value, active: true });
            });

            dep.brands = brands;
            dep.categories = categories;
            console.table(categories)
            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)

            let product = await ProductService.getProduct({ title: data.title });

            if (product) throw new apiErrors.ResourceAlreadyExistError('product', messages.RESOURCE_ALREADY_EXISTS)

            let newData = await ProductService.addProduct(dep);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title, type: 'p' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);

            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await ProductService.getProduct({ _id: updatedData._id });
            return res.status(200).send(ResponseService.success({ Product: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async getProducts(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = req.query.search || ''

            let data = Object.assign({}, req.query);
            let filters = { title: new RegExp(search, 'i'), };

            if (data.categories) {
                let categories = data.categories.split(',').map(function (element) {

                    return element;
                });
                filters['categories.category'] = { $in: categories };
            }

            if (data.brands) {
                let brands = data.brands.split(',').map(function (element) {
                    return element;
                });
                filters['brands.brand'] = { $in: brands };
            }
            let code = data.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });
           // console.log(locale);
            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            // if (data.department)
            //     filters['categories.department'] = data.department;

            let linearProducts = await ProductService.getProducts(filters)
            let aggregatedProducts = await ProductService.getProductsAggregateForAdmin(filters)


            let originalProducts = linearProducts;
            linearProducts = LocalizationService.getLabels(linearProducts, code);
            let products = [];
            linearProducts.forEach(linearProduct => {
                let brands = linearProduct.brands;
                let categories = linearProduct.categories;

                linearProduct.brands = LocalizationService.getLabelsWithKey(brands, code, 'brand');
                linearProduct.categories = LocalizationService.getLabelsWithKey(categories, code, 'category');
                var keys = Object.keys(linearProduct);
              //  console.log('Linear Product', linearProduct)
                aggregatedProducts.forEach(aggregatedProduct => {
            //       console.log('Aggregated Product', aggregatedProduct)
                    let p = {};
                    if (linearProduct._id.toString() === aggregatedProduct._id.toString()) {
               //         console.log('Matched Product', aggregatedProduct)
                        keys.forEach(key => {
                            if (key != 'brands' && key != 'categories')
                                p[key] = linearProduct[key];
                        })
                        linearProduct.brands.forEach(brand => {
                            if (brand._id.toString() === aggregatedProduct.brands._id.toString()) {
                                p['brandData'] = brand;
                            }
                        })
                        linearProduct.categories.forEach(category => {
                            if (category._id.toString() === aggregatedProduct.categories._id.toString()) {
                                p['categoryData'] = category;
                            }
                        })
                     
                        products.push(p);
                    }

                })
            });

            originalProducts.forEach(o => {
                products.forEach(p => {
                    if (o._id.toString() === p._id.toString()) {
                        p['locales'] = o.locales;
                        p['labels'] = o.labels;
                    }
                });
            });
            const paginateCollection = HelperService.paginate(products, pageNo, perPage);
            const total = products.length;


            return res.status(200).send(ResponseService.success({ products: paginateCollection, count: total }))

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
            if (!data.product) throw new apiErrors.ValidationError('product', messages.Product_VALIDATION);

            data.type = 'p';
            let locale = await LocaleService.getLocale({ _id: data.locale });
            if (!locale) throw new apiErrors.ResourceNotFoundError('locale', 'Invalid Locale');

            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await ProductService.getProduct({ _id: data.product, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label, type: data.type });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await ProductService.updateProduct({ _id: data.product }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
    async addBrand(req, res) {
        try {

            let data = Object.assign({}, req.body);

            if (!data.product) throw new apiErrors.ValidationError('product', messages.PRODUCT_ID_VALIDATION)
            if (!data.brands || data.brands.length == 0) throw new apiErrors.ValidationError('brands', messages.BRAND_ID_VALIDATION)

            let product = await ProductService.getProduct({ _id: data.product });
            if (!product) throw new apiErrors.ResourceNotFoundError('product', 'Invalid Product ID')

            var brands = [];
            var brandIds = data.brands.toString().split(",").map(function (element) {

                return element;
            });
            console.log(data.brands)


            for (const element of brandIds) {
                let brand = await BrandService.getBrand({ _id: element });
                if (!brand) throw new apiErrors.ResourceNotFoundError('brand', 'Invalid Brand ID');
                else {
                    let checkProduct = await ProductService.getSimpleProduct({ _id: data.product, 'brands.brand': { $in: [element] }, });
                    if (checkProduct) throw new apiErrors.ResourceAlreadyExistError(element, 'Brand Already Exists');
                }

                let b = {
                    active: true,
                    brand: element
                }
                brands.push(b);
                product.brands.push(b);
            }
            if (brands.length == 0) throw new apiErrors.ResourceNotFoundError('brands', messages.RESOURCE_NOT_FOUND);

            await product.save();
            let getProduct = await ProductService.getProduct({ _id: data.product });
            return res.status(200).send(ResponseService.success(getProduct))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async removeBrand(req, res) {
        try {

            let data = Object.assign({}, req.body);

            if (!data.product) throw new apiErrors.ValidationError('product', messages.PRODUCT_ID_VALIDATION)
            if (!data.brands || data.brands.length == 0) throw new apiErrors.ValidationError('brands', messages.BRAND_ID_VALIDATION)

            let product = await ProductService.getProduct({ _id: data.product });
            if (!product) throw new apiErrors.ResourceNotFoundError('product', 'Invalid Product ID')

            var brands = [];
            var brandIds = data.brands.toString().split(",").map(function (element) {

                return element;
            });
            console.log(data.brands)


            for (const element of brandIds) {
                let brand = await BrandService.getBrand({ _id: element });
                if (!brand) throw new apiErrors.ResourceNotFoundError('brand', 'Invalid Brand ID');
                await ProductService.updateProduct({ _id: data.product }, { $pull: { 'brands': { brand: new mongoose.Types.ObjectId(element) } } })
            }

            let getProduct = await ProductService.getProduct({ _id: data.product });
            return res.status(200).send(ResponseService.success(getProduct))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async addCategory(req, res) {
        try {

            let data = Object.assign({}, req.body);

            if (!data.product) throw new apiErrors.ValidationError('product', messages.PRODUCT_ID_VALIDATION)
            if (!data.categories || data.categories.length == 0) throw new apiErrors.ValidationError('categories', messages.CATEGORY_ID_VALIDATION)

            let product = await ProductService.getProduct({ _id: data.product });
            if (!product) throw new apiErrors.ResourceNotFoundError('product', 'Invalid Product ID')

            var categories = [];
            var categoryIds = data.categories.toString().split(",").map(function (element) {

                return element;
            });
            console.log(data.categoryIds)


            for (const element of categoryIds) {
                let category = await CategoryService.getCategory({ _id: element });
                if (!category) throw new apiErrors.ResourceNotFoundError('category', 'Invalid Category ID');
                else {
                    let checkProduct = await ProductService.getSimpleProduct({ _id: data.product, 'categories': { $in: [element] }, });
                    if (checkProduct) throw new apiErrors.ResourceAlreadyExistError(element, 'Category Already Exists');
                }
                let c = {
                    active: true,
                    category: element
                }
                categories.push(b);
                product.categories.push(b);

            }
            if (categories.length == 0) throw new apiErrors.ResourceNotFoundError('categories', messages.RESOURCE_NOT_FOUND);

            await product.save();
            let getProduct = await ProductService.getProduct({ _id: data.product });
            return res.status(200).send(ResponseService.success(getProduct))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async removeCategory(req, res) {
        try {

            let data = Object.assign({}, req.body);

            if (!data.product) throw new apiErrors.ValidationError('product', messages.PRODUCT_ID_VALIDATION)
            if (!data.categories || data.categories.length == 0) throw new apiErrors.ValidationError('categories', messages.CATEGORY_ID_VALIDATION)

            let product = await ProductService.getProduct({ _id: data.product });
            if (!product) throw new apiErrors.ResourceNotFoundError('product', 'Invalid Product ID')

            var categories = [];
            var categoryIds = data.categories.toString().split(",").map(function (element) {

                return element;
            });
            console.log(data.categoryIds)


            for (const element of categoryIds) {
                let category = await CategoryService.getCategory({ _id: element });
                if (!category) throw new apiErrors.ResourceNotFoundError('category', 'Invalid Category ID');

                await ProductService.updateProduct({ _id: data.product }, { $pull: { 'categories': { category: new mongoose.Types.ObjectId(element) } } })

            }

            let getProduct = await ProductService.getProduct({ _id: data.product });
            return res.status(200).send(ResponseService.success(getProduct))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
    async getProduct(req, res) {
        try {

            let data = Object.assign({}, req.params);

            let product = await ProductService.getProduct({ _id: data.id })
            if (!product) throw new apiErrors.ResourceNotFoundError('product', 'Invalid product id')
            return res.status(200).send(ResponseService.success(product))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

}

module.exports = new ProductController();