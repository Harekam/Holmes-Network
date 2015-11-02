/**
 * Created by harekam on 22/10/15.
 */
var Twitter = require('twitter');
var config = require('../config');
var DAO = require('../dao/dao');
var twitterAuth = config.twitterConfig.auth;
var log4js = require('log4js');
var logger = log4js.getLogger('[TWITTER_MANAGER]');
var util = require('pure-util');
var models = require('../models');
var client = new Twitter({
    consumer_key: twitterAuth.CONSUMER_KEY,
    consumer_secret: twitterAuth.CONSUMER_SECRET,
    access_token_key: twitterAuth.ACCESS_TOKEN_KEY,
    access_token_secret: twitterAuth.ACCESS_TOKEN_SECRET
});
var count = 0;
function init() {

    client.stream('statuses/sample', {language: 'en'}, function (stream) {
        stream.on('data', function (tweet) {
            if (count >= config.CONSTANTS.LIMIT_INIT_TWITTER) {
                logger.fatal("disconnected");
                stream.destroy();
            }

            logger.trace("COUNT:", count, "TWEET:", tweet.text);

            var body = {
                createdAt: new Date(tweet.created_at),
                text: tweet.text,
                source: fetchSourceName(tweet.source),
                categories: util.isEmpty(tweet.entities) ? [] : tweet.entities.hashtags,
                entities: util.isEmpty(tweet.entities) ? [] : tweet.entities.user_mentions,
                geo: tweet.geo,
                coordinates: tweet.coordinates,
                place: tweet.place
            };
            if (!util.isEmpty(tweet.user)) {
                var userDetails = tweet.user;
                body.user = {
                    id: userDetails.id,
                    name: userDetails.name,
                    screenName: userDetails.screen_name,
                    followersCount: userDetails.followers_count,
                    friendsCount: userDetails.friends_count,
                    statusesCount: userDetails.statuses_count,
                    favouritesCount: userDetails.favourites_count,
                    createdAt: new Date(userDetails.created_at)
                }
            }
            var options = {
                _index: models.leadsModel.index,
                _type: models.leadsModel.type,
                _id: tweet.id
            };

            DAO.setData(options, body, function (error, res) {
                    if (error)
                        logger.error("DAO ERROR", error);
                    else
                        count++;
                }
            );
        });

        stream.on('error', function (error) {
            //todo reset
            logger.error(error);
        });
    });
}
function fetchSourceName(source) {
    var sourceName = source.substring(source.indexOf('>') + 1, source.indexOf('</a>'));
    sourceName = sourceName.toUpperCase();
    var deviceIndex = sourceName.indexOf('TWITTER FOR');
    if (deviceIndex !== -1) {
        sourceName = sourceName.substring(deviceIndex + 12);
    }
    return sourceName;
}

module.exports = {
    init: init
};