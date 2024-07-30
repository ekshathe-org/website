---
layout: default
title: "Casualties"
---

## Casualties

{% for person in site.data.casualties %}
  - [ {{person.name}} ]( /casualties/{{person.name | slugify}} )
{% endfor %}
