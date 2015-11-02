/**
 * Created by harekam on 23/10/15.
 */

var DAO = require('../dao/dao');
var util = require('pure-util');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('[MODEL_MANAGER]');

function init(models, callbackServer) {
    async.forEachOf(models, function (model, key, callbackParent) {
        checkAndMap(model, callbackParent);
    }, function (err) {
        if (err) return callbackServer(err);
        return callbackServer(null);
    })
}

function checkAndMap(model, callbackParent) {
    async.waterfall([
        function (callback) {
            DAO.checkIndexExists(model.index, callback);
        },
        function (result, callback) {
            logger.debug("is Index Exists", result);
            if (!util.isEmpty(result) && !result.exists) {
                if (util.isEmpty(model)) {
                    throw new Error("Model cannot be empty");
                }
                if (util.isEmpty(model.map)) {
                    throw new Error("Map in model cannot be empty");
                }
                if (util.isEmpty(model.index)) {
                    throw new Error("Index in model cannot be empty");
                }
                if (util.isEmpty(model.type)) {
                    throw new Error("Type in model cannot be empty");
                }
                DAO.createIndex({_index: model.index}, {mappings: model.map}, callback);
            } else {
                logger.warn("Index already exists");
                DAO.updateMapping({_index: model.index, _type: model.type}, {mappings: model.map}, callback);
            }
        }], function (error) {
        if (error)
            return callbackParent(error);
        return callbackParent(null);
    })
}
module.exports = {
    init: init
};