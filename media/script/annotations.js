/*jslint browser: true, nomen: true, indent: 4, */
/*global Ext, OpenLayers, ms */

(function (global, Ext, OpenLayers, undefined) {
    'use strict';

    Ext.ns('ms.notes');

    /**
     * @constructor
     */
    ms.notes.ParseError = function (message) {
        this.message = message;
    };

    /**
     * @return {string} message
     */
    ms.notes.ParseError.prototype.toString = function () {
        return this.message;
    };

    /** Handles the low level reading and writing of mapstory's
     *  annotations features
     * @constructor
     */
    ms.notes.Format = function (options) {
        if (!options) { options = {}; }
        this.geometryColumn = options.geometryColumn || 'the_geom';
    };

    /** Provides a method that returns a point object from an array
     *  @param {array} coordinates
     *  @returns {OpenLayers.Geometry.Point}
     */
    ms.notes.Format.prototype.parsePoint = function (coordinates) {
        return new OpenLayers.Geometry.Point(coordinates[0], coordinates[1]);
    };

    /** Converts an array into a line type.
     *  @param {array} coordinates
     *  @param {OpenLayer.Class} Cls
     */
    ms.notes.Format.prototype.parseLine = function (coordinates, Cls) {
        var points = [];
        coordinates.forEach(function (element) {
            points.push(this.parsePoint(element));
        }, this);

        if (!Cls) {
            Cls = OpenLayers.Geometry.LineString;
        }

        return new Cls(points);
    };

    /**
     * @param {array} coordinates
     * @returns {OpenLayers.Geometry.LineString}
     */
    ms.notes.Format.prototype.parseLineString = function (coordinates) {
        return this.parseLine(coordinates);
    };

    /**
     * @param {array} coordinates
     * @returns {OpenLayers.Geometry.LinearRing} ring
     */
    ms.notes.Format.prototype.parseLinearRing = function (coordinates) {
        return this.parseLine(coordinates, OpenLayers.Geometry.LinearRing);
    };

    ms.notes.Format.prototype.parsePolgyon = function (array) {
        var outerRing = this.parseLinearRing(array[0]);
        return new OpenLayers.Geometry.Polygon([outerRing]);
    };

    ms.notes.Format.prototype.parseJSON = function (object) {

        if (typeof object === 'string') {
            object = JSON.parse(object);
        }

        switch (object.type.toLowerCase()) {
        case 'point':
            return this.parsePoint(object.coordinates);
        case 'linestring':
            return this.parseLineString(object.coordinates);
        case 'polgyon':
            return this.parsePolgyon(object.coordinates);
        default:
            throw new ms.notes.ParseError();
        }
    };

    /**
     * @param {string} str
     */
    ms.notes.Format.prototype.read = function (object) {
        if (typeof object === 'string') {
            object = JSON.parse(object);
        }

        var geomColumn = object[this.geometryColumn];

        return new OpenLayers.Feature.Vector(
            this.parseJSON(geomColumn),
            object
        );
    };

    ms.notes.Format.prototype.readArray = function (array_str) {
        var array = JSON.parse(array_str),
            features = [];

        array.forEach(function (thing) {
            features.push(this.read(thing));
        }, this);

        return features;
    };

    ms.notes.Format.prototype.write = function (features) {
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

    ms.notes.Protocol = OpenLayers.Class(OpenLayers.Protocol, {

        initialize: function (options) {
            this.http = options.http || OpenLayers.Request;
            this.response = options.response || OpenLayers.Protocol.Response;
            this.format   = new ms.notes.Format();

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
            resp.features = this.format.readArray(
                resp.priv.responseText
            );
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

        CLASS_NAME: 'ms.notes.Protocol'

    });

    ms.notes.main = function () {
        var map, layer, bounds;

        map = new OpenLayers.Map({
            div: 'olMap',
            layers: [
                new OpenLayers.Layer.OSM()
            ]
        });

        layer = new OpenLayers.Layer.Vector("annotations", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new ms.notes.Protocol({
                mapConfig: {
                    id: 1
                }
            })
        });

        map.addLayers([layer]);
        bounds = new OpenLayers.Bounds(
            -79.318576214907,
            36.508050759734,
            -68.332248089907,
            43.099847634734
        );
        map.zoomToExtent(bounds.transform(
            new OpenLayers.Projection('EPSG:4326'),
            map.getProjection()
        ));

    };


}(window, Ext, OpenLayers));
