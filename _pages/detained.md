---
layout: default
title: "Detained"
---

## Detained

{% assign districts = site.data.detainees | group_by: "District" | sort: "size" | reverse  %}

{% for district in districts%}

- {{district.name}} {{district.items | size}}

{% endfor %}
