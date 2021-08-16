const WalletType = require('./../models/wallet-types')

class WalletTypeService {
    addWalletType(request) {
        return new WalletType(request).save();
    }

    getWalletTypes(request) {
        return WalletType.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }

    getWalletType(request) {
        return WalletType.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }

    WalletTypeTotalCount(request) {
        return WalletType.countDocuments(request)
    }

    updateWalletType(request, criteria) {
        return WalletType.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }

    deleteWalletType(request) {
        return WalletType.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },  ]);
    }
}

module.exports = new WalletTypeService();