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
    var config = {
        repositories: [{ id: 'webzap', name: 'Webzap' }, { id: 'balances', name: 'Balances' }],
        blog_post_count: 5
    };

    var template_from_selector = function(selector) {
        return Hogan.compile($(selector).html());
    };

    var templates = {
        repository: template_from_selector('#repository-template'),
        blog_posts: template_from_selector('#blog-posts-template')
    };

    // GitHub ----------------------------------------------------------------------------------------------------------

    var $repo_list = $('#repo-list');

    $.each(config.repositories, function(index, repository) {
        $.ajax({
            url: 'https://github.com/api/v2/json/repos/show/irace/' + repository.id,
            dataType:'jsonp',
            success:function (response) {
                $repo_list.append(templates.repository.render({
                    name: repository.name,
                    url: response.repository.homepage,
                    description: response.repository.description
                }));
            }
        });
    });

    // Twitter ---------------------------------------------------------------------------------------------------------

    $.ajax({
        url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=irace&count=1',
        dataType: 'jsonp',
        success: function(response) {
            $.ajax({
                url:'https://api.twitter.com/1/statuses/oembed.json?id=' + response[0].id_str,
                dataType:'jsonp',
                success:function (response) {
                    $('#latest-tweet').append(response.html);
                }
            });
        }
    });

    // Tumblr ----------------------------------------------------------------------------------------------------------

    $.ajax({
        url: 'http://blog.bryanirace.com/api/read/json?type=text&num=' + config.blog_post_count,
        dataType: 'jsonp',
        success: function(response) {
            $('#blog-list').html(templates.blog_posts.render({
                posts: response.posts
            }));
        }
    })
});
