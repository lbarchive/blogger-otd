You need two things from Google:
# Google AJAX Feed API Key
# Your blog's ID on Blogger.com

Assuming your blog URI is `http://myblog.blogspot.com/`

# Steps #
## Code Generator ##
Please open this [generator page](http://www.livibetter.com/page/onthisday.htm) in new window. It help you to get the code for template on Blogger.com.

## Get Google AJAX Feed API Key ##
Please open this [signup page](http://code.google.com/apis/ajaxfeeds/signup.html) in new window.

Input your blog URI, and you have to agree the terms, of course.

Copy the key and paste to generator.

## Get your blog's ID ##
Enter [Blogger Dashboard](http://www.blogger.com/home)

Move your cursor over the link New Post, right click and copy the link, it looks like

`http://www.blogger.com/post-create.g?blogID=4075414619052280424`

The numeric string is your blog's ID. Copy it to the generator.

## Get the Code ##
Now, you can click the Generate button in generator unless you want to adjust some of options.

There are two code fragments. One for head section, another for sidebar section.

## Paste to head section ##
Go to Template/Edit HTML of your blog.

Find `</head>`, then paste head fragment just before `</head>`.

## sidebar section ##
There are two ways to insert the OTD list into your sidebar:
### Add HTML/Javascript ###
  1. Go to Template/Page Elements.
  1. Click "Add a Page Element" at sidebar.
  1. Choose "HTML/Javascript".
  1. Input the title, e.g. On this day...
  1. Paste second line of sidebar code fragment from generator, e.g. `<div id="feed"></div>`.

### Paste to sidebar section ###
Find `<div id='sidebar-wrapper'>` and next `</div>` follows it, then paste sidebar fragment just before this `</div>`.