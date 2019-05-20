---
layout: archive
title: "Teaching"
permalink: /teaching/
author_profile: true
---

{% include base_path %}

I taught the following modules as a teaching associate:
------

<table>
<tr>
  <th class="venue" colspan="2">At Queen Mary University of London, United Kingdom</th>
</tr>
{% for post in site.teaching reversed %}
  {% if post.role == "Senior" %}
    {% include archive-single-teaching.html %}
  {% endif %}
{% endfor %}
</table>

I worked (in varying capacity) as a teaching assistant for the modules below:
------
<table>
<tr>
  <th class="venue" colspan="2">At Queen Mary University of London, United Kingdom</th>
</tr>
{% for post in site.teaching reversed %}
  {% if post.role == "Teaching Assistant" and post.venue == "Queen Mary University of London" %}
    {% include archive-single-teaching.html %}
  {% endif %}
{% endfor %}
</table>

<table>
<tr>
