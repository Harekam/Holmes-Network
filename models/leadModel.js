/**
 * Created by harekam on 23/10/15.
 */
var map = {
    "lead": {
        "properties": {
            "categories": {
                "properties": {
                    "indices": {
                        "type": "long"
                    },
                    "text": {
                        "type": "string"
                    }
                }
            },
            "coordinates": {
                "properties": {
                    "coordinates": {
                        "type": "geo_point"
                    },
                    "type": {
                        "type": "string"
                    }
                }
            },
            "createdAt": {
                "type": "date"
            },
            "entities": {
                "properties": {
                    "id": {
                        "type": "long"
                    },
                    "id_str": {
                        "type": "string"
                    },
                    "indices": {
                        "type": "long"
                    },
                    "name": {
                        "type": "string"
                    },
                    "screen_name": {
                        "type": "string"
                    }
                }
            },
            "geo": {
                "properties": {
                    "coordinates": {
                        "type": "geo_point"
                    },
                    "type": {
                        "type": "string"
                    }
                }
            },
            "place": {
                "properties": {
                    "attributes": {
                        "type": "object"
                    },
                    "bounding_box": {
                        "properties": {
                            "coordinates": {
                                "type": "double"
                            },
                            "type": {
                                "type": "string"
                            }
                        }
                    },
                    "country": {
                        "type": "string"
                    },
                    "country_code": {
                        "type": "string"
                    },
                    "full_name": {
                        "type": "string"
                    },
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "place_type": {
                        "type": "string"
                    },
                    "url": {
                        "type": "string"
                    }
                }
            },
            "source": {
                "type": "string"
            },
            "text": {
                "type": "string"
            },
            "user": {
                "properties": {
                    "createdAt": {
                        "type": "date"
                    },
                    "favouritesCount": {
                        "type": "long"
                    },
                    "followersCount": {
                        "type": "long"
                    },
                    "friendsCount": {
                        "type": "long"
                    },
                    "id": {
                        "type": "long"
                    },
                    "name": {
                        "type": "string"
                    },
                    "screenName": {
                        "type": "string"
                    },
                    "statusesCount": {
                        "type": "long"
                    }
                }
            }
        }
    }
};
module.exports = {map: map, index: 'leads', type: 'lead'};