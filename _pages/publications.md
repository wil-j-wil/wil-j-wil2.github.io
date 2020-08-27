---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

<a href="https://scholar.google.com/citations?user=od6BFu4AAAAJ">My Google Scholar profile</a>.

{% include base_path %}


2020
------
<ul>
{% for post in site.publications reversed %}
  {% if post.year == 2020 and post.type == "published" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>

2019
------
<ul>
{% for post in site.publications reversed %}
  {% if post.year == 2019 and post.type == "published" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>


2018
------
<ul>
{% for post in site.publications reversed %}
  {% if post.year == 2018 and post.type == "published" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>

2017
------
<ul>
{% for post in site.publications reversed %}
  {% if post.year == 2017 and post.type == "published" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>

2016
------
<ul>
{% for post in site.publications reversed %}
  {% if post.year == 2016 and post.type == "published" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>

PhD thesis
------
<ul>
{% for post in site.thesis reversed %}
  {% include archive-single-publication.html %}
{% endfor %}
</ul>
