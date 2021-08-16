const Brand = require('./../models/brand')

class BrandService {
    addBrand(request) {
        return new Brand(request).save();
    }

    getBrands(request, perPage, pageNo) {
        return Brand.find(request).populate([
            { path: 'locales' },
            {
                path: 'labels',
                populate: { path: 'locale' }
            },
        ]);
        //.skip((pageNo-1)*perPage).limit(perPage);
    }

    getAllBrands(request) {
        return Brand.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }

    getBrand(request) {
        return Brand.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }

    BrandTotalCount(request, perPage, pageNo) {
        return Brand.countDocuments(request);
    }

    updateBrand(request, criteria) {
        return Brand.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }

    deleteBrand(request) {
        return Brand.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }
}

module.exports = new BrandService();