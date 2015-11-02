/**
 * Created by harekam on 24/10/15.
 */
var util = require('../utilities/util');
var async = require('async');
var models = require('../models');
var DAO = require('../dao/dao');
var config = require('../config');
var log4js = require('log4js');
var logger = log4js.getLogger('[NETWORK_CONTROLLER]');
var SUCCESS_MESSAGES = config.RESPONSE_MESSAGES.SUCCESS_MESSAGES;
var ERROR_MESSAGES = config.RESPONSE_MESSAGES.ERROR_MESSAGES;
var STATUS_CODE = config.CONSTANTS.STATUS_CODE;

function searchNetworkInTimeRange(queryParams, callbackRoute) {
    async.waterfall([
        function (callback) {
            var range = {};
            if (!util.isEmpty(queryParams)) {
                if (queryParams.tweetDateBegin) {
                    range.createdAt = {};
                    range.createdAt.gte = queryParams.tweetDateBegin.toISOString();
                }
                if (queryParams.tweetDateEnd) {
                    if (util.isEmpty(range.createdAt)) {
                        range.createdAt = {};
                    }
                    range.createdAt.lte = queryParams.tweetDateEnd.toISOString();
                }
            }

            logger.info(range);
            var query = {
                query: {
                    range: range
                },
                size: queryParams.size,
                from: queryParams.from,
                "sort": {"user.createdAt": {"order": queryParams.sort}}
            };
            DAO.getData({_index: models.leadsModel.index, _type: models.leadsModel.type}, query, callback);
        }
    ], function (error, result) {
        if (error)
            return callbackRoute(util.createErrorResponse(null, null, error));
        return callbackRoute(null, util.createSuccessResponse(null, null, result));
    })
}

function getAnalytics(queryParams, callbackRoute) {
    async.waterfall([
        function (callback) {

            var aggregate = {
                "categories": {
                    "terms": {
                        "field": "categories.text"
                    }
                },
                "device": {
                    "terms": {
                        "field": "source"
                    }
                },
                "mentions": {
                    "terms": {
                        "field": "entities.screen_name"
                    }
                }
            };
            var searchQuery = {};
            var options = {
                _index: models.leadsModel.index,
                _type: models.leadsModel.type
            };
            if (!util.isEmpty(queryParams)) {
                if (queryParams.size && queryParams.size >= 0) {
                    aggregate.categories.terms.size = queryParams.size;
                    aggregate.device.terms.size = queryParams.size;
                    aggregate.mentions.terms.size = queryParams.size;
                }
                if (queryParams.searchValue) {
                    var searchType = config.CONSTANTS.SEARCH_TYPE;
                    switch (queryParams.searchType) {
                        case searchType.CATEGORY:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["categories.text"];
                            break;
                        case searchType.ENTITY:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["entities.screen_name"];
                            break;
                        case searchType.SOURCE:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["source"];
                            break;
                        case searchType.LEAD:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["text"];
                            break;
                        default:
                            searchQuery.query = queryParams.searchValue;
                            break;
                    }
                }
                if (queryParams.getOnlyCount) {
                    options.search_type = "count";
                }
            }
            var query = {
                "aggs": aggregate
            };
            if (!util.isEmpty(searchQuery)) {
                query["query"] = {
                    "query_string": searchQuery
                };
            }
            logger.info(JSON.stringify(query));
            DAO.getData(options, query, callback);
        }
    ], function (error, result) {
        if (error)
            return callbackRoute(util.createErrorResponse(null, null, error));
        return callbackRoute(null, util.createSuccessResponse(null, null, result));
    })
}
function getAnalyticsByGeo(queryParams, callbackRoute) {
    async.waterfall([
        function (callback) {

            var aggregate = {
                "categories": {
                    "terms": {
                        "field": "categories.text"
                    }
                },
                "device": {
                    "terms": {
                        "field": "source"
                    }
                },
                "mentions": {
                    "terms": {
                        "field": "entities.screen_name"
                    }
                }
            };
            var filterByGeo = {
                "filtered": {
                    "query": {
                        "match_all": {}
                    },
                    "filter": {
                        "geo_distance": {
                            "distance": queryParams.distance.toString() + queryParams.distanceUnit || "",
                            "geo.coordinates": {
                                "lon": queryParams.lon,
                                "lat": queryParams.lat
                            }
                        }
                    }
                }
            };
            var options = {
                _index: models.leadsModel.index,
                _type: models.leadsModel.type
            };

            if (queryParams.size && queryParams.size >= 0) {
                aggregate.categories.terms.size = queryParams.size;
                aggregate.device.terms.size = queryParams.size;
                aggregate.mentions.terms.size = queryParams.size;
            }
            if (queryParams.getOnlyCount) {
                options.search_type = "count";
            }
            var query = {
                "aggs": aggregate,
                "query": filterByGeo
            };
            logger.info(query);
            DAO.getData(options, query, callback);
        }
    ], function (error, result) {
        if (error)
            return callbackRoute(util.createErrorResponse(null, null, error));
        return callbackRoute(null, util.createSuccessResponse(null, null, result));
    })
}
function getAnalyticsOverTime(queryParams, callbackRoute) {
    async.waterfall([
        function (callback) {
            var interval = queryParams.intervalUnit;
            var timeUnits = config.CONSTANTS.ELASTIC_TIME_UNITS;
            var shortTimeUnits = config.CONSTANTS.ELASTIC_SHORT_TIME_UNITS;
            if (queryParams.intervalValue) {
                interval = queryParams.intervalValue.toString();
                switch (queryParams.intervalUnit) {
                    case timeUnits.DAY:
                        interval += shortTimeUnits.DAY;
                        break;
                    case timeUnits.HOUR:
                        interval += shortTimeUnits.HOUR;
                        break;
                    case timeUnits.MINUTE:
                        interval += shortTimeUnits.MINUTE;
                        break;
                    case timeUnits.MONTH:
                        interval += shortTimeUnits.MONTH;
                        break;
                    case timeUnits.QUARTER:
                        interval = timeUnits.QUARTER;
                        break;
                    case timeUnits.SECOND:
                        interval += timeUnits.SECOND;
                        break;
                    case timeUnits.WEEK:
                        interval += timeUnits.WEEK;
                        break;
                    case timeUnits.YEAR:
                        interval += timeUnits.YEAR;
                        break;
                }
            }
            var aggregate = {
                "leads_over_time": {
                    "date_histogram": {
                        "field": "createdAt",
                        "interval": interval
                    }
                }
            };
            var searchQuery = {};
            var options = {
                _index: models.leadsModel.index,
                _type: models.leadsModel.type
            };
            if (!util.isEmpty(queryParams)) {
                if (queryParams.searchValue) {
                    var searchType = config.CONSTANTS.SEARCH_TYPE;
                    switch (queryParams.searchType) {
                        case searchType.CATEGORY:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["categories.text"];
                            break;
                        case searchType.ENTITY:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["entities.screen_name"];
                            break;
                        case searchType.SOURCE:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["source"];
                            break;
                        case searchType.LEAD:
                            searchQuery.query = queryParams.searchValue;
                            searchQuery.fields = ["text"];
                            break;
                        default:
                            searchQuery.query = queryParams.searchValue;
                            break;
                    }
                }
                if (queryParams.getOnlyCount) {
                    options.search_type = "count";
                }
            }
            var query = {
                "aggs": aggregate
            };
            if (!util.isEmpty(searchQuery)) {
                query["query"] = {
                    "query_string": searchQuery
                };
            }
            logger.info(JSON.stringify(query));
            DAO.getData(options, query, callback);
        }
    ], function (error, result) {
        if (error)
            return callbackRoute(util.createErrorResponse(null, null, error));
        return callbackRoute(null, util.createSuccessResponse(null, null, result));
    })
}
function getAnalyticsForTopUsers(queryParams, callbackRoute) {
    async.waterfall([
        function (callback) {

            var aggregate = {
                "top-tags": {
                    "terms": {
                        "field": "user.screenName",
                        "size": ((queryParams.size && queryParams.size >= 0) ? queryParams.size : 10)
                    }
                }
            };
            var options = {
                _index: models.leadsModel.index,
                _type: models.leadsModel.type,
                search_type: "count"
            };
            var query = {
                "aggs": aggregate
            };
            DAO.getData(options, query, callback);
        }
    ], function (error, result) {
        if (error)
            return callbackRoute(util.createErrorResponse(null, null, error));
        return callbackRoute(null, util.createSuccessResponse(null, null, result));
    })
}


function boostRelevance(queryParams, callbackRoute) {
    async.waterfall([
        function (callback) {


            var options = {
                _index: models.leadsModel.index,
                _type: models.leadsModel.type
            };
            var searchType = getType(queryParams.searchType);
            var boostHighType = getType(queryParams.boostHighType);
            var boostLowType = "";
            if (queryParams.boostLowType) {
                boostLowType = getType(queryParams.boostLowType);
            }
            if (searchType === "error" || boostHighType === "error" || (queryParams.boostLowType && boostLowType === "error"))
                return callback(util.createErrorResponse(ERROR_MESSAGES.WRONG_PARAMETER));
            var searchMain = {};
            searchMain[searchType] = {
                "query": queryParams.searchValue
            };
            var boostHigh = {};
            boostHigh[boostHighType] = {
                "query": queryParams.boostHighValue,
                "boost": 3
            };
            var should = [
                {
                    match: boostHigh
                }
            ];
            if (queryParams.boostLowType) {
                var boostLow = {};
                boostLow[boostLowType] = {
                    "query": queryParams.boostLowValue,
                    "boost": 2
                };
                should.push({match: boostLow});
            }


            var query = {
                "query": {
                    "bool": {
                        "must": {
                            "match": searchMain
                        },
                        "should": should
                    }
                }
            };
            DAO.getData(options, query, callback);
        }
    ], function (error, result) {
        if (error)
            return callbackRoute(util.createErrorResponse(null, null, error));
        return callbackRoute(null, util.createSuccessResponse(null, null, result));
    })
}
function getType(val) {
    var searchType = config.CONSTANTS.SEARCH_TYPE;
    switch (val) {
        case searchType.CATEGORY:
            return "categories.text";
        case searchType.ENTITY:
            return "entities.screen_name";
        case searchType.SOURCE:
            return "source";
        case searchType.LEAD:
            return "text";
        case searchType.USER:
            return "user.screenName";
        default:
            return "error";
    }
}

module.exports = {
    searchNetworkInTimeRange: searchNetworkInTimeRange,
    getAnalytics: getAnalytics,
    getAnalyticsByGeo: getAnalyticsByGeo,
    getAnalyticsOverTime: getAnalyticsOverTime,
    getAnalyticsForTopUsers: getAnalyticsForTopUsers,
    boostRelevance: boostRelevance
};