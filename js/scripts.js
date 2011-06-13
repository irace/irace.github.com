function tumblrAPICallback(data) {
    var post = data.posts[0];

    var template = '<p><a href="${url}">${title}</a></p> \
                    <p>${date}</p> \
                    <p>{{html content}}</p>';
    
    // Add Tumblr post to writing section    
    $.tmpl(template, {
        "url" : post.url,
        "title" : post['regular-title'],
        "date" : post.date,
        "content" : post['regular-body']
    }).appendTo("#writing-section");
}

/* Twitter widget */

new TWTR.Widget({
  version: 2,
  type: 'profile',
  rpp: 10,
  interval: 6000,
  width: 250,
  height: 600,
  theme: {
    shell: {
      background: '#333333',
      color: '#ffffff'
    },
    tweets: {
      background: '#000000',
      color: '#ffffff',
      links: 'lightblue'
    }
  },
  features: {
    scrollbar: false,
    loop: false,
    live: true,
    hashtags: true,
    timestamp: true,
    avatars: false,
    behavior: 'all'
  }
}).render().setUser('irace').start();