const HiringCart = require('../models/hiring-cart')
const messages = require('../common/messages')
class HiringCartService {
    getHiringCart(request) {
        return HiringCart.findOne(request).populate([
            { path: 'bellboyType',select:'name mobile avatar' },
            { path: 'customer' ,select:'name mobile avatar'},
            { path: 'actions.actionType', populate: [
                { path: 'locales' },
                {
                    path: 'labels',
                    populate:
                        { path: 'locale' }
                },
            ],
            select:'-created_at -updated_at -__v' }
        ]);
    }
    getHiringCartSimply(request) {
        return HiringCart.findOne(request);
    }
    getHiringCarts(request) {
        return HiringCart.find(request).populate([
            { path: 'bellboyType',select:'name mobile avatar' },
            { path: 'customer' ,select:'name mobile avatar'},
            { path: 'actions.actionType' }
        ]);
    }
    HiringCartTotalCount(request) {
        return HiringCart.countDocuments(request)
    }
    createHiringCart(request) {
        return new HiringCart(request).save();
    }
    updateHiringCart(request, criteria) {
        console.log('request' + messages.arrowHead, request)
        console.log('criteria' + messages.arrowHead, criteria)
        return HiringCart.findOneAndUpdate(request, criteria, { new: true }).populate([
            { path: 'bellboyType',select:'name mobile avatar' },
            { path: 'customer' ,select:'name mobile avatar'},
            { path: 'actions.actionType' }
        ]);
    }
    deleteHiringCart(criteria) {
        return HiringCart.findOneAndDelete(criteria).populate([
            { path: 'bellboyType',select:'name mobile avatar' },
            { path: 'customer' ,select:'name mobile avatar'},
            { path: 'actions.actionType' }
        ]);
    }
}

module.exports = new HiringCartService();