const Cart = require('../models/cart')
const messages = require('../common/messages')
class CartService {
    getCart(request) {
        return Cart.findOne(request).populate([
            {
                path: 'category',
                populate: [
                    { path: 'locales' },
                    {
                        path: 'labels',
                        populate:
                            { path: 'locale' }
                    },
                ],
                select:'-created_at -updated_at -categories -__v'
            },
            {
                path: 'items.product',
                populate: [
                    { path: 'locales' },
                    {
                        path: 'labels',
                        populate:
                            { path: 'locale' }
                    },
                ],
                select:'-created_at -updated_at -brands -categories -__v'
            },
            {
                path: 'items.brand',
                populate: [
                    { path: 'locales' },
                    {
                        path: 'labels',
                        populate:
                            { path: 'locale' }
                    },
                ],
                select:'-created_at -updated_at -__v'
            }
        ]);
    }
    getCartSimply(request) {
        return Cart.findOne(request);
    }
    getCarts(request) {
        return Cart.find(request).populate({ path: 'items.product' });
    }
    CartTotalCount(request) {
        return Cart.countDocuments(request)
    }
    createCart(request) {
        return new Cart(request).save();
    }
    updateCart(request, criteria) {
        console.log('request' + messages.arrowHead, request)
        console.log('criteria' + messages.arrowHead, criteria)
        return Cart.findOneAndUpdate(request, criteria, { new: true }).populate({ path: 'items.product' });
    }
    deleteCart(criteria) {
        return Cart.findOneAndDelete(criteria).populate({ path: 'items.product' });
    }
}

module.exports = new CartService();