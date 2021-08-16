module.exports = {

    //Validations
    EMAIL_VALIDATION: 'Email Required',
    CONTACT_NUMBER_VALIDATION: 'Contact Number Required',
    MOBILE_VALIDATION: 'Mobile Number Required',
    BUILDING_NUMBER_VALIDATION: 'Building number Required',
    NAME_VALIDATION: 'Name Required',
    LATITUDE_VALIDATION: 'Latitude Required',
    LONGITUDE_VALIDATION: 'Longitude Required',
    ADDRESS_VALIDATION: 'Address Required',
    BIRTH_DATE_VALIDATION: 'Birth Date Required',
    GENDER_VALIDATION: 'Gender Required',
    PASSWORD_VALIDATION: 'Password Required',
    MIN_NUMBER_VALIDATION: 'Minimum number Required',
    MAX_NUMBER_VALIDATION: 'Maximum number Required',
    DAY_VALIDATION: 'Maximum number Required',
    MONTH_VALIDATION: 'Maximum number Required',
    YEAR_VALIDATION: 'Maximum number Required',
    PASSWORD_VALIDATION: 'Password Required',
    TITLE_VALIDATION: 'Title Required',
    VERSION_VALIDATION: 'Version Required',
    TOPIC_VALIDATION: 'Topic Required',
    BODY_VALIDATION: 'Body Required',
    DESCRIPTION_VALIDATION: 'Description Required',
    MESSAGE_VALIDATION: 'Message Validation',
    HAS_PLATE_VALIDATION: 'Plate Flag Required',
    REFERRAL_VALIDATION: 'Referral ID Required',
    AVATAR_VALIDATION: 'Avatar Required',
    IMAGE_VALIDATION: 'Image Required',
    CUSTOMER_ID_VALIDATION: 'Customer ID required',
    CATEGORY_VALIDATION: 'Category ID Required',
    ORDER_TYPE_VALIDATION: 'Order Type Required',
    ORDER_ID_VALIDATION: 'Order ID Required',
    REASON_VALIDATION: 'Reason Required',
    NUMBER_OF_HOURS_VALIDATION: 'No. of hours Required',
    DEPARTMENT_ID_VALIDATION: 'Department ID Required',
    ROLE_ID_REQUIRED: 'Role ID Required',
    PRODUCT_ID_VALIDATION: 'Product Id Required',
    EMAIL_ALREADY_EXISTS: 'Email Already Exists',
    USER_BLOCK: 'You are blocked By BellBoy Administration',
    CREDIENTIALS_MISMATCH: 'Crediential are not correct',
    PERMISSIONS_REQUIRED: 'At least one permission required',
    RESOURCE_ALREADY_EXISTS: 'This resource is already exists',
    AUTHENTICATION_ERROR: 'User is not Authenticated',
    EXPIRY_DATE_VALIDATION: 'Expiry date is required',
    NIC_NUMBER_VALIDATION: 'NIC number is required',
    NIC_LENGTH_VALIDATION: 'NIC number length should be 13 digits',
    STATUS_VALIDATION: 'Status value required',
    APPROVAL_VALIDATION: 'Approval value required',
    USER_ID_VALIDATION: 'User ID required',
    INVALID_ID_VALIDATION: 'Invalid ID format required',
    STATUS_ENUM_VALIDATION: 'Status can be only 0,1,2',
    APPROVAL_ENUM_VALIDATION: 'Status can be only 0,1,2',
    CATEGORY_ID_VALIDATION: 'Category ID Required',
    SEGMENT_ID_VALIDATION: 'Segment ID Required',
    BRAND_ID_VALIDATION: 'Brand ID Required',
    WALLET_TYPE_VALIDATION: 'Wallet Type Required',
    LABEL_VALIDATION: 'Label Required',
    LOCALE_VALIDATION: 'Locale Required',
    ID_VALIDATION: 'ID Required',
    HIRING_ID_VALIDATION: 'Hiring ID Required',
    ACTION_ID_VALIDATION: 'Action ID Required',
    HIRING_ACTION_TYPE_VALIDATION: 'Hiring Action Type Required',
    LOCALE_CODE_VALIDATION: 'Locale Code Required',
    LOCALE_ALREADY_EXISTS_IN: 'Locale Already Exists for this resource',
    RESOURCE_NOT_FOUND: 'Resource not exists',
    VEHICLE_ID_VALIDATION: 'Vehicle ID Required',
    VEHICLE_TYPE_ID_VALIDATION: 'Vehicle Type ID Required',
    VEHICLE_BRAND_ID_VALIDATION: 'Vehicle Brand ID Required',
    VEHICLE_MODEL_ID_VALIDATION: 'Vehicle MODEL ID Required',
    VEHICLE_REGISTRATION_YEAR_VALIDATION: 'Vehicle Registration Year Required',
    VEHICLE_ENGINE_NO_VALIDATION: 'Vehicle Engine No Required',
    VEHICLE_REGISTRATION_NO_VALIDATION: 'Vehicle Registration No Required',
    VEHICLE_OWNER_NAME: 'Vehicle Registration No Required',
    HEX_CODE_VALIDATION: 'Hex Code Required',
    R_CODE_VALIDATION: 'R code Required',
    G_CODE_VALIDATION: 'G code Required',
    B_CODE_VALIDATION: 'B code Required',
    COLOR_VALIDATION: 'Color Required',
    PLATE_NUMBER_VALIDATION: 'Plate number Required',
    PLATE_IMAGE_VALIDATION: 'Plate image Required',
    FRONT_IMAGE_VALIDATION: 'Front image Required',
    BACK_IMAGE_VALIDATION: 'Back image Required',
    REGISTRATION_BACK_IMAGE_VALIDATION: 'Registration Back image Required',
    REGISTRATION_FRONT_IMAGE_VALIDATION: 'Registration Front image Required',
    LEFT_IMAGE_VALIDATION: 'Left image Required',
    RIGHT_IMAGE_VALIDATION: 'Right image Required',
    BELLBOY_ID_VALIDATION: 'Bellboy ID Required',
    BELLBOY_TYPE_VALIDATION: 'Bellboy Type Required',
    TYPE_VALIDATION: 'Type Required',
    VALUE_VALIDATION: 'Value Required',
    SERVICE_TYPE_VALIDATION: 'Service Type Required',
    CHARGES_TYPE_VALIDATION: 'Charges Type Required',
    CHARGE_VALIDATION: 'Charges ID Required',
    stage1: [
        "I don't need a hiring anymore",
        'Taking long time to find a BellBoy',
        'I entered wrong details',
        'Other'
    ],
    stage2: [
        'BellBoy is not moving',
        'I entered wrong details',
        'Other'
    ],
    stage3: [
        'BellBoy is not moving',
        'I entered wrong details',
        'Other'
    ],
    stage4: [
        'BellBoy is taking so much time',
        'BellBoy is not moving',
        'BellBoy did not collect all items',
    ],
    stage5: [
        'BellBoy is taking so much time',
        'BellBoy is not moving',
        'BellBoy did not collect all items',
        'I am not able to find the BellBoy'
    ],
    //Bellboys
    orderState1: {
        title: 'New Delivery',
        body: 'Congrats! Afzaal malik you have recieved a new delivery',
    },

    orderState7: {
        title: 'Delivery Cancelled',
        body: 'Customer Name cancelled the delivery. Sorry for the inconvenience!!!',
    },

    //Customer
    orderState2: {
        title: 'Delivery Recieved',
        body: 'BellBoy Afzaal Malik is assigned to fullfil your delivery',
    },
    orderState3: {
        title: 'Shopping Started',
        body: 'BellBoy Afzaal Malik is at the store',
    },
    orderState4: {
        title: 'On The Way',
        body: 'BellBoy Afzaal Malik is on the way to you',
    },
    orderState5: {
        title: 'Meet BellBoy',
        body: 'Please meet BellBoy Afzaal Malik to collect your items!',
    },
    orderState6: {
        title: 'Pay Bill',
        body: 'Please pay the bill 300 PKR to BellBoy Afzaal Malik!',
    },


    //Bellboy
    hiringState1: {
        title: 'New Hiring',
        body: 'Congrats! Afzaal malik you have recieved a new hiring for 2 hours',
    },

    hiringState4: {
        title: 'Hiring Cancelled',
        body: 'Customer Name cancelled your hiring. Sorry for the inconvenience!!!',
    },


    //Customer
    hiringState2: {
        title: 'Hiring Recieved',
        body: 'BellBoy Afzaal Malik is at your service for 2 hours',
    },
    hiringState3: {
        title: 'Pay Bill',
        body: 'Please pay the bill 300 PKR to BellBoy Afzaal Malik!',
    },

    hiringActionState:{
        title: 'Action Goods Delivery Done!',
        body: 'BellBoy Afzaal Malik has completed the action',
    },
   

    //
    arrowHead: '   >=====================>>>   ',
}