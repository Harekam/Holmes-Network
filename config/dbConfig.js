/**
 * Created by harekam on 27/08/15.
 */

var production = "localhost:9200";
var live = "localhost:9200";
var development = "localhost:9200";
var test = "localhost:9200";

var elasticURI = {
    production: production,
    live: live,
    development: development,
    test: test
};

module.exports = {
    elasticURI: elasticURI
};
