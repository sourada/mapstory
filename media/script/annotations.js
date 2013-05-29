/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global Ext, OpenLayers, mapstory */

(function (global, Ext, OpenLayers, undefined) {
    'use strict';
    Ext.ns('mapstory.annotations');
    Ext.ns('mapstory.annotations.protocol');

    // the annotation protocol supports filtering "features" by
    // map id and by bounding box.

    // we also support editing via a feature manager

    // assume that the current annotation end point supports a restful
    // api.


    // GET /map/:id/annotations/ -> returns a list
    // POST /map/:id/annotations/ -> creates a annotation
    // GET /map/:id/annotations/:id -> returns a single annotation
    // DELETE /map/:id/annotations/:id -> removes an annotation

    mapstory.annotations.Protocol = OpenLayers.Class(OpenLayers.Protocol, {

        initialize: function (options) {
            this.format = options.format;
            OpenLayers.Protocol.prototype.initialize.apply(this, arguments);

        },

        destory: function () {
            OpenLayers.Protocol.prototype.destory.apply(this);
        },



        read: function () {
            OpenLayers.Protocol.prototype.read.apply(this, arguments);

        },
        /** Takes a an array of features and POSTs then to the correct
         *  end point
         *
         */
        create: function (features, options) {

        },

        update: function (feature, options) {

        },
        CLASS_NAME: 'mapstory.annotations.Prototype'

    });

}(window, Ext, OpenLayers));
