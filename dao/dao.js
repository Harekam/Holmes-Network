/**
 * Created by harekam on 22/10/15.
 */

var elasticsearch = require('es');
var config = require('../config');
es = elasticsearch.createClient({
    host: config.dbConfig.elasticURI.development
});
var log4js = require('log4js');
var logger = log4js.getLogger('[DAO]');

function setData(options, data, callback) {
    es.index(options, data, function (error, response) {
        if (error) {
            logger.error(error);
            return callback(error);
        }
        return callback(null, response);
    })
}
function getData(options,query, callback) {
    es.search(options,query, function (error, response) {
        if (error) {
            logger.error(error);
            return callback(error);
        }
        return callback(null, response);
    })
}

function updateData(options, dataToBeUpdated, callback) {
    es.update(options, dataToBeUpdated, function (error, response) {
        if (error) {
            logger.error(error);
            return callback(error);
        }
        return callback(null, response);
    })
}
function updateMapping(options, map, callback) {
    es.indices.putMapping(options, map, function (error, res) {
        if (error) {
            logger.error(error);
            return callback(error);
        }
        return callback(null, res);
    })
}
function checkIndexExists(index, callback) {
    es.indices.exists({_index: index}, function (error, res) {
        if (error) {
            logger.error(error);
            return callback(error);
        }
        return callback(null, res);
    })
}
function createIndex(options, data, callback) {
    es.indices.createIndex(options, data, function (error, res) {
        if (error) {
            logger.error(error);
            return callback(error);
        }
        return callback(null, res);
    })
}
module.exports = {
    setData: setData,
    getData: getData,
    updateData: updateData,
    checkIndexExists: checkIndexExists,
    updateMapping: updateMapping,
    createIndex: createIndex
};