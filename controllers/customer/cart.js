const CategoryService = require('../../services/category')
const ProductService = require('../../services/product')
const CartService = require('../../services/cart')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')

const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')

class CartController {

    async getCart(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.query);
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            let cart = await CartService.getCart({ customer: user_id });
            if (!cart) return res.send(ResponseService.success({}, 'No Cart Created Yet', false));

            if (cart.category != null && cart.items.length > 0) {
                cart.items = LocalizationService.getLabelsForCart(cart.items, code);
                cart.category = LocalizationService.getLabels([cart.category], code)[0];
            }

            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async addToCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);

            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);

            let isActive = await CategoryService.isActive({ _id: data.category });
            if (!isActive) throw new apiErrors.InActiveError('category');
            if (!data.item) throw new apiErrors.ValidationError('item', 'Item not found');
            if (!data.brand) throw new apiErrors.ValidationError('brand', 'brand not found');
            if (!data.quantity) throw new apiErrors.ValidationError('quantity', 'Quantity not found');

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            var dataExists = await ProductService.getProduct({ _id: data.item });
            if (!dataExists) throw new apiErrors.NotFoundError();

            let image;
            if (req.file) {
                // image = req.file.destination + '/' + req.file.filename;
                image = req.file.key;

                data.image = {
                    value: image,
                    exists: true
                }
            }
            else {
                image = '';
                data.image = {
                    value: image,
                    exists: false
                }
            }

            if (data.quantity < 1) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or above 1');
            //    if (data.quantity >= 5) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or less 5');

            let itemData = {
                product: data.item,
                brand: data.brand,
                image: data.image,
                quantity: data.quantity,
            };

            let cart = await CartService.getCart({ customer: user_id });
            let updatedCart;
            let cartData;
            if (!cart) {
                cartData = {
                    customer: user_id,
                    category: data.category,
                    items: [itemData]
                }
                updatedCart = await CartService.createCart(cartData);
            }
            else {
                cart.items.push(itemData);
                cart.category= data.category,
                updatedCart = await cart.save();

            }


            cart = await CartService.getCart({ customer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError()

            cart.items = LocalizationService.getLabelsForCart(cart.items, code);
            cart.category = LocalizationService.getLabels([cart.category], code)[0];

            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async addVoiceNote(req, res) {
        try {

            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);

            let voice_note;
            console.log(req.file)
            if (req.file) {
                // voice_note = req.file.destination + '/' + req.file.filename;
                voice_note = req.file.key;

                data.voice_note = {
                    value: voice_note,
                    exists: true
                }
            }
            else {
                voice_note = '';
                data.voice_note = {
                    value: voice_note,
                    exists: false
                }
            }


            let cart = await CartService.getCart({ customer: user_id });
            let updatedCart;
            let cartData;
            if (!cart) {
                cartData = {
                    customer: user_id,
                }
                cart = await CartService.createCart(cartData);
            }

            cart.voice_note = data.voice_note;
            updatedCart = await cart.save();




            return res.send(ResponseService.success(updatedCart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async removeVoiceNote(req, res) {
        try {

            const user_id = req._user_info._user_id;

            let cart = await CartService.getCart({ customer: user_id });
            let updatedCart;
            if (!cart) throw new apiErrors.NotFoundError('cart', 'No Cart Found')
            if (!cart.voice_note.exists) throw new apiErrors.NotFoundError('voice_note', 'No Voice Note Found')

            cart.voice_note = {
                value: '',
                exists: false
            };
            updatedCart = await cart.save();


            return res.send(ResponseService.success(updatedCart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async removeFromCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);
            console.table(data);
            let cart = await CartService.getCartSimply({ customer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');
            if (!data.item) throw new apiErrors.ValidationError('item', 'Item not found');




            let updatedCart = await CartService.updateCart({ customer: user_id }, { $pull: { items: { _id: data.item } } });
            cart = await CartService.getCart({ customer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError()

            cart.items = LocalizationService.getLabelsForCart(cart.items, code);
            cart.category = LocalizationService.getLabels([cart.category], code)[0];


            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async updateCart(req, res) {
        try {
            const user_id = req._user_info._user_id;
            var data = Object.assign({}, req.body);
            console.log(data);
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            let cart = await CartService.getCartSimply({ customer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');
            if (!data.item) throw new apiErrors.ValidationError('item', 'Item not found');

            let image;
            if (req.file) {
                // image = req.file.destination + '/' + req.file.filename;
                image = req.file.key;

                data.image = {
                    value: image,
                    exists: true
                }
                cart.items.id(data.item).image = data.image;

            }
            else {
                if (!cart.items.id(data.item).image.exists) {
                    image = '';
                    data.image = {
                        value: image,
                        exists: false
                    }
                    cart.items.id(data.item).image = data.image;
                }
            }

            if (data.quantity < 1) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or above 1');

            cart.items.id(data.item).quantity = data.quantity;
            //    if (data.quantity >= 5) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or less 5');
            cart = await cart.save();
            cart = await CartService.getCart({ customer: user_id });
            cart.items = LocalizationService.getLabelsForCart(cart.items, code);
            cart.category = LocalizationService.getLabels([cart.category], code)[0];
            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async addAddress(req, res) {
        try {
            const user_id = req._user_info._user_id;
            var data = Object.assign({}, req.body);
            console.log(data);
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            let cart = await CartService.getCartSimply({ customer: user_id });

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION);
            if (!data.contact_number) throw new apiErrors.ValidationError('contact_number', messages.CONTACT_NUMBER_VALIDATION);
            if (!data.address) throw new apiErrors.ValidationError('address', messages.ADDRESS_VALIDATION);
            if (!data.latitude) throw new apiErrors.ValidationError('latitude', messages.LATITUDE_VALIDATION);
            if (!data.longitude) throw new apiErrors.ValidationError('longitude', messages.LONGITUDE_VALIDATION);

            let address = {
                title: data.title,
                contact_number: data.contact_number,
                address: data.address,
                geolocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            }


            let cartData;
            if (!cart) {
                cartData = {
                    customer: user_id,
                }
                cart = await CartService.createCart(cartData);
            }
            let type = data.type || 1;
            if (type == 1) {
                cart.deliveryAddress = address;
                cart.hasDelivery = true;
            }
            else if (type == 2) {
                cart.pickUpAddress = address;
                cart.hasPickUp = true;
            }
            //    if (data.quantity >= 5) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or less 5');
            cart = await cart.save();
            cart = await CartService.getCart({ customer: user_id });

            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async removeAddress(req, res) {
        try {
            const user_id = req._user_info._user_id;
            var data = Object.assign({}, req.body);
            console.log(data);
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            let cart = await CartService.getCartSimply({ customer: user_id });
            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');



            cart.pickUpAddress = {};
            cart.hasPickUp = false;

            //    if (data.quantity >= 5) throw new apiErrors.ValidationError('quantity', 'Quantity should be equal or less 5');
            cart = await cart.save();
            cart = await CartService.getCart({ customer: user_id });
            cart.items = LocalizationService.getLabelsForCart(cart.items, code);
            cart.category = LocalizationService.getLabels([cart.category], code)[0];
            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async deleteCart(req, res) {
        try {
            const user_id = req._user_info._user_id;

        
         

         

            let cart = await CartService.getCart({ customer: user_id });
            if (!cart) return res.send(ResponseService.success({}, 'No Cart Created Yet', false));

           cart = await CartService.deleteCart({customer:user_id});

            return res.send(ResponseService.success(cart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new CartController();