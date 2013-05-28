/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global Ext, OpenLayers, mapstory */

(function (global, Ext, OpenLayers, undefined) {
    'use strict';
    Ext.ns('mapstory.annotations');
    Ext.ns('mapstory.annotations.protocol');


    mapstory.annotations.Protocol = OpenLayers.Class(OpenLayers.Protocol, {

        initialize: function (options) {
            this.format = options.format;
            OpenLayers.Protocol.prototype.initialize.apply(this, arguments);

        },

        destory: function () {
            OpenLayers.Protocol.prototype.destory.apply(this);
        },



        read: function () {

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
