---
title: Talking
layout: page
---

<section>
  <h2>Speaking</h2>
  <ul>
    {% for talk in site.data.talking.speaking %}
      <li><time datetime="{{talk.date}}">{{ talk.date | date: '%b %d, %Y' }}</time><a href="{{talk.url}}">{{talk.title}}</a></li>
    {% endfor %}
  </ul>
</section>

<section>
  <h2>Podcasts</h2>
  <ul>
    {% for podcast in site.data.talking.podcasts %}
      <li><time datetime="{{podcast.date}}">{{ podcast.date | date: '%b %d, %Y' }}</time><a href="{{podcast.url}}">{{podcast.title}}</a></li>
    {% endfor %}
  </ul>
</section>
