/*jslint browser: true, nomen: true, indent: 4, */
/*global Ext, jQuery, OpenLayers, ms */

(function (global, Ext, $, OpenLayers, undefined) {
    'use strict';
    Ext.ns('ms.notes');

    ms.notes.main = function () {
        var map = new OpenLayers.Map({
            div: 'olMap',
            layers: [
                new OpenLayers.Layer.OSM()
            ]
        }),
            layer = new OpenLayers.Layer.Vector("annotations", {
                strategies: [
                    new OpenLayers.Strategy.Fixed(),
                    new OpenLayers.Strategy.Save({
                        auto: true
                    })
                ],
                protocol: new ms.notes.Protocol({
                    mapConfig: {
                        id: 1
                    }
                })
            }),
            draw = new OpenLayers.Control.DrawFeature(
                layer,
                OpenLayers.Handler.Point
            ),
            bounds = new OpenLayers.Bounds(
                -79.318576214907,
                36.508050759734,
                -68.332248089907,
                43.099847634734
            );


        map.addLayers([layer]);
        map.addControl(draw);

        map.zoomToExtent(bounds.transform(
            new OpenLayers.Projection('EPSG:4326'),
            map.getProjection()
        ));

        $('.toggle').click(function () {
            var elem = $(this),
                on = elem.data('on');

            if (on) {
                draw.deactivate();
                elem.data('on', false);
            } else {
                draw.activate();
                elem.data('on', true);
            }
        });

    };

}(window, Ext, jQuery, OpenLayers));
