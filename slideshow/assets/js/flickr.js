/*
--------------------------------
FlickrJS CSS3 Slideshow
--------------------------------
+ https://github.com/pinceladasdaweb/FlickrJS
+ version 1.0
+ Copyright 2013 Pedro Rogerio
+ Licensed under the MIT license

+ Documentation: https://github.com/pinceladasdaweb/FlickrJS
*/

var Flickr = (function (d) {
    "use strict";
    /*jslint browser: true*/
    var module = {
        cur: 0,
        config: function (config) {
            this.url       = './flickr.php?user=' + config.user + '&count=' + config.count;
            this.container = config.container;
            this.time      = config.time || 5000;
        },
        xhr: function () {
            return new XMLHttpRequest();
        },
        getJSON: function (options, callback) {
            var xhttp    = module.xhr();
            options.url  = options.url  || location.href;
            options.data = options.data || null;
            xhttp.open('GET', options.url, true);
            xhttp.send(options.data);
            xhttp.onreadystatechange = function () {
                if (xhttp.status === 200 && xhttp.readyState === 4) {
                    callback(JSON.parse(xhttp.responseText));
                }
            };
        },
        loop: function (els, callback) {
            var i = 0, max = els.length;

            while (i < max) {
                callback(els[i], i);
                i += 1;
            }
        },
        hasClass: function (el, name) {
            return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
        },
        addClass: function (el, name) {
            var self = this;

            if (!self.hasClass(el, name)) {
                el.className += (el.className ? ' ' : '') + name;
            }
        },
        removeClass: function (el, name) {
            var self = this;

            if (self.hasClass(el, name)) {
                el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
            }
        },
        getPhoto: function (photo) {
            return 'https://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
        },
        getUrl: function (photo) {
            return 'https://www.flickr.com/photos/' + photo.owner + '/' + photo.id + '/';
        },
        create: function (name, props) {
            var el = d.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            return el;
        },
        loading: function () {
            var self      = this,
                container = d.querySelectorAll(self.container);

            self.loop(container, function (el) {
                if (el.parentNode.nodeName.toLowerCase() === 'body') {
                    return;
                }
                self.addClass(el.parentNode, 'loading');
            });
        },
        joined: function () {
            var self      = this,
                container = d.querySelectorAll(self.container);

            self.loop(container, function (el) {
                self.removeClass(el.parentNode, 'loading');
            });
        },
        attach: function (photo, url) {
            var self      = this,
                container = d.querySelector(self.container),
                elements  = d.createDocumentFragment(), li, a, img;

            li  = self.create('li');
            a   = self.create('a', { href: photo, target: '_blank' });
            img = self.create('img', { src: url });

            a.appendChild(img);
            li.appendChild(a);
            elements.appendChild(li);

            container.appendChild(elements.cloneNode(true));
        },
        slideshow: function () {
            var self      = this,
                container = d.querySelectorAll(self.container), slides, max;

            self.loop(container, function (el) {
                slides = el.childNodes;
            });

            self.addClass(slides[self.cur], 'show');

            max = slides.length;

            setTimeout(function () {
                self.removeClass(slides[self.cur], 'show');
                self.cur += 1;
                if (self.cur >= max) {
                    self.cur = 0;
                }
                self.addClass(slides[self.cur], 'show');

                self.slideshow();
            }, self.time);
        },
        fetch: function () {
            var self = this;

            self.getJSON({url: self.url}, function (data) {
                var feed  = data || [],
                    photos = feed.photos.photo, link, url;

                self.loop(photos, function (photo) {
                    link = self.getUrl(photo);
                    url  = self.getPhoto(photo);

                    self.attach(link, url);
                });
                self.joined();
                self.slideshow();
            });
        },
        init: function (config) {
            module.config(config);

            module.loading();
            module.fetch();
        }
    };

    return {
        init: module.init
    };

}(document));