const Category = require('./../models/categories')

class CategoryService {
    addCategory(request) {
        return new Category(request).save();
    }

    getCategories(request, perPage, pageNo) {
        return Category.find(request).populate([
            { path: 'locales' },
            { path: 'labels', populate: { path: 'locale' } },
            // {
            //     path: 'departments', populate: [
            //         { path: 'locales' },
            //         { path: 'labels', populate: { path: 'locale' } }
            //     ]
            // }
        ]);
        //.skip((pageNo-1)*perPage).limit(perPage);
    }

    getAllCategories(request) {
        return Category.find(request).populate([
            { path: 'locales' },
            { path: 'labels', populate: { path: 'locale' } },
            // {
            //     path: 'departments', populate: [
            //         { path: 'locales' },
            //         { path: 'labels', populate: { path: 'locale' } }
            //     ]
            // }
        ]);
    }

    getActiveCategories(request) {
        return Category.find(request).populate([
            { path: 'locales' },
            { path: 'labels', populate: { path: 'locale' } },
        ]).where({ status: true });
    }

    getCategory(request) {
        return Category.findOne(request).populate([
            { path: 'locales' },
            { path: 'labels', populate: { path: 'locale' } },
            // {
            //     path: 'departments', populate: [
            //         { path: 'locales' },
            //         { path: 'labels', populate: { path: 'locale' } }
            //     ]
            // }
        ]);
    }

    CategoryTotalCount(request, perPage, pageNo) {
        return Category.countDocuments(request);
    }

    updateCategory(request, criteria) {
        return Category.findOneAndUpdate(request, criteria, { new: true }).populate([
            { path: 'locales' },
            { path: 'labels', populate: { path: 'locale' } },
            {
                path: 'departments', populate: [
                    { path: 'locales' },
                    { path: 'labels', populate: { path: 'locale' } }
                ]
            }
        ]);
    }

    deleteCategory(request) {
        return Category.findOneAndDelete(request).populate([
            { path: 'locales' },
            { path: 'labels', populate: { path: 'locale' } },
            {
                path: 'departments', populate: [
                    { path: 'locales' },
                    { path: 'labels', populate: { path: 'locale' } }
                ]
            }
        ]);
    }

    isActive(request) {

        return Category.findOne(request).where({ status: true });
    }
}

module.exports = new CategoryService();