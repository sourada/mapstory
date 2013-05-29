/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global jQuery, QUnit, OpenLayers, mapstory */

(function (Q, mapstory, undefined) {
    'use strict';
    var Protocol = mapstory.annotations.Protocol;

    Q.module('Mapstory annotations');

    Q.test('Mapstory annotations', function () {

        var _get, _post, _delete,
            protocol = new Protocol({
                url: '/annotations'
            });

        Q.ok(protocol instanceof Protocol,
             'Make sure that we don\'t clobber the constructor');

        Q.strictEqual(
            protocol.url,
            '/annotations',
            'Make sure the constructor sets the url correctly'
        );

        Q.test('test getting/reading the features', function () {
            // override the default get method on the only OpenLayers
            // object
            var pro,
                _get = OpenLayers.Request.GET; // capture the get
            // method

            OpenLayers.Request.GET = function (options) {
                return 'get';
            };

            pro = new Protocol({});

            Q.ok(pro.read({}), 'get',
                 'Reading feature should be handled by Request.GET');


            // return the get method to OpenLayers
            OpenLayers.Request.GET = _get;
        });

        Q.test('test read with box filter', function () {
            var pro = new Protocol({}),
                bounds = new OpenLayers.Bounds(1, 2, 3, 4);

            pro.read({ 
                filter: {}
            });

        });

        Q.test('test creating the features', function () {
            Q.ok(false);
        });

        Q.test('test deleting features', function () {
            Q.ok(false);
        });

    });

}(QUnit, mapstory));
