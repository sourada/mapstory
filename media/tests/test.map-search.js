/*jslint browser: true, nomen: true, indent: 4, maxlen: 80 */
/*global OpenLayers, ms, TestRunner,  YUITest */

(function (ms) {
    'use strict';

    var LayerSearch  = ms.mapSearch.LayerSearch,
        LayerResult  = ms.mapSearch.LayerResult,
        assert       = YUITest.Assert,
        mock         = YUITest.Mock;

    TestRunner.add(new YUITest.TestCase({
        name: 'Mapstory map search',

        setUp: function () {
            this.mockGeoExplorer = mock();

            this.layerSearch = new LayerSearch({
                geoExplorer: this.mockGeoExplorer
            });
        },

        tearDown: function () {
            delete this.layerSearch;
            delete this.mockGeoExplorer;
        },

        'Make sure we don\'t clobber the constructor': function () {

            assert.isInstanceOf(
                LayerSearch,
                this.layerSearch,
                'Make sure the correct type is returned'
            );

            assert.areEqual(
                this.layerSearch.constructor,
                LayerSearch
            );
            // TODO check whats the difference between these two checks?

            assert.areEqual(
                this.layerSearch.pageSize,
                10,
                'Make the default page size is correct'
            );

            assert.areEqual(
                this.layerSearch.$el.attr('id'),
                'ms-search-widget',
                'Make sure the id of the widget is correctly set'
            );

        }
    }));

}(ms));
