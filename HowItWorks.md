It uses [Blogger Data API](http://code.google.com/apis/blogger/overview.html) to get posts through [Google AJAX Feed API](http://code.google.com/apis/ajaxfeeds/). Basically, it queries several times for feeds.

It get start to query current year(visitor's locale date) first. If retrieving posts in the feed are not reach the limit `limitPosts`, then it continuously queries previous year and so on unless it reach the limit `limitYears`.

If current year is Year 2007 and `limitYears` is 5, then only 2003, 2004, 2005, 2006, 2007 could be queried.

If there is no post retrieved, then it shows `noPostMsg`.