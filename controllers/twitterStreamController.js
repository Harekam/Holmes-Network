/**
 * Created by harekam on 22/10/15.
 */
var Twitter = require('twitter');
var config = require('../config');
var DAO = require('../dao/dao');
var twitterAuth = config.twitterConfig.auth;
var log4js = require('log4js');
var util = require('pure-util');
var logger = log4js.getLogger('[TWITTER_MANAGER]');

var client = new Twitter({
    consumer_key: twitterAuth.CONSUMER_KEY,
    consumer_secret: twitterAuth.CONSUMER_SECRET,
    access_token_key: twitterAuth.ACCESS_TOKEN_KEY,
    access_token_secret: twitterAuth.ACCESS_TOKEN_SECRET
});

client.stream('statuses/sample', {language: 'en'}, function (stream) {
    stream.on('data', function (tweet) {
        var body = {
            createdAt: tweet.created_at,
            //tweetId: tweet.id,
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
                createdAt: userDetails.created_at
            }
        }
        var dataToSet = {
            index: 'leads',
            type: 'lead',
            id: tweet.id,
            body: body
        };

        DAO.setData(dataToSet, function (error, res) {
            if (error)
                logger.error("DAO ERROR", error);
        });
    });

    stream.on('error', function (error) {
        logger.error(error);
    });
});
function fetchSourceName(source) {
    var sourceName = source.substring(source.indexOf('>') + 1, source.indexOf('</a>'));
    sourceName = sourceName.toUpperCase();
    var deviceIndex = sourceName.indexOf('TWITTER FOR');
    if (deviceIndex !== -1) {
        sourceName = sourceName.substring(deviceIndex + 12);
    }
    return sourceName;
}