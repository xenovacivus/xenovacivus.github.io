---
layout: post
title:  "Experimenting with Jekyll - First Post!"
date:   2017-12-22 00:50:00 -0800
categories: jekyll
---
I've just got Jekyll up and running on my dev box (after a bit of tweaking...).  Turns out the "jekyll serve" command depends on something that depends on libcurl.dll on a windows machine, and libcurl.dll isn't installed as part of the msys install for ruby.  So, standard windows solution: find a pre-built version of the .dll somewhere and put it in a directory where whatever exe is looking for it can find it!  See [StackOverflow][stackoverflow] here for details.

Also, a neat "feature": turns out if you set the date in this markdown file to some time in the future, the post won't show up!


This shows up:
{% highlight markdown %}
date: 2017-12-22 00:50:00 -0800
{% endhighlight %}

But not this!
{% highlight markdown %}
date: 2017-12-22 01:50:00 -0800
{% endhighlight %}

Neat :)

[stackoverflow]: https://stackoverflow.com/questions/41114671/how-to-install-libcurl-on-windows-7-64bit
