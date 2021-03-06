/*
--------------------------------
FlickrJS Widget
--------------------------------
+ https://github.com/pinceladasdaweb/FlickrJS
+ version 1.0
+ Copyright 2013 Pedro Rogerio
+ Licensed under the MIT license

+ Documentation: https://github.com/pinceladasdaweb/FlickrJS
*/

var Flickr = (function (d) {
    "use strict";
    var module = {
        config: function (config) {
            this.url       = './flickr.php?user=' + config.user + '&count=' + config.count;
            this.container = config.container;
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
        getPhoto: function (photo, size) {
            size = size || '';
            return 'https://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + size + '.jpg';
        },
        getThumb: function (photo) {
            return this.getPhoto(photo, '_s');
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
        fetch: function () {
            var self = this;

            self.getJSON({url: self.url}, function (data) {
                var feed   = data || [],
                    photos = feed.photos.photo,
                    first  = photos.shift(), link, url;

                link = self.getUrl(first);
                url  = self.getPhoto(first);

                self.attach(link, url);

                self.loop(photos, function (photo) {
                    link = self.getUrl(photo);
                    url  = self.getThumb(photo);

                    self.attach(link, url);
                });

                self.joined();
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