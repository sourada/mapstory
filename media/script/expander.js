$(document).ready(function() {
    $('div.expandable').remove('br').expander({
        slicePoint: 1200, // default is 100
        expandPrefix: ' ', // default is '... '
        expandText: '[read more]', // default is 'read more'
        userCollapseText: '[read less]'  // default is 'read less'
    });
});
