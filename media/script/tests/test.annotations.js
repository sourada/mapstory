/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global jQuery, QUnit, OpenLayers, ms */

(function (Q, ms, undefined) {
    'use strict';

    var Protocol = ms.notes.Protocol,
        Format = ms.notes.Format;

    Q.module('Mapstory annotations');
    Q.test('Mapstory annotations format', function () {
        var format = new Format();

        Q.ok(format instanceof Format, 'Don\'t clobber the constructor');

        Q.test('array:[int] -> point', function () {
            var point = format.parsePoint([1, 2]);

            Q.ok(
                point instanceof OpenLayers.Geometry.Point,
                'return the correct class'
            );

            Q.strictEqual(point.x, 1, 'preserve the correct ordering');
            Q.strictEqual(point.y, 2, 'preserve the correct ordering');

        });

        Q.test('array:[[int]] -> linestring ', function () {
            var lineString = format.parseLineString([
                [1, 2],
                [3, 4],
                [5, 7]
            ]);

            Q.ok(
                lineString instanceof OpenLayers.Geometry.LineString,
                'Make sure we get the right type back'
            );

            Q.strictEqual(
                lineString.components[0].x,
                1,
                'Make sure the x value of the first point is the same'
            );

            Q.strictEqual(
                lineString.components[0].y,
                2,
                'Make sure the x value of the first point is the same'
            );

        });

        Q.test('array:[int] -> linear ring', function () {
            var lineString = format.parseLinearRing([
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0]

            ]);
            Q.ok(
                lineString instanceof OpenLayers.Geometry.LinearRing,
                'Make sure the correct type is returned'
            );

        });

        Q.test('array[[], [[]]] -> polygon', function () {
            var polygon = format.parsePolgyon([
                [
                    [100.0, 0.0],
                    [101.0, 0.0],
                    [101.0, 1.0],
                    [100.0, 1.0],
                    [100.0, 0.0]
                ]
            ]);

            Q.ok(
                polygon instanceof OpenLayers.Geometry.Polygon,
                'return a polygon'
            );

        });

        Q.test('parsing of geojson features', function () {
            var point = format.parseJSON({
                'type': 'Point',
                'coordinates': [10, 10]
            });
            Q.ok(point instanceof OpenLayers.Geometry.Point);
        });

        Q.test('test throwing an error on an unknow type', function () {
            var badType = {
                'type': 'Blah'
            };

            Q.throws(
                function () {
                    format.parseJSON(badType);
                },
                ms.notes.ParseError(),
                'Make sure we throw an error on a bad type'
            );

        });

        Q.test('Test reading features', function () {
            var feature = format.read([
                "{",
                " \"in_map\": true, ",
                "\"the_geom\": ",
                "{ \"type\": \"Point\", \"coordinates\": [-74.000, 40.000] }",
                "}"
            ].join(""));

            Q.ok(feature instanceof OpenLayers.Feature.Vector);

            Q.strictEqual(
                feature.attributes.in_map,
                true,
                'the properties should carry over to the feature'
            );

            Q.ok(
                feature.geometry instanceof OpenLayers.Geometry.Point,
                'The geometry object should be an instance of Geometry'
            );

        });

        Q.test('Test writing features', function () {
            var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(-74.000, 40.000),
                {
                    "in_map": true,
                    // make sure we handle date objects
                    "start_time": new Date(),
                    "content": "this is some content for the annotations.",
                    "id": 1
                }
            ), results = format.write(feature);

            Q.strictEqual(
                results.the_geom.type,
                'Point'
            );

            Q.strictEqual(
                results.the_geom.coordinates[0],
                -74.000,
                'Make sure we don\'t lose any precision'
            );

        });

    });

    Q.test('Mapstory annotations Protocol', function () {

        var protocol = new Protocol({
                mapConfig: {
                    id: 1
                },
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
            Q.expect(2);

            var url = '/annotations',
                res,
                pro = new Protocol({
                    mapConfig: {
                        id: 1
                    },
                    response: function () {
                        return {};
                    },
                    http: {
                        GET: function (options) {
                            Q.strictEqual(
                                options.url,
                                '/maps/' + 1 + url,
                                'Urls should match'
                            );
                            return 'get';
                        }
                    }
                });

            res = pro.read();
            Q.ok(
                res.hasOwnProperty('priv'),
                'Reading feature should be handled by Request.GET'
            );

        });

        Q.test('test creating the features', function () {
            Q.expect(3);
            var pro = new Protocol({
                mapConfig: {
                    id: 1
                },
                http: {
                    POST: function (options) {

                        Q.strictEqual(
                            options.url,
                            '/maps/1/annotations',
                            'The url for creating a feature should match'
                        );
                        Q.ok(
                            typeof options.data === 'object',
                            'The payload data should be correct'
                        );

                        return 'post';
                    }
                }
            });

            Q.strictEqual(
                pro.create({}),
                'post',
                'Creating features should be handle by post'
            );

        });

        Q.test('test updating features', function () {
            Q.expect(3);
            var pro = new Protocol({
                mapConfig: {
                    id: 1
                },
                http: {
                    PUT: function (options) {
                        Q.strictEqual(
                            options.url,
                            '/maps/1/annotations/1',
                            'The url for updating a feature should\
include that feature\'s id'
                        );

                        Q.strictEqual(
                            options.data.id,
                            1,
                            'The feature id should be carried over'
                        );

                        return 'put';
                    }
                }
            });

            Q.strictEqual(pro.update({
                id: 1 // mock feature
            }), 'put', 'The PUT request should be used');

        });

        Q.test('test deleting features', function () {
            Q.expect(2);
            var pro = new Protocol({
                mapConfig: {
                    id: 1
                },
                http: {
                    DELETE: function (options) {
                        Q.strictEqual(
                            options.url,
                            '/maps/1/annotations/1',
                            'The url should include the\
 correct map and annotation ids'
                        );
                        return 'delete';
                    }
                }
            });

            Q.strictEqual(pro.delete({
                id: 1
            }), 'delete', 'The delete method should be used');

        });

    });

}(QUnit, ms));
