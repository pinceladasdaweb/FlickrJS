FlickrJS Slideshow
=================

Flickr Slideshow with Vanilla JS and CSS3. Example [here](http://www.pinceladasdaweb.com.br/blog/uploads/flickr/slideshow/)

![](https://raw.github.com/pinceladasdaweb/FlickrJS/master/slideshow/assets/img/screenshot.jpg)

##Usage
1. Add the code below to your HTML, where the latest photos should appear:
```html
<ul id="flickr"></ul>
```

2. Paste right before your page's closing `</body>` tag:
```html
<script type="text/javascript" src="assets/js/flickr.min.js"></script>
```

3. From within a script tag or a JS file
```javascript   
    (function() {
        Flickr.init({
            container: '#flickr',        // domNode to attach to
            user: 'locaweb',  			 // Flickr username or Flickr user id
            count: 5                     // Number of photos to display
            time: 4000					 // Range for the next transition in milliseconds. Default 5000
        });
    }());
```

4. In the flickr.php file, complete the $apiKey with your [API Key] (http://www.flickr.com/services/api/misc.api_keys.html)
```php
	$apiKey = '';
```

##Browser support

* IE 8+
* Firefox
* Chrome
* Opera
* Safari
* iOS
* Android
* Windows Phone
