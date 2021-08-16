const Order = require('../models/order')
const messages = require('../common/messages')
class OrderService {
    getOrder(request) {
        return Order.findOne(request).populate([
            {
                path: 'customer',
                select: 'name mobile avatar fcm_token'
            },
            {
                path: 'bellboy',
                select: 'name mobile avatar fcm_token'
            }, {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
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
                select: '-created_at -updated_at -brands -categories -__v'
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
                select: '-created_at -updated_at -__v'
            }
        ]);
    }

    getOrderForAdminCustomer(request) {
        return Order.find(request).populate([

            {
                path: 'bellboy',
                select: 'name mobile avatar _id is_working is_busy status'
            }, {
                path: 'bellboyType',
                select: '_id title icon'
            },
            {
                path: 'category',

                select: 'title icon _id'
            },


        ]).select('order_id category created_at status bellboy charges bellboyType').sort('-created_at');
    }
    getOrderSimply(request) {
        return Order.findOne(request);
    }
    getOrders(request) {
        return Order.find(request).populate([
            {
                path: 'customer',
                select: 'name mobile avatar'
            },
            {
                path: 'bellboy',
                select: 'name mobile avatar'
            }, {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
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
                select: '-created_at -updated_at -brands -categories -__v'
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
                select: '-created_at -updated_at -__v'
            }
        ]);
    }

    getOrdersForCustomer(request) {
        return Order.find(request).select('-items -pickUpAddress -deliveryAddress -hasPickUp -hasDelivery -customer').populate([

            {
                path: 'bellboy',
                select: 'name mobile avatar'
            }, {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
            },

        ]).sort('-created_at');
    }

    getOrdersForAdmin(request,perPage,pageNo) {
        return Order.find(request).select('-items -pickUpAddress -deliveryAddress -hasPickUp -hasDelivery').populate([
            {
                path: 'customer',
                select: 'name mobile avatar'
            },
            {
                path: 'bellboy',
                select: 'name mobile avatar'
            }, {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
            },

        ]).skip((pageNo-1)*perPage).limit(perPage).sort('-created_at');
    }


    getOrdersForBellBoy(request) {
        return Order.find(request).select('-items -pickUpAddress -deliveryAddress -hasPickUp -hasDelivery -bellboy').populate([

            {
                path: 'customer',
                select: 'name mobile avatar'
            },
            {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
            },

        ]).sort('-created_at');
    }

    OrderTotalCount(request) {
        return Order.countDocuments(request)
    }
    createOrder(request) {
        return new Order(request).save();
    }
    updateOrder(request, criteria) {
       
        return Order.findOneAndUpdate(request, criteria, { new: true }).populate([
            {
                path: 'customer',
                select: 'name mobile avatar'
            },
            {
                path: 'bellboy',
                select: 'name mobile avatar'
            }, {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
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
                select: '-created_at -updated_at -brands -categories -__v'
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
                select: '-created_at -updated_at -__v'
            }
        ]);
    }
    deleteOrder(criteria) {
        return Order.findOneAndDelete(criteria).populate([
            {
                path: 'customer',
                select: 'name mobile avatar'
            },
            {
                path: 'bellboy',
                select: 'name mobile avatar'
            },
            {
                path: 'bellboyType',
                select: '_id title icon'
            },
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
                select: '-created_at -updated_at -categories -__v'
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
                select: '-created_at -updated_at -brands -categories -__v'
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
                select: '-created_at -updated_at -__v'
            }
        ]);
    }
}

module.exports = new OrderService();