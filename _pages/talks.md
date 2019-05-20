---
layout: archive
title: "Talks and presentations"
permalink: /talks/
author_profile: true
---

{% if site.talkmap_link == true %}

<p style="text-decoration:underline;"><a href="/talkmap.html">See a map of all the places I've given a talk!</a></p>

{% endif %}

2018
------
<ul>
{% for post in site.talks reversed %}
  {% if post.year == 2018 %}
    {% include archive-single-talk.html %}
  {% endif %}
{% endfor %}
</ul>

2017
------
<ul>
{% for post in site.talks reversed %}
  {% if post.year == 2017 %}
    {% include archive-single-talk.html %}
  {% endif %}
{% endfor %}
</ul>

2016
------
<ul>
{% for post in site.talks reversed %}
  {% if post.year == 2016 %}
    {% include archive-single-talk.html %}
  {% endif %}
{% endfor %}
</ul>

2015
------
<ul>
{% for post in site.talks reversed %}
  {% if post.year == 2015 %}
    {% include archive-single-talk.html %}
  {% endif %}
{% endfor %}
</ul>

2014
------
<ul>
{% for post in site.talks reversed %}
  {% if post.year == 2014 %}
    {% include archive-single-talk.html %}
  {% endif %}
{% endfor %}
</ul>
