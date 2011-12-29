function resizeTwitterWidget() {
    var timelineHeight = twitterTimelineHeight();
    $('.twtr-widget').height(timelineHeight + 111);
    $('.twtr-doc').height(timelineHeight + 101);
    $('.twtr-timeline, .twtr-bd').height(timelineHeight);
}

function twitterTimelineHeight() {
    return $(window).height() - 321;
}

$(window).resize(resizeTwitterWidget);