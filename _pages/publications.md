---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

You can also find my articles on <a href="https://scholar.google.co.uk/citations?user=swQRKE8AAAAJ">my Google Scholar profile</a>.

{% include base_path %}

Preprints
------
<ul>
{% for post in site.publications reversed %}
  {% if post.type == "preprint" %}
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

2014
------
<ul>
{% for post in site.publications reversed %}
  {% if post.year == 2014 and post.type == "published" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>

Abstracts
------
<ul>
{% for post in site.publications reversed %}
  {% if post.type == "abstract" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>

Theses
------
<ul>
{% for post in site.publications reversed %}
  {% if post.type == "thesis" %}
    {% include archive-single-publication.html %}
  {% endif %}
{% endfor %}
</ul>
