const Advertisement = require('./../models/advertisement')

class AdvertisementService {
    addAdvertisement(request) {
        return new Advertisement(request).save();
    }

    getAdvertisements(request) {
        return Advertisement.find(request)
    }

    getAdvertisement(request) {
        return Advertisement.findOne(request)
    }

    getAdvertisementSimply(request) {
        return Advertisement.findOne(request);
    }

    AdvertisementTotalCount(request) {
        return Advertisement.countDocuments(request)
    }

    updateAdvertisement(request, criteria) {
        return Advertisement.findOneAndUpdate(request, criteria, { new: true })
    }

    deleteAdvertisement(request) {
        return Advertisement.findOneAndDelete(request)
    }
}

module.exports = new AdvertisementService();