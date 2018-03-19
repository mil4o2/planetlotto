'use strict'

angular.module('lyApp.services')
    .factory('lyAppMetaService', [function() {
        var title = '',
            metaDescription = '',
            metaKeywords = '',
            metaFacebookTitle = '',
            metaFacebookDescription = '',
            metaFacebookImage = '',
            metaCanonicalUrl = '',
            metaTwitterTitle = '',
            metaTwitterDescription = '',
            metaTwitterImage = '',
            metaRobotsIndex = 'index',
            metaRobotsFollow = 'follow',
            metaRobotsAdvanced = '';

        return {
            set: function(meta) {
                if (meta.focuskw) {
                    metaKeywords = meta.focuskw;
                }
                if (meta.metadesc) {
                    metaDescription = meta.metadesc;
                }
                if (meta.title) {
                    title = meta.title;
                }
                if (meta['opengraph-title']) {
                    metaFacebookTitle = meta['opengraph-title'];
                }
                if (meta['opengraph-description']) {
                    metaFacebookDescription = meta['opengraph-description'];
                }
                if (meta['opengraph-image']) {
                    metaFacebookImage = meta['opengraph-image'];
                }
                if (meta.canonical) {
                    metaCanonicalUrl = meta.canonical;
                }
                if (meta['twitter-title']) {
                    metaTwitterTitle = meta['twitter-title'];
                }
                if (meta['twitter-description']) {
                    metaTwitterDescription = meta['twitter-description'];
                }
                if (meta['twitter-image']) {
                    metaTwitterImage = meta['twitter-image'];
                }
                if (meta['meta-robots-nofollow']) {
                    if (meta['meta-robots-nofollow'] == '1') {
                        metaRobotsFollow = 'nofollow';
                    } else {
                        metaRobotsFollow = 'follow';
                    }
                }
                if (meta['meta-robots-noindex']) {
                    if (meta['meta-robots-noindex'] == '1') {
                        metaRobotsIndex = 'noindex'
                    } else {
                        metaRobotsIndex = 'index'
                    }
                }
                if (meta['meta-robots-adv']) {
                    metaRobotsAdvanced = meta['meta-robots-adv'];
                }

            },
            metaTitle: function() {
                return title;
            },
            metaDescription: function() {
                return metaDescription;
            },
            metaKeywords: function() {
                return metaKeywords;
            },
            metaFacebookTitle: function() {
                return metaFacebookTitle;
            },
            metaFacebookDescription: function() {
                return metaFacebookDescription;
            },
            metaFacebookImage: function() {
                return metaFacebookImage;
            },
            metaCanonicalUrl: function() {
                return metaCanonicalUrl;
            },
            metaTwitterTitle: function() {
                return metaTwitterTitle;
            },
            metaTwitterDescription: function() {
                return metaTwitterDescription;
            },
            metaTwitterImage: function() {
                return metaTwitterImage;
            },
            metaRobots: function() {
                return metaRobotsIndex + ',' + metaRobotsFollow + ',' + metaRobotsAdvanced;
            }
        }
    }]);