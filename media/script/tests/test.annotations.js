/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global jQuery, QUnit, OpenLayers, mapstory */

(function (Q, mapstory, undefined) {
    'use strict';

    var Protocol = mapstory.annotations.Protocol;

    Q.module('Mapstory annotations');

    Q.test('Mapstory annotations', function () {

        var _get, _post, _delete,
            protocol = new Protocol({
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
                pro = new Protocol({
                    mapConfig: {
                        id: 1
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

            Q.strictEqual(
                pro.read({}),
                'get',
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

}(QUnit, mapstory));
