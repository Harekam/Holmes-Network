/**
 * Created by harekam on 27/08/15.
 */

var CONFIG = require('../config');
var md5 = require('md5');
var log4js = require('log4js');
var logger = log4js.getLogger('[UTIL]');
var moment = require('moment');
require('moment-timezone');
require('moment-range');

var SUCCESS_MESSAGES = CONFIG.RESPONSE_MESSAGES.SUCCESS_MESSAGES;
var ERROR_MESSAGES = CONFIG.RESPONSE_MESSAGES.ERROR_MESSAGES;
var STATUS_CODE = CONFIG.CONSTANTS.STATUS_CODE;

var failActionFunction = function (request, reply, source, error) {
    if (error.isBoom) {

        delete error.output.payload.validation;
        delete error.output.payload.error;
        delete error.output.payload.statusCode;

        if (error.output.payload.message.indexOf("authorization") !== -1) {
            error.output.statusCode = STATUS_CODE.UNAUTHORIZED;
            // error.output.payload.statusCode = STATUS_CODE.UNAUTHORIZED;
            return reply(error);
        }
        var details = error.data.details[0];
        if (details.message.indexOf("pattern") > -1 && details.message.indexOf("required") > -1 && details.message.indexOf("fails") > -1) {
            error.output.payload.message = "Invalid " + details.path;
            return reply(error);
        }
    }
    var customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation;
    delete error.output.payload.error;
    delete error.output.payload.statusCode;
    return reply(error);
};
var createErrorResponse = function (message, statusCode, error) {
    try {
        if (error) {
            if (error.hasOwnProperty('statusCode') && error.hasOwnProperty('response'))
                return error;
        }
    } catch (e) {
        logger.trace(e);
        return {
            response: {
                message: message || ERROR_MESSAGES.SOMETHING_WRONG,
                data: null
            },
            statusCode: statusCode || STATUS_CODE.BAD_REQUEST
        };
    }
    return {
        response: {
            message: message || ERROR_MESSAGES.SOMETHING_WRONG,
            data: null
        },
        statusCode: statusCode || STATUS_CODE.BAD_REQUEST
    };

};
var createSuccessResponse = function (message, statusCode, data) {
    return {
        response: {
            message: message || SUCCESS_MESSAGES.ACTION_COMPLETE,
            data: data || null
        },
        statusCode: statusCode || STATUS_CODE.OK
    };
};
var cryptData = function (data) {
    return md5(md5(data));
};
var getTimestamp = function (inDate) {
    if (inDate)
        return new Date();

    return new Date().toISOString();
};
function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
function generateRandomString(length, isNumbersOnly) {
    var charsNumbers = '0123456789';
    var charsLower = 'abcdefghijklmnopqrstuvwxyz';
    var charsUpper = charsLower.toUpperCase();
    var chars;

    if (isNumbersOnly)
        chars = charsNumbers;
    else
        chars = charsNumbers + charsLower + charsUpper;

    if (!length) length = 32;

    var string = '';

    for (var i = 0; i < length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
}

function validateTimezone(timezone) {
    var result = moment.tz.zone(timezone);
    return !isEmpty(result);
}

function getRange(startDate, endDate, diffIn) {

    var dr = moment.range(startDate, endDate);

    if (!diffIn)
        diffIn = CONFIG.CONSTANTS.TIME_UNITS.HOURS;
    if (diffIn == "milli")
        return dr.diff();

    return dr.diff(diffIn);

}
function createValidJson(payload) {
    var data = {};
    for (var key in payload) {
        if (payload.hasOwnProperty(key) && payload[key] && !isEmpty(payload[key])) {
            data[key] = payload[key];
        }
    }
    return data;
}
var makeArrayOfKey = function (data, keyName) {
    var arrIds = [];
    keyName = !keyName ? '_id' : keyName;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            arrIds.push(data[key][keyName]);
        }
    }
    return arrIds;
};
function getCustomDate(date, inDate, unit, frequency) {

    var end = moment(date).add(frequency, unit).toDate();

    if (inDate)
        return end;
    else
        return end.toISOString();

}
function createHashFromObjectArray(data, key) {
    var len = data.length;
    var map = {};
    for (var i = 0; i < len; i++) {
        map[data[i][key]] = 1;
    }
    return map;
}
function formatDateTime(datetime, format, inMoment) {
    if (!format) {
        format = CONFIG.CONSTANTS.TIMESTAMP_FORMAT;
    }
    var momentDateTime = moment(datetime).format(format);
    if (inMoment)
        return momentDateTime;
    return new Date(momentDateTime);
}
function compareDate(dateOne, dateTwo) {

    var date1 = moment(dateOne, CONFIG.CONSTANTS.JAVASCRIPT_TIMESTAMP_FORMAT);
    var date2 = moment(dateTwo, CONFIG.CONSTANTS.JAVASCRIPT_TIMESTAMP_FORMAT);
    return date1.isBefore(date2);

}

function getDay(date) {
    if (!date)
        date = new Date();
    logger.debug(date);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[date.getDay()];
}
function getMonthName(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (!date)
        date = new Date();
    return monthNames[date.getMonth()];

}
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function htmlUnEscape(str) {
    return String(str)
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}
function createHashOfArray(array) {
    var map = {};
    var len = array.length;
    for (var i = 0; i < len; i++) {
        map[array[i]] = true;
    }
    return map;
}
function isContains(element, array) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
        if (element == array[i])
            return true;
    }
    return false
}

module.exports = {
    failActionFunction: failActionFunction,
    createSuccessResponse: createSuccessResponse,
    createErrorResponse: createErrorResponse,
    getTimestamp: getTimestamp,
    createValidJson: createValidJson,
    isEmpty: isEmpty,
    makeArrayOfKey: makeArrayOfKey,
    getRange: getRange,
    validateTimezone: validateTimezone,
    cryptData: cryptData,
    generateRandomString: generateRandomString,
    getCustomDate: getCustomDate,
    createHashFromObjectArray: createHashFromObjectArray,
    formatDateTime: formatDateTime,
    compareDate: compareDate,
    getDay: getDay,
    getMonthName: getMonthName,
    htmlEscape: htmlEscape,
    htmlUnEscape: htmlUnEscape,
    createHashOfArray: createHashOfArray,
    isContains: isContains
};
