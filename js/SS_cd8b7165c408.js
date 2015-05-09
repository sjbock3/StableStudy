
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }
    var config = $.cookie = function(key, value, options) {
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }
            return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
        }
        var result = key ? undefined : {};
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            if (key && key === name) {
                result = read(cookie, value);
                break;
            }
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }
        return result;
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
}));
! function($) {
    $(function() {
        "use strict";
        $.support.transition = (function() {
            var transitionEnd = (function() {
                var el = document.createElement('bootstrap'),
                    transEndEventNames = {
                        'WebkitTransition': 'webkitTransitionEnd',
                        'MozTransition': 'transitionend',
                        'OTransition': 'oTransitionEnd otransitionend',
                        'transition': 'transitionend'
                    },
                    name
                for (name in transEndEventNames) {
                    if (el.style[name] !== undefined) {
                        return transEndEventNames[name]
                    }
                }
            }())
            return transitionEnd && {
                    end: transitionEnd
                }
        })()
    })
}(window.jQuery);
! function($) {
    "use strict";
    var Button = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.button.defaults, options)
    }
    Button.prototype.setState = function(state) {
        var d = 'disabled',
            $el = this.$element,
            data = $el.data(),
            val = $el.is('input') ? 'val' : 'html'
        state = state + 'Text'
        data.resetText || $el.data('resetText', $el[val]())
        $el[val](data[state] || this.options[state])
        setTimeout(function() {
            state == 'loadingText' ? $el.addClass(d).attr(d, d) : $el.removeClass(d).removeAttr(d)
        }, 0)
    }
    Button.prototype.toggle = function() {
        var $parent = this.$element.closest('[data-toggle="buttons-radio"]')
        $parent && $parent.find('.active').removeClass('active')
        this.$element.toggleClass('active')
    }
    $.fn.button = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('button'),
                options = typeof option == 'object' && option
            if (!data) $this.data('button', (data = new Button(this, options)))
            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }
    $.fn.button.defaults = {
        loadingText: 'loading...'
    }
    $.fn.button.Constructor = Button
    $(function() {
        $('body').on('click.button.data-api', '[data-toggle^=button]', function(e) {
            var $btn = $(e.target)
            if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
            $btn.button('toggle')
        })
    })
}(window.jQuery);
! function($) {
    "use strict";
    var Carousel = function(element, options) {
        this.$element = $(element)
        this.options = options
        this.options.slide && this.slide(this.options.slide)
        this.options.pause == 'hover' && this.$element.on('mouseenter', $.proxy(this.pause, this)).on('mouseleave', $.proxy(this.cycle, this))
    }
    Carousel.prototype = {
        cycle: function(e) {
            if (!e) this.paused = false
            this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
            return this
        },
        to: function(pos) {
            var $active = this.$element.find('.item.active'),
                children = $active.parent().children(),
                activePos = children.index($active),
                that = this
            if (pos > (children.length - 1) || pos < 0) return
            if (this.sliding) {
                return this.$element.one('slid', function() {
                    that.to(pos)
                })
            }
            if (activePos == pos) {
                return this.pause().cycle()
            }
            return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
        },
        pause: function(e) {
            if (!e) this.paused = true
            if (this.$element.find('.next, .prev').length && $.support.transition.end) {
                this.$element.trigger($.support.transition.end)
                this.cycle()
            }
            clearInterval(this.interval)
            this.interval = null
            return this
        },
        next: function() {
            if (this.sliding) return
            return this.slide('next')
        },
        prev: function() {
            if (this.sliding) return
            return this.slide('prev')
        },
        slide: function(type, next) {
            var $active = this.$element.find('.item.active'),
                $next = next || $active[type](),
                isCycling = this.interval,
                direction = type == 'next' ? 'left' : 'right',
                fallback = type == 'next' ? 'first' : 'last',
                that = this,
                e = $.Event('slide', {
                    relatedTarget: $next[0]
                })
            this.sliding = true
            isCycling && this.pause()
            $next = $next.length ? $next : this.$element.find('.item')[fallback]()
            if ($next.hasClass('active')) return
            if ($.support.transition && this.$element.hasClass('slide')) {
                this.$element.trigger(e)
                if (e.isDefaultPrevented()) return
                $next.addClass(type)
                $next[0].offsetWidth
                $active.addClass(direction)
                $next.addClass(direction)
                this.$element.one($.support.transition.end, function() {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function() {
                        that.$element.trigger('slid')
                    }, 0)
                })
            } else {
                this.$element.trigger(e)
                if (e.isDefaultPrevented()) return
                $active.removeClass('active')
                $next.addClass('active')
                this.sliding = false
                this.$element.trigger('slid')
            }
            isCycling && this.cycle()
            return this
        }
    }
    $.fn.carousel = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('carousel'),
                options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option),
                action = typeof option == 'string' ? option : options.slide
            if (!data) $this.data('carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.cycle()
        })
    }
    $.fn.carousel.defaults = {
        interval: 5000,
        pause: 'hover'
    }
    $.fn.carousel.Constructor = Carousel
    $(function() {
        $('body').on('click.carousel.data-api', '[data-slide]', function(e) {
            var $this = $(this),
                href, $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')),
                options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
            $target.carousel(options)
            e.preventDefault()
        })
    })
}(window.jQuery);
(function($) {
    var _ = {
        isMsie: function() {
            return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
        },
        isBlankString: function(str) {
            return !str || /^\s*$/.test(str);
        },
        escapeRegExChars: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        isString: function(obj) {
            return typeof obj === "string";
        },
        isNumber: function(obj) {
            return typeof obj === "number";
        },
        isArray: $.isArray,
        isFunction: $.isFunction,
        isObject: $.isPlainObject,
        isUndefined: function(obj) {
            return typeof obj === "undefined";
        },
        bind: $.proxy,
        each: function(collection, cb) {
            $.each(collection, reverseArgs);

            function reverseArgs(index, value) {
                return cb(value, index);
            }
        },
        map: $.map,
        filter: $.grep,
        every: function(obj, test) {
            var result = true;
            if (!obj) {
                return result;
            }
            $.each(obj, function(key, val) {
                if (!(result = test.call(null, val, key, obj))) {
                    return false;
                }
            });
            return !!result;
        },
        some: function(obj, test) {
            var result = false;
            if (!obj) {
                return result;
            }
            $.each(obj, function(key, val) {
                if (result = test.call(null, val, key, obj)) {
                    return false;
                }
            });
            return !!result;
        },
        mixin: $.extend,
        getUniqueId: function() {
            var counter = 0;
            return function() {
                return counter++;
            };
        }(),
        templatify: function templatify(obj) {
            return $.isFunction(obj) ? obj : template;

            function template() {
                return String(obj);
            }
        },
        defer: function(fn) {
            setTimeout(fn, 0);
        },
        debounce: function(func, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this,
                    args = arguments,
                    later, callNow;
                later = function() {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };
                callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        },
        throttle: function(func, wait) {
            var context, args, timeout, result, previous, later;
            previous = 0;
            later = function() {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date(),
                    remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        noop: function() {}
    };
    var VERSION = "0.10.2";
    var tokenizers = function(root) {
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };

        function whitespace(s) {
            return s.split(/\s+/);
        }

        function nonword(s) {
            return s.split(/\W+/);
        }

        function getObjTokenizer(tokenizer) {
            return function setKey(key) {
                return function tokenize(o) {
                    return tokenizer(o[key]);
                };
            };
        }
    }();
    var LruCache = function() {
        function LruCache(maxSize) {
            this.maxSize = maxSize || 100;
            this.size = 0;
            this.hash = {};
            this.list = new List();
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail,
                    node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            }
        });

        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });

        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        var ls, methods;
        try {
            ls = window.localStorage;
            ls.setItem("~~~", "!");
            ls.removeItem("~~~");
        } catch (err) {
            ls = null;
        }

        function PersistentStorage(namespace) {
            this.prefix = ["__", namespace, "__"].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + this.prefix);
        }
        if (ls && window.JSON) {
            methods = {
                _prefix: function(key) {
                    return this.prefix + key;
                },
                _ttlKey: function(key) {
                    return this._prefix(key) + this.ttlKey;
                },
                get: function(key) {
                    if (this.isExpired(key)) {
                        this.remove(key);
                    }
                    return decode(ls.getItem(this._prefix(key)));
                },
                set: function(key, val, ttl) {
                    if (_.isNumber(ttl)) {
                        ls.setItem(this._ttlKey(key), encode(now() + ttl));
                    } else {
                        ls.removeItem(this._ttlKey(key));
                    }
                    return ls.setItem(this._prefix(key), encode(val));
                },
                remove: function(key) {
                    ls.removeItem(this._ttlKey(key));
                    ls.removeItem(this._prefix(key));
                    return this;
                },
                clear: function() {
                    var i, key, keys = [],
                        len = ls.length;
                    for (i = 0; i < len; i++) {
                        if ((key = ls.key(i)).match(this.keyMatcher)) {
                            keys.push(key.replace(this.keyMatcher, ""));
                        }
                    }
                    for (i = keys.length; i--;) {
                        this.remove(keys[i]);
                    }
                    return this;
                },
                isExpired: function(key) {
                    var ttl = decode(ls.getItem(this._ttlKey(key)));
                    return _.isNumber(ttl) && now() > ttl ? true : false;
                }
            };
        } else {
            methods = {
                get: _.noop,
                set: _.noop,
                remove: _.noop,
                clear: _.noop,
                isExpired: _.noop
            };
        }
        _.mixin(PersistentStorage.prototype, methods);
        return PersistentStorage;

        function now() {
            return new Date().getTime();
        }

        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }

        function decode(val) {
            return JSON.parse(val);
        }
    }();
    var Transport = function() {
        var pendingRequestsCount = 0,
            pendingRequests = {},
            maxPendingRequests = 6,
            requestCache = new LruCache(10);

        function Transport(o) {
            o = o || {};
            this._send = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function clearCache() {
            requestCache = new LruCache(10);
        };
        _.mixin(Transport.prototype, {
            _get: function(url, o, cb) {
                var that = this,
                    jqXhr;
                if (jqXhr = pendingRequests[url]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[url] = this._send(url, o).done(done).fail(fail).always(always);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }

                function done(resp) {
                    cb && cb(null, resp);
                    requestCache.set(url, resp);
                }

                function fail() {
                    cb && cb(true);
                }

                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[url];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(url, o, cb) {
                var resp;
                if (_.isFunction(o)) {
                    cb = o;
                    o = {};
                }
                if (resp = requestCache.get(url)) {
                    _.defer(function() {
                        cb && cb(null, resp);
                    });
                } else {
                    this._get(url, o, cb);
                }
                return !!resp;
            }
        });
        return Transport;

        function callbackToDeferred(fn) {
            return function customSendWrapper(url, o) {
                var deferred = $.Deferred();
                fn(url, o, onSuccess, onError);
                return deferred;

                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }

                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var SearchIndex = function() {
        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [data];
                _.each(data, function(datum) {
                    var id, tokens;
                    id = that.datums.push(datum) - 1;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node.children[ch] || (node.children[ch] = newNode());
                            node.ids.push(id);
                        }
                    });
                });
            },
            get: function get(query) {
                var that = this,
                    tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node.children[ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node.ids.slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            reset: function reset() {
                this.datums = [];
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;

        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }

        function newNode() {
            return {
                ids: [],
                children: {}
            };
        }

        function unique(array) {
            var seen = {},
                uniques = [];
            for (var i = 0; i < array.length; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }

        function getIntersection(arrayA, arrayB) {
            var ai = 0,
                bi = 0,
                intersection = [];
            arrayA = arrayA.sort(compare);
            arrayB = arrayB.sort(compare);
            while (ai < arrayA.length && bi < arrayB.length) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;

            function compare(a, b) {
                return a - b;
            }
        }
    }();
    var oParser = function() {
        return {
            local: getLocal,
            prefetch: getPrefetch,
            remote: getRemote
        };

        function getLocal(o) {
            return o.local || null;
        }

        function getPrefetch(o) {
            var prefetch, defaults;
            defaults = {
                url: null,
                thumbprint: "",
                ttl: 24 * 60 * 60 * 1e3,
                filter: null,
                ajax: {}
            };
            if (prefetch = o.prefetch || null) {
                prefetch = _.isString(prefetch) ? {
                    url: prefetch
                } : prefetch;
                prefetch = _.mixin(defaults, prefetch);
                prefetch.thumbprint = VERSION + prefetch.thumbprint;
                prefetch.ajax.type = prefetch.ajax.type || "GET";
                prefetch.ajax.dataType = prefetch.ajax.dataType || "json";
                !prefetch.url && $.error("prefetch requires url to be set");
            }
            return prefetch;
        }

        function getRemote(o) {
            var remote, defaults;
            defaults = {
                url: null,
                wildcard: "%QUERY",
                replace: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                send: null,
                filter: null,
                ajax: {}
            };
            if (remote = o.remote || null) {
                remote = _.isString(remote) ? {
                    url: remote
                } : remote;
                remote = _.mixin(defaults, remote);
                remote.rateLimiter = /^throttle$/i.test(remote.rateLimitBy) ? byThrottle(remote.rateLimitWait) : byDebounce(remote.rateLimitWait);
                remote.ajax.type = remote.ajax.type || "GET";
                remote.ajax.dataType = remote.ajax.dataType || "json";
                delete remote.rateLimitBy;
                delete remote.rateLimitWait;
                !remote.url && $.error("remote requires url to be set");
            }
            return remote;

            function byDebounce(wait) {
                return function(fn) {
                    return _.debounce(fn, wait);
                };
            }

            function byThrottle(wait) {
                return function(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }
    }();
    (function(root) {
        var old, keys;
        old = root.Bloodhound;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };
        root.Bloodhound = Bloodhound;

        function Bloodhound(o) {
            if (!o || !o.local && !o.prefetch && !o.remote) {
                $.error("one of local, prefetch, or remote is required");
            }
            this.limit = o.limit || 5;
            this.sorter = getSorter(o.sorter);
            this.dupDetector = o.dupDetector || ignoreDuplicates;
            this.local = oParser.local(o);
            this.prefetch = oParser.prefetch(o);
            this.remote = oParser.remote(o);
            this.cacheKey = this.prefetch ? this.prefetch.cacheKey || this.prefetch.url : null;
            this.index = new SearchIndex({
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            this.storage = this.cacheKey ? new PersistentStorage(this.cacheKey) : null;
        }
        Bloodhound.noConflict = function noConflict() {
            root.Bloodhound = old;
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            _loadPrefetch: function loadPrefetch(o) {
                var that = this,
                    serialized, deferred;
                if (serialized = this._readFromStorage(o.thumbprint)) {
                    this.index.bootstrap(serialized);
                    deferred = $.Deferred().resolve();
                } else {
                    deferred = $.ajax(o.url, o.ajax).done(handlePrefetchResponse);
                }
                return deferred;

                function handlePrefetchResponse(resp) {
                    that.clear();
                    that.add(o.filter ? o.filter(resp) : resp);
                    that._saveToStorage(that.index.serialize(), o.thumbprint, o.ttl);
                }
            },
            _getFromRemote: function getFromRemote(query, cb) {
                var that = this,
                    url, uriEncodedQuery;
                query = query || "";
                uriEncodedQuery = encodeURIComponent(query);
                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);

                function handleRemoteResponse(err, resp) {
                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
                }
            },
            _saveToStorage: function saveToStorage(data, thumbprint, ttl) {
                if (this.storage) {
                    this.storage.set(keys.data, data, ttl);
                    this.storage.set(keys.protocol, location.protocol, ttl);
                    this.storage.set(keys.thumbprint, thumbprint, ttl);
                }
            },
            _readFromStorage: function readFromStorage(thumbprint) {
                var stored = {},
                    isExpired;
                if (this.storage) {
                    stored.data = this.storage.get(keys.data);
                    stored.protocol = this.storage.get(keys.protocol);
                    stored.thumbprint = this.storage.get(keys.thumbprint);
                }
                isExpired = stored.thumbprint !== thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            _initialize: function initialize() {
                var that = this,
                    local = this.local,
                    deferred;
                deferred = this.prefetch ? this._loadPrefetch(this.prefetch) : $.Deferred().resolve();
                local && deferred.done(addLocalToIndex);
                this.transport = this.remote ? new Transport(this.remote) : null;
                return this.initPromise = deferred.promise();

                function addLocalToIndex() {
                    that.add(_.isFunction(local) ? local() : local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
            },
            get: function get(query, cb) {
                var that = this,
                    matches = [],
                    cacheHit = false;
                matches = this.index.get(query);
                matches = this.sorter(matches).slice(0, this.limit);
                if (matches.length < this.limit && this.transport) {
                    cacheHit = this._getFromRemote(query, returnRemoteMatches);
                }
                if (!cacheHit) {
                    (matches.length > 0 || !this.transport) && cb && cb(matches);
                }

                function returnRemoteMatches(remoteMatches) {
                    var matchesWithBackfill = matches.slice(0);
                    _.each(remoteMatches, function(remoteMatch) {
                        var isDuplicate;
                        isDuplicate = _.some(matchesWithBackfill, function(match) {
                            return that.dupDetector(remoteMatch, match);
                        });
                        !isDuplicate && matchesWithBackfill.push(remoteMatch);
                        return matchesWithBackfill.length < that.limit;
                    });
                    cb && cb(that.sorter(matchesWithBackfill));
                }
            },
            clear: function clear() {
                this.index.reset();
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.storage && this.storage.clear();
            },
            clearRemoteCache: function clearRemoteCache() {
                this.transport && Transport.resetCache();
            },
            ttAdapter: function ttAdapter() {
                return _.bind(this.get, this);
            }
        });
        return Bloodhound;

        function getSorter(sortFn) {
            return _.isFunction(sortFn) ? sort : noSort;

            function sort(array) {
                return array.sort(sortFn);
            }

            function noSort(array) {
                return array;
            }
        }

        function ignoreDuplicates() {
            return false;
        }
    })(this);
    var html = {
        wrapper: '<span class="twitter-typeahead"></span>',
        dropdown: '<span class="tt-dropdown-menu"></span>',
        dataset: '<div class="tt-dataset-%CLASS%"></div>',
        suggestions: '<span class="tt-suggestions"></span>',
        suggestion: '<div class="tt-suggestion"></div>'
    };
    var css = {
        wrapper: {
            position: "relative",
            display: "inline-block"
        },
        hint: {
            position: "absolute",
            top: "0",
            left: "0",
            borderColor: "transparent",
            boxShadow: "none"
        },
        input: {
            position: "relative",
            verticalAlign: "top",
            backgroundColor: "transparent"
        },
        inputWithNoHint: {
            position: "relative",
            verticalAlign: "top"
        },
        dropdown: {
            position: "absolute",
            top: "100%",
            left: "0",
            zIndex: "100",
            display: "none"
        },
        suggestions: {
            display: "block"
        },
        suggestion: {
            whiteSpace: "nowrap",
            cursor: "pointer"
        },
        suggestionChild: {
            whiteSpace: "normal"
        },
        ltr: {
            left: "0",
            right: "auto"
        },
        rtl: {
            left: "auto",
            right: " 0"
        }
    };
    if (_.isMsie()) {
        _.mixin(css.input, {    /*Brendan_Change*/
            backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
        });
    }
    if (_.isMsie() && _.isMsie() <= 7) {
        _.mixin(css.input, {
            marginTop: "-1px"
        });
    }
    var EventBus = function() {
        var namespace = "typeahead:";

        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            trigger: function(type) {
                var args = [].slice.call(arguments, 1);
                this.$el.trigger(namespace + type, args);
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        var splitter = /\s+/,
            nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };

        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }

        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }

        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }

        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }

        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [type].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }

        function getFlush(callbacks, context, args) {
            return flush;

            function flush() {
                var cancelled;
                for (var i = 0; !cancelled && i < callbacks.length; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }

        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }

        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [o.pattern];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);

            function hightlightTextNode(textNode) {
                var match, patternNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }

            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };

        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [],
                regexStr;
            for (var i = 0; i < patterns.length; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };

        function Input(o) {
            var that = this,
                onBlur, onFocus, onKeydown, onInput;
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            onBlur = _.bind(this._onBlur, this);
            onFocus = _.bind(this._onFocus, this);
            onKeydown = _.bind(this._onKeydown, this);
            onInput = _.bind(this._onInput, this);
            this.$hint = $(o.hint);
            this.$input = $(o.input).on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
            if (!_.isMsie()) {
                this.$input.on("input.tt", onInput);
            } else {
                this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                    if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                        return;
                    }
                    _.defer(_.bind(that._onInput, that, $e));
                });
            }
            this.query = this.$input.val();
            this.$overflowHelper = buildOverflowHelper(this.$input);
        }
        Input.normalizeQuery = function(str) {
            return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._checkInputValue();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault, hintValue, inputValue;
                switch (keyName) {
                    case "tab":
                        hintValue = this.getHint();
                        inputValue = this.getInputValue();
                        preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
                        break;
                    case "up":
                    case "down":
                        preventDefault = !withModifier($e);
                        break;
                    default:
                        preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                    case "tab":
                        trigger = !withModifier($e);
                        break;
                    default:
                        trigger = true;
                }
                return trigger;
            },
            _checkInputValue: function checkInputValue() {
                var inputValue, areEquivalent, hasDifferentWhitespace;
                inputValue = this.getInputValue();
                areEquivalent = areQueriesEquivalent(inputValue, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== inputValue.length : false;
                if (!areEquivalent) {
                    this.trigger("queryChanged", this.query = inputValue);
                } else if (hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getQuery: function getQuery() {
                return this.query;
            },
            setQuery: function setQuery(query) {
                this.query = query;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value, silent) {
                this.$input.val(value);
                silent ? this.clearHint() : this._checkInputValue();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query, true);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            getLanguageDirection: function getLanguageDirection() {
                return (this.$input.css("direction") || "ltr").toLowerCase();
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$hint = this.$input = this.$overflowHelper = null;
            }
        });
        return Input;

        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }

        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }

        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        var datasetKey = "ttDataset",
            valueKey = "ttValue",
            datumKey = "ttDatum";

        function Dataset(o) {
            o = o || {};
            o.templates = o.templates || {};
            if (!o.source) {
                $.error("missing source");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            this.query = null;
            this.highlight = !!o.highlight;
            this.name = o.name || _.getUniqueId();
            this.source = o.source;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.$el = $(html.dataset.replace("%CLASS%", this.name));
        }
        Dataset.extractDatasetName = function extractDatasetName(el) {
            return $(el).data(datasetKey);
        };
        Dataset.extractValue = function extractDatum(el) {
            return $(el).data(valueKey);
        };
        Dataset.extractDatum = function extractDatum(el) {
            return $(el).data(datumKey);
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _render: function render(query, suggestions) {
                if (!this.$el) {
                    return;
                }
                var that = this,
                    hasSuggestions;
                this.$el.empty();
                hasSuggestions = suggestions && suggestions.length;
                if (!hasSuggestions && this.templates.empty) {
                    this.$el.html(getEmptyHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                } else if (hasSuggestions) {
                    this.$el.html(getSuggestionsHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                }
                this.trigger("rendered");

                function getEmptyHtml() {
                    return that.templates.empty({
                        query: query,
                        isEmpty: true
                    });
                }

                function getSuggestionsHtml() {
                    var $suggestions, nodes;
                    $suggestions = $(html.suggestions).css(css.suggestions);
                    nodes = _.map(suggestions, getSuggestionNode);
                    $suggestions.append.apply($suggestions, nodes);
                    that.highlight && highlight({
                        node: $suggestions[0],
                        pattern: query
                    });
                    return $suggestions;

                    function getSuggestionNode(suggestion) {
                        var $el;
                        $el = $(html.suggestion).append(that.templates.suggestion(suggestion)).data(datasetKey, that.name).data(valueKey, that.displayFn(suggestion)).data(datumKey, suggestion);
                        $el.children().each(function() {
                            $(this).css(css.suggestionChild);
                        });
                        return $el;
                    }
                }

                function getHeaderHtml() {
                    return that.templates.header({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }

                function getFooterHtml() {
                    return that.templates.footer({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
            },
            getRoot: function getRoot() {
                return this.$el;
            },
            update: function update(query) {
                var that = this;
                this.query = query;
                this.canceled = false;
                this.source(query, render);

                function render(suggestions) {
                    if (!that.canceled && query === that.query) {
                        that._render(query, suggestions);
                    }
                }
            },
            cancel: function cancel() {
                this.canceled = true;
            },
            clear: function clear() {
                this.cancel();
                this.$el.empty();
                this.trigger("rendered");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = null;
            }
        });
        return Dataset;

        function getDisplayFn(display) {
            display = display || "value";
            return _.isFunction(display) ? display : displayFn;

            function displayFn(obj) {
                return obj[display];
            }
        }

        function getTemplates(templates, displayFn) {
            return {
                empty: templates.empty && _.templatify(templates.empty),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };

            function suggestionTemplate(context) {
                return "<p>" + displayFn(context) + "</p>";
            }
        }

        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Dropdown = function() {
        function Dropdown(o) {
            var that = this,
                onSuggestionClick, onSuggestionMouseEnter, onSuggestionMouseLeave;
            o = o || {};
            if (!o.menu) {
                $.error("menu is required");
            }
            this.isOpen = false;
            this.isEmpty = true;
            this.datasets = _.map(o.datasets, initializeDataset);
            onSuggestionClick = _.bind(this._onSuggestionClick, this);
            onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
            onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
            this.$menu = $(o.menu).on("click.tt", ".tt-suggestion", onSuggestionClick).on("mouseenter.tt", ".tt-suggestion", onSuggestionMouseEnter).on("mouseleave.tt", ".tt-suggestion", onSuggestionMouseLeave);
            _.each(this.datasets, function(dataset) {
                that.$menu.append(dataset.getRoot());
                dataset.onSync("rendered", that._onRendered, that);
            });
        }
        _.mixin(Dropdown.prototype, EventEmitter, {
            _onSuggestionClick: function onSuggestionClick($e) {
                this.trigger("suggestionClicked", $($e.currentTarget));
            },
            _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
                this._removeCursor();
                this._setCursor($($e.currentTarget), true);
            },
            _onSuggestionMouseLeave: function onSuggestionMouseLeave() {
                this._removeCursor();
            },
            _onRendered: function onRendered() {
                this.isEmpty = _.every(this.datasets, isDatasetEmpty);
                this.isEmpty ? this._hide() : this.isOpen && this._show();
                this.trigger("datasetRendered");

                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _hide: function() {
                this.$menu.hide();
            },
            _show: function() {
                this.$menu.css("display", "block");
            },
            _getSuggestions: function getSuggestions() {
                return this.$menu.find(".tt-suggestion");
            },
            _getCursor: function getCursor() {
                return this.$menu.find(".tt-cursor").first();
            },
            _setCursor: function setCursor($el, silent) {
                $el.first().addClass("tt-cursor");
                !silent && this.trigger("cursorMoved");
            },
            _removeCursor: function removeCursor() {
                this._getCursor().removeClass("tt-cursor");
            },
            _moveCursor: function moveCursor(increment) {
                var $suggestions, $oldCursor, newCursorIndex, $newCursor;
                if (!this.isOpen) {
                    return;
                }
                $oldCursor = this._getCursor();
                $suggestions = this._getSuggestions();
                this._removeCursor();
                newCursorIndex = $suggestions.index($oldCursor) + increment;
                newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
                if (newCursorIndex === -1) {
                    this.trigger("cursorRemoved");
                    return;
                } else if (newCursorIndex < -1) {
                    newCursorIndex = $suggestions.length - 1;
                }
                this._setCursor($newCursor = $suggestions.eq(newCursorIndex));
                this._ensureVisible($newCursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, menuScrollTop, menuHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                menuScrollTop = this.$menu.scrollTop();
                menuHeight = this.$menu.height() + parseInt(this.$menu.css("paddingTop"), 10) + parseInt(this.$menu.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$menu.scrollTop(menuScrollTop + elTop);
                } else if (menuHeight < elBottom) {
                    this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
                }
            },
            close: function close() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this._removeCursor();
                    this._hide();
                    this.trigger("closed");
                }
            },
            open: function open() {
                if (!this.isOpen) {
                    this.isOpen = true;
                    !this.isEmpty && this._show();
                    this.trigger("opened");
                }
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$menu.css(dir === "ltr" ? css.ltr : css.rtl);
            },
            moveCursorUp: function moveCursorUp() {
                this._moveCursor(-1);
            },
            moveCursorDown: function moveCursorDown() {
                this._moveCursor(+1);
            },
            getDatumForSuggestion: function getDatumForSuggestion($el) {
                var datum = null;
                if ($el.length) {
                    datum = {
                        raw: Dataset.extractDatum($el),
                        value: Dataset.extractValue($el),
                        datasetName: Dataset.extractDatasetName($el)
                    };
                }
                return datum;
            },
            getDatumForCursor: function getDatumForCursor() {
                return this.getDatumForSuggestion(this._getCursor().first());
            },
            getDatumForTopSuggestion: function getDatumForTopSuggestion() {
                return this.getDatumForSuggestion(this._getSuggestions().first());
            },
            update: function update(query) {
                _.each(this.datasets, updateDataset);

                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.isEmpty = true;

                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            isVisible: function isVisible() {
                return this.isOpen && !this.isEmpty;
            },
            destroy: function destroy() {
                this.$menu.off(".tt");
                this.$menu = null;
                _.each(this.datasets, destroyDataset);

                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Dropdown;

        function initializeDataset(oDataset) {
            return new Dataset(oDataset);
        }
    }();
    var Typeahead = function() {
        var attrsKey = "ttAttrs";

        function Typeahead(o) {
            var $menu, $input, $hint;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            this.isActivated = false;
            this.autoselect = !!o.autoselect;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.$node = buildDomStructure(o.input, o.withHint);
            $menu = this.$node.find(".tt-dropdown-menu");
            $input = this.$node.find(".tt-input");
            $hint = this.$node.find(".tt-hint");
            $input.on("blur.tt", function($e) {
                var active, isActive, hasActive;
                active = document.activeElement;
                isActive = $menu.is(active);
                hasActive = $menu.has(active).length > 0;
                if (_.isMsie() && (isActive || hasActive)) {
                    $e.preventDefault();
                    $e.stopImmediatePropagation();
                    _.defer(function() {
                        $input.focus();
                    });
                }
            });
            $menu.on("mousedown.tt", function($e) {
                $e.preventDefault();
            });
            this.eventBus = o.eventBus || new EventBus({
                el: $input
            });
            this.dropdown = new Dropdown({
                menu: $menu,
                datasets: o.datasets
            }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onAsync("datasetRendered", this._onDatasetRendered, this);
            this.input = new Input({
                input: $input,
                hint: $hint
            }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
            this._setLanguageDirection();
        }
        _.mixin(Typeahead.prototype, {
            _onSuggestionClicked: function onSuggestionClicked(type, $el) {
                var datum;
                if (datum = this.dropdown.getDatumForSuggestion($el)) {
                    this._select(datum);
                }
            },
            _onCursorMoved: function onCursorMoved() {
                var datum = this.dropdown.getDatumForCursor();
                this.input.setInputValue(datum.value, true);
                this.eventBus.trigger("cursorchanged", datum.raw, datum.datasetName);
            },
            _onCursorRemoved: function onCursorRemoved() {
                this.input.resetInputValue();
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered() {
                this._updateHint();
            },
            _onOpened: function onOpened() {
                this._updateHint();
                this.eventBus.trigger("opened");
            },
            _onClosed: function onClosed() {
                this.input.clearHint();
                this.eventBus.trigger("closed");
            },
            _onFocused: function onFocused() {
                this.isActivated = true;
                this.dropdown.open();
            },
            _onBlurred: function onBlurred() {
                this.isActivated = false;
                this.dropdown.empty();
                this.dropdown.close();
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var cursorDatum, topSuggestionDatum;
                cursorDatum = this.dropdown.getDatumForCursor();
                topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
                if (cursorDatum) {
                    this._select(cursorDatum);
                    $e.preventDefault();
                } else if (this.autoselect && topSuggestionDatum) {
                    this._select(topSuggestionDatum);
                    $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var datum;
                if (datum = this.dropdown.getDatumForCursor()) {
                    this._select(datum);
                    $e.preventDefault();
                } else {
                    this._autocomplete(true);
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.dropdown.close();
                this.input.resetInputValue();
            },
            _onUpKeyed: function onUpKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorUp();
                this.dropdown.open();
            },
            _onDownKeyed: function onDownKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorDown();
                this.dropdown.open();
            },
            _onLeftKeyed: function onLeftKeyed() {
                this.dir === "rtl" && this._autocomplete();
            },
            _onRightKeyed: function onRightKeyed() {
                this.dir === "ltr" && this._autocomplete();
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this.input.clearHintIfInvalid();
                query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.empty();
                this.dropdown.open();
                this._setLanguageDirection();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
                this.dropdown.open();
            },
            _setLanguageDirection: function setLanguageDirection() {
                var dir;
                if (this.dir !== (dir = this.input.getLanguageDirection())) {
                    this.dir = dir;
                    this.$node.css("direction", dir);
                    this.dropdown.setLanguageDirection(dir);
                }
            },
            _updateHint: function updateHint() {
                var datum, val, query, escapedQuery, frontMatchRegEx, match;
                datum = this.dropdown.getDatumForTopSuggestion();
                if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
                    val = this.input.getInputValue();
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(datum.value);
                    match ? this.input.setHint(val + match[1]) : this.input.clearHint();
                } else {
                    this.input.clearHint();
                }
            },
            _autocomplete: function autocomplete(laxCursor) {
                var hint, query, isCursorAtEnd, datum;
                hint = this.input.getHint();
                query = this.input.getQuery();
                isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
                if (hint && query !== hint && isCursorAtEnd) {
                    datum = this.dropdown.getDatumForTopSuggestion();
                    datum && this.input.setInputValue(datum.value);
                    this.eventBus.trigger("autocompleted", datum.raw, datum.datasetName);
                }
            },
            _select: function select(datum) {
                this.input.setQuery(datum.value);
                this.input.setInputValue(datum.value, true);
                this._setLanguageDirection();
                this.eventBus.trigger("selected", datum.raw, datum.datasetName);
                this.dropdown.close();
                _.defer(_.bind(this.dropdown.empty, this.dropdown));
            },
            open: function open() {
                this.dropdown.open();
            },
            close: function close() {
                this.dropdown.close();
            },
            setVal: function setVal(val) {
                if (this.isActivated) {
                    this.input.setInputValue(val);
                } else {
                    this.input.setQuery(val);
                    this.input.setInputValue(val, true);
                }
                this._setLanguageDirection();
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            destroy: function destroy() {
                this.input.destroy();
                this.dropdown.destroy();
                destroyDomStructure(this.$node);
                this.$node = null;
            }
        });
        return Typeahead;

        function buildDomStructure(input, withHint) {
            var $input, $wrapper, $dropdown, $hint;
            $input = $(input);
            $wrapper = $(html.wrapper).css(css.wrapper);
            $dropdown = $(html.dropdown).css(css.dropdown);
            $hint = $input.clone().css(css.hint).css(getBackgroundStyles($input));
            $hint.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder").prop("disabled", true).attr({
                autocomplete: "off",
                spellcheck: "false"
            });
            $input.data(attrsKey, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass("tt-input").attr({
                autocomplete: "off",
                spellcheck: false
            }).css(withHint ? css.input : css.inputWithNoHint);
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input.wrap($wrapper).parent().prepend(withHint ? $hint : null).append($dropdown);
        }

        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }

        function destroyDomStructure($node) {
            var $input = $node.find(".tt-input");
            _.each($input.data(attrsKey), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.detach().removeData(attrsKey).removeClass("tt-input").insertAfter($node);
            $node.remove();
        }
    }();
    (function() {
        var old, typeaheadKey, methods;
        old = $.fn.typeahead;
        typeaheadKey = "ttTypeahead";
        methods = {
            initialize: function initialize(o, datasets) {
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                return this.each(attach);

                function attach() {
                    var $input = $(this),
                        eventBus, typeahead;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    typeahead = new Typeahead({
                        input: $input,
                        eventBus: eventBus = new EventBus({
                            el: $input
                        }),
                        withHint: _.isUndefined(o.hint) ? true : !!o.hint,
                        minLength: o.minLength,
                        autoselect: o.autoselect,
                        datasets: datasets
                    });
                    $input.data(typeaheadKey, typeahead);
                }
            },
            open: function open() {
                return this.each(openTypeahead);

                function openTypeahead() {
                    var $input = $(this),
                        typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.open();
                    }
                }
            },
            close: function close() {
                return this.each(closeTypeahead);

                function closeTypeahead() {
                    var $input = $(this),
                        typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.close();
                    }
                }
            },
            val: function val(newVal) {
                return !arguments.length ? getVal(this.first()) : this.each(setVal);

                function setVal() {
                    var $input = $(this),
                        typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.setVal(newVal);
                    }
                }

                function getVal($input) {
                    var typeahead, query;
                    if (typeahead = $input.data(typeaheadKey)) {
                        query = typeahead.getVal();
                    }
                    return query;
                }
            },
            destroy: function destroy() {
                return this.each(unattach);

                function unattach() {
                    var $input = $(this),
                        typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.destroy();
                        $input.removeData(typeaheadKey);
                    }
                }
            }
        };
        $.fn.typeahead = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };
    })();
})(window.jQuery);
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = global.window && global.window.$ ? factory(global.window.$) : function(input) {
            if (!input.$ && !input.fn) {
                throw new Error("Tokenfield requires a window object with jQuery or a jQuery instance");
            }
            return factory(input.$ || input);
        };
    } else {
        factory(jQuery);
    }
}(function($, window) {
    "use strict";
    var Tokenfield = function(element, options) {
        var _self = this
        this.$element = $(element)
        this.textDirection = this.$element.css('direction');
        this.options = $.extend(true, {}, $.fn.tokenfield.defaults, {
            tokens: this.$element.val()
        }, this.$element.data(), options)
        this._delimiters = (typeof this.options.delimiter === 'string') ? [this.options.delimiter] : this.options.delimiter
        this._triggerKeys = $.map(this._delimiters, function(delimiter) {
            return delimiter.charCodeAt(0);
        });
        this._firstDelimiter = this._delimiters[0];
        var whitespace = $.inArray(' ', this._delimiters),
            dash = $.inArray('-', this._delimiters)
        if (whitespace >= 0)
            this._delimiters[whitespace] = '\\s'
        if (dash >= 0) {
            delete this._delimiters[dash]
            this._delimiters.unshift('-')
        }
        var specialCharacters = ['\\', '$', '[', '{', '^', '.', '|', '?', '*', '+', '(', ')']
        $.each(this._delimiters, function(index, char) {
            var pos = $.inArray(char, specialCharacters)
            if (pos >= 0) _self._delimiters[index] = '\\' + char;
        });
        var elRules = (window && typeof window.getMatchedCSSRules === 'function') ? window.getMatchedCSSRules(element) : null,
            elStyleWidth = element.style.width,
            elCSSWidth, elWidth = this.$element.width()
        if (elRules) {
            $.each(elRules, function(i, rule) {
                if (rule.style.width) {
                    elCSSWidth = rule.style.width;
                }
            });
        }
        var hidingPosition = $('body').css('direction') === 'rtl' ? 'right' : 'left',
            originalStyles = {
                position: this.$element.css('position')
            };
        originalStyles[hidingPosition] = this.$element.css(hidingPosition);
        this.$element.data('original-styles', originalStyles).data('original-tabindex', this.$element.prop('tabindex')).css('position', 'absolute').css(hidingPosition, '-10000px').prop('tabindex', -1)
        this.$wrapper = $('<div class="tokenfield form-control" />')
        if (this.$element.hasClass('input-lg')) this.$wrapper.addClass('input-lg')
        if (this.$element.hasClass('input-sm')) this.$wrapper.addClass('input-sm')
        if (this.textDirection === 'rtl') this.$wrapper.addClass('rtl')
        var id = this.$element.prop('id') || new Date().getTime() + '' + Math.floor((1 + Math.random()) * 100)
        this.$input = $('<input type="text" class="token-input" autocomplete="off" />').appendTo(this.$wrapper).prop('placeholder', this.$element.prop('placeholder')).prop('id', id + '-tokenfield').prop('tabindex', this.$element.data('original-tabindex'))
        var $label = $('label[for="' + this.$element.prop('id') + '"]')
        if ($label.length) {
            $label.prop('for', this.$input.prop('id'))
        }
        this.$copyHelper = $('<input type="text" />').css('position', 'absolute').css(hidingPosition, '-10000px').prop('tabindex', -1).prependTo(this.$wrapper)
        if (elStyleWidth) {
            this.$wrapper.css('width', elStyleWidth);
        } else if (elCSSWidth) {
            this.$wrapper.css('width', elCSSWidth);
        } else if (this.$element.parents('.form-inline').length) {
            this.$wrapper.width(elWidth)
        }
        if (this.$element.prop('disabled') || this.$element.parents('fieldset[disabled]').length) {
            this.disable();
        }
        if (this.$element.prop('readonly')) {
            this.readonly();
        }
        this.$mirror = $('<span style="position:absolute; top:-999px; left:0; white-space:pre;"/>');
        this.$input.css('min-width', this.options.minWidth + 'px')
        $.each(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function(i, val) {
            _self.$mirror[0].style[val] = _self.$input.css(val);
        });
        this.$mirror.appendTo('body')
        this.$wrapper.insertBefore(this.$element)
        this.$element.prependTo(this.$wrapper)
        this.update()
        this.setTokens(this.options.tokens, false, false)
        this.listen()
        if (!$.isEmptyObject(this.options.autocomplete)) {
            var side = this.textDirection === 'rtl' ? 'right' : 'left',
                autocompleteOptions = $.extend({
                    minLength: this.options.showAutocompleteOnFocus ? 0 : null,
                    position: {
                        my: side + " top",
                        at: side + " bottom",
                        of: this.$wrapper
                    }
                }, this.options.autocomplete)
            this.$input.autocomplete(autocompleteOptions)
        }
        if (!$.isEmptyObject(this.options.typeahead)) {
            var typeaheadOptions = this.options.typeahead,
                defaults = {
                    minLength: this.options.showAutocompleteOnFocus ? 0 : null
                },
                args = $.isArray(typeaheadOptions) ? typeaheadOptions : [typeaheadOptions, typeaheadOptions]
            args[0] = $.extend({}, defaults, args[0])
            this.$input.typeahead.apply(this.$input, args)
            this.typeahead = true
        }
        this.$element.trigger('tokenfield:initialize')
    }
    Tokenfield.prototype = {
        constructor: Tokenfield,
        createToken: function(attrs, triggerChange) {
            var _self = this
            if (typeof attrs === 'string') {
                attrs = {
                    value: attrs,
                    label: attrs
                }
            }
            if (typeof triggerChange === 'undefined') {
                triggerChange = true
            }
            attrs.value = $.trim(attrs.value);
            attrs.label = attrs.label && attrs.label.length ? $.trim(attrs.label) : attrs.value
            if (!attrs.value.length || !attrs.label.length || attrs.label.length <= this.options.minLength) return
            if (this.options.limit && this.getTokens().length >= this.options.limit) return
            var createEvent = $.Event('tokenfield:createtoken', {
                attrs: attrs
            })
            this.$element.trigger(createEvent)
            if (!createEvent.attrs || createEvent.isDefaultPrevented()) return
            var $token = $('<div class="token" />').attr('data-value', attrs.value).append('<span class="token-label" />').append('<a href="#" class="close" tabindex="-1">&times;</a>')
            if (this.$input.hasClass('tt-input')) {
                this.$input.parent().before($token)
            } else {
                this.$input.before($token)
            }
            this.$input.css('width', this.options.minWidth + 'px')
            var $tokenLabel = $token.find('.token-label'),
                $closeButton = $token.find('.close')
            if (!this.maxTokenWidth) {
                this.maxTokenWidth = this.$wrapper.width() - $closeButton.outerWidth() -
                parseInt($closeButton.css('margin-left'), 10) -
                parseInt($closeButton.css('margin-right'), 10) -
                parseInt($token.css('border-left-width'), 10) -
                parseInt($token.css('border-right-width'), 10) -
                parseInt($token.css('padding-left'), 10) -
                parseInt($token.css('padding-right'), 10)
                parseInt($tokenLabel.css('border-left-width'), 10) -
                parseInt($tokenLabel.css('border-right-width'), 10) -
                parseInt($tokenLabel.css('padding-left'), 10) -
                parseInt($tokenLabel.css('padding-right'), 10)
                parseInt($tokenLabel.css('margin-left'), 10) -
                parseInt($tokenLabel.css('margin-right'), 10)
            }
            $tokenLabel.text(attrs.label).css('max-width', this.maxTokenWidth)
            $token.on('mousedown', function(e) {
                if (_self._disabled || _self._readonly) return false
                _self.preventDeactivation = true
            }).on('click', function(e) {
                if (_self._disabled || _self._readonly) return false
                _self.preventDeactivation = false
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault()
                    return _self.toggle($token)
                }
                _self.activate($token, e.shiftKey, e.shiftKey)
            }).on('dblclick', function(e) {
                if (_self._disabled || _self._readonly || !_self.options.allowEditing) return false
                _self.edit($token)
            })
            $closeButton.on('click', $.proxy(this.remove, this))
            this.$element.trigger($.Event('tokenfield:createdtoken', {
                attrs: attrs,
                relatedTarget: $token.get(0)
            }))
            if (triggerChange) {
                this.$element.val(this.getTokensList()).trigger($.Event('change', {
                    initiator: 'tokenfield'
                }))
            }
            this.update()
            return this.$element.get(0)
        },
        setTokens: function(tokens, add, triggerChange) {
            if (!tokens) return
            if (!add) this.$wrapper.find('.token').remove()
            if (typeof triggerChange === 'undefined') {
                triggerChange = true
            }
            if (typeof tokens === 'string') {
                if (this._delimiters.length) {
                    tokens = tokens.split(new RegExp('[' + this._delimiters.join('') + ']'))
                } else {
                    tokens = [tokens];
                }
            }
            var _self = this
            $.each(tokens, function(i, attrs) {
                _self.createToken(attrs, triggerChange)
            })
            return this.$element.get(0)
        },
        getTokenData: function($token) {
            var data = $token.map(function() {
                var $token = $(this);
                return {
                    value: $token.attr('data-value'),
                    label: $token.find('.token-label').text()
                }
            }).get();
            if (data.length == 1) {
                data = data[0];
            }
            return data;
        },
        getTokens: function(active) {
            var self = this,
                tokens = [],
                activeClass = active ? '.active' : ''
            this.$wrapper.find('.token' + activeClass).each(function() {
                tokens.push(self.getTokenData($(this)))
            })
            return tokens
        },
        getTokensList: function(delimiter, beautify, active) {
            delimiter = delimiter || this._firstDelimiter
            beautify = (typeof beautify !== 'undefined' && beautify !== null) ? beautify : this.options.beautify
            var separator = delimiter + (beautify && delimiter !== ' ' ? ' ' : '')
            return $.map(this.getTokens(active), function(token) {
                return token.value
            }).join(separator)
        },
        getInput: function() {
            return this.$input.val()
        },
        listen: function() {
            var _self = this
            this.$element.on('change', $.proxy(this.change, this))
            this.$wrapper.on('mousedown', $.proxy(this.focusInput, this))
            this.$input.on('focus', $.proxy(this.focus, this)).on('blur', $.proxy(this.blur, this)).on('paste', $.proxy(this.paste, this)).on('keydown', $.proxy(this.keydown, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this))
            this.$copyHelper.on('focus', $.proxy(this.focus, this)).on('blur', $.proxy(this.blur, this)).on('keydown', $.proxy(this.keydown, this)).on('keyup', $.proxy(this.keyup, this))
            this.$input.on('keypress', $.proxy(this.update, this)).on('keyup', $.proxy(this.update, this))
            this.$input.on('autocompletecreate', function() {
                var $_menuElement = $(this).data('ui-autocomplete').menu.element
                var minWidth = _self.$wrapper.outerWidth() -
                    parseInt($_menuElement.css('border-left-width'), 10) -
                    parseInt($_menuElement.css('border-right-width'), 10)
                $_menuElement.css('min-width', minWidth + 'px')
            }).on('autocompleteselect', function(e, ui) {
                if (_self.createToken(ui.item)) {
                    _self.$input.val('')
                    if (_self.$input.data('edit')) {
                        _self.unedit(true)
                    }
                }
                return false
            }).on('typeahead:selected typeahead:autocompleted', function(e, datum, dataset) {
                if (_self.createToken(datum)) {
                    _self.$input.typeahead('val', '')
                    if (_self.$input.data('edit')) {
                        _self.unedit(true)
                    }
                }
            })
            $(window).on('resize', $.proxy(this.update, this))
        },
        keydown: function(e) {
            if (!this.focused) return
            var _self = this
            switch (e.keyCode) {
                case 8:
                    if (!this.$input.is(document.activeElement)) break
                    this.lastInputValue = this.$input.val()
                    break
                case 37:
                    leftRight(this.textDirection === 'rtl' ? 'next' : 'prev')
                    break
                case 38:
                    upDown('prev')
                    break
                case 39:
                    leftRight(this.textDirection === 'rtl' ? 'prev' : 'next')
                    break
                case 40:
                    upDown('next')
                    break
                case 65:
                    if (this.$input.val().length > 0 || !(e.ctrlKey || e.metaKey)) break
                    this.activateAll()
                    e.preventDefault()
                    break
                case 9:
                case 13:
                    if (this.$input.data('ui-autocomplete') && this.$input.data('ui-autocomplete').menu.element.find("li:has(a.ui-state-focus)").length) break
                    if (this.$input.hasClass('tt-input') && this.$wrapper.find('.tt-cursor').length) break
                    if (this.$input.hasClass('tt-input') && this.$wrapper.find('.tt-hint').val().length) break
                    if (this.$input.is(document.activeElement) && this.$input.val().length || this.$input.data('edit')) {
                        return this.createTokensFromInput(e, this.$input.data('edit'));
                    }
                    if (e.keyCode === 13) {
                        if (!this.$copyHelper.is(document.activeElement) || this.$wrapper.find('.token.active').length !== 1) break
                        if (!_self.options.allowEditing) break
                        this.edit(this.$wrapper.find('.token.active'))
                    }
            }

            function leftRight(direction) {
                if (_self.$input.is(document.activeElement)) {
                    if (_self.$input.val().length > 0) return
                    direction += 'All'
                    var $token = _self.$input.hasClass('tt-input') ? _self.$input.parent()[direction]('.token:first') : _self.$input[direction]('.token:first')
                    if (!$token.length) return
                    _self.preventInputFocus = true
                    _self.preventDeactivation = true
                    _self.activate($token)
                    e.preventDefault()
                } else {
                    _self[direction](e.shiftKey)
                    e.preventDefault()
                }
            }

            function upDown(direction) {
                if (!e.shiftKey) return
                if (_self.$input.is(document.activeElement)) {
                    if (_self.$input.val().length > 0) return
                    var $token = _self.$input.hasClass('tt-input') ? _self.$input.parent()[direction + 'All']('.token:first') : _self.$input[direction + 'All']('.token:first')
                    if (!$token.length) return
                    _self.activate($token)
                }
                var opposite = direction === 'prev' ? 'next' : 'prev',
                    position = direction === 'prev' ? 'first' : 'last'
                _self.firstActiveToken[opposite + 'All']('.token').each(function() {
                    _self.deactivate($(this))
                })
                _self.activate(_self.$wrapper.find('.token:' + position), true, true)
                e.preventDefault()
            }
            this.lastKeyDown = e.keyCode
        },
        keypress: function(e) {
            this.lastKeyPressCode = e.keyCode
            this.lastKeyPressCharCode = e.charCode
            if ($.inArray(e.charCode, this._triggerKeys) !== -1 && this.$input.is(document.activeElement)) {
                if (this.$input.val()) {
                    this.createTokensFromInput(e)
                }
                return false;
            }
        },
        keyup: function(e) {
            this.preventInputFocus = false
            if (!this.focused) return
            switch (e.keyCode) {
                case 8:
                    if (this.$input.is(document.activeElement)) {
                        if (this.$input.val().length || this.lastInputValue.length && this.lastKeyDown === 8) break
                        this.preventDeactivation = true
                        var $prevToken = this.$input.hasClass('tt-input') ? this.$input.parent().prevAll('.token:first') : this.$input.prevAll('.token:first')
                        if (!$prevToken.length) break
                        this.activate($prevToken)
                    } else {
                        this.remove(e)
                    }
                    break
                case 46:
                    this.remove(e, 'next')
                    break
            }
            this.lastKeyUp = e.keyCode
        },
        focus: function(e) {
            this.focused = true
            this.$wrapper.addClass('focus')
            if (this.$input.is(document.activeElement)) {
                this.$wrapper.find('.active').removeClass('active')
                this.$firstActiveToken = null
                if (this.options.showAutocompleteOnFocus) {
                    this.search()
                }
            }
        },
        blur: function(e) {
            this.focused = false
            this.$wrapper.removeClass('focus')
            if (!this.preventDeactivation && !this.$element.is(document.activeElement)) {
                this.$wrapper.find('.active').removeClass('active')
                this.$firstActiveToken = null
            }
            if (!this.preventCreateTokens && (this.$input.data('edit') && !this.$input.is(document.activeElement) || this.options.createTokensOnBlur)) {
                this.createTokensFromInput(e)
            }
            this.preventDeactivation = false
            this.preventCreateTokens = false
        },
        paste: function(e) {
            var _self = this
            setTimeout(function() {
                _self.createTokensFromInput(e)
            }, 1)
        },
        change: function(e) {
            if (e.initiator === 'tokenfield') return
            this.setTokens(this.$element.val())
        },
        createTokensFromInput: function(e, focus) {
            if (this.$input.val().length < this.options.minLength)
                return
            var tokensBefore = this.getTokensList()
            this.setTokens(this.$input.val(), true)
            if (tokensBefore == this.getTokensList() && this.$input.val().length)
                return false
            if (this.$input.hasClass('tt-input')) {
                this.$input.typeahead('val', '')
            } else {
                this.$input.val('')
            }
            if (this.$input.data('edit')) {
                this.unedit(focus)
            }
            return false
        },
        next: function(add) {
            if (add) {
                var $firstActiveToken = this.$wrapper.find('.active:first'),
                    deactivate = $firstActiveToken && this.$firstActiveToken ? $firstActiveToken.index() < this.$firstActiveToken.index() : false
                if (deactivate) return this.deactivate($firstActiveToken)
            }
            var $lastActiveToken = this.$wrapper.find('.active:last'),
                $nextToken = $lastActiveToken.nextAll('.token:first')
            if (!$nextToken.length) {
                this.$input.focus()
                return
            }
            this.activate($nextToken, add)
        },
        prev: function(add) {
            if (add) {
                var $lastActiveToken = this.$wrapper.find('.active:last'),
                    deactivate = $lastActiveToken && this.$firstActiveToken ? $lastActiveToken.index() > this.$firstActiveToken.index() : false
                if (deactivate) return this.deactivate($lastActiveToken)
            }
            var $firstActiveToken = this.$wrapper.find('.active:first'),
                $prevToken = $firstActiveToken.prevAll('.token:first')
            if (!$prevToken.length) {
                $prevToken = this.$wrapper.find('.token:first')
            }
            if (!$prevToken.length && !add) {
                this.$input.focus()
                return
            }
            this.activate($prevToken, add)
        },
        activate: function($token, add, multi, remember) {
            if (!$token) return
            if (typeof remember === 'undefined') var remember = true
            if (multi) var add = true
            this.$copyHelper.focus()
            if (!add) {
                this.$wrapper.find('.active').removeClass('active')
                if (remember) {
                    this.$firstActiveToken = $token
                } else {
                    delete this.$firstActiveToken
                }
            }
            if (multi && this.$firstActiveToken) {
                var i = this.$firstActiveToken.index() - 2,
                    a = $token.index() - 2,
                    _self = this
                this.$wrapper.find('.token').slice(Math.min(i, a) + 1, Math.max(i, a)).each(function() {
                    _self.activate($(this), true)
                })
            }
            $token.addClass('active')
            this.$copyHelper.val(this.getTokensList(null, null, true)).select()
        },
        activateAll: function() {
            var _self = this
            this.$wrapper.find('.token').each(function(i) {
                _self.activate($(this), i !== 0, false, false)
            })
        },
        deactivate: function($token) {
            if (!$token) return
            $token.removeClass('active')
            this.$copyHelper.val(this.getTokensList(null, null, true)).select()
        },
        toggle: function($token) {
            if (!$token) return
            $token.toggleClass('active')
            this.$copyHelper.val(this.getTokensList(null, null, true)).select()
        },
        edit: function($token) {
            if (!$token) return
            var attrs = {
                value: $token.data('value'),
                label: $token.find('.token-label').text()
            }
            var options = {
                attrs: attrs,
                relatedTarget: $token.get(0)
            }
            var editEvent = $.Event('tokenfield:edittoken', options)
            this.$element.trigger(editEvent)
            if (editEvent.isDefaultPrevented()) return
            $token.find('.token-label').text(attrs.value)
            var tokenWidth = $token.outerWidth()
            var $_input = this.$input.hasClass('tt-input') ? this.$input.parent() : this.$input
            $token.replaceWith($_input)
            this.preventCreateTokens = true
            this.$input.val(attrs.value).select().data('edit', true).width(tokenWidth)
            this.update();
            this.$element.trigger($.Event('tokenfield:editedtoken', options))
        },
        unedit: function(focus) {
            var $_input = this.$input.hasClass('tt-input') ? this.$input.parent() : this.$input
            $_input.appendTo(this.$wrapper)
            this.$input.data('edit', false)
            this.$mirror.text('')
            this.update()
            if (focus) {
                var _self = this
                setTimeout(function() {
                    _self.$input.focus()
                }, 1)
            }
        },
        remove: function(e, direction) {
            if (this.$input.is(document.activeElement) || this._disabled || this._readonly) return
            var $token = (e.type === 'click') ? $(e.target).closest('.token') : this.$wrapper.find('.token.active')
            if (e.type !== 'click') {
                if (!direction) var direction = 'prev'
                this[direction]()
                if (direction === 'prev') var firstToken = $token.first().prevAll('.token:first').length === 0
            }
            var options = {
                    attrs: this.getTokenData($token),
                    relatedTarget: $token.get(0)
                },
                removeEvent = $.Event('tokenfield:removetoken', options)
            this.$element.trigger(removeEvent);
            if (removeEvent.isDefaultPrevented()) return
            var removedEvent = $.Event('tokenfield:removedtoken', options),
                changeEvent = $.Event('change', {
                    initiator: 'tokenfield'
                })
            $token.remove()
            this.$element.val(this.getTokensList()).trigger(removedEvent).trigger(changeEvent)
            if (!this.$wrapper.find('.token').length || e.type === 'click' || firstToken) this.$input.focus()
            this.$input.css('width', this.options.minWidth + 'px')
            this.update()
            e.preventDefault()
            e.stopPropagation()
        },
        update: function(e) {
            var value = this.$input.val(),
                inputPaddingLeft = parseInt(this.$input.css('padding-left'), 10),
                inputPaddingRight = parseInt(this.$input.css('padding-right'), 10),
                inputPadding = inputPaddingLeft + inputPaddingRight
            if (this.$input.data('edit')) {
                if (!value) {
                    value = this.$input.prop("placeholder")
                }
                if (value === this.$mirror.text()) return
                this.$mirror.text(value)
                var mirrorWidth = this.$mirror.width() + 10;
                if (mirrorWidth > this.$wrapper.width()) {
                    return this.$input.width(this.$wrapper.width())
                }
                this.$input.width(mirrorWidth)
            } else {
                this.$input.css('width', this.options.minWidth + 'px')
                if (this.textDirection === 'rtl') {
                    return this.$input.width(this.$input.offset().left + this.$input.outerWidth() - this.$wrapper.offset().left - parseInt(this.$wrapper.css('padding-left'), 10) - inputPadding - 1)
                }
                this.$input.width(this.$wrapper.offset().left + this.$wrapper.width() + parseInt(this.$wrapper.css('padding-left'), 10) - this.$input.offset().left - inputPadding)
            }
        },
        focusInput: function(e) {
            if ($(e.target).closest('.token').length || $(e.target).closest('.token-input').length || $(e.target).closest('.tt-dropdown-menu').length) return
            var _self = this
            setTimeout(function() {
                _self.$input.focus()
            }, 0)
        },
        search: function() {
            if (this.$input.data('ui-autocomplete')) {
                this.$input.autocomplete('search')
            }
        },
        disable: function() {
            this.setProperty('disabled', true);
        },
        enable: function() {
            this.setProperty('disabled', false);
        },
        readonly: function() {
            this.setProperty('readonly', true);
        },
        writeable: function() {
            this.setProperty('readonly', false);
        },
        setProperty: function(property, value) {
            this['_' + property] = value;
            this.$input.prop(property, value);
            this.$element.prop(property, value);
            this.$wrapper[value ? 'addClass' : 'removeClass'](property);
        },
        destroy: function() {
            this.$element.val(this.getTokensList());
            this.$element.css(this.$element.data('original-styles'));
            this.$element.prop('tabindex', this.$element.data('original-tabindex'));
            var $label = $('label[for="' + this.$input.prop('id') + '"]')
            if ($label.length) {
                $label.prop('for', this.$element.prop('id'))
            }
            this.$element.insertBefore(this.$wrapper);
            this.$element.removeData('original-styles').removeData('original-tabindex').removeData('bs.tokenfield');
            this.$wrapper.remove();
            var $_element = this.$element;
            delete this;
            return $_element;
        }
    }
    var old = $.fn.tokenfield
    $.fn.tokenfield = function(option, param) {
        var value, args = []
        Array.prototype.push.apply(args, arguments);
        var elements = this.each(function() {
            var $this = $(this),
                data = $this.data('bs.tokenfield'),
                options = typeof option == 'object' && option
            if (typeof option === 'string' && data && data[option]) {
                args.shift()
                value = data[option].apply(data, args)
            } else {
                if (!data && typeof option !== 'string' && !param) $this.data('bs.tokenfield', (data = new Tokenfield(this, options)))
            }
        })
        return typeof value !== 'undefined' ? value : elements;
    }
    $.fn.tokenfield.defaults = {
        minWidth: 60,
        minLength: 0,
        allowEditing: true,
        limit: 0,
        autocomplete: {},
        typeahead: {},
        showAutocompleteOnFocus: false,
        createTokensOnBlur: false,
        delimiter: ',',
        beautify: true
    }
    $.fn.tokenfield.Constructor = Tokenfield
    $.fn.tokenfield.noConflict = function() {
        $.fn.tokenfield = old
        return this
    }
    return Tokenfield;
}));
this.Handlebars = {};
(function(Handlebars) {
    Handlebars.VERSION = "1.0.rc.1";
    Handlebars.helpers = {};
    Handlebars.partials = {};
    Handlebars.registerHelper = function(name, fn, inverse) {
        if (inverse) {
            fn.not = inverse;
        }
        this.helpers[name] = fn;
    };
    Handlebars.registerPartial = function(name, str) {
        this.partials[name] = str;
    };
    Handlebars.registerHelper('helperMissing', function(arg) {
        if (arguments.length === 2) {
            return undefined;
        } else {
            throw new Error("Could not find property '" + arg + "'");
        }
    });
    var toString = Object.prototype.toString,
        functionType = "[object Function]";
    Handlebars.registerHelper('blockHelperMissing', function(context, options) {
        var inverse = options.inverse || function() {},
            fn = options.fn;
        var ret = "";
        var type = toString.call(context);
        if (type === functionType) {
            context = context.call(this);
        }
        if (context === true) {
            return fn(this);
        } else if (context === false || context == null) {
            return inverse(this);
        } else if (type === "[object Array]") {
            if (context.length > 0) {
                return Handlebars.helpers.each(context, options);
            } else {
                return inverse(this);
            }
        } else {
            return fn(context);
        }
    });
    Handlebars.K = function() {};
    Handlebars.createFrame = Object.create || function(object) {
        Handlebars.K.prototype = object;
        var obj = new Handlebars.K();
        Handlebars.K.prototype = null;
        return obj;
    };
    Handlebars.registerHelper('each', function(context, options) {
        var fn = options.fn,
            inverse = options.inverse;
        var ret = "",
            data;
        if (options.data) {
            data = Handlebars.createFrame(options.data);
        }
        if (context && context.length > 0) {
            for (var i = 0, j = context.length; i < j; i++) {
                if (data) {
                    data.index = i;
                }
                ret = ret + fn(context[i], {
                    data: data
                });
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    });
    Handlebars.registerHelper('if', function(context, options) {
        var type = toString.call(context);
        if (type === functionType) {
            context = context.call(this);
        }
        if (!context || Handlebars.Utils.isEmpty(context)) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('unless', function(context, options) {
        var fn = options.fn,
            inverse = options.inverse;
        options.fn = inverse;
        options.inverse = fn;
        return Handlebars.helpers['if'].call(this, context, options);
    });
    Handlebars.registerHelper('with', function(context, options) {
        return options.fn(context);
    });
    Handlebars.registerHelper('log', function(context) {
        Handlebars.log(context);
    });
}(this.Handlebars));;
var handlebars = (function() {
    var parser = {
        trace: function trace() {},
        yy: {},
        symbols_: {
            "error": 2,
            "root": 3,
            "program": 4,
            "EOF": 5,
            "statements": 6,
            "simpleInverse": 7,
            "statement": 8,
            "openInverse": 9,
            "closeBlock": 10,
            "openBlock": 11,
            "mustache": 12,
            "partial": 13,
            "CONTENT": 14,
            "COMMENT": 15,
            "OPEN_BLOCK": 16,
            "inMustache": 17,
            "CLOSE": 18,
            "OPEN_INVERSE": 19,
            "OPEN_ENDBLOCK": 20,
            "path": 21,
            "OPEN": 22,
            "OPEN_UNESCAPED": 23,
            "OPEN_PARTIAL": 24,
            "params": 25,
            "hash": 26,
            "DATA": 27,
            "param": 28,
            "STRING": 29,
            "INTEGER": 30,
            "BOOLEAN": 31,
            "hashSegments": 32,
            "hashSegment": 33,
            "ID": 34,
            "EQUALS": 35,
            "pathSegments": 36,
            "SEP": 37,
            "$accept": 0,
            "$end": 1
        },
        terminals_: {
            2: "error",
            5: "EOF",
            14: "CONTENT",
            15: "COMMENT",
            16: "OPEN_BLOCK",
            18: "CLOSE",
            19: "OPEN_INVERSE",
            20: "OPEN_ENDBLOCK",
            22: "OPEN",
            23: "OPEN_UNESCAPED",
            24: "OPEN_PARTIAL",
            27: "DATA",
            29: "STRING",
            30: "INTEGER",
            31: "BOOLEAN",
            34: "ID",
            35: "EQUALS",
            37: "SEP"
        },
        productions_: [0, [3, 2],
            [4, 3],
            [4, 1],
            [4, 0],
            [6, 1],
            [6, 2],
            [8, 3],
            [8, 3],
            [8, 1],
            [8, 1],
            [8, 1],
            [8, 1],
            [11, 3],
            [9, 3],
            [10, 3],
            [12, 3],
            [12, 3],
            [13, 3],
            [13, 4],
            [7, 2],
            [17, 3],
            [17, 2],
            [17, 2],
            [17, 1],
            [17, 1],
            [25, 2],
            [25, 1],
            [28, 1],
            [28, 1],
            [28, 1],
            [28, 1],
            [28, 1],
            [26, 1],
            [32, 2],
            [32, 1],
            [33, 3],
            [33, 3],
            [33, 3],
            [33, 3],
            [33, 3],
            [21, 1],
            [36, 3],
            [36, 1]
        ],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    return $$[$0 - 1];
                    break;
                case 2:
                    this.$ = new yy.ProgramNode($$[$0 - 2], $$[$0]);
                    break;
                case 3:
                    this.$ = new yy.ProgramNode($$[$0]);
                    break;
                case 4:
                    this.$ = new yy.ProgramNode([]);
                    break;
                case 5:
                    this.$ = [$$[$0]];
                    break;
                case 6:
                    $$[$0 - 1].push($$[$0]);
                    this.$ = $$[$0 - 1];
                    break;
                case 7:
                    this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1].inverse, $$[$0 - 1], $$[$0]);
                    break;
                case 8:
                    this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1], $$[$0 - 1].inverse, $$[$0]);
                    break;
                case 9:
                    this.$ = $$[$0];
                    break;
                case 10:
                    this.$ = $$[$0];
                    break;
                case 11:
                    this.$ = new yy.ContentNode($$[$0]);
                    break;
                case 12:
                    this.$ = new yy.CommentNode($$[$0]);
                    break;
                case 13:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                    break;
                case 14:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                    break;
                case 15:
                    this.$ = $$[$0 - 1];
                    break;
                case 16:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                    break;
                case 17:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], true);
                    break;
                case 18:
                    this.$ = new yy.PartialNode($$[$0 - 1]);
                    break;
                case 19:
                    this.$ = new yy.PartialNode($$[$0 - 2], $$[$0 - 1]);
                    break;
                case 20:
                    break;
                case 21:
                    this.$ = [
                        [$$[$0 - 2]].concat($$[$0 - 1]), $$[$0]
                    ];
                    break;
                case 22:
                    this.$ = [
                        [$$[$0 - 1]].concat($$[$0]), null
                    ];
                    break;
                case 23:
                    this.$ = [
                        [$$[$0 - 1]], $$[$0]
                    ];
                    break;
                case 24:
                    this.$ = [
                        [$$[$0]], null
                    ];
                    break;
                case 25:
                    this.$ = [
                        [new yy.DataNode($$[$0])], null
                    ];
                    break;
                case 26:
                    $$[$0 - 1].push($$[$0]);
                    this.$ = $$[$0 - 1];
                    break;
                case 27:
                    this.$ = [$$[$0]];
                    break;
                case 28:
                    this.$ = $$[$0];
                    break;
                case 29:
                    this.$ = new yy.StringNode($$[$0]);
                    break;
                case 30:
                    this.$ = new yy.IntegerNode($$[$0]);
                    break;
                case 31:
                    this.$ = new yy.BooleanNode($$[$0]);
                    break;
                case 32:
                    this.$ = new yy.DataNode($$[$0]);
                    break;
                case 33:
                    this.$ = new yy.HashNode($$[$0]);
                    break;
                case 34:
                    $$[$0 - 1].push($$[$0]);
                    this.$ = $$[$0 - 1];
                    break;
                case 35:
                    this.$ = [$$[$0]];
                    break;
                case 36:
                    this.$ = [$$[$0 - 2], $$[$0]];
                    break;
                case 37:
                    this.$ = [$$[$0 - 2], new yy.StringNode($$[$0])];
                    break;
                case 38:
                    this.$ = [$$[$0 - 2], new yy.IntegerNode($$[$0])];
                    break;
                case 39:
                    this.$ = [$$[$0 - 2], new yy.BooleanNode($$[$0])];
                    break;
                case 40:
                    this.$ = [$$[$0 - 2], new yy.DataNode($$[$0])];
                    break;
                case 41:
                    this.$ = new yy.IdNode($$[$0]);
                    break;
                case 42:
                    $$[$0 - 2].push($$[$0]);
                    this.$ = $$[$0 - 2];
                    break;
                case 43:
                    this.$ = [$$[$0]];
                    break;
            }
        },
        table: [{
            3: 1,
            4: 2,
            5: [2, 4],
            6: 3,
            8: 4,
            9: 5,
            11: 6,
            12: 7,
            13: 8,
            14: [1, 9],
            15: [1, 10],
            16: [1, 12],
            19: [1, 11],
            22: [1, 13],
            23: [1, 14],
            24: [1, 15]
        }, {
            1: [3]
        }, {
            5: [1, 16]
        }, {
            5: [2, 3],
            7: 17,
            8: 18,
            9: 5,
            11: 6,
            12: 7,
            13: 8,
            14: [1, 9],
            15: [1, 10],
            16: [1, 12],
            19: [1, 19],
            20: [2, 3],
            22: [1, 13],
            23: [1, 14],
            24: [1, 15]
        }, {
            5: [2, 5],
            14: [2, 5],
            15: [2, 5],
            16: [2, 5],
            19: [2, 5],
            20: [2, 5],
            22: [2, 5],
            23: [2, 5],
            24: [2, 5]
        }, {
            4: 20,
            6: 3,
            8: 4,
            9: 5,
            11: 6,
            12: 7,
            13: 8,
            14: [1, 9],
            15: [1, 10],
            16: [1, 12],
            19: [1, 11],
            20: [2, 4],
            22: [1, 13],
            23: [1, 14],
            24: [1, 15]
        }, {
            4: 21,
            6: 3,
            8: 4,
            9: 5,
            11: 6,
            12: 7,
            13: 8,
            14: [1, 9],
            15: [1, 10],
            16: [1, 12],
            19: [1, 11],
            20: [2, 4],
            22: [1, 13],
            23: [1, 14],
            24: [1, 15]
        }, {
            5: [2, 9],
            14: [2, 9],
            15: [2, 9],
            16: [2, 9],
            19: [2, 9],
            20: [2, 9],
            22: [2, 9],
            23: [2, 9],
            24: [2, 9]
        }, {
            5: [2, 10],
            14: [2, 10],
            15: [2, 10],
            16: [2, 10],
            19: [2, 10],
            20: [2, 10],
            22: [2, 10],
            23: [2, 10],
            24: [2, 10]
        }, {
            5: [2, 11],
            14: [2, 11],
            15: [2, 11],
            16: [2, 11],
            19: [2, 11],
            20: [2, 11],
            22: [2, 11],
            23: [2, 11],
            24: [2, 11]
        }, {
            5: [2, 12],
            14: [2, 12],
            15: [2, 12],
            16: [2, 12],
            19: [2, 12],
            20: [2, 12],
            22: [2, 12],
            23: [2, 12],
            24: [2, 12]
        }, {
            17: 22,
            21: 23,
            27: [1, 24],
            34: [1, 26],
            36: 25
        }, {
            17: 27,
            21: 23,
            27: [1, 24],
            34: [1, 26],
            36: 25
        }, {
            17: 28,
            21: 23,
            27: [1, 24],
            34: [1, 26],
            36: 25
        }, {
            17: 29,
            21: 23,
            27: [1, 24],
            34: [1, 26],
            36: 25
        }, {
            21: 30,
            34: [1, 26],
            36: 25
        }, {
            1: [2, 1]
        }, {
            6: 31,
            8: 4,
            9: 5,
            11: 6,
            12: 7,
            13: 8,
            14: [1, 9],
            15: [1, 10],
            16: [1, 12],
            19: [1, 11],
            22: [1, 13],
            23: [1, 14],
            24: [1, 15]
        }, {
            5: [2, 6],
            14: [2, 6],
            15: [2, 6],
            16: [2, 6],
            19: [2, 6],
            20: [2, 6],
            22: [2, 6],
            23: [2, 6],
            24: [2, 6]
        }, {
            17: 22,
            18: [1, 32],
            21: 23,
            27: [1, 24],
            34: [1, 26],
            36: 25
        }, {
            10: 33,
            20: [1, 34]
        }, {
            10: 35,
            20: [1, 34]
        }, {
            18: [1, 36]
        }, {
            18: [2, 24],
            21: 41,
            25: 37,
            26: 38,
            27: [1, 45],
            28: 39,
            29: [1, 42],
            30: [1, 43],
            31: [1, 44],
            32: 40,
            33: 46,
            34: [1, 47],
            36: 25
        }, {
            18: [2, 25]
        }, {
            18: [2, 41],
            27: [2, 41],
            29: [2, 41],
            30: [2, 41],
            31: [2, 41],
            34: [2, 41],
            37: [1, 48]
        }, {
            18: [2, 43],
            27: [2, 43],
            29: [2, 43],
            30: [2, 43],
            31: [2, 43],
            34: [2, 43],
            37: [2, 43]
        }, {
            18: [1, 49]
        }, {
            18: [1, 50]
        }, {
            18: [1, 51]
        }, {
            18: [1, 52],
            21: 53,
            34: [1, 26],
            36: 25
        }, {
            5: [2, 2],
            8: 18,
            9: 5,
            11: 6,
            12: 7,
            13: 8,
            14: [1, 9],
            15: [1, 10],
            16: [1, 12],
            19: [1, 11],
            20: [2, 2],
            22: [1, 13],
            23: [1, 14],
            24: [1, 15]
        }, {
            14: [2, 20],
            15: [2, 20],
            16: [2, 20],
            19: [2, 20],
            22: [2, 20],
            23: [2, 20],
            24: [2, 20]
        }, {
            5: [2, 7],
            14: [2, 7],
            15: [2, 7],
            16: [2, 7],
            19: [2, 7],
            20: [2, 7],
            22: [2, 7],
            23: [2, 7],
            24: [2, 7]
        }, {
            21: 54,
            34: [1, 26],
            36: 25
        }, {
            5: [2, 8],
            14: [2, 8],
            15: [2, 8],
            16: [2, 8],
            19: [2, 8],
            20: [2, 8],
            22: [2, 8],
            23: [2, 8],
            24: [2, 8]
        }, {
            14: [2, 14],
            15: [2, 14],
            16: [2, 14],
            19: [2, 14],
            20: [2, 14],
            22: [2, 14],
            23: [2, 14],
            24: [2, 14]
        }, {
            18: [2, 22],
            21: 41,
            26: 55,
            27: [1, 45],
            28: 56,
            29: [1, 42],
            30: [1, 43],
            31: [1, 44],
            32: 40,
            33: 46,
            34: [1, 47],
            36: 25
        }, {
            18: [2, 23]
        }, {
            18: [2, 27],
            27: [2, 27],
            29: [2, 27],
            30: [2, 27],
            31: [2, 27],
            34: [2, 27]
        }, {
            18: [2, 33],
            33: 57,
            34: [1, 58]
        }, {
            18: [2, 28],
            27: [2, 28],
            29: [2, 28],
            30: [2, 28],
            31: [2, 28],
            34: [2, 28]
        }, {
            18: [2, 29],
            27: [2, 29],
            29: [2, 29],
            30: [2, 29],
            31: [2, 29],
            34: [2, 29]
        }, {
            18: [2, 30],
            27: [2, 30],
            29: [2, 30],
            30: [2, 30],
            31: [2, 30],
            34: [2, 30]
        }, {
            18: [2, 31],
            27: [2, 31],
            29: [2, 31],
            30: [2, 31],
            31: [2, 31],
            34: [2, 31]
        }, {
            18: [2, 32],
            27: [2, 32],
            29: [2, 32],
            30: [2, 32],
            31: [2, 32],
            34: [2, 32]
        }, {
            18: [2, 35],
            34: [2, 35]
        }, {
            18: [2, 43],
            27: [2, 43],
            29: [2, 43],
            30: [2, 43],
            31: [2, 43],
            34: [2, 43],
            35: [1, 59],
            37: [2, 43]
        }, {
            34: [1, 60]
        }, {
            14: [2, 13],
            15: [2, 13],
            16: [2, 13],
            19: [2, 13],
            20: [2, 13],
            22: [2, 13],
            23: [2, 13],
            24: [2, 13]
        }, {
            5: [2, 16],
            14: [2, 16],
            15: [2, 16],
            16: [2, 16],
            19: [2, 16],
            20: [2, 16],
            22: [2, 16],
            23: [2, 16],
            24: [2, 16]
        }, {
            5: [2, 17],
            14: [2, 17],
            15: [2, 17],
            16: [2, 17],
            19: [2, 17],
            20: [2, 17],
            22: [2, 17],
            23: [2, 17],
            24: [2, 17]
        }, {
            5: [2, 18],
            14: [2, 18],
            15: [2, 18],
            16: [2, 18],
            19: [2, 18],
            20: [2, 18],
            22: [2, 18],
            23: [2, 18],
            24: [2, 18]
        }, {
            18: [1, 61]
        }, {
            18: [1, 62]
        }, {
            18: [2, 21]
        }, {
            18: [2, 26],
            27: [2, 26],
            29: [2, 26],
            30: [2, 26],
            31: [2, 26],
            34: [2, 26]
        }, {
            18: [2, 34],
            34: [2, 34]
        }, {
            35: [1, 59]
        }, {
            21: 63,
            27: [1, 67],
            29: [1, 64],
            30: [1, 65],
            31: [1, 66],
            34: [1, 26],
            36: 25
        }, {
            18: [2, 42],
            27: [2, 42],
            29: [2, 42],
            30: [2, 42],
            31: [2, 42],
            34: [2, 42],
            37: [2, 42]
        }, {
            5: [2, 19],
            14: [2, 19],
            15: [2, 19],
            16: [2, 19],
            19: [2, 19],
            20: [2, 19],
            22: [2, 19],
            23: [2, 19],
            24: [2, 19]
        }, {
            5: [2, 15],
            14: [2, 15],
            15: [2, 15],
            16: [2, 15],
            19: [2, 15],
            20: [2, 15],
            22: [2, 15],
            23: [2, 15],
            24: [2, 15]
        }, {
            18: [2, 36],
            34: [2, 36]
        }, {
            18: [2, 37],
            34: [2, 37]
        }, {
            18: [2, 38],
            34: [2, 38]
        }, {
            18: [2, 39],
            34: [2, 39]
        }, {
            18: [2, 40],
            34: [2, 40]
        }],
        defaultActions: {
            16: [2, 1],
            24: [2, 25],
            38: [2, 23],
            55: [2, 21]
        },
        parseError: function parseError(str, hash) {
            throw new Error(str);
        },
        parse: function parse(input) {
            var self = this,
                stack = [0],
                vstack = [null],
                lstack = [],
                table = this.table,
                yytext = "",
                yylineno = 0,
                yyleng = 0,
                recovering = 0,
                TERROR = 2,
                EOF = 1;
            this.lexer.setInput(input);
            this.lexer.yy = this.yy;
            this.yy.lexer = this.lexer;
            this.yy.parser = this;
            if (typeof this.lexer.yylloc == "undefined")
                this.lexer.yylloc = {};
            var yyloc = this.lexer.yylloc;
            lstack.push(yyloc);
            var ranges = this.lexer.options && this.lexer.options.ranges;
            if (typeof this.yy.parseError === "function")
                this.parseError = this.yy.parseError;

            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
            }

            function lex() {
                var token;
                token = self.lexer.lex() || 1;
                if (typeof token !== "number") {
                    token = self.symbols_[token] || token;
                }
                return token;
            }
            var symbol, preErrorSymbol, state, action, a, r, yyval = {},
                p, len, newState, expected;
            while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                } else {
                    if (symbol === null || typeof symbol == "undefined") {
                        symbol = lex();
                    }
                    action = table[state] && table[state][symbol];
                }
                if (typeof action === "undefined" || !action.length || !action[0]) {
                    var errStr = "";
                    if (!recovering) {
                        expected = [];
                        for (p in table[state])
                            if (this.terminals_[p] && p > 2) {
                                expected.push("'" + this.terminals_[p] + "'");
                            }
                        if (this.lexer.showPosition) {
                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                        } else {
                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                        }
                        this.parseError(errStr, {
                            text: this.lexer.match,
                            token: this.terminals_[symbol] || symbol,
                            line: this.lexer.yylineno,
                            loc: yyloc,
                            expected: expected
                        });
                    }
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                }
                switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(this.lexer.yytext);
                        lstack.push(this.lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = this.lexer.yyleng;
                            yytext = this.lexer.yytext;
                            yylineno = this.lexer.yylineno;
                            yyloc = this.lexer.yylloc;
                            if (recovering > 0)
                                recovering--;
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                        }
                        r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                        if (typeof r !== "undefined") {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                }
            }
            return true;
        }
    };
    var lexer = (function() {
        var lexer = ({
            EOF: 1,
            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },
            setInput: function(input) {
                this._input = input;
                this._more = this._less = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) this.yylloc.range = [0, 0];
                this.offset = 0;
                return this;
            },
            input: function() {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) this.yylloc.range[1]++;
                this._input = this._input.slice(1);
                return ch;
            },
            unput: function(ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);
                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);
                if (lines.length - 1) this.yylineno -= lines.length - 1;
                var r = this.yylloc.range;
                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };
                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                return this;
            },
            more: function() {
                this._more = true;
                return this;
            },
            less: function(n) {
                this.unput(this.match.slice(n));
            },
            pastInput: function() {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },
            upcomingInput: function() {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },
            showPosition: function() {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },
            next: function() {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) this.done = true;
                var token, match, tempMatch, index, col, lines;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (!this.options.flex) break;
                    }
                }
                if (match) {
                    lines = match[0].match(/(?:\r\n?|\n).*/g);
                    if (lines) this.yylineno += lines.length;
                    this.yylloc = {
                        first_line: this.yylloc.last_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.last_column,
                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                    };
                    this.yytext += match[0];
                    this.match += match[0];
                    this.matches = match;
                    this.yyleng = this.yytext.length;
                    if (this.options.ranges) {
                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
                    }
                    this._more = false;
                    this._input = this._input.slice(match[0].length);
                    this.matched += match[0];
                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                    if (this.done && this._input) this.done = false;
                    if (token) return token;
                    else return;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },
            lex: function lex() {
                var r = this.next();
                if (typeof r !== 'undefined') {
                    return r;
                } else {
                    return this.lex();
                }
            },
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },
            popState: function popState() {
                return this.conditionStack.pop();
            },
            _currentRules: function _currentRules() {
                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
            },
            topState: function() {
                return this.conditionStack[this.conditionStack.length - 2];
            },
            pushState: function begin(condition) {
                this.begin(condition);
            }
        });
        lexer.options = {};
        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
            var YYSTATE = YY_START
            switch ($avoiding_name_collisions) {
                case 0:
                    if (yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                    if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1), this.begin("emu");
                    if (yy_.yytext) return 14;
                    break;
                case 1:
                    return 14;
                    break;
                case 2:
                    if (yy_.yytext.slice(-1) !== "\\") this.popState();
                    if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1);
                    return 14;
                    break;
                case 3:
                    return 24;
                    break;
                case 4:
                    return 16;
                    break;
                case 5:
                    return 20;
                    break;
                case 6:
                    return 19;
                    break;
                case 7:
                    return 19;
                    break;
                case 8:
                    return 23;
                    break;
                case 9:
                    return 23;
                    break;
                case 10:
                    yy_.yytext = yy_.yytext.substr(3, yy_.yyleng - 5);
                    this.popState();
                    return 15;
                    break;
                case 11:
                    return 22;
                    break;
                case 12:
                    return 35;
                    break;
                case 13:
                    return 34;
                    break;
                case 14:
                    return 34;
                    break;
                case 15:
                    return 37;
                    break;
                case 16:
                    break;
                case 17:
                    this.popState();
                    return 18;
                    break;
                case 18:
                    this.popState();
                    return 18;
                    break;
                case 19:
                    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"');
                    return 29;
                    break;
                case 20:
                    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"');
                    return 29;
                    break;
                case 21:
                    yy_.yytext = yy_.yytext.substr(1);
                    return 27;
                    break;
                case 22:
                    return 31;
                    break;
                case 23:
                    return 31;
                    break;
                case 24:
                    return 30;
                    break;
                case 25:
                    return 34;
                    break;
                case 26:
                    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2);
                    return 34;
                    break;
                case 27:
                    return 'INVALID';
                    break;
                case 28:
                    return 5;
                    break;
            }
        };
        lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[} ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@[a-zA-Z]+)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:[0-9]+(?=[}\s]))/, /^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/];
        lexer.conditions = {
            "mu": {
                "rules": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
                "inclusive": false
            },
            "emu": {
                "rules": [2],
                "inclusive": false
            },
            "INITIAL": {
                "rules": [0, 1, 28],
                "inclusive": true
            }
        };
        return lexer;
    })()
    parser.lexer = lexer;

    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = handlebars;
    exports.Parser = handlebars.Parser;
    exports.parse = function() {
        return handlebars.parse.apply(handlebars, arguments);
    }
    exports.main = function commonjsMain(args) {
        if (!args[1])
            throw new Error('Usage: ' + args[0] + ' FILE');
        var source, cwd;
        if (typeof process !== 'undefined') {
            source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
        } else {
            source = require("file").path(require("file").cwd()).join(args[1]).read({
                charset: "utf-8"
            });
        }
        return exports.parser.parse(source);
    }
    if (typeof module !== 'undefined' && require.main === module) {
        exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
    }
};;
Handlebars.Parser = handlebars;
Handlebars.parse = function(string) {
    Handlebars.Parser.yy = Handlebars.AST;
    return Handlebars.Parser.parse(string);
};
Handlebars.print = function(ast) {
    return new Handlebars.PrintVisitor().accept(ast);
};
Handlebars.logger = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,
    log: function(level, str) {}
};
Handlebars.log = function(level, str) {
    Handlebars.logger.log(level, str);
};;
(function() {
    Handlebars.AST = {};
    Handlebars.AST.ProgramNode = function(statements, inverse) {
        this.type = "program";
        this.statements = statements;
        if (inverse) {
            this.inverse = new Handlebars.AST.ProgramNode(inverse);
        }
    };
    Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
        this.type = "mustache";
        this.escaped = !unescaped;
        this.hash = hash;
        var id = this.id = rawParams[0];
        var params = this.params = rawParams.slice(1);
        var eligibleHelper = this.eligibleHelper = id.isSimple;
        this.isHelper = eligibleHelper && (params.length || hash);
    };
    Handlebars.AST.PartialNode = function(id, context) {
        this.type = "partial";
        this.id = id;
        this.context = context;
    };
    var verifyMatch = function(open, close) {
        if (open.original !== close.original) {
            throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
        }
    };
    Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
        verifyMatch(mustache.id, close);
        this.type = "block";
        this.mustache = mustache;
        this.program = program;
        this.inverse = inverse;
        if (this.inverse && !this.program) {
            this.isInverse = true;
        }
    };
    Handlebars.AST.ContentNode = function(string) {
        this.type = "content";
        this.string = string;
    };
    Handlebars.AST.HashNode = function(pairs) {
        this.type = "hash";
        this.pairs = pairs;
    };
    Handlebars.AST.IdNode = function(parts) {
        this.type = "ID";
        this.original = parts.join(".");
        var dig = [],
            depth = 0;
        for (var i = 0, l = parts.length; i < l; i++) {
            var part = parts[i];
            if (part === "..") {
                depth++;
            } else if (part === "." || part === "this") {
                this.isScoped = true;
            } else {
                dig.push(part);
            }
        }
        this.parts = dig;
        this.string = dig.join('.');
        this.depth = depth;
        this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
    };
    Handlebars.AST.DataNode = function(id) {
        this.type = "DATA";
        this.id = id;
    };
    Handlebars.AST.StringNode = function(string) {
        this.type = "STRING";
        this.string = string;
    };
    Handlebars.AST.IntegerNode = function(integer) {
        this.type = "INTEGER";
        this.integer = integer;
    };
    Handlebars.AST.BooleanNode = function(bool) {
        this.type = "BOOLEAN";
        this.bool = bool;
    };
    Handlebars.AST.CommentNode = function(comment) {
        this.type = "comment";
        this.comment = comment;
    };
})();;
Handlebars.Exception = function(message) {
    var tmp = Error.prototype.constructor.apply(this, arguments);
    for (var p in tmp) {
        if (tmp.hasOwnProperty(p)) {
            this[p] = tmp[p];
        }
    }
    this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error();
Handlebars.SafeString = function(string) {
    this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
    return this.string.toString();
};
(function() {
    var escape = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    };
    var badChars = /[&<>"'`]/g;
    var possible = /[&<>"'`]/;
    var escapeChar = function(chr) {
        return escape[chr] || "&amp;";
    };
    Handlebars.Utils = {
        escapeExpression: function(string) {
            if (string instanceof Handlebars.SafeString) {
                return string.toString();
            } else if (string == null || string === false) {
                return "";
            }
            if (!possible.test(string)) {
                return string;
            }
            return string.replace(badChars, escapeChar);
        },
        isEmpty: function(value) {
            if (typeof value === "undefined") {
                return true;
            } else if (value === null) {
                return true;
            } else if (value === false) {
                return true;
            } else if (Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
                return true;
            } else {
                return false;
            }
        }
    };
})();;
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};
(function(Compiler, JavaScriptCompiler) {
    Compiler.prototype = {
        compiler: Compiler,
        disassemble: function() {
            var opcodes = this.opcodes,
                opcode, out = [],
                params, param;
            for (var i = 0, l = opcodes.length; i < l; i++) {
                opcode = opcodes[i];
                if (opcode.opcode === 'DECLARE') {
                    out.push("DECLARE " + opcode.name + "=" + opcode.value);
                } else {
                    params = [];
                    for (var j = 0; j < opcode.args.length; j++) {
                        param = opcode.args[j];
                        if (typeof param === "string") {
                            param = "\"" + param.replace("\n", "\\n") + "\"";
                        }
                        params.push(param);
                    }
                    out.push(opcode.opcode + " " + params.join(" "));
                }
            }
            return out.join("\n");
        },
        guid: 0,
        compile: function(program, options) {
            this.children = [];
            this.depths = {
                list: []
            };
            this.options = options;
            var knownHelpers = this.options.knownHelpers;
            this.options.knownHelpers = {
                'helperMissing': true,
                'blockHelperMissing': true,
                'each': true,
                'if': true,
                'unless': true,
                'with': true,
                'log': true
            };
            if (knownHelpers) {
                for (var name in knownHelpers) {
                    this.options.knownHelpers[name] = knownHelpers[name];
                }
            }
            return this.program(program);
        },
        accept: function(node) {
            return this[node.type](node);
        },
        program: function(program) {
            var statements = program.statements,
                statement;
            this.opcodes = [];
            for (var i = 0, l = statements.length; i < l; i++) {
                statement = statements[i];
                this[statement.type](statement);
            }
            this.isSimple = l === 1;
            this.depths.list = this.depths.list.sort(function(a, b) {
                return a - b;
            });
            return this;
        },
        compileProgram: function(program) {
            var result = new this.compiler().compile(program, this.options);
            var guid = this.guid++,
                depth;
            this.usePartial = this.usePartial || result.usePartial;
            this.children[guid] = result;
            for (var i = 0, l = result.depths.list.length; i < l; i++) {
                depth = result.depths.list[i];
                if (depth < 2) {
                    continue;
                } else {
                    this.addDepth(depth - 1);
                }
            }
            return guid;
        },
        block: function(block) {
            var mustache = block.mustache,
                program = block.program,
                inverse = block.inverse;
            if (program) {
                program = this.compileProgram(program);
            }
            if (inverse) {
                inverse = this.compileProgram(inverse);
            }
            var type = this.classifyMustache(mustache);
            if (type === "helper") {
                this.helperMustache(mustache, program, inverse);
            } else if (type === "simple") {
                this.simpleMustache(mustache);
                this.opcode('pushProgram', program);
                this.opcode('pushProgram', inverse);
                this.opcode('pushLiteral', '{}');
                this.opcode('blockValue');
            } else {
                this.ambiguousMustache(mustache, program, inverse);
                this.opcode('pushProgram', program);
                this.opcode('pushProgram', inverse);
                this.opcode('pushLiteral', '{}');
                this.opcode('ambiguousBlockValue');
            }
            this.opcode('append');
        },
        hash: function(hash) {
            var pairs = hash.pairs,
                pair, val;
            this.opcode('push', '{}');
            for (var i = 0, l = pairs.length; i < l; i++) {
                pair = pairs[i];
                val = pair[1];
                this.accept(val);
                this.opcode('assignToHash', pair[0]);
            }
        },
        partial: function(partial) {
            var id = partial.id;
            this.usePartial = true;
            if (partial.context) {
                this.ID(partial.context);
            } else {
                this.opcode('push', 'depth0');
            }
            this.opcode('invokePartial', id.original);
            this.opcode('append');
        },
        content: function(content) {
            this.opcode('appendContent', content.string);
        },
        mustache: function(mustache) {
            var options = this.options;
            var type = this.classifyMustache(mustache);
            if (type === "simple") {
                this.simpleMustache(mustache);
            } else if (type === "helper") {
                this.helperMustache(mustache);
            } else {
                this.ambiguousMustache(mustache);
            }
            if (mustache.escaped && !options.noEscape) {
                this.opcode('appendEscaped');
            } else {
                this.opcode('append');
            }
        },
        ambiguousMustache: function(mustache, program, inverse) {
            var id = mustache.id,
                name = id.parts[0];
            this.opcode('getContext', id.depth);
            this.opcode('pushProgram', program);
            this.opcode('pushProgram', inverse);
            this.opcode('invokeAmbiguous', name);
        },
        simpleMustache: function(mustache, program, inverse) {
            var id = mustache.id;
            if (id.type === 'DATA') {
                this.DATA(id);
            } else if (id.parts.length) {
                this.ID(id);
            } else {
                this.addDepth(id.depth);
                this.opcode('getContext', id.depth);
                this.opcode('pushContext');
            }
            this.opcode('resolvePossibleLambda');
        },
        helperMustache: function(mustache, program, inverse) {
            var params = this.setupFullMustacheParams(mustache, program, inverse),
                name = mustache.id.parts[0];
            if (this.options.knownHelpers[name]) {
                this.opcode('invokeKnownHelper', params.length, name);
            } else if (this.knownHelpersOnly) {
                throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
            } else {
                this.opcode('invokeHelper', params.length, name);
            }
        },
        ID: function(id) {
            this.addDepth(id.depth);
            this.opcode('getContext', id.depth);
            var name = id.parts[0];
            if (!name) {
                this.opcode('pushContext');
            } else {
                this.opcode('lookupOnContext', id.parts[0]);
            }
            for (var i = 1, l = id.parts.length; i < l; i++) {
                this.opcode('lookup', id.parts[i]);
            }
        },
        DATA: function(data) {
            this.options.data = true;
            this.opcode('lookupData', data.id);
        },
        STRING: function(string) {
            this.opcode('pushString', string.string);
        },
        INTEGER: function(integer) {
            this.opcode('pushLiteral', integer.integer);
        },
        BOOLEAN: function(bool) {
            this.opcode('pushLiteral', bool.bool);
        },
        comment: function() {},
        opcode: function(name) {
            this.opcodes.push({
                opcode: name,
                args: [].slice.call(arguments, 1)
            });
        },
        declare: function(name, value) {
            this.opcodes.push({
                opcode: 'DECLARE',
                name: name,
                value: value
            });
        },
        addDepth: function(depth) {
            if (isNaN(depth)) {
                throw new Error("EWOT");
            }
            if (depth === 0) {
                return;
            }
            if (!this.depths[depth]) {
                this.depths[depth] = true;
                this.depths.list.push(depth);
            }
        },
        classifyMustache: function(mustache) {
            var isHelper = mustache.isHelper;
            var isEligible = mustache.eligibleHelper;
            var options = this.options;
            if (isEligible && !isHelper) {
                var name = mustache.id.parts[0];
                if (options.knownHelpers[name]) {
                    isHelper = true;
                } else if (options.knownHelpersOnly) {
                    isEligible = false;
                }
            }
            if (isHelper) {
                return "helper";
            } else if (isEligible) {
                return "ambiguous";
            } else {
                return "simple";
            }
        },
        pushParams: function(params) {
            var i = params.length,
                param;
            while (i--) {
                param = params[i];
                if (this.options.stringParams) {
                    if (param.depth) {
                        this.addDepth(param.depth);
                    }
                    this.opcode('getContext', param.depth || 0);
                    this.opcode('pushStringParam', param.string);
                } else {
                    this[param.type](param);
                }
            }
        },
        setupMustacheParams: function(mustache) {
            var params = mustache.params;
            this.pushParams(params);
            if (mustache.hash) {
                this.hash(mustache.hash);
            } else {
                this.opcode('pushLiteral', '{}');
            }
            return params;
        },
        setupFullMustacheParams: function(mustache, program, inverse) {
            var params = mustache.params;
            this.pushParams(params);
            this.opcode('pushProgram', program);
            this.opcode('pushProgram', inverse);
            if (mustache.hash) {
                this.hash(mustache.hash);
            } else {
                this.opcode('pushLiteral', '{}');
            }
            return params;
        }
    };
    var Literal = function(value) {
        this.value = value;
    };
    JavaScriptCompiler.prototype = {
        nameLookup: function(parent, name, type) {
            if (/^[0-9]+$/.test(name)) {
                return parent + "[" + name + "]";
            } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
                return parent + "." + name;
            } else {
                return parent + "['" + name + "']";
            }
        },
        appendToBuffer: function(string) {
            if (this.environment.isSimple) {
                return "return " + string + ";";
            } else {
                return "buffer += " + string + ";";
            }
        },
        initializeBuffer: function() {
            return this.quotedString("");
        },
        namespace: "Handlebars",
        compile: function(environment, options, context, asObject) {
            this.environment = environment;
            this.options = options || {};
            Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");
            this.name = this.environment.name;
            this.isChild = !!context;
            this.context = context || {
                programs: [],
                aliases: {}
            };
            this.preamble();
            this.stackSlot = 0;
            this.stackVars = [];
            this.registers = {
                list: []
            };
            this.compileStack = [];
            this.compileChildren(environment, options);
            var opcodes = environment.opcodes,
                opcode;
            this.i = 0;
            for (l = opcodes.length; this.i < l; this.i++) {
                opcode = opcodes[this.i];
                if (opcode.opcode === 'DECLARE') {
                    this[opcode.name] = opcode.value;
                } else {
                    this[opcode.opcode].apply(this, opcode.args);
                }
            }
            return this.createFunctionContext(asObject);
        },
        nextOpcode: function() {
            var opcodes = this.environment.opcodes,
                opcode = opcodes[this.i + 1];
            return opcodes[this.i + 1];
        },
        eat: function(opcode) {
            this.i = this.i + 1;
        },
        preamble: function() {
            var out = [];
            if (!this.isChild) {
                var namespace = this.namespace;
                var copies = "helpers = helpers || " + namespace + ".helpers;";
                if (this.environment.usePartial) {
                    copies = copies + " partials = partials || " + namespace + ".partials;";
                }
                if (this.options.data) {
                    copies = copies + " data = data || {};";
                }
                out.push(copies);
            } else {
                out.push('');
            }
            if (!this.environment.isSimple) {
                out.push(", buffer = " + this.initializeBuffer());
            } else {
                out.push("");
            }
            this.lastContext = 0;
            this.source = out;
        },
        createFunctionContext: function(asObject) {
            var locals = this.stackVars.concat(this.registers.list);
            if (locals.length > 0) {
                this.source[1] = this.source[1] + ", " + locals.join(", ");
            }
            if (!this.isChild) {
                var aliases = [];
                for (var alias in this.context.aliases) {
                    this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
                }
            }
            if (this.source[1]) {
                this.source[1] = "var " + this.source[1].substring(2) + ";";
            }
            if (!this.isChild) {
                this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
            }
            if (!this.environment.isSimple) {
                this.source.push("return buffer;");
            }
            var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];
            for (var i = 0, l = this.environment.depths.list.length; i < l; i++) {
                params.push("depth" + this.environment.depths.list[i]);
            }
            if (asObject) {
                params.push(this.source.join("\n  "));
                return Function.apply(this, params);
            } else {
                var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
                Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
                return functionSource;
            }
        },
        blockValue: function() {
            this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';
            var params = ["depth0"];
            this.setupParams(0, params);
            this.replaceStack(function(current) {
                params.splice(1, 0, current);
                return current + " = blockHelperMissing.call(" + params.join(", ") + ")";
            });
        },
        ambiguousBlockValue: function() {
            this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';
            var params = ["depth0"];
            this.setupParams(0, params);
            var current = this.topStack();
            params.splice(1, 0, current);
            this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
        },
        appendContent: function(content) {
            this.source.push(this.appendToBuffer(this.quotedString(content)));
        },
        append: function() {
            var local = this.popStack();
            this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
            if (this.environment.isSimple) {
                this.source.push("else { " + this.appendToBuffer("''") + " }");
            }
        },
        appendEscaped: function() {
            var opcode = this.nextOpcode(),
                extra = "";
            this.context.aliases.escapeExpression = 'this.escapeExpression';
            if (opcode && opcode.opcode === 'appendContent') {
                extra = " + " + this.quotedString(opcode.args[0]);
                this.eat(opcode);
            }
            this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
        },
        getContext: function(depth) {
            if (this.lastContext !== depth) {
                this.lastContext = depth;
            }
        },
        lookupOnContext: function(name) {
            this.pushStack(this.nameLookup('depth' + this.lastContext, name, 'context'));
        },
        pushContext: function() {
            this.pushStackLiteral('depth' + this.lastContext);
        },
        resolvePossibleLambda: function() {
            this.context.aliases.functionType = '"function"';
            this.replaceStack(function(current) {
                return "typeof " + current + " === functionType ? " + current + "() : " + current;
            });
        },
        lookup: function(name) {
            this.replaceStack(function(current) {
                return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
            });
        },
        lookupData: function(id) {
            this.pushStack(this.nameLookup('data', id, 'data'));
        },
        pushStringParam: function(string) {
            this.pushStackLiteral('depth' + this.lastContext);
            this.pushString(string);
        },
        pushString: function(string) {
            this.pushStackLiteral(this.quotedString(string));
        },
        push: function(expr) {
            this.pushStack(expr);
        },
        pushLiteral: function(value) {
            this.pushStackLiteral(value);
        },
        pushProgram: function(guid) {
            if (guid != null) {
                this.pushStackLiteral(this.programExpression(guid));
            } else {
                this.pushStackLiteral(null);
            }
        },
        invokeHelper: function(paramSize, name) {
            this.context.aliases.helperMissing = 'helpers.helperMissing';
            var helper = this.lastHelper = this.setupHelper(paramSize, name);
            this.register('foundHelper', helper.name);
            this.pushStack("foundHelper ? foundHelper.call(" +
            helper.callParams + ") " + ": helperMissing.call(" +
            helper.helperMissingParams + ")");
        },
        invokeKnownHelper: function(paramSize, name) {
            var helper = this.setupHelper(paramSize, name);
            this.pushStack(helper.name + ".call(" + helper.callParams + ")");
        },
        invokeAmbiguous: function(name) {
            this.context.aliases.functionType = '"function"';
            this.pushStackLiteral('{}');
            var helper = this.setupHelper(0, name);
            var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
            this.register('foundHelper', helperName);
            var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
            var nextStack = this.nextStack();
            this.source.push('if (foundHelper) { ' + nextStack + ' = foundHelper.call(' + helper.callParams + '); }');
            this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '() : ' + nextStack + '; }');
        },
        invokePartial: function(name) {
            var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];
            if (this.options.data) {
                params.push("data");
            }
            this.context.aliases.self = "this";
            this.pushStack("self.invokePartial(" + params.join(", ") + ");");
        },
        assignToHash: function(key) {
            var value = this.popStack();
            var hash = this.topStack();
            this.source.push(hash + "['" + key + "'] = " + value + ";");
        },
        compiler: JavaScriptCompiler,
        compileChildren: function(environment, options) {
            var children = environment.children,
                child, compiler;
            for (var i = 0, l = children.length; i < l; i++) {
                child = children[i];
                compiler = new this.compiler();
                this.context.programs.push('');
                var index = this.context.programs.length;
                child.index = index;
                child.name = 'program' + index;
                this.context.programs[index] = compiler.compile(child, options, this.context);
            }
        },
        programExpression: function(guid) {
            this.context.aliases.self = "this";
            if (guid == null) {
                return "self.noop";
            }
            var child = this.environment.children[guid],
                depths = child.depths.list,
                depth;
            var programParams = [child.index, child.name, "data"];
            for (var i = 0, l = depths.length; i < l; i++) {
                depth = depths[i];
                if (depth === 1) {
                    programParams.push("depth0");
                } else {
                    programParams.push("depth" + (depth - 1));
                }
            }
            if (depths.length === 0) {
                return "self.program(" + programParams.join(", ") + ")";
            } else {
                programParams.shift();
                return "self.programWithDepth(" + programParams.join(", ") + ")";
            }
        },
        register: function(name, val) {
            this.useRegister(name);
            this.source.push(name + " = " + val + ";");
        },
        useRegister: function(name) {
            if (!this.registers[name]) {
                this.registers[name] = true;
                this.registers.list.push(name);
            }
        },
        pushStackLiteral: function(item) {
            this.compileStack.push(new Literal(item));
            return item;
        },
        pushStack: function(item) {
            this.source.push(this.incrStack() + " = " + item + ";");
            this.compileStack.push("stack" + this.stackSlot);
            return "stack" + this.stackSlot;
        },
        replaceStack: function(callback) {
            var item = callback.call(this, this.topStack());
            this.source.push(this.topStack() + " = " + item + ";");
            return "stack" + this.stackSlot;
        },
        nextStack: function(skipCompileStack) {
            var name = this.incrStack();
            this.compileStack.push("stack" + this.stackSlot);
            return name;
        },
        incrStack: function() {
            this.stackSlot++;
            if (this.stackSlot > this.stackVars.length) {
                this.stackVars.push("stack" + this.stackSlot);
            }
            return "stack" + this.stackSlot;
        },
        popStack: function() {
            var item = this.compileStack.pop();
            if (item instanceof Literal) {
                return item.value;
            } else {
                this.stackSlot--;
                return item;
            }
        },
        topStack: function() {
            var item = this.compileStack[this.compileStack.length - 1];
            if (item instanceof Literal) {
                return item.value;
            } else {
                return item;
            }
        },
        quotedString: function(str) {
            return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
        },
        setupHelper: function(paramSize, name) {
            var params = [];
            this.setupParams(paramSize, params);
            var foundHelper = this.nameLookup('helpers', name, 'helper');
            return {
                params: params,
                name: foundHelper,
                callParams: ["depth0"].concat(params).join(", "),
                helperMissingParams: ["depth0", this.quotedString(name)].concat(params).join(", ")
            };
        },
        setupParams: function(paramSize, params) {
            var options = [],
                contexts = [],
                param, inverse, program;
            options.push("hash:" + this.popStack());
            inverse = this.popStack();
            program = this.popStack();
            if (program || inverse) {
                if (!program) {
                    this.context.aliases.self = "this";
                    program = "self.noop";
                }
                if (!inverse) {
                    this.context.aliases.self = "this";
                    inverse = "self.noop";
                }
                options.push("inverse:" + inverse);
                options.push("fn:" + program);
            }
            for (var i = 0; i < paramSize; i++) {
                param = this.popStack();
                params.push(param);
                if (this.options.stringParams) {
                    contexts.push(this.popStack());
                }
            }
            if (this.options.stringParams) {
                options.push("contexts:[" + contexts.join(",") + "]");
            }
            if (this.options.data) {
                options.push("data:data");
            }
            params.push("{" + options.join(",") + "}");
            return params.join(", ");
        }
    };
    var reservedWords = ("break else new var" + " case finally return void" + " catch for switch while" + " continue function this with" + " default if throw" + " delete in try" + " do instanceof typeof" + " abstract enum int short" + " boolean export interface static" + " byte extends long super" + " char final native synchronized" + " class float package throws" + " const goto private transient" + " debugger implements protected volatile" + " double import public let yield").split(" ");
    var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
    for (var i = 0, l = reservedWords.length; i < l; i++) {
        compilerWords[reservedWords[i]] = true;
    }
    JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
        if (!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
            return true;
        }
        return false;
    };
})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);
Handlebars.precompile = function(string, options) {
    options = options || {};
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    return new Handlebars.JavaScriptCompiler().compile(environment, options);
};
Handlebars.compile = function(string, options) {
    options = options || {};
    var compiled;

    function compile() {
        var ast = Handlebars.parse(string);
        var environment = new Handlebars.Compiler().compile(ast, options);
        var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
        return Handlebars.template(templateSpec);
    }
    return function(context, options) {
        if (!compiled) {
            compiled = compile();
        }
        return compiled.call(this, context, options);
    };
};;
Handlebars.VM = {
    template: function(templateSpec) {
        var container = {
            escapeExpression: Handlebars.Utils.escapeExpression,
            invokePartial: Handlebars.VM.invokePartial,
            programs: [],
            program: function(i, fn, data) {
                var programWrapper = this.programs[i];
                if (data) {
                    return Handlebars.VM.program(fn, data);
                } else if (programWrapper) {
                    return programWrapper;
                } else {
                    programWrapper = this.programs[i] = Handlebars.VM.program(fn);
                    return programWrapper;
                }
            },
            programWithDepth: Handlebars.VM.programWithDepth,
            noop: Handlebars.VM.noop
        };
        return function(context, options) {
            options = options || {};
            return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
        };
    },
    programWithDepth: function(fn, data, $depth) {
        var args = Array.prototype.slice.call(arguments, 2);
        return function(context, options) {
            options = options || {};
            return fn.apply(this, [context, options.data || data].concat(args));
        };
    },
    program: function(fn, data) {
        return function(context, options) {
            options = options || {};
            return fn(context, options.data || data);
        };
    },
    noop: function() {
        return "";
    },
    invokePartial: function(partial, name, context, helpers, partials, data) {
        var options = {
            helpers: helpers,
            partials: partials,
            data: data
        };
        if (partial === undefined) {
            throw new Handlebars.Exception("The partial " + name + " could not be found");
        } else if (partial instanceof Function) {
            return partial(context, options);
        } else if (!Handlebars.compile) {
            throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
        } else {
            partials[name] = Handlebars.compile(partial, {
                data: data !== undefined
            });
            return partials[name](context, options);
        }
    }
};
Handlebars.template = Handlebars.VM.template;;
(function() {
    var SelectParser;
    SelectParser = (function() {
        function SelectParser() {
            this.options_index = 0;
            this.parsed = [];
        }
        SelectParser.prototype.add_node = function(child) {
            if (child.nodeName.toUpperCase() === "OPTGROUP") {
                return this.add_group(child);
            } else {
                return this.add_option(child);
            }
        };
        SelectParser.prototype.add_group = function(group) {
            var group_position, option, _i, _len, _ref, _results;
            group_position = this.parsed.length;
            this.parsed.push({
                array_index: group_position,
                group: true,
                label: this.escapeExpression(group.label),
                children: 0,
                disabled: group.disabled
            });
            _ref = group.childNodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                _results.push(this.add_option(option, group_position, group.disabled));
            }
            return _results;
        };
        SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
            if (option.nodeName.toUpperCase() === "OPTION") {
                if (option.text !== "") {
                    if (group_position != null) {
                        this.parsed[group_position].children += 1;
                    }
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        value: option.value,
                        text: option.text,
                        html: option.innerHTML,
                        selected: option.selected,
                        disabled: group_disabled === true ? group_disabled : option.disabled,
                        group_array_index: group_position,
                        classes: option.className,
                        style: option.style.cssText
                    });
                } else {
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        empty: true
                    });
                }
                return this.options_index += 1;
            }
        };
        SelectParser.prototype.escapeExpression = function(text) {
            var map, unsafe_chars;
            if ((text == null) || text === false) {
                return "";
            }
            if (!/[\&\<\>\"\'\`]/.test(text)) {
                return text;
            }
            map = {
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            };
            unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
            return text.replace(unsafe_chars, function(chr) {
                return map[chr] || "&amp;";
            });
        };
        return SelectParser;
    })();
    SelectParser.select_to_array = function(select) {
        var child, parser, _i, _len, _ref;
        parser = new SelectParser();
        _ref = select.childNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            parser.add_node(child);
        }
        return parser.parsed;
    };
    this.SelectParser = SelectParser;
}).call(this);
(function() {
    var AbstractChosen, root;
    root = this;
    AbstractChosen = (function() {
        function AbstractChosen(form_field, options) {
            this.form_field = form_field;
            this.options = options != null ? options : {};
            if (!AbstractChosen.browser_is_supported()) {
                return;
            }
            this.is_multiple = this.form_field.multiple;
            this.set_default_text();
            this.set_default_values();
            this.setup();
            this.set_up_html();
            this.register_observers();
            this.finish_setup();
        }
        AbstractChosen.prototype.set_default_values = function() {
            var _this = this;
            this.click_test_action = function(evt) {
                return _this.test_active_click(evt);
            };
            this.activate_action = function(evt) {
                return _this.activate_field(evt);
            };
            this.active_field = false;
            this.mouse_on_container = false;
            this.results_showing = false;
            this.result_highlighted = null;
            this.result_single_selected = null;
            this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || false;
            this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
            this.group_search = this.options.group_search != null ? this.options.group_search : true;
            this.search_contains = this.options.search_contains || false;
            this.single_backstroke_delete = this.options.single_backstroke_delete || false;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            return this.inherit_select_classes = this.options.inherit_select_classes || false;
        };
        AbstractChosen.prototype.set_default_text = function() {
            if (this.form_field.getAttribute("data-placeholder")) {
                this.default_text = this.form_field.getAttribute("data-placeholder");
            } else if (this.is_multiple) {
                this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
            } else {
                this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
            }
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
        };
        AbstractChosen.prototype.mouse_enter = function() {
            return this.mouse_on_container = true;
        };
        AbstractChosen.prototype.mouse_leave = function() {
            return this.mouse_on_container = false;
        };
        AbstractChosen.prototype.input_focus = function(evt) {
            var _this = this;
            if (this.is_multiple) {
                if (!this.active_field) {
                    return setTimeout((function() {
                        return _this.container_mousedown();
                    }), 50);
                }
            } else {
                if (!this.active_field) {
                    return this.activate_field();
                }
            }
        };
        AbstractChosen.prototype.input_blur = function(evt) {
            var _this = this;
            if (!this.mouse_on_container) {
                this.active_field = false;
                return setTimeout((function() {
                    return _this.blur_test();
                }), 100);
            }
        };
        AbstractChosen.prototype.results_option_build = function(options) {
            var content, data, _i, _len, _ref;
            content = '';
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                data = _ref[_i];
                if (data.group && (data.search_match || data.group_match)) {
                    content += this.result_add_group(data);
                } else if (!data.empty && data.search_match) {
                    content += this.result_add_option(data);
                }
                if (options != null ? options.first : void 0) {
                    if (data.selected && this.is_multiple) {
                        this.choice_build(data);
                    } else if (data.selected && !this.is_multiple) {
                        this.single_set_selected_text(data.text);
                    }
                }
            }
            return content;
        };
        AbstractChosen.prototype.result_add_option = function(option) {
            var classes, style;
            classes = [];
            if (!option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("active-result");
            }
            if (option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("disabled-result");
            }
            if (option.selected) {
                classes.push("result-selected");
            }
            if (option.group_array_index != null) {
                classes.push("group-option");
            }
            if (option.classes !== "") {
                classes.push(option.classes);
            }
            style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
            return "<li class=\"" + (classes.join(' ')) + "\"" + style + " data-option-array-index=\"" + option.array_index + "\">" + option.search_text + "</li>";
        };
        AbstractChosen.prototype.result_add_group = function(group) {
            return "<li class=\"group-result\">" + group.search_text + "</li>";
        };
        AbstractChosen.prototype.results_update_field = function() {
            this.set_default_text();
            if (!this.is_multiple) {
                this.results_reset_cleanup();
            }
            this.result_clear_highlight();
            this.result_single_selected = null;
            this.results_build();
            if (this.results_showing) {
                return this.winnow_results();
            }
        };
        AbstractChosen.prototype.results_toggle = function() {
            if (this.results_showing) {
                return this.results_hide();
            } else {
                return this.results_show();
            }
        };
        AbstractChosen.prototype.results_search = function(evt) {
            if (this.results_showing) {
                return this.winnow_results();
            } else {
                return this.results_show();
            }
        };
        AbstractChosen.prototype.winnow_results = function() {
            var option, regex, regexAnchor, results, searchText, startpos, text, zregex, _i, _len, _ref;
            this.no_results_clear();
            results = 0;
            searchText = this.get_search_text();
            regexAnchor = this.search_contains ? "" : "^";
            regex = new RegExp(regexAnchor + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
            zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                if (!option.empty) {
                    if (option.group) {
                        option.group_match = false;
                    }
                    if (!(option.group && !this.group_search)) {
                        option.search_match = false;
                        option.search_text = option.group ? option.label : option.html;
                        option.search_match = this.search_string_match(option.search_text, regex);
                        if (option.search_match) {
                            results += 1;
                        }
                        if (option.search_match) {
                            if (searchText.length) {
                                startpos = option.search_text.search(zregex);
                                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
                            }
                            if (option.group_array_index != null) {
                                this.results_data[option.group_array_index].group_match = true;
                            }
                        } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
                            option.search_match = true;
                        }
                    }
                }
            }
            if (results < 1 && searchText.length) {
                this.update_results_content("");
                this.result_clear_highlight();
                return this.no_results(searchText);
            } else {
                this.update_results_content(this.results_option_build());
                return this.winnow_results_set_highlight();
            }
        };
        AbstractChosen.prototype.search_string_match = function(search_string, regex) {
            var part, parts, _i, _len;
            if (regex.test(search_string)) {
                return true;
            } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
                parts = search_string.replace(/\[|\]/g, "").split(" ");
                if (parts.length) {
                    for (_i = 0, _len = parts.length; _i < _len; _i++) {
                        part = parts[_i];
                        if (regex.test(part)) {
                            return true;
                        }
                    }
                }
            }
        };
        AbstractChosen.prototype.choices_count = function() {
            var option, _i, _len, _ref;
            if (this.selected_option_count != null) {
                return this.selected_option_count;
            }
            this.selected_option_count = 0;
            _ref = this.form_field.options;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                if (option.selected) {
                    this.selected_option_count += 1;
                }
            }
            return this.selected_option_count;
        };
        AbstractChosen.prototype.choices_click = function(evt) {
            evt.preventDefault();
            if (!(this.results_showing || this.is_disabled)) {
                return this.results_show();
            }
        };
        AbstractChosen.prototype.keyup_checker = function(evt) {
            var stroke, _ref;
            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            switch (stroke) {
                case 8:
                    if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
                        return this.keydown_backstroke();
                    } else if (!this.pending_backstroke) {
                        this.result_clear_highlight();
                        return this.results_search();
                    }
                    break;
                case 13:
                    evt.preventDefault();
                    if (this.results_showing) {
                        return this.result_select(evt);
                    }
                    break;
                case 27:
                    if (this.results_showing) {
                        this.results_hide();
                    }
                    return true;
                case 9:
                case 38:
                case 40:
                case 16:
                case 91:
                case 17:
                    break;
                default:
                    return this.results_search();
            }
        };
        AbstractChosen.prototype.container_width = function() {
            if (this.options.width != null) {
                return this.options.width;
            } else {
                return "" + this.form_field.offsetWidth + "px";
            }
        };
        AbstractChosen.browser_is_supported = function() {
            var _ref;
            if (window.navigator.appName === "Microsoft Internet Explorer") {
                return (null !== (_ref = document.documentMode) && _ref >= 8);
            }
            return true;
        };
        AbstractChosen.default_multiple_text = "Select Some Options";
        AbstractChosen.default_single_text = "Select an Option";
        AbstractChosen.default_no_result_text = "No results match";
        return AbstractChosen;
    })();
    root.AbstractChosen = AbstractChosen;
}).call(this);
(function() {
    var $, Chosen, root, _ref, __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    root = this;
    $ = jQuery;
    $.fn.extend({
        chosen: function(options) {
            if (!AbstractChosen.browser_is_supported()) {
                return this;
            }
            return this.each(function(input_field) {
                var $this;
                $this = $(this);
                if (!$this.hasClass("chzn-done")) {
                    return $this.data('chosen', new Chosen(this, options));
                }
            });
        }
    });
    Chosen = (function(_super) {
        __extends(Chosen, _super);

        function Chosen() {
            _ref = Chosen.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Chosen.prototype.setup = function() {
            this.form_field_jq = $(this.form_field);
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.is_rtl = this.form_field_jq.hasClass("chzn-rtl");
        };
        Chosen.prototype.finish_setup = function() {
            return this.form_field_jq.addClass("chzn-done");
        };
        Chosen.prototype.set_up_html = function() {
            var container_classes, container_props;
            container_classes = ["chzn-container"];
            container_classes.push("chzn-container-" + (this.is_multiple ? "multi" : "single"));
            if (this.inherit_select_classes && this.form_field.className) {
                container_classes.push(this.form_field.className);
            }
            if (this.is_rtl) {
                container_classes.push("chzn-rtl");
            }
            container_props = {
                'class': container_classes.join(' '),
                'style': "width: " + (this.container_width()) + ";",
                'title': this.form_field.title
            };
            if (this.form_field.id.length) {
                container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chzn";
            }
            this.container = $("<div />", container_props);
            if (this.is_multiple) {
                this.container.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop"><ul class="chzn-results"></ul></div>');
            } else {
                this.container.html('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chzn-drop"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
            }
            this.form_field_jq.hide().after(this.container);
            this.dropdown = this.container.find('div.chzn-drop').first();
            this.search_field = this.container.find('input').first();
            this.search_results = this.container.find('ul.chzn-results').first();
            this.search_field_scale();
            this.search_no_results = this.container.find('li.no-results').first();
            if (this.is_multiple) {
                this.search_choices = this.container.find('ul.chzn-choices').first();
                this.search_container = this.container.find('li.search-field').first();
            } else {
                this.search_container = this.container.find('div.chzn-search').first();
                this.selected_item = this.container.find('.chzn-single').first();
            }
            this.results_build();
            this.set_tab_index();
            this.set_label_behavior();
            return this.form_field_jq.trigger("liszt:ready", {
                chosen: this
            });
        };
        Chosen.prototype.register_observers = function() {
            var _this = this;
            this.container.mousedown(function(evt) {
                _this.container_mousedown(evt);
            });
            this.container.mouseup(function(evt) {
                _this.container_mouseup(evt);
            });
            this.container.mouseenter(function(evt) {
                _this.mouse_enter(evt);
            });
            this.container.mouseleave(function(evt) {
                _this.mouse_leave(evt);
            });
            this.search_results.mouseup(function(evt) {
                _this.search_results_mouseup(evt);
            });
            this.search_results.mouseover(function(evt) {
                _this.search_results_mouseover(evt);
            });
            this.search_results.mouseout(function(evt) {
                _this.search_results_mouseout(evt);
            });
            this.search_results.bind('mousewheel DOMMouseScroll', function(evt) {
                _this.search_results_mousewheel(evt);
            });
            this.form_field_jq.bind("liszt:updated", function(evt) {
                _this.results_update_field(evt);
            });
            this.form_field_jq.bind("liszt:activate", function(evt) {
                _this.activate_field(evt);
            });
            this.form_field_jq.bind("liszt:open", function(evt) {
                _this.container_mousedown(evt);
            });
            this.search_field.blur(function(evt) {
                _this.input_blur(evt);
            });
            this.search_field.keyup(function(evt) {
                _this.keyup_checker(evt);
            });
            this.search_field.keydown(function(evt) {
                _this.keydown_checker(evt);
            });
            this.search_field.focus(function(evt) {
                _this.input_focus(evt);
            });
            if (this.is_multiple) {
                return this.search_choices.click(function(evt) {
                    _this.choices_click(evt);
                });
            } else {
                return this.container.click(function(evt) {
                    evt.preventDefault();
                });
            }
        };
        Chosen.prototype.search_field_disabled = function() {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled) {
                this.container.addClass('chzn-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple) {
                    this.selected_item.unbind("focus", this.activate_action);
                }
                return this.close_field();
            } else {
                this.container.removeClass('chzn-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple) {
                    return this.selected_item.bind("focus", this.activate_action);
                }
            }
        };
        Chosen.prototype.container_mousedown = function(evt) {
            if (!this.is_disabled) {
                if (evt && evt.type === "mousedown" && !this.results_showing) {
                    evt.preventDefault();
                }
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
                    if (!this.active_field) {
                        if (this.is_multiple) {
                            this.search_field.val("");
                        }
                        $(document).click(this.click_test_action);
                        this.results_show();
                    } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chzn-single").length)) {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                }
            }
        };
        Chosen.prototype.container_mouseup = function(evt) {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
                return this.results_reset(evt);
            }
        };
        Chosen.prototype.search_results_mousewheel = function(evt) {
            var delta, _ref1, _ref2;
            delta = -((_ref1 = evt.originalEvent) != null ? _ref1.wheelDelta : void 0) || ((_ref2 = evt.originialEvent) != null ? _ref2.detail : void 0);
            if (delta != null) {
                evt.preventDefault();
                if (evt.type === 'DOMMouseScroll') {
                    delta = delta * 40;
                }
                return this.search_results.scrollTop(delta + this.search_results.scrollTop());
            }
        };
        Chosen.prototype.blur_test = function(evt) {
            if (!this.active_field && this.container.hasClass("chzn-container-active")) {
                return this.close_field();
            }
        };
        Chosen.prototype.close_field = function() {
            $(document).unbind("click", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chzn-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };
        Chosen.prototype.activate_field = function() {
            this.container.addClass("chzn-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };
        Chosen.prototype.test_active_click = function(evt) {
            if (this.container.is($(evt.target).closest('.chzn-container'))) {
                return this.active_field = true;
            } else {
                return this.close_field();
            }
        };
        Chosen.prototype.results_build = function() {
            this.parsing = true;
            this.selected_option_count = null;
            this.results_data = root.SelectParser.select_to_array(this.form_field);
            if (this.is_multiple) {
                this.search_choices.find("li.search-choice").remove();
            } else if (!this.is_multiple) {
                this.single_set_selected_text();
                if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
                    this.search_field[0].readOnly = true;
                    this.container.addClass("chzn-container-single-nosearch");
                } else {
                    this.search_field[0].readOnly = false;
                    this.container.removeClass("chzn-container-single-nosearch");
                }
            }
            this.update_results_content(this.results_option_build({
                first: true
            }));
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            return this.parsing = false;
        };
        Chosen.prototype.result_do_highlight = function(el) {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
            if (el.length) {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom) {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                } else if (high_top < visible_top) {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };
        Chosen.prototype.result_clear_highlight = function() {
            if (this.result_highlight) {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };
        Chosen.prototype.results_show = function() {
            if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                this.form_field_jq.trigger("liszt:maxselected", {
                    chosen: this
                });
                return false;
            }
            this.container.addClass("chzn-with-drop");
            this.form_field_jq.trigger("liszt:showing_dropdown", {
                chosen: this
            });
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            return this.winnow_results();
        };
        Chosen.prototype.update_results_content = function(content) {
            return this.search_results.html(content);
        };
        Chosen.prototype.results_hide = function() {
            if (this.results_showing) {
                this.result_clear_highlight();
                this.container.removeClass("chzn-with-drop");
                this.form_field_jq.trigger("liszt:hiding_dropdown", {
                    chosen: this
                });
            }
            return this.results_showing = false;
        };
        Chosen.prototype.set_tab_index = function(el) {
            var ti;
            if (this.form_field_jq.attr("tabindex")) {
                ti = this.form_field_jq.attr("tabindex");
                this.form_field_jq.attr("tabindex", -1);
                return this.search_field.attr("tabindex", ti);
            }
        };
        Chosen.prototype.set_label_behavior = function() {
            var _this = this;
            this.form_field_label = this.form_field_jq.parents("label");
            if (!this.form_field_label.length && this.form_field.id.length) {
                this.form_field_label = $("label[for='" + this.form_field.id + "']");
            }
            if (this.form_field_label.length > 0) {
                return this.form_field_label.click(function(evt) {
                    if (_this.is_multiple) {
                        return _this.container_mousedown(evt);
                    } else {
                        return _this.activate_field();
                    }
                });
            }
        };
        Chosen.prototype.show_search_field_default = function() {
            if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            } else {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };
        Chosen.prototype.search_results_mouseup = function(evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length) {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };
        Chosen.prototype.search_results_mouseover = function(evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target) {
                return this.result_do_highlight(target);
            }
        };
        Chosen.prototype.search_results_mouseout = function(evt) {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
                return this.result_clear_highlight();
            }
        };
        Chosen.prototype.choice_build = function(item) {
            var choice, close_link, _this = this;
            choice = $('<li />', {
                "class": "search-choice"
            }).html("<span>" + item.html + "</span>");
            if (item.disabled) {
                choice.addClass('search-choice-disabled');
            } else {
                close_link = $('<a />', {
                    href: '#',
                    "class": 'search-choice-close',
                    rel: item.array_index
                });
                close_link.click(function(evt) {
                    return _this.choice_destroy_link_click(evt);
                });
                choice.append(close_link);
            }
            return this.search_container.before(choice);
        };
        Chosen.prototype.choice_destroy_link_click = function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (!this.is_disabled) {
                return this.choice_destroy($(evt.target));
            }
        };
        Chosen.prototype.choice_destroy = function(link) {
            if (this.result_deselect(link.attr("rel"))) {
                this.show_search_field_default();
                if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };
        Chosen.prototype.results_reset = function() {
            this.form_field.options[0].selected = true;
            this.selected_option_count = null;
            this.single_set_selected_text();
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field) {
                return this.results_hide();
            }
        };
        Chosen.prototype.results_reset_cleanup = function() {
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove();
        };
        Chosen.prototype.result_select = function(evt) {
            var high, item;
            if (this.result_highlight) {
                high = this.result_highlight;
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                    this.form_field_jq.trigger("liszt:maxselected", {
                        chosen: this
                    });
                    return false;
                }
                if (this.is_multiple) {
                    high.removeClass("active-result");
                } else {
                    this.search_results.find(".result-selected").removeClass("result-selected");
                    this.result_single_selected = high;
                }
                high.addClass("result-selected");
                item = this.results_data[high[0].getAttribute("data-option-array-index")];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                this.selected_option_count = null;
                if (this.is_multiple) {
                    this.choice_build(item);
                } else {
                    this.single_set_selected_text(item.text);
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
                    this.results_hide();
                }
                this.search_field.val("");
                if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
                    this.form_field_jq.trigger("change", {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.search_field_scale();
            }
        };
        Chosen.prototype.single_set_selected_text = function(text) {
            if (text == null) {
                text = this.default_text;
            }
            if (text === this.default_text) {
                this.selected_item.addClass("chzn-default");
            } else {
                this.single_deselect_control_build();
                this.selected_item.removeClass("chzn-default");
            }
            return this.selected_item.find("span").text(text);
        };
        Chosen.prototype.result_deselect = function(pos) {
            var result_data;
            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled) {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                this.selected_option_count = null;
                this.result_clear_highlight();
                if (this.results_showing) {
                    this.winnow_results();
                }
                this.form_field_jq.trigger("change", {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            } else {
                return false;
            }
        };
        Chosen.prototype.single_deselect_control_build = function() {
            if (!this.allow_single_deselect) {
                return;
            }
            if (!this.selected_item.find("abbr").length) {
                this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
            }
            return this.selected_item.addClass("chzn-single-with-deselect");
        };
        Chosen.prototype.get_search_text = function() {
            if (this.search_field.val() === this.default_text) {
                return "";
            } else {
                return $('<div/>').text($.trim(this.search_field.val())).html();
            }
        };
        Chosen.prototype.winnow_results_set_highlight = function() {
            var do_high, selected_results;
            selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
            do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
            if (do_high != null) {
                return this.result_do_highlight(do_high);
            }
        };
        Chosen.prototype.no_results = function(terms) {
            var no_results_html;
            no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
            no_results_html.find("span").first().html(terms);
            return this.search_results.append(no_results_html);
        };
        Chosen.prototype.no_results_clear = function() {
            return this.search_results.find(".no-results").remove();
        };
        Chosen.prototype.keydown_arrow = function() {
            var next_sib;
            if (this.results_showing && this.result_highlight) {
                next_sib = this.result_highlight.nextAll("li.active-result").first();
                if (next_sib) {
                    return this.result_do_highlight(next_sib);
                }
            } else {
                return this.results_show();
            }
        };
        Chosen.prototype.keyup_arrow = function() {
            var prev_sibs;
            if (!this.results_showing && !this.is_multiple) {
                return this.results_show();
            } else if (this.result_highlight) {
                prev_sibs = this.result_highlight.prevAll("li.active-result");
                if (prev_sibs.length) {
                    return this.result_do_highlight(prev_sibs.first());
                } else {
                    if (this.choices_count() > 0) {
                        this.results_hide();
                    }
                    return this.result_clear_highlight();
                }
            }
        };
        Chosen.prototype.keydown_backstroke = function() {
            var next_available_destroy;
            if (this.pending_backstroke) {
                this.choice_destroy(this.pending_backstroke.find("a").first());
                return this.clear_backstroke();
            } else {
                next_available_destroy = this.search_container.siblings("li.search-choice").last();
                if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
                    this.pending_backstroke = next_available_destroy;
                    if (this.single_backstroke_delete) {
                        return this.keydown_backstroke();
                    } else {
                        return this.pending_backstroke.addClass("search-choice-focus");
                    }
                }
            }
        };
        Chosen.prototype.clear_backstroke = function() {
            if (this.pending_backstroke) {
                this.pending_backstroke.removeClass("search-choice-focus");
            }
            return this.pending_backstroke = null;
        };
        Chosen.prototype.keydown_checker = function(evt) {
            var stroke, _ref1;
            stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
            this.search_field_scale();
            if (stroke !== 8 && this.pending_backstroke) {
                this.clear_backstroke();
            }
            switch (stroke) {
                case 8:
                    this.backstroke_length = this.search_field.val().length;
                    break;
                case 9:
                    if (this.results_showing && !this.is_multiple) {
                        this.result_select(evt);
                    }
                    this.mouse_on_container = false;
                    break;
                case 13:
                    evt.preventDefault();
                    break;
                case 38:
                    evt.preventDefault();
                    this.keyup_arrow();
                    break;
                case 40:
                    evt.preventDefault();
                    this.keydown_arrow();
                    break;
            }
        };
        Chosen.prototype.search_field_scale = function() {
            var div, f_width, h, style, style_block, styles, w, _i, _len;
            if (this.is_multiple) {
                h = 0;
                w = 0;
                style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (_i = 0, _len = styles.length; _i < _len; _i++) {
                    style = styles[_i];
                    style_block += style + ":" + this.search_field.css(style) + ";";
                }
                div = $('<div />', {
                    'style': style_block
                });
                div.text(this.search_field.val());
                $('body').append(div);
                w = div.width() + 25;
                div.remove();
                f_width = this.container.outerWidth();
                if (w > f_width - 10) {
                    w = f_width - 10;
                }
                return this.search_field.css({
                    'width': w + 'px'
                });
            }
        };
        return Chosen;
    })(AbstractChosen);
    root.Chosen = Chosen;
}).call(this);

function inherits(childCtor, parentCtor) {
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;
}

function MarkerLabel_(marker, crossURL, handCursorURL) {
    this.marker_ = marker;
    this.handCursorURL_ = marker.handCursorURL;
    this.labelDiv_ = document.createElement("div");
    this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";
    this.eventDiv_ = document.createElement("div");
    this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;
    this.eventDiv_.setAttribute("onselectstart", "return false;");
    this.eventDiv_.setAttribute("ondragstart", "return false;");
    this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
}
inherits(MarkerLabel_, google.maps.OverlayView);
MarkerLabel_.getSharedCross = function(crossURL) {
    var div;
    if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
        div = document.createElement("img");
        div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
        div.style.marginLeft = "-8px";
        div.style.marginTop = "-9px";
        div.src = crossURL;
        MarkerLabel_.getSharedCross.crossDiv = div;
    }
    return MarkerLabel_.getSharedCross.crossDiv;
};
MarkerLabel_.prototype.onAdd = function() {
    var me = this;
    var cMouseIsDown = false;
    var cDraggingLabel = false;
    var cSavedZIndex;
    var cLatOffset, cLngOffset;
    var cIgnoreClick;
    var cRaiseEnabled;
    var cStartPosition;
    var cStartCenter;
    var cRaiseOffset = 20;
    var cDraggingCursor = "url(" + this.handCursorURL_ + ")";
    var cAbortEvent = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    };
    var cStopBounce = function() {
        me.marker_.setAnimation(null);
    };
    this.getPanes().overlayImage.appendChild(this.labelDiv_);
    this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
    if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
        this.getPanes().overlayImage.appendChild(this.crossDiv_);
        MarkerLabel_.getSharedCross.processed = true;
    }
    this.listeners_ = [google.maps.event.addDomListener(this.eventDiv_, "mouseover", function(e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
            this.style.cursor = "pointer";
            google.maps.event.trigger(me.marker_, "mouseover", e);
        }
    }), google.maps.event.addDomListener(this.eventDiv_, "mouseout", function(e) {
        if ((me.marker_.getDraggable() || me.marker_.getClickable()) && !cDraggingLabel) {
            this.style.cursor = me.marker_.getCursor();
            google.maps.event.trigger(me.marker_, "mouseout", e);
        }
    }), google.maps.event.addDomListener(this.eventDiv_, "mousedown", function(e) {
        cDraggingLabel = false;
        if (me.marker_.getDraggable()) {
            cMouseIsDown = true;
            this.style.cursor = cDraggingCursor;
        }
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
            google.maps.event.trigger(me.marker_, "mousedown", e);
            cAbortEvent(e);
        }
    }), google.maps.event.addDomListener(document, "mouseup", function(mEvent) {
        var position;
        if (cMouseIsDown) {
            cMouseIsDown = false;
            me.eventDiv_.style.cursor = "pointer";
            google.maps.event.trigger(me.marker_, "mouseup", mEvent);
        }
        if (cDraggingLabel) {
            if (cRaiseEnabled) {
                position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
                position.y += cRaiseOffset;
                me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
                try {
                    me.marker_.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(cStopBounce, 1406);
                } catch (e) {}
            }
            me.crossDiv_.style.display = "none";
            me.marker_.setZIndex(cSavedZIndex);
            cIgnoreClick = true;
            cDraggingLabel = false;
            mEvent.latLng = me.marker_.getPosition();
            google.maps.event.trigger(me.marker_, "dragend", mEvent);
        }
    }), google.maps.event.addListener(me.marker_.getMap(), "mousemove", function(mEvent) {
        var position;
        if (cMouseIsDown) {
            if (cDraggingLabel) {
                mEvent.latLng = new google.maps.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
                position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
                if (cRaiseEnabled) {
                    me.crossDiv_.style.left = position.x + "px";
                    me.crossDiv_.style.top = position.y + "px";
                    me.crossDiv_.style.display = "";
                    position.y -= cRaiseOffset;
                }
                me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
                if (cRaiseEnabled) {
                    me.eventDiv_.style.top = (position.y + cRaiseOffset) + "px";
                }
                google.maps.event.trigger(me.marker_, "drag", mEvent);
            } else {
                cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
                cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
                cSavedZIndex = me.marker_.getZIndex();
                cStartPosition = me.marker_.getPosition();
                cStartCenter = me.marker_.getMap().getCenter();
                cRaiseEnabled = me.marker_.get("raiseOnDrag");
                cDraggingLabel = true;
                me.marker_.setZIndex(1000000);
                mEvent.latLng = me.marker_.getPosition();
                google.maps.event.trigger(me.marker_, "dragstart", mEvent);
            }
        }
    }), google.maps.event.addDomListener(document, "keydown", function(e) {
        if (cDraggingLabel) {
            if (e.keyCode === 27) {
                cRaiseEnabled = false;
                me.marker_.setPosition(cStartPosition);
                me.marker_.getMap().setCenter(cStartCenter);
                google.maps.event.trigger(document, "mouseup", e);
            }
        }
    }), google.maps.event.addDomListener(this.eventDiv_, "click", function(e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
            if (cIgnoreClick) {
                cIgnoreClick = false;
            } else {
                google.maps.event.trigger(me.marker_, "click", e);
                cAbortEvent(e);
            }
        }
    }), google.maps.event.addDomListener(this.eventDiv_, "dblclick", function(e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
            google.maps.event.trigger(me.marker_, "dblclick", e);
            cAbortEvent(e);
        }
    }), google.maps.event.addListener(this.marker_, "dragstart", function(mEvent) {
        if (!cDraggingLabel) {
            cRaiseEnabled = this.get("raiseOnDrag");
        }
    }), google.maps.event.addListener(this.marker_, "drag", function(mEvent) {
        if (!cDraggingLabel) {
            if (cRaiseEnabled) {
                me.setPosition(cRaiseOffset);
                me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
            }
        }
    }), google.maps.event.addListener(this.marker_, "dragend", function(mEvent) {
        if (!cDraggingLabel) {
            if (cRaiseEnabled) {
                me.setPosition(0);
            }
        }
    }), google.maps.event.addListener(this.marker_, "position_changed", function() {
        me.setPosition();
    }), google.maps.event.addListener(this.marker_, "zindex_changed", function() {
        me.setZIndex();
    }), google.maps.event.addListener(this.marker_, "visible_changed", function() {
        me.setVisible();
    }), google.maps.event.addListener(this.marker_, "labelvisible_changed", function() {
        me.setVisible();
    }), google.maps.event.addListener(this.marker_, "title_changed", function() {
        me.setTitle();
    }), google.maps.event.addListener(this.marker_, "labelcontent_changed", function() {
        me.setContent();
    }), google.maps.event.addListener(this.marker_, "labelanchor_changed", function() {
        me.setAnchor();
    }), google.maps.event.addListener(this.marker_, "labelclass_changed", function() {
        me.setStyles();
    }), google.maps.event.addListener(this.marker_, "labelstyle_changed", function() {
        me.setStyles();
    })];
};
MarkerLabel_.prototype.onRemove = function() {
    var i;
    this.labelDiv_.parentNode.removeChild(this.labelDiv_);
    this.eventDiv_.parentNode.removeChild(this.eventDiv_);
    for (i = 0; i < this.listeners_.length; i++) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};
MarkerLabel_.prototype.draw = function() {
    this.setContent();
    this.setTitle();
    this.setStyles();
};
MarkerLabel_.prototype.setContent = function() {
    var content = this.marker_.get("labelContent");
    if (typeof content.nodeType === "undefined") {
        this.labelDiv_.innerHTML = content;
        this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
    } else {
        this.labelDiv_.innerHTML = "";
        this.labelDiv_.appendChild(content);
        content = content.cloneNode(true);
        this.eventDiv_.appendChild(content);
    }
};
MarkerLabel_.prototype.setTitle = function() {
    this.eventDiv_.title = this.marker_.getTitle() || "";
};
MarkerLabel_.prototype.setStyles = function() {
    var i, labelStyle;
    this.labelDiv_.className = this.marker_.get("labelClass");
    this.eventDiv_.className = this.labelDiv_.className;
    this.labelDiv_.style.cssText = "";
    this.eventDiv_.style.cssText = "";
    labelStyle = this.marker_.get("labelStyle");
    for (i in labelStyle) {
        if (labelStyle.hasOwnProperty(i)) {
            this.labelDiv_.style[i] = labelStyle[i];
            this.eventDiv_.style[i] = labelStyle[i];
        }
    }
    this.setMandatoryStyles();
};
MarkerLabel_.prototype.setMandatoryStyles = function() {
    this.labelDiv_.style.position = "absolute";
    this.labelDiv_.style.overflow = "hidden";
    if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
        this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
        this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
    }
    this.eventDiv_.style.position = this.labelDiv_.style.position;
    this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
    this.eventDiv_.style.opacity = 0.01;
    this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
    this.eventDiv_.style.filter = "alpha(opacity=1)";
    this.setAnchor();
    this.setPosition();
    this.setVisible();
};
MarkerLabel_.prototype.setAnchor = function() {
    var anchor = this.marker_.get("labelAnchor");
    this.labelDiv_.style.marginLeft = -anchor.x + "px";
    this.labelDiv_.style.marginTop = -anchor.y + "px";
    this.eventDiv_.style.marginLeft = -anchor.x + "px";
    this.eventDiv_.style.marginTop = -anchor.y + "px";
};
MarkerLabel_.prototype.setPosition = function(yOffset) {
    var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
    if (typeof yOffset === "undefined") {
        yOffset = 0;
    }
    this.labelDiv_.style.left = Math.round(position.x) + "px";
    this.labelDiv_.style.top = Math.round(position.y - yOffset) + "px";
    this.eventDiv_.style.left = this.labelDiv_.style.left;
    this.eventDiv_.style.top = this.labelDiv_.style.top;
    this.setZIndex();
};
MarkerLabel_.prototype.setZIndex = function() {
    var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
    if (typeof this.marker_.getZIndex() === "undefined") {
        this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
        this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
    } else {
        this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
        this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
    }
};
MarkerLabel_.prototype.setVisible = function() {
    if (this.marker_.get("labelVisible")) {
        this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
    } else {
        this.labelDiv_.style.display = "none";
    }
    this.eventDiv_.style.display = this.labelDiv_.style.display;
};

function MarkerWithLabel(opt_options) {
    opt_options = opt_options || {};
    opt_options.labelContent = opt_options.labelContent || "";
    opt_options.labelAnchor = opt_options.labelAnchor || new google.maps.Point(0, 0);
    opt_options.labelClass = opt_options.labelClass || "markerLabels";
    opt_options.labelStyle = opt_options.labelStyle || {};
    opt_options.labelInBackground = opt_options.labelInBackground || false;
    if (typeof opt_options.labelVisible === "undefined") {
        opt_options.labelVisible = true;
    }
    if (typeof opt_options.raiseOnDrag === "undefined") {
        opt_options.raiseOnDrag = true;
    }
    if (typeof opt_options.clickable === "undefined") {
        opt_options.clickable = true;
    }
    if (typeof opt_options.draggable === "undefined") {
        opt_options.draggable = false;
    }
    if (typeof opt_options.optimized === "undefined") {
        opt_options.optimized = false;
    }
    opt_options.crossImage = opt_options.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
    opt_options.handCursor = opt_options.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
    opt_options.optimized = false;
    this.label = new MarkerLabel_(this, opt_options.crossImage, opt_options.handCursor);
    google.maps.Marker.apply(this, arguments);
}
inherits(MarkerWithLabel, google.maps.Marker);
MarkerWithLabel.prototype.setMap = function(theMap) {
    google.maps.Marker.prototype.setMap.apply(this, arguments);
    this.label.setMap(theMap);
};
(function(k) {
    function u(b, c) {
        var a = b.getLazyScrollLoadingViewport(),
            f = a.getScrollBindTarget(),
            d = !1,
            m = null;
        f.bind("scroll." + e, function(a) {
            0 >= c.delay ? p(a, b, c) : d || (d = !0, null != m && clearTimeout(m), m = setTimeout(function() {
                p(a, b, c);
                clearTimeout(m);
                d = !1
            }, c.delay))
        });
        (0 >= a.getScrollTop() && 0 >= a.getScrollLeft() || q && 9 > v) && f.trigger("scroll." + e)
    }

    function p(b, c, a) {
        var f = c.getLazyScrollLoadingCachedLazyItems(),
            d = [],
            m = [],
            g = [];
        if (null != a.lazyItemSelector && ((a.isDefaultLazyImageMode || null != a.onLazyItemFirstVisible || null != a.onLazyItemVisible || null != a.onLazyItemInvisible) && f.each(function() {
                var a = k(this);
                a.isLazyScrollLoadingLazyItemVisible(c) ? (a.data("isLoading." + e, !0), d.push(this), a.isLazyScrollLoadingLazyItemLoaded() || (a.data("isLoaded." + e, !0), m.push(this))) : a.isLazyScrollLoadingLazyItemLoading() && (a.removeData("isLoading." + e), g.push(this))
            }), a.isDefaultLazyImageMode))
            for (var h = 0, l = m.length; h < l; h++) {
                var r = m[h];
                r.src = r.getAttribute(s)
            }
        w(b, c, a, f, d, m, g)
    }

    function w(b, c, a, f, d, m, g) {
        var h = c[0];
        null != a.onScroll && a.onScroll.apply(h, [b]);
        if (null != a.onScrollVertically || null != a.onScrollUp || null != a.onScrollDown || null != a.onScrollToTop || null != a.onScrollToBottom || null != a.onScrollHorizontally || null != a.onScrollLeft || null != a.onScrollRight || null != a.onScrollToLeftmost || null != a.onScrollToRightmost) {
            var l = c.getLazyScrollLoadingViewport(),
                k = l.getScrollTop(),
                p = l.getScrollLeft(),
                q = {
                    scrollTop: k,
                    scrollLeft: p
                },
                n = [b, f];
            l.isVerticalScrollBarScrolling() && (null != a.onScrollVertically && a.onScrollVertically.apply(h, n), null != a.onScrollUp && l.isScrollUp() && a.onScrollUp.apply(h, n), null != a.onScrollDown && l.isScrollDown() && a.onScrollDown.apply(h, n), null != a.onScrollToTop && l.isScrollToTop() && a.onScrollToTop.apply(h, n), null != a.onScrollToBottom && l.isScrollToBottom() && a.onScrollToBottom.apply(h, n));
            l.isHorizontalScrollBarScrolling() && (null != a.onScrollHorizontally && a.onScrollHorizontally.apply(h, n), null != a.onScrollLeft && l.isScrollLeft() && a.onScrollLeft.apply(h, n), null != a.onScrollRight && l.isScrollRight() && a.onScrollRight.apply(h, n), null != a.onScrollToLeftmost && l.isScrollToLeftmost() && a.onScrollToLeftmost.apply(h, n), null != a.onScrollToRightmost && l.isScrollToRightmost() && a.onScrollToRightmost.apply(h, n));
            c.scrollTop(k);
            c.scrollLeft(p);
            c.data("scrollHistory." + e, q)
        }
        null != a.onLazyItemFirstVisible && 0 < m.length && a.onLazyItemFirstVisible.apply(h, [b, f, c.pushStack(m)]);
        null != a.onLazyItemVisible && 0 < d.length && a.onLazyItemVisible.apply(h, [b, f, c.pushStack(d)]);
        null != a.onLazyItemInvisible && 0 < g.length && a.onLazyItemInvisible.apply(h, [b, f, c.pushStack(g)])
    }
    var e = "LazyScrollLoading",
        s = "lazy-img",
        x = {
            isDefaultLazyImageMode: !1,
            lazyItemSelector: null,
            delay: 500,
            onCreate: null,
            onScroll: null,
            onLazyItemFirstVisible: null,
            onLazyItemVisible: null,
            onLazyItemInvisible: null,
            onScrollVertically: null,
            onScrollHorizontally: null,
            onScrollUp: null,
            onScrollDown: null,
            onScrollLeft: null,
            onScrollRight: null,
            onScrollToTop: null,
            onScrollToBottom: null,
            onScrollToLeftmost: null,
            onScrollToRightmost: null
        },
        t = navigator.userAgent.toLowerCase(),
        q = /msie/.test(t),
        v = q ? parseFloat((t.match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1]) : -1;
    k.extend(k.fn, {
        lazyScrollLoading: function(b) {
            b = k.extend({}, x, b);
            b.isDefaultLazyImageMode && null == b.lazyItemSelector && (b.lazyItemSelector = "img[" + s + "]:not([src])");
            return this.each(function() {
                var c = k(this);
                c.destroyLazyScrollLoading();
                c.data("options." + e, b);
                u(c, b);
                null != b.onCreate && b.onCreate.apply(c[0])
            })
        },
        getLazyScrollLoadingOptions: function() {
            return this.data("options." + e)
        },
        getLazyScrollLoadingScrollHistory: function() {
            return this.data("scrollHistory." + e)
        },
        clearLazyScrollLoadingScrollHistory: function() {
            return this.removeData("scrollHistory." +
            e)
        },
        getLazyScrollLoadingViewport: function() {
            var b = this,
                c = b[0],
                a = c == window || c == document || c == document.body,
                f = k(window),
                d = k(document),
                e = k(document.body),
                g = b.getLazyScrollLoadingScrollHistory();
            return {
                getOffset: function() {
                    return a ? e.offset() : b.offset()
                },
                getScrollLeft: function() {
                    return (a ? f : b).scrollLeft()
                },
                getScrollTop: function() {
                    return (a ? f : b).scrollTop()
                },
                getScrollBindTarget: function() {
                    return a ? d : b
                },
                getWidth: function(c) {
                    return a ? f.width() : c ? b.outerWidth() : b.innerWidth()
                },
                getHeight: function(c) {
                    return a ? f.height() : c ? b.outerHeight() : b.innerHeight()
                },
                getScrollWidth: function() {
                    return a ? d.width() : c.scrollWidth
                },
                getScrollHeight: function() {
                    return a ? d.height() : c.scrollHeight
                },
                getLeftPos: function() {
                    return a ? this.getScrollLeft() : this.getOffset().left
                },
                getTopPos: function() {
                    return a ? this.getScrollTop() : this.getOffset().top
                },
                getRightPos: function() {
                    return this.getLeftPos() + this.getWidth(!0)
                },
                getBottomPos: function() {
                    return this.getTopPos() + this.getHeight(!0)
                },
                isVerticalScrollBarVisible: function() {
                    return this.getHeight(!1) < this.getScrollHeight()
                },
                isHorizontalScrollBarVisible: function() {
                    return this.getWidth(!1) < this.getScrollWidth()
                },
                isVerticalScrollBarScrolling: function() {
                    return this.isVerticalScrollBarVisible() ? !g || g.scrollTop != this.getScrollTop() : !1
                },
                isHorizontalScrollBarScrolling: function() {
                    return this.isHorizontalScrollBarVisible() ? !g || g.scrollLeft != this.getScrollLeft() : !1
                },
                isScrollUp: function() {
                    return this.isVerticalScrollBarVisible() ? !g || g.scrollTop > this.getScrollTop() : !1
                },
                isScrollDown: function() {
                    return this.isVerticalScrollBarVisible() ? !g || g.scrollTop < this.getScrollTop() : !1
                },
                isScrollLeft: function() {
                    return this.isHorizontalScrollBarVisible() ? !g || g.scrollLeft > this.getScrollLeft() : !1
                },
                isScrollRight: function() {
                    return this.isHorizontalScrollBarVisible() ? !g || g.scrollLeft < this.getScrollLeft() : !1
                },
                isScrollToTop: function() {
                    return this.isVerticalScrollBarVisible() ? 0 >= this.getScrollTop() : !1
                },
                isScrollToBottom: function() {
                    return this.isVerticalScrollBarVisible() ? this.getScrollTop() >= this.getScrollHeight() - this.getHeight(!1) : !1
                },
                isScrollToLeftmost: function() {
                    return this.isHorizontalScrollBarVisible() ? 0 >= this.getScrollLeft() : !1
                },
                isScrollToRightmost: function() {
                    return this.isHorizontalScrollBarVisible() ? this.getScrollLeft() >= this.getScrollWidth() - this.getWidth(!1) : !1
                }
            }
        },
        getLazyScrollLoadingCachedLazyItems: function(b) {
            return this.pushStack(k.map(this, function(c) {
                var a = k(c),
                    f = a.getLazyScrollLoadingOptions(),
                    d = a.data("items." + e);
                null != f && null != f.lazyItemSelector && null == d && (d = k(f.lazyItemSelector, c == window || c == document || c == document.body ? void 0 : a), a.data("items." + e, d));
                null != d && null != b && (d = d.filter(b));
                return null != d ? d.get() : null
            }))
        },
        clearLazyScrollLoadingCachedLazyItems: function() {
            return this.removeData("items." + e)
        },
        destroyLazyScrollLoading: function() {
            return this.each(function() {
                var b = k(this);
                b.getLazyScrollLoadingViewport().getScrollBindTarget().unbind("scroll." + e);
                b.getLazyScrollLoadingCachedLazyItems().removeData("isLoaded." + e);
                b.clearLazyScrollLoadingCachedLazyItems().clearLazyScrollLoadingScrollHistory().removeData("options." + e)
            })
        },
        isLazyScrollLoadingLazyItemLoaded: function() {
            return this.data("isLoaded." +
            e)
        },
        isLazyScrollLoadingLazyItemLoading: function() {
            return this.data("isLoading." + e)
        },
        isLazyScrollLoadingLazyItemVisible: function(b) {
            var c = this.getLazyScrollLoadingViewport();
            b = b.getLazyScrollLoadingViewport();
            return c.getBottomPos() > b.getTopPos() && c.getLeftPos() < b.getRightPos() && c.getTopPos() < b.getBottomPos() && c.getRightPos() > b.getLeftPos()
        }
    })
})(jQuery);
var requests = [];
(function(H, $, GM) {
    H.registerHelper('carouselimages', function (spacedata) {
        var space_id = spacedata.id;
        var elements = [];
        var image_url, div_string;
        if (spacedata.images.length > 0) {
            for (var i = 0; i < spacedata.images.length; i++) {
                //var image_id = spacedata.images[i].id;
                //image_id = spacedata.images[i].url
                //image_url = "background:url(space/" + space_id + '/' + image_ + "/thumb/constrain/picture.jpg)";
                /***where set background image***/
                var newUrl = spacedata.images[i].url;
                var indexWWW = src.indexOf('/www/');
                var newSrc = src.substr(indexWWW+5);
                var image_url = "background:url(" + newSrc+")";
                div_string = "<div class='carousel-inner-image item'><div class='carousel-inner-image-inner' style='" + image_url + "'>&nbsp;</div></div>";
                elements.push(div_string);
            }
        } else {
            /*BC_change*/

            div_string = "<div class='carousel-inner-image item'><div class='carousel-inner-image-inner space-detail-no-image' style='background-size: 500px'>&nbsp;</div></div>";
            elements.push(div_string);
            /*var image_url_stuff = "thisBrendan='dumb'"
            var div_string_2 = "<div class='carousel-inner-image item'><div class='carousel-inner-image-inner ' style=" + image_url_stuff + ">&nbsp;</div></div>";
            */
        }
        return new H.SafeString(elements.join('\n'));
    });
    H.registerHelper('compare', function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        var operator = options.hash.operator || "==";
        var operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };
        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        var result = operators[operator](lvalue, rvalue);
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    H.registerHelper('addition', function (lvalue, rvalue) {
        if (arguments.length < 2)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        return new H.SafeString(Number(lvalue) + Number(rvalue));
    });
    H.registerHelper('formatHours', function (hours) {
        var formatted = {};
        $.each(hours, function (day) {
            if (hours[day].length > 0) {
                $.each(hours[day], function () {
                    this[0] = this[0].replace(/^0+/, '');
                    this[1] = this[1].replace(/^0+/, '');
                });
                var dayMarker = day.charAt(0).toUpperCase();
                if (dayMarker == 'T' && day.charAt(1) == 'h' || dayMarker == 'S' && day.charAt(1) == 'a' || dayMarker == 'S' && day.charAt(1) == 'u') {
                    dayMarker += day.charAt(1);
                }
                formatted[dayMarker] = to12Hour(hours[day]).join(", ");
            }
        });
        formatted = _sortDays(formatted);
        formatted = _groupHours(formatted);
        return new H.SafeString(formatted.join("<br/>"));
    });
    H.registerHelper('alphaOptGroupsHTML', function (list) {
        var isMobile = null;
        list.sort();
        var firstletter = null;
        var out = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][0] == firstletter) {
                out.push('<option value="' + list[i] + '">' + list[i] + '</option>');
            } else {
                if (firstletter !== null || !isMobile) {
                    out.push('</optgroup>');
                }
                firstletter = list[i][0];
                if (!isMobile) {
                    out.push('<optgroup label="' + firstletter + '">');
                }
                out.push('<option value="' + list[i] + '">' + list[i] + '</option>');
            }
        }
        if (!isMobile) {
            out.push('</optgroup>');
        }
        return new H.SafeString(out.join(''));
    });

    function _groupHours(days) {
        var hours_info = [];
        var day2IntMap = {
            M: 0,
            T: 1,
            W: 2,
            Th: 3,
            F: 4,
            Sa: 5,
            Su: 6
        };
        for (var i = 0; i < days.length; i++) {
            var split = days[i].split(": ");
            var day = split[0];
            var day_hours = split[1].split(", ");
            for (var j = 0; j < day_hours.length; j++) {
                var hour_range = day_hours[j];
                hours_info.push({
                    day: day,
                    day_idx: day2IntMap[day],
                    hour_range: hour_range
                });
            }
        }
        for (var i = 0; i < hours_info.length; i++) {
            var info = hours_info[i];
            if (!info) {
                continue;
            }
            var range = info.hour_range.split(" - ");
            if (range[1] == "Midnight") {
                for (var j = i + 1;
                     (j - i) < hours_info.length; j++) {
                    var next_info = hours_info[j % hours_info.length];
                    if (!next_info) {
                        continue;
                    }
                    if (next_info.day_idx == info.day_idx) {
                        continue;
                    }
                    var next_range = next_info.hour_range.split(" - ");
                    var is_next_day = (info.day_idx + 1) % 7 == next_info.day_idx;
                    if (!is_next_day) {
                        break;
                    } else if (next_range[0] == "Midnight") {
                        range[1] = next_range[1];
                        hours_info[j % hours_info.length] = null;
                        break;
                    }
                }
                info.hour_range = range.join(" - ");
            }
        }
        for (var i = 0; i < hours_info.length; i++) {
            var info = hours_info[i];
            if (!info) {
                continue;
            }
            for (var j = i + 1; j < hours_info.length; j++) {
                var next_info = hours_info[j];
                if (!next_info) {
                    continue;
                }
                if (info.hour_range == next_info.hour_range) {
                    info.day += ", " + next_info.day;
                    hours_info[j] = null;
                }
            }
        }
        var result = [];
        for (var i = 0; i < hours_info.length; i++) {
            var info = hours_info[i];
            if (!info) {
                continue;
            }
            result.push(info.day + ": " + info.hour_range);
        }
        return result;
    }

    function _sortDays(days) {
        var ordered = [];
        var order = ["M", "T", "W", "Th", "F", "Sa", "Su"];
        $.each(order, function (day) {
            if (days[order[day]]) {
                ordered.push(order[day] + ": " + days[order[day]]);
            }
        });
        return ordered;
    }

    function to12Hour(day) {
        var retData = [];
        for (var j = 0; j < day.length; j++) {
            var data = [day[j][0], day[j][1]];
            for (var i = 0; i < data.length; i++) {
                var time = data[i].split(":");
                if (time[0] == "23" && time[1] == "59") {
                    data[i] = "Midnight";
                } else if (time[0] == "12" && time[1] == "00") {
                    data[i] = "Noon";
                } else {
                    if (time[0] > 12) {
                        time[0] -= 12;
                        time[1] += "PM";
                    } else if (time[0] < 1) {
                        time[0] = 12;
                        time[1] += "AM";
                    } else {
                        time[1] += "AM";
                    }
                    if (time[1] == "00AM") {
                        data[i] = time[0];
                        data[i] += "AM";
                    } else if (time[1] == "00PM") {
                        data[i] = time[0];
                        data[i] += "PM";
                    } else {
                        data[i] = time.join(":");
                    }
                }
                if (data[i] == "12AM") {
                    data[i] = "Midnight";
                }
            }
            if (data[0] == "Midnight" && data[1] == "Midnight") {
                retData[j] = "Open 24 Hours";
            } else {
                retData[j] = data.join(" - ");
            }
        }
        return retData;
    }

    window.to12Hour = to12Hour;

    function default_open_at_filter() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        if (min < 16) {
            min = "00";
        } else if (min < 46) {
            min = "30";
        } else {
            min = "00";
            hour++;
        }
        if (hour > 11) {
            $("#ampm-from").val("PM");
            $("#ampm-until").val("PM");
        } else {
            $("#ampm-from").val("AM");
            $("#ampm-until").val("AM");
        }
        if (hour > 12) {
            hour = hour - 12;
        }
        hour = "" + hour + ":" + min;
        $("#day-from").val(weekday_from_day(date.getDay()));
        $("#hour-from").val(hour);
        $("#day-until").val(weekday_from_day(date.getDay()));
        $("#hour-until").val(hour);
    }

    window.default_open_at_filter = default_open_at_filter;

    function weekday_from_day(day) {
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return (day >= 0 && day <= 6) ? weekdays[day] : '';
    }

    window.weekday_from_day = weekday_from_day;

    function _preloadImages(arrayOfImages) {
        for (var i = 0; i < arrayOfImages.length; i++) {
            $('<img/>')[0].src = arrayOfImages[i];
        }
    }

    $(document).ready(function () {
        if ($.cookie('default_location')) {
            $('#location_select').val($.cookie('default_location'));
        }


        //default locatoins for SMU
        /*var SMU_latitude = "32.8441";
         var SMU_longitude = "-96.7849";
         var SMU_location = "dallas";
         var SMU_zoom = "15";

         window.default_latitude = SMU_latitude;
         window.default_longitude = SMU_longitude;
         window.default_location = SMU_location;
         window.default_zoom = SMU_zoom;*/

        $('#location_select').change(function () {
            var loc_info = $(this).val().split(',');
            window.default_latitude = loc_info[0];
            window.default_longitude = loc_info[1];
            window.default_location = loc_info[2];
            window.default_zoom = loc_info[3];
            if (window.spacescout_map !== null) {
                window.spacescout_map.setCenter(new GM.LatLng(window.default_latitude, window.default_longitude));
                window.spacescout_map.setZoom(parseInt(window.default_zoom));
            }
            clear_filter();
            run_custom_search();
            window.update_count = true;
            _getLocationBuildings();
            $.cookie('default_location', $(this).val(), {

                path: '/'
            });
            //window.spacescout_url.push();
            reset_location_filter();
        });
        $('#center_all').on('click', function (e) {
            e.preventDefault();
            if (window.spacescout_map.getZoom() != window.default_zoom) {
                window.spacescout_map.setZoom(parseInt(window.default_zoom));
            }
            window.spacescout_map.setCenter(new GM.LatLng(window.default_latitude, window.default_longitude));
        });
        _getLocationBuildings();
        $('.checkbox input:checkbox').click(function () {
            var $parent = $(this).parent();
            if (this.checked) {
                $parent.addClass("selected");
            } else {
                $parent.removeClass("selected");
            }
        });
        $('#filter_hours input:radio').change(function () {
            var $parent = $(this).parent();
            $parent.addClass("selected");
            $parent.siblings().removeClass("selected");
            if ($('#hours_list_input').is(':checked')) {
                $('#hours_list_container').show();
            } else {
                $('#hours_list_container').hide();
            }
        });
        $('#filter_location input:radio').change(function () {
            var $parent = $(this).parent();
            $parent.addClass("selected");
            $parent.siblings().removeClass("selected");
            if ($('#building_list_input').is(':checked')) {
                $('#building_list_container').show();
            } else {
                $('#building_list_container').hide();
            }
        });
        var escape_key_code = 27;

        function closeFilter() {
            $('#filter_block').slideUp(400, function () {
                var icon = $('.fa-angle-double-up');
                if (icon.length) {
                    icon.switchClass('fa-angle-double-up', 'fa-angle-double-down', 0);
                }
                if ($('#container').attr("style")) {
                    $('#container').height('auto');
                    $('#container').css('overflow', 'visible');
                }
            });
            $('#filter_button').focus();
        }

        $(document).keyup(function (e) {
            if (e.keyCode == escape_key_code) {
                if ($('#filter_block').is(':visible')) {
                    closeFilter();
                } else if ($('.space-detail').is(':visible')) {
                    closeSpaceDetails();
                }
            }
        });
        $("#view_results_button").click(function () {
            run_custom_search();
            $.cookie('initial_load', false, {
                expires: 1
            });
            //window.spacescout_url.push();
            $('#filter_button').focus();
        });
        default_open_at_filter();
    });

    function initializeCarousel() {
        $('.carousel').each(function () {
            var $this = $(this);
            $this.carousel({
                interval: false
            })
            var html = '<div class="carousel-nav" data-target="' + $this.attr('id') + '"><ul>';
            /***********Brendan Change**********/
            for (var i = 0; i < $this.find('.item').size(); i++) {
                html += '<li><a';
                if (i === 0) {
                    html += ' class="active"';
                }
                html += ' href="#">•</a></li>';
            }
            html += '</ul></li>';
            $this.before(html);
            $this.find(".item:first-child").addClass("active");
            if ($this.find('.item').length == 1) {
                $this.find('.carousel-control').hide();
                $this.prev().hide();
            }
        }).bind('slid', function (e) {
            var $nav = $('.carousel-nav[data-target="' + $(this).attr('id') + '"] ul');
            var index = $(this).find('.item.active').index();
            var item = $nav.find('li').get(index);
            $nav.find('li a.active').removeClass('active');
            $(item).find('a').addClass('active');
        });
        $('.carousel-nav a').bind('click', function (e) {
            var index = $(this).parent().index();
            var $carousel = $('#' + $(this).closest('.carousel-nav').data('target'));
            $carousel.carousel(index);
            e.preventDefault();
        });
        resizeCarouselMapContainer();
    }

    window.initializeCarousel = initializeCarousel;

    function initMapCarouselButtons() {
        $('.space-image-map-buttons button').on('click', function (e) {
            var $target = $(this),
                active = $target.hasClass('active'),
                $container = $target.closest('.space-detail'),
                coords;
            if (!active) {
                if ($target.attr('id') == 'carouselControl') {
                    $('#spaceCarouselContainer', $container).show();
                    $('#spaceMap', $container).hide();
                    $('#carouselControl.btn', $container).attr("tabindex", -1).attr("aria-selected", true);
                    $('#mapControl.btn', $container).attr("tabindex", 0).attr("aria-selected", false);
                } else if ($target.attr('id') == 'mapControl') {
                    $('#spaceCarouselContainer', $container).hide();
                    $('#spaceMap', $container).show();
                    $('#carouselControl.btn', $container).attr("tabindex", 0).attr("aria-selected", false);
                    $('#mapControl.btn', $container).attr("tabindex", -1).attr("aria-selected", true);
                    coords = $target.data('location');
                    _getSpaceMap($container, coords[0], coords[1]);
                }
            }
        });
    }

    window.initMapCarouselButtons = initMapCarouselButtons;

    function resizeCarouselMapContainer() {
        var containerW;
        if ($('.image-container').width() > $('.map-container').width()) {
            containerW = $('.image-container').width();
        } else if ($('.map-container').width() > $('.image-container').width()) {
            containerW = $('.map-container').width();
        }
        var containerH = containerW / 1.5;
        $('.carousel').height(containerH);
        $('.carousel-inner-image').height(containerH);
        $('.carousel-inner-image-inner').height(containerH);
        $('.map-container').height(containerH - 400);
        /* Brendan_Change*/
        /*alert('inside resize Carousel Container');       *******BC_alert********/
    }

    window.resizeCarouselMapContainer = resizeCarouselMapContainer;

    function _getSpaceMap(container, lat, lon) {
        if (window.space_latitude) {
            lat = window.space_latitude;
        }
        if (window.space_longitude) {
            lon = window.space_longitude;
        }
        var mapOptions = {
            zoom: 17,
            center: new GM.LatLng(lat, lon),
            mapTypeId: GM.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        };
        var map = new GM.Map($('#spaceMap', container).get(0), mapOptions);
        var image = static_url('img/pins/pin00.png');
        var spaceLatLng = new GM.LatLng(lat, lon);
        var spaceMarker = new GM.Marker({
            position: spaceLatLng,
            map: map,
            icon: image
        });
    }

    function resetFilters() {
        $('input[type=checkbox]').each(function () {
            if ($(this).attr('checked')) {
                $(this).attr('checked', false);
                $(this).parent().removeClass("selected");
            }
        });
        $('#capacity').val('1');
        $('#open_now').prop('checked', true);
        $('#open_now').parent().removeClass("selected");
        $('#hours_list_container').hide();
        $('#hours_list_input').parent().removeClass("selected");
        default_open_at_filter();
        $("#day-until").val("No pref");
        $("#hour-until").val("No pref");
        $("#ampm-until").val("AM");
        reset_location_filter();
    }

    function replaceUrls() {
        var text = $("#ei_reservation_notes").html();
        var patt = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        var url = patt.exec(text);
        if (url !== null) {
            text = text.replace(url, "<a href='" + url + "' target='_blank'>" + url + "</a>");
            $("#ei_reservation_notes").html(text);
        }
    }

    window.replaceUrls = replaceUrls;

    function _getLocationBuildings() {
        console.log('in _getLocationBuildings');
        //just ask for buildings
        var url = 'api/index.php/buildings';
        /*if (window.default_location !== null) {
            url = url + '?campus=' + window.default_location; //Brendan_Change: will add on the locatoins
        }*/

        $.ajax({
            //going and getting the building information
            url: url,
            success: _formatLocationFilter
        });

        var data = ["Florence Hall", "Brendans Hall"];
        var formatFunct = _formatLocationFilter;
        //formatFunct(data);
    }

    window.getLocationBuildings = _getLocationBuildings;

    function _formatLocationFilter(data) {
        //console.log(data.length = 'data.length');

        if (data != '[]') {

            console.log('data = ' + data);
            var data = JSON.parse(data);
            console.log('data after parse = ' + data);
            var classArray = [""];

            //compile an array of the names
            for( var i = 0;i<data.length;i++){
                classArray[i+1] = data[i].buildingName;
            }
            data = classArray;
            console.log('**********building array is **** = '+ data);


            console.log('in _formatLocationFilter');
            //will populate the list of buildings in the filter list
            var source = $('#building_list').html();
            console.log('source = ' + source);
            var template = Handlebars.compile(source);
            if (source) {
                $('#building_list_container').html(template({
                    data: data
                }));
            }
            if ($.cookie('spacescout_search_opts')) {
                var form_opts = JSON.parse($.cookie('spacescout_search_opts'));
                if (form_opts["building_name"]) {
                    $('#e9 option').each(function () {
                        if ($.inArray($(this).val(), form_opts["building_name"]) != -1) {
                            $(this).prop("selected", "selected");
                        }
                    });
                }
            }
            var $node = $(".chzn-select");
            if ($node.length > 0 && $node.chosen) {
                $node.chosen({
                    width: "98%"
                });
            }
            $('#e9.building-location').trigger("liszt:updated");
        }
    }
    window._formatLocationFilter = _formatLocationFilter;

    function closeSpaceDetails() {
        var the_spot_id = $('.space-detail-inner').attr("id");
        the_spot_id = "#" + the_spot_id.replace(/[^0-9]/g, '');
        $('.space-detail').hide("slide", {
            direction: "right"
        }, 400, function() {
            $('.space-detail-container').remove();
        });
        $('#info_items li').removeClass('selected');
        $(the_spot_id).focus();
    }
    window.closeSpaceDetails = closeSpaceDetails;
})(Handlebars, jQuery, google.maps);

function static_url(base) {
    /*return window.spacescout_static_url + base;*/
    return 'https://spacescout.uw.edu/static/612/' + base;  /*Brendan_Change*/
}

function monthname_from_month(month) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (month >= 0 && month < 12) ? months[month] : '';
}

function replaceReservationNotesUrls() {
    $(".ei_reservation_notes").each(function() {
        var text = $(this).html(),
            patt = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
            url = patt.exec(text);
        if (url !== null) {
            text = text.replace(url, "<a href='" + url + "' target='_blank'>" + url + "</a>");
            $(this).html(text);
        }
    });
}
(function() {
    window.spacescout_url = window.spacescout_url || {
        load: function(path) {
            this.dispatch(this.parse_path(path));
        },
        dispatch: function(state) {
            if (!state) {
                state = this.parse_path(window.location.pathname);
            }
            switch (state.local_path) {
                case 'favorites':
                    break;
                case '':
                    if (window.default_location != state.campus || this.encode_current_search() != state.search) {
                        $('#location_select option').each(function(i) {
                            var location = $(this).val().split(',');
                            if (location[2] == state.campus) {
                                window.default_latitude = location[0];
                                window.default_longitude = location[1];
                                window.default_location = location[2];
                                window.default_zoom = parseInt(location[3]);
                                $(this).parent().prop('selectedIndex', i);
                            }
                        });
                        window.spacescout_search_options = this.decode_search_terms(state.search);
                        clear_filter();
                        repopulate_filters(window.spacescout_search_options);
                        run_custom_search();
                    } else if (state.id) {
                        if (window.spacescout_web_mobile) {
                            window.spacescout_web_mobile.show_space_detail(state.id);
                        } else {
                            data_loaded();
                        }
                    } else if ($('.space-detail-container').length) {
                        if (window.spacescout_web_mobile) {
                            window.spacescout_web_mobile.show_main_app();
                        } else {
                            closeSpaceDetails();
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        push: function(id) {
            var url = [''],
                path, campus = window.default_location,
                search = this.encode_current_search();
            url.push(campus);
            if (search && search.length) {
                url.push(search);
            }
            if (id) {
                url.push(id);
            }
            path = url.join('/');
            if (decodeURIComponent(window.location.pathname) != path) {
                history.pushState({
                    campus: campus,
                    search: search,
                    id: id,
                    local_path: ''
                }, '', path);
            }
        },
        replace: function(id) {
            var url = [''],
                campus = window.default_location,
                search = this.encode_current_search();
            url.push(campus);
            if (search && search.length) {
                url.push(search);
            }
            if (id) {
                url.push(id);
            }
            history.replaceState({
                campus: campus,
                search: search,
                id: id
            }, '', url.join('/'));
        },
        space_id: function(url) {
            var o = this.parse_path(url);
            return o ? o.id : null;
        },
        parse_path: function(path) {
            console.log('sent to parse_path = ' + path);
            //alert('inside Parse_path');
            var state = {},
                m = path.match(/^\/([a-zA-Z]+)?(\/([a-z][^/]*))?((\/(\d*))?(\/.*)?)?$/);
            if (m) {/*will set the state.campus according to what selected*/
                $('#location_select option').each(function(i) {
                    var location = $(this).val().split(',');
                    if (location[2] == m[1]) {
                        state.campus = m[1];
                    }
                });
                if (state.campus) {//sets the local path if there is a state.campus selected
                    state.local_path = '';
                } else {
                    state.local_path = m[1];
                    state.campus = null;
                }
                state.search = (m[3] && m[3].length) ? decodeURIComponent(m[3]) : 'cap:1';
                state.id = (m[6] && m[6].length) ? parseInt(m[6]) : undefined;
            }
            return state;
        },
        encode_current_search: function() {
            return this.encode_search_terms(window.spacescout_search_options);
        },
        encode_search_terms: function(opts) {
            var terms = [],
                a, s;
            if (opts) {
                if (opts.hasOwnProperty('type')) {
                    a = [];
                    $.each(opts["type"], function() {
                        a.push(this);
                    });
                    if (a.length) {
                        terms.push('type:' + a.join(','));
                    }
                }
                if (opts["extended_info:reservable"]) {
                    terms.push('reservable');
                }
                if (opts["capacity"]) {
                    terms.push('cap:' + opts["capacity"]);
                }
                if (opts["open_at"]) {
                    terms.push('open:' + opts["open_at"]);
                }
                if (opts["open_until"]) {
                    terms.push('close:' + opts["open_until"]);
                }
                if (opts["building_name"]) {
                    terms.push('bld:' + opts["building_name"]);
                }
                if (opts["extended_info:has_whiteboards"]) {
                    terms.push('rwb');
                }
                if (opts["extended_info:has_outlets"]) {
                    terms.push('rol');
                }
                if (opts["extended_info:has_computers"]) {
                    terms.push('rcp');
                }
                if (opts["extended_info:has_scanner"]) {
                    terms.push('rsc');
                }
                if (opts["extended_info:has_projector"]) {
                    terms.push('rpj');
                }
                if (opts["extended_info:has_printing"]) {
                    terms.push('rpr');
                }
                if (opts["extended_info:has_displays"]) {
                    terms.push('rds');
                }
                if (opts.hasOwnProperty("extended_info:noise_level")) {
                    a = [];
                    $.each(opts["extended_info:noise_level"], function() {
                        a.push(this);
                    });
                    if (a.length) {
                        terms.push('noise:' + a.join(','));
                    }
                }
                if (opts["extended_info:has_natural_light"]) {
                    terms.push('natl');
                }
                if (opts.hasOwnProperty("extended_info:food_nearby")) {
                    a = [];
                    $.each(opts["extended_info:food_nearby"], function() {
                        a.push(this);
                    });
                    if (a.length) {
                        terms.push('food:' + a.join(','));
                    }
                }
            }
            return (terms.length) ? terms.join('|') : null;
        },
        decode_search_terms: function(raw) {
            var opts = {},
                terms = raw ? raw.split('|') : [];
            $.each(terms, function() {
                var m = this.match(/^([^:]+)(:(.*))?$/),
                    v;
                if (!m) return;
                v = m[3];
                switch (m[1]) {
                    case 'type':
                        opts['type'] = [];
                        $.each(v.split(','), function() {
                            opts['type'].push(this);
                        });
                        break;
                    case 'reservable':
                        opts["extended_info:reservable"] = true;
                        break;
                    case 'cap':
                        opts["capacity"] = v ? v : 1;
                        break;
                    case 'open':
                        opts["open_at"] = v;
                        break;
                    case 'close':
                        opts["open_until"] = v;
                        break;
                    case 'bld':
                        opts["building_name"] = [];
                        $.each(v.split(','), function() {
                            opts['building_name'].push(this);
                        });
                        break;
                    case 'rwb':
                        opts["extended_info:has_whiteboards"] = true;
                        break;
                    case 'rol':
                        opts["extended_info:has_outlets"] = true;
                        break;
                    case 'rcp':
                        opts["extended_info:has_computers"] = true;
                        break;
                    case 'rsc':
                        opts["extended_info:has_scanner"] = true;
                        break;
                    case 'rpj':
                        opts["extended_info:has_projector"] = true;
                        break;
                    case 'rpr':
                        opts["extended_info:has_printing"] = true;
                        break;
                    case 'rds':
                        opts["extended_info:has_displays"] = true;
                        break;
                    case 'natl':
                        opts["extended_info:has_natural_light"] = true;
                        break;
                    case 'noise':
                        opts["extended_info:noise_level"] = [];
                        $.each(v.split(','), function() {
                            opts["extended_info:noise_level"].push(this);
                        });
                        break;
                    case 'food':
                        opts["extended_info:food_nearby"] = [];
                        $.each(v.split(','), function() {
                            opts["extended_info:food_nearby"].push(this);
                        });
                        break;
                    default:
                        break;
                }
            });
            return opts;
        }
    };
    $(window).bind('popstate', function(e) {
        if (e.originalEvent.state) {
            window.spacescout_url.dispatch(e.originalEvent.state);
        } else {
            window.spacescout_url.load(window.location.pathname);
        }
    });
    $(document).on('searchResultsLoaded', function(e, data) {
        var state = window.spacescout_url.parse_path(window.location.pathname);
        if (window.location.pathname == '' || window.location.pathname == '/') {
            window.spacescout_url.replace();
        }
        if (state.id) {
            $.event.trigger('loadSpaceDetail', [state.id]);
        }
    });
})(this);
(function(H, $) {
    $(document).ready(function() {
        window.spacescout_favorites.favorites = window.spacescout_favorites_list;
    });
    window.spacescout_favorites = window.spacescout_favorites || {
        k: {
            'favorites_count_container': '.favorites_count_container',
            'favorites_count_template': '#favorites_count',
            'favorites_total_container': '.favorites_total_container',
            'favorites_total_template': '#favorites_total',
            'favorites_card_container': '.favorites_card_container',
            'favorites_card_template': '#favorites_card'
        },
        favorites: window.spacescout_favorites_list,
        update_count: function() {
            var self = this,
                $source = $(self.k.favorites_count_template),
                template;
            if ($source.length) {
                template = H.compile($source.html().trim());
                $(this.k.favorites_count_container).each(function() {
                    $(this).html(template({
                        count: self.favorites ? self.favorites.length : 0
                    }));
                });
            }
            $source = $(self.k.favorites_total_template);
            if ($source.length) {
                template = H.compile($source.html().trim());
                $(this.k.favorites_total_container).each(function() {
                    var total = self.favorites ? self.favorites.length : 0,
                        plural = (total == 1) ? '' : 's';
                    $(this).html(template({
                        total: total,
                        plural: plural
                    }));
                });
            }
        },
        update_search_result: function() {
            var self = this,
                $detail_node = $('div[id^=detail_container_]'),
                detail_id = $detail_node.length ? parseInt($detail_node.prop('id').match(/^detail_container_(\d+)$/)[1]) : null;
            $('#info_items .view-details button .space-detail-fav').each(function() {
                var $node = $(this),
                    id = parseInt($node.parent().prop('id'));
                if (self.is_favorite(id)) {
                    $node.show();
                    if (id == detail_id) {
                        $('.space-detail-fav', $detail_node).removeClass('space-detail-fav-unset').addClass('space-detail-fav-set');
                    }
                } else {
                    $node.hide();
                    if (id == detail_id) {
                        $('.space-detail-fav', $detail_node).removeClass('space-detail-fav-set').addClass('space-detail-fav-unset');
                    }
                }
            });
        },
        update_cards: function() {
            var $container = $(this.k.favorites_card_container),
                campuses = {},
                campus, campus_name, source, template, i, j, n, blank, campus_select, opts;
            var self = this,
                insert_card = function(i, space) {
                    var $spot = $('spot_' + space.id),
                        source = $(self.k.favorites_card_template).html(),
                        template = H.compile(source),
                        type = [],
                        $card;
                    if ($.isArray(space.type)) {
                        $.each(space.type, function() {
                            type.push(gettext(this));
                        });
                    }
                    space.type = type.join(', ');
                    space.extended_info.noise_level = gettext(space.extended_info.noise_level);
                    space.extended_info.food_nearby = gettext(space.extended_info.food_nearby);
                    this.has_reservation_notes = !!this.extended_info.reservation_notes;
                    this.has_notes = (this.extended_info.access_notes || this.has_reservation_notes);
                    this.has_resources = (this.extended_info.has_computers || this.extended_info.has_displays || this.extended_info.has_outlets || this.extended_info.has_printing || this.extended_info.has_projector || this.extended_info.has_scanner || this.extended_info.has_whiteboards);
                    $card = $(template(space));
                    if ($spot.length == 0) {
                        $container.append($card);
                    }
                    $.event.trigger('favoriteCardLoaded', [$card, space]);
                };
            if ($container.length == 1 && $.isArray(this.favorites)) {
                $.each(this.favorites, function() {
                    if (campuses != null) {
                        if (this.extended_info.hasOwnProperty('campus') && this.extended_info.campus.length) {
                            if (campuses.hasOwnProperty(this.extended_info.campus)) {
                                campuses[this.extended_info.campus].push(this);
                            } else {
                                campuses[this.extended_info.campus] = [this];
                            }
                        } else {
                            campuses = null;
                        }
                    }
                });
                blank = H.compile($('#blank_card').html())({
                    back: window.spacescout_referrer
                });
                campus_select = $('#location_select');
                if (campuses && Object.keys(campuses).length > 0 && (Object.keys(campuses).length > 1 || !campuses.hasOwnProperty($('option:selected', campus_select).val().split(',')[2]))) {
                    template = H.compile($('#campus_label').html());
                    opts = $('option', campus_select);
                    i = campus_select.prop('selectedIndex');
                    for (j = 0; j < opts.size(); j += 1) {
                        campus = $(opts[i]).val().split(',')[2];
                        campus_name = opts[i].innerHTML;
                        i = ((i + 1) % opts.size());
                        $container.append(template({
                            campus: campus_name + ' Campus'
                        }));
                        if (campuses.hasOwnProperty(campus)) {
                            $.each(campuses[campus], insert_card);
                        }
                        if (blank) {
                            $container.append(blank);
                            blank = null;
                        }
                    }
                } else {
                    $.each(this.favorites, insert_card);
                    $container.append(blank);
                }
                replaceReservationNotesUrls();
                $.event.trigger('favoritesLoaded', [this.favorites]);
            }
        },
        update_favorites_button: function(id) {
            var fav_button = $('button#favorite_space'),
                fav_icon = $('.space-detail-fav', fav_button),
                fav_icon_i = $('i', fav_icon),
                setFavoritedButton = function(id) {
                    var title = fav_button.attr('title').replace(/ favorite /, ' unfavorite ');
                    fav_icon.removeClass('space-detail-fav-unset').addClass('space-detail-fav-set');
                    fav_icon.parent().find('span:last').text(gettext('favorited'));
                    fav_button.attr('title', title);
                    if (id) {
                        $('button#' + id + ' .space-detail-fav').show();
                    }
                },
                unsetFavoritedButton = function(id) {
                    var title = fav_button.attr('title').replace(/ unfavorite /, ' favorite ');
                    fav_icon.removeClass('space-detail-fav-set').addClass('space-detail-fav-unset');
                    fav_icon.parent().find('span:last').text(gettext('favorite'));
                    fav_button.attr('title', title);
                    if (id) {
                        $('button#' + id + ' .space-detail-fav').hide();
                    }
                };
            if (fav_icon.is(':visible')) {
                var authenticated_user = window.spacescout_authenticated_user.length > 0;
                if (authenticated_user && window.spacescout_favorites.is_favorite(id)) {
                    setFavoritedButton();
                } else {
                    unsetFavoritedButton();
                }
                fav_icon.unbind();
                fav_button.click(function(e) {
                    if (!authenticated_user) {
                        $.cookie('space_set_favorite', JSON.stringify({
                            id: id
                        }));
                        window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
                    }
                    window.spacescout_favorites.toggle(id);
                });
                $(document).on('spaceFavoriteSet', function(e, id) {
                    setFavoritedButton(id);
                });
                $(document).on('spaceFavoriteClear', function(e, id) {
                    unsetFavoritedButton(id);
                });
                if (authenticated_user) {
                    var set_favorite = $.cookie('space_set_favorite'),
                        json_favorite = set_favorite ? JSON.parse(set_favorite) : null;
                    if (json_favorite) {
                        window.spacescout_favorites.set(json_favorite.id);
                    }
                    $.removeCookie('space_set_favorite');
                }
            }
        },
        load: function() {
            var self = this;
            $.ajax({
                url: '/web_api/v1/user/me/favorites',
                success: function(data) {
                    if ($.isArray(data)) {
                        self.favorites = data;
                        self.update();
                    } else {
                        console.log('Unrecognized favorites response: ' + data);
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log('Unable to load favorites: ' + xhr.responseText);
                }
            });
        },
        update: function() {
            this.update_count();
            this.update_search_result();
            this.update_cards();
        },
        is_favorite: function(id) {
            var fav = false;
            if (this.favorites) {
                fav = (this.index(id) >= 0);
            } else {
                $.ajax({
                    url: '/web_api/v1/user/me/favorite/' + id,
                    type: "GET",
                    async: false,
                    success: function(data) {
                        fav = (typeof data === 'boolean') ? data : false;
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Unable to get favorite: ' + xhr.responseText);
                    }
                });
            }
            return fav;
        },
        index: function(id) {
            var i;
            if (this.favorites) {
                for (i = 0; i < this.favorites.length; i += 1) {
                    if (this.favorites[i].id == id) {
                        return i;
                    }
                }
            }
            return -1;
        },
        toggle: function(id) {
            if (this.is_favorite(id)) {
                this.clear(id);
            } else {
                this.set(id);
            }
            this.update_count();
        },
        set: function(id) {
            var self = this;
            if (!this.is_favorite(id)) {
                $.ajax({
                    url: '/web_api/v1/user/me/favorite/' + id,
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify({}),
                    type: "PUT",
                    success: function(data) {
                        var i = 0;
                        if (self.favorites) {
                            for (i = 0; i < self.favorites.length; i++) {
                                if (self.favorites[i].id == id) {
                                    if (on_set) {
                                        on_set.call();
                                        return;
                                    }
                                }
                            }
                            self.favorites.push({
                                id: id,
                                incomplete: true
                            });
                        }
                        self.update_count();
                        $.event.trigger('spaceFavoriteSet', [id]);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Unable to set favorite: ' + xhr.responseText);
                    }
                });
            }
        },
        clear: function(id) {
            var self = this;
            $.ajax({
                url: '/web_api/v1/user/me/favorite/' + id,
                dataType: 'json',
                type: "DELETE",
                success: function(data) {
                    if (self.favorites) {
                        var index = self.index(id);
                        if (index >= 0) {
                            self.favorites.splice(index, 1);
                        }
                    }
                    self.update_count();
                    $.event.trigger('spaceFavoriteClear', [id]);
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log('Unable to unset favorite: ' + xhr.responseText);
                }
            });
        }
    };
    if ($('.favorites_nav').length > 0) {
        $(document).on('favoriteCardLoaded', function(e, card, fav) {
            var now = new Date(),
                hour = now.getHours(),
                minute = now.getMinutes(),
                day = weekday_from_day(now.getDay()).toLowerCase(),
                formatted = 'Closed';
            $('.space-detail-is-closed', card).show();
            loadRatingsAndReviews(fav.id, $('.space-ratings-and-reviews', card), card);
            if (fav.available_hours[day].length > 0) {
                $.each(fav.available_hours[day], function() {
                    var o = this[0].replace(/^0+/, '').split(':'),
                        c = this[1].replace(/^0+/, '').split(':'),
                        o_h = o[0].length ? parseInt(o[0]) : 0,
                        o_m = o[1].length ? parseInt(o[1]) : 0,
                        c_h = c[0].length ? parseInt(c[0]) : 0,
                        c_m = c[1].length ? parseInt(c[1]) : 0;
                    if ((hour > o_h && hour < c_h) || (hour == o_h && minute > o_m) || (hour == c_h && minute < c_m)) {
                        $('.space-detail-is-open', card).show();
                        $('.space-detail-is-closed', card).hide();
                    }
                });
                formatted = to12Hour(fav.available_hours[day]).join(", ");
            }
            $('.space-info-hours-today span', card).html(formatted);
            $('.space-info-more-detail a', card).click(function(e) {
                var $more_div = $(e.target).parent();
                $more_div.slideUp('fast');
                $more_div.next().slideDown('fast');
            });
            $('.space-info-less-detail a', card).click(function(e) {
                var $ul = $(e.target).closest('ul');
                var $reviews = $('.space-reviews-review', ul);
                $ul.slideUp('fast', function() {
                    var top = card.offset().top;
                    var $scrolltop = $(document).scrollTop();
                    if (top < $scrolltop) {
                        $('html,body').animate({
                            scrollTop: top
                        }, 400, 'swing');
                    }
                });
                $ul.prev().slideDown('fast');
                if ($reviews.length > window.spacescout_reviews.pagination) {
                    $reviews.each(function(i) {
                        if (i >= window.spacescout_reviews.pagination) {
                            $(this).hide();
                        }
                    });
                    $('.more-space-reviews', ul).show();
                }
            });
            $('.space-detail-fav', card).click(function(e) {
                window.spacescout_favorites.clear(parseInt($(this).data('id')));
            });
            $(document).on('spaceFavoriteClear', function(e, id) {
                var $container = $('#spot_' + id).closest('.space-detail-container');
                $container.hide({
                    effect: 'fade',
                    duration: 800,
                    complete: function() {
                        $container.remove();
                    }
                });
            });
            var bld_code = fav.location.building_name.match(/.*\(([A-Z ]+)\)( [a-zA-Z]+)?$/);
            if (bld_code) {
                $('.space-detail-building', card).html(bld_code[1] + (bld_code[2] ? bld_code[2] : ''));
            } else {
                $('.space-detail-building', card).html(fav.location.building_name);
            }
            if (fav.hasOwnProperty('images') && fav.images.length > 0) {
                var template = H.compile($('#images_template').html());
                var data = [];
                data.push({
                    id: fav.id,
                    image_id: fav.images[0].id
                });
                $('.carousel-inner', card).html(template({
                    data: data
                }));
            } else {
                var template = H.compile($('#no_images_template').html());
                $('.carousel-inner', card).html(template({
                    static_url: window.spacescout_static_url
                }));
            }
            if (fav.has_reservation_notes) {
                var url = fav.extended_info.reservation_notes.match(/(http:\/\/[^\s]+)/);
                if (url) {
                    var template = H.compile($('#reservation_cue').html());
                    $('.space-info-reservation-cue', card).html(template({
                        url: url[1]
                    })).show();
                }
            }
        });
        $(document).on('favoritesLoaded', function(e, data) {
            var h, d;
            initializeCarousel();
            initMapCarouselButtons();
            $('.share_space').on('click', function(e) {
                e.preventDefault();
                h = $(e.target).prop('href'), window.location.href = h + '?back=' + encodeURIComponent('/favorites' + '?back=' + encodeURIComponent(window.spacescout_referrer) + '#spot_' + h.match(/\d+$/)[0]);
            });
            if (window.location.hash.length > 1) {
                d = $(window.location.hash).offset().top;
                if (d > $(document).height() - $(window).height()) {
                    d = $(document).height() - $(window).height();
                }
                $('html,body').animate({
                    scrollTop: d
                }, 1000, 'swing');
                $(window.location.hash).parent().find('.space-info-more-detail a').click();
            }
            $('.space-detail-fav-button').hover(function() {
                $(this).addClass('space-detail-fav-button-active');
            }, function() {
                $(this).removeClass('space-detail-fav-button-active');
            });
            $('.space-detail-fav-button').focus(function() {
                $(this).addClass('space-detail-fav-button-active');
            });
            $('.space-detail-fav-button').blur(function() {
                $(this).removeClass('space-detail-fav-button-active');
            });
        });
        $('#back_link').click(function(e) {
            e.preventDefault();
            window.history.back();
        });
        window.spacescout_favorites.load();
    }
})(Handlebars, jQuery);
window.spacescout_reviews = {
    review_char_limit: 300,
    pagination: 5
};

function setupRatingsAndReviews(data) {
    $('.space-ratings-and-reviews').html(Handlebars.compile($('#space_reviews').html())());
    if (data && data.length) {
        showRatingEditorButton();
    } /* will show the rating editor if click on right a review*/
    $('.space-ratings-and-reviews .write-a-review.add-a-review').on('click', function(e) {
        showRatingEditor();
    });
    $('.space-review-compose textarea').bind('input', function(e) {
        var text = $(this).val(),
            not_counted = (text.match(/[\x7c\s@\.,\\\/#!?\$%\^&\*;:{}\[\]<>=\-_`'"~()\+]+/g) || []).join("").length,
            remaining = window.spacescout_reviews.review_char_limit - text.length + not_counted,
            span = $('#space-review-remaining');
        $(this).attr("maxlength", window.spacescout_reviews.review_char_limit + not_counted);
        if (remaining > 0) {
            span.html(remaining);
            span.removeClass('required');
        } else {
            span.html(0);
            span.addClass('required');
        }
        var x = $('input[name=star-rating]:checked');
        if (text.trim().length > 0 && $('input[name=star-rating]:checked').length) {
            enableSubmitButton();
        } else {
            disableSubmitButton();
        }
    }); /*function that will allow to type in the review button*/
    $('button#space-review-cancel').click(function(e) {
        $('.space-review-compose').hide(400);
        if ($('.space-reviews-none').length) {
            $('.space-reviews-none').show();
        } else {
            showRatingEditorButton();
        }
        tidyUpRatesComposer();
    });/*will exit the review popup */
    $('button#space-review-submit').click(function(e) {
        var id = $(e.target).closest('div[id^=detail_container_]').attr('id').match(/_(\d+)$/)[1],
            review = {
                review: $('.space-review-compose textarea').val().trim(),
                rating: parseInt($('input[name=star-rating]:checked').val())
            };
        if (!review.rating) {
            return;
        }
        if (window.spacescout_authenticated_user.length == 0) {
            $.cookie('space_review', JSON.stringify({
                id: id,
                review: review
            }));
            window.location.href = '/login?next=' + window.location.pathname;
        }
        postRatingAndReview(id, review);
    });
    $('.space-review-submitted a').click(function(e) {
        $('.space-review-submitted').hide(400);
        if ($('.space-reviews-none').length) {
            $('.space-reviews-none').show();
        } else {
            showRatingEditorButton();
        }
    }); /*will close out the review section once submitted*/
    $("input[name=star-rating]").change(function(e) {
        var target = $(e.target),
            rating = parseInt(target.val()),
            rating_names = [gettext('terrible'), gettext('poor'), gettext('average'), gettext('good'), gettext('excellent')];
        target.closest('ol').find('li input').each(function() {
            var t = $(this);
            if (t.val() > rating) {
                t.next().find('i').switchClass('fa-star', 'fa-star-o');
            } else {
                t.next().find('i').switchClass('fa-star-o', 'fa-star');
            }
        });
        $('.space-review-compose .space-review-rating span').html(rating_names[rating - 1]);
        if ($('.space-review-compose textarea').val().length) {
            enableSubmitButton();
        }
    }); /* manages the input[name=star-rating] and put stars next to them*/
    $('#review_guidelines').on('click', function() {
        if ($(this).next().is(':visible')) {
            hideReviewGuidelines();
        } else {
            showReviewGuidelines();
        }
    }); /*will toggle the review box*/

    $(document).on('loadSpaceReviews', function(e, id) {
        var review = $.cookie('space_review');
        if (review && window.spacescout_authenticated_user.length > 0) {
            var json_review = review ? JSON.parse(review) : null;
            if (json_review && !json_review.invalid && id == json_review.id) {
                postRatingAndReview(json_review.id, json_review.review);
                $('.space-reviews-none').hide();
            }
            $.cookie('space_review', JSON.stringify({
                invalid: true,
                id: 0,
                review: ''
            }));
            $.removeCookie('space_review');
        }
        $('#show_reviews').click(function(e) {
            var node, top;
            if (isMobile) {
                node = $('html, body');
                top = $('.space-ratings-and-reviews').offset().top + $('.space-detail-body').scrollTop();
            } else {
                node = $('.space-detail-body');
                top = $('.space-ratings-and-reviews').offset().top + $('.space-detail-body').scrollTop() - $('.space-detail-body').offset().top;
            }
            e.preventDefault();
            node.animate({
                scrollTop: top
            }, '500');
        });
    });
}

function loadRatingsAndReviews(id, review_container, rating_container) {
    $.ajax({
        url: '/web_api/v1/space/' + id + '/reviews',  /*Brendan_Change*/
        success: function(data) {
            var template = Handlebars.compile($('#space_reviews_review').html()),
                rating_sum = 0,
                total_reviews = (data && data.length) ? data.length : 0,
                html_count = Handlebars.compile($('#space_reviews_count').html())({
                    count: total_reviews
                }),
                node, rating_descriptions = [Handlebars.compile($('#rating_description_one_star').html())({}), Handlebars.compile($('#rating_description_two_star').html())({}), Handlebars.compile($('#rating_description_three_star').html())({}), Handlebars.compile($('#rating_description_four_star').html())({}), Handlebars.compile($('#rating_description_five_star').html())({})];
            review_container.html('');
            $('span#review_count', rating_container).html(html_count);
            if (total_reviews > 0) {
                data.sort(function(a, b) {
                    return new Date(b.date_submitted) - new Date(a.date_submitted);
                });
                $.each(data, function(i) {
                    var review = this,
                        rating = this.rating,
                        date = new Date(this.date_submitted);
                    node = $(template({
                        reviewer: this.reviewer,
                        rating_description: rating_descriptions[rating - 1],
                        review: (this.review && this.review.length) ? this.review : 'No review provided',
                        date: date ? monthname_from_month(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear() : ''
                    }));
                    rating_sum += parseInt(this.rating);
                    $('.space-review-header i', node).each(function(i) {
                        if (i < rating) {
                            $(this).switchClass('fa-star-o', 'fa-star');
                        }
                    });
                    if (i >= window.spacescout_reviews.pagination) {
                        node.hide();
                    }
                    review_container.append(node);
                });
                if (data.length > window.spacescout_reviews.pagination) {
                    node = Handlebars.compile($('#more_space_reviews').html())();
                    review_container.append(node);
                    $('.more-space-reviews a').on('click', function(e) {
                        var container = $(this).closest('.space-ratings-and-reviews'),
                            hidden = $('.space-reviews-review:hidden', container);
                        hidden.each(function(i) {
                            if (i < window.spacescout_reviews.pagination) {
                                $(this).slideDown(400);
                            }
                        });
                        if (hidden.length <= window.spacescout_reviews.pagination) {
                            $(this).parent().hide();
                        }
                    });
                }
                if (rating_sum) {
                    var avg = rating_sum / data.length,
                        dec = Math.floor(avg),
                        frac = Math.floor((avg % 1) * 10),
                        frac_string, number = ['', gettext('one'), gettext('two'), gettext('three'), gettext('four'), gettext('five')],
                        rating_template = Handlebars.compile($('#space_average_rating').html());
                    $('i', rating_container).each(function(i) {
                        if (i < dec) {
                            $(this).switchClass('fa-star-o', 'fa-star');
                        } else if (i == dec && frac > 0) {
                            if (frac > 5) {
                                $(this).switchClass('fa-star-o', 'fa-star');
                            } else {
                                $(this).switchClass('fa-star-o', 'fa-star-half-o');
                            }
                        }
                    });
                    $('#space-average-rating-text', rating_container).html(rating_template({
                        total: data.length,
                        total_plural: (data.length > 1) ? 's' : '',
                        decimal: number[dec],
                        fraction: (frac > 5) ? '' : gettext(' and one half'),
                        star_plural: (dec > 1 || frac <= 5) ? 's' : ''
                    }));
                }
                $('.write-a-review').attr('title', gettext('write_review_for') + $('#space-detail-name span:last-child').text());
                showRatingEditorButton();
            } else if ($('.space-review-compose').length) {
                hideRatingEditorButton();
                review_container.html(Handlebars.compile($('#no_space_reviews').html())());
                $('.write-a-review', review_container).on('click', function(e) {
                    showRatingEditor();
                });
            } else {
                review_container.remove();
            }
            $.event.trigger('loadSpaceReviews', [id]);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('Unable to load reviews: ' + xhr.responseText);
        }
    });
}

function postRatingAndReview(id, review) {
    $.ajax({
        url: '/web_api/v1/space/' + id + '/reviews', /*Brendan_Change*/
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(review),
        type: "POST",
        success: function(data) {
            tidyUpRatesComposer();
            $('.space-review-compose').hide(400);
            $('.space-review-submitted').show(400);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('Unable to post reviews: ' + xhr.responseText);
        }
    });
}

function showRatingEditor() {
    disableSubmitButton();
    hideRatingEditorButton();
    $('#space-review-remaining').html(window.spacescout_reviews.review_char_limit);
    $('.space-reviews-none').hide(400);
    $('.space-review-compose').show(400, function() {
        var w_node = $('.space-detail-body'),
            w_top = w_node.scrollTop(),
            w_height = w_node.height(),
            t_node = $(this),
            t_top = t_node.offset().top - w_node.offset().top,
            t_height = t_node.height(),
            diff = Math.ceil((t_top + t_height) - (w_top + w_height)),
            padding = 20;
        if (diff > 0) {
            w_node.animate({
                scrollTop: (diff + w_top + padding)
            }, '500');
        }
        $('#one-star-link').focus();
    });
}

function tidyUpRatesComposer() {
    var node = $('.space-review-compose');
    disableSubmitButton();
    hideReviewGuidelines();
    $('input[name=star-rating]:checked').prop('checked', false);
    $('input[name=star-rating]').next().find('i').switchClass('fa-star', 'fa-star-o');
    $('textarea', node).val('');
    $('.space-review-rating span', node).html('');
    $('#space-review-remaining').html(window.spacescout_reviews.review_char_limit);
    $('#space-review-remaining').removeClass('required');
    $('.space-review-rating div + div span', node).removeClass('required');
}

function showRatingEditorButton() {
    $('.space-ratings-and-reviews .write-a-review.add-a-review').show();
}

function hideRatingEditorButton() {
    $('.space-ratings-and-reviews .write-a-review.add-a-review').hide();
}

function enableSubmitButton() {
    $('button#space-review-submit').removeAttr('disabled');
}

function disableSubmitButton() {
    $('button#space-review-submit').attr('disabled', 'disabled');
}

function showReviewGuidelines() {
    var link = $('#review_guidelines');
    link.next().show();
    link.attr('title', 'Click to hide review guidelines');
    $('i', link).switchClass('fa-angle-double-down', 'fa-angle-double-up');
}

function hideReviewGuidelines() {
    var link = $('#review_guidelines');
    link.next().hide();
    link.attr('title', 'Click to see review guidelines');
    $('i', link).switchClass('fa-angle-double-up', 'fa-angle-double-down');
};  /*********End of review section*/
var spacescout_map = null,
    spacescout_markers = [],
    speed = 800,
    update_count = null;
(function(H, $, GM) {
    var spacescout_marker_ids = {};
    var youarehere = null;

    function openAllMarkerInfoWindow(data) {
        console.log('inside openAllMarkers');
        var source = $('#all_markers').html(); /*** handlebars template for right side*/
        console.log('data send to buildingNameHeaders = '+ typeof data );
        var template = H.compile(source);
        data = buildingNameHeaders(data);

        console.log('Data returned from buildingNameHeaders = ' + JSON.stringify(data[0]));
        $('#info_items').html(template({

            'data': data
        }));
        $('.loading').slideUp('fast');
        if ($(window.spacescout_favorites.k.favorites_count_container).length == 1) {
            window.spacescout_favorites.load();
            if (window.hasOwnProperty('spacescout_favorites_refresh') && window.spacescout_favorites_refresh) {
                window.clearInterval(window.spacescout_favorites_refresh);
                window.spacescout_favorites_refresh = null;
            }
            window.spacescout_favorites_refresh = window.setInterval(function() {
                window.spacescout_favorites.load();
            }, 10000);
        }
        $(document).ready(function() {
            if ($.cookie('spot_id')) {
                var $spot = $('#' + $.cookie('spot_id'));
                var scroll_spot_id = null;
                if ($spot.parent().prev().prev().children()[1]) {
                    scroll_spot_id = $spot.parent().prev().prev().children()[1].id;
                } else if ($spot.parent().parent().prev().prev()[0]) {
                    if (!$spot.parent().prev()[0] || !$spot.parent().prev().prev()[0]) {
                        scroll_spot_id = $spot.parent().parent().prev().prev().children().children().last()[0].id;
                    }
                }
                if (scroll_spot_id) {
                    document.getElementById(scroll_spot_id).scrollIntoView();
                }
                $spot.click();
                $.removeCookie('spot_id');
            }
            var lazyload_target = '#info_list';
            $(lazyload_target).lazyScrollLoading({
                lazyItemSelector: ".lazyloader",
                onLazyItemFirstVisible: function(e, $lazyItems, $firstVisibleLazyItems) {
                    $firstVisibleLazyItems.each(function() {
                        var $img = $(this);
                        var src = $img.data('src');
                        //src = "/Brendan_url";
                        console.log('hello from src 2');

                        var indexWWW = src.indexOf('/www/');
                        var newSrc = src.substr(indexWWW+5);


                        $img.css('background', 'transparent url("' + newSrc + '") no-repeat 50% 50%');
                        $img.css('background-size','cover');
                    });
                }
            });
        });
    }
    window.openAllMarkerInfoWindow = openAllMarkerInfoWindow;

    function _sortByBuildingName(data) {

        console.log("Data before error type = "+ typeof(data));
        console.log( "Data before error = "+  data);

        data.sort(function(one, two) {
            var abuilding = one.location.building_name.toLowerCase(),
                bbuilding = two.location.building_name.toLowerCase();
            if (abuilding < bbuilding)
                return -1;
            if (abuilding > bbuilding)
                return 1;
            return 0;
        });
        return data;
    }

    function buildingNameHeaders(data) {

        data = _sortByBuildingName(data);
        console.log("data in builidingNameHeaders = "+typeof data);
        var byBuilding = {};
        var nobuilding = 'no building';
        for (var i = 0; i < data.length; i++) {
            var bname = data[i].location.building_name;
            if (bname === null) {
                if (!byBuilding.hasOwnProperty(nobuilding)) {
                    byBuilding[nobuilding] = [data[i]];
                }
                byBuilding[nobuilding].push(data[i]);
            } else {
                if (!byBuilding.hasOwnProperty(bname)) {
                    byBuilding[bname] = [data[i]];
                } else {
                    byBuilding[bname].push(data[i]);
                }
            }
        }
        var result = [];
        for (var bname in byBuilding) {
            if (byBuilding.hasOwnProperty(bname)) {
                result.push({
                    name: bname,
                    spots: byBuilding[bname]
                });
            }
        }
        return result;
    }
    window.buildingNameHeaders = buildingNameHeaders;
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };

    function _lazyLoadSpaceImages() {
        console.log('tried to use laxyLoadSpaceImages');
        if ($('#info_list').hasScrollBar()) {
            $("img.lazy").lazyload({
                container: $("#info_list")
            });
        } else {
            $("img.lazy").lazyload();
        }
    }

    function repopulate_filters(form_opts) {
        console.log('inside repopulate_filters');
        try {
            if (form_opts) {
                if (form_opts.hasOwnProperty('type')) {
                    $.each(form_opts["type"], function() {
                        $('#' + this).prop('checked', true);
                    });
                }
            }
            if (form_opts["extended_info:reservable"]) {
                $('#reservable').prop('checked', true);
            }
            $('#capacity').val(form_opts.capacity);
            if (form_opts.open_at || form_opts.open_until) {
                $('#hours_list_input').prop('checked', true);
                $('#hours_list_container').show();
                var day, time, ampm, open_parts;
                if (form_opts.open_at) {
                    open_parts = form_opts.open_at.split(',');
                    day = open_parts[0];
                    time = open_parts[1].split(':');
                    ampm = 'AM';
                    if (time[0] >= 12) {
                        if (time[0] > 12) {
                            time[0] = time[0] - 12;
                        }
                        ampm = 'PM';
                    }
                    if (time[0] == 0) {
                        time[0] = 12;
                    }
                    $('#day-from').val(day);
                    $('#hour-from').val(time.join(':'));
                    $('#ampm-from').val(ampm);
                }
                if (form_opts.open_until) {
                    open_parts = form_opts.open_until.split(',');
                    day = open_parts[0];
                    time = open_parts[1].split(':');
                    ampm = 'AM';
                    if (time[0] >= 12) {
                        if (time[0] > 12) {
                            time[0] = time[0] - 12;
                        }
                        ampm = 'PM';
                    }
                    $('#day-until').val(day);
                    $('#hour-until').val(time.join(':'));
                    $('#ampm-until').val(ampm);
                }
            }
            if (form_opts.building_name) {
                $('#e9').val(form_opts.building_name).trigger("liszt:updated");
                $('#building_list_input').prop('checked', true);
                $('#building_list_container').show();
            }
            var resources = ['whiteboards', 'outlets', 'computers', 'scanner', 'projector', 'printing', 'displays'];
            for (var i = 0; i < resources.length; i++) {
                var resource = resources[i];
                if (form_opts["extended_info:has_" + resource]) {
                    $('#has_' + resource).prop('checked', true);
                }
            }
            if (form_opts.hasOwnProperty("extended_info:noise_level")) {
                for (var i = 0; i < form_opts["extended_info:noise_level"].length; i++) {
                    $('#' + form_opts["extended_info:noise_level"][i]).prop('checked', true);
                }
            }
            if (form_opts["extended_info:has_natural_light"]) {
                $('#lighting').prop('checked', true);
            }
            if (form_opts.hasOwnProperty("extended_info:food_nearby")) {
                for (var i = 0; i < form_opts["extended_info:food_nearby"].length; i++) {
                    $('#' + form_opts["extended_info:food_nearby"][i]).prop('checked', true);
                }
            }
        } catch (err) {
            console.log('Cannot process filter: ' + err);
        }
    }
    window.repopulate_filters = repopulate_filters;

    function clear_filter() {
        console.log('inside clear_filter');
        $('input[type=checkbox]').each(function() {
            var $this = $(this);
            if ($this.prop('checked')) {
                $this.prop('checked', false);
                $this.parent().removeClass("selected");
            }
        });
        $('#capacity').val('1');
        $('#open_now').prop('checked', true);
        $('#open_now').parent().removeClass("selected");
        $('#hours_list_container').hide();
        $('#hours_list_input').parent().removeClass("selected");
        default_open_at_filter();
        reset_location_filter();
    }
    window.clear_filter = clear_filter;

    function reset_location_filter() {
        console.log('inside reset_location_filter');
        var $node;
        $('#entire_campus').prop('checked', true);
        $('#entire_campus').parent().removeClass("selected");
        $('#building_list_container').hide();
        $('#building_list_input').parent().removeClass("selected");
        $('#building_list_container').children().children().children(".select2-search-choice").remove();
        $('#building_list_container').children().children().children().children().val('Select building(s)');
        $('#building_list_container').children().children().children().children().attr('style', "");
        $node = $('#e9.building-location');
        if ($node.length > 0) {
            $.each($node.children().children(), function() {
                this.selected = false;
            });
            $node.trigger("liszt:updated");
        }
    }
    window.reset_location_filter = reset_location_filter;

    function run_custom_search() { console.log('inside custom search');
        var event_results;
        window.update_count = true;
        for (var i = 0; i < window.spacescout_markers.length; i++) {
            window.spacescout_markers[i].setMap(null);
        }
        window.spacescout_markers = [];
        spacescout_marker_ids = {};
        window.spacescout_search_options = {};
        var set_cookie = false;
        if ($.cookie('spacescout_search_opts')) {
            set_cookie = true;
        }
        /*var checked = [];
        $.each($("input[name='type']:checked"), function() {
            checked.push($(this).val());
        });
        if (checked.length > 0) {
            window.spacescout_search_options.type = checked;
            set_cookie = true;
        }*/ //old
        var checked = [];
        var typeNames = [];
        $.each($("input[name='type']"), function(){
            typeNames.push($(this).val());
        });
        console.log('typeNames = ' + typeNames);
        //typeName = ["study_room","study_area","computer_lab","studio","]
        $.each($("input[name='type']:checked"), function() {
            checked.push($(this).val());
        });
        var typeVals = [];
        if (checked.length > 0) {
            //assemble a json

            var i;
            console.log('checked = '+checked);
            console.log('length of typeName = '+typeNames.length);
            for(i = 0;i<typeNames.length;i++){
                if(checked.indexOf(typeNames[i])>=0){
                    typeVals[i] = 1;

                }else{
                    typeVals[i] = 0;
                }
                /*else{
                 typeVals{i] = 0;
                 }*/
            }
            /*window.spacescout_search_options.type = checked;
             set_cookie = true;*/
        }
        if ($("#reservable").is(":checked")) {
            window.spacescout_search_options["extended_info:reservable"] = "true";
            set_cookie = true;
        }
        window.spacescout_search_options.capacity = $("#capacity option:selected").val();
        if (window.spacescout_search_options.capacity != 1) {
            set_cookie = true;
        }
        if ($("#hours_list_input").prop("checked")) {
            if ($('#day-from').val() != 'nopref') {
                var from_query = [];
                from_query.push($('#day-from').val());
                if ($('#hour-from').val() != 'nopref') {
                    var time = $('#hour-from').val().split(':');
                    if ($('#ampm-from').val() == 'PM' && Number(time[0]) != 12) {
                        time[0] = Number(time[0]) + 12;
                    } else if ($('#ampm-from').val() == 'AM' && Number(time[0]) == 12) {
                        time[0] = 0;
                    }
                    from_query.push(time.join(':'));
                } else {
                    from_query.push('00:00');
                }
                window.spacescout_search_options.open_at = from_query.join(",");
            }
            if ($('#day-from').val() != 'nopref' && $('#day-until').val() != 'nopref') {
                var until_query = [];
                until_query.push($('#day-until').val());
                if ($('#hour-until').val() != 'nopref') {
                    var time = $('#hour-until').val().split(':');
                    if ($('#ampm-until').val() == 'PM' && Number(time[0]) != 12) {
                        time[0] = Number(time[0]) + 12;
                    } else if ($('#ampm-until').val() == 'AM' && Number(time[0]) == 12) {
                        time[0] = 0;
                    }
                    until_query.push(time.join(':'));
                } else {
                    until_query.push('23:59');
                }
                window.spacescout_search_options.open_until = until_query.join(",");
            }
            set_cookie = true;
        }
        if ($("#building_list_input").prop("checked")) {
            if (!$('select#e9').val()) {
                reset_location_filter();
            } else {
                window.spacescout_search_options.building_name = $('select#e9').val();
            }
            set_cookie = true;
        }
        checked = [];
        $.each($("input[name='equipment']:checked"), function() {
            checked.push($(this).val());
        });
        for (var i = 0; i < checked.length; i++) {
            window.spacescout_search_options["extended_info:" + checked[i]] = true;
        }
        if (checked.length > 0) {
            set_cookie = true;
        }
        checked = [];
        $.each($("input[name='noise_level']:checked"), function() {
            checked.push($(this).val());
        });
        if (checked.length > 0) {
            window.spacescout_search_options["extended_info:noise_level"] = checked;
            set_cookie = true;
        }
        if ($("#lighting").is(":checked")) {
            window.spacescout_search_options["extended_info:has_natural_light"] = "true";
            set_cookie = true;
        }
        checked = [];
        $.each($("input[name='food_nearby']:checked"), function() {
            checked.push($(this).val());
        });
        if (checked.length > 0) {
            window.spacescout_search_options["extended_info:food_nearby"] = checked;
            set_cookie = true;
        }
        event_results = {
            set_cookie: set_cookie
        };
        $.event.trigger('search_afterRunCustomOptions', [window.spacescout_search_options, event_results]);
        set_cookie = event_results.set_cookie;
        if ($('.space-detail-container').is(":visible")) {
            $('#info_items li').removeClass('selected');
            $('.space-detail').hide("slide", {
                direction: "right"
            }, 700, function() {
                $('.space-detail-container').remove();
            });
        }
        trackCheckedFilters();
        $('#space_count_container').show();
        window.spacescout_map.setCenter(new GM.LatLng(window.default_latitude, window.default_longitude));
        window.spacescout_map.setZoom(parseInt(window.default_zoom));
        _fetchData(typeNames, typeVals);
        $("#filter_block").slideUp(400, function() {
            var icon = $('.fa-angle-double-up');
            if (icon.length) {
                icon.switchClass('fa-angle-double-up', 'fa-angle-double-down', 0);
            }
            if ($('#container').attr("style")) {
                $('#container').height('auto');
                $('#container').css('overflow', 'visible');
            }
        });
        if (set_cookie) {
            $.cookie('spacescout_search_opts', JSON.stringify(window.spacescout_search_options), {
                expires: 1
            });
        }
        $('#info_list').scrollTop(0);
    }
    window.run_custom_search = run_custom_search;

    function clear_custom_search() { console.log('inside clear_custom_search');
        window.spacescout_search_options = [];
        _fetchData();
    }

    function initialize() { console.log('inside initialize');
        window.spacescout_search_options = {};
        window.update_count = true;
        if ($.cookie('spacescout_search_opts')) {
            window.spacescout_search_options = JSON.parse($.cookie('spacescout_search_opts'));
            repopulate_filters(window.spacescout_search_options);
        }
        var state = window.spacescout_url.parse_path(window.location.pathname);
        if (state.hasOwnProperty('search')) {
            window.spacescout_search_options = window.spacescout_url.decode_search_terms(state.search);
            repopulate_filters(window.spacescout_search_options);
        } else if ($.cookie('spacescout_search_opts')) {
            window.spacescout_search_options = JSON.parse($.cookie('spacescout_search_opts'));
            repopulate_filters(window.spacescout_search_options);
        }
        _loadMap(window.default_latitude, window.default_longitude, window.default_zoom);
    }
    window.initialize = initialize;

    function _loadMap(latitude, longitude, zoom) { console.log('inside load map');
        $('.loading').show();
        var myOptions = {
            center: new GM.LatLng(latitude, longitude),
            zoom: zoom,
            mapTypeControl: false,
            mapTypeId: GM.MapTypeId.ROADMAP,
            streetViewControl: false,
            styles: [{
                featureType: "poi.attraction",
                stylers: [{
                    "visibility": "off"
                }]
            }, {
                featureType: "poi.business",
                stylers: [{
                    "visibility": "off"
                }]
            }, {
                featureType: "poi.place_of_worship",
                stylers: [{
                    "visibility": "off"
                }]
            }]
        };
        if (window.spacescout_map) {
            window.spacescout_map.setCenter(new GM.LatLng(latitude, longitude));
        } else {
            window.spacescout_map = new GM.Map(document.getElementById("map_canvas"), myOptions);
        }
        GM.event.addListener(window.spacescout_map, 'idle', _reloadOnIdle);
        GM.event.addListener(spacescout_map, 'mouseup', function(c) {
            spacescout_map.setOptions({
                draggable: true
            });
        });
        GM.event.addListenerOnce(spacescout_map, 'tilesloaded', function() {
            document.getElementById('center_all').style.display = "inline";
        });
        _displayMapCenteringButtons();
    }

    function _loadData(data) {
        //data = JSON.parse(data);
        console.log('type of data in _loadData = '+ typeof data);
        updatePins(data);
        dataLoaded(data.length);
    }
    window._loadData = _loadData;

    function _reloadOnIdle() {
        if (window.initial_load) {
            //_loadData(initial_json);
            _fetchData();
            window.initial_load = false;
        } else if (!$('.space-detail-container').is(":visible")) {
            //_loadData(initial_json);
            _fetchData();
        }
    }
    window._reloadOnIdle = _reloadOnIdle;

    function _fetchData(typeNames, typeVals) { console.log('inside _fetchData');


        $('.loading').show();
        //will first abort all the current requests
        for (var i = 0; i < window.requests.length; i++) {
            window.requests[i].abort();
        }
        var args = window.spacescout_search_options;
        console.log("Args = "+args);

        if (!args) {
            args = {};
        }
        if (!args.open_at) {
            args.open_now = 1;
        }
        //getting the different bounds for the map
        /*var display_bounds = window.spacescout_map.getBounds();
        var ne = display_bounds.getNorthEast();
        var sw = display_bounds.getSouthWest();
        var center = window.spacescout_map.getCenter();
        var north = _distanceBetweenPoints(center.lat(), center.lng(), ne.lat(), center.lng());
        var east = _distanceBetweenPoints(center.lat(), center.lng(), center.lat(), ne.lng());
        var distance;
        if (north > east) {
            distance = north;
        } else {
            distance = east;
        }
        distance = distance * 1000;
        args.center_latitude = center.lat();
        args.center_longitude = center.lng();
        args.distance = distance;
        args.limit = 0;*/
        if (!window.spacescout_search_options.hasOwnProperty('type')) {
            window.spacescout_search_options.type = [];
        }
        //starting to make the query string
        var url_args = ["?"];
        for (var key in args) {/*iterating the window.spacescout_search_options*/
            if (args.hasOwnProperty(key)) {
                var val = args[key];
                if (typeof(val) == "object") {
                    for (var i = 0; i < val.length; i++) {
                        url_args.push(encodeURIComponent(key) + "=" + encodeURIComponent(val[i]), '&');
                    }
                } else {
                    url_args.push(encodeURIComponent(key) + "=" + encodeURIComponent(val), '&');
                }
            }
        }

        //console.log("url_args after going through spacescout_search_options = " + url_args);
        var location = $('#location_select option:selected'); /*if have special location then tacks it on to end*/
        if (location.length) {
            url_args.push("extended_info:campus=", encodeURIComponent(location.val().split(',')[2]), '&');
        }

        //console.log("url_args after going through which location selected = " + url_args);
        url_args.pop();
        var query = url_args.join("");
        //add on the query from the different types of spaces
        if(!typeNames) {
            var typeNames = [];
            typeVals = [];
            $.each($("input[name='type']"), function () {
                typeNames.push($(this).val());
            });
            for(var i = 0;i<typeNames.length;i++) {
                typeVals[i] = 0;
            }
        }
            var addOn = ''; //Brendan_Celii
            var i;
            for (i = 0; i < typeNames.length; i++) {

                addOn = addOn + "&" + typeNames[i] + "=" + typeVals[i];
            }
            query = query + addOn;
            //console.log("query before everything = "+query);
            //replace capacity with chairs
            var replaceWord = 'capacity';
            var queryLength = query.length;
            var capacityIndex = query.indexOf('capacity');
            if(capacityIndex != -1){
                var queryBefore = query.substr(0, capacityIndex);
                var queryAfter = query.substr(capacityIndex + replaceWord.length);
                var newQuery = queryBefore + 'chairs' + queryAfter;
                //console.log('queryBefore = ' + queryBefore + ' queryAfter = ' + queryAfter);

                query = newQuery;
            }
        console.log('query before replacements = '+ query);
        //remove all the occurances of 'extended_info%3'
        query = query.replace(/extended_info%3/g, '');

        //add on the fields that may not be present
        var fields = ["study_area","lounge","chairs","classroom","outdoor","open_space","study_room","computers","whiteboards","printers","projectors"];
        //need to have other fields for the resources
        for(var j = 0;j<fields.length;j++){
            //checka and see if field already exists
            var fieldIndex = query.indexOf(fields[j]);
            //if already exists then must replace with valid value
            var beforeString;
            var afterString;
            var endString;
            var ampIndex;

            //get the value of that field
            var value = 0;
            if (fields[i] == "chairs") {
                value = $('#capacity').val();
            }
            else {

                if ($('#' + fields[j]).is(":checked")) {
                    value = 1;
                }
            }
            if(fieldIndex>=0) {
                console.log('*******checking for: ' + fields[j] + '   *******');
                //find the index of the next query
                beforeString = query.substr(0, fieldIndex);
                console.log('beforeString = ' + beforeString);
                afterString = query.substr(fieldIndex);
                //search the after string for next ampersand
                ampIndex = afterString.indexOf('&');
                if(ampIndex >= 0) {
                    endString = afterString.substr(ampIndex);
                }
                else{
                    endString = "";
                }
                console.log('endString = ' + endString);

                //need to create the middle portion that should be inserted by checking if clicked

                query = beforeString + fields[j] + '=' + value + endString;
                console.log("new query for cycle " + j + " = "+query);

            }
            else{
                //add the key value pair to the end of the query
                query = query + '&'+ fields[j]+'='+value;
            }
        }

        //add restricted to the end of the list
        query = query +'&restricted=0';

        var filterURL = 'api/index.php/search';  /*Brendan_Change*/
        console.log("query after add on = "+ query);
        $.get(filterURL+query,function(data){
            _loadData(JSON.parse(data));
        });
        /*window.requests.push($.ajax({
            url: filterURL + query,
            success: _loadData
        }));*/
    }
    window._fetchData = _fetchData;
    function _distanceBetweenPoints(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    function scrollToTop(id) {
        $('html,body').animate({
            scrollTop: $("#" + id).offset().top
        }, 'fast');
    }
    window.scrollToTop = scrollToTop;

    function _displayMapCenteringButtons() {
        var source = $('#map_controls').html(),
            template = H.compile(source),
            map_canvas = $('#map_canvas');
        map_canvas.append(template(template));
        $('.map-control-container a', map_canvas).on('click', function(e) {
            e.preventDefault();
            if (window.spacescout_map.getZoom() != window.default_zoom) {
                window.spacescout_map.setZoom(parseInt(window.default_zoom));
            }
            window.spacescout_map.setCenter(new google.maps.LatLng(window.default_latitude, window.default_longitude));
        });
    }
})(Handlebars, jQuery, google.maps);

function dataLoaded(count) {
    $.event.trigger('searchResultsLoaded', {
        count: count
    });
}
(function(H, $, d) {
    window.speed = 600;
    H.registerHelper('ifany', function(a, b) {
        if (a || b) {
            return fn(this);
        }
    });
    $('button#suggest').click(function(e) {
        if (window.location.pathname != "/") {
            window.location.href = '/suggest/?back=' + encodeURIComponent(window.location.pathname);
        } else {
            window.location.href = '/suggest/';
        }
    });
    $(document).ready(function() {

        if ($('#id_recipient').length) {
            console.log('inside id_recipient line:8735');
            var node = $('#id_recipient');
            var engine = new Bloodhound({
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d.email);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: 15,
                remote: 'web_api/v1/directory/?q=%QUERY'
            });
            engine.initialize();
            node.addClass('tokenfield');
            node.tokenfield({
                delimiter: [',', '\t', ' '],
                createTokensOnBlur: true,
                typeahead: [null, {
                    displayKey: 'email',
                    minLength: 3,
                    source: engine.ttAdapter()
                }]
            });
            return;
        }
        $('a#suggest').click(function(e) { /*Brendan_Change*/
            /*if (window.location.pathname != "/") {
                window.location.href = '/suggest/?back=' + encodeURIComponent(window.location.pathname);
            } else {
                window.location.href = '/suggest/';
            }*/
            window.location.href = '/suggestSpace.html;';
        });
        _desktopContent();
        if ($("#map_canvas").length == 1) {
            initialize();
            $(window).resize(function() {
                //alert('inside resize function');
                _desktopContent();
                if ($('.space-detail-container').is(":visible")) {
                    $('.space-detail-container').height($('#map_canvas').height());
                    $('.space-detail-body').height($('.space-detail').height() - 98);
                    resizeCarouselMapContainer();
                }
            });
        }
        $('#filter_button').click(function() {
            /*alert('button was clicked');********BC_alert*********/
            var $block = $("#filter_block");
            if ($block.css('display') == 'none') {
                window.getLocationBuildings();
                if (window.hasOwnProperty('spacescout_search_options')) {
                    clear_filter();
                    repopulate_filters(window.spacescout_search_options);
                }
                $block.slideDown(400, function() {
                    var $icon = $('.fa-angle-double-down');
                    if ($icon.length) {
                        $icon.switchClass('fa-angle-double-down', 'fa-angle-double-up', 0);
                    }
                    $('#study_room').focus();
                });
            } else {
                $block.slideUp(400, function() {
                    var $icon = $('.fa-angle-double-up');
                    if ($icon.length) {
                        $icon.switchClass('fa-angle-double-up', 'fa-angle-double-down', 0);
                    }
                });
            }
        });
        $('#cancel_results_button').click(function() {
            $('#filter-clear').slideDown(50);
            $('#filter-clear').delay(1000).fadeOut(500);
            clear_filter();
            $.removeCookie('initial_load');
        });
        $(document).on('click', '.view-details', function(e) {
            console.log('view-details button pressed');
            var id = $(this).find('.space-detail-list-item').attr('id');
            e.preventDefault();
            $('#info_items li').removeClass('selected');
            fetchSpaceDetails(id);
            //window.spacescout_url.push(id);  /*Brendan_Change*/
        });
        $(document).on('loadSpaceDetail', function(e, id) {
            if (id) {
                $('#info_items li').removeClass('selected');
                fetchSpaceDetails(id);
            }
        });
        $(document).on('searchResultsLoaded', function(e, data) {
            $('#space_count_container .count').html(data.count);
        });
        $('#login_button').click(function(e) {
            e.preventDefault();
            window.location.href = '/login' + '?next=' + encodeURIComponent(window.location.pathname);
        });
        $('#logout_button').click(function(e) {
            e.preventDefault();
            window.location.href = '/logout' + '?next=' + encodeURIComponent(window.location.pathname);
        });
        $('a span.favorites_count_container').parent().click(function(e) {
            e.preventDefault();
            window.location.href = '/favorites' + '?back=' + encodeURIComponent(window.location.pathname);
        });
    });

    function fetchSpaceDetails(id) {
        $.each(window.requests, function() {
            this.abort();
        });
        var url = 'api/index.php/getRoom?id='+id;

        /*window.requests.push($.ajax({
            url: '/api/index.php/getRoom?id='+id,
            success: _showSpaceDetails
        }));*/
        $.get(url,_showSpaceDetails);
    }

    function _showSpaceDetails(data) {
        console.log("Data inot _showSpaceDetails = " + data);
        data = JSON.parse(data);

        if(data.extended_info == null){
            data.extended_info = {
                "has_whiteboards":"true",
                "access_notes":"Available to SMU students during open buisness hourse",
                //"location_description":,
                "has_natural_light":"true",
                "has_outlets":"true",
                "food_nearby":"Arnold or Umphrey Lee",
                "has_projector":"true",
                "campus":"dallas"};

        }
        if(data.available_hours == null){
            data.available_hours = {
                "monday":[
                    [
                        "08:00",
                        "23:00"
                    ]
                ],
                "tuesday":[
                    [
                        "08:00",
                        "23:00"
                    ]
                ],
                "friday":[
                    [
                        "08:00",
                        "23:00"
                    ]
                ],
                "wednesday":[
                    [
                        "08:00",
                        "23:00"
                    ]
                ],
                "thursday":[
                    [
                        "08:00",
                        "23:00"
                    ]
                ],
                "sunday":[

                ],
                "saturday":[

                ]
            }

        }
        console.log('inside _showSpaceDetails');
        var last_mod = new Date(data["last_modified"]);
        var month = last_mod.getMonth() + 1;
        var day = last_mod.getDate();
        var year = last_mod.getFullYear();
        data["last_modified"] = month + "/" + day + "/" + year;
        if (data['extended_info']) {
            console.log('made inside data{extended_info]');
            if (data['extended_info'].hasOwnProperty('campus')) {
                $('#location_select option').each(function (i) {
                    var location = $(this).val().split(',');
                    if (location[2] == data['extended_info']['campus']) {
                        if (!$(this).is(':selected')) {
                            $(this).attr('selected', 'selected');
                            $(this).trigger('change');
                        }
                    }
                });
            }


            data["has_notes"] = ((data.extended_info.access_notes != null) || (data.extended_info.reservation_notes != null));
            data["has_resources"] = (data.extended_info.has_computers != null || data.extended_info.has_displays != null || data.extended_info.has_outlets != null || data.extended_info.has_printing != null || data.extended_info.has_projector != null || data.extended_info.has_scanner != null || data.extended_info.has_whiteboards != null);
            data["review_count"] = (data.extended_info.review_count) || 0;
            data["stars"] = [];
            var rating = parseFloat(data.extended_info.rating) || 0;
            for (var star_pos = 1; star_pos <= 5; star_pos++) { /*puts as many stars up there as rated*/
                if (rating == star_pos - 0.5) {
                    data.stars.push({
                        "icon": "fa-star-half-o"
                    });
                } else if (star_pos <= rating) {
                    data.stars.push({
                        "icon": "fa-star"
                    });
                } else {
                    data.stars.push({
                        "icon": "fa-star-o"
                    });
                }
            }

        }
        var open = $('.space-detail-container').is(':visible');
        $('.space-detail-container').remove();
        var source = $('#space_details').html();
        var template = H.compile(source);
        $('#map_canvas').append(template(data));
        initMapCarouselButtons();

        /*sets the height of the space*/
        $('.space-detail-inner').show();
        $('.space-detail-container').show();
        $('.space-detail-container').height($('#map_canvas').height());
        $('.space-detail-body').height($('.space-detail').height() - 128);
        if (!open) {
            $('.space-detail').show("slide", {
                direction: "right"
            }, 400, function() {
                $('.close').focus();
                $('.btn.active').attr("tabindex", -1);
                $('.space-detail-body').attr("tabindex", -1);
                $('.carousel-nav ul li a').each(function() {
                    $(this).attr("tabindex", -1);
                });
                $('.space-detail-report a').blur(function() {
                    $('.close').focus();
                });
            });
        } else {
            $('.space-detail').show(0, function() {
                $('.close').focus();
                $('.btn.active').attr("tabindex", -1);
                $('.space-detail-body').attr("tabindex", -1);
                $('.carousel-nav ul li a').each(function() {
                    $(this).attr("tabindex", -1);
                });
                $('.space-detail-report a').blur(function() {
                    $('.close').focus();
                });
            });
        }
        initializeCarousel();
        replaceReservationNotesUrls();
        $('.space-detail-header .close').on('click', function(e) {
            e.preventDefault();
            //window.spacescout_url.push();
            closeSpaceDetails();
        });
        window.spacescout_favorites.update_favorites_button(data.id);
        setupRatingsAndReviews(data);
        loadRatingsAndReviews(data.id, $('.space-reviews-content'), $('.space-actions'));
        $('button#share_space').unbind('click');
        $('button#share_space').click(function(e) {
            /*
            window.location.href = '/share/' + data.id + '?back=' + encodeURIComponent(window.location.pathname);
        */
            window.location.href = '/shareSpacePage.html';  /*Brendan_Change*/
            });
        $('button#' + data.id).closest('.view-details').addClass('selected');
        $('a.close').focus();
    }
    window._showSpaceDetails = _showSpaceDetails;

    function _desktopContent() {
        var windowH = $(window).height();
        var headerH = $('#nav').height();
        var contentH = windowH - headerH;
        $('#map_canvas').height(contentH - 220); /**changed map height**/
        $('#info_list').height(contentH - 185);
        //$('#info_list .list-inner').css('min-height', contentH - 100);
        $("#main_content").height(contentH - 160);
    }
})(Handlebars, jQuery);
(function(H, $, GM) {
    var visible_markers = [];
    var active_marker;
    var spherical = GM.geometry.spherical;

    function updatePins(spots) {
        if (window.update_count) {
            var source = $('#space_count').html();
            var template = H.compile(source);
            $('#space_count_container').html(template({
                count: spots.length
            }));
            window.update_count = false;
        }

        console.log("spots inside updatePins = "+ JSON.stringify(spots[0])+'    '+JSON.stringify(spots[1]));
        _clearActiveMarker();
        openAllMarkerInfoWindow(spots);
        _updateMarkers(spots);
        var zoom = window.spacescout_map.getZoom();
        var pins;
        var ss_markers = window.spacescout_markers;
        if ($.inArray(zoom, window.by_building_zooms) != -1) {
            pins = _groupByBuilding(ss_markers);
        } else {
            pins = _groupByDistance(ss_markers);
        }
        console.log("pins = "+pins);
        console.log('right before showMarkers');
        _showMarkers(pins);
    }
    window.updatePins = updatePins;

    function _updateMarkers(spots) { console.log('spots in _updateMarkers = ' + spots);
        window.spacescout_markers = [];
        for (var i = 0; i < spots.length; i++) {
            var holderspot = new GM.Marker({
                position: new GM.LatLng(spots[i].location.latitude, spots[i].location.longitude),
                data: spots[i]
            });
            window.spacescout_markers.push(holderspot);
        }
        $("#info_list").scrollTop(0);
    }

    function _groupByDistance(markers) {
        var bounds = window.spacescout_map.getBounds();
        var ne_corner = bounds.getNorthEast();
        var sw_corner = bounds.getSouthWest();
        var diag = spherical.computeDistanceBetween(ne_corner, new GM.LatLng(ne_corner.lat(), sw_corner.lng()));
        var grouped_spots = [];
        for (var count = markers.length - 1; count >= 0; count--) {
            var grouped = false;
            var position_holder = markers[count].getPosition();
            for (var j = 0; j < grouped_spots.length; j++) {
                var group_center = grouped_spots[j][0].getPosition();
                var distance_ratio = spherical.computeDistanceBetween(position_holder, group_center) / diag;
                if (distance_ratio < window.by_distance_ratio) {
                    grouped_spots[j].push(markers[count]);
                    markers.splice(count, 1);
                    grouped = true;
                    break;
                }
            }
            if (!grouped) {
                var group = [markers[count]];
                grouped_spots.push(group);
                markers.splice(count, 1);
            }
        }
        return grouped_spots;
    }

    function _groupByBuilding(markers) {
        var building_spots = [];
        for (var count = markers.length - 1; count >= 0; count--) {
            var grouped = false;
            for (var buildingcount = 0; buildingcount < building_spots.length; buildingcount++) {
                if (markers[count].data.location.building_name === building_spots[buildingcount][0].data.location.building_name) {
                    grouped = true;
                    building_spots[buildingcount].push(markers[count]);
                    break;
                }
            }
            if (!grouped) {
                var group = [markers[count]];
                building_spots.push(group);
            }
        }
        return building_spots;
    }

    function _showMarkers(marker_groups) {
        _clearMap();
        for (var counter = 0; counter < marker_groups.length; counter++) {
            var group_center = _getGroupCenter(marker_groups[counter]);
            var spots = _getSpotList(marker_groups[counter]);
            _createMarker(spots, group_center);
        }
    }

    function _getSpotList(group) {
        var the_list = [];
        for (var i = 0; i < group.length; i++) {
            the_list.push(group[i].data);
        }
        return the_list;
    }

    function _createMarker(spots, group_center) {
        var num_spots = spots.length;
        var main_icon = {
            url: static_url('img/pins/pin00@2x.png'),
            scaledSize: new GM.Size(40, 40)
        };
        var alt_icon = {
            url: static_url('img/pins/pin00-alt@2x.png'),
            scaledSize: new GM.Size(40, 40)
        };
        var marker = new MarkerWithLabel({
            position: group_center,
            icon: main_icon,
            main_icon: main_icon,
            alt_icon: alt_icon,
            map: window.spacescout_map,
            spots: spots,
            labelContent: num_spots,
            labelClass: "map-label",
            labelAnchor: new GM.Point(15, 34)
        });
        GM.event.addListener(marker, 'click', function() {
            _loadMarkerSpots(marker, marker.spots);
        });
        GM.event.addListener(marker, 'mousedown', function(c) {
            window.spacescout_map.setOptions({
                draggable: false
            });
        });
        visible_markers.push(marker);
    }
    window._createMarker = _createMarker;

    function _getGroupCenter(group) {
        if (group.length > 1) {
            var lat = 0,
                lon = 0;
            for (var i = 0; i < group.length; i++) {
                lat += group[i].getPosition().lat();
                lon += group[i].getPosition().lng();
            }
            lat = lat / i;
            lon = lon / i;
            return new GM.LatLng(lat, lon);
        }
        return group[0].getPosition();
    }

    function _clearActiveMarker() {
        for (var i = 0; i < visible_markers.length; i++) {
            visible_markers[i].setIcon(visible_markers[i].main_icon);
        }
        if (active_marker) {
            active_marker.setZIndex();
        }
        active_marker = null;
    }

    function _updateActiveMarker(marker) {
        active_marker.setIcon(active_marker.alt_icon);
        active_marker.setZIndex();
        marker.setIcon(marker.main_icon);
        marker.setZIndex(GM.Marker.MAX_ZINDEX + 1);
        active_marker = marker;
    }

    function _setActiveMarker(marker) {
        active_marker = marker;
        marker.setZIndex(GM.Marker.MAX_ZINDEX + 1);
        for (var i = 0; i < visible_markers.length; i++) {
            if (visible_markers[i] != marker) {
                visible_markers[i].setIcon(visible_markers[i].alt_icon);
            }
        }
    }

    function _loadMarkerSpots(marker, data) {
        /********alert('used loadMarkerSpots');******BC_alert********/
        $("#info_list").scrollTop(0);
        if (active_marker) {
            _updateActiveMarker(marker);
        } else {
            _setActiveMarker(marker);
        }
        var source = $('#cluster_list').html();
        var template = H.compile(source);
        console.log('data send to buildingNameHeaders = '+ data );
        data = buildingNameHeaders(data);
        $('#info_items').html(template({
            data: data
        }));
        //var lazyload_target = isMobile ? window : '#info_list';
        var lazyload_target = '#info_list';
        $(lazyload_target).lazyScrollLoading({
            lazyItemSelector: ".lazyloader",
            onLazyItemFirstVisible: function(e, $lazyItems, $firstVisibleLazyItems) {
                $firstVisibleLazyItems.each(function() {
                    var $img = $(this);
                    console.log('inside lazy item');
                    console.log($img);
                    var src = $img.data('src');
                    //newSrc = src.substr(8);

                    var indexWWW = src.indexOf('/www/');
                    var newSrc = src.substr(indexWWW+5);

                    //src="/Brendan_URL";
                    $img.css('background', 'transparent url("' + newSrc + '") no-repeat 50% 50%');
                    $img.css('background-size','cover');
                });
            }
        });
        scrollToTop('info_list');
        $('.loading').slideUp('fast');
        dataLoaded(visible_markers.length);
    }
    window._loadMarkerSpots = _loadMarkerSpots;

    function _clearMap() {
        for (var i = 0; i < visible_markers.length; i++) {
            visible_markers[i].setMap(null);
        }
        visible_markers = [];
    }
    window._clearMap = _clearMap;

})(Handlebars, jQuery, google.maps);
var _ga = _ga || {};
var _gaq = _gaq || [];
_ga.getEventTrackers_ = function(category, action, opt_label) {
    return function() {
        var trackers = _gat._getTrackers();
        for (var i = 0, tracker; tracker = trackers[i]; i++) {
            var result = tracker._trackEvent(category, action, opt_label, 1);
        }
    };
};

function trackCheckedFilters() {
    window.spacescout_open_now_filter = false;
    $('#filter_block [type="checkbox"]:checked').each(function() {
        _gaq.push(_ga.getEventTrackers_("Filters", window.default_location + "-" + this.name, this.value));
    });
    $('#filter_block [type="radio"]:checked').each(function() {
        if (this.value === 'open_now') {
            window.spacescout_open_now_filter = true;
        }
        _gaq.push(_ga.getEventTrackers_("Filters", window.default_location + "-" + this.name, this.value));
    });
    $('#filter_block option:selected').each(function() {
        if (this.parentNode.hasOwnProperty('label')) {
            _gaq.push(_ga.getEventTrackers_("Filters", window.default_location + "-building", this.value));
        } else if (window.spacescout_open_now_filter) {
            if (!(this.parentNode.id.indexOf('from') > -1) && !(this.parentNode.id.indexOf('until') > -1)) {
                _gaq.push(_ga.getEventTrackers_("Filters", window.default_location + "-" + this.parentNode.id, this.value));
            }
        } else {
            _gaq.push(_ga.getEventTrackers_("Filters", window.default_location + "-" + this.parentNode.id, this.value));
        }
    })
    window.spacescout_open_now_filter = false;
}