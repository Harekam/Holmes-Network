/**
 * Created by harekam on 27/08/15.
 */
var CONSTANTS = require('./constants');

var ERROR_MESSAGES = {
    'SOMETHING_WRONG': 'Something went wrong.',
    'INVALID_TIMEZONE': 'Invalid timezone.',
    'INVALID_OLD_PASSWORD': 'Invalid old password.',
    'DATA_NOT_FOUND': 'Data not found.',
    'OTP_FAIL': 'OTP fail.',
    'PARAMETER_MISSING': 'Parameters missing.',
    'PHONE_AUTH_FAIL': 'You are not authorize to perform this action on this phone number.',
    'SERVING_LOCATION_NOT_EXITS': 'This serving location does not exists',
    'WRONG_PARAMETER': 'Wrong parameter.',
    'UPLOAD_ERROR': 'Error in uploading.',
    'DUPLICATE_ENTRY': 'Duplicate Entry.',
    'INVALID_ID': 'Invalid ID.',
    'PHONE_NUMBER_ALREADY_EXISTS': 'Phone number already exists.',
    'PHONE_NUMBER_NOT_EXISTS': 'Phone number does not exists.',
    'PHONE_NUMBER_NOT_FOUND': "Couldn't find the phone number.",
    'SP_NOT_RANGE': 'No Service provider in range',
    'SERVICE_PROVIDER_BOOKED_ALREADY': 'Service provider already booked.',
    'EMAIL_ALREADY_EXISTS': 'Email already exists.',
    'LOGIN_ERROR': 'Invalid email or password.',
    'USER_NOT_FOUND': 'User not found.',
    'PHONE_VERIFY_FAIL': 'Phone number verification Failed.',
    'OTP_EXPIRED': 'OTP expired.',
    'USER_BLOCKED': 'You have been blocked by admin please contact support.',
    'PASSWORD_CHANGE_REQUEST_EXPIRE': 'Password change request has been expired.',
    'PASSWORD_CHANGE_REQUEST_INVALID': 'Invalid password change request.',
    'BOOKING_STATUS_FAIL': 'You are not authorized to perform this action.',
    'BOOKING_INIT_BEFORE_TIME': 'Cannot initiate booking before requested time.',
    'BOOKING_INIT_OLD': 'Cannot initiate too old booking',
    'BOOKING_INSPECTION_FAIL': 'Additional charges are required in case of inspection.',
    'BOOKING_NOT_FOUND': 'Booking not found.',
    'ACCESS_DENIED': 'Access Denied.',
    'INVALID_EMAIL': "Invalid email.",
    'ACTION_NO_AUTH': "You are not authorize to perform this action.",
    'BOOK_PAST_DATE': "Cannot create booking of past.",
    'USER_ALREADY_SAME_CALL_STATUS': 'User already have same call status.',
};
var SUCCESS_MESSAGES = {
    'REGISTRATION_SUCCESSFUL': 'You are Registered successfully.',
    'ACTION_COMPLETE': 'Action complete.',
    'LOGIN_SUCCESSFULLY': 'Logged in successfully.',
    'LOGOUT_SUCCESSFULLY': 'Logged out successfully.',
    'CATEGORY_ADDED': 'Category added.',
    'SUBCATEGORY_ADDED': 'Subcategory added.',
    'SERVICE_ADDED': 'Service added.',
    'SUB_SERVICE_ADDED': 'Sub-service added.',
    'SERVING_LOCATION_ADDED': 'Serving Location added.',
    'BOOKING_CREATED': 'Booking created successfully.',
    'ATTACHMENT_UPLOAD': 'Attachment Uploaded successfully.'
};
var SOCKET_DEFAULT_MESSAGES = {
    'AUTH_FAIL': 'You are not authorize.',
    'MSG_FAIL': 'Message not sent.',
    'COMM_NOT_AVAIL': "Sorry! no communicator available, we'll get back to you asap.",
    'USER_NOT_FOUND': 'User not found.',
    'REQUEST_FAIL': 'Request fail.',
    'FILE_UPLOAD_ERROR': 'File could not be uploaded.',
    'FILE_NOT_BUFFER': 'Only buffer is allowed.',
    'FILE_TYPE_ERROR': 'File type not supported.',
    'FILE_SIZE_EXCEED': 'File size too large.',
    'SOMETHING_WRONG': "Oops! something went wrong."
};
var SWAGGER_DEFAULT_RESPONSE_MESSAGES = [
    {code: CONSTANTS.STATUS_CODE.OK, message: 'OK'},
    {code: CONSTANTS.STATUS_CODE.CREATED, message: 'Created'},
    {code: CONSTANTS.STATUS_CODE.BAD_REQUEST, message: 'Bad Request'},
    {code: CONSTANTS.STATUS_CODE.UNAUTHORIZED, message: 'Unauthorized'},
    {code: CONSTANTS.STATUS_CODE.NOT_FOUND, message: 'Not Found'},
    {code: CONSTANTS.STATUS_CODE.ALREADY_EXISTS_CONFLICT, message: 'Already Exists'},
    {code: CONSTANTS.STATUS_CODE.SERVER_ERROR, message: 'Internal Server Error'}
];

module.exports.SWAGGER_DEFAULT_RESPONSE_MESSAGES = SWAGGER_DEFAULT_RESPONSE_MESSAGES;
module.exports.ERROR_MESSAGES = ERROR_MESSAGES;
module.exports.SOCKET_DEFAULT_MESSAGES = SOCKET_DEFAULT_MESSAGES;
module.exports.SUCCESS_MESSAGES = SUCCESS_MESSAGES;