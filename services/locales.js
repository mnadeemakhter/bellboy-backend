const Locale = require('./../models/locales')

class LocaleService {
    addLocale(request) {
        return new Locale(request).save();
    }

    getLocales(request) {
        return Locale.find(request);
    }

    getLocale(request) {
        return Locale.findOne(request);
    }

    LocaleTotalCount(request) {
        return Locale.countDocuments(request)
    }

    updateLocale(request, criteria) {
        return Locale.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteLocale(request) {
        return Locale.findOneAndDelete(request);
    }
}

module.exports = new LocaleService();