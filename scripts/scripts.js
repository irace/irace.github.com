function resizeTwitterWidget() {
    var timelineHeight = twitterTimelineHeight();
    $('.twtr-widget').height(timelineHeight + 111);
    $('.twtr-doc').height(timelineHeight + 101);
    $('.twtr-timeline, .twtr-bd').height(timelineHeight);
}

function twitterTimelineHeight() {
    return $(window).height() - 310;
}

$(window).resize(resizeTwitterWidget);

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22036475-1']);
_gaq.push(['_setDomainName', 'bryanirace.com']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

$(function() {
    // Twitter profile widget
    new TWTR.Widget({
        id: 'twitter-widget',
        version: 2,
        type: 'profile',
        rpp: 10,
        interval: 6000,
        width: 220,
        height: twitterTimelineHeight(),
        theme:{
            shell: {
                background: '#333333',
                color: '#ffffff'
            },
            tweets:{
                background: 'whiteSmoke',
                color: '#404040',
                links: '#00438A'
            }
        },
        features:{
            scrollbar: true,
            loop: false,
            live: true,
            hashtags: true,
            timestamp: true,
            avatars: false,
            behavior: 'all'
        }
    }).render().setUser('irace').start();
});
