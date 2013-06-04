/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global OpenLayers, ms, TestRunner,  YUITest */

(function (ms) {
    'use strict';

    var Protocol = ms.notes.Protocol,
        Format   = ms.notes.Format,
        assert   = YUITest.Assert,
        mock     = YUITest.Mock;

    TestRunner.add(new YUITest.TestCase({
        name: 'Mapstory annotations format',

        _should: {
            error: {
                'Should error on a bad type': ms.notes.ParseError
            }
        },

        setUp: function () {
            this.format = new Format();
        },
        tearDown: function () {
            delete this.format;
        },

        'Do not clobber the constructor': function () {
            assert.isInstanceOf(
                Format,
                this.format,
                'Make sure that new returns the correct scope'
            );

        },
        'Format should parse a point object': function () {
            var point = this.format.parsePoint([10, 10]);

            assert.isInstanceOf(
                OpenLayers.Geometry.Point,
                point,
                'Make sure a Point object is returned'
            );

            assert.areEqual(
                point.x,
                10,
                'Correctly set the x value'
            );

            assert.areEqual(
                point.x,
                10,
                'Correctly set the y value'
            );

        },
        'Format should parse a LineString correctly': function () {
            var lineString = this.format.parseLineString([
                [1, 2],
                [3, 4],
                [5, 7]
            ]);

            assert.isInstanceOf(
                OpenLayers.Geometry.LineString,
                lineString,
                'Make sure we get the right type back'
            );

            assert.areEqual(
                lineString.components[0].x,
                1,
                'Make sure the x value of the first point is the same'
            );

            assert.areEqual(
                lineString.components[0].y,
                2,
                'Make sure the x value of the first point is the same'
            );

        },
        'Format should parse a LinearRing': function () {
            var lineString = this.format.parseLinearRing([
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0]

            ]);

            assert.isInstanceOf(
                OpenLayers.Geometry.LinearRing,
                lineString,
                'Make sure a Linear Ring is returned'
            );

        },
        'Format should parse a polygon': function () {
            var polygon = this.format.parsePolgyon([
                [
                    [100.0, 0.0],
                    [101.0, 0.0],
                    [101.0, 1.0],
                    [100.0, 1.0],
                    [100.0, 0.0]
                ]
            ]);

            assert.isInstanceOf(
                OpenLayers.Geometry.Polygon,
                polygon,
                'return a polygon'
            );

        },
        'Format should parse a geojson feature': function () {
            var point = this.format.parseJSON({
                'type': 'Point',
                'coordinates': [10, 10]
            });

            assert.isInstanceOf(
                OpenLayers.Geometry.Point,
                point,
                'Return the correct type'
            );

        },
        'Should error on a bad type': function () {
            var badType = {
                'type': 'Blah'
            };
            this.format.parseJSON(badType);
        },
        'Test reading features as a string': function () {
            var feature = this.format.read([
                '{',
                ' "in_map": true, ',
                '"the_geom": ',
                '{ "type": "Point", "coordinates": [-74.000, 40.000] }',
                '}'
            ].join(''));

            assert.isInstanceOf(
                OpenLayers.Feature.Vector,
                feature,
                'Make sure we get the right type back'
            );

            assert.isTrue(
                feature.attributes.in_map,
                'the properties should carry over to the feature'
            );

            assert.isInstanceOf(
                OpenLayers.Geometry.Point,
                feature.geometry,
                'The geometry object should be an instance of Geometry'
            );

        },
        'Test writing features': function () {
            // TODO this is current stub function
            var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(-74.000, 40.000),
                {
                    'in_map': true,
                    // make sure we handle date objects
                    'start_time': new Date(),
                    'content': 'this is some content for the annotations.',
                    'id': 1
                }
            ), results = this.format.write(feature);

            assert.areEqual(
                results.the_geom.type,
                'Point'
            );

            assert.areEqual(
                results.the_geom.coordinates[0],
                -74.000,
                'Make sure we don\'t lose any precision'
            );

        }

    }));



    TestRunner.add(new YUITest.TestCase({
        name: 'Mapstory annotations protocol',

        setUp: function () {
            this.protocol = new Protocol({
                mapConfig: {
                    id: 1
                }
            });
        },

        tearDown: function () {
            delete this.protocol;
        },

        'Make sure we don\'t clobber the constructor': function () {
            assert.isInstanceOf(
                Protocol,
                this.protocol,
                'Make sure the constructor is correct'
            );

            assert.areEqual(
                this.protocol.baseUrl,
                '/maps/1/annotations',
                'Make sure the base url is set correctly'
            );

        },

        'Test reading features': function () {
            var mockHTTP     = YUITest.Mock(),
                mockResponse = YUITest.Mock(),
                // create a value matcher
                GETMock = YUITest.Mock.Value(function (options) {
                    assert.areEqual(
                        '/maps/1/annotations',
                        options.url,
                        'Make sure the correct url is passed'
                    );

                    assert.isFunction(
                        options.callback,
                        'Make sure the callback is a function'
                    );
                });

            YUITest.Mock.expect(mockHTTP, {
                method: 'GET',
                args: [GETMock]
            });

            this.protocol.http = mockHTTP;
            this.protocol.read({});
            YUITest.Mock.verify(mockHTTP);
        },
        'Test creating new features': function () {
            var mockHTTP = YUITest.Mock(),
                POSTMock = YUITest.Mock.Value(function (options) {
                    assert.areEqual(
                        '/maps/1/annotations',
                        options.url,
                        'Make sure the correct url is used'
                    );
                    // TODO make this check for a OpenLayers.Feature
                    assert.isObject(
                        options.data,
                        'Make sure the features are sent as a object'
                    );

                });

            YUITest.Mock.expect(mockHTTP, {
                method: 'POST',
                args: [POSTMock]
            });

            this.protocol.http = mockHTTP;
            this.protocol.create({});
            YUITest.Mock.verify(mockHTTP);
        },
        'Test updating new features': function () {
            var mockHTTP = YUITest.Mock(),
                PUTMock  = YUITest.Mock.Value(function (options) {
                    assert.areEqual('/maps/1/annotations/1', options.url);
                });

            YUITest.Mock.expect(mockHTTP, {
                method: 'PUT',
                args: [PUTMock]
            });

            this.protocol.http = mockHTTP;
            this.protocol.update({
                id: 1
            });

            YUITest.Mock.verify(mockHTTP);
        },
        'Test deleting features': function () {
            var mockHTTP = YUITest.Mock(),
                DELETEMock  = YUITest.Mock.Value(function (options) {
                    assert.areEqual('', '');
                });

            YUITest.Mock.expect(mockHTTP, {
                method: 'DELETE',
                args: [DELETEMock]
            });

            this.protocol.http = mockHTTP;
            this.protocol['delete']({
                id: 1
            });

            YUITest.Mock.verify(mockHTTP);
        }

    }));


}(ms));
