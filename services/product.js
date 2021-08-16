const Product = require('./../models/products')
class ProductService {
    addProduct(request) {
        return new Product(request).save();
    }

    getProducts(request) {
        return Product.find(request).populate([
            { path: 'locales' },
            {
                path: 'labels',
                populate:
                    { path: 'locale' }
            },
            { path: 'brands.brand',  populate: [
                { path: 'locales', },
                {
                    path: 'labels',
                    populate:
                        { path: 'locale', }
                },
            ]},
            { path: 'categories.category',  populate: [
                { path: 'locales', },
                {
                    path: 'labels',
                    populate:
                        { path: 'locale', }
                },
            ]},
        ])
    }
    getProductsForAdmin(request, perPage, pageNo) {
        return Product.find(request).populate([
            { path: 'locales' },
            {
                path: 'labels',
                populate:
                    { path: 'locale' }
            },
            { path: 'brands.brand',  populate: [
                { path: 'locales', },
                {
                    path: 'labels',
                    populate:
                        { path: 'locale', }
                },
            ]},
            { path: 'categories.category',  populate: [
                { path: 'locales', },
                {
                    path: 'labels',
                    populate:
                        { path: 'locale', }
                },
            ]},
        ]);
    }
    getProductsForCustomer(request) {
        return Product.find(request).populate([
            { path: 'locales', },
            {
                path: 'labels',
                populate:
                    { path: 'locale', }
            },
            {
                path: 'brands.brand',
                populate: [
                    { path: 'locales', },
                    {
                        path: 'labels',
                        populate:
                            { path: 'locale', }
                    },
                ]
            },
        ]).select('-categories').where({ status: true });
    }

    getProductsAggregate(request) {
       return Product.aggregate([
            { "$unwind": "$categories" },
            {
                "$match": request
            },
            { "$unwind": "$brands" },
            {
                "$lookup": {
                    "from": "brands",
                    "localField": "brands.brand",
                    "foreignField": "_id",
                    "as": "brands.brand"
                },
            },
            { "$unwind": "$brands" },
           
        ])

        


    }

    getProductsAggregateForAdmin(request,pageNo,perPage) {
        return Product.aggregate([
             { "$unwind": "$categories" },
             {
                "$lookup": {
                    "from": "categories",
                    "localField": "categories.category",
                    "foreignField": "_id",
                    "as": "categories.category"
                },
            },
            { "$unwind": "$categories" },
            //  {
            //      "$match": request
            //  },
             { "$unwind": "$brands" },
             {
                 "$lookup": {
                     "from": "brands",
                     "localField": "brands.brand",
                     "foreignField": "_id",
                     "as": "brands.brand"
                 },
             },
             { "$unwind": "$brands" },
            //  {$skip: (pageNo-1)*perPage}, {$limit: perPage}  
         ])
 
         
 
 
     }

    populateProducts(request){
        return Product.populate(request,[
            { path: 'locales', },
            {
                path: 'labels',
                populate:
                    { path: 'locale', }
            },
            {
                path: 'brands',
                populate: [
                    { path: 'locales', },
                    {
                        path: 'labels',
                        populate:
                            { path: 'locale', }
                    },
                ]
            },
        ]);
    }

    getProduct(request) {
        return Product.findOne(request).populate([
            { path: 'locales' },
            {
                path: 'labels',
                populate:
                    { path: 'locale' }
            },
            { path: 'brands.brand', select: '-labels -locales' },
            { path: 'categories.category', select: '-labels -locales' },
        ]);
    }
    getSimpleProduct(request) {
        return Product.findOne(request);
    }
    ProductTotalCount(request, perPage, pageNo) {
        return Product.countDocuments(request);
    }

    updateProduct(request, criteria) {
        return Product.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteProduct(request) {
        return Product.findOneAndDelete(request).populate([
            { path: 'locales' },
            {
                path: 'labels',
                populate:
                    { path: 'locale' }
            },
            { path: 'brands', select: '-labels -locales' },
            { path: 'categories', select: '-labels -locales' },
        ]);
    }
}

module.exports = new ProductService();          