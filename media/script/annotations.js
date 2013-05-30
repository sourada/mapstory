/*jslint browser: true, nomen: true, indent: 4, */
/*global Ext, OpenLayers, ms */

(function (global, Ext, OpenLayers, undefined) {
    'use strict';
    var Formater;
    Ext.ns('ms.annotations');

    /**
     * @constructor
     */
    ms.annotations.Format = function (options) {
        if (!options) { options = {}; }
        this.geoJSON = new OpenLayers.Format.GeoJSON();
        this.geometryColumn = 'the_geom';
    };

    /** Provides a convince method that returns a point object from an array
     *  @param {array} array
     *  @returns {OpenLayers.Geometry.Point}
     */
    ms.annotations.Format.prototype.parsePoint = function (array) {
        return new OpenLayers.Geometry.Point(array[0], array[1]);
    };

    /**
     * @params {array} array
     * @returns {OpenLayers.Geometry.LineString}
     */
    ms.annotations.Format.prototype.parseLineString = function (array) {
        var points = [];

        array.forEach(function (element) {
            points.push(this.parsePoint(element));
        }, this);

        return new OpenLayers.Geometry.LineString(points);
    };

    ms.annotations.Format.prototype.parsePolgyon = function (array) {

    };

    ms.annotations.Format.prototype.parseJSON = function (object) {


        switch (object.type.toLowerCase()) {
        case 'point':
            return this.parsePoint(object.coordinates);
        case 'linestring':
            return this.parseLineString(object.coordinates);
        case 'polgyon':
            return {};
        default:
            throw {
                message: 'Unable to parse geometry'
            };
        }
    };

    /**
     * @param {string} str
     */
    ms.annotations.Format.prototype.read = function (str) {
        var object = JSON.parse(str),
            geomColumn = object[this.geometryColumn];


        return new OpenLayers.Feature.Vector(
            this.parseJSON(geomColumn),
            object
        );

    };

    ms.annotations.Format.prototype.readArray = function (array) {

    };

    ms.annotations.Format.prototype.write = function (features) {
        return {
            the_geom: {
                type: 'Point',
                coordinates: [
                        -74.00
                ]
            },
        };
    };



    // the annotation protocol supports filtering "features" by
    // map id and by bounding box.

    // we also support editing via a feature manager

    // assume that the current annotation end point supports a restful
    // api.

    // GET /map/:id/annotations/ -> returns a list
    // POST /map/:id/annotations/ -> creates a annotation
    // GET /map/:id/annotations/:id -> returns a single annotation
    // DELETE /map/:id/annotations/:id -> removes an annotation

    ms.annotations.Protocol = OpenLayers.Class(OpenLayers.Protocol, {

        initialize: function (options) {
            this.http = options.http || OpenLayers.Request;
            this.response = options.response || OpenLayers.Protocol.Response;
            this.geoJSON = new OpenLayers.Format.GeoJSON();

            if (!options.mapConfig) {
                throw {
                    'name': 'MapstoryError',
                    'message': 'You must provide an map config object'
                };
            }

            this.mapConfig = options.mapConfig;
            this.baseUrl = '/maps/' + this.mapConfig.id + '/annotations';
            OpenLayers.Protocol.prototype.initialize.apply(this, arguments);

        },

        destory: function () {
            OpenLayers.Protocol.prototype.destory.apply(this);
        },

        read: function (options) {
            OpenLayers.Protocol.prototype.read.apply(this, arguments);
            var resp = new this.response({
                requestType: "read"
            });

            resp.priv = this.http.GET({
                url: this.baseUrl,
                callback: this.createCallback(this.readFeatures, resp, options)
            });

            return resp;

        },

        readFeatures: function (resp, options) {
            var features = JSON.parse(resp.priv.responseText);

            resp.features = [];
            features.forEach(function (feature) {
                var geometry = this.geoJSON.read(feature.the_geom)[0];
                resp.features.push(geometry);

            }, this);

            options.callback.call(options.scope, resp);

        },

        create: function (feature) {
            var resp = this.http.POST({
                url: this.baseUrl,
                data: feature
            });
            return resp;
        },

        update: function (feature) {
            var resp = this.http.PUT({
                url: this.baseUrl + '/' + feature.id,
                data: feature
            });
            return resp;
        },

        delete: function (feature) {
            var resp = this.http.DELETE({
                url: this.baseUrl + '/' + feature.id
            });
            return resp;
        },

        CLASS_NAME: 'mapstory.annotations.Protocol'

    });

}(window, Ext, OpenLayers));
