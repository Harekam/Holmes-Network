/**
 * Created by harekam on 23/10/15.
 */
var Joi = require('joi'),
    controller = require('../controllers');
var config = require('../config');
var util = require('../utilities/util');


var searchNetworkByRange = {

    method: 'GET',
    path: '/api/v1/network/search/range',
    config: {
        description: 'Search Network in time range',
        tags: ['api', 'network'],
        handler: function (request, reply) {
            controller.networkController.searchNetworkInTimeRange(request.query, function (error, success) {
                if (error) {
                    reply(error.response).code(error.statusCode);
                } else {
                    reply(success.response).code(success.statusCode);
                }
            });
        },
        validate: {
            query: {
                tweetDateBegin: Joi.date().required().iso().description("YYYY-MM-DDTHH:MM:SSZ"),
                tweetDateEnd: Joi.date().optional().iso().description("YYYY-MM-DDTHH:MM:SSZ"),
                sort: Joi.string().required().valid(
                    config.CONSTANTS.SORT_ORDER.ASC,
                    config.CONSTANTS.SORT_ORDER.DESC
                ),
                size: Joi.number().required(),
                from: Joi.number().required()
            },
            failAction: util.failActionFunction
        },
        response: {
            options: {
                allowUnknown: true
            },
            schema: {
                message: Joi.string().required(),
                data: Joi.any()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: config.RESPONSE_MESSAGES.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }

    }
};

var getAnalytics = {

    method: 'GET',
    path: '/api/v1/network/search/analytics',
    config: {
        description: 'Search Network for analytics/count by name',
        tags: ['api', 'network'],
        handler: function (request, reply) {
            controller.networkController.getAnalytics(request.query, function (error, success) {
                if (error) {
                    reply(error.response).code(error.statusCode);
                } else {
                    reply(success.response).code(success.statusCode);
                }
            });
        },
        validate: {
            query: {
                searchValue: Joi.string().optional().trim(),
                searchType: Joi.string().optional().valid(
                    config.CONSTANTS.SEARCH_TYPE.ANY,
                    config.CONSTANTS.SEARCH_TYPE.LEAD,
                    config.CONSTANTS.SEARCH_TYPE.CATEGORY,
                    config.CONSTANTS.SEARCH_TYPE.ENTITY,
                    config.CONSTANTS.SEARCH_TYPE.SOURCE
                ),
                getOnlyCount: Joi.boolean().optional(),
                size: Joi.number().optional()
            },
            failAction: util.failActionFunction
        },
        response: {
            options: {
                allowUnknown: true
            },
            schema: {
                message: Joi.string().required(),
                data: Joi.any()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: config.RESPONSE_MESSAGES.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }

    }
};

var getAnalyticsByGeo = {

    method: 'GET',
    path: '/api/v1/network/search/analytics/geo',
    config: {
        description: 'Search Network for analytics/count by geo',
        tags: ['api', 'network'],
        handler: function (request, reply) {
            controller.networkController.getAnalyticsByGeo(request.query, function (error, success) {
                if (error) {
                    reply(error.response).code(error.statusCode);
                } else {
                    reply(success.response).code(success.statusCode);
                }
            });
        },
        validate: {
            query: {
                lat: Joi.number().required(),
                lon: Joi.number().required(),
                distance: Joi.number().required(),
                distanceUnit: Joi.string().required().valid(
                    config.CONSTANTS.DISTANCE_UNITS.CENTIMETER,
                    config.CONSTANTS.DISTANCE_UNITS.FEET,
                    config.CONSTANTS.DISTANCE_UNITS.INCH,
                    config.CONSTANTS.DISTANCE_UNITS.KILOMETER,
                    config.CONSTANTS.DISTANCE_UNITS.METER,
                    config.CONSTANTS.DISTANCE_UNITS.MILES,
                    config.CONSTANTS.DISTANCE_UNITS.MILLIMETER,
                    config.CONSTANTS.DISTANCE_UNITS.YARD
                ),
                getOnlyCount: Joi.boolean().optional(),
                size: Joi.number().optional()
            },
            failAction: util.failActionFunction
        },
        response: {
            options: {
                allowUnknown: true
            },
            schema: {
                message: Joi.string().required(),
                data: Joi.any()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: config.RESPONSE_MESSAGES.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }

    }
};
var getAnalyticsOverTime = {

    method: 'GET',
    path: '/api/v1/network/search/analytics/time',
    config: {
        description: 'Search Network for analytics/count over time',
        tags: ['api', 'network'],
        handler: function (request, reply) {
            controller.networkController.getAnalyticsOverTime(request.query, function (error, success) {
                if (error) {
                    reply(error.response).code(error.statusCode);
                } else {
                    reply(success.response).code(success.statusCode);
                }
            });
        },
        validate: {
            query: {
                searchValue: Joi.string().optional().trim(),
                searchType: Joi.string().optional().valid(
                    config.CONSTANTS.SEARCH_TYPE.ANY,
                    config.CONSTANTS.SEARCH_TYPE.LEAD,
                    config.CONSTANTS.SEARCH_TYPE.CATEGORY,
                    config.CONSTANTS.SEARCH_TYPE.ENTITY,
                    config.CONSTANTS.SEARCH_TYPE.SOURCE
                ),
                getOnlyCount: Joi.boolean().optional(),
                intervalUnit: Joi.string().required().valid(
                    config.CONSTANTS.ELASTIC_TIME_UNITS.DAY,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.HOUR,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.MINUTE,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.MONTH,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.QUARTER,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.SECOND,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.WEEK,
                    config.CONSTANTS.ELASTIC_TIME_UNITS.YEAR
                ),
                intervalValue: Joi.number().optional()
            },
            failAction: util.failActionFunction
        },
        response: {
            options: {
                allowUnknown: true
            },
            schema: {
                message: Joi.string().required(),
                data: Joi.any()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: config.RESPONSE_MESSAGES.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }

    }
};


var getAnalyticsForTopUsers = {

    method: 'GET',
    path: '/api/v1/network/search/analytics/users',
    config: {
        description: 'Search Network for analytics/count for top users',
        tags: ['api', 'network'],
        handler: function (request, reply) {
            controller.networkController.getAnalyticsForTopUsers(request.query, function (error, success) {
                if (error) {
                    reply(error.response).code(error.statusCode);
                } else {
                    reply(success.response).code(success.statusCode);
                }
            });
        },
        validate: {
            query: {
                size: Joi.number().optional().description("Default value is 10")
            },
            failAction: util.failActionFunction
        },
        response: {
            options: {
                allowUnknown: true
            },
            schema: {
                message: Joi.string().required(),
                data: Joi.any()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: config.RESPONSE_MESSAGES.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }

    }
};
var boostRelevance = {

    method: 'GET',
    path: '/api/v1/network/search/boost',
    config: {
        description: 'Boosting relevance',
        tags: ['api', 'network'],
        handler: function (request, reply) {
            controller.networkController.boostRelevance(request.query, function (error, success) {
                if (error) {
                    reply(error.response).code(error.statusCode);
                } else {
                    reply(success.response).code(success.statusCode);
                }
            });
        },
        validate: {
            query: {
                searchValue: Joi.string().required().trim(),
                searchType: Joi.string().required().valid(
                    config.CONSTANTS.SEARCH_TYPE.LEAD,
                    config.CONSTANTS.SEARCH_TYPE.USER,
                    config.CONSTANTS.SEARCH_TYPE.CATEGORY,
                    config.CONSTANTS.SEARCH_TYPE.ENTITY,
                    config.CONSTANTS.SEARCH_TYPE.SOURCE
                ),
                boostHighValue: Joi.string().required().trim(),
                boostHighType: Joi.string().required().valid(
                    config.CONSTANTS.SEARCH_TYPE.LEAD,
                    config.CONSTANTS.SEARCH_TYPE.USER,
                    config.CONSTANTS.SEARCH_TYPE.CATEGORY,
                    config.CONSTANTS.SEARCH_TYPE.ENTITY,
                    config.CONSTANTS.SEARCH_TYPE.SOURCE
                ),
                boostLowValue: Joi.string().optional().trim().allow(""),
                boostLowType: Joi.string().optional().valid(
                    config.CONSTANTS.SEARCH_TYPE.LEAD,
                    config.CONSTANTS.SEARCH_TYPE.USER,
                    config.CONSTANTS.SEARCH_TYPE.CATEGORY,
                    config.CONSTANTS.SEARCH_TYPE.ENTITY,
                    config.CONSTANTS.SEARCH_TYPE.SOURCE,
                    ''
                ).allow("")
            },
            failAction: util.failActionFunction
        },
        response: {
            options: {
                allowUnknown: true
            },
            schema: {
                message: Joi.string().required(),
                data: Joi.any()
            }
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: config.RESPONSE_MESSAGES.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }

    }
};
var network = [
    getAnalytics,
    searchNetworkByRange,
    getAnalyticsByGeo,
    getAnalyticsOverTime,
    getAnalyticsForTopUsers,
    boostRelevance
];

module.exports = network;