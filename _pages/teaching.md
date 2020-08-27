---
layout: archive
title: "Teaching"
permalink: /teaching/
author_profile: true
---

{% include base_path %}

Lecturing:
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

Head Teaching Associate (responsible for all lab teaching and coursework content / grading):
------
<table>
<tr>
  <th class="venue" colspan="2">At Aalto University, Finland</th>
</tr>
{% for post in site.teaching reversed %}
  {% if post.role == "Teaching Assistant" and post.venue == "Aalto University" %}
    {% include archive-single-teaching.html %}
  {% endif %}
{% endfor %}
</table>

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
