(function () {
var mobile = (function () {
  'use strict';

  var noop = function () {
  };
  var noarg = function (f) {
    return function () {
      return f();
    };
  };
  var compose = function (fa, fb) {
    return function () {
      return fa(fb.apply(null, arguments));
    };
  };
  var constant = function (value) {
    return function () {
      return value;
    };
  };
  var identity = function (x) {
    return x;
  };
  var tripleEquals = function (a, b) {
    return a === b;
  };
  var curry = function (f) {
    var args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++)
      args[i - 1] = arguments[i];
    return function () {
      var newArgs = new Array(arguments.length);
      for (var j = 0; j < newArgs.length; j++)
        newArgs[j] = arguments[j];
      var all = args.concat(newArgs);
      return f.apply(null, all);
    };
  };
  var not = function (f) {
    return function () {
      return !f.apply(null, arguments);
    };
  };
  var die = function (msg) {
    return function () {
      throw new Error(msg);
    };
  };
  var apply = function (f) {
    return f();
  };
  var call = function (f) {
    f();
  };
  var never$1 = constant(false);
  var always$1 = constant(true);
  var $_7bfl0mwajcg9md92 = {
    noop: noop,
    noarg: noarg,
    compose: compose,
    constant: constant,
    identity: identity,
    tripleEquals: tripleEquals,
    curry: curry,
    not: not,
    die: die,
    apply: apply,
    call: call,
    never: never$1,
    always: always$1
  };

  var never = $_7bfl0mwajcg9md92.never;
  var always = $_7bfl0mwajcg9md92.always;
  var none = function () {
    return NONE;
  };
  var NONE = function () {
    var eq = function (o) {
      return o.isNone();
    };
    var call = function (thunk) {
      return thunk();
    };
    var id = function (n) {
      return n;
    };
    var noop = function () {
    };
    var me = {
      fold: function (n, s) {
        return n();
      },
      is: never,
      isSome: never,
      isNone: always,
      getOr: id,
      getOrThunk: call,
      getOrDie: function (msg) {
        throw new Error(msg || 'error: getOrDie called on none.');
      },
      or: id,
      orThunk: call,
      map: none,
      ap: none,
      each: noop,
      bind: none,
      flatten: none,
      exists: never,
      forall: always,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray: function () {
        return [];
      },
      toString: $_7bfl0mwajcg9md92.constant('none()')
    };
    if (Object.freeze)
      Object.freeze(me);
    return me;
  }();
  var some = function (a) {
    var constant_a = function () {
      return a;
    };
    var self = function () {
      return me;
    };
    var map = function (f) {
      return some(f(a));
    };
    var bind = function (f) {
      return f(a);
    };
    var me = {
      fold: function (n, s) {
        return s(a);
      },
      is: function (v) {
        return a === v;
      },
      isSome: always,
      isNone: never,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      or: self,
      orThunk: self,
      map: map,
      ap: function (optfab) {
        return optfab.fold(none, function (fab) {
          return some(fab(a));
        });
      },
      each: function (f) {
        f(a);
      },
      bind: bind,
      flatten: constant_a,
      exists: bind,
      forall: bind,
      filter: function (f) {
        return f(a) ? me : NONE;
      },
      equals: function (o) {
        return o.is(a);
      },
      equals_: function (o, elementEq) {
        return o.fold(never, function (b) {
          return elementEq(a, b);
        });
      },
      toArray: function () {
        return [a];
      },
      toString: function () {
        return 'some(' + a + ')';
      }
    };
    return me;
  };
  var from = function (value) {
    return value === null || value === undefined ? NONE : some(value);
  };
  var $_gb5srhw9jcg9md90 = {
    some: some,
    none: none,
    from: from
  };

  var rawIndexOf = function () {
    var pIndexOf = Array.prototype.indexOf;
    var fastIndex = function (xs, x) {
      return pIndexOf.call(xs, x);
    };
    var slowIndex = function (xs, x) {
      return slowIndexOf(xs, x);
    };
    return pIndexOf === undefined ? slowIndex : fastIndex;
  }();
  var indexOf = function (xs, x) {
    var r = rawIndexOf(xs, x);
    return r === -1 ? $_gb5srhw9jcg9md90.none() : $_gb5srhw9jcg9md90.some(r);
  };
  var contains$1 = function (xs, x) {
    return rawIndexOf(xs, x) > -1;
  };
  var exists = function (xs, pred) {
    return findIndex(xs, pred).isSome();
  };
  var range = function (num, f) {
    var r = [];
    for (var i = 0; i < num; i++) {
      r.push(f(i));
    }
    return r;
  };
  var chunk = function (array, size) {
    var r = [];
    for (var i = 0; i < array.length; i += size) {
      var s = array.slice(i, i + size);
      r.push(s);
    }
    return r;
  };
  var map = function (xs, f) {
    var len = xs.length;
    var r = new Array(len);
    for (var i = 0; i < len; i++) {
      var x = xs[i];
      r[i] = f(x, i, xs);
    }
    return r;
  };
  var each = function (xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var eachr = function (xs, f) {
    for (var i = xs.length - 1; i >= 0; i--) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var partition = function (xs, pred) {
    var pass = [];
    var fail = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      var arr = pred(x, i, xs) ? pass : fail;
      arr.push(x);
    }
    return {
      pass: pass,
      fail: fail
    };
  };
  var filter = function (xs, pred) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        r.push(x);
      }
    }
    return r;
  };
  var groupBy = function (xs, f) {
    if (xs.length === 0) {
      return [];
    } else {
      var wasType = f(xs[0]);
      var r = [];
      var group = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var type = f(x);
        if (type !== wasType) {
          r.push(group);
          group = [];
        }
        wasType = type;
        group.push(x);
      }
      if (group.length !== 0) {
        r.push(group);
      }
      return r;
    }
  };
  var foldr = function (xs, f, acc) {
    eachr(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var foldl = function (xs, f, acc) {
    each(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var find = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_gb5srhw9jcg9md90.some(x);
      }
    }
    return $_gb5srhw9jcg9md90.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_gb5srhw9jcg9md90.some(i);
      }
    }
    return $_gb5srhw9jcg9md90.none();
  };
  var slowIndexOf = function (xs, x) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (xs[i] === x) {
        return i;
      }
    }
    return -1;
  };
  var push = Array.prototype.push;
  var flatten = function (xs) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (!Array.prototype.isPrototypeOf(xs[i]))
        throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
      push.apply(r, xs[i]);
    }
    return r;
  };
  var bind = function (xs, f) {
    var output = map(xs, f);
    return flatten(output);
  };
  var forall = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      var x = xs[i];
      if (pred(x, i, xs) !== true) {
        return false;
      }
    }
    return true;
  };
  var equal = function (a1, a2) {
    return a1.length === a2.length && forall(a1, function (x, i) {
      return x === a2[i];
    });
  };
  var slice = Array.prototype.slice;
  var reverse = function (xs) {
    var r = slice.call(xs, 0);
    r.reverse();
    return r;
  };
  var difference = function (a1, a2) {
    return filter(a1, function (x) {
      return !contains$1(a2, x);
    });
  };
  var mapToObject = function (xs, f) {
    var r = {};
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      r[String(x)] = f(x, i);
    }
    return r;
  };
  var pure = function (x) {
    return [x];
  };
  var sort = function (xs, comparator) {
    var copy = slice.call(xs, 0);
    copy.sort(comparator);
    return copy;
  };
  var head = function (xs) {
    return xs.length === 0 ? $_gb5srhw9jcg9md90.none() : $_gb5srhw9jcg9md90.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? $_gb5srhw9jcg9md90.none() : $_gb5srhw9jcg9md90.some(xs[xs.length - 1]);
  };
  var $_gcfqi6w8jcg9md8v = {
    map: map,
    each: each,
    eachr: eachr,
    partition: partition,
    filter: filter,
    groupBy: groupBy,
    indexOf: indexOf,
    foldr: foldr,
    foldl: foldl,
    find: find,
    findIndex: findIndex,
    flatten: flatten,
    bind: bind,
    forall: forall,
    exists: exists,
    contains: contains$1,
    equal: equal,
    reverse: reverse,
    chunk: chunk,
    difference: difference,
    mapToObject: mapToObject,
    pure: pure,
    sort: sort,
    range: range,
    head: head,
    last: last
  };

  var global = typeof window !== 'undefined' ? window : Function('return this;')();

  var path = function (parts, scope) {
    var o = scope !== undefined && scope !== null ? scope : global;
    for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
      o = o[parts[i]];
    return o;
  };
  var resolve = function (p, scope) {
    var parts = p.split('.');
    return path(parts, scope);
  };
  var step = function (o, part) {
    if (o[part] === undefined || o[part] === null)
      o[part] = {};
    return o[part];
  };
  var forge = function (parts, target) {
    var o = target !== undefined ? target : global;
    for (var i = 0; i < parts.length; ++i)
      o = step(o, parts[i]);
    return o;
  };
  var namespace = function (name, target) {
    var parts = name.split('.');
    return forge(parts, target);
  };
  var $_ee4vh3wdjcg9md98 = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_ee4vh3wdjcg9md98.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_eq8elgwcjcg9md97 = { getOrDie: getOrDie };

  var node = function () {
    var f = $_eq8elgwcjcg9md97.getOrDie('Node');
    return f;
  };
  var compareDocumentPosition = function (a, b, match) {
    return (a.compareDocumentPosition(b) & match) !== 0;
  };
  var documentPositionPreceding = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING);
  };
  var documentPositionContainedBy = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY);
  };
  var $_6aifvswbjcg9md96 = {
    documentPositionPreceding: documentPositionPreceding,
    documentPositionContainedBy: documentPositionContainedBy
  };

  var cached = function (f) {
    var called = false;
    var r;
    return function () {
      if (!called) {
        called = true;
        r = f.apply(null, arguments);
      }
      return r;
    };
  };
  var $_apalrswgjcg9md9b = { cached: cached };

  var firstMatch = function (regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s))
        return x;
    }
    return undefined;
  };
  var find$1 = function (regexes, agent) {
    var r = firstMatch(regexes, agent);
    if (!r)
      return {
        major: 0,
        minor: 0
      };
    var group = function (i) {
      return Number(agent.replace(r, '$' + i));
    };
    return nu$1(group(1), group(2));
  };
  var detect$2 = function (versionRegexes, agent) {
    var cleanedAgent = String(agent).toLowerCase();
    if (versionRegexes.length === 0)
      return unknown$1();
    return find$1(versionRegexes, cleanedAgent);
  };
  var unknown$1 = function () {
    return nu$1(0, 0);
  };
  var nu$1 = function (major, minor) {
    return {
      major: major,
      minor: minor
    };
  };
  var $_5ozcn3wjjcg9md9f = {
    nu: nu$1,
    detect: detect$2,
    unknown: unknown$1
  };

  var edge = 'Edge';
  var chrome = 'Chrome';
  var ie = 'IE';
  var opera = 'Opera';
  var firefox = 'Firefox';
  var safari = 'Safari';
  var isBrowser = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown = function () {
    return nu({
      current: undefined,
      version: $_5ozcn3wjjcg9md9f.unknown()
    });
  };
  var nu = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isEdge: isBrowser(edge, current),
      isChrome: isBrowser(chrome, current),
      isIE: isBrowser(ie, current),
      isOpera: isBrowser(opera, current),
      isFirefox: isBrowser(firefox, current),
      isSafari: isBrowser(safari, current)
    };
  };
  var $_6e6ty1wijcg9md9d = {
    unknown: unknown,
    nu: nu,
    edge: $_7bfl0mwajcg9md92.constant(edge),
    chrome: $_7bfl0mwajcg9md92.constant(chrome),
    ie: $_7bfl0mwajcg9md92.constant(ie),
    opera: $_7bfl0mwajcg9md92.constant(opera),
    firefox: $_7bfl0mwajcg9md92.constant(firefox),
    safari: $_7bfl0mwajcg9md92.constant(safari)
  };

  var windows = 'Windows';
  var ios = 'iOS';
  var android = 'Android';
  var linux = 'Linux';
  var osx = 'OSX';
  var solaris = 'Solaris';
  var freebsd = 'FreeBSD';
  var isOS = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$2 = function () {
    return nu$2({
      current: undefined,
      version: $_5ozcn3wjjcg9md9f.unknown()
    });
  };
  var nu$2 = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isWindows: isOS(windows, current),
      isiOS: isOS(ios, current),
      isAndroid: isOS(android, current),
      isOSX: isOS(osx, current),
      isLinux: isOS(linux, current),
      isSolaris: isOS(solaris, current),
      isFreeBSD: isOS(freebsd, current)
    };
  };
  var $_ge83q7wkjcg9md9g = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_7bfl0mwajcg9md92.constant(windows),
    ios: $_7bfl0mwajcg9md92.constant(ios),
    android: $_7bfl0mwajcg9md92.constant(android),
    linux: $_7bfl0mwajcg9md92.constant(linux),
    osx: $_7bfl0mwajcg9md92.constant(osx),
    solaris: $_7bfl0mwajcg9md92.constant(solaris),
    freebsd: $_7bfl0mwajcg9md92.constant(freebsd)
  };

  var DeviceType = function (os, browser, userAgent) {
    var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
    var isiPhone = os.isiOS() && !isiPad;
    var isAndroid3 = os.isAndroid() && os.version.major === 3;
    var isAndroid4 = os.isAndroid() && os.version.major === 4;
    var isTablet = isiPad || isAndroid3 || isAndroid4 && /mobile/i.test(userAgent) === true;
    var isTouch = os.isiOS() || os.isAndroid();
    var isPhone = isTouch && !isTablet;
    var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
    return {
      isiPad: $_7bfl0mwajcg9md92.constant(isiPad),
      isiPhone: $_7bfl0mwajcg9md92.constant(isiPhone),
      isTablet: $_7bfl0mwajcg9md92.constant(isTablet),
      isPhone: $_7bfl0mwajcg9md92.constant(isPhone),
      isTouch: $_7bfl0mwajcg9md92.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_7bfl0mwajcg9md92.constant(iOSwebview)
    };
  };

  var detect$3 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_gcfqi6w8jcg9md8v.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$3(browsers, userAgent).map(function (browser) {
      var version = $_5ozcn3wjjcg9md9f.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$3(oses, userAgent).map(function (os) {
      var version = $_5ozcn3wjjcg9md9f.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_2imkifwmjcg9md9k = {
    detectBrowser: detectBrowser,
    detectOs: detectOs
  };

  var addToStart = function (str, prefix) {
    return prefix + str;
  };
  var addToEnd = function (str, suffix) {
    return str + suffix;
  };
  var removeFromStart = function (str, numChars) {
    return str.substring(numChars);
  };
  var removeFromEnd = function (str, numChars) {
    return str.substring(0, str.length - numChars);
  };
  var $_3ptz1zwpjcg9md9r = {
    addToStart: addToStart,
    addToEnd: addToEnd,
    removeFromStart: removeFromStart,
    removeFromEnd: removeFromEnd
  };

  var first = function (str, count) {
    return str.substr(0, count);
  };
  var last$1 = function (str, count) {
    return str.substr(str.length - count, str.length);
  };
  var head$1 = function (str) {
    return str === '' ? $_gb5srhw9jcg9md90.none() : $_gb5srhw9jcg9md90.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? $_gb5srhw9jcg9md90.none() : $_gb5srhw9jcg9md90.some(str.substring(1));
  };
  var $_4hj03zwqjcg9md9s = {
    first: first,
    last: last$1,
    head: head$1,
    tail: tail
  };

  var checkRange = function (str, substr, start) {
    if (substr === '')
      return true;
    if (str.length < substr.length)
      return false;
    var x = str.substr(start, start + substr.length);
    return x === substr;
  };
  var supplant = function (str, obj) {
    var isStringOrNumber = function (a) {
      var t = typeof a;
      return t === 'string' || t === 'number';
    };
    return str.replace(/\${([^{}]*)}/g, function (a, b) {
      var value = obj[b];
      return isStringOrNumber(value) ? value : a;
    });
  };
  var removeLeading = function (str, prefix) {
    return startsWith(str, prefix) ? $_3ptz1zwpjcg9md9r.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_3ptz1zwpjcg9md9r.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_3ptz1zwpjcg9md9r.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_3ptz1zwpjcg9md9r.addToEnd(str, prefix);
  };
  var contains$2 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_4hj03zwqjcg9md9s.head(str).bind(function (head) {
      return $_4hj03zwqjcg9md9s.tail(str).map(function (tail) {
        return head.toUpperCase() + tail;
      });
    }).getOr(str);
  };
  var startsWith = function (str, prefix) {
    return checkRange(str, prefix, 0);
  };
  var endsWith = function (str, suffix) {
    return checkRange(str, suffix, str.length - suffix.length);
  };
  var trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  };
  var lTrim = function (str) {
    return str.replace(/^\s+/g, '');
  };
  var rTrim = function (str) {
    return str.replace(/\s+$/g, '');
  };
  var $_7ozyznwojcg9md9q = {
    supplant: supplant,
    startsWith: startsWith,
    removeLeading: removeLeading,
    removeTrailing: removeTrailing,
    ensureLeading: ensureLeading,
    ensureTrailing: ensureTrailing,
    endsWith: endsWith,
    contains: contains$2,
    trim: trim,
    lTrim: lTrim,
    rTrim: rTrim,
    capitalize: capitalize
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function (target) {
    return function (uastring) {
      return $_7ozyznwojcg9md9q.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_7ozyznwojcg9md9q.contains(uastring, 'edge/') && $_7ozyznwojcg9md9q.contains(uastring, 'chrome') && $_7ozyznwojcg9md9q.contains(uastring, 'safari') && $_7ozyznwojcg9md9q.contains(uastring, 'applewebkit');
        return monstrosity;
      }
    },
    {
      name: 'Chrome',
      versionRegexes: [
        /.*?chrome\/([0-9]+)\.([0-9]+).*/,
        normalVersionRegex
      ],
      search: function (uastring) {
        return $_7ozyznwojcg9md9q.contains(uastring, 'chrome') && !$_7ozyznwojcg9md9q.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_7ozyznwojcg9md9q.contains(uastring, 'msie') || $_7ozyznwojcg9md9q.contains(uastring, 'trident');
      }
    },
    {
      name: 'Opera',
      versionRegexes: [
        normalVersionRegex,
        /.*?opera\/([0-9]+)\.([0-9]+).*/
      ],
      search: checkContains('opera')
    },
    {
      name: 'Firefox',
      versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
      search: checkContains('firefox')
    },
    {
      name: 'Safari',
      versionRegexes: [
        normalVersionRegex,
        /.*?cpu os ([0-9]+)_([0-9]+).*/
      ],
      search: function (uastring) {
        return ($_7ozyznwojcg9md9q.contains(uastring, 'safari') || $_7ozyznwojcg9md9q.contains(uastring, 'mobile/')) && $_7ozyznwojcg9md9q.contains(uastring, 'applewebkit');
      }
    }
  ];
  var oses = [
    {
      name: 'Windows',
      search: checkContains('win'),
      versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'iOS',
      search: function (uastring) {
        return $_7ozyznwojcg9md9q.contains(uastring, 'iphone') || $_7ozyznwojcg9md9q.contains(uastring, 'ipad');
      },
      versionRegexes: [
        /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
        /.*cpu os ([0-9]+)_([0-9]+).*/,
        /.*cpu iphone os ([0-9]+)_([0-9]+).*/
      ]
    },
    {
      name: 'Android',
      search: checkContains('android'),
      versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'OSX',
      search: checkContains('os x'),
      versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
    },
    {
      name: 'Linux',
      search: checkContains('linux'),
      versionRegexes: []
    },
    {
      name: 'Solaris',
      search: checkContains('sunos'),
      versionRegexes: []
    },
    {
      name: 'FreeBSD',
      search: checkContains('freebsd'),
      versionRegexes: []
    }
  ];
  var $_g1ttrpwnjcg9md9m = {
    browsers: $_7bfl0mwajcg9md92.constant(browsers),
    oses: $_7bfl0mwajcg9md92.constant(oses)
  };

  var detect$1 = function (userAgent) {
    var browsers = $_g1ttrpwnjcg9md9m.browsers();
    var oses = $_g1ttrpwnjcg9md9m.oses();
    var browser = $_2imkifwmjcg9md9k.detectBrowser(browsers, userAgent).fold($_6e6ty1wijcg9md9d.unknown, $_6e6ty1wijcg9md9d.nu);
    var os = $_2imkifwmjcg9md9k.detectOs(oses, userAgent).fold($_ge83q7wkjcg9md9g.unknown, $_ge83q7wkjcg9md9g.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_d2igywhjcg9md9c = { detect: detect$1 };

  var detect = $_apalrswgjcg9md9b.cached(function () {
    var userAgent = navigator.userAgent;
    return $_d2igywhjcg9md9c.detect(userAgent);
  });
  var $_37ytsswfjcg9md9a = { detect: detect };

  var fromHtml = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    if (!div.hasChildNodes() || div.childNodes.length > 1) {
      console.error('HTML does not have a single root node', html);
      throw 'HTML must have a single root node';
    }
    return fromDom(div.childNodes[0]);
  };
  var fromTag = function (tag, scope) {
    var doc = scope || document;
    var node = doc.createElement(tag);
    return fromDom(node);
  };
  var fromText = function (text, scope) {
    var doc = scope || document;
    var node = doc.createTextNode(text);
    return fromDom(node);
  };
  var fromDom = function (node) {
    if (node === null || node === undefined)
      throw new Error('Node cannot be null or undefined');
    return { dom: $_7bfl0mwajcg9md92.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return $_gb5srhw9jcg9md90.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_41aqpdwsjcg9md9w = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_d2iswowtjcg9md9z = {
    ATTRIBUTE: 2,
    CDATA_SECTION: 4,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    ELEMENT: 1,
    TEXT: 3,
    PROCESSING_INSTRUCTION: 7,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    NOTATION: 12
  };

  var ELEMENT = $_d2iswowtjcg9md9z.ELEMENT;
  var DOCUMENT = $_d2iswowtjcg9md9z.DOCUMENT;
  var is = function (element, selector) {
    var elem = element.dom();
    if (elem.nodeType !== ELEMENT)
      return false;
    else if (elem.matches !== undefined)
      return elem.matches(selector);
    else if (elem.msMatchesSelector !== undefined)
      return elem.msMatchesSelector(selector);
    else if (elem.webkitMatchesSelector !== undefined)
      return elem.webkitMatchesSelector(selector);
    else if (elem.mozMatchesSelector !== undefined)
      return elem.mozMatchesSelector(selector);
    else
      throw new Error('Browser lacks native selectors');
  };
  var bypassSelector = function (dom) {
    return dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT || dom.childElementCount === 0;
  };
  var all = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? [] : $_gcfqi6w8jcg9md8v.map(base.querySelectorAll(selector), $_41aqpdwsjcg9md9w.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? $_gb5srhw9jcg9md90.none() : $_gb5srhw9jcg9md90.from(base.querySelector(selector)).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var $_7jyciewrjcg9md9t = {
    all: all,
    is: is,
    one: one
  };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_gcfqi6w8jcg9md8v.exists(elements, $_7bfl0mwajcg9md92.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_6aifvswbjcg9md96.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = $_37ytsswfjcg9md9a.detect().browser;
  var contains = browser.isIE() ? ieContains : regularContains;
  var $_9sx28sw7jcg9md8n = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains,
    is: $_7jyciewrjcg9md9t.is
  };

  var isSource = function (component, simulatedEvent) {
    return $_9sx28sw7jcg9md8n.eq(component.element(), simulatedEvent.event().target());
  };
  var $_6cqutnw6jcg9md8k = { isSource: isSource };

  var $_f4bxsewwjcg9mdab = {
    contextmenu: $_7bfl0mwajcg9md92.constant('contextmenu'),
    touchstart: $_7bfl0mwajcg9md92.constant('touchstart'),
    touchmove: $_7bfl0mwajcg9md92.constant('touchmove'),
    touchend: $_7bfl0mwajcg9md92.constant('touchend'),
    gesturestart: $_7bfl0mwajcg9md92.constant('gesturestart'),
    mousedown: $_7bfl0mwajcg9md92.constant('mousedown'),
    mousemove: $_7bfl0mwajcg9md92.constant('mousemove'),
    mouseout: $_7bfl0mwajcg9md92.constant('mouseout'),
    mouseup: $_7bfl0mwajcg9md92.constant('mouseup'),
    mouseover: $_7bfl0mwajcg9md92.constant('mouseover'),
    focusin: $_7bfl0mwajcg9md92.constant('focusin'),
    keydown: $_7bfl0mwajcg9md92.constant('keydown'),
    input: $_7bfl0mwajcg9md92.constant('input'),
    change: $_7bfl0mwajcg9md92.constant('change'),
    focus: $_7bfl0mwajcg9md92.constant('focus'),
    click: $_7bfl0mwajcg9md92.constant('click'),
    transitionend: $_7bfl0mwajcg9md92.constant('transitionend'),
    selectstart: $_7bfl0mwajcg9md92.constant('selectstart')
  };

  var alloy = { tap: $_7bfl0mwajcg9md92.constant('alloy.tap') };
  var $_fvndowvjcg9mda7 = {
    focus: $_7bfl0mwajcg9md92.constant('alloy.focus'),
    postBlur: $_7bfl0mwajcg9md92.constant('alloy.blur.post'),
    receive: $_7bfl0mwajcg9md92.constant('alloy.receive'),
    execute: $_7bfl0mwajcg9md92.constant('alloy.execute'),
    focusItem: $_7bfl0mwajcg9md92.constant('alloy.focus.item'),
    tap: alloy.tap,
    tapOrClick: $_37ytsswfjcg9md9a.detect().deviceType.isTouch() ? alloy.tap : $_f4bxsewwjcg9mdab.click,
    longpress: $_7bfl0mwajcg9md92.constant('alloy.longpress'),
    sandboxClose: $_7bfl0mwajcg9md92.constant('alloy.sandbox.close'),
    systemInit: $_7bfl0mwajcg9md92.constant('alloy.system.init'),
    windowScroll: $_7bfl0mwajcg9md92.constant('alloy.system.scroll'),
    attachedToDom: $_7bfl0mwajcg9md92.constant('alloy.system.attached'),
    detachedFromDom: $_7bfl0mwajcg9md92.constant('alloy.system.detached'),
    changeTab: $_7bfl0mwajcg9md92.constant('alloy.change.tab'),
    dismissTab: $_7bfl0mwajcg9md92.constant('alloy.dismiss.tab')
  };

  var typeOf = function (x) {
    if (x === null)
      return 'null';
    var t = typeof x;
    if (t === 'object' && Array.prototype.isPrototypeOf(x))
      return 'array';
    if (t === 'object' && String.prototype.isPrototypeOf(x))
      return 'string';
    return t;
  };
  var isType = function (type) {
    return function (value) {
      return typeOf(value) === type;
    };
  };
  var $_dkt1fwyjcg9mdaf = {
    isString: isType('string'),
    isObject: isType('object'),
    isArray: isType('array'),
    isNull: isType('null'),
    isBoolean: isType('boolean'),
    isUndefined: isType('undefined'),
    isFunction: isType('function'),
    isNumber: isType('number')
  };

  var shallow = function (old, nu) {
    return nu;
  };
  var deep = function (old, nu) {
    var bothObjects = $_dkt1fwyjcg9mdaf.isObject(old) && $_dkt1fwyjcg9mdaf.isObject(nu);
    return bothObjects ? deepMerge(old, nu) : nu;
  };
  var baseMerge = function (merger) {
    return function () {
      var objects = new Array(arguments.length);
      for (var i = 0; i < objects.length; i++)
        objects[i] = arguments[i];
      if (objects.length === 0)
        throw new Error('Can\'t merge zero objects');
      var ret = {};
      for (var j = 0; j < objects.length; j++) {
        var curObject = objects[j];
        for (var key in curObject)
          if (curObject.hasOwnProperty(key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
      }
      return ret;
    };
  };
  var deepMerge = baseMerge(deep);
  var merge = baseMerge(shallow);
  var $_4xvhzgwxjcg9mdae = {
    deepMerge: deepMerge,
    merge: merge
  };

  var keys = function () {
    var fastKeys = Object.keys;
    var slowKeys = function (o) {
      var r = [];
      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          r.push(i);
        }
      }
      return r;
    };
    return fastKeys === undefined ? slowKeys : fastKeys;
  }();
  var each$1 = function (obj, f) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      f(x, i, obj);
    }
  };
  var objectMap = function (obj, f) {
    return tupleMap(obj, function (x, i, obj) {
      return {
        k: i,
        v: f(x, i, obj)
      };
    });
  };
  var tupleMap = function (obj, f) {
    var r = {};
    each$1(obj, function (x, i) {
      var tuple = f(x, i, obj);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  var bifilter = function (obj, pred) {
    var t = {};
    var f = {};
    each$1(obj, function (x, i) {
      var branch = pred(x, i) ? t : f;
      branch[i] = x;
    });
    return {
      t: t,
      f: f
    };
  };
  var mapToArray = function (obj, f) {
    var r = [];
    each$1(obj, function (value, name) {
      r.push(f(value, name));
    });
    return r;
  };
  var find$2 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return $_gb5srhw9jcg9md90.some(x);
      }
    }
    return $_gb5srhw9jcg9md90.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_9is1m7wzjcg9mdag = {
    bifilter: bifilter,
    each: each$1,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$2,
    keys: keys,
    values: values,
    size: size
  };

  var emit = function (component, event) {
    dispatchWith(component, component.element(), event, {});
  };
  var emitWith = function (component, event, properties) {
    dispatchWith(component, component.element(), event, properties);
  };
  var emitExecute = function (component) {
    emit(component, $_fvndowvjcg9mda7.execute());
  };
  var dispatch = function (component, target, event) {
    dispatchWith(component, target, event, {});
  };
  var dispatchWith = function (component, target, event, properties) {
    var data = $_4xvhzgwxjcg9mdae.deepMerge({ target: target }, properties);
    component.getSystem().triggerEvent(event, target, $_9is1m7wzjcg9mdag.map(data, $_7bfl0mwajcg9md92.constant));
  };
  var dispatchEvent = function (component, target, event, simulatedEvent) {
    component.getSystem().triggerEvent(event, target, simulatedEvent.event());
  };
  var dispatchFocus = function (component, target) {
    component.getSystem().triggerFocus(target, component.element());
  };
  var $_4wv38zwujcg9mda1 = {
    emit: emit,
    emitWith: emitWith,
    emitExecute: emitExecute,
    dispatch: dispatch,
    dispatchWith: dispatchWith,
    dispatchEvent: dispatchEvent,
    dispatchFocus: dispatchFocus
  };

  var generate = function (cases) {
    if (!$_dkt1fwyjcg9mdaf.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_gcfqi6w8jcg9md8v.each(cases, function (acase, count) {
      var keys = $_9is1m7wzjcg9mdag.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_dkt1fwyjcg9mdaf.isArray(value)) {
        throw new Error('case arguments must be an array');
      }
      constructors.push(key);
      adt[key] = function () {
        var argLength = arguments.length;
        if (argLength !== value.length) {
          throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
        }
        var args = new Array(argLength);
        for (var i = 0; i < args.length; i++)
          args[i] = arguments[i];
        var match = function (branches) {
          var branchKeys = $_9is1m7wzjcg9mdag.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_gcfqi6w8jcg9md8v.forall(constructors, function (reqKey) {
            return $_gcfqi6w8jcg9md8v.contains(branchKeys, reqKey);
          });
          if (!allReqd)
            throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
          return branches[key].apply(null, args);
        };
        return {
          fold: function () {
            if (arguments.length !== cases.length) {
              throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
            }
            var target = arguments[count];
            return target.apply(null, args);
          },
          match: match,
          log: function (label) {
            console.log(label, {
              constructors: constructors,
              constructor: key,
              params: args
            });
          }
        };
      };
    });
    return adt;
  };
  var $_4xy8cmx3jcg9mdb7 = { generate: generate };

  var adt = $_4xy8cmx3jcg9mdb7.generate([
    { strict: [] },
    { defaultedThunk: ['fallbackThunk'] },
    { asOption: [] },
    { asDefaultedOptionThunk: ['fallbackThunk'] },
    { mergeWithThunk: ['baseThunk'] }
  ]);
  var defaulted$1 = function (fallback) {
    return adt.defaultedThunk($_7bfl0mwajcg9md92.constant(fallback));
  };
  var asDefaultedOption = function (fallback) {
    return adt.asDefaultedOptionThunk($_7bfl0mwajcg9md92.constant(fallback));
  };
  var mergeWith = function (base) {
    return adt.mergeWithThunk($_7bfl0mwajcg9md92.constant(base));
  };
  var $_amdqrdx2jcg9mdb3 = {
    strict: adt.strict,
    asOption: adt.asOption,
    defaulted: defaulted$1,
    defaultedThunk: adt.defaultedThunk,
    asDefaultedOption: asDefaultedOption,
    asDefaultedOptionThunk: adt.asDefaultedOptionThunk,
    mergeWith: mergeWith,
    mergeWithThunk: adt.mergeWithThunk
  };

  var value$1 = function (o) {
    var is = function (v) {
      return o === v;
    };
    var or = function (opt) {
      return value$1(o);
    };
    var orThunk = function (f) {
      return value$1(o);
    };
    var map = function (f) {
      return value$1(f(o));
    };
    var each = function (f) {
      f(o);
    };
    var bind = function (f) {
      return f(o);
    };
    var fold = function (_, onValue) {
      return onValue(o);
    };
    var exists = function (f) {
      return f(o);
    };
    var forall = function (f) {
      return f(o);
    };
    var toOption = function () {
      return $_gb5srhw9jcg9md90.some(o);
    };
    return {
      is: is,
      isValue: $_7bfl0mwajcg9md92.constant(true),
      isError: $_7bfl0mwajcg9md92.constant(false),
      getOr: $_7bfl0mwajcg9md92.constant(o),
      getOrThunk: $_7bfl0mwajcg9md92.constant(o),
      getOrDie: $_7bfl0mwajcg9md92.constant(o),
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: each,
      bind: bind,
      exists: exists,
      forall: forall,
      toOption: toOption
    };
  };
  var error = function (message) {
    var getOrThunk = function (f) {
      return f();
    };
    var getOrDie = function () {
      return $_7bfl0mwajcg9md92.die(message)();
    };
    var or = function (opt) {
      return opt;
    };
    var orThunk = function (f) {
      return f();
    };
    var map = function (f) {
      return error(message);
    };
    var bind = function (f) {
      return error(message);
    };
    var fold = function (onError, _) {
      return onError(message);
    };
    return {
      is: $_7bfl0mwajcg9md92.constant(false),
      isValue: $_7bfl0mwajcg9md92.constant(false),
      isError: $_7bfl0mwajcg9md92.constant(true),
      getOr: $_7bfl0mwajcg9md92.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_7bfl0mwajcg9md92.noop,
      bind: bind,
      exists: $_7bfl0mwajcg9md92.constant(false),
      forall: $_7bfl0mwajcg9md92.constant(true),
      toOption: $_gb5srhw9jcg9md90.none
    };
  };
  var $_exyfurx7jcg9mdbv = {
    value: value$1,
    error: error
  };

  var comparison = $_4xy8cmx3jcg9mdb7.generate([
    {
      bothErrors: [
        'error1',
        'error2'
      ]
    },
    {
      firstError: [
        'error1',
        'value2'
      ]
    },
    {
      secondError: [
        'value1',
        'error2'
      ]
    },
    {
      bothValues: [
        'value1',
        'value2'
      ]
    }
  ]);
  var partition$1 = function (results) {
    var errors = [];
    var values = [];
    $_gcfqi6w8jcg9md8v.each(results, function (result) {
      result.fold(function (err) {
        errors.push(err);
      }, function (value) {
        values.push(value);
      });
    });
    return {
      errors: errors,
      values: values
    };
  };
  var compare = function (result1, result2) {
    return result1.fold(function (err1) {
      return result2.fold(function (err2) {
        return comparison.bothErrors(err1, err2);
      }, function (val2) {
        return comparison.firstError(err1, val2);
      });
    }, function (val1) {
      return result2.fold(function (err2) {
        return comparison.secondError(val1, err2);
      }, function (val2) {
        return comparison.bothValues(val1, val2);
      });
    });
  };
  var $_g53wd8x8jcg9mdbx = {
    partition: partition$1,
    compare: compare
  };

  var mergeValues = function (values, base) {
    return $_exyfurx7jcg9mdbv.value($_4xvhzgwxjcg9mdae.deepMerge.apply(undefined, [base].concat(values)));
  };
  var mergeErrors = function (errors) {
    return $_7bfl0mwajcg9md92.compose($_exyfurx7jcg9mdbv.error, $_gcfqi6w8jcg9md8v.flatten)(errors);
  };
  var consolidateObj = function (objects, base) {
    var partitions = $_g53wd8x8jcg9mdbx.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
  };
  var consolidateArr = function (objects) {
    var partitions = $_g53wd8x8jcg9mdbx.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : $_exyfurx7jcg9mdbv.value(partitions.values);
  };
  var $_f6ljz3x6jcg9mdbo = {
    consolidateObj: consolidateObj,
    consolidateArr: consolidateArr
  };

  var narrow$1 = function (obj, fields) {
    var r = {};
    $_gcfqi6w8jcg9md8v.each(fields, function (field) {
      if (obj[field] !== undefined && obj.hasOwnProperty(field))
        r[field] = obj[field];
    });
    return r;
  };
  var indexOnKey$1 = function (array, key) {
    var obj = {};
    $_gcfqi6w8jcg9md8v.each(array, function (a) {
      var keyValue = a[key];
      obj[keyValue] = a;
    });
    return obj;
  };
  var exclude$1 = function (obj, fields) {
    var r = {};
    $_9is1m7wzjcg9mdag.each(obj, function (v, k) {
      if (!$_gcfqi6w8jcg9md8v.contains(fields, k)) {
        r[k] = v;
      }
    });
    return r;
  };
  var $_99ronmx9jcg9mdc1 = {
    narrow: narrow$1,
    exclude: exclude$1,
    indexOnKey: indexOnKey$1
  };

  var readOpt$1 = function (key) {
    return function (obj) {
      return obj.hasOwnProperty(key) ? $_gb5srhw9jcg9md90.from(obj[key]) : $_gb5srhw9jcg9md90.none();
    };
  };
  var readOr$1 = function (key, fallback) {
    return function (obj) {
      return readOpt$1(key)(obj).getOr(fallback);
    };
  };
  var readOptFrom$1 = function (obj, key) {
    return readOpt$1(key)(obj);
  };
  var hasKey$1 = function (obj, key) {
    return obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null;
  };
  var $_400me0xajcg9mdc5 = {
    readOpt: readOpt$1,
    readOr: readOr$1,
    readOptFrom: readOptFrom$1,
    hasKey: hasKey$1
  };

  var wrap$1 = function (key, value) {
    var r = {};
    r[key] = value;
    return r;
  };
  var wrapAll$1 = function (keyvalues) {
    var r = {};
    $_gcfqi6w8jcg9md8v.each(keyvalues, function (kv) {
      r[kv.key] = kv.value;
    });
    return r;
  };
  var $_5yzxfuxbjcg9mdc7 = {
    wrap: wrap$1,
    wrapAll: wrapAll$1
  };

  var narrow = function (obj, fields) {
    return $_99ronmx9jcg9mdc1.narrow(obj, fields);
  };
  var exclude = function (obj, fields) {
    return $_99ronmx9jcg9mdc1.exclude(obj, fields);
  };
  var readOpt = function (key) {
    return $_400me0xajcg9mdc5.readOpt(key);
  };
  var readOr = function (key, fallback) {
    return $_400me0xajcg9mdc5.readOr(key, fallback);
  };
  var readOptFrom = function (obj, key) {
    return $_400me0xajcg9mdc5.readOptFrom(obj, key);
  };
  var wrap = function (key, value) {
    return $_5yzxfuxbjcg9mdc7.wrap(key, value);
  };
  var wrapAll = function (keyvalues) {
    return $_5yzxfuxbjcg9mdc7.wrapAll(keyvalues);
  };
  var indexOnKey = function (array, key) {
    return $_99ronmx9jcg9mdc1.indexOnKey(array, key);
  };
  var consolidate = function (objs, base) {
    return $_f6ljz3x6jcg9mdbo.consolidateObj(objs, base);
  };
  var hasKey = function (obj, key) {
    return $_400me0xajcg9mdc5.hasKey(obj, key);
  };
  var $_1ohhokx5jcg9mdbm = {
    narrow: narrow,
    exclude: exclude,
    readOpt: readOpt,
    readOr: readOr,
    readOptFrom: readOptFrom,
    wrap: wrap,
    wrapAll: wrapAll,
    indexOnKey: indexOnKey,
    hasKey: hasKey,
    consolidate: consolidate
  };

  var json = function () {
    return $_eq8elgwcjcg9md97.getOrDie('JSON');
  };
  var parse = function (obj) {
    return json().parse(obj);
  };
  var stringify = function (obj, replacer, space) {
    return json().stringify(obj, replacer, space);
  };
  var $_3oduxxejcg9mdci = {
    parse: parse,
    stringify: stringify
  };

  var formatObj = function (input) {
    return $_dkt1fwyjcg9mdaf.isObject(input) && $_9is1m7wzjcg9mdag.keys(input).length > 100 ? ' removed due to size' : $_3oduxxejcg9mdci.stringify(input, null, 2);
  };
  var formatErrors = function (errors) {
    var es = errors.length > 10 ? errors.slice(0, 10).concat([{
        path: [],
        getErrorInfo: function () {
          return '... (only showing first ten failures)';
        }
      }]) : errors;
    return $_gcfqi6w8jcg9md8v.map(es, function (e) {
      return 'Failed path: (' + e.path.join(' > ') + ')\n' + e.getErrorInfo();
    });
  };
  var $_3lyil8xdjcg9mdcd = {
    formatObj: formatObj,
    formatErrors: formatErrors
  };

  var nu$4 = function (path, getErrorInfo) {
    return $_exyfurx7jcg9mdbv.error([{
        path: path,
        getErrorInfo: getErrorInfo
      }]);
  };
  var missingStrict = function (path, key, obj) {
    return nu$4(path, function () {
      return 'Could not find valid *strict* value for "' + key + '" in ' + $_3lyil8xdjcg9mdcd.formatObj(obj);
    });
  };
  var missingKey = function (path, key) {
    return nu$4(path, function () {
      return 'Choice schema did not contain choice key: "' + key + '"';
    });
  };
  var missingBranch = function (path, branches, branch) {
    return nu$4(path, function () {
      return 'The chosen schema: "' + branch + '" did not exist in branches: ' + $_3lyil8xdjcg9mdcd.formatObj(branches);
    });
  };
  var unsupportedFields = function (path, unsupported) {
    return nu$4(path, function () {
      return 'There are unsupported fields: [' + unsupported.join(', ') + '] specified';
    });
  };
  var custom = function (path, err) {
    return nu$4(path, function () {
      return err;
    });
  };
  var toString = function (error) {
    return 'Failed path: (' + error.path.join(' > ') + ')\n' + error.getErrorInfo();
  };
  var $_f0pzhxcjcg9mdca = {
    missingStrict: missingStrict,
    missingKey: missingKey,
    missingBranch: missingBranch,
    unsupportedFields: unsupportedFields,
    custom: custom,
    toString: toString
  };

  var typeAdt = $_4xy8cmx3jcg9mdb7.generate([
    {
      setOf: [
        'validator',
        'valueType'
      ]
    },
    { arrOf: ['valueType'] },
    { objOf: ['fields'] },
    { itemOf: ['validator'] },
    {
      choiceOf: [
        'key',
        'branches'
      ]
    }
  ]);
  var fieldAdt = $_4xy8cmx3jcg9mdb7.generate([
    {
      field: [
        'name',
        'presence',
        'type'
      ]
    },
    { state: ['name'] }
  ]);
  var $_9u6d6exfjcg9mdck = {
    typeAdt: typeAdt,
    fieldAdt: fieldAdt
  };

  var adt$1 = $_4xy8cmx3jcg9mdb7.generate([
    {
      field: [
        'key',
        'okey',
        'presence',
        'prop'
      ]
    },
    {
      state: [
        'okey',
        'instantiator'
      ]
    }
  ]);
  var output = function (okey, value) {
    return adt$1.state(okey, $_7bfl0mwajcg9md92.constant(value));
  };
  var snapshot = function (okey) {
    return adt$1.state(okey, $_7bfl0mwajcg9md92.identity);
  };
  var strictAccess = function (path, obj, key) {
    return $_400me0xajcg9mdc5.readOptFrom(obj, key).fold(function () {
      return $_f0pzhxcjcg9mdca.missingStrict(path, key, obj);
    }, $_exyfurx7jcg9mdbv.value);
  };
  var fallbackAccess = function (obj, key, fallbackThunk) {
    var v = $_400me0xajcg9mdc5.readOptFrom(obj, key).fold(function () {
      return fallbackThunk(obj);
    }, $_7bfl0mwajcg9md92.identity);
    return $_exyfurx7jcg9mdbv.value(v);
  };
  var optionAccess = function (obj, key) {
    return $_exyfurx7jcg9mdbv.value($_400me0xajcg9mdc5.readOptFrom(obj, key));
  };
  var optionDefaultedAccess = function (obj, key, fallback) {
    var opt = $_400me0xajcg9mdc5.readOptFrom(obj, key).map(function (val) {
      return val === true ? fallback(obj) : val;
    });
    return $_exyfurx7jcg9mdbv.value(opt);
  };
  var cExtractOne = function (path, obj, field, strength) {
    return field.fold(function (key, okey, presence, prop) {
      var bundle = function (av) {
        return prop.extract(path.concat([key]), strength, av).map(function (res) {
          return $_5yzxfuxbjcg9mdc7.wrap(okey, strength(res));
        });
      };
      var bundleAsOption = function (optValue) {
        return optValue.fold(function () {
          var outcome = $_5yzxfuxbjcg9mdc7.wrap(okey, strength($_gb5srhw9jcg9md90.none()));
          return $_exyfurx7jcg9mdbv.value(outcome);
        }, function (ov) {
          return prop.extract(path.concat([key]), strength, ov).map(function (res) {
            return $_5yzxfuxbjcg9mdc7.wrap(okey, strength($_gb5srhw9jcg9md90.some(res)));
          });
        });
      };
      return function () {
        return presence.fold(function () {
          return strictAccess(path, obj, key).bind(bundle);
        }, function (fallbackThunk) {
          return fallbackAccess(obj, key, fallbackThunk).bind(bundle);
        }, function () {
          return optionAccess(obj, key).bind(bundleAsOption);
        }, function (fallbackThunk) {
          return optionDefaultedAccess(obj, key, fallbackThunk).bind(bundleAsOption);
        }, function (baseThunk) {
          var base = baseThunk(obj);
          return fallbackAccess(obj, key, $_7bfl0mwajcg9md92.constant({})).map(function (v) {
            return $_4xvhzgwxjcg9mdae.deepMerge(base, v);
          }).bind(bundle);
        });
      }();
    }, function (okey, instantiator) {
      var state = instantiator(obj);
      return $_exyfurx7jcg9mdbv.value($_5yzxfuxbjcg9mdc7.wrap(okey, strength(state)));
    });
  };
  var cExtract = function (path, obj, fields, strength) {
    var results = $_gcfqi6w8jcg9md8v.map(fields, function (field) {
      return cExtractOne(path, obj, field, strength);
    });
    return $_f6ljz3x6jcg9mdbo.consolidateObj(results, {});
  };
  var value = function (validator) {
    var extract = function (path, strength, val) {
      return validator(val).fold(function (err) {
        return $_f0pzhxcjcg9mdca.custom(path, err);
      }, $_exyfurx7jcg9mdbv.value);
    };
    var toString = function () {
      return 'val';
    };
    var toDsl = function () {
      return $_9u6d6exfjcg9mdck.typeAdt.itemOf(validator);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var getSetKeys = function (obj) {
    var keys = $_9is1m7wzjcg9mdag.keys(obj);
    return $_gcfqi6w8jcg9md8v.filter(keys, function (k) {
      return $_1ohhokx5jcg9mdbm.hasKey(obj, k);
    });
  };
  var objOnly = function (fields) {
    var delegate = obj(fields);
    var fieldNames = $_gcfqi6w8jcg9md8v.foldr(fields, function (acc, f) {
      return f.fold(function (key) {
        return $_4xvhzgwxjcg9mdae.deepMerge(acc, $_1ohhokx5jcg9mdbm.wrap(key, true));
      }, $_7bfl0mwajcg9md92.constant(acc));
    }, {});
    var extract = function (path, strength, o) {
      var keys = $_dkt1fwyjcg9mdaf.isBoolean(o) ? [] : getSetKeys(o);
      var extra = $_gcfqi6w8jcg9md8v.filter(keys, function (k) {
        return !$_1ohhokx5jcg9mdbm.hasKey(fieldNames, k);
      });
      return extra.length === 0 ? delegate.extract(path, strength, o) : $_f0pzhxcjcg9mdca.unsupportedFields(path, extra);
    };
    return {
      extract: extract,
      toString: delegate.toString,
      toDsl: delegate.toDsl
    };
  };
  var obj = function (fields) {
    var extract = function (path, strength, o) {
      return cExtract(path, o, fields, strength);
    };
    var toString = function () {
      var fieldStrings = $_gcfqi6w8jcg9md8v.map(fields, function (field) {
        return field.fold(function (key, okey, presence, prop) {
          return key + ' -> ' + prop.toString();
        }, function (okey, instantiator) {
          return 'state(' + okey + ')';
        });
      });
      return 'obj{\n' + fieldStrings.join('\n') + '}';
    };
    var toDsl = function () {
      return $_9u6d6exfjcg9mdck.typeAdt.objOf($_gcfqi6w8jcg9md8v.map(fields, function (f) {
        return f.fold(function (key, okey, presence, prop) {
          return $_9u6d6exfjcg9mdck.fieldAdt.field(key, presence, prop);
        }, function (okey, instantiator) {
          return $_9u6d6exfjcg9mdck.fieldAdt.state(okey);
        });
      }));
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var arr = function (prop) {
    var extract = function (path, strength, array) {
      var results = $_gcfqi6w8jcg9md8v.map(array, function (a, i) {
        return prop.extract(path.concat(['[' + i + ']']), strength, a);
      });
      return $_f6ljz3x6jcg9mdbo.consolidateArr(results);
    };
    var toString = function () {
      return 'array(' + prop.toString() + ')';
    };
    var toDsl = function () {
      return $_9u6d6exfjcg9mdck.typeAdt.arrOf(prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var setOf = function (validator, prop) {
    var validateKeys = function (path, keys) {
      return arr(value(validator)).extract(path, $_7bfl0mwajcg9md92.identity, keys);
    };
    var extract = function (path, strength, o) {
      var keys = $_9is1m7wzjcg9mdag.keys(o);
      return validateKeys(path, keys).bind(function (validKeys) {
        var schema = $_gcfqi6w8jcg9md8v.map(validKeys, function (vk) {
          return adt$1.field(vk, vk, $_amdqrdx2jcg9mdb3.strict(), prop);
        });
        return obj(schema).extract(path, strength, o);
      });
    };
    var toString = function () {
      return 'setOf(' + prop.toString() + ')';
    };
    var toDsl = function () {
      return $_9u6d6exfjcg9mdck.typeAdt.setOf(validator, prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var anyValue = value($_exyfurx7jcg9mdbv.value);
  var arrOfObj = $_7bfl0mwajcg9md92.compose(arr, obj);
  var $_8c98uix4jcg9mdba = {
    anyValue: $_7bfl0mwajcg9md92.constant(anyValue),
    value: value,
    obj: obj,
    objOnly: objOnly,
    arr: arr,
    setOf: setOf,
    arrOfObj: arrOfObj,
    state: adt$1.state,
    field: adt$1.field,
    output: output,
    snapshot: snapshot
  };

  var strict = function (key) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.strict(), $_8c98uix4jcg9mdba.anyValue());
  };
  var strictOf = function (key, schema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.strict(), schema);
  };
  var strictFunction = function (key) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.strict(), $_8c98uix4jcg9mdba.value(function (f) {
      return $_dkt1fwyjcg9mdaf.isFunction(f) ? $_exyfurx7jcg9mdbv.value(f) : $_exyfurx7jcg9mdbv.error('Not a function');
    }));
  };
  var forbid = function (key, message) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.asOption(), $_8c98uix4jcg9mdba.value(function (v) {
      return $_exyfurx7jcg9mdbv.error('The field: ' + key + ' is forbidden. ' + message);
    }));
  };
  var strictArrayOf = function (key, prop) {
    return strictOf(key, prop);
  };
  var strictObjOf = function (key, objSchema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.strict(), $_8c98uix4jcg9mdba.obj(objSchema));
  };
  var strictArrayOfObj = function (key, objFields) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.strict(), $_8c98uix4jcg9mdba.arrOfObj(objFields));
  };
  var option = function (key) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.asOption(), $_8c98uix4jcg9mdba.anyValue());
  };
  var optionOf = function (key, schema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.asOption(), schema);
  };
  var optionObjOf = function (key, objSchema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.asOption(), $_8c98uix4jcg9mdba.obj(objSchema));
  };
  var optionObjOfOnly = function (key, objSchema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.asOption(), $_8c98uix4jcg9mdba.objOnly(objSchema));
  };
  var defaulted = function (key, fallback) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.defaulted(fallback), $_8c98uix4jcg9mdba.anyValue());
  };
  var defaultedOf = function (key, fallback, schema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.defaulted(fallback), schema);
  };
  var defaultedObjOf = function (key, fallback, objSchema) {
    return $_8c98uix4jcg9mdba.field(key, key, $_amdqrdx2jcg9mdb3.defaulted(fallback), $_8c98uix4jcg9mdba.obj(objSchema));
  };
  var field = function (key, okey, presence, prop) {
    return $_8c98uix4jcg9mdba.field(key, okey, presence, prop);
  };
  var state = function (okey, instantiator) {
    return $_8c98uix4jcg9mdba.state(okey, instantiator);
  };
  var $_5g6e15x1jcg9mdax = {
    strict: strict,
    strictOf: strictOf,
    strictObjOf: strictObjOf,
    strictArrayOf: strictArrayOf,
    strictArrayOfObj: strictArrayOfObj,
    strictFunction: strictFunction,
    forbid: forbid,
    option: option,
    optionOf: optionOf,
    optionObjOf: optionObjOf,
    optionObjOfOnly: optionObjOfOnly,
    defaulted: defaulted,
    defaultedOf: defaultedOf,
    defaultedObjOf: defaultedObjOf,
    field: field,
    state: state
  };

  var chooseFrom = function (path, strength, input, branches, ch) {
    var fields = $_1ohhokx5jcg9mdbm.readOptFrom(branches, ch);
    return fields.fold(function () {
      return $_f0pzhxcjcg9mdca.missingBranch(path, branches, ch);
    }, function (fs) {
      return $_8c98uix4jcg9mdba.obj(fs).extract(path.concat(['branch: ' + ch]), strength, input);
    });
  };
  var choose$1 = function (key, branches) {
    var extract = function (path, strength, input) {
      var choice = $_1ohhokx5jcg9mdbm.readOptFrom(input, key);
      return choice.fold(function () {
        return $_f0pzhxcjcg9mdca.missingKey(path, key);
      }, function (chosen) {
        return chooseFrom(path, strength, input, branches, chosen);
      });
    };
    var toString = function () {
      return 'chooseOn(' + key + '). Possible values: ' + $_9is1m7wzjcg9mdag.keys(branches);
    };
    var toDsl = function () {
      return $_9u6d6exfjcg9mdck.typeAdt.choiceOf(key, branches);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var $_6jrkoaxhjcg9mdct = { choose: choose$1 };

  var anyValue$1 = $_8c98uix4jcg9mdba.value($_exyfurx7jcg9mdbv.value);
  var arrOfObj$1 = function (objFields) {
    return $_8c98uix4jcg9mdba.arrOfObj(objFields);
  };
  var arrOfVal = function () {
    return $_8c98uix4jcg9mdba.arr(anyValue$1);
  };
  var arrOf = $_8c98uix4jcg9mdba.arr;
  var objOf = $_8c98uix4jcg9mdba.obj;
  var objOfOnly = $_8c98uix4jcg9mdba.objOnly;
  var setOf$1 = $_8c98uix4jcg9mdba.setOf;
  var valueOf = function (validator) {
    return $_8c98uix4jcg9mdba.value(validator);
  };
  var extract = function (label, prop, strength, obj) {
    return prop.extract([label], strength, obj).fold(function (errs) {
      return $_exyfurx7jcg9mdbv.error({
        input: obj,
        errors: errs
      });
    }, $_exyfurx7jcg9mdbv.value);
  };
  var asStruct = function (label, prop, obj) {
    return extract(label, prop, $_7bfl0mwajcg9md92.constant, obj);
  };
  var asRaw = function (label, prop, obj) {
    return extract(label, prop, $_7bfl0mwajcg9md92.identity, obj);
  };
  var getOrDie$1 = function (extraction) {
    return extraction.fold(function (errInfo) {
      throw new Error(formatError(errInfo));
    }, $_7bfl0mwajcg9md92.identity);
  };
  var asRawOrDie = function (label, prop, obj) {
    return getOrDie$1(asRaw(label, prop, obj));
  };
  var asStructOrDie = function (label, prop, obj) {
    return getOrDie$1(asStruct(label, prop, obj));
  };
  var formatError = function (errInfo) {
    return 'Errors: \n' + $_3lyil8xdjcg9mdcd.formatErrors(errInfo.errors) + '\n\nInput object: ' + $_3lyil8xdjcg9mdcd.formatObj(errInfo.input);
  };
  var choose = function (key, branches) {
    return $_6jrkoaxhjcg9mdct.choose(key, branches);
  };
  var $_96sv3hxgjcg9mdco = {
    anyValue: $_7bfl0mwajcg9md92.constant(anyValue$1),
    arrOfObj: arrOfObj$1,
    arrOf: arrOf,
    arrOfVal: arrOfVal,
    valueOf: valueOf,
    setOf: setOf$1,
    objOf: objOf,
    objOfOnly: objOfOnly,
    asStruct: asStruct,
    asRaw: asRaw,
    asStructOrDie: asStructOrDie,
    asRawOrDie: asRawOrDie,
    getOrDie: getOrDie$1,
    formatError: formatError,
    choose: choose
  };

  var nu$3 = function (parts) {
    if (!$_1ohhokx5jcg9mdbm.hasKey(parts, 'can') && !$_1ohhokx5jcg9mdbm.hasKey(parts, 'abort') && !$_1ohhokx5jcg9mdbm.hasKey(parts, 'run'))
      throw new Error('EventHandler defined by: ' + $_3oduxxejcg9mdci.stringify(parts, null, 2) + ' does not have can, abort, or run!');
    return $_96sv3hxgjcg9mdco.asRawOrDie('Extracting event.handler', $_96sv3hxgjcg9mdco.objOfOnly([
      $_5g6e15x1jcg9mdax.defaulted('can', $_7bfl0mwajcg9md92.constant(true)),
      $_5g6e15x1jcg9mdax.defaulted('abort', $_7bfl0mwajcg9md92.constant(false)),
      $_5g6e15x1jcg9mdax.defaulted('run', $_7bfl0mwajcg9md92.noop)
    ]), parts);
  };
  var all$1 = function (handlers, f) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return $_gcfqi6w8jcg9md8v.foldl(handlers, function (acc, handler) {
        return acc && f(handler).apply(undefined, args);
      }, true);
    };
  };
  var any = function (handlers, f) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return $_gcfqi6w8jcg9md8v.foldl(handlers, function (acc, handler) {
        return acc || f(handler).apply(undefined, args);
      }, false);
    };
  };
  var read = function (handler) {
    return $_dkt1fwyjcg9mdaf.isFunction(handler) ? {
      can: $_7bfl0mwajcg9md92.constant(true),
      abort: $_7bfl0mwajcg9md92.constant(false),
      run: handler
    } : handler;
  };
  var fuse = function (handlers) {
    var can = all$1(handlers, function (handler) {
      return handler.can;
    });
    var abort = any(handlers, function (handler) {
      return handler.abort;
    });
    var run = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      $_gcfqi6w8jcg9md8v.each(handlers, function (handler) {
        handler.run.apply(undefined, args);
      });
    };
    return nu$3({
      can: can,
      abort: abort,
      run: run
    });
  };
  var $_3s7cjwx0jcg9mdal = {
    read: read,
    fuse: fuse,
    nu: nu$3
  };

  var derive$1 = $_1ohhokx5jcg9mdbm.wrapAll;
  var abort = function (name, predicate) {
    return {
      key: name,
      value: $_3s7cjwx0jcg9mdal.nu({ abort: predicate })
    };
  };
  var can = function (name, predicate) {
    return {
      key: name,
      value: $_3s7cjwx0jcg9mdal.nu({ can: predicate })
    };
  };
  var preventDefault = function (name) {
    return {
      key: name,
      value: $_3s7cjwx0jcg9mdal.nu({
        run: function (component, simulatedEvent) {
          simulatedEvent.event().prevent();
        }
      })
    };
  };
  var run = function (name, handler) {
    return {
      key: name,
      value: $_3s7cjwx0jcg9mdal.nu({ run: handler })
    };
  };
  var runActionExtra = function (name, action, extra) {
    return {
      key: name,
      value: $_3s7cjwx0jcg9mdal.nu({
        run: function (component) {
          action.apply(undefined, [component].concat(extra));
        }
      })
    };
  };
  var runOnName = function (name) {
    return function (handler) {
      return run(name, handler);
    };
  };
  var runOnSourceName = function (name) {
    return function (handler) {
      return {
        key: name,
        value: $_3s7cjwx0jcg9mdal.nu({
          run: function (component, simulatedEvent) {
            if ($_6cqutnw6jcg9md8k.isSource(component, simulatedEvent))
              handler(component, simulatedEvent);
          }
        })
      };
    };
  };
  var redirectToUid = function (name, uid) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByUid(uid).each(function (redirectee) {
        $_4wv38zwujcg9mda1.dispatchEvent(redirectee, redirectee.element(), name, simulatedEvent);
      });
    });
  };
  var redirectToPart = function (name, detail, partName) {
    var uid = detail.partUids()[partName];
    return redirectToUid(name, uid);
  };
  var runWithTarget = function (name, f) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByDom(simulatedEvent.event().target()).each(function (target) {
        f(component, target, simulatedEvent);
      });
    });
  };
  var cutter = function (name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.cut();
    });
  };
  var stopper = function (name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.stop();
    });
  };
  var $_v93nkw5jcg9md8g = {
    derive: derive$1,
    run: run,
    preventDefault: preventDefault,
    runActionExtra: runActionExtra,
    runOnAttached: runOnSourceName($_fvndowvjcg9mda7.attachedToDom()),
    runOnDetached: runOnSourceName($_fvndowvjcg9mda7.detachedFromDom()),
    runOnInit: runOnSourceName($_fvndowvjcg9mda7.systemInit()),
    runOnExecute: runOnName($_fvndowvjcg9mda7.execute()),
    redirectToUid: redirectToUid,
    redirectToPart: redirectToPart,
    runWithTarget: runWithTarget,
    abort: abort,
    can: can,
    cutter: cutter,
    stopper: stopper
  };

  var markAsBehaviourApi = function (f, apiName, apiFunction) {
    return f;
  };
  var markAsExtraApi = function (f, extraName) {
    return f;
  };
  var markAsSketchApi = function (f, apiFunction) {
    return f;
  };
  var getAnnotation = $_gb5srhw9jcg9md90.none;
  var $_df0y3qxijcg9mdcx = {
    markAsBehaviourApi: markAsBehaviourApi,
    markAsExtraApi: markAsExtraApi,
    markAsSketchApi: markAsSketchApi,
    getAnnotation: getAnnotation
  };

  var Immutable = function () {
    var fields = arguments;
    return function () {
      var values = new Array(arguments.length);
      for (var i = 0; i < values.length; i++)
        values[i] = arguments[i];
      if (fields.length !== values.length)
        throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');
      var struct = {};
      $_gcfqi6w8jcg9md8v.each(fields, function (name, i) {
        struct[name] = $_7bfl0mwajcg9md92.constant(values[i]);
      });
      return struct;
    };
  };

  var sort$1 = function (arr) {
    return arr.slice(0).sort();
  };
  var reqMessage = function (required, keys) {
    throw new Error('All required keys (' + sort$1(required).join(', ') + ') were not specified. Specified keys were: ' + sort$1(keys).join(', ') + '.');
  };
  var unsuppMessage = function (unsupported) {
    throw new Error('Unsupported keys for object: ' + sort$1(unsupported).join(', '));
  };
  var validateStrArr = function (label, array) {
    if (!$_dkt1fwyjcg9mdaf.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_gcfqi6w8jcg9md8v.each(array, function (a) {
      if (!$_dkt1fwyjcg9mdaf.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_gcfqi6w8jcg9md8v.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_9qif7xxojcg9mddf = {
    sort: sort$1,
    reqMessage: reqMessage,
    unsuppMessage: unsuppMessage,
    validateStrArr: validateStrArr,
    invalidTypeMessage: invalidTypeMessage,
    checkDupes: checkDupes
  };

  var MixedBag = function (required, optional) {
    var everything = required.concat(optional);
    if (everything.length === 0)
      throw new Error('You must specify at least one required or optional field.');
    $_9qif7xxojcg9mddf.validateStrArr('required', required);
    $_9qif7xxojcg9mddf.validateStrArr('optional', optional);
    $_9qif7xxojcg9mddf.checkDupes(everything);
    return function (obj) {
      var keys = $_9is1m7wzjcg9mdag.keys(obj);
      var allReqd = $_gcfqi6w8jcg9md8v.forall(required, function (req) {
        return $_gcfqi6w8jcg9md8v.contains(keys, req);
      });
      if (!allReqd)
        $_9qif7xxojcg9mddf.reqMessage(required, keys);
      var unsupported = $_gcfqi6w8jcg9md8v.filter(keys, function (key) {
        return !$_gcfqi6w8jcg9md8v.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_9qif7xxojcg9mddf.unsuppMessage(unsupported);
      var r = {};
      $_gcfqi6w8jcg9md8v.each(required, function (req) {
        r[req] = $_7bfl0mwajcg9md92.constant(obj[req]);
      });
      $_gcfqi6w8jcg9md8v.each(optional, function (opt) {
        r[opt] = $_7bfl0mwajcg9md92.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? $_gb5srhw9jcg9md90.some(obj[opt]) : $_gb5srhw9jcg9md90.none());
      });
      return r;
    };
  };

  var $_ahnnvkxljcg9mddc = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var nu$6 = $_ahnnvkxljcg9mddc.immutableBag(['tag'], [
    'classes',
    'attributes',
    'styles',
    'value',
    'innerHtml',
    'domChildren',
    'defChildren'
  ]);
  var defToStr = function (defn) {
    var raw = defToRaw(defn);
    return $_3oduxxejcg9mdci.stringify(raw, null, 2);
  };
  var defToRaw = function (defn) {
    return {
      tag: defn.tag(),
      classes: defn.classes().getOr([]),
      attributes: defn.attributes().getOr({}),
      styles: defn.styles().getOr({}),
      value: defn.value().getOr('<none>'),
      innerHtml: defn.innerHtml().getOr('<none>'),
      defChildren: defn.defChildren().getOr('<none>'),
      domChildren: defn.domChildren().fold(function () {
        return '<none>';
      }, function (children) {
        return children.length === 0 ? '0 children, but still specified' : String(children.length);
      })
    };
  };
  var $_toxmgxkjcg9mdd9 = {
    nu: nu$6,
    defToStr: defToStr,
    defToRaw: defToRaw
  };

  var fields = [
    'classes',
    'attributes',
    'styles',
    'value',
    'innerHtml',
    'defChildren',
    'domChildren'
  ];
  var nu$5 = $_ahnnvkxljcg9mddc.immutableBag([], fields);
  var derive$2 = function (settings) {
    var r = {};
    var keys = $_9is1m7wzjcg9mdag.keys(settings);
    $_gcfqi6w8jcg9md8v.each(keys, function (key) {
      settings[key].each(function (v) {
        r[key] = v;
      });
    });
    return nu$5(r);
  };
  var modToStr = function (mod) {
    var raw = modToRaw(mod);
    return $_3oduxxejcg9mdci.stringify(raw, null, 2);
  };
  var modToRaw = function (mod) {
    return {
      classes: mod.classes().getOr('<none>'),
      attributes: mod.attributes().getOr('<none>'),
      styles: mod.styles().getOr('<none>'),
      value: mod.value().getOr('<none>'),
      innerHtml: mod.innerHtml().getOr('<none>'),
      defChildren: mod.defChildren().getOr('<none>'),
      domChildren: mod.domChildren().fold(function () {
        return '<none>';
      }, function (children) {
        return children.length === 0 ? '0 children, but still specified' : String(children.length);
      })
    };
  };
  var clashingOptArrays = function (key, oArr1, oArr2) {
    return oArr1.fold(function () {
      return oArr2.fold(function () {
        return {};
      }, function (arr2) {
        return $_1ohhokx5jcg9mdbm.wrap(key, arr2);
      });
    }, function (arr1) {
      return oArr2.fold(function () {
        return $_1ohhokx5jcg9mdbm.wrap(key, arr1);
      }, function (arr2) {
        return $_1ohhokx5jcg9mdbm.wrap(key, arr2);
      });
    });
  };
  var merge$1 = function (defnA, mod) {
    var raw = $_4xvhzgwxjcg9mdae.deepMerge({
      tag: defnA.tag(),
      classes: mod.classes().getOr([]).concat(defnA.classes().getOr([])),
      attributes: $_4xvhzgwxjcg9mdae.merge(defnA.attributes().getOr({}), mod.attributes().getOr({})),
      styles: $_4xvhzgwxjcg9mdae.merge(defnA.styles().getOr({}), mod.styles().getOr({}))
    }, mod.innerHtml().or(defnA.innerHtml()).map(function (innerHtml) {
      return $_1ohhokx5jcg9mdbm.wrap('innerHtml', innerHtml);
    }).getOr({}), clashingOptArrays('domChildren', mod.domChildren(), defnA.domChildren()), clashingOptArrays('defChildren', mod.defChildren(), defnA.defChildren()), mod.value().or(defnA.value()).map(function (value) {
      return $_1ohhokx5jcg9mdbm.wrap('value', value);
    }).getOr({}));
    return $_toxmgxkjcg9mdd9.nu(raw);
  };
  var $_aq2yxwxjjcg9mdd0 = {
    nu: nu$5,
    derive: derive$2,
    merge: merge$1,
    modToStr: modToStr,
    modToRaw: modToRaw
  };

  var executeEvent = function (bConfig, bState, executor) {
    return $_v93nkw5jcg9md8g.runOnExecute(function (component) {
      executor(component, bConfig, bState);
    });
  };
  var loadEvent = function (bConfig, bState, f) {
    return $_v93nkw5jcg9md8g.runOnInit(function (component, simulatedEvent) {
      f(component, bConfig, bState);
    });
  };
  var create$1 = function (schema, name, active, apis, extra, state) {
    var configSchema = $_96sv3hxgjcg9mdco.objOfOnly(schema);
    var schemaSchema = $_5g6e15x1jcg9mdax.optionObjOf(name, [$_5g6e15x1jcg9mdax.optionObjOfOnly('config', schema)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var createModes$1 = function (modes, name, active, apis, extra, state) {
    var configSchema = modes;
    var schemaSchema = $_5g6e15x1jcg9mdax.optionObjOf(name, [$_5g6e15x1jcg9mdax.optionOf('config', modes)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var wrapApi = function (bName, apiFunction, apiName) {
    var f = function (component) {
      var args = arguments;
      return component.config({ name: $_7bfl0mwajcg9md92.constant(bName) }).fold(function () {
        throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
      }, function (info) {
        var rest = Array.prototype.slice.call(args, 1);
        return apiFunction.apply(undefined, [
          component,
          info.config,
          info.state
        ].concat(rest));
      });
    };
    return $_df0y3qxijcg9mdcx.markAsBehaviourApi(f, apiName, apiFunction);
  };
  var revokeBehaviour = function (name) {
    return {
      key: name,
      value: undefined
    };
  };
  var doCreate = function (configSchema, schemaSchema, name, active, apis, extra, state) {
    var getConfig = function (info) {
      return $_1ohhokx5jcg9mdbm.hasKey(info, name) ? info[name]() : $_gb5srhw9jcg9md90.none();
    };
    var wrappedApis = $_9is1m7wzjcg9mdag.map(apis, function (apiF, apiName) {
      return wrapApi(name, apiF, apiName);
    });
    var wrappedExtra = $_9is1m7wzjcg9mdag.map(extra, function (extraF, extraName) {
      return $_df0y3qxijcg9mdcx.markAsExtraApi(extraF, extraName);
    });
    var me = $_4xvhzgwxjcg9mdae.deepMerge(wrappedExtra, wrappedApis, {
      revoke: $_7bfl0mwajcg9md92.curry(revokeBehaviour, name),
      config: function (spec) {
        var prepared = $_96sv3hxgjcg9mdco.asStructOrDie(name + '-config', configSchema, spec);
        return {
          key: name,
          value: {
            config: prepared,
            me: me,
            configAsRaw: $_apalrswgjcg9md9b.cached(function () {
              return $_96sv3hxgjcg9mdco.asRawOrDie(name + '-config', configSchema, spec);
            }),
            initialConfig: spec,
            state: state
          }
        };
      },
      schema: function () {
        return schemaSchema;
      },
      exhibit: function (info, base) {
        return getConfig(info).bind(function (behaviourInfo) {
          return $_1ohhokx5jcg9mdbm.readOptFrom(active, 'exhibit').map(function (exhibitor) {
            return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr($_aq2yxwxjjcg9mdd0.nu({}));
      },
      name: function () {
        return name;
      },
      handlers: function (info) {
        return getConfig(info).bind(function (behaviourInfo) {
          return $_1ohhokx5jcg9mdbm.readOptFrom(active, 'events').map(function (events) {
            return events(behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr({});
      }
    });
    return me;
  };
  var $_bdrph6w4jcg9md83 = {
    executeEvent: executeEvent,
    loadEvent: loadEvent,
    create: create$1,
    createModes: createModes$1
  };

  var base = function (handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: $_dkt1fwyjcg9mdaf.isFunction,
      label: 'function'
    });
  };
  var baseWith = function (handleUnsupported, required, pred) {
    if (required.length === 0)
      throw new Error('You must specify at least one required field.');
    $_9qif7xxojcg9mddf.validateStrArr('required', required);
    $_9qif7xxojcg9mddf.checkDupes(required);
    return function (obj) {
      var keys = $_9is1m7wzjcg9mdag.keys(obj);
      var allReqd = $_gcfqi6w8jcg9md8v.forall(required, function (req) {
        return $_gcfqi6w8jcg9md8v.contains(keys, req);
      });
      if (!allReqd)
        $_9qif7xxojcg9mddf.reqMessage(required, keys);
      handleUnsupported(required, keys);
      var invalidKeys = $_gcfqi6w8jcg9md8v.filter(required, function (key) {
        return !pred.validate(obj[key], key);
      });
      if (invalidKeys.length > 0)
        $_9qif7xxojcg9mddf.invalidTypeMessage(invalidKeys, pred.label);
      return obj;
    };
  };
  var handleExact = function (required, keys) {
    var unsupported = $_gcfqi6w8jcg9md8v.filter(keys, function (key) {
      return !$_gcfqi6w8jcg9md8v.contains(required, key);
    });
    if (unsupported.length > 0)
      $_9qif7xxojcg9mddf.unsuppMessage(unsupported);
  };
  var allowExtra = $_7bfl0mwajcg9md92.noop;
  var $_7vp4sexrjcg9mddn = {
    exactly: $_7bfl0mwajcg9md92.curry(base, handleExact),
    ensure: $_7bfl0mwajcg9md92.curry(base, allowExtra),
    ensureWith: $_7bfl0mwajcg9md92.curry(baseWith, allowExtra)
  };

  var BehaviourState = $_7vp4sexrjcg9mddn.ensure(['readState']);

  var init = function () {
    return BehaviourState({
      readState: function () {
        return 'No State required';
      }
    });
  };
  var $_dhezwlxpjcg9mddk = { init: init };

  var derive = function (capabilities) {
    return $_1ohhokx5jcg9mdbm.wrapAll(capabilities);
  };
  var simpleSchema = $_96sv3hxgjcg9mdco.objOfOnly([
    $_5g6e15x1jcg9mdax.strict('fields'),
    $_5g6e15x1jcg9mdax.strict('name'),
    $_5g6e15x1jcg9mdax.defaulted('active', {}),
    $_5g6e15x1jcg9mdax.defaulted('apis', {}),
    $_5g6e15x1jcg9mdax.defaulted('extra', {}),
    $_5g6e15x1jcg9mdax.defaulted('state', $_dhezwlxpjcg9mddk)
  ]);
  var create = function (data) {
    var value = $_96sv3hxgjcg9mdco.asRawOrDie('Creating behaviour: ' + data.name, simpleSchema, data);
    return $_bdrph6w4jcg9md83.create(value.fields, value.name, value.active, value.apis, value.extra, value.state);
  };
  var modeSchema = $_96sv3hxgjcg9mdco.objOfOnly([
    $_5g6e15x1jcg9mdax.strict('branchKey'),
    $_5g6e15x1jcg9mdax.strict('branches'),
    $_5g6e15x1jcg9mdax.strict('name'),
    $_5g6e15x1jcg9mdax.defaulted('active', {}),
    $_5g6e15x1jcg9mdax.defaulted('apis', {}),
    $_5g6e15x1jcg9mdax.defaulted('extra', {}),
    $_5g6e15x1jcg9mdax.defaulted('state', $_dhezwlxpjcg9mddk)
  ]);
  var createModes = function (data) {
    var value = $_96sv3hxgjcg9mdco.asRawOrDie('Creating behaviour: ' + data.name, modeSchema, data);
    return $_bdrph6w4jcg9md83.createModes($_96sv3hxgjcg9mdco.choose(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state);
  };
  var $_bb1w99w3jcg9md7v = {
    derive: derive,
    revoke: $_7bfl0mwajcg9md92.constant(undefined),
    noActive: $_7bfl0mwajcg9md92.constant({}),
    noApis: $_7bfl0mwajcg9md92.constant({}),
    noExtra: $_7bfl0mwajcg9md92.constant({}),
    noState: $_7bfl0mwajcg9md92.constant($_dhezwlxpjcg9mddk),
    create: create,
    createModes: createModes
  };

  var Toggler = function (turnOff, turnOn, initial) {
    var active = initial || false;
    var on = function () {
      turnOn();
      active = true;
    };
    var off = function () {
      turnOff();
      active = false;
    };
    var toggle = function () {
      var f = active ? off : on;
      f();
    };
    var isOn = function () {
      return active;
    };
    return {
      on: on,
      off: off,
      toggle: toggle,
      isOn: isOn
    };
  };

  var name = function (element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function (element) {
    return element.dom().nodeType;
  };
  var value$2 = function (element) {
    return element.dom().nodeValue;
  };
  var isType$1 = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_d2iswowtjcg9md9z.COMMENT || name(element) === '#comment';
  };
  var isElement = isType$1($_d2iswowtjcg9md9z.ELEMENT);
  var isText = isType$1($_d2iswowtjcg9md9z.TEXT);
  var isDocument = isType$1($_d2iswowtjcg9md9z.DOCUMENT);
  var $_97hwf5xwjcg9mddy = {
    name: name,
    type: type,
    value: value$2,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var rawSet = function (dom, key, value) {
    if ($_dkt1fwyjcg9mdaf.isString(value) || $_dkt1fwyjcg9mdaf.isBoolean(value) || $_dkt1fwyjcg9mdaf.isNumber(value)) {
      dom.setAttribute(key, value + '');
    } else {
      console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
      throw new Error('Attribute value was not simple');
    }
  };
  var set = function (element, key, value) {
    rawSet(element.dom(), key, value);
  };
  var setAll = function (element, attrs) {
    var dom = element.dom();
    $_9is1m7wzjcg9mdag.each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get = function (element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has$1 = function (element, key) {
    var dom = element.dom();
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
  };
  var remove$1 = function (element, key) {
    element.dom().removeAttribute(key);
  };
  var hasNone = function (element) {
    var attrs = element.dom().attributes;
    return attrs === undefined || attrs === null || attrs.length === 0;
  };
  var clone = function (element) {
    return $_gcfqi6w8jcg9md8v.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne = function (source, destination, attr) {
    if (has$1(source, attr) && !has$1(destination, attr))
      set(destination, attr, get(source, attr));
  };
  var transfer = function (source, destination, attrs) {
    if (!$_97hwf5xwjcg9mddy.isElement(source) || !$_97hwf5xwjcg9mddy.isElement(destination))
      return;
    $_gcfqi6w8jcg9md8v.each(attrs, function (attr) {
      transferOne(source, destination, attr);
    });
  };
  var $_ectfz6xvjcg9mddu = {
    clone: clone,
    set: set,
    setAll: setAll,
    get: get,
    has: has$1,
    remove: remove$1,
    hasNone: hasNone,
    transfer: transfer
  };

  var read$1 = function (element, attr) {
    var value = $_ectfz6xvjcg9mddu.get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add$2 = function (element, attr, id) {
    var old = read$1(element, attr);
    var nu = old.concat([id]);
    $_ectfz6xvjcg9mddu.set(element, attr, nu.join(' '));
  };
  var remove$3 = function (element, attr, id) {
    var nu = $_gcfqi6w8jcg9md8v.filter(read$1(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0)
      $_ectfz6xvjcg9mddu.set(element, attr, nu.join(' '));
    else
      $_ectfz6xvjcg9mddu.remove(element, attr);
  };
  var $_4m1f8nxyjcg9mde0 = {
    read: read$1,
    add: add$2,
    remove: remove$3
  };

  var supports = function (element) {
    return element.dom().classList !== undefined;
  };
  var get$1 = function (element) {
    return $_4m1f8nxyjcg9mde0.read(element, 'class');
  };
  var add$1 = function (element, clazz) {
    return $_4m1f8nxyjcg9mde0.add(element, 'class', clazz);
  };
  var remove$2 = function (element, clazz) {
    return $_4m1f8nxyjcg9mde0.remove(element, 'class', clazz);
  };
  var toggle$1 = function (element, clazz) {
    if ($_gcfqi6w8jcg9md8v.contains(get$1(element), clazz)) {
      remove$2(element, clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var $_fjn66dxxjcg9mddz = {
    get: get$1,
    add: add$1,
    remove: remove$2,
    toggle: toggle$1,
    supports: supports
  };

  var add = function (element, clazz) {
    if ($_fjn66dxxjcg9mddz.supports(element))
      element.dom().classList.add(clazz);
    else
      $_fjn66dxxjcg9mddz.add(element, clazz);
  };
  var cleanClass = function (element) {
    var classList = $_fjn66dxxjcg9mddz.supports(element) ? element.dom().classList : $_fjn66dxxjcg9mddz.get(element);
    if (classList.length === 0) {
      $_ectfz6xvjcg9mddu.remove(element, 'class');
    }
  };
  var remove = function (element, clazz) {
    if ($_fjn66dxxjcg9mddz.supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else
      $_fjn66dxxjcg9mddz.remove(element, clazz);
    cleanClass(element);
  };
  var toggle = function (element, clazz) {
    return $_fjn66dxxjcg9mddz.supports(element) ? element.dom().classList.toggle(clazz) : $_fjn66dxxjcg9mddz.toggle(element, clazz);
  };
  var toggler = function (element, clazz) {
    var hasClasslist = $_fjn66dxxjcg9mddz.supports(element);
    var classList = element.dom().classList;
    var off = function () {
      if (hasClasslist)
        classList.remove(clazz);
      else
        $_fjn66dxxjcg9mddz.remove(element, clazz);
    };
    var on = function () {
      if (hasClasslist)
        classList.add(clazz);
      else
        $_fjn66dxxjcg9mddz.add(element, clazz);
    };
    return Toggler(off, on, has(element, clazz));
  };
  var has = function (element, clazz) {
    return $_fjn66dxxjcg9mddz.supports(element) && element.dom().classList.contains(clazz);
  };
  var $_eb18ucxtjcg9mddr = {
    add: add,
    remove: remove,
    toggle: toggle,
    toggler: toggler,
    has: has
  };

  var swap = function (element, addCls, removeCls) {
    $_eb18ucxtjcg9mddr.remove(element, removeCls);
    $_eb18ucxtjcg9mddr.add(element, addCls);
  };
  var toAlpha = function (component, swapConfig, swapState) {
    swap(component.element(), swapConfig.alpha(), swapConfig.omega());
  };
  var toOmega = function (component, swapConfig, swapState) {
    swap(component.element(), swapConfig.omega(), swapConfig.alpha());
  };
  var clear = function (component, swapConfig, swapState) {
    $_eb18ucxtjcg9mddr.remove(component.element(), swapConfig.alpha());
    $_eb18ucxtjcg9mddr.remove(component.element(), swapConfig.omega());
  };
  var isAlpha = function (component, swapConfig, swapState) {
    return $_eb18ucxtjcg9mddr.has(component.element(), swapConfig.alpha());
  };
  var isOmega = function (component, swapConfig, swapState) {
    return $_eb18ucxtjcg9mddr.has(component.element(), swapConfig.omega());
  };
  var $_9mflldxsjcg9mddp = {
    toAlpha: toAlpha,
    toOmega: toOmega,
    isAlpha: isAlpha,
    isOmega: isOmega,
    clear: clear
  };

  var SwapSchema = [
    $_5g6e15x1jcg9mdax.strict('alpha'),
    $_5g6e15x1jcg9mdax.strict('omega')
  ];

  var Swapping = $_bb1w99w3jcg9md7v.create({
    fields: SwapSchema,
    name: 'swapping',
    apis: $_9mflldxsjcg9mddp
  });

  var toArray = function (target, f) {
    var r = [];
    var recurse = function (e) {
      r.push(e);
      return f(e);
    };
    var cur = f(target);
    do {
      cur = cur.bind(recurse);
    } while (cur.isSome());
    return r;
  };
  var $_f22hkpy3jcg9mdeo = { toArray: toArray };

  var owner = function (element) {
    return $_41aqpdwsjcg9md9w.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_41aqpdwsjcg9md9w.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_41aqpdwsjcg9md9w.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return $_gb5srhw9jcg9md90.from(dom.parentNode).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var findIndex$1 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_gcfqi6w8jcg9md8v.findIndex(kin, function (elem) {
        return $_9sx28sw7jcg9md8n.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_dkt1fwyjcg9mdaf.isFunction(isRoot) ? isRoot : $_7bfl0mwajcg9md92.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_41aqpdwsjcg9md9w.fromDom(rawParent);
      ret.push(parent);
      if (stop(parent) === true)
        break;
      else
        dom = rawParent;
    }
    return ret;
  };
  var siblings = function (element) {
    var filterSelf = function (elements) {
      return $_gcfqi6w8jcg9md8v.filter(elements, function (x) {
        return !$_9sx28sw7jcg9md8n.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return $_gb5srhw9jcg9md90.from(dom.offsetParent).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return $_gb5srhw9jcg9md90.from(dom.previousSibling).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return $_gb5srhw9jcg9md90.from(dom.nextSibling).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var prevSiblings = function (element) {
    return $_gcfqi6w8jcg9md8v.reverse($_f22hkpy3jcg9mdeo.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_f22hkpy3jcg9mdeo.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_gcfqi6w8jcg9md8v.map(dom.childNodes, $_41aqpdwsjcg9md9w.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return $_gb5srhw9jcg9md90.from(children[index]).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var firstChild = function (element) {
    return child(element, 0);
  };
  var lastChild = function (element) {
    return child(element, element.dom().childNodes.length - 1);
  };
  var childNodesCount = function (element) {
    return element.dom().childNodes.length;
  };
  var hasChildNodes = function (element) {
    return element.dom().hasChildNodes();
  };
  var spot = $_ahnnvkxljcg9mddc.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_1lxhd4y2jcg9mdeh = {
    owner: owner,
    defaultView: defaultView,
    documentElement: documentElement,
    parent: parent,
    findIndex: findIndex$1,
    parents: parents,
    siblings: siblings,
    prevSibling: prevSibling,
    offsetParent: offsetParent,
    prevSiblings: prevSiblings,
    nextSibling: nextSibling,
    nextSiblings: nextSiblings,
    children: children,
    child: child,
    firstChild: firstChild,
    lastChild: lastChild,
    childNodesCount: childNodesCount,
    hasChildNodes: hasChildNodes,
    leaf: leaf
  };

  var before = function (marker, element) {
    var parent = $_1lxhd4y2jcg9mdeh.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function (marker, element) {
    var sibling = $_1lxhd4y2jcg9mdeh.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_1lxhd4y2jcg9mdeh.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_1lxhd4y2jcg9mdeh.firstChild(parent);
    firstChild.fold(function () {
      append(parent, element);
    }, function (v) {
      parent.dom().insertBefore(element.dom(), v.dom());
    });
  };
  var append = function (parent, element) {
    parent.dom().appendChild(element.dom());
  };
  var appendAt = function (parent, element, index) {
    $_1lxhd4y2jcg9mdeh.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };
  var wrap$2 = function (element, wrapper) {
    before(element, wrapper);
    append(wrapper, element);
  };
  var $_ghqowmy1jcg9mdef = {
    before: before,
    after: after,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap$2
  };

  var before$1 = function (marker, elements) {
    $_gcfqi6w8jcg9md8v.each(elements, function (x) {
      $_ghqowmy1jcg9mdef.before(marker, x);
    });
  };
  var after$1 = function (marker, elements) {
    $_gcfqi6w8jcg9md8v.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_ghqowmy1jcg9mdef.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_gcfqi6w8jcg9md8v.each(elements.slice().reverse(), function (x) {
      $_ghqowmy1jcg9mdef.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_gcfqi6w8jcg9md8v.each(elements, function (x) {
      $_ghqowmy1jcg9mdef.append(parent, x);
    });
  };
  var $_7e164ay5jcg9mder = {
    before: before$1,
    after: after$1,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_gcfqi6w8jcg9md8v.each($_1lxhd4y2jcg9mdeh.children(element), function (rogue) {
      remove$4(rogue);
    });
  };
  var remove$4 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_1lxhd4y2jcg9mdeh.children(wrapper);
    if (children.length > 0)
      $_7e164ay5jcg9mder.before(wrapper, children);
    remove$4(wrapper);
  };
  var $_9le0u1y4jcg9mdep = {
    empty: empty,
    remove: remove$4,
    unwrap: unwrap
  };

  var inBody = function (element) {
    var dom = $_97hwf5xwjcg9mddy.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_apalrswgjcg9md9b.cached(function () {
    return getBody($_41aqpdwsjcg9md9w.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_41aqpdwsjcg9md9w.fromDom(body);
  };
  var $_6n4ng7y6jcg9mdet = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var fireDetaching = function (component) {
    $_4wv38zwujcg9mda1.emit(component, $_fvndowvjcg9mda7.detachedFromDom());
    var children = component.components();
    $_gcfqi6w8jcg9md8v.each(children, fireDetaching);
  };
  var fireAttaching = function (component) {
    var children = component.components();
    $_gcfqi6w8jcg9md8v.each(children, fireAttaching);
    $_4wv38zwujcg9mda1.emit(component, $_fvndowvjcg9mda7.attachedToDom());
  };
  var attach = function (parent, child) {
    attachWith(parent, child, $_ghqowmy1jcg9mdef.append);
  };
  var attachWith = function (parent, child, insertion) {
    parent.getSystem().addToWorld(child);
    insertion(parent.element(), child.element());
    if ($_6n4ng7y6jcg9mdet.inBody(parent.element()))
      fireAttaching(child);
    parent.syncComponents();
  };
  var doDetach = function (component) {
    fireDetaching(component);
    $_9le0u1y4jcg9mdep.remove(component.element());
    component.getSystem().removeFromWorld(component);
  };
  var detach = function (component) {
    var parent = $_1lxhd4y2jcg9mdeh.parent(component.element()).bind(function (p) {
      return component.getSystem().getByDom(p).fold($_gb5srhw9jcg9md90.none, $_gb5srhw9jcg9md90.some);
    });
    doDetach(component);
    parent.each(function (p) {
      p.syncComponents();
    });
  };
  var detachChildren = function (component) {
    var subs = component.components();
    $_gcfqi6w8jcg9md8v.each(subs, doDetach);
    $_9le0u1y4jcg9mdep.empty(component.element());
    component.syncComponents();
  };
  var attachSystem = function (element, guiSystem) {
    $_ghqowmy1jcg9mdef.append(element, guiSystem.element());
    var children = $_1lxhd4y2jcg9mdeh.children(guiSystem.element());
    $_gcfqi6w8jcg9md8v.each(children, function (child) {
      guiSystem.getByDom(child).each(fireAttaching);
    });
  };
  var detachSystem = function (guiSystem) {
    var children = $_1lxhd4y2jcg9mdeh.children(guiSystem.element());
    $_gcfqi6w8jcg9md8v.each(children, function (child) {
      guiSystem.getByDom(child).each(fireDetaching);
    });
    $_9le0u1y4jcg9mdep.remove(guiSystem.element());
  };
  var $_24go32y0jcg9mde6 = {
    attach: attach,
    attachWith: attachWith,
    detach: detach,
    detachChildren: detachChildren,
    attachSystem: attachSystem,
    detachSystem: detachSystem
  };

  var fromHtml$1 = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return $_1lxhd4y2jcg9mdeh.children($_41aqpdwsjcg9md9w.fromDom(div));
  };
  var fromTags = function (tags, scope) {
    return $_gcfqi6w8jcg9md8v.map(tags, function (x) {
      return $_41aqpdwsjcg9md9w.fromTag(x, scope);
    });
  };
  var fromText$1 = function (texts, scope) {
    return $_gcfqi6w8jcg9md8v.map(texts, function (x) {
      return $_41aqpdwsjcg9md9w.fromText(x, scope);
    });
  };
  var fromDom$1 = function (nodes) {
    return $_gcfqi6w8jcg9md8v.map(nodes, $_41aqpdwsjcg9md9w.fromDom);
  };
  var $_7kh8l5ybjcg9mdfa = {
    fromHtml: fromHtml$1,
    fromTags: fromTags,
    fromText: fromText$1,
    fromDom: fromDom$1
  };

  var get$2 = function (element) {
    return element.dom().innerHTML;
  };
  var set$1 = function (element, content) {
    var owner = $_1lxhd4y2jcg9mdeh.owner(element);
    var docDom = owner.dom();
    var fragment = $_41aqpdwsjcg9md9w.fromDom(docDom.createDocumentFragment());
    var contentElements = $_7kh8l5ybjcg9mdfa.fromHtml(content, docDom);
    $_7e164ay5jcg9mder.append(fragment, contentElements);
    $_9le0u1y4jcg9mdep.empty(element);
    $_ghqowmy1jcg9mdef.append(element, fragment);
  };
  var getOuter = function (element) {
    var container = $_41aqpdwsjcg9md9w.fromTag('div');
    var clone = $_41aqpdwsjcg9md9w.fromDom(element.dom().cloneNode(true));
    $_ghqowmy1jcg9mdef.append(container, clone);
    return get$2(container);
  };
  var $_ghy5kryajcg9mdf9 = {
    get: get$2,
    set: set$1,
    getOuter: getOuter
  };

  var clone$1 = function (original, deep) {
    return $_41aqpdwsjcg9md9w.fromDom(original.dom().cloneNode(deep));
  };
  var shallow$1 = function (original) {
    return clone$1(original, false);
  };
  var deep$1 = function (original) {
    return clone$1(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_41aqpdwsjcg9md9w.fromTag(tag);
    var attributes = $_ectfz6xvjcg9mddu.clone(original);
    $_ectfz6xvjcg9mddu.setAll(nu, attributes);
    return nu;
  };
  var copy = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_1lxhd4y2jcg9mdeh.children(deep$1(original));
    $_7e164ay5jcg9mder.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_ghqowmy1jcg9mdef.before(original, nu);
    var children = $_1lxhd4y2jcg9mdeh.children(original);
    $_7e164ay5jcg9mder.append(nu, children);
    $_9le0u1y4jcg9mdep.remove(original);
    return nu;
  };
  var $_51ltxoycjcg9mdfd = {
    shallow: shallow$1,
    shallowAs: shallowAs,
    deep: deep$1,
    copy: copy,
    mutate: mutate
  };

  var getHtml = function (element) {
    var clone = $_51ltxoycjcg9mdfd.shallow(element);
    return $_ghy5kryajcg9mdf9.getOuter(clone);
  };
  var $_9yb9bvy9jcg9mdf7 = { getHtml: getHtml };

  var element = function (elem) {
    return $_9yb9bvy9jcg9mdf7.getHtml(elem);
  };
  var $_3ckbpiy8jcg9mdf5 = { element: element };

  var cat = function (arr) {
    var r = [];
    var push = function (x) {
      r.push(x);
    };
    for (var i = 0; i < arr.length; i++) {
      arr[i].each(push);
    }
    return r;
  };
  var findMap = function (arr, f) {
    for (var i = 0; i < arr.length; i++) {
      var r = f(arr[i], i);
      if (r.isSome()) {
        return r;
      }
    }
    return $_gb5srhw9jcg9md90.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return $_gb5srhw9jcg9md90.none();
      }
    }
    return $_gb5srhw9jcg9md90.some(f.apply(null, r));
  };
  var $_6vwq8dydjcg9mdfe = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var unknown$3 = 'unknown';
  var debugging = true;
  var CHROME_INSPECTOR_GLOBAL = '__CHROME_INSPECTOR_CONNECTION_TO_ALLOY__';
  var eventsMonitored = [];
  var path$1 = [
    'alloy/data/Fields',
    'alloy/debugging/Debugging'
  ];
  var getTrace = function () {
    if (debugging === false)
      return unknown$3;
    var err = new Error();
    if (err.stack !== undefined) {
      var lines = err.stack.split('\n');
      return $_gcfqi6w8jcg9md8v.find(lines, function (line) {
        return line.indexOf('alloy') > 0 && !$_gcfqi6w8jcg9md8v.exists(path$1, function (p) {
          return line.indexOf(p) > -1;
        });
      }).getOr(unknown$3);
    } else {
      return unknown$3;
    }
  };
  var logHandler = function (label, handlerName, trace) {
  };
  var ignoreEvent = {
    logEventCut: $_7bfl0mwajcg9md92.noop,
    logEventStopped: $_7bfl0mwajcg9md92.noop,
    logNoParent: $_7bfl0mwajcg9md92.noop,
    logEventNoHandlers: $_7bfl0mwajcg9md92.noop,
    logEventResponse: $_7bfl0mwajcg9md92.noop,
    write: $_7bfl0mwajcg9md92.noop
  };
  var monitorEvent = function (eventName, initialTarget, f) {
    var logger = debugging && (eventsMonitored === '*' || $_gcfqi6w8jcg9md8v.contains(eventsMonitored, eventName)) ? function () {
      var sequence = [];
      return {
        logEventCut: function (name, target, purpose) {
          sequence.push({
            outcome: 'cut',
            target: target,
            purpose: purpose
          });
        },
        logEventStopped: function (name, target, purpose) {
          sequence.push({
            outcome: 'stopped',
            target: target,
            purpose: purpose
          });
        },
        logNoParent: function (name, target, purpose) {
          sequence.push({
            outcome: 'no-parent',
            target: target,
            purpose: purpose
          });
        },
        logEventNoHandlers: function (name, target) {
          sequence.push({
            outcome: 'no-handlers-left',
            target: target
          });
        },
        logEventResponse: function (name, target, purpose) {
          sequence.push({
            outcome: 'response',
            purpose: purpose,
            target: target
          });
        },
        write: function () {
          if ($_gcfqi6w8jcg9md8v.contains([
              'mousemove',
              'mouseover',
              'mouseout',
              $_fvndowvjcg9mda7.systemInit()
            ], eventName))
            return;
          console.log(eventName, {
            event: eventName,
            target: initialTarget.dom(),
            sequence: $_gcfqi6w8jcg9md8v.map(sequence, function (s) {
              if (!$_gcfqi6w8jcg9md8v.contains([
                  'cut',
                  'stopped',
                  'response'
                ], s.outcome))
                return s.outcome;
              else
                return '{' + s.purpose + '} ' + s.outcome + ' at (' + $_3ckbpiy8jcg9mdf5.element(s.target) + ')';
            })
          });
        }
      };
    }() : ignoreEvent;
    var output = f(logger);
    logger.write();
    return output;
  };
  var inspectorInfo = function (comp) {
    var go = function (c) {
      var cSpec = c.spec();
      return {
        '(original.spec)': cSpec,
        '(dom.ref)': c.element().dom(),
        '(element)': $_3ckbpiy8jcg9mdf5.element(c.element()),
        '(initComponents)': $_gcfqi6w8jcg9md8v.map(cSpec.components !== undefined ? cSpec.components : [], go),
        '(components)': $_gcfqi6w8jcg9md8v.map(c.components(), go),
        '(bound.events)': $_9is1m7wzjcg9mdag.mapToArray(c.events(), function (v, k) {
          return [k];
        }).join(', '),
        '(behaviours)': cSpec.behaviours !== undefined ? $_9is1m7wzjcg9mdag.map(cSpec.behaviours, function (v, k) {
          return v === undefined ? '--revoked--' : {
            config: v.configAsRaw(),
            'original-config': v.initialConfig,
            state: c.readState(k)
          };
        }) : 'none'
      };
    };
    return go(comp);
  };
  var getOrInitConnection = function () {
    if (window[CHROME_INSPECTOR_GLOBAL] !== undefined)
      return window[CHROME_INSPECTOR_GLOBAL];
    else {
      window[CHROME_INSPECTOR_GLOBAL] = {
        systems: {},
        lookup: function (uid) {
          var systems = window[CHROME_INSPECTOR_GLOBAL].systems;
          var connections = $_9is1m7wzjcg9mdag.keys(systems);
          return $_6vwq8dydjcg9mdfe.findMap(connections, function (conn) {
            var connGui = systems[conn];
            return connGui.getByUid(uid).toOption().map(function (comp) {
              return $_1ohhokx5jcg9mdbm.wrap($_3ckbpiy8jcg9mdf5.element(comp.element()), inspectorInfo(comp));
            });
          });
        }
      };
      return window[CHROME_INSPECTOR_GLOBAL];
    }
  };
  var registerInspector = function (name, gui) {
    var connection = getOrInitConnection();
    connection.systems[name] = gui;
  };
  var $_6ezsyby7jcg9mdey = {
    logHandler: logHandler,
    noLogger: $_7bfl0mwajcg9md92.constant(ignoreEvent),
    getTrace: getTrace,
    monitorEvent: monitorEvent,
    isDebugging: $_7bfl0mwajcg9md92.constant(debugging),
    registerInspector: registerInspector
  };

  var Cell = function (initial) {
    var value = initial;
    var get = function () {
      return value;
    };
    var set = function (v) {
      value = v;
    };
    var clone = function () {
      return Cell(get());
    };
    return {
      get: get,
      set: set,
      clone: clone
    };
  };

  var ClosestOrAncestor = function (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? $_gb5srhw9jcg9md90.some(scope) : $_dkt1fwyjcg9mdaf.isFunction(isRoot) && isRoot(scope) ? $_gb5srhw9jcg9md90.none() : ancestor(scope, a, isRoot);
  };

  var first$1 = function (predicate) {
    return descendant$1($_6n4ng7y6jcg9mdet.body(), predicate);
  };
  var ancestor$1 = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_dkt1fwyjcg9mdaf.isFunction(isRoot) ? isRoot : $_7bfl0mwajcg9md92.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_41aqpdwsjcg9md9w.fromDom(element);
      if (predicate(el))
        return $_gb5srhw9jcg9md90.some(el);
      else if (stop(el))
        break;
    }
    return $_gb5srhw9jcg9md90.none();
  };
  var closest$1 = function (scope, predicate, isRoot) {
    var is = function (scope) {
      return predicate(scope);
    };
    return ClosestOrAncestor(is, ancestor$1, scope, predicate, isRoot);
  };
  var sibling$1 = function (scope, predicate) {
    var element = scope.dom();
    if (!element.parentNode)
      return $_gb5srhw9jcg9md90.none();
    return child$2($_41aqpdwsjcg9md9w.fromDom(element.parentNode), function (x) {
      return !$_9sx28sw7jcg9md8n.eq(scope, x) && predicate(x);
    });
  };
  var child$2 = function (scope, predicate) {
    var result = $_gcfqi6w8jcg9md8v.find(scope.dom().childNodes, $_7bfl0mwajcg9md92.compose(predicate, $_41aqpdwsjcg9md9w.fromDom));
    return result.map($_41aqpdwsjcg9md9w.fromDom);
  };
  var descendant$1 = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_41aqpdwsjcg9md9w.fromDom(element.childNodes[i])))
          return $_gb5srhw9jcg9md90.some($_41aqpdwsjcg9md9w.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return $_gb5srhw9jcg9md90.none();
    };
    return descend(scope.dom());
  };
  var $_2dj3ogyhjcg9mdfk = {
    first: first$1,
    ancestor: ancestor$1,
    closest: closest$1,
    sibling: sibling$1,
    child: child$2,
    descendant: descendant$1
  };

  var any$1 = function (predicate) {
    return $_2dj3ogyhjcg9mdfk.first(predicate).isSome();
  };
  var ancestor = function (scope, predicate, isRoot) {
    return $_2dj3ogyhjcg9mdfk.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest = function (scope, predicate, isRoot) {
    return $_2dj3ogyhjcg9mdfk.closest(scope, predicate, isRoot).isSome();
  };
  var sibling = function (scope, predicate) {
    return $_2dj3ogyhjcg9mdfk.sibling(scope, predicate).isSome();
  };
  var child$1 = function (scope, predicate) {
    return $_2dj3ogyhjcg9mdfk.child(scope, predicate).isSome();
  };
  var descendant = function (scope, predicate) {
    return $_2dj3ogyhjcg9mdfk.descendant(scope, predicate).isSome();
  };
  var $_c6auhxygjcg9mdfj = {
    any: any$1,
    ancestor: ancestor,
    closest: closest,
    sibling: sibling,
    child: child$1,
    descendant: descendant
  };

  var focus = function (element) {
    element.dom().focus();
  };
  var blur = function (element) {
    element.dom().blur();
  };
  var hasFocus = function (element) {
    var doc = $_1lxhd4y2jcg9mdeh.owner(element).dom();
    return element.dom() === doc.activeElement;
  };
  var active = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    return $_gb5srhw9jcg9md90.from(doc.activeElement).map($_41aqpdwsjcg9md9w.fromDom);
  };
  var focusInside = function (element) {
    var doc = $_1lxhd4y2jcg9mdeh.owner(element);
    var inside = active(doc).filter(function (a) {
      return $_c6auhxygjcg9mdfj.closest(a, $_7bfl0mwajcg9md92.curry($_9sx28sw7jcg9md8n.eq, element));
    });
    inside.fold(function () {
      focus(element);
    }, $_7bfl0mwajcg9md92.noop);
  };
  var search = function (element) {
    return active($_1lxhd4y2jcg9mdeh.owner(element)).filter(function (e) {
      return element.dom().contains(e.dom());
    });
  };
  var $_g6scf1yfjcg9mdfg = {
    hasFocus: hasFocus,
    focus: focus,
    blur: blur,
    active: active,
    search: search,
    focusInside: focusInside
  };

  var ThemeManager = tinymce.util.Tools.resolve('tinymce.ThemeManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var openLink = function (target) {
    var link = document.createElement('a');
    link.target = '_blank';
    link.href = target.href;
    link.rel = 'noreferrer noopener';
    var nuEvt = document.createEvent('MouseEvents');
    nuEvt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.body.appendChild(link);
    link.dispatchEvent(nuEvt);
    document.body.removeChild(link);
  };
  var $_5tkgezyljcg9mdft = { openLink: openLink };

  var isSkinDisabled = function (editor) {
    return editor.settings.skin === false;
  };
  var $_6azauymjcg9mdft = { isSkinDisabled: isSkinDisabled };

  var formatChanged = 'formatChanged';
  var orientationChanged = 'orientationChanged';
  var dropupDismissed = 'dropupDismissed';
  var $_g1ca6bynjcg9mdfu = {
    formatChanged: $_7bfl0mwajcg9md92.constant(formatChanged),
    orientationChanged: $_7bfl0mwajcg9md92.constant(orientationChanged),
    dropupDismissed: $_7bfl0mwajcg9md92.constant(dropupDismissed)
  };

  var chooseChannels = function (channels, message) {
    return message.universal() ? channels : $_gcfqi6w8jcg9md8v.filter(channels, function (ch) {
      return $_gcfqi6w8jcg9md8v.contains(message.channels(), ch);
    });
  };
  var events = function (receiveConfig) {
    return $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.receive(), function (component, message) {
        var channelMap = receiveConfig.channels();
        var channels = $_9is1m7wzjcg9mdag.keys(channelMap);
        var targetChannels = chooseChannels(channels, message);
        $_gcfqi6w8jcg9md8v.each(targetChannels, function (ch) {
          var channelInfo = channelMap[ch]();
          var channelSchema = channelInfo.schema();
          var data = $_96sv3hxgjcg9mdco.asStructOrDie('channel[' + ch + '] data\nReceiver: ' + $_3ckbpiy8jcg9mdf5.element(component.element()), channelSchema, message.data());
          channelInfo.onReceive()(component, data);
        });
      })]);
  };
  var $_6jlgt2yqjcg9mdg8 = { events: events };

  var menuFields = [
    $_5g6e15x1jcg9mdax.strict('menu'),
    $_5g6e15x1jcg9mdax.strict('selectedMenu')
  ];
  var itemFields = [
    $_5g6e15x1jcg9mdax.strict('item'),
    $_5g6e15x1jcg9mdax.strict('selectedItem')
  ];
  var schema = $_96sv3hxgjcg9mdco.objOfOnly(itemFields.concat(menuFields));
  var itemSchema = $_96sv3hxgjcg9mdco.objOfOnly(itemFields);
  var $_9ntiqkytjcg9mdgq = {
    menuFields: $_7bfl0mwajcg9md92.constant(menuFields),
    itemFields: $_7bfl0mwajcg9md92.constant(itemFields),
    schema: $_7bfl0mwajcg9md92.constant(schema),
    itemSchema: $_7bfl0mwajcg9md92.constant(itemSchema)
  };

  var initSize = $_5g6e15x1jcg9mdax.strictObjOf('initSize', [
    $_5g6e15x1jcg9mdax.strict('numColumns'),
    $_5g6e15x1jcg9mdax.strict('numRows')
  ]);
  var itemMarkers = function () {
    return $_5g6e15x1jcg9mdax.strictOf('markers', $_9ntiqkytjcg9mdgq.itemSchema());
  };
  var menuMarkers = function () {
    return $_5g6e15x1jcg9mdax.strictOf('markers', $_9ntiqkytjcg9mdgq.schema());
  };
  var tieredMenuMarkers = function () {
    return $_5g6e15x1jcg9mdax.strictObjOf('markers', [$_5g6e15x1jcg9mdax.strict('backgroundMenu')].concat($_9ntiqkytjcg9mdgq.menuFields()).concat($_9ntiqkytjcg9mdgq.itemFields()));
  };
  var markers = function (required) {
    return $_5g6e15x1jcg9mdax.strictObjOf('markers', $_gcfqi6w8jcg9md8v.map(required, $_5g6e15x1jcg9mdax.strict));
  };
  var onPresenceHandler = function (label, fieldName, presence) {
    var trace = $_6ezsyby7jcg9mdey.getTrace();
    return $_5g6e15x1jcg9mdax.field(fieldName, fieldName, presence, $_96sv3hxgjcg9mdco.valueOf(function (f) {
      return $_exyfurx7jcg9mdbv.value(function () {
        $_6ezsyby7jcg9mdey.logHandler(label, fieldName, trace);
        return f.apply(undefined, arguments);
      });
    }));
  };
  var onHandler = function (fieldName) {
    return onPresenceHandler('onHandler', fieldName, $_amdqrdx2jcg9mdb3.defaulted($_7bfl0mwajcg9md92.noop));
  };
  var onKeyboardHandler = function (fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, $_amdqrdx2jcg9mdb3.defaulted($_gb5srhw9jcg9md90.none));
  };
  var onStrictHandler = function (fieldName) {
    return onPresenceHandler('onHandler', fieldName, $_amdqrdx2jcg9mdb3.strict());
  };
  var onStrictKeyboardHandler = function (fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, $_amdqrdx2jcg9mdb3.strict());
  };
  var output$1 = function (name, value) {
    return $_5g6e15x1jcg9mdax.state(name, $_7bfl0mwajcg9md92.constant(value));
  };
  var snapshot$1 = function (name) {
    return $_5g6e15x1jcg9mdax.state(name, $_7bfl0mwajcg9md92.identity);
  };
  var $_f9utgpysjcg9mdgi = {
    initSize: $_7bfl0mwajcg9md92.constant(initSize),
    itemMarkers: itemMarkers,
    menuMarkers: menuMarkers,
    tieredMenuMarkers: tieredMenuMarkers,
    markers: markers,
    onHandler: onHandler,
    onKeyboardHandler: onKeyboardHandler,
    onStrictHandler: onStrictHandler,
    onStrictKeyboardHandler: onStrictKeyboardHandler,
    output: output$1,
    snapshot: snapshot$1
  };

  var ReceivingSchema = [$_5g6e15x1jcg9mdax.strictOf('channels', $_96sv3hxgjcg9mdco.setOf($_exyfurx7jcg9mdbv.value, $_96sv3hxgjcg9mdco.objOfOnly([
      $_f9utgpysjcg9mdgi.onStrictHandler('onReceive'),
      $_5g6e15x1jcg9mdax.defaulted('schema', $_96sv3hxgjcg9mdco.anyValue())
    ])))];

  var Receiving = $_bb1w99w3jcg9md7v.create({
    fields: ReceivingSchema,
    name: 'receiving',
    active: $_6jlgt2yqjcg9mdg8
  });

  var updateAriaState = function (component, toggleConfig) {
    var pressed = isOn(component, toggleConfig);
    var ariaInfo = toggleConfig.aria();
    ariaInfo.update()(component, ariaInfo, pressed);
  };
  var toggle$2 = function (component, toggleConfig, toggleState) {
    $_eb18ucxtjcg9mddr.toggle(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var on = function (component, toggleConfig, toggleState) {
    $_eb18ucxtjcg9mddr.add(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var off = function (component, toggleConfig, toggleState) {
    $_eb18ucxtjcg9mddr.remove(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var isOn = function (component, toggleConfig) {
    return $_eb18ucxtjcg9mddr.has(component.element(), toggleConfig.toggleClass());
  };
  var onLoad = function (component, toggleConfig, toggleState) {
    var api = toggleConfig.selected() ? on : off;
    api(component, toggleConfig, toggleState);
  };
  var $_79jvnzywjcg9mdgz = {
    onLoad: onLoad,
    toggle: toggle$2,
    isOn: isOn,
    on: on,
    off: off
  };

  var exhibit = function (base, toggleConfig, toggleState) {
    return $_aq2yxwxjjcg9mdd0.nu({});
  };
  var events$1 = function (toggleConfig, toggleState) {
    var execute = $_bdrph6w4jcg9md83.executeEvent(toggleConfig, toggleState, $_79jvnzywjcg9mdgz.toggle);
    var load = $_bdrph6w4jcg9md83.loadEvent(toggleConfig, toggleState, $_79jvnzywjcg9mdgz.onLoad);
    return $_v93nkw5jcg9md8g.derive($_gcfqi6w8jcg9md8v.flatten([
      toggleConfig.toggleOnExecute() ? [execute] : [],
      [load]
    ]));
  };
  var $_2b5c0kyvjcg9mdgx = {
    exhibit: exhibit,
    events: events$1
  };

  var updatePressed = function (component, ariaInfo, status) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'aria-pressed', status);
    if (ariaInfo.syncWithExpanded())
      updateExpanded(component, ariaInfo, status);
  };
  var updateSelected = function (component, ariaInfo, status) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'aria-selected', status);
  };
  var updateChecked = function (component, ariaInfo, status) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'aria-checked', status);
  };
  var updateExpanded = function (component, ariaInfo, status) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'aria-expanded', status);
  };
  var tagAttributes = {
    button: ['aria-pressed'],
    'input:checkbox': ['aria-checked']
  };
  var roleAttributes = {
    'button': ['aria-pressed'],
    'listbox': [
      'aria-pressed',
      'aria-expanded'
    ],
    'menuitemcheckbox': ['aria-checked']
  };
  var detectFromTag = function (component) {
    var elem = component.element();
    var rawTag = $_97hwf5xwjcg9mddy.name(elem);
    var suffix = rawTag === 'input' && $_ectfz6xvjcg9mddu.has(elem, 'type') ? ':' + $_ectfz6xvjcg9mddu.get(elem, 'type') : '';
    return $_1ohhokx5jcg9mdbm.readOptFrom(tagAttributes, rawTag + suffix);
  };
  var detectFromRole = function (component) {
    var elem = component.element();
    if (!$_ectfz6xvjcg9mddu.has(elem, 'role'))
      return $_gb5srhw9jcg9md90.none();
    else {
      var role = $_ectfz6xvjcg9mddu.get(elem, 'role');
      return $_1ohhokx5jcg9mdbm.readOptFrom(roleAttributes, role);
    }
  };
  var updateAuto = function (component, ariaInfo, status) {
    var attributes = detectFromRole(component).orThunk(function () {
      return detectFromTag(component);
    }).getOr([]);
    $_gcfqi6w8jcg9md8v.each(attributes, function (attr) {
      $_ectfz6xvjcg9mddu.set(component.element(), attr, status);
    });
  };
  var $_10vxobyyjcg9mdh7 = {
    updatePressed: updatePressed,
    updateSelected: updateSelected,
    updateChecked: updateChecked,
    updateExpanded: updateExpanded,
    updateAuto: updateAuto
  };

  var ToggleSchema = [
    $_5g6e15x1jcg9mdax.defaulted('selected', false),
    $_5g6e15x1jcg9mdax.strict('toggleClass'),
    $_5g6e15x1jcg9mdax.defaulted('toggleOnExecute', true),
    $_5g6e15x1jcg9mdax.defaultedOf('aria', { mode: 'none' }, $_96sv3hxgjcg9mdco.choose('mode', {
      'pressed': [
        $_5g6e15x1jcg9mdax.defaulted('syncWithExpanded', false),
        $_f9utgpysjcg9mdgi.output('update', $_10vxobyyjcg9mdh7.updatePressed)
      ],
      'checked': [$_f9utgpysjcg9mdgi.output('update', $_10vxobyyjcg9mdh7.updateChecked)],
      'expanded': [$_f9utgpysjcg9mdgi.output('update', $_10vxobyyjcg9mdh7.updateExpanded)],
      'selected': [$_f9utgpysjcg9mdgi.output('update', $_10vxobyyjcg9mdh7.updateSelected)],
      'none': [$_f9utgpysjcg9mdgi.output('update', $_7bfl0mwajcg9md92.noop)]
    }))
  ];

  var Toggling = $_bb1w99w3jcg9md7v.create({
    fields: ToggleSchema,
    name: 'toggling',
    active: $_2b5c0kyvjcg9mdgx,
    apis: $_79jvnzywjcg9mdgz
  });

  var format = function (command, update) {
    return Receiving.config({
      channels: $_1ohhokx5jcg9mdbm.wrap($_g1ca6bynjcg9mdfu.formatChanged(), {
        onReceive: function (button, data) {
          if (data.command === command) {
            update(button, data.state);
          }
        }
      })
    });
  };
  var orientation = function (onReceive) {
    return Receiving.config({ channels: $_1ohhokx5jcg9mdbm.wrap($_g1ca6bynjcg9mdfu.orientationChanged(), { onReceive: onReceive }) });
  };
  var receive = function (channel, onReceive) {
    return {
      key: channel,
      value: { onReceive: onReceive }
    };
  };
  var $_1n9vh6yzjcg9mdhf = {
    format: format,
    orientation: orientation,
    receive: receive
  };

  var prefix = 'tinymce-mobile';
  var resolve$1 = function (p) {
    return prefix + '-' + p;
  };
  var $_3sfngaz0jcg9mdhj = {
    resolve: resolve$1,
    prefix: $_7bfl0mwajcg9md92.constant(prefix)
  };

  var exhibit$1 = function (base, unselectConfig) {
    return $_aq2yxwxjjcg9mdd0.nu({
      styles: {
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-ms-user-select': 'none',
        '-moz-user-select': '-moz-none'
      },
      attributes: { 'unselectable': 'on' }
    });
  };
  var events$2 = function (unselectConfig) {
    return $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.abort($_f4bxsewwjcg9mdab.selectstart(), $_7bfl0mwajcg9md92.constant(true))]);
  };
  var $_giziyaz3jcg9mdhu = {
    events: events$2,
    exhibit: exhibit$1
  };

  var Unselecting = $_bb1w99w3jcg9md7v.create({
    fields: [],
    name: 'unselecting',
    active: $_giziyaz3jcg9mdhu
  });

  var focus$1 = function (component, focusConfig) {
    if (!focusConfig.ignore()) {
      $_g6scf1yfjcg9mdfg.focus(component.element());
      focusConfig.onFocus()(component);
    }
  };
  var blur$1 = function (component, focusConfig) {
    if (!focusConfig.ignore()) {
      $_g6scf1yfjcg9mdfg.blur(component.element());
    }
  };
  var isFocused = function (component) {
    return $_g6scf1yfjcg9mdfg.hasFocus(component.element());
  };
  var $_2537yz7jcg9mdi5 = {
    focus: focus$1,
    blur: blur$1,
    isFocused: isFocused
  };

  var exhibit$2 = function (base, focusConfig) {
    if (focusConfig.ignore())
      return $_aq2yxwxjjcg9mdd0.nu({});
    else
      return $_aq2yxwxjjcg9mdd0.nu({ attributes: { 'tabindex': '-1' } });
  };
  var events$3 = function (focusConfig) {
    return $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.focus(), function (component, simulatedEvent) {
        $_2537yz7jcg9mdi5.focus(component, focusConfig);
        simulatedEvent.stop();
      })]);
  };
  var $_9zs44mz6jcg9mdi3 = {
    exhibit: exhibit$2,
    events: events$3
  };

  var FocusSchema = [
    $_f9utgpysjcg9mdgi.onHandler('onFocus'),
    $_5g6e15x1jcg9mdax.defaulted('ignore', false)
  ];

  var Focusing = $_bb1w99w3jcg9md7v.create({
    fields: FocusSchema,
    name: 'focusing',
    active: $_9zs44mz6jcg9mdi3,
    apis: $_2537yz7jcg9mdi5
  });

  var $_ahs1rjzdjcg9mdir = {
    BACKSPACE: $_7bfl0mwajcg9md92.constant([8]),
    TAB: $_7bfl0mwajcg9md92.constant([9]),
    ENTER: $_7bfl0mwajcg9md92.constant([13]),
    SHIFT: $_7bfl0mwajcg9md92.constant([16]),
    CTRL: $_7bfl0mwajcg9md92.constant([17]),
    ALT: $_7bfl0mwajcg9md92.constant([18]),
    CAPSLOCK: $_7bfl0mwajcg9md92.constant([20]),
    ESCAPE: $_7bfl0mwajcg9md92.constant([27]),
    SPACE: $_7bfl0mwajcg9md92.constant([32]),
    PAGEUP: $_7bfl0mwajcg9md92.constant([33]),
    PAGEDOWN: $_7bfl0mwajcg9md92.constant([34]),
    END: $_7bfl0mwajcg9md92.constant([35]),
    HOME: $_7bfl0mwajcg9md92.constant([36]),
    LEFT: $_7bfl0mwajcg9md92.constant([37]),
    UP: $_7bfl0mwajcg9md92.constant([38]),
    RIGHT: $_7bfl0mwajcg9md92.constant([39]),
    DOWN: $_7bfl0mwajcg9md92.constant([40]),
    INSERT: $_7bfl0mwajcg9md92.constant([45]),
    DEL: $_7bfl0mwajcg9md92.constant([46]),
    META: $_7bfl0mwajcg9md92.constant([
      91,
      93,
      224
    ]),
    F10: $_7bfl0mwajcg9md92.constant([121])
  };

  var cycleBy = function (value, delta, min, max) {
    var r = value + delta;
    if (r > max)
      return min;
    else
      return r < min ? max : r;
  };
  var cap = function (value, min, max) {
    if (value <= min)
      return min;
    else
      return value >= max ? max : value;
  };
  var $_7td1mhzijcg9mdje = {
    cycleBy: cycleBy,
    cap: cap
  };

  var all$3 = function (predicate) {
    return descendants$1($_6n4ng7y6jcg9mdet.body(), predicate);
  };
  var ancestors$1 = function (scope, predicate, isRoot) {
    return $_gcfqi6w8jcg9md8v.filter($_1lxhd4y2jcg9mdeh.parents(scope, isRoot), predicate);
  };
  var siblings$2 = function (scope, predicate) {
    return $_gcfqi6w8jcg9md8v.filter($_1lxhd4y2jcg9mdeh.siblings(scope), predicate);
  };
  var children$2 = function (scope, predicate) {
    return $_gcfqi6w8jcg9md8v.filter($_1lxhd4y2jcg9mdeh.children(scope), predicate);
  };
  var descendants$1 = function (scope, predicate) {
    var result = [];
    $_gcfqi6w8jcg9md8v.each($_1lxhd4y2jcg9mdeh.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants$1(x, predicate));
    });
    return result;
  };
  var $_9yi23izkjcg9mdjh = {
    all: all$3,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  var all$2 = function (selector) {
    return $_7jyciewrjcg9md9t.all(selector);
  };
  var ancestors = function (scope, selector, isRoot) {
    return $_9yi23izkjcg9mdjh.ancestors(scope, function (e) {
      return $_7jyciewrjcg9md9t.is(e, selector);
    }, isRoot);
  };
  var siblings$1 = function (scope, selector) {
    return $_9yi23izkjcg9mdjh.siblings(scope, function (e) {
      return $_7jyciewrjcg9md9t.is(e, selector);
    });
  };
  var children$1 = function (scope, selector) {
    return $_9yi23izkjcg9mdjh.children(scope, function (e) {
      return $_7jyciewrjcg9md9t.is(e, selector);
    });
  };
  var descendants = function (scope, selector) {
    return $_7jyciewrjcg9md9t.all(selector, scope);
  };
  var $_fg27d6zjjcg9mdjg = {
    all: all$2,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var first$2 = function (selector) {
    return $_7jyciewrjcg9md9t.one(selector);
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_2dj3ogyhjcg9mdfk.ancestor(scope, function (e) {
      return $_7jyciewrjcg9md9t.is(e, selector);
    }, isRoot);
  };
  var sibling$2 = function (scope, selector) {
    return $_2dj3ogyhjcg9mdfk.sibling(scope, function (e) {
      return $_7jyciewrjcg9md9t.is(e, selector);
    });
  };
  var child$3 = function (scope, selector) {
    return $_2dj3ogyhjcg9mdfk.child(scope, function (e) {
      return $_7jyciewrjcg9md9t.is(e, selector);
    });
  };
  var descendant$2 = function (scope, selector) {
    return $_7jyciewrjcg9md9t.one(selector, scope);
  };
  var closest$2 = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_7jyciewrjcg9md9t.is, ancestor$2, scope, selector, isRoot);
  };
  var $_a6xsw6zljcg9mdjk = {
    first: first$2,
    ancestor: ancestor$2,
    sibling: sibling$2,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var dehighlightAll = function (component, hConfig, hState) {
    var highlighted = $_fg27d6zjjcg9mdjg.descendants(component.element(), '.' + hConfig.highlightClass());
    $_gcfqi6w8jcg9md8v.each(highlighted, function (h) {
      $_eb18ucxtjcg9mddr.remove(h, hConfig.highlightClass());
      component.getSystem().getByDom(h).each(function (target) {
        hConfig.onDehighlight()(component, target);
      });
    });
  };
  var dehighlight = function (component, hConfig, hState, target) {
    var wasHighlighted = isHighlighted(component, hConfig, hState, target);
    $_eb18ucxtjcg9mddr.remove(target.element(), hConfig.highlightClass());
    if (wasHighlighted)
      hConfig.onDehighlight()(component, target);
  };
  var highlight = function (component, hConfig, hState, target) {
    var wasHighlighted = isHighlighted(component, hConfig, hState, target);
    dehighlightAll(component, hConfig, hState);
    $_eb18ucxtjcg9mddr.add(target.element(), hConfig.highlightClass());
    if (!wasHighlighted)
      hConfig.onHighlight()(component, target);
  };
  var highlightFirst = function (component, hConfig, hState) {
    getFirst(component, hConfig, hState).each(function (firstComp) {
      highlight(component, hConfig, hState, firstComp);
    });
  };
  var highlightLast = function (component, hConfig, hState) {
    getLast(component, hConfig, hState).each(function (lastComp) {
      highlight(component, hConfig, hState, lastComp);
    });
  };
  var highlightAt = function (component, hConfig, hState, index) {
    getByIndex(component, hConfig, hState, index).fold(function (err) {
      throw new Error(err);
    }, function (firstComp) {
      highlight(component, hConfig, hState, firstComp);
    });
  };
  var highlightBy = function (component, hConfig, hState, predicate) {
    var items = $_fg27d6zjjcg9mdjg.descendants(component.element(), '.' + hConfig.itemClass());
    var itemComps = $_6vwq8dydjcg9mdfe.cat($_gcfqi6w8jcg9md8v.map(items, function (i) {
      return component.getSystem().getByDom(i).toOption();
    }));
    var targetComp = $_gcfqi6w8jcg9md8v.find(itemComps, predicate);
    targetComp.each(function (c) {
      highlight(component, hConfig, hState, c);
    });
  };
  var isHighlighted = function (component, hConfig, hState, queryTarget) {
    return $_eb18ucxtjcg9mddr.has(queryTarget.element(), hConfig.highlightClass());
  };
  var getHighlighted = function (component, hConfig, hState) {
    return $_a6xsw6zljcg9mdjk.descendant(component.element(), '.' + hConfig.highlightClass()).bind(component.getSystem().getByDom);
  };
  var getByIndex = function (component, hConfig, hState, index) {
    var items = $_fg27d6zjjcg9mdjg.descendants(component.element(), '.' + hConfig.itemClass());
    return $_gb5srhw9jcg9md90.from(items[index]).fold(function () {
      return $_exyfurx7jcg9mdbv.error('No element found with index ' + index);
    }, component.getSystem().getByDom);
  };
  var getFirst = function (component, hConfig, hState) {
    return $_a6xsw6zljcg9mdjk.descendant(component.element(), '.' + hConfig.itemClass()).bind(component.getSystem().getByDom);
  };
  var getLast = function (component, hConfig, hState) {
    var items = $_fg27d6zjjcg9mdjg.descendants(component.element(), '.' + hConfig.itemClass());
    var last = items.length > 0 ? $_gb5srhw9jcg9md90.some(items[items.length - 1]) : $_gb5srhw9jcg9md90.none();
    return last.bind(component.getSystem().getByDom);
  };
  var getDelta = function (component, hConfig, hState, delta) {
    var items = $_fg27d6zjjcg9mdjg.descendants(component.element(), '.' + hConfig.itemClass());
    var current = $_gcfqi6w8jcg9md8v.findIndex(items, function (item) {
      return $_eb18ucxtjcg9mddr.has(item, hConfig.highlightClass());
    });
    return current.bind(function (selected) {
      var dest = $_7td1mhzijcg9mdje.cycleBy(selected, delta, 0, items.length - 1);
      return component.getSystem().getByDom(items[dest]);
    });
  };
  var getPrevious = function (component, hConfig, hState) {
    return getDelta(component, hConfig, hState, -1);
  };
  var getNext = function (component, hConfig, hState) {
    return getDelta(component, hConfig, hState, +1);
  };
  var $_bzghpqzhjcg9mdj3 = {
    dehighlightAll: dehighlightAll,
    dehighlight: dehighlight,
    highlight: highlight,
    highlightFirst: highlightFirst,
    highlightLast: highlightLast,
    highlightAt: highlightAt,
    highlightBy: highlightBy,
    isHighlighted: isHighlighted,
    getHighlighted: getHighlighted,
    getFirst: getFirst,
    getLast: getLast,
    getPrevious: getPrevious,
    getNext: getNext
  };

  var HighlightSchema = [
    $_5g6e15x1jcg9mdax.strict('highlightClass'),
    $_5g6e15x1jcg9mdax.strict('itemClass'),
    $_f9utgpysjcg9mdgi.onHandler('onHighlight'),
    $_f9utgpysjcg9mdgi.onHandler('onDehighlight')
  ];

  var Highlighting = $_bb1w99w3jcg9md7v.create({
    fields: HighlightSchema,
    name: 'highlighting',
    apis: $_bzghpqzhjcg9mdj3
  });

  var dom = function () {
    var get = function (component) {
      return $_g6scf1yfjcg9mdfg.search(component.element());
    };
    var set = function (component, focusee) {
      component.getSystem().triggerFocus(focusee, component.element());
    };
    return {
      get: get,
      set: set
    };
  };
  var highlights = function () {
    var get = function (component) {
      return Highlighting.getHighlighted(component).map(function (item) {
        return item.element();
      });
    };
    var set = function (component, element) {
      component.getSystem().getByDom(element).fold($_7bfl0mwajcg9md92.noop, function (item) {
        Highlighting.highlight(component, item);
      });
    };
    return {
      get: get,
      set: set
    };
  };
  var $_6vsgxjzfjcg9mdiy = {
    dom: dom,
    highlights: highlights
  };

  var inSet = function (keys) {
    return function (event) {
      return $_gcfqi6w8jcg9md8v.contains(keys, event.raw().which);
    };
  };
  var and = function (preds) {
    return function (event) {
      return $_gcfqi6w8jcg9md8v.forall(preds, function (pred) {
        return pred(event);
      });
    };
  };
  var is$1 = function (key) {
    return function (event) {
      return event.raw().which === key;
    };
  };
  var isShift = function (event) {
    return event.raw().shiftKey === true;
  };
  var isControl = function (event) {
    return event.raw().ctrlKey === true;
  };
  var $_63aqg5zojcg9mdjs = {
    inSet: inSet,
    and: and,
    is: is$1,
    isShift: isShift,
    isNotShift: $_7bfl0mwajcg9md92.not(isShift),
    isControl: isControl,
    isNotControl: $_7bfl0mwajcg9md92.not(isControl)
  };

  var basic = function (key, action) {
    return {
      matches: $_63aqg5zojcg9mdjs.is(key),
      classification: action
    };
  };
  var rule = function (matches, action) {
    return {
      matches: matches,
      classification: action
    };
  };
  var choose$2 = function (transitions, event) {
    var transition = $_gcfqi6w8jcg9md8v.find(transitions, function (t) {
      return t.matches(event);
    });
    return transition.map(function (t) {
      return t.classification;
    });
  };
  var $_6hgt48znjcg9mdjp = {
    basic: basic,
    rule: rule,
    choose: choose$2
  };

  var typical = function (infoSchema, stateInit, getRules, getEvents, getApis, optFocusIn) {
    var schema = function () {
      return infoSchema.concat([
        $_5g6e15x1jcg9mdax.defaulted('focusManager', $_6vsgxjzfjcg9mdiy.dom()),
        $_f9utgpysjcg9mdgi.output('handler', me),
        $_f9utgpysjcg9mdgi.output('state', stateInit)
      ]);
    };
    var processKey = function (component, simulatedEvent, keyingConfig, keyingState) {
      var rules = getRules(component, simulatedEvent, keyingConfig, keyingState);
      return $_6hgt48znjcg9mdjp.choose(rules, simulatedEvent.event()).bind(function (rule) {
        return rule(component, simulatedEvent, keyingConfig, keyingState);
      });
    };
    var toEvents = function (keyingConfig, keyingState) {
      var otherEvents = getEvents(keyingConfig, keyingState);
      var keyEvents = $_v93nkw5jcg9md8g.derive(optFocusIn.map(function (focusIn) {
        return $_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.focus(), function (component, simulatedEvent) {
          focusIn(component, keyingConfig, keyingState, simulatedEvent);
          simulatedEvent.stop();
        });
      }).toArray().concat([$_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.keydown(), function (component, simulatedEvent) {
          processKey(component, simulatedEvent, keyingConfig, keyingState).each(function (_) {
            simulatedEvent.stop();
          });
        })]));
      return $_4xvhzgwxjcg9mdae.deepMerge(otherEvents, keyEvents);
    };
    var me = {
      schema: schema,
      processKey: processKey,
      toEvents: toEvents,
      toApis: getApis
    };
    return me;
  };
  var $_3ydw1hzejcg9mdiu = { typical: typical };

  var cyclePrev = function (values, index, predicate) {
    var before = $_gcfqi6w8jcg9md8v.reverse(values.slice(0, index));
    var after = $_gcfqi6w8jcg9md8v.reverse(values.slice(index + 1));
    return $_gcfqi6w8jcg9md8v.find(before.concat(after), predicate);
  };
  var tryPrev = function (values, index, predicate) {
    var before = $_gcfqi6w8jcg9md8v.reverse(values.slice(0, index));
    return $_gcfqi6w8jcg9md8v.find(before, predicate);
  };
  var cycleNext = function (values, index, predicate) {
    var before = values.slice(0, index);
    var after = values.slice(index + 1);
    return $_gcfqi6w8jcg9md8v.find(after.concat(before), predicate);
  };
  var tryNext = function (values, index, predicate) {
    var after = values.slice(index + 1);
    return $_gcfqi6w8jcg9md8v.find(after, predicate);
  };
  var $_4b0a2izpjcg9mdjv = {
    cyclePrev: cyclePrev,
    cycleNext: cycleNext,
    tryPrev: tryPrev,
    tryNext: tryNext
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_aibz40zsjcg9mdk7 = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_dkt1fwyjcg9mdaf.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_aibz40zsjcg9mdk7.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_aibz40zsjcg9mdk7.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set$3 = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function (element, css) {
    var dom = element.dom();
    $_9is1m7wzjcg9mdag.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_9is1m7wzjcg9mdag.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get$4 = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_6n4ng7y6jcg9mdet.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_aibz40zsjcg9mdk7.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return $_gb5srhw9jcg9md90.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_aibz40zsjcg9mdk7.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_41aqpdwsjcg9md9w.fromTag(tag);
    set$3(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove$5 = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_ectfz6xvjcg9mddu.has(element, 'style') && $_7ozyznwojcg9md9q.trim($_ectfz6xvjcg9mddu.get(element, 'style')) === '') {
      $_ectfz6xvjcg9mddu.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_ectfz6xvjcg9mddu.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_ectfz6xvjcg9mddu.remove : $_ectfz6xvjcg9mddu.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy$1 = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_aibz40zsjcg9mdk7.isSupported(sourceDom) && $_aibz40zsjcg9mdk7.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne$1 = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set$3(destination, style, value);
    });
  };
  var transfer$1 = function (source, destination, styles) {
    if (!$_97hwf5xwjcg9mddy.isElement(source) || !$_97hwf5xwjcg9mddy.isElement(destination))
      return;
    $_gcfqi6w8jcg9md8v.each(styles, function (style) {
      transferOne$1(source, destination, style);
    });
  };
  var $_bctu7wzrjcg9mdk0 = {
    copy: copy$1,
    set: set$3,
    preserve: preserve,
    setAll: setAll$1,
    setOptions: setOptions,
    remove: remove$5,
    get: get$4,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer$1
  };

  var Dimension = function (name, getOffset) {
    var set = function (element, h) {
      if (!$_dkt1fwyjcg9mdaf.isNumber(h) && !h.match(/^[0-9]+$/))
        throw name + '.set accepts only positive integer values. Value was ' + h;
      var dom = element.dom();
      if ($_aibz40zsjcg9mdk7.isSupported(dom))
        dom.style[name] = h + 'px';
    };
    var get = function (element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = $_bctu7wzrjcg9mdk0.get(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function (element, properties) {
      return $_gcfqi6w8jcg9md8v.foldl(properties, function (acc, property) {
        var val = $_bctu7wzrjcg9mdk0.get(element, property);
        var value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
    };
    var max = function (element, value, properties) {
      var cumulativeInclusions = aggregate(element, properties);
      var absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
      return absoluteMax;
    };
    return {
      set: set,
      get: get,
      getOuter: getOuter,
      aggregate: aggregate,
      max: max
    };
  };

  var api = Dimension('height', function (element) {
    return $_6n4ng7y6jcg9mdet.inBody(element) ? element.dom().getBoundingClientRect().height : element.dom().offsetHeight;
  });
  var set$2 = function (element, h) {
    api.set(element, h);
  };
  var get$3 = function (element) {
    return api.get(element);
  };
  var getOuter$1 = function (element) {
    return api.getOuter(element);
  };
  var setMax = function (element, value) {
    var inclusions = [
      'margin-top',
      'border-top-width',
      'padding-top',
      'padding-bottom',
      'border-bottom-width',
      'margin-bottom'
    ];
    var absMax = api.max(element, value, inclusions);
    $_bctu7wzrjcg9mdk0.set(element, 'max-height', absMax + 'px');
  };
  var $_2p843fzqjcg9mdjy = {
    set: set$2,
    get: get$3,
    getOuter: getOuter$1,
    setMax: setMax
  };

  var create$2 = function (cyclicField) {
    var schema = [
      $_5g6e15x1jcg9mdax.option('onEscape'),
      $_5g6e15x1jcg9mdax.option('onEnter'),
      $_5g6e15x1jcg9mdax.defaulted('selector', '[data-alloy-tabstop="true"]'),
      $_5g6e15x1jcg9mdax.defaulted('firstTabstop', 0),
      $_5g6e15x1jcg9mdax.defaulted('useTabstopAt', $_7bfl0mwajcg9md92.constant(true)),
      $_5g6e15x1jcg9mdax.option('visibilitySelector')
    ].concat([cyclicField]);
    var isVisible = function (tabbingConfig, element) {
      var target = tabbingConfig.visibilitySelector().bind(function (sel) {
        return $_a6xsw6zljcg9mdjk.closest(element, sel);
      }).getOr(element);
      return $_2p843fzqjcg9mdjy.get(target) > 0;
    };
    var findInitial = function (component, tabbingConfig) {
      var tabstops = $_fg27d6zjjcg9mdjg.descendants(component.element(), tabbingConfig.selector());
      var visibles = $_gcfqi6w8jcg9md8v.filter(tabstops, function (elem) {
        return isVisible(tabbingConfig, elem);
      });
      return $_gb5srhw9jcg9md90.from(visibles[tabbingConfig.firstTabstop()]);
    };
    var findCurrent = function (component, tabbingConfig) {
      return tabbingConfig.focusManager().get(component).bind(function (elem) {
        return $_a6xsw6zljcg9mdjk.closest(elem, tabbingConfig.selector());
      });
    };
    var isTabstop = function (tabbingConfig, element) {
      return isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt()(element);
    };
    var focusIn = function (component, tabbingConfig, tabbingState) {
      findInitial(component, tabbingConfig).each(function (target) {
        tabbingConfig.focusManager().set(component, target);
      });
    };
    var goFromTabstop = function (component, tabstops, stopIndex, tabbingConfig, cycle) {
      return cycle(tabstops, stopIndex, function (elem) {
        return isTabstop(tabbingConfig, elem);
      }).fold(function () {
        return tabbingConfig.cyclic() ? $_gb5srhw9jcg9md90.some(true) : $_gb5srhw9jcg9md90.none();
      }, function (target) {
        tabbingConfig.focusManager().set(component, target);
        return $_gb5srhw9jcg9md90.some(true);
      });
    };
    var go = function (component, simulatedEvent, tabbingConfig, cycle) {
      var tabstops = $_fg27d6zjjcg9mdjg.descendants(component.element(), tabbingConfig.selector());
      return findCurrent(component, tabbingConfig).bind(function (tabstop) {
        var optStopIndex = $_gcfqi6w8jcg9md8v.findIndex(tabstops, $_7bfl0mwajcg9md92.curry($_9sx28sw7jcg9md8n.eq, tabstop));
        return optStopIndex.bind(function (stopIndex) {
          return goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle);
        });
      });
    };
    var goBackwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic() ? $_4b0a2izpjcg9mdjv.cyclePrev : $_4b0a2izpjcg9mdjv.tryPrev;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var goForwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic() ? $_4b0a2izpjcg9mdjv.cycleNext : $_4b0a2izpjcg9mdjv.tryNext;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var execute = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEnter().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var exit = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEscape().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var getRules = $_7bfl0mwajcg9md92.constant([
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isShift,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
      ]), goBackwards),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB()), goForwards),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ESCAPE()), exit),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isNotShift,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ENTER())
      ]), execute)
    ]);
    var getEvents = $_7bfl0mwajcg9md92.constant({});
    var getApis = $_7bfl0mwajcg9md92.constant({});
    return $_3ydw1hzejcg9mdiu.typical(schema, $_dhezwlxpjcg9mddk.init, getRules, getEvents, getApis, $_gb5srhw9jcg9md90.some(focusIn));
  };
  var $_ftfya9zcjcg9mdih = { create: create$2 };

  var AcyclicType = $_ftfya9zcjcg9mdih.create($_5g6e15x1jcg9mdax.state('cyclic', $_7bfl0mwajcg9md92.constant(false)));

  var CyclicType = $_ftfya9zcjcg9mdih.create($_5g6e15x1jcg9mdax.state('cyclic', $_7bfl0mwajcg9md92.constant(true)));

  var inside = function (target) {
    return $_97hwf5xwjcg9mddy.name(target) === 'input' && $_ectfz6xvjcg9mddu.get(target, 'type') !== 'radio' || $_97hwf5xwjcg9mddy.name(target) === 'textarea';
  };
  var $_9cxll8zwjcg9mdkk = { inside: inside };

  var doDefaultExecute = function (component, simulatedEvent, focused) {
    $_4wv38zwujcg9mda1.dispatch(component, focused, $_fvndowvjcg9mda7.execute());
    return $_gb5srhw9jcg9md90.some(true);
  };
  var defaultExecute = function (component, simulatedEvent, focused) {
    return $_9cxll8zwjcg9mdkk.inside(focused) && $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE())(simulatedEvent.event()) ? $_gb5srhw9jcg9md90.none() : doDefaultExecute(component, simulatedEvent, focused);
  };
  var $_8qsg9rzxjcg9mdkp = { defaultExecute: defaultExecute };

  var schema$1 = [
    $_5g6e15x1jcg9mdax.defaulted('execute', $_8qsg9rzxjcg9mdkp.defaultExecute),
    $_5g6e15x1jcg9mdax.defaulted('useSpace', false),
    $_5g6e15x1jcg9mdax.defaulted('useEnter', true),
    $_5g6e15x1jcg9mdax.defaulted('useControlEnter', false),
    $_5g6e15x1jcg9mdax.defaulted('useDown', false)
  ];
  var execute = function (component, simulatedEvent, executeConfig, executeState) {
    return executeConfig.execute()(component, simulatedEvent, component.element());
  };
  var getRules = function (component, simulatedEvent, executeConfig, executeState) {
    var spaceExec = executeConfig.useSpace() && !$_9cxll8zwjcg9mdkk.inside(component.element()) ? $_ahs1rjzdjcg9mdir.SPACE() : [];
    var enterExec = executeConfig.useEnter() ? $_ahs1rjzdjcg9mdir.ENTER() : [];
    var downExec = executeConfig.useDown() ? $_ahs1rjzdjcg9mdir.DOWN() : [];
    var execKeys = spaceExec.concat(enterExec).concat(downExec);
    return [$_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet(execKeys), execute)].concat(executeConfig.useControlEnter() ? [$_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isControl,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ENTER())
      ]), execute)] : []);
  };
  var getEvents = $_7bfl0mwajcg9md92.constant({});
  var getApis = $_7bfl0mwajcg9md92.constant({});
  var ExecutionType = $_3ydw1hzejcg9mdiu.typical(schema$1, $_dhezwlxpjcg9mddk.init, getRules, getEvents, getApis, $_gb5srhw9jcg9md90.none());

  var flatgrid = function (spec) {
    var dimensions = Cell($_gb5srhw9jcg9md90.none());
    var setGridSize = function (numRows, numColumns) {
      dimensions.set($_gb5srhw9jcg9md90.some({
        numRows: $_7bfl0mwajcg9md92.constant(numRows),
        numColumns: $_7bfl0mwajcg9md92.constant(numColumns)
      }));
    };
    var getNumRows = function () {
      return dimensions.get().map(function (d) {
        return d.numRows();
      });
    };
    var getNumColumns = function () {
      return dimensions.get().map(function (d) {
        return d.numColumns();
      });
    };
    return BehaviourState({
      readState: $_7bfl0mwajcg9md92.constant({}),
      setGridSize: setGridSize,
      getNumRows: getNumRows,
      getNumColumns: getNumColumns
    });
  };
  var init$1 = function (spec) {
    return spec.state()(spec);
  };
  var $_1a96ylzzjcg9mdkz = {
    flatgrid: flatgrid,
    init: init$1
  };

  var onDirection = function (isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function (element) {
    return $_bctu7wzrjcg9mdk0.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };
  var $_81cuo5101jcg9mdl8 = {
    onDirection: onDirection,
    getDirection: getDirection
  };

  var useH = function (movement) {
    return function (component, simulatedEvent, config, state) {
      var move = movement(component.element());
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var west = function (moveLeft, moveRight) {
    var movement = $_81cuo5101jcg9mdl8.onDirection(moveLeft, moveRight);
    return useH(movement);
  };
  var east = function (moveLeft, moveRight) {
    var movement = $_81cuo5101jcg9mdl8.onDirection(moveRight, moveLeft);
    return useH(movement);
  };
  var useV = function (move) {
    return function (component, simulatedEvent, config, state) {
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var use = function (move, component, simulatedEvent, config, state) {
    var outcome = config.focusManager().get(component).bind(function (focused) {
      return move(component.element(), focused, config, state);
    });
    return outcome.map(function (newFocus) {
      config.focusManager().set(component, newFocus);
      return true;
    });
  };
  var $_9ge85w100jcg9mdl4 = {
    east: east,
    west: west,
    north: useV,
    south: useV,
    move: useV
  };

  var indexInfo = $_ahnnvkxljcg9mddc.immutableBag([
    'index',
    'candidates'
  ], []);
  var locate = function (candidates, predicate) {
    return $_gcfqi6w8jcg9md8v.findIndex(candidates, predicate).map(function (index) {
      return indexInfo({
        index: index,
        candidates: candidates
      });
    });
  };
  var $_cyit5a103jcg9mdlh = { locate: locate };

  var visibilityToggler = function (element, property, hiddenValue, visibleValue) {
    var initial = $_bctu7wzrjcg9mdk0.get(element, property);
    if (initial === undefined)
      initial = '';
    var value = initial === hiddenValue ? visibleValue : hiddenValue;
    var off = $_7bfl0mwajcg9md92.curry($_bctu7wzrjcg9mdk0.set, element, property, initial);
    var on = $_7bfl0mwajcg9md92.curry($_bctu7wzrjcg9mdk0.set, element, property, value);
    return Toggler(off, on, false);
  };
  var toggler$1 = function (element) {
    return visibilityToggler(element, 'visibility', 'hidden', 'visible');
  };
  var displayToggler = function (element, value) {
    return visibilityToggler(element, 'display', 'none', value);
  };
  var isHidden = function (dom) {
    return dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
  };
  var isVisible = function (element) {
    var dom = element.dom();
    return !isHidden(dom);
  };
  var $_8ogzpj104jcg9mdll = {
    toggler: toggler$1,
    displayToggler: displayToggler,
    isVisible: isVisible
  };

  var locateVisible = function (container, current, selector) {
    var filter = $_8ogzpj104jcg9mdll.isVisible;
    return locateIn(container, current, selector, filter);
  };
  var locateIn = function (container, current, selector, filter) {
    var predicate = $_7bfl0mwajcg9md92.curry($_9sx28sw7jcg9md8n.eq, current);
    var candidates = $_fg27d6zjjcg9mdjg.descendants(container, selector);
    var visible = $_gcfqi6w8jcg9md8v.filter(candidates, $_8ogzpj104jcg9mdll.isVisible);
    return $_cyit5a103jcg9mdlh.locate(visible, predicate);
  };
  var findIndex$2 = function (elements, target) {
    return $_gcfqi6w8jcg9md8v.findIndex(elements, function (elem) {
      return $_9sx28sw7jcg9md8n.eq(target, elem);
    });
  };
  var $_4yx3i9102jcg9mdl9 = {
    locateVisible: locateVisible,
    locateIn: locateIn,
    findIndex: findIndex$2
  };

  var withGrid = function (values, index, numCols, f) {
    var oldRow = Math.floor(index / numCols);
    var oldColumn = index % numCols;
    return f(oldRow, oldColumn).bind(function (address) {
      var newIndex = address.row() * numCols + address.column();
      return newIndex >= 0 && newIndex < values.length ? $_gb5srhw9jcg9md90.some(values[newIndex]) : $_gb5srhw9jcg9md90.none();
    });
  };
  var cycleHorizontal = function (values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var onLastRow = oldRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - oldRow * numCols : numCols;
      var newColumn = $_7td1mhzijcg9mdje.cycleBy(oldColumn, delta, 0, colsInRow - 1);
      return $_gb5srhw9jcg9md90.some({
        row: $_7bfl0mwajcg9md92.constant(oldRow),
        column: $_7bfl0mwajcg9md92.constant(newColumn)
      });
    });
  };
  var cycleVertical = function (values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var newRow = $_7td1mhzijcg9mdje.cycleBy(oldRow, delta, 0, numRows - 1);
      var onLastRow = newRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - newRow * numCols : numCols;
      var newCol = $_7td1mhzijcg9mdje.cap(oldColumn, 0, colsInRow - 1);
      return $_gb5srhw9jcg9md90.some({
        row: $_7bfl0mwajcg9md92.constant(newRow),
        column: $_7bfl0mwajcg9md92.constant(newCol)
      });
    });
  };
  var cycleRight = function (values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, +1);
  };
  var cycleLeft = function (values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, -1);
  };
  var cycleUp = function (values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, -1);
  };
  var cycleDown = function (values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, +1);
  };
  var $_ery7cv105jcg9mdlo = {
    cycleDown: cycleDown,
    cycleUp: cycleUp,
    cycleLeft: cycleLeft,
    cycleRight: cycleRight
  };

  var schema$2 = [
    $_5g6e15x1jcg9mdax.strict('selector'),
    $_5g6e15x1jcg9mdax.defaulted('execute', $_8qsg9rzxjcg9mdkp.defaultExecute),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onEscape'),
    $_5g6e15x1jcg9mdax.defaulted('captureTab', false),
    $_f9utgpysjcg9mdgi.initSize()
  ];
  var focusIn = function (component, gridConfig, gridState) {
    $_a6xsw6zljcg9mdjk.descendant(component.element(), gridConfig.selector()).each(function (first) {
      gridConfig.focusManager().set(component, first);
    });
  };
  var findCurrent = function (component, gridConfig) {
    return gridConfig.focusManager().get(component).bind(function (elem) {
      return $_a6xsw6zljcg9mdjk.closest(elem, gridConfig.selector());
    });
  };
  var execute$1 = function (component, simulatedEvent, gridConfig, gridState) {
    return findCurrent(component, gridConfig).bind(function (focused) {
      return gridConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var doMove = function (cycle) {
    return function (element, focused, gridConfig, gridState) {
      return $_4yx3i9102jcg9mdl9.locateVisible(element, focused, gridConfig.selector()).bind(function (identified) {
        return cycle(identified.candidates(), identified.index(), gridState.getNumRows().getOr(gridConfig.initSize().numRows()), gridState.getNumColumns().getOr(gridConfig.initSize().numColumns()));
      });
    };
  };
  var handleTab = function (component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.captureTab() ? $_gb5srhw9jcg9md90.some(true) : $_gb5srhw9jcg9md90.none();
  };
  var doEscape = function (component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.onEscape()(component, simulatedEvent);
  };
  var moveLeft = doMove($_ery7cv105jcg9mdlo.cycleLeft);
  var moveRight = doMove($_ery7cv105jcg9mdlo.cycleRight);
  var moveNorth = doMove($_ery7cv105jcg9mdlo.cycleUp);
  var moveSouth = doMove($_ery7cv105jcg9mdlo.cycleDown);
  var getRules$1 = $_7bfl0mwajcg9md92.constant([
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.LEFT()), $_9ge85w100jcg9mdl4.west(moveLeft, moveRight)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.RIGHT()), $_9ge85w100jcg9mdl4.east(moveLeft, moveRight)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.UP()), $_9ge85w100jcg9mdl4.north(moveNorth)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.DOWN()), $_9ge85w100jcg9mdl4.south(moveSouth)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
      $_63aqg5zojcg9mdjs.isShift,
      $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
    ]), handleTab),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
      $_63aqg5zojcg9mdjs.isNotShift,
      $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
    ]), handleTab),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ESCAPE()), doEscape),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE().concat($_ahs1rjzdjcg9mdir.ENTER())), execute$1)
  ]);
  var getEvents$1 = $_7bfl0mwajcg9md92.constant({});
  var getApis$1 = {};
  var FlatgridType = $_3ydw1hzejcg9mdiu.typical(schema$2, $_1a96ylzzjcg9mdkz.flatgrid, getRules$1, getEvents$1, getApis$1, $_gb5srhw9jcg9md90.some(focusIn));

  var horizontal = function (container, selector, current, delta) {
    return $_4yx3i9102jcg9mdl9.locateVisible(container, current, selector, $_7bfl0mwajcg9md92.constant(true)).bind(function (identified) {
      var index = identified.index();
      var candidates = identified.candidates();
      var newIndex = $_7td1mhzijcg9mdje.cycleBy(index, delta, 0, candidates.length - 1);
      return $_gb5srhw9jcg9md90.from(candidates[newIndex]);
    });
  };
  var $_15vz4f107jcg9mdlz = { horizontal: horizontal };

  var schema$3 = [
    $_5g6e15x1jcg9mdax.strict('selector'),
    $_5g6e15x1jcg9mdax.defaulted('getInitial', $_gb5srhw9jcg9md90.none),
    $_5g6e15x1jcg9mdax.defaulted('execute', $_8qsg9rzxjcg9mdkp.defaultExecute),
    $_5g6e15x1jcg9mdax.defaulted('executeOnMove', false)
  ];
  var findCurrent$1 = function (component, flowConfig) {
    return flowConfig.focusManager().get(component).bind(function (elem) {
      return $_a6xsw6zljcg9mdjk.closest(elem, flowConfig.selector());
    });
  };
  var execute$2 = function (component, simulatedEvent, flowConfig) {
    return findCurrent$1(component, flowConfig).bind(function (focused) {
      return flowConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var focusIn$1 = function (component, flowConfig) {
    flowConfig.getInitial()(component).or($_a6xsw6zljcg9mdjk.descendant(component.element(), flowConfig.selector())).each(function (first) {
      flowConfig.focusManager().set(component, first);
    });
  };
  var moveLeft$1 = function (element, focused, info) {
    return $_15vz4f107jcg9mdlz.horizontal(element, info.selector(), focused, -1);
  };
  var moveRight$1 = function (element, focused, info) {
    return $_15vz4f107jcg9mdlz.horizontal(element, info.selector(), focused, +1);
  };
  var doMove$1 = function (movement) {
    return function (component, simulatedEvent, flowConfig) {
      return movement(component, simulatedEvent, flowConfig).bind(function () {
        return flowConfig.executeOnMove() ? execute$2(component, simulatedEvent, flowConfig) : $_gb5srhw9jcg9md90.some(true);
      });
    };
  };
  var getRules$2 = function (_) {
    return [
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.LEFT().concat($_ahs1rjzdjcg9mdir.UP())), doMove$1($_9ge85w100jcg9mdl4.west(moveLeft$1, moveRight$1))),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.RIGHT().concat($_ahs1rjzdjcg9mdir.DOWN())), doMove$1($_9ge85w100jcg9mdl4.east(moveLeft$1, moveRight$1))),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ENTER()), execute$2),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE()), execute$2)
    ];
  };
  var getEvents$2 = $_7bfl0mwajcg9md92.constant({});
  var getApis$2 = $_7bfl0mwajcg9md92.constant({});
  var FlowType = $_3ydw1hzejcg9mdiu.typical(schema$3, $_dhezwlxpjcg9mddk.init, getRules$2, getEvents$2, getApis$2, $_gb5srhw9jcg9md90.some(focusIn$1));

  var outcome = $_ahnnvkxljcg9mddc.immutableBag([
    'rowIndex',
    'columnIndex',
    'cell'
  ], []);
  var toCell = function (matrix, rowIndex, columnIndex) {
    return $_gb5srhw9jcg9md90.from(matrix[rowIndex]).bind(function (row) {
      return $_gb5srhw9jcg9md90.from(row[columnIndex]).map(function (cell) {
        return outcome({
          rowIndex: rowIndex,
          columnIndex: columnIndex,
          cell: cell
        });
      });
    });
  };
  var cycleHorizontal$1 = function (matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = $_7td1mhzijcg9mdje.cycleBy(startCol, deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var cycleVertical$1 = function (matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = $_7td1mhzijcg9mdje.cycleBy(startRow, deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = $_7td1mhzijcg9mdje.cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var moveHorizontal = function (matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = $_7td1mhzijcg9mdje.cap(startCol + deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var moveVertical = function (matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = $_7td1mhzijcg9mdje.cap(startRow + deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = $_7td1mhzijcg9mdje.cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var cycleRight$1 = function (matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, +1);
  };
  var cycleLeft$1 = function (matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, -1);
  };
  var cycleUp$1 = function (matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, -1);
  };
  var cycleDown$1 = function (matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, +1);
  };
  var moveLeft$3 = function (matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, -1);
  };
  var moveRight$3 = function (matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, +1);
  };
  var moveUp = function (matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, -1);
  };
  var moveDown = function (matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, +1);
  };
  var $_bs0m68109jcg9mdmg = {
    cycleRight: cycleRight$1,
    cycleLeft: cycleLeft$1,
    cycleUp: cycleUp$1,
    cycleDown: cycleDown$1,
    moveLeft: moveLeft$3,
    moveRight: moveRight$3,
    moveUp: moveUp,
    moveDown: moveDown
  };

  var schema$4 = [
    $_5g6e15x1jcg9mdax.strictObjOf('selectors', [
      $_5g6e15x1jcg9mdax.strict('row'),
      $_5g6e15x1jcg9mdax.strict('cell')
    ]),
    $_5g6e15x1jcg9mdax.defaulted('cycles', true),
    $_5g6e15x1jcg9mdax.defaulted('previousSelector', $_gb5srhw9jcg9md90.none),
    $_5g6e15x1jcg9mdax.defaulted('execute', $_8qsg9rzxjcg9mdkp.defaultExecute)
  ];
  var focusIn$2 = function (component, matrixConfig) {
    var focused = matrixConfig.previousSelector()(component).orThunk(function () {
      var selectors = matrixConfig.selectors();
      return $_a6xsw6zljcg9mdjk.descendant(component.element(), selectors.cell());
    });
    focused.each(function (cell) {
      matrixConfig.focusManager().set(component, cell);
    });
  };
  var execute$3 = function (component, simulatedEvent, matrixConfig) {
    return $_g6scf1yfjcg9mdfg.search(component.element()).bind(function (focused) {
      return matrixConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var toMatrix = function (rows, matrixConfig) {
    return $_gcfqi6w8jcg9md8v.map(rows, function (row) {
      return $_fg27d6zjjcg9mdjg.descendants(row, matrixConfig.selectors().cell());
    });
  };
  var doMove$2 = function (ifCycle, ifMove) {
    return function (element, focused, matrixConfig) {
      var move = matrixConfig.cycles() ? ifCycle : ifMove;
      return $_a6xsw6zljcg9mdjk.closest(focused, matrixConfig.selectors().row()).bind(function (inRow) {
        var cellsInRow = $_fg27d6zjjcg9mdjg.descendants(inRow, matrixConfig.selectors().cell());
        return $_4yx3i9102jcg9mdl9.findIndex(cellsInRow, focused).bind(function (colIndex) {
          var allRows = $_fg27d6zjjcg9mdjg.descendants(element, matrixConfig.selectors().row());
          return $_4yx3i9102jcg9mdl9.findIndex(allRows, inRow).bind(function (rowIndex) {
            var matrix = toMatrix(allRows, matrixConfig);
            return move(matrix, rowIndex, colIndex).map(function (next) {
              return next.cell();
            });
          });
        });
      });
    };
  };
  var moveLeft$2 = doMove$2($_bs0m68109jcg9mdmg.cycleLeft, $_bs0m68109jcg9mdmg.moveLeft);
  var moveRight$2 = doMove$2($_bs0m68109jcg9mdmg.cycleRight, $_bs0m68109jcg9mdmg.moveRight);
  var moveNorth$1 = doMove$2($_bs0m68109jcg9mdmg.cycleUp, $_bs0m68109jcg9mdmg.moveUp);
  var moveSouth$1 = doMove$2($_bs0m68109jcg9mdmg.cycleDown, $_bs0m68109jcg9mdmg.moveDown);
  var getRules$3 = $_7bfl0mwajcg9md92.constant([
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.LEFT()), $_9ge85w100jcg9mdl4.west(moveLeft$2, moveRight$2)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.RIGHT()), $_9ge85w100jcg9mdl4.east(moveLeft$2, moveRight$2)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.UP()), $_9ge85w100jcg9mdl4.north(moveNorth$1)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.DOWN()), $_9ge85w100jcg9mdl4.south(moveSouth$1)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE().concat($_ahs1rjzdjcg9mdir.ENTER())), execute$3)
  ]);
  var getEvents$3 = $_7bfl0mwajcg9md92.constant({});
  var getApis$3 = $_7bfl0mwajcg9md92.constant({});
  var MatrixType = $_3ydw1hzejcg9mdiu.typical(schema$4, $_dhezwlxpjcg9mddk.init, getRules$3, getEvents$3, getApis$3, $_gb5srhw9jcg9md90.some(focusIn$2));

  var schema$5 = [
    $_5g6e15x1jcg9mdax.strict('selector'),
    $_5g6e15x1jcg9mdax.defaulted('execute', $_8qsg9rzxjcg9mdkp.defaultExecute),
    $_5g6e15x1jcg9mdax.defaulted('moveOnTab', false)
  ];
  var execute$4 = function (component, simulatedEvent, menuConfig) {
    return menuConfig.focusManager().get(component).bind(function (focused) {
      return menuConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var focusIn$3 = function (component, menuConfig, simulatedEvent) {
    $_a6xsw6zljcg9mdjk.descendant(component.element(), menuConfig.selector()).each(function (first) {
      menuConfig.focusManager().set(component, first);
    });
  };
  var moveUp$1 = function (element, focused, info) {
    return $_15vz4f107jcg9mdlz.horizontal(element, info.selector(), focused, -1);
  };
  var moveDown$1 = function (element, focused, info) {
    return $_15vz4f107jcg9mdlz.horizontal(element, info.selector(), focused, +1);
  };
  var fireShiftTab = function (component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab() ? $_9ge85w100jcg9mdl4.move(moveUp$1)(component, simulatedEvent, menuConfig) : $_gb5srhw9jcg9md90.none();
  };
  var fireTab = function (component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab() ? $_9ge85w100jcg9mdl4.move(moveDown$1)(component, simulatedEvent, menuConfig) : $_gb5srhw9jcg9md90.none();
  };
  var getRules$4 = $_7bfl0mwajcg9md92.constant([
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.UP()), $_9ge85w100jcg9mdl4.move(moveUp$1)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.DOWN()), $_9ge85w100jcg9mdl4.move(moveDown$1)),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
      $_63aqg5zojcg9mdjs.isShift,
      $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
    ]), fireShiftTab),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
      $_63aqg5zojcg9mdjs.isNotShift,
      $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
    ]), fireTab),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ENTER()), execute$4),
    $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE()), execute$4)
  ]);
  var getEvents$4 = $_7bfl0mwajcg9md92.constant({});
  var getApis$4 = $_7bfl0mwajcg9md92.constant({});
  var MenuType = $_3ydw1hzejcg9mdiu.typical(schema$5, $_dhezwlxpjcg9mddk.init, getRules$4, getEvents$4, getApis$4, $_gb5srhw9jcg9md90.some(focusIn$3));

  var schema$6 = [
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onSpace'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onEnter'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onShiftEnter'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onLeft'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onRight'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onTab'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onShiftTab'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onUp'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onDown'),
    $_f9utgpysjcg9mdgi.onKeyboardHandler('onEscape'),
    $_5g6e15x1jcg9mdax.option('focusIn')
  ];
  var getRules$5 = function (component, simulatedEvent, executeInfo) {
    return [
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE()), executeInfo.onSpace()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isNotShift,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ENTER())
      ]), executeInfo.onEnter()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isShift,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ENTER())
      ]), executeInfo.onShiftEnter()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isShift,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
      ]), executeInfo.onShiftTab()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.and([
        $_63aqg5zojcg9mdjs.isNotShift,
        $_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.TAB())
      ]), executeInfo.onTab()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.UP()), executeInfo.onUp()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.DOWN()), executeInfo.onDown()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.LEFT()), executeInfo.onLeft()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.RIGHT()), executeInfo.onRight()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.SPACE()), executeInfo.onSpace()),
      $_6hgt48znjcg9mdjp.rule($_63aqg5zojcg9mdjs.inSet($_ahs1rjzdjcg9mdir.ESCAPE()), executeInfo.onEscape())
    ];
  };
  var focusIn$4 = function (component, executeInfo) {
    return executeInfo.focusIn().bind(function (f) {
      return f(component, executeInfo);
    });
  };
  var getEvents$5 = $_7bfl0mwajcg9md92.constant({});
  var getApis$5 = $_7bfl0mwajcg9md92.constant({});
  var SpecialType = $_3ydw1hzejcg9mdiu.typical(schema$6, $_dhezwlxpjcg9mddk.init, getRules$5, getEvents$5, getApis$5, $_gb5srhw9jcg9md90.some(focusIn$4));

  var $_15juhkzajcg9mdic = {
    acyclic: AcyclicType.schema(),
    cyclic: CyclicType.schema(),
    flow: FlowType.schema(),
    flatgrid: FlatgridType.schema(),
    matrix: MatrixType.schema(),
    execution: ExecutionType.schema(),
    menu: MenuType.schema(),
    special: SpecialType.schema()
  };

  var Keying = $_bb1w99w3jcg9md7v.createModes({
    branchKey: 'mode',
    branches: $_15juhkzajcg9mdic,
    name: 'keying',
    active: {
      events: function (keyingConfig, keyingState) {
        var handler = keyingConfig.handler();
        return handler.toEvents(keyingConfig, keyingState);
      }
    },
    apis: {
      focusIn: function (component) {
        component.getSystem().triggerFocus(component.element(), component.element());
      },
      setGridSize: function (component, keyConfig, keyState, numRows, numColumns) {
        if (!$_1ohhokx5jcg9mdbm.hasKey(keyState, 'setGridSize')) {
          console.error('Layout does not support setGridSize');
        } else {
          keyState.setGridSize(numRows, numColumns);
        }
      }
    },
    state: $_1a96ylzzjcg9mdkz
  });

  var field$1 = function (name, forbidden) {
    return $_5g6e15x1jcg9mdax.defaultedObjOf(name, {}, $_gcfqi6w8jcg9md8v.map(forbidden, function (f) {
      return $_5g6e15x1jcg9mdax.forbid(f.name(), 'Cannot configure ' + f.name() + ' for ' + name);
    }).concat([$_5g6e15x1jcg9mdax.state('dump', $_7bfl0mwajcg9md92.identity)]));
  };
  var get$5 = function (data) {
    return data.dump();
  };
  var $_bu8gqd10cjcg9mdmw = {
    field: field$1,
    get: get$5
  };

  var unique = 0;
  var generate$1 = function (prefix) {
    var date = new Date();
    var time = date.getTime();
    var random = Math.floor(Math.random() * 1000000000);
    unique++;
    return prefix + '_' + random + unique + String(time);
  };
  var $_7upt5710fjcg9mdne = { generate: generate$1 };

  var premadeTag = $_7upt5710fjcg9mdne.generate('alloy-premade');
  var apiConfig = $_7upt5710fjcg9mdne.generate('api');
  var premade = function (comp) {
    return $_1ohhokx5jcg9mdbm.wrap(premadeTag, comp);
  };
  var getPremade = function (spec) {
    return $_1ohhokx5jcg9mdbm.readOptFrom(spec, premadeTag);
  };
  var makeApi = function (f) {
    return $_df0y3qxijcg9mdcx.markAsSketchApi(function (component) {
      var args = Array.prototype.slice.call(arguments, 0);
      var spi = component.config(apiConfig);
      return f.apply(undefined, [spi].concat(args));
    }, f);
  };
  var $_26cc5f10ejcg9mdna = {
    apiConfig: $_7bfl0mwajcg9md92.constant(apiConfig),
    makeApi: makeApi,
    premade: premade,
    getPremade: getPremade
  };

  var adt$2 = $_4xy8cmx3jcg9mdb7.generate([
    { required: ['data'] },
    { external: ['data'] },
    { optional: ['data'] },
    { group: ['data'] }
  ]);
  var fFactory = $_5g6e15x1jcg9mdax.defaulted('factory', { sketch: $_7bfl0mwajcg9md92.identity });
  var fSchema = $_5g6e15x1jcg9mdax.defaulted('schema', []);
  var fName = $_5g6e15x1jcg9mdax.strict('name');
  var fPname = $_5g6e15x1jcg9mdax.field('pname', 'pname', $_amdqrdx2jcg9mdb3.defaultedThunk(function (typeSpec) {
    return '<alloy.' + $_7upt5710fjcg9mdne.generate(typeSpec.name) + '>';
  }), $_96sv3hxgjcg9mdco.anyValue());
  var fDefaults = $_5g6e15x1jcg9mdax.defaulted('defaults', $_7bfl0mwajcg9md92.constant({}));
  var fOverrides = $_5g6e15x1jcg9mdax.defaulted('overrides', $_7bfl0mwajcg9md92.constant({}));
  var requiredSpec = $_96sv3hxgjcg9mdco.objOf([
    fFactory,
    fSchema,
    fName,
    fPname,
    fDefaults,
    fOverrides
  ]);
  var externalSpec = $_96sv3hxgjcg9mdco.objOf([
    fFactory,
    fSchema,
    fName,
    fDefaults,
    fOverrides
  ]);
  var optionalSpec = $_96sv3hxgjcg9mdco.objOf([
    fFactory,
    fSchema,
    fName,
    fPname,
    fDefaults,
    fOverrides
  ]);
  var groupSpec = $_96sv3hxgjcg9mdco.objOf([
    fFactory,
    fSchema,
    fName,
    $_5g6e15x1jcg9mdax.strict('unit'),
    fPname,
    fDefaults,
    fOverrides
  ]);
  var asNamedPart = function (part) {
    return part.fold($_gb5srhw9jcg9md90.some, $_gb5srhw9jcg9md90.none, $_gb5srhw9jcg9md90.some, $_gb5srhw9jcg9md90.some);
  };
  var name$1 = function (part) {
    var get = function (data) {
      return data.name();
    };
    return part.fold(get, get, get, get);
  };
  var asCommon = function (part) {
    return part.fold($_7bfl0mwajcg9md92.identity, $_7bfl0mwajcg9md92.identity, $_7bfl0mwajcg9md92.identity, $_7bfl0mwajcg9md92.identity);
  };
  var convert = function (adtConstructor, partSpec) {
    return function (spec) {
      var data = $_96sv3hxgjcg9mdco.asStructOrDie('Converting part type', partSpec, spec);
      return adtConstructor(data);
    };
  };
  var $_b1jyxz10jjcg9mdo3 = {
    required: convert(adt$2.required, requiredSpec),
    external: convert(adt$2.external, externalSpec),
    optional: convert(adt$2.optional, optionalSpec),
    group: convert(adt$2.group, groupSpec),
    asNamedPart: asNamedPart,
    name: name$1,
    asCommon: asCommon,
    original: $_7bfl0mwajcg9md92.constant('entirety')
  };

  var placeholder = 'placeholder';
  var adt$3 = $_4xy8cmx3jcg9mdb7.generate([
    {
      single: [
        'required',
        'valueThunk'
      ]
    },
    {
      multiple: [
        'required',
        'valueThunks'
      ]
    }
  ]);
  var isSubstitute = function (uiType) {
    return $_gcfqi6w8jcg9md8v.contains([placeholder], uiType);
  };
  var subPlaceholder = function (owner, detail, compSpec, placeholders) {
    if (owner.exists(function (o) {
        return o !== compSpec.owner;
      }))
      return adt$3.single(true, $_7bfl0mwajcg9md92.constant(compSpec));
    return $_1ohhokx5jcg9mdbm.readOptFrom(placeholders, compSpec.name).fold(function () {
      throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' + $_9is1m7wzjcg9mdag.keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + $_3oduxxejcg9mdci.stringify(compSpec, null, 2));
    }, function (newSpec) {
      return newSpec.replace();
    });
  };
  var scan = function (owner, detail, compSpec, placeholders) {
    if (compSpec.uiType === placeholder)
      return subPlaceholder(owner, detail, compSpec, placeholders);
    else
      return adt$3.single(false, $_7bfl0mwajcg9md92.constant(compSpec));
  };
  var substitute = function (owner, detail, compSpec, placeholders) {
    var base = scan(owner, detail, compSpec, placeholders);
    return base.fold(function (req, valueThunk) {
      var value = valueThunk(detail, compSpec.config, compSpec.validated);
      var childSpecs = $_1ohhokx5jcg9mdbm.readOptFrom(value, 'components').getOr([]);
      var substituted = $_gcfqi6w8jcg9md8v.bind(childSpecs, function (c) {
        return substitute(owner, detail, c, placeholders);
      });
      return [$_4xvhzgwxjcg9mdae.deepMerge(value, { components: substituted })];
    }, function (req, valuesThunk) {
      var values = valuesThunk(detail, compSpec.config, compSpec.validated);
      return values;
    });
  };
  var substituteAll = function (owner, detail, components, placeholders) {
    return $_gcfqi6w8jcg9md8v.bind(components, function (c) {
      return substitute(owner, detail, c, placeholders);
    });
  };
  var oneReplace = function (label, replacements) {
    var called = false;
    var used = function () {
      return called;
    };
    var replace = function () {
      if (called === true)
        throw new Error('Trying to use the same placeholder more than once: ' + label);
      called = true;
      return replacements;
    };
    var required = function () {
      return replacements.fold(function (req, _) {
        return req;
      }, function (req, _) {
        return req;
      });
    };
    return {
      name: $_7bfl0mwajcg9md92.constant(label),
      required: required,
      used: used,
      replace: replace
    };
  };
  var substitutePlaces = function (owner, detail, components, placeholders) {
    var ps = $_9is1m7wzjcg9mdag.map(placeholders, function (ph, name) {
      return oneReplace(name, ph);
    });
    var outcome = substituteAll(owner, detail, components, ps);
    $_9is1m7wzjcg9mdag.each(ps, function (p) {
      if (p.used() === false && p.required()) {
        throw new Error('Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' + $_3oduxxejcg9mdci.stringify(detail.components(), null, 2));
      }
    });
    return outcome;
  };
  var singleReplace = function (detail, p) {
    var replacement = p;
    return replacement.fold(function (req, valueThunk) {
      return [valueThunk(detail)];
    }, function (req, valuesThunk) {
      return valuesThunk(detail);
    });
  };
  var $_ea6eg310kjcg9mdod = {
    single: adt$3.single,
    multiple: adt$3.multiple,
    isSubstitute: isSubstitute,
    placeholder: $_7bfl0mwajcg9md92.constant(placeholder),
    substituteAll: substituteAll,
    substitutePlaces: substitutePlaces,
    singleReplace: singleReplace
  };

  var combine = function (detail, data, partSpec, partValidated) {
    var spec = partSpec;
    return $_4xvhzgwxjcg9mdae.deepMerge(data.defaults()(detail, partSpec, partValidated), partSpec, { uid: detail.partUids()[data.name()] }, data.overrides()(detail, partSpec, partValidated), { 'debug.sketcher': $_1ohhokx5jcg9mdbm.wrap('part-' + data.name(), spec) });
  };
  var subs = function (owner, detail, parts) {
    var internals = {};
    var externals = {};
    $_gcfqi6w8jcg9md8v.each(parts, function (part) {
      part.fold(function (data) {
        internals[data.pname()] = $_ea6eg310kjcg9mdod.single(true, function (detail, partSpec, partValidated) {
          return data.factory().sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        var partSpec = detail.parts()[data.name()]();
        externals[data.name()] = $_7bfl0mwajcg9md92.constant(combine(detail, data, partSpec[$_b1jyxz10jjcg9mdo3.original()]()));
      }, function (data) {
        internals[data.pname()] = $_ea6eg310kjcg9mdod.single(false, function (detail, partSpec, partValidated) {
          return data.factory().sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        internals[data.pname()] = $_ea6eg310kjcg9mdod.multiple(true, function (detail, _partSpec, _partValidated) {
          var units = detail[data.name()]();
          return $_gcfqi6w8jcg9md8v.map(units, function (u) {
            return data.factory().sketch($_4xvhzgwxjcg9mdae.deepMerge(data.defaults()(detail, u), u, data.overrides()(detail, u)));
          });
        });
      });
    });
    return {
      internals: $_7bfl0mwajcg9md92.constant(internals),
      externals: $_7bfl0mwajcg9md92.constant(externals)
    };
  };
  var $_3nj2mm10ijcg9mdnw = { subs: subs };

  var generate$2 = function (owner, parts) {
    var r = {};
    $_gcfqi6w8jcg9md8v.each(parts, function (part) {
      $_b1jyxz10jjcg9mdo3.asNamedPart(part).each(function (np) {
        var g = doGenerateOne(owner, np.pname());
        r[np.name()] = function (config) {
          var validated = $_96sv3hxgjcg9mdco.asRawOrDie('Part: ' + np.name() + ' in ' + owner, $_96sv3hxgjcg9mdco.objOf(np.schema()), config);
          return $_4xvhzgwxjcg9mdae.deepMerge(g, {
            config: config,
            validated: validated
          });
        };
      });
    });
    return r;
  };
  var doGenerateOne = function (owner, pname) {
    return {
      uiType: $_ea6eg310kjcg9mdod.placeholder(),
      owner: owner,
      name: pname
    };
  };
  var generateOne = function (owner, pname, config) {
    return {
      uiType: $_ea6eg310kjcg9mdod.placeholder(),
      owner: owner,
      name: pname,
      config: config,
      validated: {}
    };
  };
  var schemas = function (parts) {
    return $_gcfqi6w8jcg9md8v.bind(parts, function (part) {
      return part.fold($_gb5srhw9jcg9md90.none, $_gb5srhw9jcg9md90.some, $_gb5srhw9jcg9md90.none, $_gb5srhw9jcg9md90.none).map(function (data) {
        return $_5g6e15x1jcg9mdax.strictObjOf(data.name(), data.schema().concat([$_f9utgpysjcg9mdgi.snapshot($_b1jyxz10jjcg9mdo3.original())]));
      }).toArray();
    });
  };
  var names = function (parts) {
    return $_gcfqi6w8jcg9md8v.map(parts, $_b1jyxz10jjcg9mdo3.name);
  };
  var substitutes = function (owner, detail, parts) {
    return $_3nj2mm10ijcg9mdnw.subs(owner, detail, parts);
  };
  var components = function (owner, detail, internals) {
    return $_ea6eg310kjcg9mdod.substitutePlaces($_gb5srhw9jcg9md90.some(owner), detail, detail.components(), internals);
  };
  var getPart = function (component, detail, partKey) {
    var uid = detail.partUids()[partKey];
    return component.getSystem().getByUid(uid).toOption();
  };
  var getPartOrDie = function (component, detail, partKey) {
    return getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
  };
  var getParts = function (component, detail, partKeys) {
    var r = {};
    var uids = detail.partUids();
    var system = component.getSystem();
    $_gcfqi6w8jcg9md8v.each(partKeys, function (pk) {
      r[pk] = system.getByUid(uids[pk]);
    });
    return $_9is1m7wzjcg9mdag.map(r, $_7bfl0mwajcg9md92.constant);
  };
  var getAllParts = function (component, detail) {
    var system = component.getSystem();
    return $_9is1m7wzjcg9mdag.map(detail.partUids(), function (pUid, k) {
      return $_7bfl0mwajcg9md92.constant(system.getByUid(pUid));
    });
  };
  var getPartsOrDie = function (component, detail, partKeys) {
    var r = {};
    var uids = detail.partUids();
    var system = component.getSystem();
    $_gcfqi6w8jcg9md8v.each(partKeys, function (pk) {
      r[pk] = system.getByUid(uids[pk]).getOrDie();
    });
    return $_9is1m7wzjcg9mdag.map(r, $_7bfl0mwajcg9md92.constant);
  };
  var defaultUids = function (baseUid, partTypes) {
    var partNames = names(partTypes);
    return $_1ohhokx5jcg9mdbm.wrapAll($_gcfqi6w8jcg9md8v.map(partNames, function (pn) {
      return {
        key: pn,
        value: baseUid + '-' + pn
      };
    }));
  };
  var defaultUidsSchema = function (partTypes) {
    return $_5g6e15x1jcg9mdax.field('partUids', 'partUids', $_amdqrdx2jcg9mdb3.mergeWithThunk(function (spec) {
      return defaultUids(spec.uid, partTypes);
    }), $_96sv3hxgjcg9mdco.anyValue());
  };
  var $_dmikjr10hjcg9mdnl = {
    generate: generate$2,
    generateOne: generateOne,
    schemas: schemas,
    names: names,
    substitutes: substitutes,
    components: components,
    defaultUids: defaultUids,
    defaultUidsSchema: defaultUidsSchema,
    getAllParts: getAllParts,
    getPart: getPart,
    getPartOrDie: getPartOrDie,
    getParts: getParts,
    getPartsOrDie: getPartsOrDie
  };

  var prefix$2 = 'alloy-id-';
  var idAttr$1 = 'data-alloy-id';
  var $_91rbsx10mjcg9mdow = {
    prefix: $_7bfl0mwajcg9md92.constant(prefix$2),
    idAttr: $_7bfl0mwajcg9md92.constant(idAttr$1)
  };

  var prefix$1 = $_91rbsx10mjcg9mdow.prefix();
  var idAttr = $_91rbsx10mjcg9mdow.idAttr();
  var write = function (label, elem) {
    var id = $_7upt5710fjcg9mdne.generate(prefix$1 + label);
    $_ectfz6xvjcg9mddu.set(elem, idAttr, id);
    return id;
  };
  var writeOnly = function (elem, uid) {
    $_ectfz6xvjcg9mddu.set(elem, idAttr, uid);
  };
  var read$2 = function (elem) {
    var id = $_97hwf5xwjcg9mddy.isElement(elem) ? $_ectfz6xvjcg9mddu.get(elem, idAttr) : null;
    return $_gb5srhw9jcg9md90.from(id);
  };
  var find$3 = function (container, id) {
    return $_a6xsw6zljcg9mdjk.descendant(container, id);
  };
  var generate$3 = function (prefix) {
    return $_7upt5710fjcg9mdne.generate(prefix);
  };
  var revoke = function (elem) {
    $_ectfz6xvjcg9mddu.remove(elem, idAttr);
  };
  var $_6lxli10ljcg9mdop = {
    revoke: revoke,
    write: write,
    writeOnly: writeOnly,
    read: read$2,
    find: find$3,
    generate: generate$3,
    attribute: $_7bfl0mwajcg9md92.constant(idAttr)
  };

  var getPartsSchema = function (partNames, _optPartNames, _owner) {
    var owner = _owner !== undefined ? _owner : 'Unknown owner';
    var fallbackThunk = function () {
      return [$_f9utgpysjcg9mdgi.output('partUids', {})];
    };
    var optPartNames = _optPartNames !== undefined ? _optPartNames : fallbackThunk();
    if (partNames.length === 0 && optPartNames.length === 0)
      return fallbackThunk();
    var partsSchema = $_5g6e15x1jcg9mdax.strictObjOf('parts', $_gcfqi6w8jcg9md8v.flatten([
      $_gcfqi6w8jcg9md8v.map(partNames, $_5g6e15x1jcg9mdax.strict),
      $_gcfqi6w8jcg9md8v.map(optPartNames, function (optPart) {
        return $_5g6e15x1jcg9mdax.defaulted(optPart, $_ea6eg310kjcg9mdod.single(false, function () {
          throw new Error('The optional part: ' + optPart + ' was not specified in the config, but it was used in components');
        }));
      })
    ]));
    var partUidsSchema = $_5g6e15x1jcg9mdax.state('partUids', function (spec) {
      if (!$_1ohhokx5jcg9mdbm.hasKey(spec, 'parts')) {
        throw new Error('Part uid definition for owner: ' + owner + ' requires "parts"\nExpected parts: ' + partNames.join(', ') + '\nSpec: ' + $_3oduxxejcg9mdci.stringify(spec, null, 2));
      }
      var uids = $_9is1m7wzjcg9mdag.map(spec.parts, function (v, k) {
        return $_1ohhokx5jcg9mdbm.readOptFrom(v, 'uid').getOrThunk(function () {
          return spec.uid + '-' + k;
        });
      });
      return uids;
    });
    return [
      partsSchema,
      partUidsSchema
    ];
  };
  var base$1 = function (label, partSchemas, partUidsSchemas, spec) {
    var ps = partSchemas.length > 0 ? [$_5g6e15x1jcg9mdax.strictObjOf('parts', partSchemas)] : [];
    return ps.concat([
      $_5g6e15x1jcg9mdax.strict('uid'),
      $_5g6e15x1jcg9mdax.defaulted('dom', {}),
      $_5g6e15x1jcg9mdax.defaulted('components', []),
      $_f9utgpysjcg9mdgi.snapshot('originalSpec'),
      $_5g6e15x1jcg9mdax.defaulted('debug.sketcher', {})
    ]).concat(partUidsSchemas);
  };
  var asRawOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base$1(label, partSchemas, spec, partUidsSchemas);
    return $_96sv3hxgjcg9mdco.asRawOrDie(label + ' [SpecSchema]', $_96sv3hxgjcg9mdco.objOfOnly(baseS.concat(schema)), spec);
  };
  var asStructOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base$1(label, partSchemas, partUidsSchemas, spec);
    return $_96sv3hxgjcg9mdco.asStructOrDie(label + ' [SpecSchema]', $_96sv3hxgjcg9mdco.objOfOnly(baseS.concat(schema)), spec);
  };
  var extend = function (builder, original, nu) {
    var newSpec = $_4xvhzgwxjcg9mdae.deepMerge(original, nu);
    return builder(newSpec);
  };
  var addBehaviours = function (original, behaviours) {
    return $_4xvhzgwxjcg9mdae.deepMerge(original, behaviours);
  };
  var $_2e7n6410njcg9mdp0 = {
    asRawOrDie: asRawOrDie$1,
    asStructOrDie: asStructOrDie$1,
    addBehaviours: addBehaviours,
    getPartsSchema: getPartsSchema,
    extend: extend
  };

  var single$1 = function (owner, schema, factory, spec) {
    var specWithUid = supplyUid(spec);
    var detail = $_2e7n6410njcg9mdp0.asStructOrDie(owner, schema, specWithUid, [], []);
    return $_4xvhzgwxjcg9mdae.deepMerge(factory(detail, specWithUid), { 'debug.sketcher': $_1ohhokx5jcg9mdbm.wrap(owner, spec) });
  };
  var composite$1 = function (owner, schema, partTypes, factory, spec) {
    var specWithUid = supplyUid(spec);
    var partSchemas = $_dmikjr10hjcg9mdnl.schemas(partTypes);
    var partUidsSchema = $_dmikjr10hjcg9mdnl.defaultUidsSchema(partTypes);
    var detail = $_2e7n6410njcg9mdp0.asStructOrDie(owner, schema, specWithUid, partSchemas, [partUidsSchema]);
    var subs = $_dmikjr10hjcg9mdnl.substitutes(owner, detail, partTypes);
    var components = $_dmikjr10hjcg9mdnl.components(owner, detail, subs.internals());
    return $_4xvhzgwxjcg9mdae.deepMerge(factory(detail, components, specWithUid, subs.externals()), { 'debug.sketcher': $_1ohhokx5jcg9mdbm.wrap(owner, spec) });
  };
  var supplyUid = function (spec) {
    return $_4xvhzgwxjcg9mdae.deepMerge({ uid: $_6lxli10ljcg9mdop.generate('uid') }, spec);
  };
  var $_3zy9iz10gjcg9mdnf = {
    supplyUid: supplyUid,
    single: single$1,
    composite: composite$1
  };

  var singleSchema = $_96sv3hxgjcg9mdco.objOfOnly([
    $_5g6e15x1jcg9mdax.strict('name'),
    $_5g6e15x1jcg9mdax.strict('factory'),
    $_5g6e15x1jcg9mdax.strict('configFields'),
    $_5g6e15x1jcg9mdax.defaulted('apis', {}),
    $_5g6e15x1jcg9mdax.defaulted('extraApis', {})
  ]);
  var compositeSchema = $_96sv3hxgjcg9mdco.objOfOnly([
    $_5g6e15x1jcg9mdax.strict('name'),
    $_5g6e15x1jcg9mdax.strict('factory'),
    $_5g6e15x1jcg9mdax.strict('configFields'),
    $_5g6e15x1jcg9mdax.strict('partFields'),
    $_5g6e15x1jcg9mdax.defaulted('apis', {}),
    $_5g6e15x1jcg9mdax.defaulted('extraApis', {})
  ]);
  var single = function (rawConfig) {
    var config = $_96sv3hxgjcg9mdco.asRawOrDie('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);
    var sketch = function (spec) {
      return $_3zy9iz10gjcg9mdnf.single(config.name, config.configFields, config.factory, spec);
    };
    var apis = $_9is1m7wzjcg9mdag.map(config.apis, $_26cc5f10ejcg9mdna.makeApi);
    var extraApis = $_9is1m7wzjcg9mdag.map(config.extraApis, function (f, k) {
      return $_df0y3qxijcg9mdcx.markAsExtraApi(f, k);
    });
    return $_4xvhzgwxjcg9mdae.deepMerge({
      name: $_7bfl0mwajcg9md92.constant(config.name),
      partFields: $_7bfl0mwajcg9md92.constant([]),
      configFields: $_7bfl0mwajcg9md92.constant(config.configFields),
      sketch: sketch
    }, apis, extraApis);
  };
  var composite = function (rawConfig) {
    var config = $_96sv3hxgjcg9mdco.asRawOrDie('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);
    var sketch = function (spec) {
      return $_3zy9iz10gjcg9mdnf.composite(config.name, config.configFields, config.partFields, config.factory, spec);
    };
    var parts = $_dmikjr10hjcg9mdnl.generate(config.name, config.partFields);
    var apis = $_9is1m7wzjcg9mdag.map(config.apis, $_26cc5f10ejcg9mdna.makeApi);
    var extraApis = $_9is1m7wzjcg9mdag.map(config.extraApis, function (f, k) {
      return $_df0y3qxijcg9mdcx.markAsExtraApi(f, k);
    });
    return $_4xvhzgwxjcg9mdae.deepMerge({
      name: $_7bfl0mwajcg9md92.constant(config.name),
      partFields: $_7bfl0mwajcg9md92.constant(config.partFields),
      configFields: $_7bfl0mwajcg9md92.constant(config.configFields),
      sketch: sketch,
      parts: $_7bfl0mwajcg9md92.constant(parts)
    }, apis, extraApis);
  };
  var $_55yzot10djcg9mdn2 = {
    single: single,
    composite: composite
  };

  var events$4 = function (optAction) {
    var executeHandler = function (action) {
      return $_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.execute(), function (component, simulatedEvent) {
        action(component);
        simulatedEvent.stop();
      });
    };
    var onClick = function (component, simulatedEvent) {
      simulatedEvent.stop();
      $_4wv38zwujcg9mda1.emitExecute(component);
    };
    var onMousedown = function (component, simulatedEvent) {
      simulatedEvent.cut();
    };
    var pointerEvents = $_37ytsswfjcg9md9a.detect().deviceType.isTouch() ? [$_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.tap(), onClick)] : [
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.click(), onClick),
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mousedown(), onMousedown)
    ];
    return $_v93nkw5jcg9md8g.derive($_gcfqi6w8jcg9md8v.flatten([
      optAction.map(executeHandler).toArray(),
      pointerEvents
    ]));
  };
  var $_9skab510ojcg9mdpa = { events: events$4 };

  var factory = function (detail, spec) {
    var events = $_9skab510ojcg9mdpa.events(detail.action());
    var optType = $_1ohhokx5jcg9mdbm.readOptFrom(detail.dom(), 'attributes').bind($_1ohhokx5jcg9mdbm.readOpt('type'));
    var optTag = $_1ohhokx5jcg9mdbm.readOptFrom(detail.dom(), 'tag');
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: detail.components(),
      events: events,
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([
        Focusing.config({}),
        Keying.config({
          mode: 'execution',
          useSpace: true,
          useEnter: true
        })
      ]), $_bu8gqd10cjcg9mdmw.get(detail.buttonBehaviours())),
      domModification: {
        attributes: $_4xvhzgwxjcg9mdae.deepMerge(optType.fold(function () {
          return optTag.is('button') ? { type: 'button' } : {};
        }, function (t) {
          return {};
        }), { role: detail.role().getOr('button') })
      },
      eventOrder: detail.eventOrder()
    };
  };
  var Button = $_55yzot10djcg9mdn2.single({
    name: 'Button',
    factory: factory,
    configFields: [
      $_5g6e15x1jcg9mdax.defaulted('uid', undefined),
      $_5g6e15x1jcg9mdax.strict('dom'),
      $_5g6e15x1jcg9mdax.defaulted('components', []),
      $_bu8gqd10cjcg9mdmw.field('buttonBehaviours', [
        Focusing,
        Keying
      ]),
      $_5g6e15x1jcg9mdax.option('action'),
      $_5g6e15x1jcg9mdax.option('role'),
      $_5g6e15x1jcg9mdax.defaulted('eventOrder', {})
    ]
  });

  var getAttrs = function (elem) {
    var attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : [];
    return $_gcfqi6w8jcg9md8v.foldl(attributes, function (b, attr) {
      if (attr.name === 'class')
        return b;
      else
        return $_4xvhzgwxjcg9mdae.deepMerge(b, $_1ohhokx5jcg9mdbm.wrap(attr.name, attr.value));
    }, {});
  };
  var getClasses = function (elem) {
    return Array.prototype.slice.call(elem.dom().classList, 0);
  };
  var fromHtml$2 = function (html) {
    var elem = $_41aqpdwsjcg9md9w.fromHtml(html);
    var children = $_1lxhd4y2jcg9mdeh.children(elem);
    var attrs = getAttrs(elem);
    var classes = getClasses(elem);
    var contents = children.length === 0 ? {} : { innerHtml: $_ghy5kryajcg9mdf9.get(elem) };
    return $_4xvhzgwxjcg9mdae.deepMerge({
      tag: $_97hwf5xwjcg9mddy.name(elem),
      classes: classes,
      attributes: attrs
    }, contents);
  };
  var sketch = function (sketcher, html, config) {
    return sketcher.sketch($_4xvhzgwxjcg9mdae.deepMerge({ dom: fromHtml$2(html) }, config));
  };
  var $_cwfhjc10qjcg9mdph = {
    fromHtml: fromHtml$2,
    sketch: sketch
  };

  var dom$1 = function (rawHtml) {
    var html = $_7ozyznwojcg9md9q.supplant(rawHtml, { prefix: $_3sfngaz0jcg9mdhj.prefix() });
    return $_cwfhjc10qjcg9mdph.fromHtml(html);
  };
  var spec = function (rawHtml) {
    var sDom = dom$1(rawHtml);
    return { dom: sDom };
  };
  var $_3w6c8v10pjcg9mdpf = {
    dom: dom$1,
    spec: spec
  };

  var forToolbarCommand = function (editor, command) {
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, {});
  };
  var getToggleBehaviours = function (command) {
    return $_bb1w99w3jcg9md7v.derive([
      Toggling.config({
        toggleClass: $_3sfngaz0jcg9mdhj.resolve('toolbar-button-selected'),
        toggleOnExecute: false,
        aria: { mode: 'pressed' }
      }),
      $_1n9vh6yzjcg9mdhf.format(command, function (button, status) {
        var toggle = status ? Toggling.on : Toggling.off;
        toggle(button);
      })
    ]);
  };
  var forToolbarStateCommand = function (editor, command) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, extraBehaviours);
  };
  var forToolbarStateAction = function (editor, clazz, command, action) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(clazz, action, extraBehaviours);
  };
  var forToolbar = function (clazz, action, extraBehaviours) {
    return Button.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-' + clazz + ' ${prefix}-icon"></span>'),
      action: action,
      buttonBehaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([Unselecting.config({})]), extraBehaviours)
    });
  };
  var $_fwn33tz1jcg9mdhl = {
    forToolbar: forToolbar,
    forToolbarCommand: forToolbarCommand,
    forToolbarStateAction: forToolbarStateAction,
    forToolbarStateCommand: forToolbarStateCommand
  };

  var reduceBy = function (value, min, max, step) {
    if (value < min)
      return value;
    else if (value > max)
      return max;
    else if (value === min)
      return min - 1;
    else
      return Math.max(min, value - step);
  };
  var increaseBy = function (value, min, max, step) {
    if (value > max)
      return value;
    else if (value < min)
      return min;
    else if (value === max)
      return max + 1;
    else
      return Math.min(max, value + step);
  };
  var capValue = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  };
  var snapValueOfX = function (bounds, value, min, max, step, snapStart) {
    return snapStart.fold(function () {
      var initValue = value - min;
      var extraValue = Math.round(initValue / step) * step;
      return capValue(min + extraValue, min - 1, max + 1);
    }, function (start) {
      var remainder = (value - start) % step;
      var adjustment = Math.round(remainder / step);
      var rawSteps = Math.floor((value - start) / step);
      var maxSteps = Math.floor((max - start) / step);
      var numSteps = Math.min(maxSteps, rawSteps + adjustment);
      var r = start + numSteps * step;
      return Math.max(start, r);
    });
  };
  var findValueOfX = function (bounds, min, max, xValue, step, snapToGrid, snapStart) {
    var range = max - min;
    if (xValue < bounds.left)
      return min - 1;
    else if (xValue > bounds.right)
      return max + 1;
    else {
      var xOffset = Math.min(bounds.right, Math.max(xValue, bounds.left)) - bounds.left;
      var newValue = capValue(xOffset / bounds.width * range + min, min - 1, max + 1);
      var roundedValue = Math.round(newValue);
      return snapToGrid && newValue >= min && newValue <= max ? snapValueOfX(bounds, newValue, min, max, step, snapStart) : roundedValue;
    }
  };
  var $_4gc03a10vjcg9mdqe = {
    reduceBy: reduceBy,
    increaseBy: increaseBy,
    findValueOfX: findValueOfX
  };

  var changeEvent = 'slider.change.value';
  var isTouch$1 = $_37ytsswfjcg9md9a.detect().deviceType.isTouch();
  var getEventSource = function (simulatedEvent) {
    var evt = simulatedEvent.event().raw();
    if (isTouch$1 && evt.touches !== undefined && evt.touches.length === 1)
      return $_gb5srhw9jcg9md90.some(evt.touches[0]);
    else if (isTouch$1 && evt.touches !== undefined)
      return $_gb5srhw9jcg9md90.none();
    else if (!isTouch$1 && evt.clientX !== undefined)
      return $_gb5srhw9jcg9md90.some(evt);
    else
      return $_gb5srhw9jcg9md90.none();
  };
  var getEventX = function (simulatedEvent) {
    var spot = getEventSource(simulatedEvent);
    return spot.map(function (s) {
      return s.clientX;
    });
  };
  var fireChange = function (component, value) {
    $_4wv38zwujcg9mda1.emitWith(component, changeEvent, { value: value });
  };
  var moveRightFromLedge = function (ledge, detail) {
    fireChange(ledge, detail.min());
  };
  var moveLeftFromRedge = function (redge, detail) {
    fireChange(redge, detail.max());
  };
  var setToRedge = function (redge, detail) {
    fireChange(redge, detail.max() + 1);
  };
  var setToLedge = function (ledge, detail) {
    fireChange(ledge, detail.min() - 1);
  };
  var setToX = function (spectrum, spectrumBounds, detail, xValue) {
    var value = $_4gc03a10vjcg9mdqe.findValueOfX(spectrumBounds, detail.min(), detail.max(), xValue, detail.stepSize(), detail.snapToGrid(), detail.snapStart());
    fireChange(spectrum, value);
  };
  var setXFromEvent = function (spectrum, detail, spectrumBounds, simulatedEvent) {
    return getEventX(simulatedEvent).map(function (xValue) {
      setToX(spectrum, spectrumBounds, detail, xValue);
      return xValue;
    });
  };
  var moveLeft$4 = function (spectrum, detail) {
    var newValue = $_4gc03a10vjcg9mdqe.reduceBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
    fireChange(spectrum, newValue);
  };
  var moveRight$4 = function (spectrum, detail) {
    var newValue = $_4gc03a10vjcg9mdqe.increaseBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
    fireChange(spectrum, newValue);
  };
  var $_dwpyoc10ujcg9mdq7 = {
    setXFromEvent: setXFromEvent,
    setToLedge: setToLedge,
    setToRedge: setToRedge,
    moveLeftFromRedge: moveLeftFromRedge,
    moveRightFromLedge: moveRightFromLedge,
    moveLeft: moveLeft$4,
    moveRight: moveRight$4,
    changeEvent: $_7bfl0mwajcg9md92.constant(changeEvent)
  };

  var platform = $_37ytsswfjcg9md9a.detect();
  var isTouch = platform.deviceType.isTouch();
  var edgePart = function (name, action) {
    return $_b1jyxz10jjcg9mdo3.optional({
      name: '' + name + '-edge',
      overrides: function (detail) {
        var touchEvents = $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.runActionExtra($_f4bxsewwjcg9mdab.touchstart(), action, [detail])]);
        var mouseEvents = $_v93nkw5jcg9md8g.derive([
          $_v93nkw5jcg9md8g.runActionExtra($_f4bxsewwjcg9mdab.mousedown(), action, [detail]),
          $_v93nkw5jcg9md8g.runActionExtra($_f4bxsewwjcg9mdab.mousemove(), function (l, det) {
            if (det.mouseIsDown().get())
              action(l, det);
          }, [detail])
        ]);
        return { events: isTouch ? touchEvents : mouseEvents };
      }
    });
  };
  var ledgePart = edgePart('left', $_dwpyoc10ujcg9mdq7.setToLedge);
  var redgePart = edgePart('right', $_dwpyoc10ujcg9mdq7.setToRedge);
  var thumbPart = $_b1jyxz10jjcg9mdo3.required({
    name: 'thumb',
    defaults: $_7bfl0mwajcg9md92.constant({ dom: { styles: { position: 'absolute' } } }),
    overrides: function (detail) {
      return {
        events: $_v93nkw5jcg9md8g.derive([
          $_v93nkw5jcg9md8g.redirectToPart($_f4bxsewwjcg9mdab.touchstart(), detail, 'spectrum'),
          $_v93nkw5jcg9md8g.redirectToPart($_f4bxsewwjcg9mdab.touchmove(), detail, 'spectrum'),
          $_v93nkw5jcg9md8g.redirectToPart($_f4bxsewwjcg9mdab.touchend(), detail, 'spectrum')
        ])
      };
    }
  });
  var spectrumPart = $_b1jyxz10jjcg9mdo3.required({
    schema: [$_5g6e15x1jcg9mdax.state('mouseIsDown', function () {
        return Cell(false);
      })],
    name: 'spectrum',
    overrides: function (detail) {
      var moveToX = function (spectrum, simulatedEvent) {
        var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
        $_dwpyoc10ujcg9mdq7.setXFromEvent(spectrum, detail, spectrumBounds, simulatedEvent);
      };
      var touchEvents = $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchstart(), moveToX),
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchmove(), moveToX)
      ]);
      var mouseEvents = $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mousedown(), moveToX),
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mousemove(), function (spectrum, se) {
          if (detail.mouseIsDown().get())
            moveToX(spectrum, se);
        })
      ]);
      return {
        behaviours: $_bb1w99w3jcg9md7v.derive(isTouch ? [] : [
          Keying.config({
            mode: 'special',
            onLeft: function (spectrum) {
              $_dwpyoc10ujcg9mdq7.moveLeft(spectrum, detail);
              return $_gb5srhw9jcg9md90.some(true);
            },
            onRight: function (spectrum) {
              $_dwpyoc10ujcg9mdq7.moveRight(spectrum, detail);
              return $_gb5srhw9jcg9md90.some(true);
            }
          }),
          Focusing.config({})
        ]),
        events: isTouch ? touchEvents : mouseEvents
      };
    }
  });
  var SliderParts = [
    ledgePart,
    redgePart,
    thumbPart,
    spectrumPart
  ];

  var onLoad$1 = function (component, repConfig, repState) {
    repConfig.store().manager().onLoad(component, repConfig, repState);
  };
  var onUnload = function (component, repConfig, repState) {
    repConfig.store().manager().onUnload(component, repConfig, repState);
  };
  var setValue = function (component, repConfig, repState, data) {
    repConfig.store().manager().setValue(component, repConfig, repState, data);
  };
  var getValue = function (component, repConfig, repState) {
    return repConfig.store().manager().getValue(component, repConfig, repState);
  };
  var $_8x3wyw10zjcg9mdqp = {
    onLoad: onLoad$1,
    onUnload: onUnload,
    setValue: setValue,
    getValue: getValue
  };

  var events$5 = function (repConfig, repState) {
    var es = repConfig.resetOnDom() ? [
      $_v93nkw5jcg9md8g.runOnAttached(function (comp, se) {
        $_8x3wyw10zjcg9mdqp.onLoad(comp, repConfig, repState);
      }),
      $_v93nkw5jcg9md8g.runOnDetached(function (comp, se) {
        $_8x3wyw10zjcg9mdqp.onUnload(comp, repConfig, repState);
      })
    ] : [$_bdrph6w4jcg9md83.loadEvent(repConfig, repState, $_8x3wyw10zjcg9mdqp.onLoad)];
    return $_v93nkw5jcg9md8g.derive(es);
  };
  var $_5gw5bm10yjcg9mdqn = { events: events$5 };

  var memory = function () {
    var data = Cell(null);
    var readState = function () {
      return {
        mode: 'memory',
        value: data.get()
      };
    };
    var isNotSet = function () {
      return data.get() === null;
    };
    var clear = function () {
      data.set(null);
    };
    return BehaviourState({
      set: data.set,
      get: data.get,
      isNotSet: isNotSet,
      clear: clear,
      readState: readState
    });
  };
  var manual = function () {
    var readState = function () {
    };
    return BehaviourState({ readState: readState });
  };
  var dataset = function () {
    var data = Cell({});
    var readState = function () {
      return {
        mode: 'dataset',
        dataset: data.get()
      };
    };
    return BehaviourState({
      readState: readState,
      set: data.set,
      get: data.get
    });
  };
  var init$2 = function (spec) {
    return spec.store().manager().state(spec);
  };
  var $_axyjfy112jcg9mdqx = {
    memory: memory,
    dataset: dataset,
    manual: manual,
    init: init$2
  };

  var setValue$1 = function (component, repConfig, repState, data) {
    var dataKey = repConfig.store().getDataKey();
    repState.set({});
    repConfig.store().setData()(component, data);
    repConfig.onSetValue()(component, data);
  };
  var getValue$1 = function (component, repConfig, repState) {
    var key = repConfig.store().getDataKey()(component);
    var dataset = repState.get();
    return $_1ohhokx5jcg9mdbm.readOptFrom(dataset, key).fold(function () {
      return repConfig.store().getFallbackEntry()(key);
    }, function (data) {
      return data;
    });
  };
  var onLoad$2 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (data) {
      setValue$1(component, repConfig, repState, data);
    });
  };
  var onUnload$1 = function (component, repConfig, repState) {
    repState.set({});
  };
  var DatasetStore = [
    $_5g6e15x1jcg9mdax.option('initialValue'),
    $_5g6e15x1jcg9mdax.strict('getFallbackEntry'),
    $_5g6e15x1jcg9mdax.strict('getDataKey'),
    $_5g6e15x1jcg9mdax.strict('setData'),
    $_f9utgpysjcg9mdgi.output('manager', {
      setValue: setValue$1,
      getValue: getValue$1,
      onLoad: onLoad$2,
      onUnload: onUnload$1,
      state: $_axyjfy112jcg9mdqx.dataset
    })
  ];

  var getValue$2 = function (component, repConfig, repState) {
    return repConfig.store().getValue()(component);
  };
  var setValue$2 = function (component, repConfig, repState, data) {
    repConfig.store().setValue()(component, data);
    repConfig.onSetValue()(component, data);
  };
  var onLoad$3 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (data) {
      repConfig.store().setValue()(component, data);
    });
  };
  var ManualStore = [
    $_5g6e15x1jcg9mdax.strict('getValue'),
    $_5g6e15x1jcg9mdax.defaulted('setValue', $_7bfl0mwajcg9md92.noop),
    $_5g6e15x1jcg9mdax.option('initialValue'),
    $_f9utgpysjcg9mdgi.output('manager', {
      setValue: setValue$2,
      getValue: getValue$2,
      onLoad: onLoad$3,
      onUnload: $_7bfl0mwajcg9md92.noop,
      state: $_dhezwlxpjcg9mddk.init
    })
  ];

  var setValue$3 = function (component, repConfig, repState, data) {
    repState.set(data);
    repConfig.onSetValue()(component, data);
  };
  var getValue$3 = function (component, repConfig, repState) {
    return repState.get();
  };
  var onLoad$4 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (initVal) {
      if (repState.isNotSet())
        repState.set(initVal);
    });
  };
  var onUnload$2 = function (component, repConfig, repState) {
    repState.clear();
  };
  var MemoryStore = [
    $_5g6e15x1jcg9mdax.option('initialValue'),
    $_f9utgpysjcg9mdgi.output('manager', {
      setValue: setValue$3,
      getValue: getValue$3,
      onLoad: onLoad$4,
      onUnload: onUnload$2,
      state: $_axyjfy112jcg9mdqx.memory
    })
  ];

  var RepresentSchema = [
    $_5g6e15x1jcg9mdax.defaultedOf('store', { mode: 'memory' }, $_96sv3hxgjcg9mdco.choose('mode', {
      memory: MemoryStore,
      manual: ManualStore,
      dataset: DatasetStore
    })),
    $_f9utgpysjcg9mdgi.onHandler('onSetValue'),
    $_5g6e15x1jcg9mdax.defaulted('resetOnDom', false)
  ];

  var me = $_bb1w99w3jcg9md7v.create({
    fields: RepresentSchema,
    name: 'representing',
    active: $_5gw5bm10yjcg9mdqn,
    apis: $_8x3wyw10zjcg9mdqp,
    extra: {
      setValueFrom: function (component, source) {
        var value = me.getValue(source);
        me.setValue(component, value);
      }
    },
    state: $_axyjfy112jcg9mdqx
  });

  var isTouch$2 = $_37ytsswfjcg9md9a.detect().deviceType.isTouch();
  var SliderSchema = [
    $_5g6e15x1jcg9mdax.strict('min'),
    $_5g6e15x1jcg9mdax.strict('max'),
    $_5g6e15x1jcg9mdax.defaulted('stepSize', 1),
    $_5g6e15x1jcg9mdax.defaulted('onChange', $_7bfl0mwajcg9md92.noop),
    $_5g6e15x1jcg9mdax.defaulted('onInit', $_7bfl0mwajcg9md92.noop),
    $_5g6e15x1jcg9mdax.defaulted('onDragStart', $_7bfl0mwajcg9md92.noop),
    $_5g6e15x1jcg9mdax.defaulted('onDragEnd', $_7bfl0mwajcg9md92.noop),
    $_5g6e15x1jcg9mdax.defaulted('snapToGrid', false),
    $_5g6e15x1jcg9mdax.option('snapStart'),
    $_5g6e15x1jcg9mdax.strict('getInitialValue'),
    $_bu8gqd10cjcg9mdmw.field('sliderBehaviours', [
      Keying,
      me
    ]),
    $_5g6e15x1jcg9mdax.state('value', function (spec) {
      return Cell(spec.min);
    })
  ].concat(!isTouch$2 ? [$_5g6e15x1jcg9mdax.state('mouseIsDown', function () {
      return Cell(false);
    })] : []);

  var api$1 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$4 = function (element, h) {
    api$1.set(element, h);
  };
  var get$6 = function (element) {
    return api$1.get(element);
  };
  var getOuter$2 = function (element) {
    return api$1.getOuter(element);
  };
  var setMax$1 = function (element, value) {
    var inclusions = [
      'margin-left',
      'border-left-width',
      'padding-left',
      'padding-right',
      'border-right-width',
      'margin-right'
    ];
    var absMax = api$1.max(element, value, inclusions);
    $_bctu7wzrjcg9mdk0.set(element, 'max-width', absMax + 'px');
  };
  var $_d38qpy116jcg9mdri = {
    set: set$4,
    get: get$6,
    getOuter: getOuter$2,
    setMax: setMax$1
  };

  var isTouch$3 = $_37ytsswfjcg9md9a.detect().deviceType.isTouch();
  var sketch$2 = function (detail, components, spec, externals) {
    var range = detail.max() - detail.min();
    var getXCentre = function (component) {
      var rect = component.element().dom().getBoundingClientRect();
      return (rect.left + rect.right) / 2;
    };
    var getThumb = function (component) {
      return $_dmikjr10hjcg9mdnl.getPartOrDie(component, detail, 'thumb');
    };
    var getXOffset = function (slider, spectrumBounds, detail) {
      var v = detail.value().get();
      if (v < detail.min()) {
        return $_dmikjr10hjcg9mdnl.getPart(slider, detail, 'left-edge').fold(function () {
          return 0;
        }, function (ledge) {
          return getXCentre(ledge) - spectrumBounds.left;
        });
      } else if (v > detail.max()) {
        return $_dmikjr10hjcg9mdnl.getPart(slider, detail, 'right-edge').fold(function () {
          return spectrumBounds.width;
        }, function (redge) {
          return getXCentre(redge) - spectrumBounds.left;
        });
      } else {
        return (detail.value().get() - detail.min()) / range * spectrumBounds.width;
      }
    };
    var getXPos = function (slider) {
      var spectrum = $_dmikjr10hjcg9mdnl.getPartOrDie(slider, detail, 'spectrum');
      var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
      var sliderBounds = slider.element().dom().getBoundingClientRect();
      var xOffset = getXOffset(slider, spectrumBounds, detail);
      return spectrumBounds.left - sliderBounds.left + xOffset;
    };
    var refresh = function (component) {
      var pos = getXPos(component);
      var thumb = getThumb(component);
      var thumbRadius = $_d38qpy116jcg9mdri.get(thumb.element()) / 2;
      $_bctu7wzrjcg9mdk0.set(thumb.element(), 'left', pos - thumbRadius + 'px');
    };
    var changeValue = function (component, newValue) {
      var oldValue = detail.value().get();
      var thumb = getThumb(component);
      if (oldValue !== newValue || $_bctu7wzrjcg9mdk0.getRaw(thumb.element(), 'left').isNone()) {
        detail.value().set(newValue);
        refresh(component);
        detail.onChange()(component, thumb, newValue);
        return $_gb5srhw9jcg9md90.some(true);
      } else {
        return $_gb5srhw9jcg9md90.none();
      }
    };
    var resetToMin = function (slider) {
      changeValue(slider, detail.min());
    };
    var resetToMax = function (slider) {
      changeValue(slider, detail.max());
    };
    var uiEventsArr = isTouch$3 ? [
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchstart(), function (slider, simulatedEvent) {
        detail.onDragStart()(slider, getThumb(slider));
      }),
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchend(), function (slider, simulatedEvent) {
        detail.onDragEnd()(slider, getThumb(slider));
      })
    ] : [
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mousedown(), function (slider, simulatedEvent) {
        simulatedEvent.stop();
        detail.onDragStart()(slider, getThumb(slider));
        detail.mouseIsDown().set(true);
      }),
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mouseup(), function (slider, simulatedEvent) {
        detail.onDragEnd()(slider, getThumb(slider));
        detail.mouseIsDown().set(false);
      })
    ];
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive($_gcfqi6w8jcg9md8v.flatten([
        !isTouch$3 ? [Keying.config({
            mode: 'special',
            focusIn: function (slider) {
              return $_dmikjr10hjcg9mdnl.getPart(slider, detail, 'spectrum').map(Keying.focusIn).map($_7bfl0mwajcg9md92.constant(true));
            }
          })] : [],
        [me.config({
            store: {
              mode: 'manual',
              getValue: function (_) {
                return detail.value().get();
              }
            }
          })]
      ])), $_bu8gqd10cjcg9mdmw.get(detail.sliderBehaviours())),
      events: $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.run($_dwpyoc10ujcg9mdq7.changeEvent(), function (slider, simulatedEvent) {
          changeValue(slider, simulatedEvent.event().value());
        }),
        $_v93nkw5jcg9md8g.runOnAttached(function (slider, simulatedEvent) {
          detail.value().set(detail.getInitialValue()());
          var thumb = getThumb(slider);
          refresh(slider);
          detail.onInit()(slider, thumb, detail.value().get());
        })
      ].concat(uiEventsArr)),
      apis: {
        resetToMin: resetToMin,
        resetToMax: resetToMax,
        refresh: refresh
      },
      domModification: { styles: { position: 'relative' } }
    };
  };
  var $_2pcw2n115jcg9mdr7 = { sketch: sketch$2 };

  var Slider = $_55yzot10djcg9mdn2.composite({
    name: 'Slider',
    configFields: SliderSchema,
    partFields: SliderParts,
    factory: $_2pcw2n115jcg9mdr7.sketch,
    apis: {
      resetToMin: function (apis, slider) {
        apis.resetToMin(slider);
      },
      resetToMax: function (apis, slider) {
        apis.resetToMax(slider);
      },
      refresh: function (apis, slider) {
        apis.refresh(slider);
      }
    }
  });

  var button = function (realm, clazz, makeItems) {
    return $_fwn33tz1jcg9mdhl.forToolbar(clazz, function () {
      var items = makeItems();
      realm.setContextToolbar([{
          label: clazz + ' group',
          items: items
        }]);
    }, {});
  };
  var $_7etfs0117jcg9mdrk = { button: button };

  var BLACK = -1;
  var makeSlider = function (spec) {
    var getColor = function (hue) {
      if (hue < 0) {
        return 'black';
      } else if (hue > 360) {
        return 'white';
      } else {
        return 'hsl(' + hue + ', 100%, 50%)';
      }
    };
    var onInit = function (slider, thumb, value) {
      var color = getColor(value);
      $_bctu7wzrjcg9mdk0.set(thumb.element(), 'background-color', color);
    };
    var onChange = function (slider, thumb, value) {
      var color = getColor(value);
      $_bctu7wzrjcg9mdk0.set(thumb.element(), 'background-color', color);
      spec.onChange(slider, thumb, color);
    };
    return Slider.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>'),
      components: [
        Slider.parts()['left-edge']($_3w6c8v10pjcg9mdpf.spec('<div class="${prefix}-hue-slider-black"></div>')),
        Slider.parts().spectrum({
          dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-slider-gradient-container"></div>'),
          components: [$_3w6c8v10pjcg9mdpf.spec('<div class="${prefix}-slider-gradient"></div>')],
          behaviours: $_bb1w99w3jcg9md7v.derive([Toggling.config({ toggleClass: $_3sfngaz0jcg9mdhj.resolve('thumb-active') })])
        }),
        Slider.parts()['right-edge']($_3w6c8v10pjcg9mdpf.spec('<div class="${prefix}-hue-slider-white"></div>')),
        Slider.parts().thumb({
          dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-slider-thumb"></div>'),
          behaviours: $_bb1w99w3jcg9md7v.derive([Toggling.config({ toggleClass: $_3sfngaz0jcg9mdhj.resolve('thumb-active') })])
        })
      ],
      onChange: onChange,
      onDragStart: function (slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function (slider, thumb) {
        Toggling.off(thumb);
      },
      onInit: onInit,
      stepSize: 10,
      min: 0,
      max: 360,
      getInitialValue: spec.getInitialValue,
      sliderBehaviours: $_bb1w99w3jcg9md7v.derive([$_1n9vh6yzjcg9mdhf.orientation(Slider.refresh)])
    });
  };
  var makeItems = function (spec) {
    return [makeSlider(spec)];
  };
  var sketch$1 = function (realm, editor) {
    var spec = {
      onChange: function (slider, thumb, color) {
        editor.undoManager.transact(function () {
          editor.formatter.apply('forecolor', { value: color });
          editor.nodeChanged();
        });
      },
      getInitialValue: function () {
        return BLACK;
      }
    };
    return $_7etfs0117jcg9mdrk.button(realm, 'color', function () {
      return makeItems(spec);
    });
  };
  var $_g7v1nf10rjcg9mdpq = {
    makeItems: makeItems,
    sketch: sketch$1
  };

  var schema$7 = $_96sv3hxgjcg9mdco.objOfOnly([
    $_5g6e15x1jcg9mdax.strict('getInitialValue'),
    $_5g6e15x1jcg9mdax.strict('onChange'),
    $_5g6e15x1jcg9mdax.strict('category'),
    $_5g6e15x1jcg9mdax.strict('sizes')
  ]);
  var sketch$4 = function (rawSpec) {
    var spec = $_96sv3hxgjcg9mdco.asRawOrDie('SizeSlider', schema$7, rawSpec);
    var isValidValue = function (valueIndex) {
      return valueIndex >= 0 && valueIndex < spec.sizes.length;
    };
    var onChange = function (slider, thumb, valueIndex) {
      if (isValidValue(valueIndex)) {
        spec.onChange(valueIndex);
      }
    };
    return Slider.sketch({
      dom: {
        tag: 'div',
        classes: [
          $_3sfngaz0jcg9mdhj.resolve('slider-' + spec.category + '-size-container'),
          $_3sfngaz0jcg9mdhj.resolve('slider'),
          $_3sfngaz0jcg9mdhj.resolve('slider-size-container')
        ]
      },
      onChange: onChange,
      onDragStart: function (slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function (slider, thumb) {
        Toggling.off(thumb);
      },
      min: 0,
      max: spec.sizes.length - 1,
      stepSize: 1,
      getInitialValue: spec.getInitialValue,
      snapToGrid: true,
      sliderBehaviours: $_bb1w99w3jcg9md7v.derive([$_1n9vh6yzjcg9mdhf.orientation(Slider.refresh)]),
      components: [
        Slider.parts().spectrum({
          dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-slider-size-container"></div>'),
          components: [$_3w6c8v10pjcg9mdpf.spec('<div class="${prefix}-slider-size-line"></div>')]
        }),
        Slider.parts().thumb({
          dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-slider-thumb"></div>'),
          behaviours: $_bb1w99w3jcg9md7v.derive([Toggling.config({ toggleClass: $_3sfngaz0jcg9mdhj.resolve('thumb-active') })])
        })
      ]
    });
  };
  var $_1jbw4d119jcg9mdrm = { sketch: sketch$4 };

  var ancestor$3 = function (scope, transform, isRoot) {
    var element = scope.dom();
    var stop = $_dkt1fwyjcg9mdaf.isFunction(isRoot) ? isRoot : $_7bfl0mwajcg9md92.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_41aqpdwsjcg9md9w.fromDom(element);
      var transformed = transform(el);
      if (transformed.isSome())
        return transformed;
      else if (stop(el))
        break;
    }
    return $_gb5srhw9jcg9md90.none();
  };
  var closest$3 = function (scope, transform, isRoot) {
    var current = transform(scope);
    return current.orThunk(function () {
      return isRoot(scope) ? $_gb5srhw9jcg9md90.none() : ancestor$3(scope, transform, isRoot);
    });
  };
  var $_ghfv5311bjcg9mds3 = {
    ancestor: ancestor$3,
    closest: closest$3
  };

  var candidates = [
    '9px',
    '10px',
    '11px',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '36px'
  ];
  var defaultSize = 'medium';
  var defaultIndex = 2;
  var indexToSize = function (index) {
    return $_gb5srhw9jcg9md90.from(candidates[index]);
  };
  var sizeToIndex = function (size) {
    return $_gcfqi6w8jcg9md8v.findIndex(candidates, function (v) {
      return v === size;
    });
  };
  var getRawOrComputed = function (isRoot, rawStart) {
    var optStart = $_97hwf5xwjcg9mddy.isElement(rawStart) ? $_gb5srhw9jcg9md90.some(rawStart) : $_1lxhd4y2jcg9mdeh.parent(rawStart);
    return optStart.map(function (start) {
      var inline = $_ghfv5311bjcg9mds3.closest(start, function (elem) {
        return $_bctu7wzrjcg9mdk0.getRaw(elem, 'font-size');
      }, isRoot);
      return inline.getOrThunk(function () {
        return $_bctu7wzrjcg9mdk0.get(start, 'font-size');
      });
    }).getOr('');
  };
  var getSize = function (editor) {
    var node = editor.selection.getStart();
    var elem = $_41aqpdwsjcg9md9w.fromDom(node);
    var root = $_41aqpdwsjcg9md9w.fromDom(editor.getBody());
    var isRoot = function (e) {
      return $_9sx28sw7jcg9md8n.eq(root, e);
    };
    var elemSize = getRawOrComputed(isRoot, elem);
    return $_gcfqi6w8jcg9md8v.find(candidates, function (size) {
      return elemSize === size;
    }).getOr(defaultSize);
  };
  var applySize = function (editor, value) {
    var currentValue = getSize(editor);
    if (currentValue !== value) {
      editor.execCommand('fontSize', false, value);
    }
  };
  var get$7 = function (editor) {
    var size = getSize(editor);
    return sizeToIndex(size).getOr(defaultIndex);
  };
  var apply$1 = function (editor, index) {
    indexToSize(index).each(function (size) {
      applySize(editor, size);
    });
  };
  var $_2xdcy711ajcg9mdru = {
    candidates: $_7bfl0mwajcg9md92.constant(candidates),
    get: get$7,
    apply: apply$1
  };

  var sizes = $_2xdcy711ajcg9mdru.candidates();
  var makeSlider$1 = function (spec) {
    return $_1jbw4d119jcg9mdrm.sketch({
      onChange: spec.onChange,
      sizes: sizes,
      category: 'font',
      getInitialValue: spec.getInitialValue
    });
  };
  var makeItems$1 = function (spec) {
    return [
      $_3w6c8v10pjcg9mdpf.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>'),
      makeSlider$1(spec),
      $_3w6c8v10pjcg9mdpf.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>')
    ];
  };
  var sketch$3 = function (realm, editor) {
    var spec = {
      onChange: function (value) {
        $_2xdcy711ajcg9mdru.apply(editor, value);
      },
      getInitialValue: function () {
        return $_2xdcy711ajcg9mdru.get(editor);
      }
    };
    return $_7etfs0117jcg9mdrk.button(realm, 'font-size', function () {
      return makeItems$1(spec);
    });
  };
  var $_eyiiwg118jcg9mdrl = {
    makeItems: makeItems$1,
    sketch: sketch$3
  };

  var record = function (spec) {
    var uid = $_1ohhokx5jcg9mdbm.hasKey(spec, 'uid') ? spec.uid : $_6lxli10ljcg9mdop.generate('memento');
    var get = function (any) {
      return any.getSystem().getByUid(uid).getOrDie();
    };
    var getOpt = function (any) {
      return any.getSystem().getByUid(uid).fold($_gb5srhw9jcg9md90.none, $_gb5srhw9jcg9md90.some);
    };
    var asSpec = function () {
      return $_4xvhzgwxjcg9mdae.deepMerge(spec, { uid: uid });
    };
    return {
      get: get,
      getOpt: getOpt,
      asSpec: asSpec
    };
  };
  var $_1l0wx311djcg9mdsg = { record: record };

  function create$3(width, height) {
    return resize(document.createElement('canvas'), width, height);
  }
  function clone$2(canvas) {
    var tCanvas, ctx;
    tCanvas = create$3(canvas.width, canvas.height);
    ctx = get2dContext(tCanvas);
    ctx.drawImage(canvas, 0, 0);
    return tCanvas;
  }
  function get2dContext(canvas) {
    return canvas.getContext('2d');
  }
  function get3dContext(canvas) {
    var gl = null;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
    }
    if (!gl) {
      gl = null;
    }
    return gl;
  }
  function resize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  var $_6sxzr911gjcg9mdsy = {
    create: create$3,
    clone: clone$2,
    resize: resize,
    get2dContext: get2dContext,
    get3dContext: get3dContext
  };

  function getWidth(image) {
    return image.naturalWidth || image.width;
  }
  function getHeight(image) {
    return image.naturalHeight || image.height;
  }
  var $_enalsl11hjcg9mdsz = {
    getWidth: getWidth,
    getHeight: getHeight
  };

  var promise = function () {
    var Promise = function (fn) {
      if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function')
        throw new TypeError('not a function');
      this._state = null;
      this._value = null;
      this._deferreds = [];
      doResolve(fn, bind(resolve, this), bind(reject, this));
    };
    var asap = Promise.immediateFn || typeof setImmediate === 'function' && setImmediate || function (fn) {
      setTimeout(fn, 1);
    };
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
    var isArray = Array.isArray || function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    };
    function handle(deferred) {
      var me = this;
      if (this._state === null) {
        this._deferreds.push(deferred);
        return;
      }
      asap(function () {
        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value);
          return;
        }
        var ret;
        try {
          ret = cb(me._value);
        } catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(ret);
      });
    }
    function resolve(newValue) {
      try {
        if (newValue === this)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (typeof then === 'function') {
            doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
            return;
          }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
      } catch (e) {
        reject.call(this, e);
      }
    }
    function reject(newValue) {
      this._state = false;
      this._value = newValue;
      finale.call(this);
    }
    function finale() {
      for (var i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i]);
      }
      this._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done)
            return;
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done)
            return;
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done)
          return;
        done = true;
        onRejected(ex);
      }
    }
    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      var me = this;
      return new Promise(function (resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
      });
    };
    Promise.all = function () {
      var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
      return new Promise(function (resolve, reject) {
        if (args.length === 0)
          return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }
      return new Promise(function (resolve) {
        resolve(value);
      });
    };
    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };
    return Promise;
  };
  var Promise = window.Promise ? window.Promise : promise();

  var Blob = function (parts, properties) {
    var f = $_eq8elgwcjcg9md97.getOrDie('Blob');
    return new f(parts, properties);
  };

  var FileReader = function () {
    var f = $_eq8elgwcjcg9md97.getOrDie('FileReader');
    return new f();
  };

  var Uint8Array = function (arr) {
    var f = $_eq8elgwcjcg9md97.getOrDie('Uint8Array');
    return new f(arr);
  };

  var requestAnimationFrame = function (callback) {
    var f = $_eq8elgwcjcg9md97.getOrDie('requestAnimationFrame');
    f(callback);
  };
  var atob = function (base64) {
    var f = $_eq8elgwcjcg9md97.getOrDie('atob');
    return f(base64);
  };
  var $_84602j11mjcg9mdt5 = {
    atob: atob,
    requestAnimationFrame: requestAnimationFrame
  };

  function loadImage(image) {
    return new Promise(function (resolve) {
      function loaded() {
        image.removeEventListener('load', loaded);
        resolve(image);
      }
      if (image.complete) {
        resolve(image);
      } else {
        image.addEventListener('load', loaded);
      }
    });
  }
  function imageToBlob$1(image) {
    return loadImage(image).then(function (image) {
      var src = image.src;
      if (src.indexOf('blob:') === 0) {
        return anyUriToBlob(src);
      }
      if (src.indexOf('data:') === 0) {
        return dataUriToBlob(src);
      }
      return anyUriToBlob(src);
    });
  }
  function blobToImage$1(blob) {
    return new Promise(function (resolve, reject) {
      var blobUrl = URL.createObjectURL(blob);
      var image = new Image();
      var removeListeners = function () {
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', error);
      };
      function loaded() {
        removeListeners();
        resolve(image);
      }
      function error() {
        removeListeners();
        reject('Unable to load data of type ' + blob.type + ': ' + blobUrl);
      }
      image.addEventListener('load', loaded);
      image.addEventListener('error', error);
      image.src = blobUrl;
      if (image.complete) {
        loaded();
      }
    });
  }
  function anyUriToBlob(url) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        }
      };
      xhr.send();
    });
  }
  function dataUriToBlobSync$1(uri) {
    var data = uri.split(',');
    var matches = /data:([^;]+)/.exec(data[0]);
    if (!matches)
      return $_gb5srhw9jcg9md90.none();
    var mimetype = matches[1];
    var base64 = data[1];
    var sliceSize = 1024;
    var byteCharacters = $_84602j11mjcg9mdt5.atob(base64);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = Uint8Array(bytes);
    }
    return $_gb5srhw9jcg9md90.some(Blob(byteArrays, { type: mimetype }));
  }
  function dataUriToBlob(uri) {
    return new Promise(function (resolve, reject) {
      dataUriToBlobSync$1(uri).fold(function () {
        reject('uri is not base64: ' + uri);
      }, resolve);
    });
  }
  function uriToBlob$1(url) {
    if (url.indexOf('blob:') === 0) {
      return anyUriToBlob(url);
    }
    if (url.indexOf('data:') === 0) {
      return dataUriToBlob(url);
    }
    return null;
  }
  function canvasToBlob(canvas, type, quality) {
    type = type || 'image/png';
    if (HTMLCanvasElement.prototype.toBlob) {
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          resolve(blob);
        }, type, quality);
      });
    } else {
      return dataUriToBlob(canvas.toDataURL(type, quality));
    }
  }
  function canvasToDataURL(getCanvas, type, quality) {
    type = type || 'image/png';
    return getCanvas.then(function (canvas) {
      return canvas.toDataURL(type, quality);
    });
  }
  function blobToCanvas(blob) {
    return blobToImage$1(blob).then(function (image) {
      revokeImageUrl(image);
      var context, canvas;
      canvas = $_6sxzr911gjcg9mdsy.create($_enalsl11hjcg9mdsz.getWidth(image), $_enalsl11hjcg9mdsz.getHeight(image));
      context = $_6sxzr911gjcg9mdsy.get2dContext(canvas);
      context.drawImage(image, 0, 0);
      return canvas;
    });
  }
  function blobToDataUri$1(blob) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  function blobToBase64$1(blob) {
    return blobToDataUri$1(blob).then(function (dataUri) {
      return dataUri.split(',')[1];
    });
  }
  function revokeImageUrl(image) {
    URL.revokeObjectURL(image.src);
  }
  var $_2d9kzm11fjcg9mdsq = {
    blobToImage: blobToImage$1,
    imageToBlob: imageToBlob$1,
    blobToDataUri: blobToDataUri$1,
    blobToBase64: blobToBase64$1,
    dataUriToBlobSync: dataUriToBlobSync$1,
    canvasToBlob: canvasToBlob,
    canvasToDataURL: canvasToDataURL,
    blobToCanvas: blobToCanvas,
    uriToBlob: uriToBlob$1
  };

  var blobToImage = function (image) {
    return $_2d9kzm11fjcg9mdsq.blobToImage(image);
  };
  var imageToBlob = function (blob) {
    return $_2d9kzm11fjcg9mdsq.imageToBlob(blob);
  };
  var blobToDataUri = function (blob) {
    return $_2d9kzm11fjcg9mdsq.blobToDataUri(blob);
  };
  var blobToBase64 = function (blob) {
    return $_2d9kzm11fjcg9mdsq.blobToBase64(blob);
  };
  var dataUriToBlobSync = function (uri) {
    return $_2d9kzm11fjcg9mdsq.dataUriToBlobSync(uri);
  };
  var uriToBlob = function (uri) {
    return $_gb5srhw9jcg9md90.from($_2d9kzm11fjcg9mdsq.uriToBlob(uri));
  };
  var $_41cro611ejcg9mdsm = {
    blobToImage: blobToImage,
    imageToBlob: imageToBlob,
    blobToDataUri: blobToDataUri,
    blobToBase64: blobToBase64,
    dataUriToBlobSync: dataUriToBlobSync,
    uriToBlob: uriToBlob
  };

  var addImage = function (editor, blob) {
    $_41cro611ejcg9mdsm.blobToBase64(blob).then(function (base64) {
      editor.undoManager.transact(function () {
        var cache = editor.editorUpload.blobCache;
        var info = cache.create($_7upt5710fjcg9mdne.generate('mceu'), blob, base64);
        cache.add(info);
        var img = editor.dom.createHTML('img', { src: info.blobUri() });
        editor.insertContent(img);
      });
    });
  };
  var extractBlob = function (simulatedEvent) {
    var event = simulatedEvent.event();
    var files = event.raw().target.files || event.raw().dataTransfer.files;
    return $_gb5srhw9jcg9md90.from(files[0]);
  };
  var sketch$5 = function (editor) {
    var pickerDom = {
      tag: 'input',
      attributes: {
        accept: 'image/*',
        type: 'file',
        title: ''
      },
      styles: {
        visibility: 'hidden',
        position: 'absolute'
      }
    };
    var memPicker = $_1l0wx311djcg9mdsg.record({
      dom: pickerDom,
      events: $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.cutter($_f4bxsewwjcg9mdab.click()),
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.change(), function (picker, simulatedEvent) {
          extractBlob(simulatedEvent).each(function (blob) {
            addImage(editor, blob);
          });
        })
      ])
    });
    return Button.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-image ${prefix}-icon"></span>'),
      components: [memPicker.asSpec()],
      action: function (button) {
        var picker = memPicker.get(button);
        picker.element().dom().click();
      }
    });
  };
  var $_7offtj11cjcg9mds8 = { sketch: sketch$5 };

  var get$8 = function (element) {
    return element.dom().textContent;
  };
  var set$5 = function (element, value) {
    element.dom().textContent = value;
  };
  var $_dfxtue11pjcg9mdtm = {
    get: get$8,
    set: set$5
  };

  var isNotEmpty = function (val) {
    return val.length > 0;
  };
  var defaultToEmpty = function (str) {
    return str === undefined || str === null ? '' : str;
  };
  var noLink = function (editor) {
    var text = editor.selection.getContent({ format: 'text' });
    return {
      url: '',
      text: text,
      title: '',
      target: '',
      link: $_gb5srhw9jcg9md90.none()
    };
  };
  var fromLink = function (link) {
    var text = $_dfxtue11pjcg9mdtm.get(link);
    var url = $_ectfz6xvjcg9mddu.get(link, 'href');
    var title = $_ectfz6xvjcg9mddu.get(link, 'title');
    var target = $_ectfz6xvjcg9mddu.get(link, 'target');
    return {
      url: defaultToEmpty(url),
      text: text !== url ? defaultToEmpty(text) : '',
      title: defaultToEmpty(title),
      target: defaultToEmpty(target),
      link: $_gb5srhw9jcg9md90.some(link)
    };
  };
  var getInfo = function (editor) {
    return query(editor).fold(function () {
      return noLink(editor);
    }, function (link) {
      return fromLink(link);
    });
  };
  var wasSimple = function (link) {
    var prevHref = $_ectfz6xvjcg9mddu.get(link, 'href');
    var prevText = $_dfxtue11pjcg9mdtm.get(link);
    return prevHref === prevText;
  };
  var getTextToApply = function (link, url, info) {
    return info.text.filter(isNotEmpty).fold(function () {
      return wasSimple(link) ? $_gb5srhw9jcg9md90.some(url) : $_gb5srhw9jcg9md90.none();
    }, $_gb5srhw9jcg9md90.some);
  };
  var unlinkIfRequired = function (editor, info) {
    var activeLink = info.link.bind($_7bfl0mwajcg9md92.identity);
    activeLink.each(function (link) {
      editor.execCommand('unlink');
    });
  };
  var getAttrs$1 = function (url, info) {
    var attrs = {};
    attrs.href = url;
    info.title.filter(isNotEmpty).each(function (title) {
      attrs.title = title;
    });
    info.target.filter(isNotEmpty).each(function (target) {
      attrs.target = target;
    });
    return attrs;
  };
  var applyInfo = function (editor, info) {
    info.url.filter(isNotEmpty).fold(function () {
      unlinkIfRequired(editor, info);
    }, function (url) {
      var attrs = getAttrs$1(url, info);
      var activeLink = info.link.bind($_7bfl0mwajcg9md92.identity);
      activeLink.fold(function () {
        var text = info.text.filter(isNotEmpty).getOr(url);
        editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(text)));
      }, function (link) {
        var text = getTextToApply(link, url, info);
        $_ectfz6xvjcg9mddu.setAll(link, attrs);
        text.each(function (newText) {
          $_dfxtue11pjcg9mdtm.set(link, newText);
        });
      });
    });
  };
  var query = function (editor) {
    var start = $_41aqpdwsjcg9md9w.fromDom(editor.selection.getStart());
    return $_a6xsw6zljcg9mdjk.closest(start, 'a');
  };
  var $_9f4x7z11ojcg9mdtb = {
    getInfo: getInfo,
    applyInfo: applyInfo,
    query: query
  };

  var events$6 = function (name, eventHandlers) {
    var events = $_v93nkw5jcg9md8g.derive(eventHandlers);
    return $_bb1w99w3jcg9md7v.create({
      fields: [$_5g6e15x1jcg9mdax.strict('enabled')],
      name: name,
      active: { events: $_7bfl0mwajcg9md92.constant(events) }
    });
  };
  var config = function (name, eventHandlers) {
    var me = events$6(name, eventHandlers);
    return {
      key: name,
      value: {
        config: {},
        me: me,
        configAsRaw: $_7bfl0mwajcg9md92.constant({}),
        initialConfig: {},
        state: $_bb1w99w3jcg9md7v.noState()
      }
    };
  };
  var $_7lwycj11rjcg9mdu2 = {
    events: events$6,
    config: config
  };

  var getCurrent = function (component, composeConfig, composeState) {
    return composeConfig.find()(component);
  };
  var $_bij7wa11tjcg9mdu6 = { getCurrent: getCurrent };

  var ComposeSchema = [$_5g6e15x1jcg9mdax.strict('find')];

  var Composing = $_bb1w99w3jcg9md7v.create({
    fields: ComposeSchema,
    name: 'composing',
    apis: $_bij7wa11tjcg9mdu6
  });

  var factory$1 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: $_4xvhzgwxjcg9mdae.deepMerge({
        tag: 'div',
        attributes: { role: 'presentation' }
      }, detail.dom()),
      components: detail.components(),
      behaviours: $_bu8gqd10cjcg9mdmw.get(detail.containerBehaviours()),
      events: detail.events(),
      domModification: detail.domModification(),
      eventOrder: detail.eventOrder()
    };
  };
  var Container = $_55yzot10djcg9mdn2.single({
    name: 'Container',
    factory: factory$1,
    configFields: [
      $_5g6e15x1jcg9mdax.defaulted('components', []),
      $_bu8gqd10cjcg9mdmw.field('containerBehaviours', []),
      $_5g6e15x1jcg9mdax.defaulted('events', {}),
      $_5g6e15x1jcg9mdax.defaulted('domModification', {}),
      $_5g6e15x1jcg9mdax.defaulted('eventOrder', {})
    ]
  });

  var factory$2 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([
        me.config({
          store: {
            mode: 'memory',
            initialValue: detail.getInitialValue()()
          }
        }),
        Composing.config({ find: $_gb5srhw9jcg9md90.some })
      ]), $_bu8gqd10cjcg9mdmw.get(detail.dataBehaviours())),
      events: $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.runOnAttached(function (component, simulatedEvent) {
          me.setValue(component, detail.getInitialValue()());
        })])
    };
  };
  var DataField = $_55yzot10djcg9mdn2.single({
    name: 'DataField',
    factory: factory$2,
    configFields: [
      $_5g6e15x1jcg9mdax.strict('uid'),
      $_5g6e15x1jcg9mdax.strict('dom'),
      $_5g6e15x1jcg9mdax.strict('getInitialValue'),
      $_bu8gqd10cjcg9mdmw.field('dataBehaviours', [
        me,
        Composing
      ])
    ]
  });

  var get$9 = function (element) {
    return element.dom().value;
  };
  var set$6 = function (element, value) {
    if (value === undefined)
      throw new Error('Value.set was undefined');
    element.dom().value = value;
  };
  var $_7iw9bl11zjcg9mduv = {
    set: set$6,
    get: get$9
  };

  var schema$8 = [
    $_5g6e15x1jcg9mdax.option('data'),
    $_5g6e15x1jcg9mdax.defaulted('inputAttributes', {}),
    $_5g6e15x1jcg9mdax.defaulted('inputStyles', {}),
    $_5g6e15x1jcg9mdax.defaulted('type', 'input'),
    $_5g6e15x1jcg9mdax.defaulted('tag', 'input'),
    $_5g6e15x1jcg9mdax.defaulted('inputClasses', []),
    $_f9utgpysjcg9mdgi.onHandler('onSetValue'),
    $_5g6e15x1jcg9mdax.defaulted('styles', {}),
    $_5g6e15x1jcg9mdax.option('placeholder'),
    $_5g6e15x1jcg9mdax.defaulted('eventOrder', {}),
    $_bu8gqd10cjcg9mdmw.field('inputBehaviours', [
      me,
      Focusing
    ]),
    $_5g6e15x1jcg9mdax.defaulted('selectOnFocus', true)
  ];
  var behaviours = function (detail) {
    return $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([
      me.config({
        store: {
          mode: 'manual',
          initialValue: detail.data().getOr(undefined),
          getValue: function (input) {
            return $_7iw9bl11zjcg9mduv.get(input.element());
          },
          setValue: function (input, data) {
            var current = $_7iw9bl11zjcg9mduv.get(input.element());
            if (current !== data) {
              $_7iw9bl11zjcg9mduv.set(input.element(), data);
            }
          }
        },
        onSetValue: detail.onSetValue()
      }),
      Focusing.config({
        onFocus: detail.selectOnFocus() === false ? $_7bfl0mwajcg9md92.noop : function (component) {
          var input = component.element();
          var value = $_7iw9bl11zjcg9mduv.get(input);
          input.dom().setSelectionRange(0, value.length);
        }
      })
    ]), $_bu8gqd10cjcg9mdmw.get(detail.inputBehaviours()));
  };
  var dom$2 = function (detail) {
    return {
      tag: detail.tag(),
      attributes: $_4xvhzgwxjcg9mdae.deepMerge($_1ohhokx5jcg9mdbm.wrapAll([{
          key: 'type',
          value: detail.type()
        }].concat(detail.placeholder().map(function (pc) {
        return {
          key: 'placeholder',
          value: pc
        };
      }).toArray())), detail.inputAttributes()),
      styles: detail.inputStyles(),
      classes: detail.inputClasses()
    };
  };
  var $_6bf83k11yjcg9mduk = {
    schema: $_7bfl0mwajcg9md92.constant(schema$8),
    behaviours: behaviours,
    dom: dom$2
  };

  var factory$3 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: $_6bf83k11yjcg9mduk.dom(detail),
      components: [],
      behaviours: $_6bf83k11yjcg9mduk.behaviours(detail),
      eventOrder: detail.eventOrder()
    };
  };
  var Input = $_55yzot10djcg9mdn2.single({
    name: 'Input',
    configFields: $_6bf83k11yjcg9mduk.schema(),
    factory: factory$3
  });

  var exhibit$3 = function (base, tabConfig) {
    return $_aq2yxwxjjcg9mdd0.nu({
      attributes: $_1ohhokx5jcg9mdbm.wrapAll([{
          key: tabConfig.tabAttr(),
          value: 'true'
        }])
    });
  };
  var $_42m3az121jcg9mdux = { exhibit: exhibit$3 };

  var TabstopSchema = [$_5g6e15x1jcg9mdax.defaulted('tabAttr', 'data-alloy-tabstop')];

  var Tabstopping = $_bb1w99w3jcg9md7v.create({
    fields: TabstopSchema,
    name: 'tabstopping',
    active: $_42m3az121jcg9mdux
  });

  var clearInputBehaviour = 'input-clearing';
  var field$2 = function (name, placeholder) {
    var inputSpec = $_1l0wx311djcg9mdsg.record(Input.sketch({
      placeholder: placeholder,
      onSetValue: function (input, data) {
        $_4wv38zwujcg9mda1.emit(input, $_f4bxsewwjcg9mdab.input());
      },
      inputBehaviours: $_bb1w99w3jcg9md7v.derive([
        Composing.config({ find: $_gb5srhw9jcg9md90.some }),
        Tabstopping.config({}),
        Keying.config({ mode: 'execution' })
      ]),
      selectOnFocus: false
    }));
    var buttonSpec = $_1l0wx311djcg9mdsg.record(Button.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>'),
      action: function (button) {
        var input = inputSpec.get(button);
        me.setValue(input, '');
      }
    }));
    return {
      name: name,
      spec: Container.sketch({
        dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-input-container"></div>'),
        components: [
          inputSpec.asSpec(),
          buttonSpec.asSpec()
        ],
        containerBehaviours: $_bb1w99w3jcg9md7v.derive([
          Toggling.config({ toggleClass: $_3sfngaz0jcg9mdhj.resolve('input-container-empty') }),
          Composing.config({
            find: function (comp) {
              return $_gb5srhw9jcg9md90.some(inputSpec.get(comp));
            }
          }),
          $_7lwycj11rjcg9mdu2.config(clearInputBehaviour, [$_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.input(), function (iContainer) {
              var input = inputSpec.get(iContainer);
              var val = me.getValue(input);
              var f = val.length > 0 ? Toggling.off : Toggling.on;
              f(iContainer);
            })])
        ])
      })
    };
  };
  var hidden = function (name) {
    return {
      name: name,
      spec: DataField.sketch({
        dom: {
          tag: 'span',
          styles: { display: 'none' }
        },
        getInitialValue: function () {
          return $_gb5srhw9jcg9md90.none();
        }
      })
    };
  };
  var $_fq1wwe11qjcg9mdto = {
    field: field$2,
    hidden: hidden
  };

  var nativeDisabled = [
    'input',
    'button',
    'textarea'
  ];
  var onLoad$5 = function (component, disableConfig, disableState) {
    if (disableConfig.disabled())
      disable(component, disableConfig, disableState);
  };
  var hasNative = function (component) {
    return $_gcfqi6w8jcg9md8v.contains(nativeDisabled, $_97hwf5xwjcg9mddy.name(component.element()));
  };
  var nativeIsDisabled = function (component) {
    return $_ectfz6xvjcg9mddu.has(component.element(), 'disabled');
  };
  var nativeDisable = function (component) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'disabled', 'disabled');
  };
  var nativeEnable = function (component) {
    $_ectfz6xvjcg9mddu.remove(component.element(), 'disabled');
  };
  var ariaIsDisabled = function (component) {
    return $_ectfz6xvjcg9mddu.get(component.element(), 'aria-disabled') === 'true';
  };
  var ariaDisable = function (component) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'aria-disabled', 'true');
  };
  var ariaEnable = function (component) {
    $_ectfz6xvjcg9mddu.set(component.element(), 'aria-disabled', 'false');
  };
  var disable = function (component, disableConfig, disableState) {
    disableConfig.disableClass().each(function (disableClass) {
      $_eb18ucxtjcg9mddr.add(component.element(), disableClass);
    });
    var f = hasNative(component) ? nativeDisable : ariaDisable;
    f(component);
  };
  var enable = function (component, disableConfig, disableState) {
    disableConfig.disableClass().each(function (disableClass) {
      $_eb18ucxtjcg9mddr.remove(component.element(), disableClass);
    });
    var f = hasNative(component) ? nativeEnable : ariaEnable;
    f(component);
  };
  var isDisabled = function (component) {
    return hasNative(component) ? nativeIsDisabled(component) : ariaIsDisabled(component);
  };
  var $_d6ki7126jcg9mdvw = {
    enable: enable,
    disable: disable,
    isDisabled: isDisabled,
    onLoad: onLoad$5
  };

  var exhibit$4 = function (base, disableConfig, disableState) {
    return $_aq2yxwxjjcg9mdd0.nu({ classes: disableConfig.disabled() ? disableConfig.disableClass().map($_gcfqi6w8jcg9md8v.pure).getOr([]) : [] });
  };
  var events$7 = function (disableConfig, disableState) {
    return $_v93nkw5jcg9md8g.derive([
      $_v93nkw5jcg9md8g.abort($_fvndowvjcg9mda7.execute(), function (component, simulatedEvent) {
        return $_d6ki7126jcg9mdvw.isDisabled(component, disableConfig, disableState);
      }),
      $_bdrph6w4jcg9md83.loadEvent(disableConfig, disableState, $_d6ki7126jcg9mdvw.onLoad)
    ]);
  };
  var $_8ub41v125jcg9mdvs = {
    exhibit: exhibit$4,
    events: events$7
  };

  var DisableSchema = [
    $_5g6e15x1jcg9mdax.defaulted('disabled', false),
    $_5g6e15x1jcg9mdax.option('disableClass')
  ];

  var Disabling = $_bb1w99w3jcg9md7v.create({
    fields: DisableSchema,
    name: 'disabling',
    active: $_8ub41v125jcg9mdvs,
    apis: $_d6ki7126jcg9mdvw
  });

  var owner$1 = 'form';
  var schema$9 = [$_bu8gqd10cjcg9mdmw.field('formBehaviours', [me])];
  var getPartName = function (name) {
    return '<alloy.field.' + name + '>';
  };
  var sketch$8 = function (fSpec) {
    var parts = function () {
      var record = [];
      var field = function (name, config) {
        record.push(name);
        return $_dmikjr10hjcg9mdnl.generateOne(owner$1, getPartName(name), config);
      };
      return {
        field: field,
        record: function () {
          return record;
        }
      };
    }();
    var spec = fSpec(parts);
    var partNames = parts.record();
    var fieldParts = $_gcfqi6w8jcg9md8v.map(partNames, function (n) {
      return $_b1jyxz10jjcg9mdo3.required({
        name: n,
        pname: getPartName(n)
      });
    });
    return $_3zy9iz10gjcg9mdnf.composite(owner$1, schema$9, fieldParts, make, spec);
  };
  var make = function (detail, components, spec) {
    return $_4xvhzgwxjcg9mdae.deepMerge({
      'debug.sketcher': { 'Form': spec },
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([me.config({
          store: {
            mode: 'manual',
            getValue: function (form) {
              var optPs = $_dmikjr10hjcg9mdnl.getAllParts(form, detail);
              return $_9is1m7wzjcg9mdag.map(optPs, function (optPThunk, pName) {
                return optPThunk().bind(Composing.getCurrent).map(me.getValue);
              });
            },
            setValue: function (form, values) {
              $_9is1m7wzjcg9mdag.each(values, function (newValue, key) {
                $_dmikjr10hjcg9mdnl.getPart(form, detail, key).each(function (wrapper) {
                  Composing.getCurrent(wrapper).each(function (field) {
                    me.setValue(field, newValue);
                  });
                });
              });
            }
          }
        })]), $_bu8gqd10cjcg9mdmw.get(detail.formBehaviours())),
      apis: {
        getField: function (form, key) {
          return $_dmikjr10hjcg9mdnl.getPart(form, detail, key).bind(Composing.getCurrent);
        }
      }
    });
  };
  var $_bp5wrm128jcg9mdw6 = {
    getField: $_26cc5f10ejcg9mdna.makeApi(function (apis, component, key) {
      return apis.getField(component, key);
    }),
    sketch: sketch$8
  };

  var revocable = function (doRevoke) {
    var subject = Cell($_gb5srhw9jcg9md90.none());
    var revoke = function () {
      subject.get().each(doRevoke);
    };
    var clear = function () {
      revoke();
      subject.set($_gb5srhw9jcg9md90.none());
    };
    var set = function (s) {
      revoke();
      subject.set($_gb5srhw9jcg9md90.some(s));
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set
    };
  };
  var destroyable = function () {
    return revocable(function (s) {
      s.destroy();
    });
  };
  var unbindable = function () {
    return revocable(function (s) {
      s.unbind();
    });
  };
  var api$2 = function () {
    var subject = Cell($_gb5srhw9jcg9md90.none());
    var revoke = function () {
      subject.get().each(function (s) {
        s.destroy();
      });
    };
    var clear = function () {
      revoke();
      subject.set($_gb5srhw9jcg9md90.none());
    };
    var set = function (s) {
      revoke();
      subject.set($_gb5srhw9jcg9md90.some(s));
    };
    var run = function (f) {
      subject.get().each(f);
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set,
      run: run
    };
  };
  var value$3 = function () {
    var subject = Cell($_gb5srhw9jcg9md90.none());
    var clear = function () {
      subject.set($_gb5srhw9jcg9md90.none());
    };
    var set = function (s) {
      subject.set($_gb5srhw9jcg9md90.some(s));
    };
    var on = function (f) {
      subject.get().each(f);
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      set: set,
      isSet: isSet,
      on: on
    };
  };
  var $_7psgdg129jcg9mdwe = {
    destroyable: destroyable,
    unbindable: unbindable,
    api: api$2,
    value: value$3
  };

  var SWIPING_LEFT = 1;
  var SWIPING_RIGHT = -1;
  var SWIPING_NONE = 0;
  var init$3 = function (xValue) {
    return {
      xValue: xValue,
      points: []
    };
  };
  var move = function (model, xValue) {
    if (xValue === model.xValue) {
      return model;
    }
    var currentDirection = xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT;
    var newPoint = {
      direction: currentDirection,
      xValue: xValue
    };
    var priorPoints = function () {
      if (model.points.length === 0) {
        return [];
      } else {
        var prev = model.points[model.points.length - 1];
        return prev.direction === currentDirection ? model.points.slice(0, model.points.length - 1) : model.points;
      }
    }();
    return {
      xValue: xValue,
      points: priorPoints.concat([newPoint])
    };
  };
  var complete = function (model) {
    if (model.points.length === 0) {
      return SWIPING_NONE;
    } else {
      var firstDirection = model.points[0].direction;
      var lastDirection = model.points[model.points.length - 1].direction;
      return firstDirection === SWIPING_RIGHT && lastDirection === SWIPING_RIGHT ? SWIPING_RIGHT : firstDirection === SWIPING_LEFT && lastDirection === SWIPING_LEFT ? SWIPING_LEFT : SWIPING_NONE;
    }
  };
  var $_1oan8312ajcg9mdwg = {
    init: init$3,
    move: move,
    complete: complete
  };

  var sketch$7 = function (rawSpec) {
    var navigateEvent = 'navigateEvent';
    var wrapperAdhocEvents = 'serializer-wrapper-events';
    var formAdhocEvents = 'form-events';
    var schema = $_96sv3hxgjcg9mdco.objOf([
      $_5g6e15x1jcg9mdax.strict('fields'),
      $_5g6e15x1jcg9mdax.defaulted('maxFieldIndex', rawSpec.fields.length - 1),
      $_5g6e15x1jcg9mdax.strict('onExecute'),
      $_5g6e15x1jcg9mdax.strict('getInitialValue'),
      $_5g6e15x1jcg9mdax.state('state', function () {
        return {
          dialogSwipeState: $_7psgdg129jcg9mdwe.value(),
          currentScreen: Cell(0)
        };
      })
    ]);
    var spec = $_96sv3hxgjcg9mdco.asRawOrDie('SerialisedDialog', schema, rawSpec);
    var navigationButton = function (direction, directionName, enabled) {
      return Button.sketch({
        dom: $_3w6c8v10pjcg9mdpf.dom('<span class="${prefix}-icon-' + directionName + ' ${prefix}-icon"></span>'),
        action: function (button) {
          $_4wv38zwujcg9mda1.emitWith(button, navigateEvent, { direction: direction });
        },
        buttonBehaviours: $_bb1w99w3jcg9md7v.derive([Disabling.config({
            disableClass: $_3sfngaz0jcg9mdhj.resolve('toolbar-navigation-disabled'),
            disabled: !enabled
          })])
      });
    };
    var reposition = function (dialog, message) {
      $_a6xsw6zljcg9mdjk.descendant(dialog.element(), '.' + $_3sfngaz0jcg9mdhj.resolve('serialised-dialog-chain')).each(function (parent) {
        $_bctu7wzrjcg9mdk0.set(parent, 'left', -spec.state.currentScreen.get() * message.width + 'px');
      });
    };
    var navigate = function (dialog, direction) {
      var screens = $_fg27d6zjjcg9mdjg.descendants(dialog.element(), '.' + $_3sfngaz0jcg9mdhj.resolve('serialised-dialog-screen'));
      $_a6xsw6zljcg9mdjk.descendant(dialog.element(), '.' + $_3sfngaz0jcg9mdhj.resolve('serialised-dialog-chain')).each(function (parent) {
        if (spec.state.currentScreen.get() + direction >= 0 && spec.state.currentScreen.get() + direction < screens.length) {
          $_bctu7wzrjcg9mdk0.getRaw(parent, 'left').each(function (left) {
            var currentLeft = parseInt(left, 10);
            var w = $_d38qpy116jcg9mdri.get(screens[0]);
            $_bctu7wzrjcg9mdk0.set(parent, 'left', currentLeft - direction * w + 'px');
          });
          spec.state.currentScreen.set(spec.state.currentScreen.get() + direction);
        }
      });
    };
    var focusInput = function (dialog) {
      var inputs = $_fg27d6zjjcg9mdjg.descendants(dialog.element(), 'input');
      var optInput = $_gb5srhw9jcg9md90.from(inputs[spec.state.currentScreen.get()]);
      optInput.each(function (input) {
        dialog.getSystem().getByDom(input).each(function (inputComp) {
          $_4wv38zwujcg9mda1.dispatchFocus(dialog, inputComp.element());
        });
      });
      var dotitems = memDots.get(dialog);
      Highlighting.highlightAt(dotitems, spec.state.currentScreen.get());
    };
    var resetState = function () {
      spec.state.currentScreen.set(0);
      spec.state.dialogSwipeState.clear();
    };
    var memForm = $_1l0wx311djcg9mdsg.record($_bp5wrm128jcg9mdw6.sketch(function (parts) {
      return {
        dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-serialised-dialog"></div>'),
        components: [Container.sketch({
            dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>'),
            components: $_gcfqi6w8jcg9md8v.map(spec.fields, function (field, i) {
              return i <= spec.maxFieldIndex ? Container.sketch({
                dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-serialised-dialog-screen"></div>'),
                components: $_gcfqi6w8jcg9md8v.flatten([
                  [navigationButton(-1, 'previous', i > 0)],
                  [parts.field(field.name, field.spec)],
                  [navigationButton(+1, 'next', i < spec.maxFieldIndex)]
                ])
              }) : parts.field(field.name, field.spec);
            })
          })],
        formBehaviours: $_bb1w99w3jcg9md7v.derive([
          $_1n9vh6yzjcg9mdhf.orientation(function (dialog, message) {
            reposition(dialog, message);
          }),
          Keying.config({
            mode: 'special',
            focusIn: function (dialog) {
              focusInput(dialog);
            },
            onTab: function (dialog) {
              navigate(dialog, +1);
              return $_gb5srhw9jcg9md90.some(true);
            },
            onShiftTab: function (dialog) {
              navigate(dialog, -1);
              return $_gb5srhw9jcg9md90.some(true);
            }
          }),
          $_7lwycj11rjcg9mdu2.config(formAdhocEvents, [
            $_v93nkw5jcg9md8g.runOnAttached(function (dialog, simulatedEvent) {
              resetState();
              var dotitems = memDots.get(dialog);
              Highlighting.highlightFirst(dotitems);
              spec.getInitialValue(dialog).each(function (v) {
                me.setValue(dialog, v);
              });
            }),
            $_v93nkw5jcg9md8g.runOnExecute(spec.onExecute),
            $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.transitionend(), function (dialog, simulatedEvent) {
              if (simulatedEvent.event().raw().propertyName === 'left') {
                focusInput(dialog);
              }
            }),
            $_v93nkw5jcg9md8g.run(navigateEvent, function (dialog, simulatedEvent) {
              var direction = simulatedEvent.event().direction();
              navigate(dialog, direction);
            })
          ])
        ])
      };
    }));
    var memDots = $_1l0wx311djcg9mdsg.record({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-dot-container"></div>'),
      behaviours: $_bb1w99w3jcg9md7v.derive([Highlighting.config({
          highlightClass: $_3sfngaz0jcg9mdhj.resolve('dot-active'),
          itemClass: $_3sfngaz0jcg9mdhj.resolve('dot-item')
        })]),
      components: $_gcfqi6w8jcg9md8v.bind(spec.fields, function (_f, i) {
        return i <= spec.maxFieldIndex ? [$_3w6c8v10pjcg9mdpf.spec('<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>')] : [];
      })
    });
    return {
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-serializer-wrapper"></div>'),
      components: [
        memForm.asSpec(),
        memDots.asSpec()
      ],
      behaviours: $_bb1w99w3jcg9md7v.derive([
        Keying.config({
          mode: 'special',
          focusIn: function (wrapper) {
            var form = memForm.get(wrapper);
            Keying.focusIn(form);
          }
        }),
        $_7lwycj11rjcg9mdu2.config(wrapperAdhocEvents, [
          $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchstart(), function (wrapper, simulatedEvent) {
            spec.state.dialogSwipeState.set($_1oan8312ajcg9mdwg.init(simulatedEvent.event().raw().touches[0].clientX));
          }),
          $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchmove(), function (wrapper, simulatedEvent) {
            spec.state.dialogSwipeState.on(function (state) {
              simulatedEvent.event().prevent();
              spec.state.dialogSwipeState.set($_1oan8312ajcg9mdwg.move(state, simulatedEvent.event().raw().touches[0].clientX));
            });
          }),
          $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.touchend(), function (wrapper) {
            spec.state.dialogSwipeState.on(function (state) {
              var dialog = memForm.get(wrapper);
              var direction = -1 * $_1oan8312ajcg9mdwg.complete(state);
              navigate(dialog, direction);
            });
          })
        ])
      ])
    };
  };
  var $_57wf8c123jcg9mdv2 = { sketch: sketch$7 };

  var platform$1 = $_37ytsswfjcg9md9a.detect();
  var preserve$1 = function (f, editor) {
    var rng = editor.selection.getRng();
    f();
    editor.selection.setRng(rng);
  };
  var forAndroid = function (editor, f) {
    var wrapper = platform$1.os.isAndroid() ? preserve$1 : $_7bfl0mwajcg9md92.apply;
    wrapper(f, editor);
  };
  var $_2bgjr12bjcg9mdwh = { forAndroid: forAndroid };

  var getGroups = $_apalrswgjcg9md9b.cached(function (realm, editor) {
    return [{
        label: 'the link group',
        items: [$_57wf8c123jcg9mdv2.sketch({
            fields: [
              $_fq1wwe11qjcg9mdto.field('url', 'Type or paste URL'),
              $_fq1wwe11qjcg9mdto.field('text', 'Link text'),
              $_fq1wwe11qjcg9mdto.field('title', 'Link title'),
              $_fq1wwe11qjcg9mdto.field('target', 'Link target'),
              $_fq1wwe11qjcg9mdto.hidden('link')
            ],
            maxFieldIndex: [
              'url',
              'text',
              'title',
              'target'
            ].length - 1,
            getInitialValue: function () {
              return $_gb5srhw9jcg9md90.some($_9f4x7z11ojcg9mdtb.getInfo(editor));
            },
            onExecute: function (dialog) {
              var info = me.getValue(dialog);
              $_9f4x7z11ojcg9mdtb.applyInfo(editor, info);
              realm.restoreToolbar();
              editor.focus();
            }
          })]
      }];
  });
  var sketch$6 = function (realm, editor) {
    return $_fwn33tz1jcg9mdhl.forToolbarStateAction(editor, 'link', 'link', function () {
      var groups = getGroups(realm, editor);
      realm.setContextToolbar(groups);
      $_2bgjr12bjcg9mdwh.forAndroid(editor, function () {
        realm.focusToolbar();
      });
      $_9f4x7z11ojcg9mdtb.query(editor).each(function (link) {
        editor.selection.select(link.dom());
      });
    });
  };
  var $_bf81ke11njcg9mdt6 = { sketch: sketch$6 };

  var DefaultStyleFormats = [
    {
      title: 'Headings',
      items: [
        {
          title: 'Heading 1',
          format: 'h1'
        },
        {
          title: 'Heading 2',
          format: 'h2'
        },
        {
          title: 'Heading 3',
          format: 'h3'
        },
        {
          title: 'Heading 4',
          format: 'h4'
        },
        {
          title: 'Heading 5',
          format: 'h5'
        },
        {
          title: 'Heading 6',
          format: 'h6'
        }
      ]
    },
    {
      title: 'Inline',
      items: [
        {
          title: 'Bold',
          icon: 'bold',
          format: 'bold'
        },
        {
          title: 'Italic',
          icon: 'italic',
          format: 'italic'
        },
        {
          title: 'Underline',
          icon: 'underline',
          format: 'underline'
        },
        {
          title: 'Strikethrough',
          icon: 'strikethrough',
          format: 'strikethrough'
        },
        {
          title: 'Superscript',
          icon: 'superscript',
          format: 'superscript'
        },
        {
          title: 'Subscript',
          icon: 'subscript',
          format: 'subscript'
        },
        {
          title: 'Code',
          icon: 'code',
          format: 'code'
        }
      ]
    },
    {
      title: 'Blocks',
      items: [
        {
          title: 'Paragraph',
          format: 'p'
        },
        {
          title: 'Blockquote',
          format: 'blockquote'
        },
        {
          title: 'Div',
          format: 'div'
        },
        {
          title: 'Pre',
          format: 'pre'
        }
      ]
    },
    {
      title: 'Alignment',
      items: [
        {
          title: 'Left',
          icon: 'alignleft',
          format: 'alignleft'
        },
        {
          title: 'Center',
          icon: 'aligncenter',
          format: 'aligncenter'
        },
        {
          title: 'Right',
          icon: 'alignright',
          format: 'alignright'
        },
        {
          title: 'Justify',
          icon: 'alignjustify',
          format: 'alignjustify'
        }
      ]
    }
  ];

  var findRoute = function (component, transConfig, transState, route) {
    return $_1ohhokx5jcg9mdbm.readOptFrom(transConfig.routes(), route.start()).map($_7bfl0mwajcg9md92.apply).bind(function (sConfig) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(sConfig, route.destination()).map($_7bfl0mwajcg9md92.apply);
    });
  };
  var getTransition = function (comp, transConfig, transState) {
    var route = getCurrentRoute(comp, transConfig, transState);
    return route.bind(function (r) {
      return getTransitionOf(comp, transConfig, transState, r);
    });
  };
  var getTransitionOf = function (comp, transConfig, transState, route) {
    return findRoute(comp, transConfig, transState, route).bind(function (r) {
      return r.transition().map(function (t) {
        return {
          transition: $_7bfl0mwajcg9md92.constant(t),
          route: $_7bfl0mwajcg9md92.constant(r)
        };
      });
    });
  };
  var disableTransition = function (comp, transConfig, transState) {
    getTransition(comp, transConfig, transState).each(function (routeTransition) {
      var t = routeTransition.transition();
      $_eb18ucxtjcg9mddr.remove(comp.element(), t.transitionClass());
      $_ectfz6xvjcg9mddu.remove(comp.element(), transConfig.destinationAttr());
    });
  };
  var getNewRoute = function (comp, transConfig, transState, destination) {
    return {
      start: $_7bfl0mwajcg9md92.constant($_ectfz6xvjcg9mddu.get(comp.element(), transConfig.stateAttr())),
      destination: $_7bfl0mwajcg9md92.constant(destination)
    };
  };
  var getCurrentRoute = function (comp, transConfig, transState) {
    var el = comp.element();
    return $_ectfz6xvjcg9mddu.has(el, transConfig.destinationAttr()) ? $_gb5srhw9jcg9md90.some({
      start: $_7bfl0mwajcg9md92.constant($_ectfz6xvjcg9mddu.get(comp.element(), transConfig.stateAttr())),
      destination: $_7bfl0mwajcg9md92.constant($_ectfz6xvjcg9mddu.get(comp.element(), transConfig.destinationAttr()))
    }) : $_gb5srhw9jcg9md90.none();
  };
  var jumpTo = function (comp, transConfig, transState, destination) {
    disableTransition(comp, transConfig, transState);
    if ($_ectfz6xvjcg9mddu.has(comp.element(), transConfig.stateAttr()) && $_ectfz6xvjcg9mddu.get(comp.element(), transConfig.stateAttr()) !== destination)
      transConfig.onFinish()(comp, destination);
    $_ectfz6xvjcg9mddu.set(comp.element(), transConfig.stateAttr(), destination);
  };
  var fasttrack = function (comp, transConfig, transState, destination) {
    if ($_ectfz6xvjcg9mddu.has(comp.element(), transConfig.destinationAttr())) {
      $_ectfz6xvjcg9mddu.set(comp.element(), transConfig.stateAttr(), $_ectfz6xvjcg9mddu.get(comp.element(), transConfig.destinationAttr()));
      $_ectfz6xvjcg9mddu.remove(comp.element(), transConfig.destinationAttr());
    }
  };
  var progressTo = function (comp, transConfig, transState, destination) {
    fasttrack(comp, transConfig, transState, destination);
    var route = getNewRoute(comp, transConfig, transState, destination);
    getTransitionOf(comp, transConfig, transState, route).fold(function () {
      jumpTo(comp, transConfig, transState, destination);
    }, function (routeTransition) {
      disableTransition(comp, transConfig, transState);
      var t = routeTransition.transition();
      $_eb18ucxtjcg9mddr.add(comp.element(), t.transitionClass());
      $_ectfz6xvjcg9mddu.set(comp.element(), transConfig.destinationAttr(), destination);
    });
  };
  var getState = function (comp, transConfig, transState) {
    var e = comp.element();
    return $_ectfz6xvjcg9mddu.has(e, transConfig.stateAttr()) ? $_gb5srhw9jcg9md90.some($_ectfz6xvjcg9mddu.get(e, transConfig.stateAttr())) : $_gb5srhw9jcg9md90.none();
  };
  var $_bg2qci12hjcg9mdxf = {
    findRoute: findRoute,
    disableTransition: disableTransition,
    getCurrentRoute: getCurrentRoute,
    jumpTo: jumpTo,
    progressTo: progressTo,
    getState: getState
  };

  var events$8 = function (transConfig, transState) {
    return $_v93nkw5jcg9md8g.derive([
      $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.transitionend(), function (component, simulatedEvent) {
        var raw = simulatedEvent.event().raw();
        $_bg2qci12hjcg9mdxf.getCurrentRoute(component, transConfig, transState).each(function (route) {
          $_bg2qci12hjcg9mdxf.findRoute(component, transConfig, transState, route).each(function (rInfo) {
            rInfo.transition().each(function (rTransition) {
              if (raw.propertyName === rTransition.property()) {
                $_bg2qci12hjcg9mdxf.jumpTo(component, transConfig, transState, route.destination());
                transConfig.onTransition()(component, route);
              }
            });
          });
        });
      }),
      $_v93nkw5jcg9md8g.runOnAttached(function (comp, se) {
        $_bg2qci12hjcg9mdxf.jumpTo(comp, transConfig, transState, transConfig.initialState());
      })
    ]);
  };
  var $_dycpnc12gjcg9mdxc = { events: events$8 };

  var TransitionSchema = [
    $_5g6e15x1jcg9mdax.defaulted('destinationAttr', 'data-transitioning-destination'),
    $_5g6e15x1jcg9mdax.defaulted('stateAttr', 'data-transitioning-state'),
    $_5g6e15x1jcg9mdax.strict('initialState'),
    $_f9utgpysjcg9mdgi.onHandler('onTransition'),
    $_f9utgpysjcg9mdgi.onHandler('onFinish'),
    $_5g6e15x1jcg9mdax.strictOf('routes', $_96sv3hxgjcg9mdco.setOf($_exyfurx7jcg9mdbv.value, $_96sv3hxgjcg9mdco.setOf($_exyfurx7jcg9mdbv.value, $_96sv3hxgjcg9mdco.objOfOnly([$_5g6e15x1jcg9mdax.optionObjOfOnly('transition', [
        $_5g6e15x1jcg9mdax.strict('property'),
        $_5g6e15x1jcg9mdax.strict('transitionClass')
      ])]))))
  ];

  var createRoutes = function (routes) {
    var r = {};
    $_9is1m7wzjcg9mdag.each(routes, function (v, k) {
      var waypoints = k.split('<->');
      r[waypoints[0]] = $_1ohhokx5jcg9mdbm.wrap(waypoints[1], v);
      r[waypoints[1]] = $_1ohhokx5jcg9mdbm.wrap(waypoints[0], v);
    });
    return r;
  };
  var createBistate = function (first, second, transitions) {
    return $_1ohhokx5jcg9mdbm.wrapAll([
      {
        key: first,
        value: $_1ohhokx5jcg9mdbm.wrap(second, transitions)
      },
      {
        key: second,
        value: $_1ohhokx5jcg9mdbm.wrap(first, transitions)
      }
    ]);
  };
  var createTristate = function (first, second, third, transitions) {
    return $_1ohhokx5jcg9mdbm.wrapAll([
      {
        key: first,
        value: $_1ohhokx5jcg9mdbm.wrapAll([
          {
            key: second,
            value: transitions
          },
          {
            key: third,
            value: transitions
          }
        ])
      },
      {
        key: second,
        value: $_1ohhokx5jcg9mdbm.wrapAll([
          {
            key: first,
            value: transitions
          },
          {
            key: third,
            value: transitions
          }
        ])
      },
      {
        key: third,
        value: $_1ohhokx5jcg9mdbm.wrapAll([
          {
            key: first,
            value: transitions
          },
          {
            key: second,
            value: transitions
          }
        ])
      }
    ]);
  };
  var Transitioning = $_bb1w99w3jcg9md7v.create({
    fields: TransitionSchema,
    name: 'transitioning',
    active: $_dycpnc12gjcg9mdxc,
    apis: $_bg2qci12hjcg9mdxf,
    extra: {
      createRoutes: createRoutes,
      createBistate: createBistate,
      createTristate: createTristate
    }
  });

  var generateFrom$1 = function (spec, all) {
    var schema = $_gcfqi6w8jcg9md8v.map(all, function (a) {
      return $_5g6e15x1jcg9mdax.field(a.name(), a.name(), $_amdqrdx2jcg9mdb3.asOption(), $_96sv3hxgjcg9mdco.objOf([
        $_5g6e15x1jcg9mdax.strict('config'),
        $_5g6e15x1jcg9mdax.defaulted('state', $_dhezwlxpjcg9mddk)
      ]));
    });
    var validated = $_96sv3hxgjcg9mdco.asStruct('component.behaviours', $_96sv3hxgjcg9mdco.objOf(schema), spec.behaviours).fold(function (errInfo) {
      throw new Error($_96sv3hxgjcg9mdco.formatError(errInfo) + '\nComplete spec:\n' + $_3oduxxejcg9mdci.stringify(spec, null, 2));
    }, $_7bfl0mwajcg9md92.identity);
    return {
      list: all,
      data: $_9is1m7wzjcg9mdag.map(validated, function (blobOptionThunk) {
        var blobOption = blobOptionThunk();
        return $_7bfl0mwajcg9md92.constant(blobOption.map(function (blob) {
          return {
            config: blob.config(),
            state: blob.state().init(blob.config())
          };
        }));
      })
    };
  };
  var getBehaviours$1 = function (bData) {
    return bData.list;
  };
  var getData = function (bData) {
    return bData.data;
  };
  var $_af8tzy12mjcg9mdym = {
    generateFrom: generateFrom$1,
    getBehaviours: getBehaviours$1,
    getData: getData
  };

  var getBehaviours = function (spec) {
    var behaviours = $_1ohhokx5jcg9mdbm.readOptFrom(spec, 'behaviours').getOr({});
    var keys = $_gcfqi6w8jcg9md8v.filter($_9is1m7wzjcg9mdag.keys(behaviours), function (k) {
      return behaviours[k] !== undefined;
    });
    return $_gcfqi6w8jcg9md8v.map(keys, function (k) {
      return spec.behaviours[k].me;
    });
  };
  var generateFrom = function (spec, all) {
    return $_af8tzy12mjcg9mdym.generateFrom(spec, all);
  };
  var generate$4 = function (spec) {
    var all = getBehaviours(spec);
    return generateFrom(spec, all);
  };
  var $_4zv2d512ljcg9mdyh = {
    generate: generate$4,
    generateFrom: generateFrom
  };

  var ComponentApi = $_7vp4sexrjcg9mddn.exactly([
    'getSystem',
    'config',
    'hasConfigured',
    'spec',
    'connect',
    'disconnect',
    'element',
    'syncComponents',
    'readState',
    'components',
    'events'
  ]);

  var SystemApi = $_7vp4sexrjcg9mddn.exactly([
    'debugInfo',
    'triggerFocus',
    'triggerEvent',
    'triggerEscape',
    'addToWorld',
    'removeFromWorld',
    'addToGui',
    'removeFromGui',
    'build',
    'getByUid',
    'getByDom',
    'broadcast',
    'broadcastOn'
  ]);

  var NoContextApi = function (getComp) {
    var fail = function (event) {
      return function () {
        throw new Error('The component must be in a context to send: ' + event + '\n' + $_3ckbpiy8jcg9mdf5.element(getComp().element()) + ' is not in context.');
      };
    };
    return SystemApi({
      debugInfo: $_7bfl0mwajcg9md92.constant('fake'),
      triggerEvent: fail('triggerEvent'),
      triggerFocus: fail('triggerFocus'),
      triggerEscape: fail('triggerEscape'),
      build: fail('build'),
      addToWorld: fail('addToWorld'),
      removeFromWorld: fail('removeFromWorld'),
      addToGui: fail('addToGui'),
      removeFromGui: fail('removeFromGui'),
      getByUid: fail('getByUid'),
      getByDom: fail('getByDom'),
      broadcast: fail('broadcast'),
      broadcastOn: fail('broadcastOn')
    });
  };

  var byInnerKey = function (data, tuple) {
    var r = {};
    $_9is1m7wzjcg9mdag.each(data, function (detail, key) {
      $_9is1m7wzjcg9mdag.each(detail, function (value, indexKey) {
        var chain = $_1ohhokx5jcg9mdbm.readOr(indexKey, [])(r);
        r[indexKey] = chain.concat([tuple(key, value)]);
      });
    });
    return r;
  };
  var $_ey36x012rjcg9mdzf = { byInnerKey: byInnerKey };

  var behaviourDom = function (name, modification) {
    return {
      name: $_7bfl0mwajcg9md92.constant(name),
      modification: modification
    };
  };
  var concat = function (chain, aspect) {
    var values = $_gcfqi6w8jcg9md8v.bind(chain, function (c) {
      return c.modification().getOr([]);
    });
    return $_exyfurx7jcg9mdbv.value($_1ohhokx5jcg9mdbm.wrap(aspect, values));
  };
  var onlyOne = function (chain, aspect, order) {
    if (chain.length > 1)
      return $_exyfurx7jcg9mdbv.error('Multiple behaviours have tried to change DOM "' + aspect + '". The guilty behaviours are: ' + $_3oduxxejcg9mdci.stringify($_gcfqi6w8jcg9md8v.map(chain, function (b) {
        return b.name();
      })) + '. At this stage, this ' + 'is not supported. Future releases might provide strategies for resolving this.');
    else if (chain.length === 0)
      return $_exyfurx7jcg9mdbv.value({});
    else
      return $_exyfurx7jcg9mdbv.value(chain[0].modification().fold(function () {
        return {};
      }, function (m) {
        return $_1ohhokx5jcg9mdbm.wrap(aspect, m);
      }));
  };
  var duplicate = function (aspect, k, obj, behaviours) {
    return $_exyfurx7jcg9mdbv.error('Mulitple behaviours have tried to change the _' + k + '_ "' + aspect + '"' + '. The guilty behaviours are: ' + $_3oduxxejcg9mdci.stringify($_gcfqi6w8jcg9md8v.bind(behaviours, function (b) {
      return b.modification().getOr({})[k] !== undefined ? [b.name()] : [];
    }), null, 2) + '. This is not currently supported.');
  };
  var safeMerge = function (chain, aspect) {
    var y = $_gcfqi6w8jcg9md8v.foldl(chain, function (acc, c) {
      var obj = c.modification().getOr({});
      return acc.bind(function (accRest) {
        var parts = $_9is1m7wzjcg9mdag.mapToArray(obj, function (v, k) {
          return accRest[k] !== undefined ? duplicate(aspect, k, obj, chain) : $_exyfurx7jcg9mdbv.value($_1ohhokx5jcg9mdbm.wrap(k, v));
        });
        return $_1ohhokx5jcg9mdbm.consolidate(parts, accRest);
      });
    }, $_exyfurx7jcg9mdbv.value({}));
    return y.map(function (yValue) {
      return $_1ohhokx5jcg9mdbm.wrap(aspect, yValue);
    });
  };
  var mergeTypes = {
    classes: concat,
    attributes: safeMerge,
    styles: safeMerge,
    domChildren: onlyOne,
    defChildren: onlyOne,
    innerHtml: onlyOne,
    value: onlyOne
  };
  var combine$1 = function (info, baseMod, behaviours, base) {
    var behaviourDoms = $_4xvhzgwxjcg9mdae.deepMerge({}, baseMod);
    $_gcfqi6w8jcg9md8v.each(behaviours, function (behaviour) {
      behaviourDoms[behaviour.name()] = behaviour.exhibit(info, base);
    });
    var byAspect = $_ey36x012rjcg9mdzf.byInnerKey(behaviourDoms, behaviourDom);
    var usedAspect = $_9is1m7wzjcg9mdag.map(byAspect, function (values, aspect) {
      return $_gcfqi6w8jcg9md8v.bind(values, function (value) {
        return value.modification().fold(function () {
          return [];
        }, function (v) {
          return [value];
        });
      });
    });
    var modifications = $_9is1m7wzjcg9mdag.mapToArray(usedAspect, function (values, aspect) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(mergeTypes, aspect).fold(function () {
        return $_exyfurx7jcg9mdbv.error('Unknown field type: ' + aspect);
      }, function (merger) {
        return merger(values, aspect);
      });
    });
    var consolidated = $_1ohhokx5jcg9mdbm.consolidate(modifications, {});
    return consolidated.map($_aq2yxwxjjcg9mdd0.nu);
  };
  var $_erhn5l12qjcg9mdz5 = { combine: combine$1 };

  var sortKeys = function (label, keyName, array, order) {
    var sliced = array.slice(0);
    try {
      var sorted = sliced.sort(function (a, b) {
        var aKey = a[keyName]();
        var bKey = b[keyName]();
        var aIndex = order.indexOf(aKey);
        var bIndex = order.indexOf(bKey);
        if (aIndex === -1)
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey + '.\nOrder specified: ' + $_3oduxxejcg9mdci.stringify(order, null, 2));
        if (bIndex === -1)
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey + '.\nOrder specified: ' + $_3oduxxejcg9mdci.stringify(order, null, 2));
        if (aIndex < bIndex)
          return -1;
        else if (bIndex < aIndex)
          return 1;
        else
          return 0;
      });
      return $_exyfurx7jcg9mdbv.value(sorted);
    } catch (err) {
      return $_exyfurx7jcg9mdbv.error([err]);
    }
  };
  var $_fqqwla12tjcg9mdzs = { sortKeys: sortKeys };

  var nu$7 = function (handler, purpose) {
    return {
      handler: handler,
      purpose: $_7bfl0mwajcg9md92.constant(purpose)
    };
  };
  var curryArgs = function (descHandler, extraArgs) {
    return {
      handler: $_7bfl0mwajcg9md92.curry.apply(undefined, [descHandler.handler].concat(extraArgs)),
      purpose: descHandler.purpose
    };
  };
  var getHandler = function (descHandler) {
    return descHandler.handler;
  };
  var $_4t5wio12ujcg9mdzw = {
    nu: nu$7,
    curryArgs: curryArgs,
    getHandler: getHandler
  };

  var behaviourTuple = function (name, handler) {
    return {
      name: $_7bfl0mwajcg9md92.constant(name),
      handler: $_7bfl0mwajcg9md92.constant(handler)
    };
  };
  var nameToHandlers = function (behaviours, info) {
    var r = {};
    $_gcfqi6w8jcg9md8v.each(behaviours, function (behaviour) {
      r[behaviour.name()] = behaviour.handlers(info);
    });
    return r;
  };
  var groupByEvents = function (info, behaviours, base) {
    var behaviourEvents = $_4xvhzgwxjcg9mdae.deepMerge(base, nameToHandlers(behaviours, info));
    return $_ey36x012rjcg9mdzf.byInnerKey(behaviourEvents, behaviourTuple);
  };
  var combine$2 = function (info, eventOrder, behaviours, base) {
    var byEventName = groupByEvents(info, behaviours, base);
    return combineGroups(byEventName, eventOrder);
  };
  var assemble = function (rawHandler) {
    var handler = $_3s7cjwx0jcg9mdal.read(rawHandler);
    return function (component, simulatedEvent) {
      var args = Array.prototype.slice.call(arguments, 0);
      if (handler.abort.apply(undefined, args)) {
        simulatedEvent.stop();
      } else if (handler.can.apply(undefined, args)) {
        handler.run.apply(undefined, args);
      }
    };
  };
  var missingOrderError = function (eventName, tuples) {
    return new $_exyfurx7jcg9mdbv.error(['The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' + 'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' + 'can trigger it are: ' + $_3oduxxejcg9mdci.stringify($_gcfqi6w8jcg9md8v.map(tuples, function (c) {
        return c.name();
      }), null, 2)]);
  };
  var fuse$1 = function (tuples, eventOrder, eventName) {
    var order = eventOrder[eventName];
    if (!order)
      return missingOrderError(eventName, tuples);
    else
      return $_fqqwla12tjcg9mdzs.sortKeys('Event: ' + eventName, 'name', tuples, order).map(function (sortedTuples) {
        var handlers = $_gcfqi6w8jcg9md8v.map(sortedTuples, function (tuple) {
          return tuple.handler();
        });
        return $_3s7cjwx0jcg9mdal.fuse(handlers);
      });
  };
  var combineGroups = function (byEventName, eventOrder) {
    var r = $_9is1m7wzjcg9mdag.mapToArray(byEventName, function (tuples, eventName) {
      var combined = tuples.length === 1 ? $_exyfurx7jcg9mdbv.value(tuples[0].handler()) : fuse$1(tuples, eventOrder, eventName);
      return combined.map(function (handler) {
        var assembled = assemble(handler);
        var purpose = tuples.length > 1 ? $_gcfqi6w8jcg9md8v.filter(eventOrder, function (o) {
          return $_gcfqi6w8jcg9md8v.contains(tuples, function (t) {
            return t.name() === o;
          });
        }).join(' > ') : tuples[0].name();
        return $_1ohhokx5jcg9mdbm.wrap(eventName, $_4t5wio12ujcg9mdzw.nu(assembled, purpose));
      });
    });
    return $_1ohhokx5jcg9mdbm.consolidate(r, {});
  };
  var $_7lf0gm12sjcg9mdzj = { combine: combine$2 };

  var toInfo = function (spec) {
    return $_96sv3hxgjcg9mdco.asStruct('custom.definition', $_96sv3hxgjcg9mdco.objOfOnly([
      $_5g6e15x1jcg9mdax.field('dom', 'dom', $_amdqrdx2jcg9mdb3.strict(), $_96sv3hxgjcg9mdco.objOfOnly([
        $_5g6e15x1jcg9mdax.strict('tag'),
        $_5g6e15x1jcg9mdax.defaulted('styles', {}),
        $_5g6e15x1jcg9mdax.defaulted('classes', []),
        $_5g6e15x1jcg9mdax.defaulted('attributes', {}),
        $_5g6e15x1jcg9mdax.option('value'),
        $_5g6e15x1jcg9mdax.option('innerHtml')
      ])),
      $_5g6e15x1jcg9mdax.strict('components'),
      $_5g6e15x1jcg9mdax.strict('uid'),
      $_5g6e15x1jcg9mdax.defaulted('events', {}),
      $_5g6e15x1jcg9mdax.defaulted('apis', $_7bfl0mwajcg9md92.constant({})),
      $_5g6e15x1jcg9mdax.field('eventOrder', 'eventOrder', $_amdqrdx2jcg9mdb3.mergeWith({
        'alloy.execute': [
          'disabling',
          'alloy.base.behaviour',
          'toggling'
        ],
        'alloy.focus': [
          'alloy.base.behaviour',
          'focusing',
          'keying'
        ],
        'alloy.system.init': [
          'alloy.base.behaviour',
          'disabling',
          'toggling',
          'representing'
        ],
        'input': [
          'alloy.base.behaviour',
          'representing',
          'streaming',
          'invalidating'
        ],
        'alloy.system.detached': [
          'alloy.base.behaviour',
          'representing'
        ]
      }), $_96sv3hxgjcg9mdco.anyValue()),
      $_5g6e15x1jcg9mdax.option('domModification'),
      $_f9utgpysjcg9mdgi.snapshot('originalSpec'),
      $_5g6e15x1jcg9mdax.defaulted('debug.sketcher', 'unknown')
    ]), spec);
  };
  var getUid = function (info) {
    return $_1ohhokx5jcg9mdbm.wrap($_91rbsx10mjcg9mdow.idAttr(), info.uid());
  };
  var toDefinition = function (info) {
    var base = {
      tag: info.dom().tag(),
      classes: info.dom().classes(),
      attributes: $_4xvhzgwxjcg9mdae.deepMerge(getUid(info), info.dom().attributes()),
      styles: info.dom().styles(),
      domChildren: $_gcfqi6w8jcg9md8v.map(info.components(), function (comp) {
        return comp.element();
      })
    };
    return $_toxmgxkjcg9mdd9.nu($_4xvhzgwxjcg9mdae.deepMerge(base, info.dom().innerHtml().map(function (h) {
      return $_1ohhokx5jcg9mdbm.wrap('innerHtml', h);
    }).getOr({}), info.dom().value().map(function (h) {
      return $_1ohhokx5jcg9mdbm.wrap('value', h);
    }).getOr({})));
  };
  var toModification = function (info) {
    return info.domModification().fold(function () {
      return $_aq2yxwxjjcg9mdd0.nu({});
    }, $_aq2yxwxjjcg9mdd0.nu);
  };
  var toApis = function (info) {
    return info.apis();
  };
  var toEvents = function (info) {
    return info.events();
  };
  var $_cwxrl012vjcg9mdzz = {
    toInfo: toInfo,
    toDefinition: toDefinition,
    toModification: toModification,
    toApis: toApis,
    toEvents: toEvents
  };

  var add$3 = function (element, classes) {
    $_gcfqi6w8jcg9md8v.each(classes, function (x) {
      $_eb18ucxtjcg9mddr.add(element, x);
    });
  };
  var remove$6 = function (element, classes) {
    $_gcfqi6w8jcg9md8v.each(classes, function (x) {
      $_eb18ucxtjcg9mddr.remove(element, x);
    });
  };
  var toggle$3 = function (element, classes) {
    $_gcfqi6w8jcg9md8v.each(classes, function (x) {
      $_eb18ucxtjcg9mddr.toggle(element, x);
    });
  };
  var hasAll = function (element, classes) {
    return $_gcfqi6w8jcg9md8v.forall(classes, function (clazz) {
      return $_eb18ucxtjcg9mddr.has(element, clazz);
    });
  };
  var hasAny = function (element, classes) {
    return $_gcfqi6w8jcg9md8v.exists(classes, function (clazz) {
      return $_eb18ucxtjcg9mddr.has(element, clazz);
    });
  };
  var getNative = function (element) {
    var classList = element.dom().classList;
    var r = new Array(classList.length);
    for (var i = 0; i < classList.length; i++) {
      r[i] = classList.item(i);
    }
    return r;
  };
  var get$10 = function (element) {
    return $_fjn66dxxjcg9mddz.supports(element) ? getNative(element) : $_fjn66dxxjcg9mddz.get(element);
  };
  var $_3ibmsu12xjcg9me0l = {
    add: add$3,
    remove: remove$6,
    toggle: toggle$3,
    hasAll: hasAll,
    hasAny: hasAny,
    get: get$10
  };

  var getChildren = function (definition) {
    if (definition.domChildren().isSome() && definition.defChildren().isSome()) {
      throw new Error('Cannot specify children and child specs! Must be one or the other.\nDef: ' + $_toxmgxkjcg9mdd9.defToStr(definition));
    } else {
      return definition.domChildren().fold(function () {
        var defChildren = definition.defChildren().getOr([]);
        return $_gcfqi6w8jcg9md8v.map(defChildren, renderDef);
      }, function (domChildren) {
        return domChildren;
      });
    }
  };
  var renderToDom = function (definition) {
    var subject = $_41aqpdwsjcg9md9w.fromTag(definition.tag());
    $_ectfz6xvjcg9mddu.setAll(subject, definition.attributes().getOr({}));
    $_3ibmsu12xjcg9me0l.add(subject, definition.classes().getOr([]));
    $_bctu7wzrjcg9mdk0.setAll(subject, definition.styles().getOr({}));
    $_ghy5kryajcg9mdf9.set(subject, definition.innerHtml().getOr(''));
    var children = getChildren(definition);
    $_7e164ay5jcg9mder.append(subject, children);
    definition.value().each(function (value) {
      $_7iw9bl11zjcg9mduv.set(subject, value);
    });
    return subject;
  };
  var renderDef = function (spec) {
    var definition = $_toxmgxkjcg9mdd9.nu(spec);
    return renderToDom(definition);
  };
  var $_ay483m12wjcg9me0a = { renderToDom: renderToDom };

  var build$1 = function (spec) {
    var getMe = function () {
      return me;
    };
    var systemApi = Cell(NoContextApi(getMe));
    var info = $_96sv3hxgjcg9mdco.getOrDie($_cwxrl012vjcg9mdzz.toInfo($_4xvhzgwxjcg9mdae.deepMerge(spec, { behaviours: undefined })));
    var bBlob = $_4zv2d512ljcg9mdyh.generate(spec);
    var bList = $_af8tzy12mjcg9mdym.getBehaviours(bBlob);
    var bData = $_af8tzy12mjcg9mdym.getData(bBlob);
    var definition = $_cwxrl012vjcg9mdzz.toDefinition(info);
    var baseModification = { 'alloy.base.modification': $_cwxrl012vjcg9mdzz.toModification(info) };
    var modification = $_erhn5l12qjcg9mdz5.combine(bData, baseModification, bList, definition).getOrDie();
    var modDefinition = $_aq2yxwxjjcg9mdd0.merge(definition, modification);
    var item = $_ay483m12wjcg9me0a.renderToDom(modDefinition);
    var baseEvents = { 'alloy.base.behaviour': $_cwxrl012vjcg9mdzz.toEvents(info) };
    var events = $_7lf0gm12sjcg9mdzj.combine(bData, info.eventOrder(), bList, baseEvents).getOrDie();
    var subcomponents = Cell(info.components());
    var connect = function (newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function () {
      systemApi.set(NoContextApi(getMe));
    };
    var syncComponents = function () {
      var children = $_1lxhd4y2jcg9mdeh.children(item);
      var subs = $_gcfqi6w8jcg9md8v.bind(children, function (child) {
        return systemApi.get().getByDom(child).fold(function () {
          return [];
        }, function (c) {
          return [c];
        });
      });
      subcomponents.set(subs);
    };
    var config = function (behaviour) {
      if (behaviour === $_26cc5f10ejcg9mdna.apiConfig())
        return info.apis();
      var b = bData;
      var f = $_dkt1fwyjcg9mdaf.isFunction(b[behaviour.name()]) ? b[behaviour.name()] : function () {
        throw new Error('Could not find ' + behaviour.name() + ' in ' + $_3oduxxejcg9mdci.stringify(spec, null, 2));
      };
      return f();
    };
    var hasConfigured = function (behaviour) {
      return $_dkt1fwyjcg9mdaf.isFunction(bData[behaviour.name()]);
    };
    var readState = function (behaviourName) {
      return bData[behaviourName]().map(function (b) {
        return b.state.readState();
      }).getOr('not enabled');
    };
    var me = ComponentApi({
      getSystem: systemApi.get,
      config: config,
      hasConfigured: hasConfigured,
      spec: $_7bfl0mwajcg9md92.constant(spec),
      readState: readState,
      connect: connect,
      disconnect: disconnect,
      element: $_7bfl0mwajcg9md92.constant(item),
      syncComponents: syncComponents,
      components: subcomponents.get,
      events: $_7bfl0mwajcg9md92.constant(events)
    });
    return me;
  };
  var $_f8fb7b12kjcg9mdy6 = { build: build$1 };

  var isRecursive = function (component, originator, target) {
    return $_9sx28sw7jcg9md8n.eq(originator, component.element()) && !$_9sx28sw7jcg9md8n.eq(originator, target);
  };
  var $_9rjjvn12yjcg9me0o = {
    events: $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.can($_fvndowvjcg9mda7.focus(), function (component, simulatedEvent) {
        var originator = simulatedEvent.event().originator();
        var target = simulatedEvent.event().target();
        if (isRecursive(component, originator, target)) {
          console.warn($_fvndowvjcg9mda7.focus() + ' did not get interpreted by the desired target. ' + '\nOriginator: ' + $_3ckbpiy8jcg9mdf5.element(originator) + '\nTarget: ' + $_3ckbpiy8jcg9mdf5.element(target) + '\nCheck the ' + $_fvndowvjcg9mda7.focus() + ' event handlers');
          return false;
        } else {
          return true;
        }
      })])
  };

  var make$1 = function (spec) {
    return spec;
  };
  var $_cyv1m512zjcg9me0r = { make: make$1 };

  var buildSubcomponents = function (spec) {
    var components = $_1ohhokx5jcg9mdbm.readOr('components', [])(spec);
    return $_gcfqi6w8jcg9md8v.map(components, build);
  };
  var buildFromSpec = function (userSpec) {
    var spec = $_cyv1m512zjcg9me0r.make(userSpec);
    var components = buildSubcomponents(spec);
    var completeSpec = $_4xvhzgwxjcg9mdae.deepMerge($_9rjjvn12yjcg9me0o, spec, $_1ohhokx5jcg9mdbm.wrap('components', components));
    return $_exyfurx7jcg9mdbv.value($_f8fb7b12kjcg9mdy6.build(completeSpec));
  };
  var text = function (textContent) {
    var element = $_41aqpdwsjcg9md9w.fromText(textContent);
    return external({ element: element });
  };
  var external = function (spec) {
    var extSpec = $_96sv3hxgjcg9mdco.asStructOrDie('external.component', $_96sv3hxgjcg9mdco.objOfOnly([
      $_5g6e15x1jcg9mdax.strict('element'),
      $_5g6e15x1jcg9mdax.option('uid')
    ]), spec);
    var systemApi = Cell(NoContextApi());
    var connect = function (newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function () {
      systemApi.set(NoContextApi(function () {
        return me;
      }));
    };
    extSpec.uid().each(function (uid) {
      $_6lxli10ljcg9mdop.writeOnly(extSpec.element(), uid);
    });
    var me = ComponentApi({
      getSystem: systemApi.get,
      config: $_gb5srhw9jcg9md90.none,
      hasConfigured: $_7bfl0mwajcg9md92.constant(false),
      connect: connect,
      disconnect: disconnect,
      element: $_7bfl0mwajcg9md92.constant(extSpec.element()),
      spec: $_7bfl0mwajcg9md92.constant(spec),
      readState: $_7bfl0mwajcg9md92.constant('No state'),
      syncComponents: $_7bfl0mwajcg9md92.noop,
      components: $_7bfl0mwajcg9md92.constant([]),
      events: $_7bfl0mwajcg9md92.constant({})
    });
    return $_26cc5f10ejcg9mdna.premade(me);
  };
  var build = function (rawUserSpec) {
    return $_26cc5f10ejcg9mdna.getPremade(rawUserSpec).fold(function () {
      var userSpecWithUid = $_4xvhzgwxjcg9mdae.deepMerge({ uid: $_6lxli10ljcg9mdop.generate('') }, rawUserSpec);
      return buildFromSpec(userSpecWithUid).getOrDie();
    }, function (prebuilt) {
      return prebuilt;
    });
  };
  var $_6yv6bm12jjcg9mdxu = {
    build: build,
    premade: $_26cc5f10ejcg9mdna.premade,
    external: external,
    text: text
  };

  var hoverEvent = 'alloy.item-hover';
  var focusEvent = 'alloy.item-focus';
  var onHover = function (item) {
    if ($_g6scf1yfjcg9mdfg.search(item.element()).isNone() || Focusing.isFocused(item)) {
      if (!Focusing.isFocused(item))
        Focusing.focus(item);
      $_4wv38zwujcg9mda1.emitWith(item, hoverEvent, { item: item });
    }
  };
  var onFocus = function (item) {
    $_4wv38zwujcg9mda1.emitWith(item, focusEvent, { item: item });
  };
  var $_do8ycr133jcg9me16 = {
    hover: $_7bfl0mwajcg9md92.constant(hoverEvent),
    focus: $_7bfl0mwajcg9md92.constant(focusEvent),
    onHover: onHover,
    onFocus: onFocus
  };

  var builder = function (info) {
    return {
      dom: $_4xvhzgwxjcg9mdae.deepMerge(info.dom(), { attributes: { role: info.toggling().isSome() ? 'menuitemcheckbox' : 'menuitem' } }),
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([
        info.toggling().fold(Toggling.revoke, function (tConfig) {
          return Toggling.config($_4xvhzgwxjcg9mdae.deepMerge({ aria: { mode: 'checked' } }, tConfig));
        }),
        Focusing.config({
          ignore: info.ignoreFocus(),
          onFocus: function (component) {
            $_do8ycr133jcg9me16.onFocus(component);
          }
        }),
        Keying.config({ mode: 'execution' }),
        me.config({
          store: {
            mode: 'memory',
            initialValue: info.data()
          }
        })
      ]), info.itemBehaviours()),
      events: $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.runWithTarget($_fvndowvjcg9mda7.tapOrClick(), $_4wv38zwujcg9mda1.emitExecute),
        $_v93nkw5jcg9md8g.cutter($_f4bxsewwjcg9mdab.mousedown()),
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mouseover(), $_do8ycr133jcg9me16.onHover),
        $_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.focusItem(), Focusing.focus)
      ]),
      components: info.components(),
      domModification: info.domModification()
    };
  };
  var schema$11 = [
    $_5g6e15x1jcg9mdax.strict('data'),
    $_5g6e15x1jcg9mdax.strict('components'),
    $_5g6e15x1jcg9mdax.strict('dom'),
    $_5g6e15x1jcg9mdax.option('toggling'),
    $_5g6e15x1jcg9mdax.defaulted('itemBehaviours', {}),
    $_5g6e15x1jcg9mdax.defaulted('ignoreFocus', false),
    $_5g6e15x1jcg9mdax.defaulted('domModification', {}),
    $_f9utgpysjcg9mdgi.output('builder', builder)
  ];

  var builder$1 = function (detail) {
    return {
      dom: detail.dom(),
      components: detail.components(),
      events: $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.stopper($_fvndowvjcg9mda7.focusItem())])
    };
  };
  var schema$12 = [
    $_5g6e15x1jcg9mdax.strict('dom'),
    $_5g6e15x1jcg9mdax.strict('components'),
    $_f9utgpysjcg9mdgi.output('builder', builder$1)
  ];

  var owner$2 = 'item-widget';
  var partTypes = [$_b1jyxz10jjcg9mdo3.required({
      name: 'widget',
      overrides: function (detail) {
        return {
          behaviours: $_bb1w99w3jcg9md7v.derive([me.config({
              store: {
                mode: 'manual',
                getValue: function (component) {
                  return detail.data();
                },
                setValue: function () {
                }
              }
            })])
        };
      }
    })];
  var $_2rdggn136jcg9me1j = {
    owner: $_7bfl0mwajcg9md92.constant(owner$2),
    parts: $_7bfl0mwajcg9md92.constant(partTypes)
  };

  var builder$2 = function (info) {
    var subs = $_dmikjr10hjcg9mdnl.substitutes($_2rdggn136jcg9me1j.owner(), info, $_2rdggn136jcg9me1j.parts());
    var components = $_dmikjr10hjcg9mdnl.components($_2rdggn136jcg9me1j.owner(), info, subs.internals());
    var focusWidget = function (component) {
      return $_dmikjr10hjcg9mdnl.getPart(component, info, 'widget').map(function (widget) {
        Keying.focusIn(widget);
        return widget;
      });
    };
    var onHorizontalArrow = function (component, simulatedEvent) {
      return $_9cxll8zwjcg9mdkk.inside(simulatedEvent.event().target()) ? $_gb5srhw9jcg9md90.none() : function () {
        if (info.autofocus()) {
          simulatedEvent.setSource(component.element());
          return $_gb5srhw9jcg9md90.none();
        } else {
          return $_gb5srhw9jcg9md90.none();
        }
      }();
    };
    return $_4xvhzgwxjcg9mdae.deepMerge({
      dom: info.dom(),
      components: components,
      domModification: info.domModification(),
      events: $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.runOnExecute(function (component, simulatedEvent) {
          focusWidget(component).each(function (widget) {
            simulatedEvent.stop();
          });
        }),
        $_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.mouseover(), $_do8ycr133jcg9me16.onHover),
        $_v93nkw5jcg9md8g.run($_fvndowvjcg9mda7.focusItem(), function (component, simulatedEvent) {
          if (info.autofocus())
            focusWidget(component);
          else
            Focusing.focus(component);
        })
      ]),
      behaviours: $_bb1w99w3jcg9md7v.derive([
        me.config({
          store: {
            mode: 'memory',
            initialValue: info.data()
          }
        }),
        Focusing.config({
          onFocus: function (component) {
            $_do8ycr133jcg9me16.onFocus(component);
          }
        }),
        Keying.config({
          mode: 'special',
          onLeft: onHorizontalArrow,
          onRight: onHorizontalArrow,
          onEscape: function (component, simulatedEvent) {
            if (!Focusing.isFocused(component) && !info.autofocus()) {
              Focusing.focus(component);
              return $_gb5srhw9jcg9md90.some(true);
            } else if (info.autofocus()) {
              simulatedEvent.setSource(component.element());
              return $_gb5srhw9jcg9md90.none();
            } else {
              return $_gb5srhw9jcg9md90.none();
            }
          }
        })
      ])
    });
  };
  var schema$13 = [
    $_5g6e15x1jcg9mdax.strict('uid'),
    $_5g6e15x1jcg9mdax.strict('data'),
    $_5g6e15x1jcg9mdax.strict('components'),
    $_5g6e15x1jcg9mdax.strict('dom'),
    $_5g6e15x1jcg9mdax.defaulted('autofocus', false),
    $_5g6e15x1jcg9mdax.defaulted('domModification', {}),
    $_dmikjr10hjcg9mdnl.defaultUidsSchema($_2rdggn136jcg9me1j.parts()),
    $_f9utgpysjcg9mdgi.output('builder', builder$2)
  ];

  var itemSchema$1 = $_96sv3hxgjcg9mdco.choose('type', {
    widget: schema$13,
    item: schema$11,
    separator: schema$12
  });
  var configureGrid = function (detail, movementInfo) {
    return {
      mode: 'flatgrid',
      selector: '.' + detail.markers().item(),
      initSize: {
        numColumns: movementInfo.initSize().numColumns(),
        numRows: movementInfo.initSize().numRows()
      },
      focusManager: detail.focusManager()
    };
  };
  var configureMenu = function (detail, movementInfo) {
    return {
      mode: 'menu',
      selector: '.' + detail.markers().item(),
      moveOnTab: movementInfo.moveOnTab(),
      focusManager: detail.focusManager()
    };
  };
  var parts = [$_b1jyxz10jjcg9mdo3.group({
      factory: {
        sketch: function (spec) {
          var itemInfo = $_96sv3hxgjcg9mdco.asStructOrDie('menu.spec item', itemSchema$1, spec);
          return itemInfo.builder()(itemInfo);
        }
      },
      name: 'items',
      unit: 'item',
      defaults: function (detail, u) {
        var fallbackUid = $_6lxli10ljcg9mdop.generate('');
        return $_4xvhzgwxjcg9mdae.deepMerge({ uid: fallbackUid }, u);
      },
      overrides: function (detail, u) {
        return {
          type: u.type,
          ignoreFocus: detail.fakeFocus(),
          domModification: { classes: [detail.markers().item()] }
        };
      }
    })];
  var schema$10 = [
    $_5g6e15x1jcg9mdax.strict('value'),
    $_5g6e15x1jcg9mdax.strict('items'),
    $_5g6e15x1jcg9mdax.strict('dom'),
    $_5g6e15x1jcg9mdax.strict('components'),
    $_5g6e15x1jcg9mdax.defaulted('eventOrder', {}),
    $_bu8gqd10cjcg9mdmw.field('menuBehaviours', [
      Highlighting,
      me,
      Composing,
      Keying
    ]),
    $_5g6e15x1jcg9mdax.defaultedOf('movement', {
      mode: 'menu',
      moveOnTab: true
    }, $_96sv3hxgjcg9mdco.choose('mode', {
      grid: [
        $_f9utgpysjcg9mdgi.initSize(),
        $_f9utgpysjcg9mdgi.output('config', configureGrid)
      ],
      menu: [
        $_5g6e15x1jcg9mdax.defaulted('moveOnTab', true),
        $_f9utgpysjcg9mdgi.output('config', configureMenu)
      ]
    })),
    $_f9utgpysjcg9mdgi.itemMarkers(),
    $_5g6e15x1jcg9mdax.defaulted('fakeFocus', false),
    $_5g6e15x1jcg9mdax.defaulted('focusManager', $_6vsgxjzfjcg9mdiy.dom()),
    $_f9utgpysjcg9mdgi.onHandler('onHighlight')
  ];
  var $_39r0x2131jcg9me0u = {
    name: $_7bfl0mwajcg9md92.constant('Menu'),
    schema: $_7bfl0mwajcg9md92.constant(schema$10),
    parts: $_7bfl0mwajcg9md92.constant(parts)
  };

  var focusEvent$1 = 'alloy.menu-focus';
  var $_4k0xlj138jcg9me1r = { focus: $_7bfl0mwajcg9md92.constant(focusEvent$1) };

  var make$2 = function (detail, components, spec, externals) {
    return $_4xvhzgwxjcg9mdae.deepMerge({
      dom: $_4xvhzgwxjcg9mdae.deepMerge(detail.dom(), { attributes: { role: 'menu' } }),
      uid: detail.uid(),
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([
        Highlighting.config({
          highlightClass: detail.markers().selectedItem(),
          itemClass: detail.markers().item(),
          onHighlight: detail.onHighlight()
        }),
        me.config({
          store: {
            mode: 'memory',
            initialValue: detail.value()
          }
        }),
        Composing.config({ find: $_7bfl0mwajcg9md92.identity }),
        Keying.config(detail.movement().config()(detail, detail.movement()))
      ]), $_bu8gqd10cjcg9mdmw.get(detail.menuBehaviours())),
      events: $_v93nkw5jcg9md8g.derive([
        $_v93nkw5jcg9md8g.run($_do8ycr133jcg9me16.focus(), function (menu, simulatedEvent) {
          var event = simulatedEvent.event();
          menu.getSystem().getByDom(event.target()).each(function (item) {
            Highlighting.highlight(menu, item);
            simulatedEvent.stop();
            $_4wv38zwujcg9mda1.emitWith(menu, $_4k0xlj138jcg9me1r.focus(), {
              menu: menu,
              item: item
            });
          });
        }),
        $_v93nkw5jcg9md8g.run($_do8ycr133jcg9me16.hover(), function (menu, simulatedEvent) {
          var item = simulatedEvent.event().item();
          Highlighting.highlight(menu, item);
        })
      ]),
      components: components,
      eventOrder: detail.eventOrder()
    });
  };
  var $_anaj6r137jcg9me1n = { make: make$2 };

  var Menu = $_55yzot10djcg9mdn2.composite({
    name: 'Menu',
    configFields: $_39r0x2131jcg9me0u.schema(),
    partFields: $_39r0x2131jcg9me0u.parts(),
    factory: $_anaj6r137jcg9me1n.make
  });

  var preserve$2 = function (f, container) {
    var ownerDoc = $_1lxhd4y2jcg9mdeh.owner(container);
    var refocus = $_g6scf1yfjcg9mdfg.active(ownerDoc).bind(function (focused) {
      var hasFocus = function (elem) {
        return $_9sx28sw7jcg9md8n.eq(focused, elem);
      };
      return hasFocus(container) ? $_gb5srhw9jcg9md90.some(container) : $_2dj3ogyhjcg9mdfk.descendant(container, hasFocus);
    });
    var result = f(container);
    refocus.each(function (oldFocus) {
      $_g6scf1yfjcg9mdfg.active(ownerDoc).filter(function (newFocus) {
        return $_9sx28sw7jcg9md8n.eq(newFocus, oldFocus);
      }).orThunk(function () {
        $_g6scf1yfjcg9mdfg.focus(oldFocus);
      });
    });
    return result;
  };
  var $_cveei813cjcg9me27 = { preserve: preserve$2 };

  var set$7 = function (component, replaceConfig, replaceState, data) {
    $_24go32y0jcg9mde6.detachChildren(component);
    $_cveei813cjcg9me27.preserve(function () {
      var children = $_gcfqi6w8jcg9md8v.map(data, component.getSystem().build);
      $_gcfqi6w8jcg9md8v.each(children, function (l) {
        $_24go32y0jcg9mde6.attach(component, l);
      });
    }, component.element());
  };
  var insert = function (component, replaceConfig, insertion, childSpec) {
    var child = component.getSystem().build(childSpec);
    $_24go32y0jcg9mde6.attachWith(component, child, insertion);
  };
  var append$2 = function (component, replaceConfig, replaceState, appendee) {
    insert(component, replaceConfig, $_ghqowmy1jcg9mdef.append, appendee);
  };
  var prepend$2 = function (component, replaceConfig, replaceState, prependee) {
    insert(component, replaceConfig, $_ghqowmy1jcg9mdef.prepend, prependee);
  };
  var remove$7 = function (component, replaceConfig, replaceState, removee) {
    var children = contents(component, replaceConfig);
    var foundChild = $_gcfqi6w8jcg9md8v.find(children, function (child) {
      return $_9sx28sw7jcg9md8n.eq(removee.element(), child.element());
    });
    foundChild.each($_24go32y0jcg9mde6.detach);
  };
  var contents = function (component, replaceConfig) {
    return component.components();
  };
  var $_d7ahwf13bjcg9me22 = {
    append: append$2,
    prepend: prepend$2,
    remove: remove$7,
    set: set$7,
    contents: contents
  };

  var Replacing = $_bb1w99w3jcg9md7v.create({
    fields: [],
    name: 'replacing',
    apis: $_d7ahwf13bjcg9me22
  });

  var transpose = function (obj) {
    return $_9is1m7wzjcg9mdag.tupleMap(obj, function (v, k) {
      return {
        k: v,
        v: k
      };
    });
  };
  var trace = function (items, byItem, byMenu, finish) {
    return $_1ohhokx5jcg9mdbm.readOptFrom(byMenu, finish).bind(function (triggerItem) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(items, triggerItem).bind(function (triggerMenu) {
        var rest = trace(items, byItem, byMenu, triggerMenu);
        return $_gb5srhw9jcg9md90.some([triggerMenu].concat(rest));
      });
    }).getOr([]);
  };
  var generate$5 = function (menus, expansions) {
    var items = {};
    $_9is1m7wzjcg9mdag.each(menus, function (menuItems, menu) {
      $_gcfqi6w8jcg9md8v.each(menuItems, function (item) {
        items[item] = menu;
      });
    });
    var byItem = expansions;
    var byMenu = transpose(expansions);
    var menuPaths = $_9is1m7wzjcg9mdag.map(byMenu, function (triggerItem, submenu) {
      return [submenu].concat(trace(items, byItem, byMenu, submenu));
    });
    return $_9is1m7wzjcg9mdag.map(items, function (path) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(menuPaths, path).getOr([path]);
    });
  };
  var $_en1jv613fjcg9me3a = { generate: generate$5 };

  var LayeredState = function () {
    var expansions = Cell({});
    var menus = Cell({});
    var paths = Cell({});
    var primary = Cell($_gb5srhw9jcg9md90.none());
    var toItemValues = Cell($_7bfl0mwajcg9md92.constant([]));
    var clear = function () {
      expansions.set({});
      menus.set({});
      paths.set({});
      primary.set($_gb5srhw9jcg9md90.none());
    };
    var isClear = function () {
      return primary.get().isNone();
    };
    var setContents = function (sPrimary, sMenus, sExpansions, sToItemValues) {
      primary.set($_gb5srhw9jcg9md90.some(sPrimary));
      expansions.set(sExpansions);
      menus.set(sMenus);
      toItemValues.set(sToItemValues);
      var menuValues = sToItemValues(sMenus);
      var sPaths = $_en1jv613fjcg9me3a.generate(menuValues, sExpansions);
      paths.set(sPaths);
    };
    var expand = function (itemValue) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(expansions.get(), itemValue).map(function (menu) {
        var current = $_1ohhokx5jcg9mdbm.readOptFrom(paths.get(), itemValue).getOr([]);
        return [menu].concat(current);
      });
    };
    var collapse = function (itemValue) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(paths.get(), itemValue).bind(function (path) {
        return path.length > 1 ? $_gb5srhw9jcg9md90.some(path.slice(1)) : $_gb5srhw9jcg9md90.none();
      });
    };
    var refresh = function (itemValue) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(paths.get(), itemValue);
    };
    var lookupMenu = function (menuValue) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(menus.get(), menuValue);
    };
    var otherMenus = function (path) {
      var menuValues = toItemValues.get()(menus.get());
      return $_gcfqi6w8jcg9md8v.difference($_9is1m7wzjcg9mdag.keys(menuValues), path);
    };
    var getPrimary = function () {
      return primary.get().bind(lookupMenu);
    };
    var getMenus = function () {
      return menus.get();
    };
    return {
      setContents: setContents,
      expand: expand,
      refresh: refresh,
      collapse: collapse,
      lookupMenu: lookupMenu,
      otherMenus: otherMenus,
      getPrimary: getPrimary,
      getMenus: getMenus,
      clear: clear,
      isClear: isClear
    };
  };

  var make$3 = function (detail, rawUiSpec) {
    var buildMenus = function (container, menus) {
      return $_9is1m7wzjcg9mdag.map(menus, function (spec, name) {
        var data = Menu.sketch($_4xvhzgwxjcg9mdae.deepMerge(spec, {
          value: name,
          items: spec.items,
          markers: $_1ohhokx5jcg9mdbm.narrow(rawUiSpec.markers, [
            'item',
            'selectedItem'
          ]),
          fakeFocus: detail.fakeFocus(),
          onHighlight: detail.onHighlight(),
          focusManager: detail.fakeFocus() ? $_6vsgxjzfjcg9mdiy.highlights() : $_6vsgxjzfjcg9mdiy.dom()
        }));
        return container.getSystem().build(data);
      });
    };
    var state = LayeredState();
    var setup = function (container) {
      var componentMap = buildMenus(container, detail.data().menus());
      state.setContents(detail.data().primary(), componentMap, detail.data().expansions(), function (sMenus) {
        return toMenuValues(container, sMenus);
      });
      return state.getPrimary();
    };
    var getItemValue = function (item) {
      return me.getValue(item).value;
    };
    var toMenuValues = function (container, sMenus) {
      return $_9is1m7wzjcg9mdag.map(detail.data().menus(), function (data, menuName) {
        return $_gcfqi6w8jcg9md8v.bind(data.items, function (item) {
          return item.type === 'separator' ? [] : [item.data.value];
        });
      });
    };
    var setActiveMenu = function (container, menu) {
      Highlighting.highlight(container, menu);
      Highlighting.getHighlighted(menu).orThunk(function () {
        return Highlighting.getFirst(menu);
      }).each(function (item) {
        $_4wv38zwujcg9mda1.dispatch(container, item.element(), $_fvndowvjcg9mda7.focusItem());
      });
    };
    var getMenus = function (state, menuValues) {
      return $_6vwq8dydjcg9mdfe.cat($_gcfqi6w8jcg9md8v.map(menuValues, state.lookupMenu));
    };
    var updateMenuPath = function (container, state, path) {
      return $_gb5srhw9jcg9md90.from(path[0]).bind(state.lookupMenu).map(function (activeMenu) {
        var rest = getMenus(state, path.slice(1));
        $_gcfqi6w8jcg9md8v.each(rest, function (r) {
          $_eb18ucxtjcg9mddr.add(r.element(), detail.markers().backgroundMenu());
        });
        if (!$_6n4ng7y6jcg9mdet.inBody(activeMenu.element())) {
          Replacing.append(container, $_6yv6bm12jjcg9mdxu.premade(activeMenu));
        }
        $_3ibmsu12xjcg9me0l.remove(activeMenu.element(), [detail.markers().backgroundMenu()]);
        setActiveMenu(container, activeMenu);
        var others = getMenus(state, state.otherMenus(path));
        $_gcfqi6w8jcg9md8v.each(others, function (o) {
          $_3ibmsu12xjcg9me0l.remove(o.element(), [detail.markers().backgroundMenu()]);
          if (!detail.stayInDom())
            Replacing.remove(container, o);
        });
        return activeMenu;
      });
    };
    var expandRight = function (container, item) {
      var value = getItemValue(item);
      return state.expand(value).bind(function (path) {
        $_gb5srhw9jcg9md90.from(path[0]).bind(state.lookupMenu).each(function (activeMenu) {
          if (!$_6n4ng7y6jcg9mdet.inBody(activeMenu.element())) {
            Replacing.append(container, $_6yv6bm12jjcg9mdxu.premade(activeMenu));
          }
          detail.onOpenSubmenu()(container, item, activeMenu);
          Highlighting.highlightFirst(activeMenu);
        });
        return updateMenuPath(container, state, path);
      });
    };
    var collapseLeft = function (container, item) {
      var value = getItemValue(item);
      return state.collapse(value).bind(function (path) {
        return updateMenuPath(container, state, path).map(function (activeMenu) {
          detail.onCollapseMenu()(container, item, activeMenu);
          return activeMenu;
        });
      });
    };
    var updateView = function (container, item) {
      var value = getItemValue(item);
      return state.refresh(value).bind(function (path) {
        return updateMenuPath(container, state, path);
      });
    };
    var onRight = function (container, item) {
      return $_9cxll8zwjcg9mdkk.inside(item.element()) ? $_gb5srhw9jcg9md90.none() : expandRight(container, item);
    };
    var onLeft = function (container, item) {
      return $_9cxll8zwjcg9mdkk.inside(item.element()) ? $_gb5srhw9jcg9md90.none() : collapseLeft(container, item);
    };
    var onEscape = function (container, item) {
      return collapseLeft(container, item).orThunk(function () {
        return detail.onEscape()(container, item);
      });
    };
    var keyOnItem = function (f) {
      return function (container, simulatedEvent) {
        return $_a6xsw6zljcg9mdjk.closest(simulatedEvent.getSource(), '.' + detail.markers().item()).bind(function (target) {
          return container.getSystem().getByDom(target).bind(function (item) {
            return f(container, item);
          });
        });
      };
    };
    var events = $_v93nkw5jcg9md8g.derive([
      $_v93nkw5jcg9md8g.run($_4k0xlj138jcg9me1r.focus(), function (sandbox, simulatedEvent) {
        var menu = simulatedEvent.event().menu();
        Highlighting.highlight(sandbox, menu);
      }),
      $_v93nkw5jcg9md8g.runOnExecute(function (sandbox, simulatedEvent) {
        var target = simulatedEvent.event().target();
        return sandbox.getSystem().getByDom(target).bind(function (item) {
          var itemValue = getItemValue(item);
          if (itemValue.indexOf('collapse-item') === 0) {
            return collapseLeft(sandbox, item);
          }
          return expandRight(sandbox, item).orThunk(function () {
            return detail.onExecute()(sandbox, item);
          });
        });
      }),
      $_v93nkw5jcg9md8g.runOnAttached(function (container, simulatedEvent) {
        setup(container).each(function (primary) {
          Replacing.append(container, $_6yv6bm12jjcg9mdxu.premade(primary));
          if (detail.openImmediately()) {
            setActiveMenu(container, primary);
            detail.onOpenMenu()(container, primary);
          }
        });
      })
    ].concat(detail.navigateOnHover() ? [$_v93nkw5jcg9md8g.run($_do8ycr133jcg9me16.hover(), function (sandbox, simulatedEvent) {
        var item = simulatedEvent.event().item();
        updateView(sandbox, item);
        expandRight(sandbox, item);
        detail.onHover()(sandbox, item);
      })] : []));
    var collapseMenuApi = function (container) {
      Highlighting.getHighlighted(container).each(function (currentMenu) {
        Highlighting.getHighlighted(currentMenu).each(function (currentItem) {
          collapseLeft(container, currentItem);
        });
      });
    };
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([
        Keying.config({
          mode: 'special',
          onRight: keyOnItem(onRight),
          onLeft: keyOnItem(onLeft),
          onEscape: keyOnItem(onEscape),
          focusIn: function (container, keyInfo) {
            state.getPrimary().each(function (primary) {
              $_4wv38zwujcg9mda1.dispatch(container, primary.element(), $_fvndowvjcg9mda7.focusItem());
            });
          }
        }),
        Highlighting.config({
          highlightClass: detail.markers().selectedMenu(),
          itemClass: detail.markers().menu()
        }),
        Composing.config({
          find: function (container) {
            return Highlighting.getHighlighted(container);
          }
        }),
        Replacing.config({})
      ]), $_bu8gqd10cjcg9mdmw.get(detail.tmenuBehaviours())),
      eventOrder: detail.eventOrder(),
      apis: { collapseMenu: collapseMenuApi },
      events: events
    };
  };
  var $_mdv2f13djcg9me2i = {
    make: make$3,
    collapseItem: $_7bfl0mwajcg9md92.constant('collapse-item')
  };

  var tieredData = function (primary, menus, expansions) {
    return {
      primary: primary,
      menus: menus,
      expansions: expansions
    };
  };
  var singleData = function (name, menu) {
    return {
      primary: name,
      menus: $_1ohhokx5jcg9mdbm.wrap(name, menu),
      expansions: {}
    };
  };
  var collapseItem = function (text) {
    return {
      value: $_7upt5710fjcg9mdne.generate($_mdv2f13djcg9me2i.collapseItem()),
      text: text
    };
  };
  var TieredMenu = $_55yzot10djcg9mdn2.single({
    name: 'TieredMenu',
    configFields: [
      $_f9utgpysjcg9mdgi.onStrictKeyboardHandler('onExecute'),
      $_f9utgpysjcg9mdgi.onStrictKeyboardHandler('onEscape'),
      $_f9utgpysjcg9mdgi.onStrictHandler('onOpenMenu'),
      $_f9utgpysjcg9mdgi.onStrictHandler('onOpenSubmenu'),
      $_f9utgpysjcg9mdgi.onHandler('onCollapseMenu'),
      $_5g6e15x1jcg9mdax.defaulted('openImmediately', true),
      $_5g6e15x1jcg9mdax.strictObjOf('data', [
        $_5g6e15x1jcg9mdax.strict('primary'),
        $_5g6e15x1jcg9mdax.strict('menus'),
        $_5g6e15x1jcg9mdax.strict('expansions')
      ]),
      $_5g6e15x1jcg9mdax.defaulted('fakeFocus', false),
      $_f9utgpysjcg9mdgi.onHandler('onHighlight'),
      $_f9utgpysjcg9mdgi.onHandler('onHover'),
      $_f9utgpysjcg9mdgi.tieredMenuMarkers(),
      $_5g6e15x1jcg9mdax.strict('dom'),
      $_5g6e15x1jcg9mdax.defaulted('navigateOnHover', true),
      $_5g6e15x1jcg9mdax.defaulted('stayInDom', false),
      $_bu8gqd10cjcg9mdmw.field('tmenuBehaviours', [
        Keying,
        Highlighting,
        Composing,
        Replacing
      ]),
      $_5g6e15x1jcg9mdax.defaulted('eventOrder', {})
    ],
    apis: {
      collapseMenu: function (apis, tmenu) {
        apis.collapseMenu(tmenu);
      }
    },
    factory: $_mdv2f13djcg9me2i.make,
    extraApis: {
      tieredData: tieredData,
      singleData: singleData,
      collapseItem: collapseItem
    }
  });

  var scrollable = $_3sfngaz0jcg9mdhj.resolve('scrollable');
  var register$1 = function (element) {
    $_eb18ucxtjcg9mddr.add(element, scrollable);
  };
  var deregister = function (element) {
    $_eb18ucxtjcg9mddr.remove(element, scrollable);
  };
  var $_bg1a2213gjcg9me3k = {
    register: register$1,
    deregister: deregister,
    scrollable: $_7bfl0mwajcg9md92.constant(scrollable)
  };

  var getValue$4 = function (item) {
    return $_1ohhokx5jcg9mdbm.readOptFrom(item, 'format').getOr(item.title);
  };
  var convert$1 = function (formats, memMenuThunk) {
    var mainMenu = makeMenu('Styles', [].concat($_gcfqi6w8jcg9md8v.map(formats.items, function (k) {
      return makeItem(getValue$4(k), k.title, k.isSelected(), k.getPreview(), $_1ohhokx5jcg9mdbm.hasKey(formats.expansions, getValue$4(k)));
    })), memMenuThunk, false);
    var submenus = $_9is1m7wzjcg9mdag.map(formats.menus, function (menuItems, menuName) {
      var items = $_gcfqi6w8jcg9md8v.map(menuItems, function (item) {
        return makeItem(getValue$4(item), item.title, item.isSelected !== undefined ? item.isSelected() : false, item.getPreview !== undefined ? item.getPreview() : '', $_1ohhokx5jcg9mdbm.hasKey(formats.expansions, getValue$4(item)));
      });
      return makeMenu(menuName, items, memMenuThunk, true);
    });
    var menus = $_4xvhzgwxjcg9mdae.deepMerge(submenus, $_1ohhokx5jcg9mdbm.wrap('styles', mainMenu));
    var tmenu = TieredMenu.tieredData('styles', menus, formats.expansions);
    return { tmenu: tmenu };
  };
  var makeItem = function (value, text, selected, preview, isMenu) {
    return {
      data: {
        value: value,
        text: text
      },
      type: 'item',
      dom: {
        tag: 'div',
        classes: isMenu ? [$_3sfngaz0jcg9mdhj.resolve('styles-item-is-menu')] : []
      },
      toggling: {
        toggleOnExecute: false,
        toggleClass: $_3sfngaz0jcg9mdhj.resolve('format-matches'),
        selected: selected
      },
      itemBehaviours: $_bb1w99w3jcg9md7v.derive(isMenu ? [] : [$_1n9vh6yzjcg9mdhf.format(value, function (comp, status) {
          var toggle = status ? Toggling.on : Toggling.off;
          toggle(comp);
        })]),
      components: [{
          dom: {
            tag: 'div',
            attributes: { style: preview },
            innerHtml: text
          }
        }]
    };
  };
  var makeMenu = function (value, items, memMenuThunk, collapsable) {
    return {
      value: value,
      dom: { tag: 'div' },
      components: [
        Button.sketch({
          dom: {
            tag: 'div',
            classes: [$_3sfngaz0jcg9mdhj.resolve('styles-collapser')]
          },
          components: collapsable ? [
            {
              dom: {
                tag: 'span',
                classes: [$_3sfngaz0jcg9mdhj.resolve('styles-collapse-icon')]
              }
            },
            $_6yv6bm12jjcg9mdxu.text(value)
          ] : [$_6yv6bm12jjcg9mdxu.text(value)],
          action: function (item) {
            if (collapsable) {
              var comp = memMenuThunk().get(item);
              TieredMenu.collapseMenu(comp);
            }
          }
        }),
        {
          dom: {
            tag: 'div',
            classes: [$_3sfngaz0jcg9mdhj.resolve('styles-menu-items-container')]
          },
          components: [Menu.parts().items({})],
          behaviours: $_bb1w99w3jcg9md7v.derive([$_7lwycj11rjcg9mdu2.config('adhoc-scrollable-menu', [
              $_v93nkw5jcg9md8g.runOnAttached(function (component, simulatedEvent) {
                $_bctu7wzrjcg9mdk0.set(component.element(), 'overflow-y', 'auto');
                $_bctu7wzrjcg9mdk0.set(component.element(), '-webkit-overflow-scrolling', 'touch');
                $_bg1a2213gjcg9me3k.register(component.element());
              }),
              $_v93nkw5jcg9md8g.runOnDetached(function (component) {
                $_bctu7wzrjcg9mdk0.remove(component.element(), 'overflow-y');
                $_bctu7wzrjcg9mdk0.remove(component.element(), '-webkit-overflow-scrolling');
                $_bg1a2213gjcg9me3k.deregister(component.element());
              })
            ])])
        }
      ],
      items: items,
      menuBehaviours: $_bb1w99w3jcg9md7v.derive([Transitioning.config({
          initialState: 'after',
          routes: Transitioning.createTristate('before', 'current', 'after', {
            transition: {
              property: 'transform',
              transitionClass: 'transitioning'
            }
          })
        })])
    };
  };
  var sketch$9 = function (settings) {
    var dataset = convert$1(settings.formats, function () {
      return memMenu;
    });
    var memMenu = $_1l0wx311djcg9mdsg.record(TieredMenu.sketch({
      dom: {
        tag: 'div',
        classes: [$_3sfngaz0jcg9mdhj.resolve('styles-menu')]
      },
      components: [],
      fakeFocus: true,
      stayInDom: true,
      onExecute: function (tmenu, item) {
        var v = me.getValue(item);
        settings.handle(item, v.value);
      },
      onEscape: function () {
      },
      onOpenMenu: function (container, menu) {
        var w = $_d38qpy116jcg9mdri.get(container.element());
        $_d38qpy116jcg9mdri.set(menu.element(), w);
        Transitioning.jumpTo(menu, 'current');
      },
      onOpenSubmenu: function (container, item, submenu) {
        var w = $_d38qpy116jcg9mdri.get(container.element());
        var menu = $_a6xsw6zljcg9mdjk.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
        var menuComp = container.getSystem().getByDom(menu).getOrDie();
        $_d38qpy116jcg9mdri.set(submenu.element(), w);
        Transitioning.progressTo(menuComp, 'before');
        Transitioning.jumpTo(submenu, 'after');
        Transitioning.progressTo(submenu, 'current');
      },
      onCollapseMenu: function (container, item, menu) {
        var submenu = $_a6xsw6zljcg9mdjk.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
        var submenuComp = container.getSystem().getByDom(submenu).getOrDie();
        Transitioning.progressTo(submenuComp, 'after');
        Transitioning.progressTo(menu, 'current');
      },
      navigateOnHover: false,
      openImmediately: true,
      data: dataset.tmenu,
      markers: {
        backgroundMenu: $_3sfngaz0jcg9mdhj.resolve('styles-background-menu'),
        menu: $_3sfngaz0jcg9mdhj.resolve('styles-menu'),
        selectedMenu: $_3sfngaz0jcg9mdhj.resolve('styles-selected-menu'),
        item: $_3sfngaz0jcg9mdhj.resolve('styles-item'),
        selectedItem: $_3sfngaz0jcg9mdhj.resolve('styles-selected-item')
      }
    }));
    return memMenu.asSpec();
  };
  var $_sk3zi12ejcg9mdws = { sketch: sketch$9 };

  var getFromExpandingItem = function (item) {
    var newItem = $_4xvhzgwxjcg9mdae.deepMerge($_1ohhokx5jcg9mdbm.exclude(item, ['items']), { menu: true });
    var rest = expand(item.items);
    var newMenus = $_4xvhzgwxjcg9mdae.deepMerge(rest.menus, $_1ohhokx5jcg9mdbm.wrap(item.title, rest.items));
    var newExpansions = $_4xvhzgwxjcg9mdae.deepMerge(rest.expansions, $_1ohhokx5jcg9mdbm.wrap(item.title, item.title));
    return {
      item: newItem,
      menus: newMenus,
      expansions: newExpansions
    };
  };
  var getFromItem = function (item) {
    return $_1ohhokx5jcg9mdbm.hasKey(item, 'items') ? getFromExpandingItem(item) : {
      item: item,
      menus: {},
      expansions: {}
    };
  };
  var expand = function (items) {
    return $_gcfqi6w8jcg9md8v.foldr(items, function (acc, item) {
      var newData = getFromItem(item);
      return {
        menus: $_4xvhzgwxjcg9mdae.deepMerge(acc.menus, newData.menus),
        items: [newData.item].concat(acc.items),
        expansions: $_4xvhzgwxjcg9mdae.deepMerge(acc.expansions, newData.expansions)
      };
    }, {
      menus: {},
      expansions: {},
      items: []
    });
  };
  var $_102sda13hjcg9me3n = { expand: expand };

  var register = function (editor, settings) {
    var isSelectedFor = function (format) {
      return function () {
        return editor.formatter.match(format);
      };
    };
    var getPreview = function (format) {
      return function () {
        var styles = editor.formatter.getCssText(format);
        return styles;
      };
    };
    var enrichSupported = function (item) {
      return $_4xvhzgwxjcg9mdae.deepMerge(item, {
        isSelected: isSelectedFor(item.format),
        getPreview: getPreview(item.format)
      });
    };
    var enrichMenu = function (item) {
      return $_4xvhzgwxjcg9mdae.deepMerge(item, {
        isSelected: $_7bfl0mwajcg9md92.constant(false),
        getPreview: $_7bfl0mwajcg9md92.constant('')
      });
    };
    var enrichCustom = function (item) {
      var formatName = $_7upt5710fjcg9mdne.generate(item.title);
      var newItem = $_4xvhzgwxjcg9mdae.deepMerge(item, {
        format: formatName,
        isSelected: isSelectedFor(formatName),
        getPreview: getPreview(formatName)
      });
      editor.formatter.register(formatName, newItem);
      return newItem;
    };
    var formats = $_1ohhokx5jcg9mdbm.readOptFrom(settings, 'style_formats').getOr(DefaultStyleFormats);
    var doEnrich = function (items) {
      return $_gcfqi6w8jcg9md8v.map(items, function (item) {
        if ($_1ohhokx5jcg9mdbm.hasKey(item, 'items')) {
          var newItems = doEnrich(item.items);
          return $_4xvhzgwxjcg9mdae.deepMerge(enrichMenu(item), { items: newItems });
        } else if ($_1ohhokx5jcg9mdbm.hasKey(item, 'format')) {
          return enrichSupported(item);
        } else {
          return enrichCustom(item);
        }
      });
    };
    return doEnrich(formats);
  };
  var prune = function (editor, formats) {
    var doPrune = function (items) {
      return $_gcfqi6w8jcg9md8v.bind(items, function (item) {
        if (item.items !== undefined) {
          var newItems = doPrune(item.items);
          return newItems.length > 0 ? [item] : [];
        } else {
          var keep = $_1ohhokx5jcg9mdbm.hasKey(item, 'format') ? editor.formatter.canApply(item.format) : true;
          return keep ? [item] : [];
        }
      });
    };
    var prunedItems = doPrune(formats);
    return $_102sda13hjcg9me3n.expand(prunedItems);
  };
  var ui = function (editor, formats, onDone) {
    var pruned = prune(editor, formats);
    return $_sk3zi12ejcg9mdws.sketch({
      formats: pruned,
      handle: function (item, value) {
        editor.undoManager.transact(function () {
          if (Toggling.isOn(item)) {
            editor.formatter.remove(value);
          } else {
            editor.formatter.apply(value);
          }
        });
        onDone();
      }
    });
  };
  var $_8hddzz12cjcg9mdwk = {
    register: register,
    ui: ui
  };

  var defaults = [
    'undo',
    'bold',
    'italic',
    'link',
    'image',
    'bullist',
    'styleselect'
  ];
  var extract$1 = function (rawToolbar) {
    var toolbar = rawToolbar.replace(/\|/g, ' ').trim();
    return toolbar.length > 0 ? toolbar.split(/\s+/) : [];
  };
  var identifyFromArray = function (toolbar) {
    return $_gcfqi6w8jcg9md8v.bind(toolbar, function (item) {
      return $_dkt1fwyjcg9mdaf.isArray(item) ? identifyFromArray(item) : extract$1(item);
    });
  };
  var identify = function (settings) {
    var toolbar = settings.toolbar !== undefined ? settings.toolbar : defaults;
    return $_dkt1fwyjcg9mdaf.isArray(toolbar) ? identifyFromArray(toolbar) : extract$1(toolbar);
  };
  var setup = function (realm, editor) {
    var commandSketch = function (name) {
      return function () {
        return $_fwn33tz1jcg9mdhl.forToolbarCommand(editor, name);
      };
    };
    var stateCommandSketch = function (name) {
      return function () {
        return $_fwn33tz1jcg9mdhl.forToolbarStateCommand(editor, name);
      };
    };
    var actionSketch = function (name, query, action) {
      return function () {
        return $_fwn33tz1jcg9mdhl.forToolbarStateAction(editor, name, query, action);
      };
    };
    var undo = commandSketch('undo');
    var redo = commandSketch('redo');
    var bold = stateCommandSketch('bold');
    var italic = stateCommandSketch('italic');
    var underline = stateCommandSketch('underline');
    var removeformat = commandSketch('removeformat');
    var link = function () {
      return $_bf81ke11njcg9mdt6.sketch(realm, editor);
    };
    var unlink = actionSketch('unlink', 'link', function () {
      editor.execCommand('unlink', null, false);
    });
    var image = function () {
      return $_7offtj11cjcg9mds8.sketch(editor);
    };
    var bullist = actionSketch('unordered-list', 'ul', function () {
      editor.execCommand('InsertUnorderedList', null, false);
    });
    var numlist = actionSketch('ordered-list', 'ol', function () {
      editor.execCommand('InsertOrderedList', null, false);
    });
    var fontsizeselect = function () {
      return $_eyiiwg118jcg9mdrl.sketch(realm, editor);
    };
    var forecolor = function () {
      return $_g7v1nf10rjcg9mdpq.sketch(realm, editor);
    };
    var styleFormats = $_8hddzz12cjcg9mdwk.register(editor, editor.settings);
    var styleFormatsMenu = function () {
      return $_8hddzz12cjcg9mdwk.ui(editor, styleFormats, function () {
        editor.fire('scrollIntoView');
      });
    };
    var styleselect = function () {
      return $_fwn33tz1jcg9mdhl.forToolbar('style-formats', function (button) {
        editor.fire('toReading');
        realm.dropup().appear(styleFormatsMenu, Toggling.on, button);
      }, $_bb1w99w3jcg9md7v.derive([
        Toggling.config({
          toggleClass: $_3sfngaz0jcg9mdhj.resolve('toolbar-button-selected'),
          toggleOnExecute: false,
          aria: { mode: 'pressed' }
        }),
        Receiving.config({
          channels: $_1ohhokx5jcg9mdbm.wrapAll([
            $_1n9vh6yzjcg9mdhf.receive($_g1ca6bynjcg9mdfu.orientationChanged(), Toggling.off),
            $_1n9vh6yzjcg9mdhf.receive($_g1ca6bynjcg9mdfu.dropupDismissed(), Toggling.off)
          ])
        })
      ]));
    };
    var feature = function (prereq, sketch) {
      return {
        isSupported: function () {
          return prereq.forall(function (p) {
            return $_1ohhokx5jcg9mdbm.hasKey(editor.buttons, p);
          });
        },
        sketch: sketch
      };
    };
    return {
      undo: feature($_gb5srhw9jcg9md90.none(), undo),
      redo: feature($_gb5srhw9jcg9md90.none(), redo),
      bold: feature($_gb5srhw9jcg9md90.none(), bold),
      italic: feature($_gb5srhw9jcg9md90.none(), italic),
      underline: feature($_gb5srhw9jcg9md90.none(), underline),
      removeformat: feature($_gb5srhw9jcg9md90.none(), removeformat),
      link: feature($_gb5srhw9jcg9md90.none(), link),
      unlink: feature($_gb5srhw9jcg9md90.none(), unlink),
      image: feature($_gb5srhw9jcg9md90.none(), image),
      bullist: feature($_gb5srhw9jcg9md90.some('bullist'), bullist),
      numlist: feature($_gb5srhw9jcg9md90.some('numlist'), numlist),
      fontsizeselect: feature($_gb5srhw9jcg9md90.none(), fontsizeselect),
      forecolor: feature($_gb5srhw9jcg9md90.none(), forecolor),
      styleselect: feature($_gb5srhw9jcg9md90.none(), styleselect)
    };
  };
  var detect$4 = function (settings, features) {
    var itemNames = identify(settings);
    var present = {};
    return $_gcfqi6w8jcg9md8v.bind(itemNames, function (iName) {
      var r = !$_1ohhokx5jcg9mdbm.hasKey(present, iName) && $_1ohhokx5jcg9mdbm.hasKey(features, iName) && features[iName].isSupported() ? [features[iName].sketch()] : [];
      present[iName] = true;
      return r;
    });
  };
  var $_3cxd3lyojcg9mdfw = {
    identify: identify,
    setup: setup,
    detect: detect$4
  };

  var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
    return {
      'target': $_7bfl0mwajcg9md92.constant(target),
      'x': $_7bfl0mwajcg9md92.constant(x),
      'y': $_7bfl0mwajcg9md92.constant(y),
      'stop': stop,
      'prevent': prevent,
      'kill': kill,
      'raw': $_7bfl0mwajcg9md92.constant(raw)
    };
  };
  var handle = function (filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent))
        return;
      var target = $_41aqpdwsjcg9md9w.fromDom(rawEvent.target);
      var stop = function () {
        rawEvent.stopPropagation();
      };
      var prevent = function () {
        rawEvent.preventDefault();
      };
      var kill = $_7bfl0mwajcg9md92.compose(prevent, stop);
      var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
      handler(evt);
    };
  };
  var binder = function (element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: $_7bfl0mwajcg9md92.curry(unbind, element, event, wrapped, useCapture) };
  };
  var bind$2 = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, false);
  };
  var capture$1 = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, true);
  };
  var unbind = function (element, event, handler, useCapture) {
    element.dom().removeEventListener(event, handler, useCapture);
  };
  var $_fig8an13kjcg9me3z = {
    bind: bind$2,
    capture: capture$1
  };

  var filter$1 = $_7bfl0mwajcg9md92.constant(true);
  var bind$1 = function (element, event, handler) {
    return $_fig8an13kjcg9me3z.bind(element, event, filter$1, handler);
  };
  var capture = function (element, event, handler) {
    return $_fig8an13kjcg9me3z.capture(element, event, filter$1, handler);
  };
  var $_decepq13jjcg9me3x = {
    bind: bind$1,
    capture: capture
  };

  var INTERVAL = 50;
  var INSURANCE = 1000 / INTERVAL;
  var get$11 = function (outerWindow) {
    var isPortrait = outerWindow.matchMedia('(orientation: portrait)').matches;
    return { isPortrait: $_7bfl0mwajcg9md92.constant(isPortrait) };
  };
  var getActualWidth = function (outerWindow) {
    var isIos = $_37ytsswfjcg9md9a.detect().os.isiOS();
    var isPortrait = get$11(outerWindow).isPortrait();
    return isIos && !isPortrait ? outerWindow.screen.height : outerWindow.screen.width;
  };
  var onChange = function (outerWindow, listeners) {
    var win = $_41aqpdwsjcg9md9w.fromDom(outerWindow);
    var poller = null;
    var change = function () {
      clearInterval(poller);
      var orientation = get$11(outerWindow);
      listeners.onChange(orientation);
      onAdjustment(function () {
        listeners.onReady(orientation);
      });
    };
    var orientationHandle = $_decepq13jjcg9me3x.bind(win, 'orientationchange', change);
    var onAdjustment = function (f) {
      clearInterval(poller);
      var flag = outerWindow.innerHeight;
      var insurance = 0;
      poller = setInterval(function () {
        if (flag !== outerWindow.innerHeight) {
          clearInterval(poller);
          f($_gb5srhw9jcg9md90.some(outerWindow.innerHeight));
        } else if (insurance > INSURANCE) {
          clearInterval(poller);
          f($_gb5srhw9jcg9md90.none());
        }
        insurance++;
      }, INTERVAL);
    };
    var destroy = function () {
      orientationHandle.unbind();
    };
    return {
      onAdjustment: onAdjustment,
      destroy: destroy
    };
  };
  var $_4u2xx713ijcg9me3r = {
    get: get$11,
    onChange: onChange,
    getActualWidth: getActualWidth
  };

  var DelayedFunction = function (fun, delay) {
    var ref = null;
    var schedule = function () {
      var args = arguments;
      ref = setTimeout(function () {
        fun.apply(null, args);
        ref = null;
      }, delay);
    };
    var cancel = function () {
      if (ref !== null) {
        clearTimeout(ref);
        ref = null;
      }
    };
    return {
      cancel: cancel,
      schedule: schedule
    };
  };

  var SIGNIFICANT_MOVE = 5;
  var LONGPRESS_DELAY = 400;
  var getTouch = function (event) {
    if (event.raw().touches === undefined || event.raw().touches.length !== 1)
      return $_gb5srhw9jcg9md90.none();
    return $_gb5srhw9jcg9md90.some(event.raw().touches[0]);
  };
  var isFarEnough = function (touch, data) {
    var distX = Math.abs(touch.clientX - data.x());
    var distY = Math.abs(touch.clientY - data.y());
    return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
  };
  var monitor$1 = function (settings) {
    var startData = Cell($_gb5srhw9jcg9md90.none());
    var longpress = DelayedFunction(function (event) {
      startData.set($_gb5srhw9jcg9md90.none());
      settings.triggerEvent($_fvndowvjcg9mda7.longpress(), event);
    }, LONGPRESS_DELAY);
    var handleTouchstart = function (event) {
      getTouch(event).each(function (touch) {
        longpress.cancel();
        var data = {
          x: $_7bfl0mwajcg9md92.constant(touch.clientX),
          y: $_7bfl0mwajcg9md92.constant(touch.clientY),
          target: event.target
        };
        longpress.schedule(data);
        startData.set($_gb5srhw9jcg9md90.some(data));
      });
      return $_gb5srhw9jcg9md90.none();
    };
    var handleTouchmove = function (event) {
      longpress.cancel();
      getTouch(event).each(function (touch) {
        startData.get().each(function (data) {
          if (isFarEnough(touch, data))
            startData.set($_gb5srhw9jcg9md90.none());
        });
      });
      return $_gb5srhw9jcg9md90.none();
    };
    var handleTouchend = function (event) {
      longpress.cancel();
      var isSame = function (data) {
        return $_9sx28sw7jcg9md8n.eq(data.target(), event.target());
      };
      return startData.get().filter(isSame).map(function (data) {
        return settings.triggerEvent($_fvndowvjcg9mda7.tap(), event);
      });
    };
    var handlers = $_1ohhokx5jcg9mdbm.wrapAll([
      {
        key: $_f4bxsewwjcg9mdab.touchstart(),
        value: handleTouchstart
      },
      {
        key: $_f4bxsewwjcg9mdab.touchmove(),
        value: handleTouchmove
      },
      {
        key: $_f4bxsewwjcg9mdab.touchend(),
        value: handleTouchend
      }
    ]);
    var fireIfReady = function (event, type) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(handlers, type).bind(function (handler) {
        return handler(event);
      });
    };
    return { fireIfReady: fireIfReady };
  };
  var $_7slii113qjcg9me4t = { monitor: monitor$1 };

  var monitor = function (editorApi) {
    var tapEvent = $_7slii113qjcg9me4t.monitor({
      triggerEvent: function (type, evt) {
        editorApi.onTapContent(evt);
      }
    });
    var onTouchend = function () {
      return $_decepq13jjcg9me3x.bind(editorApi.body(), 'touchend', function (evt) {
        tapEvent.fireIfReady(evt, 'touchend');
      });
    };
    var onTouchmove = function () {
      return $_decepq13jjcg9me3x.bind(editorApi.body(), 'touchmove', function (evt) {
        tapEvent.fireIfReady(evt, 'touchmove');
      });
    };
    var fireTouchstart = function (evt) {
      tapEvent.fireIfReady(evt, 'touchstart');
    };
    return {
      fireTouchstart: fireTouchstart,
      onTouchend: onTouchend,
      onTouchmove: onTouchmove
    };
  };
  var $_erpoze13pjcg9me4o = { monitor: monitor };

  var isAndroid6 = $_37ytsswfjcg9md9a.detect().os.version.major >= 6;
  var initEvents = function (editorApi, toolstrip, alloy) {
    var tapping = $_erpoze13pjcg9me4o.monitor(editorApi);
    var outerDoc = $_1lxhd4y2jcg9mdeh.owner(toolstrip);
    var isRanged = function (sel) {
      return !$_9sx28sw7jcg9md8n.eq(sel.start(), sel.finish()) || sel.soffset() !== sel.foffset();
    };
    var hasRangeInUi = function () {
      return $_g6scf1yfjcg9mdfg.active(outerDoc).filter(function (input) {
        return $_97hwf5xwjcg9mddy.name(input) === 'input';
      }).exists(function (input) {
        return input.dom().selectionStart !== input.dom().selectionEnd;
      });
    };
    var updateMargin = function () {
      var rangeInContent = editorApi.doc().dom().hasFocus() && editorApi.getSelection().exists(isRanged);
      alloy.getByDom(toolstrip).each((rangeInContent || hasRangeInUi()) === true ? Toggling.on : Toggling.off);
    };
    var listeners = [
      $_decepq13jjcg9me3x.bind(editorApi.body(), 'touchstart', function (evt) {
        editorApi.onTouchContent();
        tapping.fireTouchstart(evt);
      }),
      tapping.onTouchmove(),
      tapping.onTouchend(),
      $_decepq13jjcg9me3x.bind(toolstrip, 'touchstart', function (evt) {
        editorApi.onTouchToolstrip();
      }),
      editorApi.onToReading(function () {
        $_g6scf1yfjcg9mdfg.blur(editorApi.body());
      }),
      editorApi.onToEditing($_7bfl0mwajcg9md92.noop),
      editorApi.onScrollToCursor(function (tinyEvent) {
        tinyEvent.preventDefault();
        editorApi.getCursorBox().each(function (bounds) {
          var cWin = editorApi.win();
          var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
          var cScrollBy = isOutside ? bounds.bottom() - cWin.innerHeight + 50 : 0;
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      })
    ].concat(isAndroid6 === true ? [] : [
      $_decepq13jjcg9me3x.bind($_41aqpdwsjcg9md9w.fromDom(editorApi.win()), 'blur', function () {
        alloy.getByDom(toolstrip).each(Toggling.off);
      }),
      $_decepq13jjcg9me3x.bind(outerDoc, 'select', updateMargin),
      $_decepq13jjcg9me3x.bind(editorApi.doc(), 'selectionchange', updateMargin)
    ]);
    var destroy = function () {
      $_gcfqi6w8jcg9md8v.each(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var $_4vciy913ojcg9me4e = { initEvents: initEvents };

  var autocompleteHack = function () {
    return function (f) {
      setTimeout(function () {
        f();
      }, 0);
    };
  };
  var resume = function (cWin) {
    cWin.focus();
    var iBody = $_41aqpdwsjcg9md9w.fromDom(cWin.document.body);
    var inInput = $_g6scf1yfjcg9mdfg.active().exists(function (elem) {
      return $_gcfqi6w8jcg9md8v.contains([
        'input',
        'textarea'
      ], $_97hwf5xwjcg9mddy.name(elem));
    });
    var transaction = inInput ? autocompleteHack() : $_7bfl0mwajcg9md92.apply;
    transaction(function () {
      $_g6scf1yfjcg9mdfg.active().each($_g6scf1yfjcg9mdfg.blur);
      $_g6scf1yfjcg9mdfg.focus(iBody);
    });
  };
  var $_f47e3f13tjcg9me5a = { resume: resume };

  var safeParse = function (element, attribute) {
    var parsed = parseInt($_ectfz6xvjcg9mddu.get(element, attribute), 10);
    return isNaN(parsed) ? 0 : parsed;
  };
  var $_dyzzx213ujcg9me5j = { safeParse: safeParse };

  var NodeValue = function (is, name) {
    var get = function (element) {
      if (!is(element))
        throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
      return getOption(element).getOr('');
    };
    var getOptionIE10 = function (element) {
      try {
        return getOptionSafe(element);
      } catch (e) {
        return $_gb5srhw9jcg9md90.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? $_gb5srhw9jcg9md90.from(element.dom().nodeValue) : $_gb5srhw9jcg9md90.none();
    };
    var browser = $_37ytsswfjcg9md9a.detect().browser;
    var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe;
    var set = function (element, value) {
      if (!is(element))
        throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
      element.dom().nodeValue = value;
    };
    return {
      get: get,
      getOption: getOption,
      set: set
    };
  };

  var api$3 = NodeValue($_97hwf5xwjcg9mddy.isText, 'text');
  var get$12 = function (element) {
    return api$3.get(element);
  };
  var getOption = function (element) {
    return api$3.getOption(element);
  };
  var set$8 = function (element, value) {
    api$3.set(element, value);
  };
  var $_i793613xjcg9me5v = {
    get: get$12,
    getOption: getOption,
    set: set$8
  };

  var getEnd = function (element) {
    return $_97hwf5xwjcg9mddy.name(element) === 'img' ? 1 : $_i793613xjcg9me5v.getOption(element).fold(function () {
      return $_1lxhd4y2jcg9mdeh.children(element).length;
    }, function (v) {
      return v.length;
    });
  };
  var isEnd = function (element, offset) {
    return getEnd(element) === offset;
  };
  var isStart = function (element, offset) {
    return offset === 0;
  };
  var NBSP = '\xA0';
  var isTextNodeWithCursorPosition = function (el) {
    return $_i793613xjcg9me5v.getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = [
    'img',
    'br'
  ];
  var isCursorPosition = function (elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || $_gcfqi6w8jcg9md8v.contains(elementsWithCursorPosition, $_97hwf5xwjcg9mddy.name(elem));
  };
  var $_evglqg13wjcg9me5s = {
    getEnd: getEnd,
    isEnd: isEnd,
    isStart: isStart,
    isCursorPosition: isCursorPosition
  };

  var adt$4 = $_4xy8cmx3jcg9mdb7.generate([
    { 'before': ['element'] },
    {
      'on': [
        'element',
        'offset'
      ]
    },
    { after: ['element'] }
  ]);
  var cata = function (subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart$1 = function (situ) {
    return situ.fold($_7bfl0mwajcg9md92.identity, $_7bfl0mwajcg9md92.identity, $_7bfl0mwajcg9md92.identity);
  };
  var $_7am70e140jcg9me63 = {
    before: adt$4.before,
    on: adt$4.on,
    after: adt$4.after,
    cata: cata,
    getStart: getStart$1
  };

  var type$1 = $_4xy8cmx3jcg9mdb7.generate([
    { domRange: ['rng'] },
    {
      relative: [
        'startSitu',
        'finishSitu'
      ]
    },
    {
      exact: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var range$1 = $_ahnnvkxljcg9mddc.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$1.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_41aqpdwsjcg9md9w.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_7am70e140jcg9me63.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart(selection);
    return $_1lxhd4y2jcg9mdeh.defaultView(start);
  };
  var $_90umih13zjcg9me60 = {
    domRange: type$1.domRange,
    relative: type$1.relative,
    exact: type$1.exact,
    exactFromRange: exactFromRange,
    range: range$1,
    getWin: getWin
  };

  var makeRange = function (start, soffset, finish, foffset) {
    var doc = $_1lxhd4y2jcg9mdeh.owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var commonAncestorContainer = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    return $_41aqpdwsjcg9md9w.fromDom(r.commonAncestorContainer);
  };
  var after$2 = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = $_9sx28sw7jcg9md8n.eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };
  var $_coo113142jcg9me6a = {
    after: after$2,
    commonAncestorContainer: commonAncestorContainer
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_gcfqi6w8jcg9md8v.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_41aqpdwsjcg9md9w.fromDom(fragment);
  };
  var $_8ojead143jcg9me6b = { fromElements: fromElements };

  var selectNodeContents = function (win, element) {
    var rng = win.document.createRange();
    selectNodeContentsUsing(rng, element);
    return rng;
  };
  var selectNodeContentsUsing = function (rng, element) {
    rng.selectNodeContents(element.dom());
  };
  var isWithin = function (outerRange, innerRange) {
    return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 && innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
  };
  var create$5 = function (win) {
    return win.document.createRange();
  };
  var setStart = function (rng, situ) {
    situ.fold(function (e) {
      rng.setStartBefore(e.dom());
    }, function (e, o) {
      rng.setStart(e.dom(), o);
    }, function (e) {
      rng.setStartAfter(e.dom());
    });
  };
  var setFinish = function (rng, situ) {
    situ.fold(function (e) {
      rng.setEndBefore(e.dom());
    }, function (e, o) {
      rng.setEnd(e.dom(), o);
    }, function (e) {
      rng.setEndAfter(e.dom());
    });
  };
  var replaceWith = function (rng, fragment) {
    deleteContents(rng);
    rng.insertNode(fragment.dom());
  };
  var relativeToNative = function (win, startSitu, finishSitu) {
    var range = win.document.createRange();
    setStart(range, startSitu);
    setFinish(range, finishSitu);
    return range;
  };
  var exactToNative = function (win, start, soffset, finish, foffset) {
    var rng = win.document.createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var deleteContents = function (rng) {
    rng.deleteContents();
  };
  var cloneFragment = function (rng) {
    var fragment = rng.cloneContents();
    return $_41aqpdwsjcg9md9w.fromDom(fragment);
  };
  var toRect$1 = function (rect) {
    return {
      left: $_7bfl0mwajcg9md92.constant(rect.left),
      top: $_7bfl0mwajcg9md92.constant(rect.top),
      right: $_7bfl0mwajcg9md92.constant(rect.right),
      bottom: $_7bfl0mwajcg9md92.constant(rect.bottom),
      width: $_7bfl0mwajcg9md92.constant(rect.width),
      height: $_7bfl0mwajcg9md92.constant(rect.height)
    };
  };
  var getFirstRect$1 = function (rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_gb5srhw9jcg9md90.some(rect).map(toRect$1) : $_gb5srhw9jcg9md90.none();
  };
  var getBounds$2 = function (rng) {
    var rect = rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_gb5srhw9jcg9md90.some(rect).map(toRect$1) : $_gb5srhw9jcg9md90.none();
  };
  var toString$1 = function (rng) {
    return rng.toString();
  };
  var $_c5gkw6144jcg9me6g = {
    create: create$5,
    replaceWith: replaceWith,
    selectNodeContents: selectNodeContents,
    selectNodeContentsUsing: selectNodeContentsUsing,
    relativeToNative: relativeToNative,
    exactToNative: exactToNative,
    deleteContents: deleteContents,
    cloneFragment: cloneFragment,
    getFirstRect: getFirstRect$1,
    getBounds: getBounds$2,
    isWithin: isWithin,
    toString: toString$1
  };

  var adt$5 = $_4xy8cmx3jcg9mdb7.generate([
    {
      ltr: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    },
    {
      rtl: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var fromRange = function (win, type, range) {
    return type($_41aqpdwsjcg9md9w.fromDom(range.startContainer), range.startOffset, $_41aqpdwsjcg9md9w.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function (win, selection) {
    return selection.match({
      domRange: function (rng) {
        return {
          ltr: $_7bfl0mwajcg9md92.constant(rng),
          rtl: $_gb5srhw9jcg9md90.none
        };
      },
      relative: function (startSitu, finishSitu) {
        return {
          ltr: $_apalrswgjcg9md9b.cached(function () {
            return $_c5gkw6144jcg9me6g.relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: $_apalrswgjcg9md9b.cached(function () {
            return $_gb5srhw9jcg9md90.some($_c5gkw6144jcg9me6g.relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function (start, soffset, finish, foffset) {
        return {
          ltr: $_apalrswgjcg9md9b.cached(function () {
            return $_c5gkw6144jcg9me6g.exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: $_apalrswgjcg9md9b.cached(function () {
            return $_gb5srhw9jcg9md90.some($_c5gkw6144jcg9me6g.exactToNative(win, finish, foffset, start, soffset));
          })
        };
      }
    });
  };
  var doDiagnose = function (win, ranges) {
    var rng = ranges.ltr();
    if (rng.collapsed) {
      var reversed = ranges.rtl().filter(function (rev) {
        return rev.collapsed === false;
      });
      return reversed.map(function (rev) {
        return adt$5.rtl($_41aqpdwsjcg9md9w.fromDom(rev.endContainer), rev.endOffset, $_41aqpdwsjcg9md9w.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$5.ltr, rng);
      });
    } else {
      return fromRange(win, adt$5.ltr, rng);
    }
  };
  var diagnose = function (win, selection) {
    var ranges = getRanges(win, selection);
    return doDiagnose(win, ranges);
  };
  var asLtrRange = function (win, selection) {
    var diagnosis = diagnose(win, selection);
    return diagnosis.match({
      ltr: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
      },
      rtl: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(finish.dom(), foffset);
        rng.setEnd(start.dom(), soffset);
        return rng;
      }
    });
  };
  var $_5n328f145jcg9me6l = {
    ltr: adt$5.ltr,
    rtl: adt$5.rtl,
    diagnose: diagnose,
    asLtrRange: asLtrRange
  };

  var searchForPoint = function (rectForOffset, x, y, maxX, length) {
    if (length === 0)
      return 0;
    else if (x === maxX)
      return length - 1;
    var xDelta = maxX;
    for (var i = 1; i < length; i++) {
      var rect = rectForOffset(i);
      var curDeltaX = Math.abs(x - rect.left);
      if (y > rect.bottom) {
      } else if (y < rect.top || curDeltaX > xDelta) {
        return i - 1;
      } else {
        xDelta = curDeltaX;
      }
    }
    return 0;
  };
  var inRect = function (rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  var $_fwqwos148jcg9me6x = {
    inRect: inRect,
    searchForPoint: searchForPoint
  };

  var locateOffset = function (doc, textnode, x, y, rect) {
    var rangeForOffset = function (offset) {
      var r = doc.dom().createRange();
      r.setStart(textnode.dom(), offset);
      r.collapse(true);
      return r;
    };
    var rectForOffset = function (offset) {
      var r = rangeForOffset(offset);
      return r.getBoundingClientRect();
    };
    var length = $_i793613xjcg9me5v.get(textnode).length;
    var offset = $_fwqwos148jcg9me6x.searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate$2 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = $_6vwq8dydjcg9mdfe.findMap(rects, function (rect) {
      return $_fwqwos148jcg9me6x.inRect(rect, x, y) ? $_gb5srhw9jcg9md90.some(rect) : $_gb5srhw9jcg9md90.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };
  var $_65b3ul149jcg9me6z = { locate: locate$2 };

  var searchInChildren = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = $_1lxhd4y2jcg9mdeh.children(node);
    return $_6vwq8dydjcg9mdfe.findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return $_fwqwos148jcg9me6x.inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : $_gb5srhw9jcg9md90.none();
    });
  };
  var locateNode = function (doc, node, x, y) {
    var locator = $_97hwf5xwjcg9mddy.isText(node) ? $_65b3ul149jcg9me6z.locate : searchInChildren;
    return locator(doc, node, x, y);
  };
  var locate$1 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };
  var $_19l17d147jcg9me6u = { locate: locate$1 };

  var first$3 = function (element) {
    return $_2dj3ogyhjcg9mdfk.descendant(element, $_evglqg13wjcg9me5s.isCursorPosition);
  };
  var last$2 = function (element) {
    return descendantRtl(element, $_evglqg13wjcg9me5s.isCursorPosition);
  };
  var descendantRtl = function (scope, predicate) {
    var descend = function (element) {
      var children = $_1lxhd4y2jcg9mdeh.children(element);
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (predicate(child))
          return $_gb5srhw9jcg9md90.some(child);
        var res = descend(child);
        if (res.isSome())
          return res;
      }
      return $_gb5srhw9jcg9md90.none();
    };
    return descend(scope);
  };
  var $_2du4xn14bjcg9me74 = {
    first: first$3,
    last: last$2
  };

  var COLLAPSE_TO_LEFT = true;
  var COLLAPSE_TO_RIGHT = false;
  var getCollapseDirection = function (rect, x) {
    return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT;
  };
  var createCollapsedNode = function (doc, target, collapseDirection) {
    var r = doc.dom().createRange();
    r.selectNode(target.dom());
    r.collapse(collapseDirection);
    return r;
  };
  var locateInElement = function (doc, node, x) {
    var cursorRange = doc.dom().createRange();
    cursorRange.selectNode(node.dom());
    var rect = cursorRange.getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    var f = collapseDirection === COLLAPSE_TO_LEFT ? $_2du4xn14bjcg9me74.first : $_2du4xn14bjcg9me74.last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function (doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return $_gb5srhw9jcg9md90.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search$1 = function (doc, node, x) {
    var f = $_1lxhd4y2jcg9mdeh.children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };
  var $_ofzp014ajcg9me72 = { search: search$1 };

  var caretPositionFromPoint = function (doc, x, y) {
    return $_gb5srhw9jcg9md90.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null)
        return $_gb5srhw9jcg9md90.none();
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return $_gb5srhw9jcg9md90.some(r);
    });
  };
  var caretRangeFromPoint = function (doc, x, y) {
    return $_gb5srhw9jcg9md90.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return $_19l17d147jcg9me6u.locate(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function (doc, x, y) {
    return $_41aqpdwsjcg9md9w.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function () {
        return $_ofzp014ajcg9me72.search(doc, elem, x);
      };
      return $_1lxhd4y2jcg9mdeh.children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;
  var fromPoint$1 = function (win, x, y) {
    var doc = $_41aqpdwsjcg9md9w.fromDom(win.document);
    return availableSearch(doc, x, y).map(function (rng) {
      return $_90umih13zjcg9me60.range($_41aqpdwsjcg9md9w.fromDom(rng.startContainer), rng.startOffset, $_41aqpdwsjcg9md9w.fromDom(rng.endContainer), rng.endOffset);
    });
  };
  var $_ddwou6146jcg9me6r = { fromPoint: fromPoint$1 };

  var withinContainer = function (win, ancestor, outerRange, selector) {
    var innerRange = $_c5gkw6144jcg9me6g.create(win);
    var self = $_7jyciewrjcg9md9t.is(ancestor, selector) ? [ancestor] : [];
    var elements = self.concat($_fg27d6zjjcg9mdjg.descendants(ancestor, selector));
    return $_gcfqi6w8jcg9md8v.filter(elements, function (elem) {
      $_c5gkw6144jcg9me6g.selectNodeContentsUsing(innerRange, elem);
      return $_c5gkw6144jcg9me6g.isWithin(outerRange, innerRange);
    });
  };
  var find$4 = function (win, selection, selector) {
    var outerRange = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    var ancestor = $_41aqpdwsjcg9md9w.fromDom(outerRange.commonAncestorContainer);
    return $_97hwf5xwjcg9mddy.isElement(ancestor) ? withinContainer(win, ancestor, outerRange, selector) : [];
  };
  var $_52p1ee14cjcg9me77 = { find: find$4 };

  var beforeSpecial = function (element, offset) {
    var name = $_97hwf5xwjcg9mddy.name(element);
    if ('input' === name)
      return $_7am70e140jcg9me63.after(element);
    else if (!$_gcfqi6w8jcg9md8v.contains([
        'br',
        'img'
      ], name))
      return $_7am70e140jcg9me63.on(element, offset);
    else
      return offset === 0 ? $_7am70e140jcg9me63.before(element) : $_7am70e140jcg9me63.after(element);
  };
  var preprocessRelative = function (startSitu, finishSitu) {
    var start = startSitu.fold($_7am70e140jcg9me63.before, beforeSpecial, $_7am70e140jcg9me63.after);
    var finish = finishSitu.fold($_7am70e140jcg9me63.before, beforeSpecial, $_7am70e140jcg9me63.after);
    return $_90umih13zjcg9me60.relative(start, finish);
  };
  var preprocessExact = function (start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return $_90umih13zjcg9me60.relative(startSitu, finishSitu);
  };
  var preprocess = function (selection) {
    return selection.match({
      domRange: function (rng) {
        var start = $_41aqpdwsjcg9md9w.fromDom(rng.startContainer);
        var finish = $_41aqpdwsjcg9md9w.fromDom(rng.endContainer);
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset);
      },
      relative: preprocessRelative,
      exact: preprocessExact
    });
  };
  var $_4dqu6614djcg9me79 = {
    beforeSpecial: beforeSpecial,
    preprocess: preprocess,
    preprocessRelative: preprocessRelative,
    preprocessExact: preprocessExact
  };

  var doSetNativeRange = function (win, rng) {
    $_gb5srhw9jcg9md90.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function (win, start, soffset, finish, foffset) {
    var rng = $_c5gkw6144jcg9me6g.exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var findWithin = function (win, selection, selector) {
    return $_52p1ee14cjcg9me77.find(win, selection, selector);
  };
  var setRangeFromRelative = function (win, relative) {
    return $_5n328f145jcg9me6l.diagnose(win, relative).match({
      ltr: function (start, soffset, finish, foffset) {
        doSetRange(win, start, soffset, finish, foffset);
      },
      rtl: function (start, soffset, finish, foffset) {
        var selection = win.getSelection();
        if (selection.extend) {
          selection.collapse(start.dom(), soffset);
          selection.extend(finish.dom(), foffset);
        } else {
          doSetRange(win, finish, foffset, start, soffset);
        }
      }
    });
  };
  var setExact = function (win, start, soffset, finish, foffset) {
    var relative = $_4dqu6614djcg9me79.preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var setRelative = function (win, startSitu, finishSitu) {
    var relative = $_4dqu6614djcg9me79.preprocessRelative(startSitu, finishSitu);
    setRangeFromRelative(win, relative);
  };
  var toNative = function (selection) {
    var win = $_90umih13zjcg9me60.getWin(selection).dom();
    var getDomRange = function (start, soffset, finish, foffset) {
      return $_c5gkw6144jcg9me6g.exactToNative(win, start, soffset, finish, foffset);
    };
    var filtered = $_4dqu6614djcg9me79.preprocess(selection);
    return $_5n328f145jcg9me6l.diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    });
  };
  var readRange = function (selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return $_gb5srhw9jcg9md90.some($_90umih13zjcg9me60.range($_41aqpdwsjcg9md9w.fromDom(firstRng.startContainer), firstRng.startOffset, $_41aqpdwsjcg9md9w.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return $_gb5srhw9jcg9md90.none();
    }
  };
  var doGetExact = function (selection) {
    var anchorNode = $_41aqpdwsjcg9md9w.fromDom(selection.anchorNode);
    var focusNode = $_41aqpdwsjcg9md9w.fromDom(selection.focusNode);
    return $_coo113142jcg9me6a.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? $_gb5srhw9jcg9md90.some($_90umih13zjcg9me60.range($_41aqpdwsjcg9md9w.fromDom(selection.anchorNode), selection.anchorOffset, $_41aqpdwsjcg9md9w.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection);
  };
  var setToElement = function (win, element) {
    var rng = $_c5gkw6144jcg9me6g.selectNodeContents(win, element);
    doSetNativeRange(win, rng);
  };
  var forElement = function (win, element) {
    var rng = $_c5gkw6144jcg9me6g.selectNodeContents(win, element);
    return $_90umih13zjcg9me60.range($_41aqpdwsjcg9md9w.fromDom(rng.startContainer), rng.startOffset, $_41aqpdwsjcg9md9w.fromDom(rng.endContainer), rng.endOffset);
  };
  var getExact = function (win) {
    var selection = win.getSelection();
    return selection.rangeCount > 0 ? doGetExact(selection) : $_gb5srhw9jcg9md90.none();
  };
  var get$13 = function (win) {
    return getExact(win).map(function (range) {
      return $_90umih13zjcg9me60.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect = function (win, selection) {
    var rng = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    return $_c5gkw6144jcg9me6g.getFirstRect(rng);
  };
  var getBounds$1 = function (win, selection) {
    var rng = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    return $_c5gkw6144jcg9me6g.getBounds(rng);
  };
  var getAtPoint = function (win, x, y) {
    return $_ddwou6146jcg9me6r.fromPoint(win, x, y);
  };
  var getAsString = function (win, selection) {
    var rng = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    return $_c5gkw6144jcg9me6g.toString(rng);
  };
  var clear$1 = function (win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };
  var clone$3 = function (win, selection) {
    var rng = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    return $_c5gkw6144jcg9me6g.cloneFragment(rng);
  };
  var replace = function (win, selection, elements) {
    var rng = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    var fragment = $_8ojead143jcg9me6b.fromElements(elements, win.document);
    $_c5gkw6144jcg9me6g.replaceWith(rng, fragment);
  };
  var deleteAt = function (win, selection) {
    var rng = $_5n328f145jcg9me6l.asLtrRange(win, selection);
    $_c5gkw6144jcg9me6g.deleteContents(rng);
  };
  var isCollapsed = function (start, soffset, finish, foffset) {
    return $_9sx28sw7jcg9md8n.eq(start, finish) && soffset === foffset;
  };
  var $_fi4e0f141jcg9me67 = {
    setExact: setExact,
    getExact: getExact,
    get: get$13,
    setRelative: setRelative,
    toNative: toNative,
    setToElement: setToElement,
    clear: clear$1,
    clone: clone$3,
    replace: replace,
    deleteAt: deleteAt,
    forElement: forElement,
    getFirstRect: getFirstRect,
    getBounds: getBounds$1,
    getAtPoint: getAtPoint,
    findWithin: findWithin,
    getAsString: getAsString,
    isCollapsed: isCollapsed
  };

  var COLLAPSED_WIDTH = 2;
  var collapsedRect = function (rect) {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: $_7bfl0mwajcg9md92.constant(COLLAPSED_WIDTH),
      height: rect.height
    };
  };
  var toRect = function (rawRect) {
    return {
      left: $_7bfl0mwajcg9md92.constant(rawRect.left),
      top: $_7bfl0mwajcg9md92.constant(rawRect.top),
      right: $_7bfl0mwajcg9md92.constant(rawRect.right),
      bottom: $_7bfl0mwajcg9md92.constant(rawRect.bottom),
      width: $_7bfl0mwajcg9md92.constant(rawRect.width),
      height: $_7bfl0mwajcg9md92.constant(rawRect.height)
    };
  };
  var getRectsFromRange = function (range) {
    if (!range.collapsed) {
      return $_gcfqi6w8jcg9md8v.map(range.getClientRects(), toRect);
    } else {
      var start_1 = $_41aqpdwsjcg9md9w.fromDom(range.startContainer);
      return $_1lxhd4y2jcg9mdeh.parent(start_1).bind(function (parent) {
        var selection = $_90umih13zjcg9me60.exact(start_1, range.startOffset, parent, $_evglqg13wjcg9me5s.getEnd(parent));
        var optRect = $_fi4e0f141jcg9me67.getFirstRect(range.startContainer.ownerDocument.defaultView, selection);
        return optRect.map(collapsedRect).map($_gcfqi6w8jcg9md8v.pure);
      }).getOr([]);
    }
  };
  var getRectangles = function (cWin) {
    var sel = cWin.getSelection();
    return sel !== undefined && sel.rangeCount > 0 ? getRectsFromRange(sel.getRangeAt(0)) : [];
  };
  var $_e2ye6p13vjcg9me5l = { getRectangles: getRectangles };

  var EXTRA_SPACING = 50;
  var data = 'data-' + $_3sfngaz0jcg9mdhj.resolve('last-outer-height');
  var setLastHeight = function (cBody, value) {
    $_ectfz6xvjcg9mddu.set(cBody, data, value);
  };
  var getLastHeight = function (cBody) {
    return $_dyzzx213ujcg9me5j.safeParse(cBody, data);
  };
  var getBoundsFrom = function (rect) {
    return {
      top: $_7bfl0mwajcg9md92.constant(rect.top()),
      bottom: $_7bfl0mwajcg9md92.constant(rect.top() + rect.height())
    };
  };
  var getBounds = function (cWin) {
    var rects = $_e2ye6p13vjcg9me5l.getRectangles(cWin);
    return rects.length > 0 ? $_gb5srhw9jcg9md90.some(rects[0]).map(getBoundsFrom) : $_gb5srhw9jcg9md90.none();
  };
  var findDelta = function (outerWindow, cBody) {
    var last = getLastHeight(cBody);
    var current = outerWindow.innerHeight;
    return last > current ? $_gb5srhw9jcg9md90.some(last - current) : $_gb5srhw9jcg9md90.none();
  };
  var calculate = function (cWin, bounds, delta) {
    var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
    return isOutside ? Math.min(delta, bounds.bottom() - cWin.innerHeight + EXTRA_SPACING) : 0;
  };
  var setup$1 = function (outerWindow, cWin) {
    var cBody = $_41aqpdwsjcg9md9w.fromDom(cWin.document.body);
    var toEditing = function () {
      $_f47e3f13tjcg9me5a.resume(cWin);
    };
    var onResize = $_decepq13jjcg9me3x.bind($_41aqpdwsjcg9md9w.fromDom(outerWindow), 'resize', function () {
      findDelta(outerWindow, cBody).each(function (delta) {
        getBounds(cWin).each(function (bounds) {
          var cScrollBy = calculate(cWin, bounds, delta);
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      });
      setLastHeight(cBody, outerWindow.innerHeight);
    });
    setLastHeight(cBody, outerWindow.innerHeight);
    var destroy = function () {
      onResize.unbind();
    };
    return {
      toEditing: toEditing,
      destroy: destroy
    };
  };
  var $_fyutsa13sjcg9me53 = { setup: setup$1 };

  var getBodyFromFrame = function (frame) {
    return $_gb5srhw9jcg9md90.some($_41aqpdwsjcg9md9w.fromDom(frame.dom().contentWindow.document.body));
  };
  var getDocFromFrame = function (frame) {
    return $_gb5srhw9jcg9md90.some($_41aqpdwsjcg9md9w.fromDom(frame.dom().contentWindow.document));
  };
  var getWinFromFrame = function (frame) {
    return $_gb5srhw9jcg9md90.from(frame.dom().contentWindow);
  };
  var getSelectionFromFrame = function (frame) {
    var optWin = getWinFromFrame(frame);
    return optWin.bind($_fi4e0f141jcg9me67.getExact);
  };
  var getFrame = function (editor) {
    return editor.getFrame();
  };
  var getOrDerive = function (name, f) {
    return function (editor) {
      var g = editor[name].getOrThunk(function () {
        var frame = getFrame(editor);
        return function () {
          return f(frame);
        };
      });
      return g();
    };
  };
  var getOrListen = function (editor, doc, name, type) {
    return editor[name].getOrThunk(function () {
      return function (handler) {
        return $_decepq13jjcg9me3x.bind(doc, type, handler);
      };
    });
  };
  var toRect$2 = function (rect) {
    return {
      left: $_7bfl0mwajcg9md92.constant(rect.left),
      top: $_7bfl0mwajcg9md92.constant(rect.top),
      right: $_7bfl0mwajcg9md92.constant(rect.right),
      bottom: $_7bfl0mwajcg9md92.constant(rect.bottom),
      width: $_7bfl0mwajcg9md92.constant(rect.width),
      height: $_7bfl0mwajcg9md92.constant(rect.height)
    };
  };
  var getActiveApi = function (editor) {
    var frame = getFrame(editor);
    var tryFallbackBox = function (win) {
      var isCollapsed = function (sel) {
        return $_9sx28sw7jcg9md8n.eq(sel.start(), sel.finish()) && sel.soffset() === sel.foffset();
      };
      var toStartRect = function (sel) {
        var rect = sel.start().dom().getBoundingClientRect();
        return rect.width > 0 || rect.height > 0 ? $_gb5srhw9jcg9md90.some(rect).map(toRect$2) : $_gb5srhw9jcg9md90.none();
      };
      return $_fi4e0f141jcg9me67.getExact(win).filter(isCollapsed).bind(toStartRect);
    };
    return getBodyFromFrame(frame).bind(function (body) {
      return getDocFromFrame(frame).bind(function (doc) {
        return getWinFromFrame(frame).map(function (win) {
          var html = $_41aqpdwsjcg9md9w.fromDom(doc.dom().documentElement);
          var getCursorBox = editor.getCursorBox.getOrThunk(function () {
            return function () {
              return $_fi4e0f141jcg9me67.get(win).bind(function (sel) {
                return $_fi4e0f141jcg9me67.getFirstRect(win, sel).orThunk(function () {
                  return tryFallbackBox(win);
                });
              });
            };
          });
          var setSelection = editor.setSelection.getOrThunk(function () {
            return function (start, soffset, finish, foffset) {
              $_fi4e0f141jcg9me67.setExact(win, start, soffset, finish, foffset);
            };
          });
          var clearSelection = editor.clearSelection.getOrThunk(function () {
            return function () {
              $_fi4e0f141jcg9me67.clear(win);
            };
          });
          return {
            body: $_7bfl0mwajcg9md92.constant(body),
            doc: $_7bfl0mwajcg9md92.constant(doc),
            win: $_7bfl0mwajcg9md92.constant(win),
            html: $_7bfl0mwajcg9md92.constant(html),
            getSelection: $_7bfl0mwajcg9md92.curry(getSelectionFromFrame, frame),
            setSelection: setSelection,
            clearSelection: clearSelection,
            frame: $_7bfl0mwajcg9md92.constant(frame),
            onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
            onNodeChanged: getOrListen(editor, doc, 'onNodeChanged', 'selectionchange'),
            onDomChanged: editor.onDomChanged,
            onScrollToCursor: editor.onScrollToCursor,
            onScrollToElement: editor.onScrollToElement,
            onToReading: editor.onToReading,
            onToEditing: editor.onToEditing,
            onToolbarScrollStart: editor.onToolbarScrollStart,
            onTouchContent: editor.onTouchContent,
            onTapContent: editor.onTapContent,
            onTouchToolstrip: editor.onTouchToolstrip,
            getCursorBox: getCursorBox
          };
        });
      });
    });
  };
  var $_6cxiez14ejcg9me7d = {
    getBody: getOrDerive('getBody', getBodyFromFrame),
    getDoc: getOrDerive('getDoc', getDocFromFrame),
    getWin: getOrDerive('getWin', getWinFromFrame),
    getSelection: getOrDerive('getSelection', getSelectionFromFrame),
    getFrame: getFrame,
    getActiveApi: getActiveApi
  };

  var attr = 'data-ephox-mobile-fullscreen-style';
  var siblingStyles = 'display:none!important;';
  var ancestorPosition = 'position:absolute!important;';
  var ancestorStyles = 'top:0!important;left:0!important;margin:0' + '!important;padding:0!important;width:100%!important;';
  var bgFallback = 'background-color:rgb(255,255,255)!important;';
  var isAndroid = $_37ytsswfjcg9md9a.detect().os.isAndroid();
  var matchColor = function (editorBody) {
    var color = $_bctu7wzrjcg9mdk0.get(editorBody, 'background-color');
    return color !== undefined && color !== '' ? 'background-color:' + color + '!important' : bgFallback;
  };
  var clobberStyles = function (container, editorBody) {
    var gatherSibilings = function (element) {
      var siblings = $_fg27d6zjjcg9mdjg.siblings(element, '*');
      return siblings;
    };
    var clobber = function (clobberStyle) {
      return function (element) {
        var styles = $_ectfz6xvjcg9mddu.get(element, 'style');
        var backup = styles === undefined ? 'no-styles' : styles.trim();
        if (backup === clobberStyle) {
          return;
        } else {
          $_ectfz6xvjcg9mddu.set(element, attr, backup);
          $_ectfz6xvjcg9mddu.set(element, 'style', clobberStyle);
        }
      };
    };
    var ancestors = $_fg27d6zjjcg9mdjg.ancestors(container, '*');
    var siblings = $_gcfqi6w8jcg9md8v.bind(ancestors, gatherSibilings);
    var bgColor = matchColor(editorBody);
    $_gcfqi6w8jcg9md8v.each(siblings, clobber(siblingStyles));
    $_gcfqi6w8jcg9md8v.each(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
    var containerStyles = isAndroid === true ? '' : ancestorPosition;
    clobber(containerStyles + ancestorStyles + bgColor)(container);
  };
  var restoreStyles = function () {
    var clobberedEls = $_fg27d6zjjcg9mdjg.all('[' + attr + ']');
    $_gcfqi6w8jcg9md8v.each(clobberedEls, function (element) {
      var restore = $_ectfz6xvjcg9mddu.get(element, attr);
      if (restore !== 'no-styles') {
        $_ectfz6xvjcg9mddu.set(element, 'style', restore);
      } else {
        $_ectfz6xvjcg9mddu.remove(element, 'style');
      }
      $_ectfz6xvjcg9mddu.remove(element, attr);
    });
  };
  var $_7shz2014fjcg9me7k = {
    clobberStyles: clobberStyles,
    restoreStyles: restoreStyles
  };

  var tag = function () {
    var head = $_a6xsw6zljcg9mdjk.first('head').getOrDie();
    var nu = function () {
      var meta = $_41aqpdwsjcg9md9w.fromTag('meta');
      $_ectfz6xvjcg9mddu.set(meta, 'name', 'viewport');
      $_ghqowmy1jcg9mdef.append(head, meta);
      return meta;
    };
    var element = $_a6xsw6zljcg9mdjk.first('meta[name="viewport"]').getOrThunk(nu);
    var backup = $_ectfz6xvjcg9mddu.get(element, 'content');
    var maximize = function () {
      $_ectfz6xvjcg9mddu.set(element, 'content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
    };
    var restore = function () {
      if (backup !== undefined && backup !== null && backup.length > 0) {
        $_ectfz6xvjcg9mddu.set(element, 'content', backup);
      } else {
        $_ectfz6xvjcg9mddu.set(element, 'content', 'user-scalable=yes');
      }
    };
    return {
      maximize: maximize,
      restore: restore
    };
  };
  var $_9huvpt14gjcg9me7s = { tag: tag };

  var create$4 = function (platform, mask) {
    var meta = $_9huvpt14gjcg9me7s.tag();
    var androidApi = $_7psgdg129jcg9mdwe.api();
    var androidEvents = $_7psgdg129jcg9mdwe.api();
    var enter = function () {
      mask.hide();
      $_eb18ucxtjcg9mddr.add(platform.container, $_3sfngaz0jcg9mdhj.resolve('fullscreen-maximized'));
      $_eb18ucxtjcg9mddr.add(platform.container, $_3sfngaz0jcg9mdhj.resolve('android-maximized'));
      meta.maximize();
      $_eb18ucxtjcg9mddr.add(platform.body, $_3sfngaz0jcg9mdhj.resolve('android-scroll-reload'));
      androidApi.set($_fyutsa13sjcg9me53.setup(platform.win, $_6cxiez14ejcg9me7d.getWin(platform.editor).getOrDie('no')));
      $_6cxiez14ejcg9me7d.getActiveApi(platform.editor).each(function (editorApi) {
        $_7shz2014fjcg9me7k.clobberStyles(platform.container, editorApi.body());
        androidEvents.set($_4vciy913ojcg9me4e.initEvents(editorApi, platform.toolstrip, platform.alloy));
      });
    };
    var exit = function () {
      meta.restore();
      mask.show();
      $_eb18ucxtjcg9mddr.remove(platform.container, $_3sfngaz0jcg9mdhj.resolve('fullscreen-maximized'));
      $_eb18ucxtjcg9mddr.remove(platform.container, $_3sfngaz0jcg9mdhj.resolve('android-maximized'));
      $_7shz2014fjcg9me7k.restoreStyles();
      $_eb18ucxtjcg9mddr.remove(platform.body, $_3sfngaz0jcg9mdhj.resolve('android-scroll-reload'));
      androidEvents.clear();
      androidApi.clear();
    };
    return {
      enter: enter,
      exit: exit
    };
  };
  var $_406d2p13njcg9me4b = { create: create$4 };

  var MobileSchema = $_96sv3hxgjcg9mdco.objOf([
    $_5g6e15x1jcg9mdax.strictObjOf('editor', [
      $_5g6e15x1jcg9mdax.strict('getFrame'),
      $_5g6e15x1jcg9mdax.option('getBody'),
      $_5g6e15x1jcg9mdax.option('getDoc'),
      $_5g6e15x1jcg9mdax.option('getWin'),
      $_5g6e15x1jcg9mdax.option('getSelection'),
      $_5g6e15x1jcg9mdax.option('setSelection'),
      $_5g6e15x1jcg9mdax.option('clearSelection'),
      $_5g6e15x1jcg9mdax.option('cursorSaver'),
      $_5g6e15x1jcg9mdax.option('onKeyup'),
      $_5g6e15x1jcg9mdax.option('onNodeChanged'),
      $_5g6e15x1jcg9mdax.option('getCursorBox'),
      $_5g6e15x1jcg9mdax.strict('onDomChanged'),
      $_5g6e15x1jcg9mdax.defaulted('onTouchContent', $_7bfl0mwajcg9md92.noop),
      $_5g6e15x1jcg9mdax.defaulted('onTapContent', $_7bfl0mwajcg9md92.noop),
      $_5g6e15x1jcg9mdax.defaulted('onTouchToolstrip', $_7bfl0mwajcg9md92.noop),
      $_5g6e15x1jcg9mdax.defaulted('onScrollToCursor', $_7bfl0mwajcg9md92.constant({ unbind: $_7bfl0mwajcg9md92.noop })),
      $_5g6e15x1jcg9mdax.defaulted('onScrollToElement', $_7bfl0mwajcg9md92.constant({ unbind: $_7bfl0mwajcg9md92.noop })),
      $_5g6e15x1jcg9mdax.defaulted('onToEditing', $_7bfl0mwajcg9md92.constant({ unbind: $_7bfl0mwajcg9md92.noop })),
      $_5g6e15x1jcg9mdax.defaulted('onToReading', $_7bfl0mwajcg9md92.constant({ unbind: $_7bfl0mwajcg9md92.noop })),
      $_5g6e15x1jcg9mdax.defaulted('onToolbarScrollStart', $_7bfl0mwajcg9md92.identity)
    ]),
    $_5g6e15x1jcg9mdax.strict('socket'),
    $_5g6e15x1jcg9mdax.strict('toolstrip'),
    $_5g6e15x1jcg9mdax.strict('dropup'),
    $_5g6e15x1jcg9mdax.strict('toolbar'),
    $_5g6e15x1jcg9mdax.strict('container'),
    $_5g6e15x1jcg9mdax.strict('alloy'),
    $_5g6e15x1jcg9mdax.state('win', function (spec) {
      return $_1lxhd4y2jcg9mdeh.owner(spec.socket).dom().defaultView;
    }),
    $_5g6e15x1jcg9mdax.state('body', function (spec) {
      return $_41aqpdwsjcg9md9w.fromDom(spec.socket.dom().ownerDocument.body);
    }),
    $_5g6e15x1jcg9mdax.defaulted('translate', $_7bfl0mwajcg9md92.identity),
    $_5g6e15x1jcg9mdax.defaulted('setReadOnly', $_7bfl0mwajcg9md92.noop)
  ]);

  var adaptable = function (fn, rate) {
    var timer = null;
    var args = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        args = null;
      }
    };
    var throttle = function () {
      args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var first$4 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var last$3 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer !== null)
        clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
        timer = null;
        args = null;
      }, rate);
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var $_49m7ou14jjcg9me89 = {
    adaptable: adaptable,
    first: first$4,
    last: last$3
  };

  var sketch$10 = function (onView, translate) {
    var memIcon = $_1l0wx311djcg9mdsg.record(Container.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>'),
      containerBehaviours: $_bb1w99w3jcg9md7v.derive([Toggling.config({
          toggleClass: $_3sfngaz0jcg9mdhj.resolve('mask-tap-icon-selected'),
          toggleOnExecute: false
        })])
    }));
    var onViewThrottle = $_49m7ou14jjcg9me89.first(onView, 200);
    return Container.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-disabled-mask"></div>'),
      components: [Container.sketch({
          dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-content-container"></div>'),
          components: [Button.sketch({
              dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-content-tap-section"></div>'),
              components: [memIcon.asSpec()],
              action: function (button) {
                onViewThrottle.throttle();
              },
              buttonBehaviours: $_bb1w99w3jcg9md7v.derive([Toggling.config({ toggleClass: $_3sfngaz0jcg9mdhj.resolve('mask-tap-icon-selected') })])
            })]
        })]
    });
  };
  var $_fhgviv14ijcg9me83 = { sketch: sketch$10 };

  var produce = function (raw) {
    var mobile = $_96sv3hxgjcg9mdco.asRawOrDie('Getting AndroidWebapp schema', MobileSchema, raw);
    $_bctu7wzrjcg9mdk0.set(mobile.toolstrip, 'width', '100%');
    var onTap = function () {
      mobile.setReadOnly(true);
      mode.enter();
    };
    var mask = $_6yv6bm12jjcg9mdxu.build($_fhgviv14ijcg9me83.sketch(onTap, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function () {
        mobile.alloy.add(mask);
      },
      hide: function () {
        mobile.alloy.remove(mask);
      }
    };
    $_ghqowmy1jcg9mdef.append(mobile.container, mask.element());
    var mode = $_406d2p13njcg9me4b.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: $_7bfl0mwajcg9md92.noop,
      enter: mode.enter,
      exit: mode.exit,
      destroy: $_7bfl0mwajcg9md92.noop
    };
  };
  var $_5n43pg13mjcg9me45 = { produce: produce };

  var schema$14 = [
    $_5g6e15x1jcg9mdax.defaulted('shell', true),
    $_bu8gqd10cjcg9mdmw.field('toolbarBehaviours', [Replacing])
  ];
  var enhanceGroups = function (detail) {
    return { behaviours: $_bb1w99w3jcg9md7v.derive([Replacing.config({})]) };
  };
  var partTypes$1 = [$_b1jyxz10jjcg9mdo3.optional({
      name: 'groups',
      overrides: enhanceGroups
    })];
  var $_6lwnjb14mjcg9me8w = {
    name: $_7bfl0mwajcg9md92.constant('Toolbar'),
    schema: $_7bfl0mwajcg9md92.constant(schema$14),
    parts: $_7bfl0mwajcg9md92.constant(partTypes$1)
  };

  var factory$4 = function (detail, components, spec, _externals) {
    var setGroups = function (toolbar, groups) {
      getGroupContainer(toolbar).fold(function () {
        console.error('Toolbar was defined to not be a shell, but no groups container was specified in components');
        throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components');
      }, function (container) {
        Replacing.set(container, groups);
      });
    };
    var getGroupContainer = function (component) {
      return detail.shell() ? $_gb5srhw9jcg9md90.some(component) : $_dmikjr10hjcg9mdnl.getPart(component, detail, 'groups');
    };
    var extra = detail.shell() ? {
      behaviours: [Replacing.config({})],
      components: []
    } : {
      behaviours: [],
      components: components
    };
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: extra.components,
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive(extra.behaviours), $_bu8gqd10cjcg9mdmw.get(detail.toolbarBehaviours())),
      apis: { setGroups: setGroups },
      domModification: { attributes: { role: 'group' } }
    };
  };
  var Toolbar = $_55yzot10djcg9mdn2.composite({
    name: 'Toolbar',
    configFields: $_6lwnjb14mjcg9me8w.schema(),
    partFields: $_6lwnjb14mjcg9me8w.parts(),
    factory: factory$4,
    apis: {
      setGroups: function (apis, toolbar, groups) {
        apis.setGroups(toolbar, groups);
      }
    }
  });

  var schema$15 = [
    $_5g6e15x1jcg9mdax.strict('items'),
    $_f9utgpysjcg9mdgi.markers(['itemClass']),
    $_bu8gqd10cjcg9mdmw.field('tgroupBehaviours', [Keying])
  ];
  var partTypes$2 = [$_b1jyxz10jjcg9mdo3.group({
      name: 'items',
      unit: 'item',
      overrides: function (detail) {
        return { domModification: { classes: [detail.markers().itemClass()] } };
      }
    })];
  var $_2b6cbv14ojcg9me92 = {
    name: $_7bfl0mwajcg9md92.constant('ToolbarGroup'),
    schema: $_7bfl0mwajcg9md92.constant(schema$15),
    parts: $_7bfl0mwajcg9md92.constant(partTypes$2)
  };

  var factory$5 = function (detail, components, spec, _externals) {
    return $_4xvhzgwxjcg9mdae.deepMerge({ dom: { attributes: { role: 'toolbar' } } }, {
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_4xvhzgwxjcg9mdae.deepMerge($_bb1w99w3jcg9md7v.derive([Keying.config({
          mode: 'flow',
          selector: '.' + detail.markers().itemClass()
        })]), $_bu8gqd10cjcg9mdmw.get(detail.tgroupBehaviours())),
      'debug.sketcher': spec['debug.sketcher']
    });
  };
  var ToolbarGroup = $_55yzot10djcg9mdn2.composite({
    name: 'ToolbarGroup',
    configFields: $_2b6cbv14ojcg9me92.schema(),
    partFields: $_2b6cbv14ojcg9me92.parts(),
    factory: factory$5
  });

  var dataHorizontal = 'data-' + $_3sfngaz0jcg9mdhj.resolve('horizontal-scroll');
  var canScrollVertically = function (container) {
    container.dom().scrollTop = 1;
    var result = container.dom().scrollTop !== 0;
    container.dom().scrollTop = 0;
    return result;
  };
  var canScrollHorizontally = function (container) {
    container.dom().scrollLeft = 1;
    var result = container.dom().scrollLeft !== 0;
    container.dom().scrollLeft = 0;
    return result;
  };
  var hasVerticalScroll = function (container) {
    return container.dom().scrollTop > 0 || canScrollVertically(container);
  };
  var hasHorizontalScroll = function (container) {
    return container.dom().scrollLeft > 0 || canScrollHorizontally(container);
  };
  var markAsHorizontal = function (container) {
    $_ectfz6xvjcg9mddu.set(container, dataHorizontal, 'true');
  };
  var hasScroll = function (container) {
    return $_ectfz6xvjcg9mddu.get(container, dataHorizontal) === 'true' ? hasHorizontalScroll : hasVerticalScroll;
  };
  var exclusive = function (scope, selector) {
    return $_decepq13jjcg9me3x.bind(scope, 'touchmove', function (event) {
      $_a6xsw6zljcg9mdjk.closest(event.target(), selector).filter(hasScroll).fold(function () {
        event.raw().preventDefault();
      }, $_7bfl0mwajcg9md92.noop);
    });
  };
  var $_fqgkzt14pjcg9me99 = {
    exclusive: exclusive,
    markAsHorizontal: markAsHorizontal
  };

  var ScrollingToolbar = function () {
    var makeGroup = function (gSpec) {
      var scrollClass = gSpec.scrollable === true ? '${prefix}-toolbar-scrollable-group' : '';
      return {
        dom: $_3w6c8v10pjcg9mdpf.dom('<div aria-label="' + gSpec.label + '" class="${prefix}-toolbar-group ' + scrollClass + '"></div>'),
        tgroupBehaviours: $_bb1w99w3jcg9md7v.derive([$_7lwycj11rjcg9mdu2.config('adhoc-scrollable-toolbar', gSpec.scrollable === true ? [$_v93nkw5jcg9md8g.runOnInit(function (component, simulatedEvent) {
              $_bctu7wzrjcg9mdk0.set(component.element(), 'overflow-x', 'auto');
              $_fqgkzt14pjcg9me99.markAsHorizontal(component.element());
              $_bg1a2213gjcg9me3k.register(component.element());
            })] : [])]),
        components: [Container.sketch({ components: [ToolbarGroup.parts().items({})] })],
        markers: { itemClass: $_3sfngaz0jcg9mdhj.resolve('toolbar-group-item') },
        items: gSpec.items
      };
    };
    var toolbar = $_6yv6bm12jjcg9mdxu.build(Toolbar.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-toolbar"></div>'),
      components: [Toolbar.parts().groups({})],
      toolbarBehaviours: $_bb1w99w3jcg9md7v.derive([
        Toggling.config({
          toggleClass: $_3sfngaz0jcg9mdhj.resolve('context-toolbar'),
          toggleOnExecute: false,
          aria: { mode: 'none' }
        }),
        Keying.config({ mode: 'cyclic' })
      ]),
      shell: true
    }));
    var wrapper = $_6yv6bm12jjcg9mdxu.build(Container.sketch({
      dom: { classes: [$_3sfngaz0jcg9mdhj.resolve('toolstrip')] },
      components: [$_6yv6bm12jjcg9mdxu.premade(toolbar)],
      containerBehaviours: $_bb1w99w3jcg9md7v.derive([Toggling.config({
          toggleClass: $_3sfngaz0jcg9mdhj.resolve('android-selection-context-toolbar'),
          toggleOnExecute: false
        })])
    }));
    var resetGroups = function () {
      Toolbar.setGroups(toolbar, initGroups.get());
      Toggling.off(toolbar);
    };
    var initGroups = Cell([]);
    var setGroups = function (gs) {
      initGroups.set(gs);
      resetGroups();
    };
    var createGroups = function (gs) {
      return $_gcfqi6w8jcg9md8v.map(gs, $_7bfl0mwajcg9md92.compose(ToolbarGroup.sketch, makeGroup));
    };
    var refresh = function () {
      Toolbar.refresh(toolbar);
    };
    var setContextToolbar = function (gs) {
      Toggling.on(toolbar);
      Toolbar.setGroups(toolbar, gs);
    };
    var restoreToolbar = function () {
      if (Toggling.isOn(toolbar)) {
        resetGroups();
      }
    };
    var focus = function () {
      Keying.focusIn(toolbar);
    };
    return {
      wrapper: $_7bfl0mwajcg9md92.constant(wrapper),
      toolbar: $_7bfl0mwajcg9md92.constant(toolbar),
      createGroups: createGroups,
      setGroups: setGroups,
      setContextToolbar: setContextToolbar,
      restoreToolbar: restoreToolbar,
      refresh: refresh,
      focus: focus
    };
  };

  var makeEditSwitch = function (webapp) {
    return $_6yv6bm12jjcg9mdxu.build(Button.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>'),
      action: function () {
        webapp.run(function (w) {
          w.setReadOnly(false);
        });
      }
    }));
  };
  var makeSocket = function () {
    return $_6yv6bm12jjcg9mdxu.build(Container.sketch({
      dom: $_3w6c8v10pjcg9mdpf.dom('<div class="${prefix}-editor-socket"></div>'),
      components: [],
      containerBehaviours: $_bb1w99w3jcg9md7v.derive([Replacing.config({})])
    }));
  };
  var showEdit = function (socket, switchToEdit) {
    Replacing.append(socket, $_6yv6bm12jjcg9mdxu.premade(switchToEdit));
  };
  var hideEdit = function (socket, switchToEdit) {
    Replacing.remove(socket, switchToEdit);
  };
  var updateMode = function (socket, switchToEdit, readOnly, root) {
    var swap = readOnly === true ? Swapping.toAlpha : Swapping.toOmega;
    swap(root);
    var f = readOnly ? showEdit : hideEdit;
    f(socket, switchToEdit);
  };
  var $_8485fq14qjcg9me9e = {
    makeEditSwitch: makeEditSwitch,
    makeSocket: makeSocket,
    updateMode: updateMode
  };

  var getAnimationRoot = function (component, slideConfig) {
    return slideConfig.getAnimationRoot().fold(function () {
      return component.element();
    }, function (get) {
      return get(component);
    });
  };
  var getDimensionProperty = function (slideConfig) {
    return slideConfig.dimension().property();
  };
  var getDimension = function (slideConfig, elem) {
    return slideConfig.dimension().getDimension()(elem);
  };
  var disableTransitions = function (component, slideConfig) {
    var root = getAnimationRoot(component, slideConfig);
    $_3ibmsu12xjcg9me0l.remove(root, [
      slideConfig.shrinkingClass(),
      slideConfig.growingClass()
    ]);
  };
  var setShrunk = function (component, slideConfig) {
    $_eb18ucxtjcg9mddr.remove(component.element(), slideConfig.openClass());
    $_eb18ucxtjcg9mddr.add(component.element(), slideConfig.closedClass());
    $_bctu7wzrjcg9mdk0.set(component.element(), getDimensionProperty(slideConfig), '0px');
    $_bctu7wzrjcg9mdk0.reflow(component.element());
  };
  var measureTargetSize = function (component, slideConfig) {
    setGrown(component, slideConfig);
    var expanded = getDimension(slideConfig, component.element());
    setShrunk(component, slideConfig);
    return expanded;
  };
  var setGrown = function (component, slideConfig) {
    $_eb18ucxtjcg9mddr.remove(component.element(), slideConfig.closedClass());
    $_eb18ucxtjcg9mddr.add(component.element(), slideConfig.openClass());
    $_bctu7wzrjcg9mdk0.remove(component.element(), getDimensionProperty(slideConfig));
  };
  var doImmediateShrink = function (component, slideConfig, slideState) {
    slideState.setCollapsed();
    $_bctu7wzrjcg9mdk0.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    $_bctu7wzrjcg9mdk0.reflow(component.element());
    disableTransitions(component, slideConfig);
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink()(component);
    slideConfig.onShrunk()(component);
  };
  var doStartShrink = function (component, slideConfig, slideState) {
    slideState.setCollapsed();
    $_bctu7wzrjcg9mdk0.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    $_bctu7wzrjcg9mdk0.reflow(component.element());
    var root = getAnimationRoot(component, slideConfig);
    $_eb18ucxtjcg9mddr.add(root, slideConfig.shrinkingClass());
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink()(component);
  };
  var doStartGrow = function (component, slideConfig, slideState) {
    var fullSize = measureTargetSize(component, slideConfig);
    var root = getAnimationRoot(component, slideConfig);
    $_eb18ucxtjcg9mddr.add(root, slideConfig.growingClass());
    setGrown(component, slideConfig);
    $_bctu7wzrjcg9mdk0.set(component.element(), getDimensionProperty(slideConfig), fullSize);
    slideState.setExpanded();
    slideConfig.onStartGrow()(component);
  };
  var grow = function (component, slideConfig, slideState) {
    if (!slideState.isExpanded())
      doStartGrow(component, slideConfig, slideState);
  };
  var shrink = function (component, slideConfig, slideState) {
    if (slideState.isExpanded())
      doStartShrink(component, slideConfig, slideState);
  };
  var immediateShrink = function (component, slideConfig, slideState) {
    if (slideState.isExpanded())
      doImmediateShrink(component, slideConfig, slideState);
  };
  var hasGrown = function (component, slideConfig, slideState) {
    return slideState.isExpanded();
  };
  var hasShrunk = function (component, slideConfig, slideState) {
    return slideState.isCollapsed();
  };
  var isGrowing = function (component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return $_eb18ucxtjcg9mddr.has(root, slideConfig.growingClass()) === true;
  };
  var isShrinking = function (component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return $_eb18ucxtjcg9mddr.has(root, slideConfig.shrinkingClass()) === true;
  };
  var isTransitioning = function (component, slideConfig, slideState) {
    return isGrowing(component, slideConfig, slideState) === true || isShrinking(component, slideConfig, slideState) === true;
  };
  var toggleGrow = function (component, slideConfig, slideState) {
    var f = slideState.isExpanded() ? doStartShrink : doStartGrow;
    f(component, slideConfig, slideState);
  };
  var $_4tzfec14ujcg9me9x = {
    grow: grow,
    shrink: shrink,
    immediateShrink: immediateShrink,
    hasGrown: hasGrown,
    hasShrunk: hasShrunk,
    isGrowing: isGrowing,
    isShrinking: isShrinking,
    isTransitioning: isTransitioning,
    toggleGrow: toggleGrow,
    disableTransitions: disableTransitions
  };

  var exhibit$5 = function (base, slideConfig) {
    var expanded = slideConfig.expanded();
    return expanded ? $_aq2yxwxjjcg9mdd0.nu({
      classes: [slideConfig.openClass()],
      styles: {}
    }) : $_aq2yxwxjjcg9mdd0.nu({
      classes: [slideConfig.closedClass()],
      styles: $_1ohhokx5jcg9mdbm.wrap(slideConfig.dimension().property(), '0px')
    });
  };
  var events$9 = function (slideConfig, slideState) {
    return $_v93nkw5jcg9md8g.derive([$_v93nkw5jcg9md8g.run($_f4bxsewwjcg9mdab.transitionend(), function (component, simulatedEvent) {
        var raw = simulatedEvent.event().raw();
        if (raw.propertyName === slideConfig.dimension().property()) {
          $_4tzfec14ujcg9me9x.disableTransitions(component, slideConfig, slideState);
          if (slideState.isExpanded())
            $_bctu7wzrjcg9mdk0.remove(component.element(), slideConfig.dimension().property());
          var notify = slideState.isExpanded() ? slideConfig.onGrown() : slideConfig.onShrunk();
          notify(component, simulatedEvent);
        }
      })]);
  };
  var $_fcfocq14tjcg9me9t = {
    exhibit: exhibit$5,
    events: events$9
  };

  var SlidingSchema = [
    $_5g6e15x1jcg9mdax.strict('closedClass'),
    $_5g6e15x1jcg9mdax.strict('openClass'),
    $_5g6e15x1jcg9mdax.strict('shrinkingClass'),
    $_5g6e15x1jcg9mdax.strict('growingClass'),
    $_5g6e15x1jcg9mdax.option('getAnimationRoot'),
    $_f9utgpysjcg9mdgi.onHandler('onShrunk'),
    $_f9utgpysjcg9mdgi.onHandler('onStartShrink'),
    $_f9utgpysjcg9mdgi.onHandler('onGrown'),
    $_f9utgpysjcg9mdgi.onHandler('onStartGrow'),
    $_5g6e15x1jcg9mdax.defaulted('expanded', false),
    $_5g6e15x1jcg9mdax.strictOf('dimension', $_96sv3hxgjcg9mdco.choose('property', {
      width: [
        $_f9utgpysjcg9mdgi.output('property', 'width'),
        $_f9utgpysjcg9mdgi.output('getDimension', function (elem) {
          return $_d38qpy116jcg9mdri.get(elem) + 'px';
        })
      ],
      height: [
        $_f9utgpysjcg9mdgi.output('property', 'height'),
        $_f9utgpysjcg9mdgi.output('getDimension', function (elem) {
          return $_2p843fzqjcg9mdjy.get(elem) + 'px';
        })
      ]
    }))
  ];

  var init$4 = function (spec) {
    var state = Cell(spec.expanded());
    var readState = function () {
      return 'expanded: ' + state.get();
    };
    return BehaviourState({
      isExpanded: function () {
        return state.get() === true;
      },
      isCollapsed: function () {
        return state.get() === false;
      },
      setCollapsed: $_7bfl0mwajcg9md92.curry(state.set, false),
      setExpanded: $_7bfl0mwajcg9md92.curry(state.set, true),
      readState: readState
    });
  };
  var $_cugbdi14wjcg9meaa = { init: init$4 };

  var Sliding = $_bb1w99w3jcg9md7v.create({
    fields: SlidingSchema,
    name: 'sliding',
    active: $_fcfocq14tjcg9me9t,
    apis: $_4tzfec14ujcg9me9x,
    state: $_cugbdi14wjcg9meaa
  });

  var build$2 = function (refresh, scrollIntoView) {
    var dropup = $_6yv6bm12jjcg9mdxu.build(Container.sketch({
      dom: {
        tag: 'div',
        classes: $_3sfngaz0jcg9mdhj.resolve('dropup')
      },
      components: [],
      containerBehaviours: $_bb1w99w3jcg9md7v.derive([
        Replacing.config({}),
        Sliding.config({
          closedClass: $_3sfngaz0jcg9mdhj.resolve('dropup-closed'),
          openClass: $_3sfngaz0jcg9mdhj.resolve('dropup-open'),
          shrinkingClass: $_3sfngaz0jcg9mdhj.resolve('dropup-shrinking'),
          growingClass: $_3sfngaz0jcg9mdhj.resolve('dropup-growing'),
          dimension: { property: 'height' },
          onShrunk: function (component) {
            refresh();
            scrollIntoView();
            Replacing.set(component, []);
          },
          onGrown: function (component) {
            refresh();
            scrollIntoView();
          }
        }),
        $_1n9vh6yzjcg9mdhf.orientation(function (component, data) {
          disappear($_7bfl0mwajcg9md92.noop);
        })
      ])
    }));
    var appear = function (menu, update, component) {
      if (Sliding.hasShrunk(dropup) === true && Sliding.isTransitioning(dropup) === false) {
        window.requestAnimationFrame(function () {
          update(component);
          Replacing.set(dropup, [menu()]);
          Sliding.grow(dropup);
        });
      }
    };
    var disappear = function (onReadyToShrink) {
      window.requestAnimationFrame(function () {
        onReadyToShrink();
        Sliding.shrink(dropup);
      });
    };
    return {
      appear: appear,
      disappear: disappear,
      component: $_7bfl0mwajcg9md92.constant(dropup),
      element: dropup.element
    };
  };
  var $_dxyv0k14rjcg9me9l = { build: build$2 };

  var isDangerous = function (event) {
    return event.raw().which === $_ahs1rjzdjcg9mdir.BACKSPACE()[0] && !$_gcfqi6w8jcg9md8v.contains([
      'input',
      'textarea'
    ], $_97hwf5xwjcg9mddy.name(event.target()));
  };
  var isFirefox = $_37ytsswfjcg9md9a.detect().browser.isFirefox();
  var settingsSchema = $_96sv3hxgjcg9mdco.objOfOnly([
    $_5g6e15x1jcg9mdax.strictFunction('triggerEvent'),
    $_5g6e15x1jcg9mdax.strictFunction('broadcastEvent'),
    $_5g6e15x1jcg9mdax.defaulted('stopBackspace', true)
  ]);
  var bindFocus = function (container, handler) {
    if (isFirefox) {
      return $_decepq13jjcg9me3x.capture(container, 'focus', handler);
    } else {
      return $_decepq13jjcg9me3x.bind(container, 'focusin', handler);
    }
  };
  var bindBlur = function (container, handler) {
    if (isFirefox) {
      return $_decepq13jjcg9me3x.capture(container, 'blur', handler);
    } else {
      return $_decepq13jjcg9me3x.bind(container, 'focusout', handler);
    }
  };
  var setup$2 = function (container, rawSettings) {
    var settings = $_96sv3hxgjcg9mdco.asRawOrDie('Getting GUI events settings', settingsSchema, rawSettings);
    var pointerEvents = $_37ytsswfjcg9md9a.detect().deviceType.isTouch() ? [
      'touchstart',
      'touchmove',
      'touchend',
      'gesturestart'
    ] : [
      'mousedown',
      'mouseup',
      'mouseover',
      'mousemove',
      'mouseout',
      'click'
    ];
    var tapEvent = $_7slii113qjcg9me4t.monitor(settings);
    var simpleEvents = $_gcfqi6w8jcg9md8v.map(pointerEvents.concat([
      'selectstart',
      'input',
      'contextmenu',
      'change',
      'transitionend',
      'dragstart',
      'dragover',
      'drop'
    ]), function (type) {
      return $_decepq13jjcg9me3x.bind(container, type, function (event) {
        tapEvent.fireIfReady(event, type).each(function (tapStopped) {
          if (tapStopped)
            event.kill();
        });
        var stopped = settings.triggerEvent(type, event);
        if (stopped)
          event.kill();
      });
    });
    var onKeydown = $_decepq13jjcg9me3x.bind(container, 'keydown', function (event) {
      var stopped = settings.triggerEvent('keydown', event);
      if (stopped)
        event.kill();
      else if (settings.stopBackspace === true && isDangerous(event)) {
        event.prevent();
      }
    });
    var onFocusIn = bindFocus(container, function (event) {
      var stopped = settings.triggerEvent('focusin', event);
      if (stopped)
        event.kill();
    });
    var onFocusOut = bindBlur(container, function (event) {
      var stopped = settings.triggerEvent('focusout', event);
      if (stopped)
        event.kill();
      setTimeout(function () {
        settings.triggerEvent($_fvndowvjcg9mda7.postBlur(), event);
      }, 0);
    });
    var defaultView = $_1lxhd4y2jcg9mdeh.defaultView(container);
    var onWindowScroll = $_decepq13jjcg9me3x.bind(defaultView, 'scroll', function (event) {
      var stopped = settings.broadcastEvent($_fvndowvjcg9mda7.windowScroll(), event);
      if (stopped)
        event.kill();
    });
    var unbind = function () {
      $_gcfqi6w8jcg9md8v.each(simpleEvents, function (e) {
        e.unbind();
      });
      onKeydown.unbind();
      onFocusIn.unbind();
      onFocusOut.unbind();
      onWindowScroll.unbind();
    };
    return { unbind: unbind };
  };
  var $_9dotwh14zjcg9meay = { setup: setup$2 };

  var derive$3 = function (rawEvent, rawTarget) {
    var source = $_1ohhokx5jcg9mdbm.readOptFrom(rawEvent, 'target').map(function (getTarget) {
      return getTarget();
    }).getOr(rawTarget);
    return Cell(source);
  };
  var $_fpu2p151jcg9mebe = { derive: derive$3 };

  var fromSource = function (event, source) {
    var stopper = Cell(false);
    var cutter = Cell(false);
    var stop = function () {
      stopper.set(true);
    };
    var cut = function () {
      cutter.set(true);
    };
    return {
      stop: stop,
      cut: cut,
      isStopped: stopper.get,
      isCut: cutter.get,
      event: $_7bfl0mwajcg9md92.constant(event),
      setSource: source.set,
      getSource: source.get
    };
  };
  var fromExternal = function (event) {
    var stopper = Cell(false);
    var stop = function () {
      stopper.set(true);
    };
    return {
      stop: stop,
      cut: $_7bfl0mwajcg9md92.noop,
      isStopped: stopper.get,
      isCut: $_7bfl0mwajcg9md92.constant(false),
      event: $_7bfl0mwajcg9md92.constant(event),
      setTarget: $_7bfl0mwajcg9md92.die(new Error('Cannot set target of a broadcasted event')),
      getTarget: $_7bfl0mwajcg9md92.die(new Error('Cannot get target of a broadcasted event'))
    };
  };
  var fromTarget = function (event, target) {
    var source = Cell(target);
    return fromSource(event, source);
  };
  var $_4o395a152jcg9mebi = {
    fromSource: fromSource,
    fromExternal: fromExternal,
    fromTarget: fromTarget
  };

  var adt$6 = $_4xy8cmx3jcg9mdb7.generate([
    { stopped: [] },
    { resume: ['element'] },
    { complete: [] }
  ]);
  var doTriggerHandler = function (lookup, eventType, rawEvent, target, source, logger) {
    var handler = lookup(eventType, target);
    var simulatedEvent = $_4o395a152jcg9mebi.fromSource(rawEvent, source);
    return handler.fold(function () {
      logger.logEventNoHandlers(eventType, target);
      return adt$6.complete();
    }, function (handlerInfo) {
      var descHandler = handlerInfo.descHandler();
      var eventHandler = $_4t5wio12ujcg9mdzw.getHandler(descHandler);
      eventHandler(simulatedEvent);
      if (simulatedEvent.isStopped()) {
        logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$6.stopped();
      } else if (simulatedEvent.isCut()) {
        logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$6.complete();
      } else
        return $_1lxhd4y2jcg9mdeh.parent(handlerInfo.element()).fold(function () {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$6.complete();
        }, function (parent) {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$6.resume(parent);
        });
    });
  };
  var doTriggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, source, logger) {
    return doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(function () {
      return true;
    }, function (parent) {
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent, source, logger);
    }, function () {
      return false;
    });
  };
  var triggerHandler = function (lookup, eventType, rawEvent, target, logger) {
    var source = $_fpu2p151jcg9mebe.derive(rawEvent, target);
    return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger);
  };
  var broadcast = function (listeners, rawEvent, logger) {
    var simulatedEvent = $_4o395a152jcg9mebi.fromExternal(rawEvent);
    $_gcfqi6w8jcg9md8v.each(listeners, function (listener) {
      var descHandler = listener.descHandler();
      var handler = $_4t5wio12ujcg9mdzw.getHandler(descHandler);
      handler(simulatedEvent);
    });
    return simulatedEvent.isStopped();
  };
  var triggerUntilStopped = function (lookup, eventType, rawEvent, logger) {
    var rawTarget = rawEvent.target();
    return triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger);
  };
  var triggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, logger) {
    var source = $_fpu2p151jcg9mebe.derive(rawEvent, rawTarget);
    return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger);
  };
  var $_aahjg2150jcg9meb9 = {
    triggerHandler: triggerHandler,
    triggerUntilStopped: triggerUntilStopped,
    triggerOnUntilStopped: triggerOnUntilStopped,
    broadcast: broadcast
  };

  var closest$4 = function (target, transform, isRoot) {
    var delegate = $_2dj3ogyhjcg9mdfk.closest(target, function (elem) {
      return transform(elem).isSome();
    }, isRoot);
    return delegate.bind(transform);
  };
  var $_4dh877155jcg9mebx = { closest: closest$4 };

  var eventHandler = $_ahnnvkxljcg9mddc.immutable('element', 'descHandler');
  var messageHandler = function (id, handler) {
    return {
      id: $_7bfl0mwajcg9md92.constant(id),
      descHandler: $_7bfl0mwajcg9md92.constant(handler)
    };
  };
  var EventRegistry = function () {
    var registry = {};
    var registerId = function (extraArgs, id, events) {
      $_9is1m7wzjcg9mdag.each(events, function (v, k) {
        var handlers = registry[k] !== undefined ? registry[k] : {};
        handlers[id] = $_4t5wio12ujcg9mdzw.curryArgs(v, extraArgs);
        registry[k] = handlers;
      });
    };
    var findHandler = function (handlers, elem) {
      return $_6lxli10ljcg9mdop.read(elem).fold(function (err) {
        return $_gb5srhw9jcg9md90.none();
      }, function (id) {
        var reader = $_1ohhokx5jcg9mdbm.readOpt(id);
        return handlers.bind(reader).map(function (descHandler) {
          return eventHandler(elem, descHandler);
        });
      });
    };
    var filterByType = function (type) {
      return $_1ohhokx5jcg9mdbm.readOptFrom(registry, type).map(function (handlers) {
        return $_9is1m7wzjcg9mdag.mapToArray(handlers, function (f, id) {
          return messageHandler(id, f);
        });
      }).getOr([]);
    };
    var find = function (isAboveRoot, type, target) {
      var readType = $_1ohhokx5jcg9mdbm.readOpt(type);
      var handlers = readType(registry);
      return $_4dh877155jcg9mebx.closest(target, function (elem) {
        return findHandler(handlers, elem);
      }, isAboveRoot);
    };
    var unregisterId = function (id) {
      $_9is1m7wzjcg9mdag.each(registry, function (handlersById, eventName) {
        if (handlersById.hasOwnProperty(id))
          delete handlersById[id];
      });
    };
    return {
      registerId: registerId,
      unregisterId: unregisterId,
      filterByType: filterByType,
      find: find
    };
  };

  var Registry = function () {
    var events = EventRegistry();
    var components = {};
    var readOrTag = function (component) {
      var elem = component.element();
      return $_6lxli10ljcg9mdop.read(elem).fold(function () {
        return $_6lxli10ljcg9mdop.write('uid-', component.element());
      }, function (uid) {
        return uid;
      });
    };
    var failOnDuplicate = function (component, tagId) {
      var conflict = components[tagId];
      if (conflict === component)
        unregister(component);
      else
        throw new Error('The tagId "' + tagId + '" is already used by: ' + $_3ckbpiy8jcg9mdf5.element(conflict.element()) + '\nCannot use it for: ' + $_3ckbpiy8jcg9mdf5.element(component.element()) + '\n' + 'The conflicting element is' + ($_6n4ng7y6jcg9mdet.inBody(conflict.element()) ? ' ' : ' not ') + 'already in the DOM');
    };
    var register = function (component) {
      var tagId = readOrTag(component);
      if ($_1ohhokx5jcg9mdbm.hasKey(components, tagId))
        failOnDuplicate(component, tagId);
      var extraArgs = [component];
      events.registerId(extraArgs, tagId, component.events());
      components[tagId] = component;
    };
    var unregister = function (component) {
      $_6lxli10ljcg9mdop.read(component.element()).each(function (tagId) {
        components[tagId] = undefined;
        events.unregisterId(tagId);
      });
    };
    var filter = function (type) {
      return events.filterByType(type);
    };
    var find = function (isAboveRoot, type, target) {
      return events.find(isAboveRoot, type, target);
    };
    var getById = function (id) {
      return $_1ohhokx5jcg9mdbm.readOpt(id)(components);
    };
    return {
      find: find,
      filter: filter,
      register: register,
      unregister: unregister,
      getById: getById
    };
  };

  var create$6 = function () {
    var root = $_6yv6bm12jjcg9mdxu.build(Container.sketch({ dom: { tag: 'div' } }));
    return takeover(root);
  };
  var takeover = function (root) {
    var isAboveRoot = function (el) {
      return $_1lxhd4y2jcg9mdeh.parent(root.element()).fold(function () {
        return true;
      }, function (parent) {
        return $_9sx28sw7jcg9md8n.eq(el, parent);
      });
    };
    var registry = Registry();
    var lookup = function (eventName, target) {
      return registry.find(isAboveRoot, eventName, target);
    };
    var domEvents = $_9dotwh14zjcg9meay.setup(root.element(), {
      triggerEvent: function (eventName, event) {
        return $_6ezsyby7jcg9mdey.monitorEvent(eventName, event.target(), function (logger) {
          return $_aahjg2150jcg9meb9.triggerUntilStopped(lookup, eventName, event, logger);
        });
      },
      broadcastEvent: function (eventName, event) {
        var listeners = registry.filter(eventName);
        return $_aahjg2150jcg9meb9.broadcast(listeners, event);
      }
    });
    var systemApi = SystemApi({
      debugInfo: $_7bfl0mwajcg9md92.constant('real'),
      triggerEvent: function (customType, target, data) {
        $_6ezsyby7jcg9mdey.monitorEvent(customType, target, function (logger) {
          $_aahjg2150jcg9meb9.triggerOnUntilStopped(lookup, customType, data, target, logger);
        });
      },
      triggerFocus: function (target, originator) {
        $_6lxli10ljcg9mdop.read(target).fold(function () {
          $_g6scf1yfjcg9mdfg.focus(target);
        }, function (_alloyId) {
          $_6ezsyby7jcg9mdey.monitorEvent($_fvndowvjcg9mda7.focus(), target, function (logger) {
            $_aahjg2150jcg9meb9.triggerHandler(lookup, $_fvndowvjcg9mda7.focus(), {
              originator: $_7bfl0mwajcg9md92.constant(originator),
              target: $_7bfl0mwajcg9md92.constant(target)
            }, target, logger);
          });
        });
      },
      triggerEscape: function (comp, simulatedEvent) {
        systemApi.triggerEvent('keydown', comp.element(), simulatedEvent.event());
      },
      getByUid: function (uid) {
        return getByUid(uid);
      },
      getByDom: function (elem) {
        return getByDom(elem);
      },
      build: $_6yv6bm12jjcg9mdxu.build,
      addToGui: function (c) {
        add(c);
      },
      removeFromGui: function (c) {
        remove(c);
      },
      addToWorld: function (c) {
        addToWorld(c);
      },
      removeFromWorld: function (c) {
        removeFromWorld(c);
      },
      broadcast: function (message) {
        broadcast(message);
      },
      broadcastOn: function (channels, message) {
        broadcastOn(channels, message);
      }
    });
    var addToWorld = function (component) {
      component.connect(systemApi);
      if (!$_97hwf5xwjcg9mddy.isText(component.element())) {
        registry.register(component);
        $_gcfqi6w8jcg9md8v.each(component.components(), addToWorld);
        systemApi.triggerEvent($_fvndowvjcg9mda7.systemInit(), component.element(), { target: $_7bfl0mwajcg9md92.constant(component.element()) });
      }
    };
    var removeFromWorld = function (component) {
      if (!$_97hwf5xwjcg9mddy.isText(component.element())) {
        $_gcfqi6w8jcg9md8v.each(component.components(), removeFromWorld);
        registry.unregister(component);
      }
      component.disconnect();
    };
    var add = function (component) {
      $_24go32y0jcg9mde6.attach(root, component);
    };
    var remove = function (component) {
      $_24go32y0jcg9mde6.detach(component);
    };
    var destroy = function () {
      domEvents.unbind();
      $_9le0u1y4jcg9mdep.remove(root.element());
    };
    var broadcastData = function (data) {
      var receivers = registry.filter($_fvndowvjcg9mda7.receive());
      $_gcfqi6w8jcg9md8v.each(receivers, function (receiver) {
        var descHandler = receiver.descHandler();
        var handler = $_4t5wio12ujcg9mdzw.getHandler(descHandler);
        handler(data);
      });
    };
    var broadcast = function (message) {
      broadcastData({
        universal: $_7bfl0mwajcg9md92.constant(true),
        data: $_7bfl0mwajcg9md92.constant(message)
      });
    };
    var broadcastOn = function (channels, message) {
      broadcastData({
        universal: $_7bfl0mwajcg9md92.constant(false),
        channels: $_7bfl0mwajcg9md92.constant(channels),
        data: $_7bfl0mwajcg9md92.constant(message)
      });
    };
    var getByUid = function (uid) {
      return registry.getById(uid).fold(function () {
        return $_exyfurx7jcg9mdbv.error(new Error('Could not find component with uid: "' + uid + '" in system.'));
      }, $_exyfurx7jcg9mdbv.value);
    };
    var getByDom = function (elem) {
      return $_6lxli10ljcg9mdop.read(elem).bind(getByUid);
    };
    addToWorld(root);
    return {
      root: $_7bfl0mwajcg9md92.constant(root),
      element: root.element,
      destroy: destroy,
      add: add,
      remove: remove,
      getByUid: getByUid,
      getByDom: getByDom,
      addToWorld: addToWorld,
      removeFromWorld: removeFromWorld,
      broadcast: broadcast,
      broadcastOn: broadcastOn
    };
  };
  var $_a5pa3q14yjcg9meak = {
    create: create$6,
    takeover: takeover
  };

  var READ_ONLY_MODE_CLASS = $_7bfl0mwajcg9md92.constant($_3sfngaz0jcg9mdhj.resolve('readonly-mode'));
  var EDIT_MODE_CLASS = $_7bfl0mwajcg9md92.constant($_3sfngaz0jcg9mdhj.resolve('edit-mode'));
  var OuterContainer = function (spec) {
    var root = $_6yv6bm12jjcg9mdxu.build(Container.sketch({
      dom: { classes: [$_3sfngaz0jcg9mdhj.resolve('outer-container')].concat(spec.classes) },
      containerBehaviours: $_bb1w99w3jcg9md7v.derive([Swapping.config({
          alpha: READ_ONLY_MODE_CLASS(),
          omega: EDIT_MODE_CLASS()
        })])
    }));
    return $_a5pa3q14yjcg9meak.takeover(root);
  };

  var AndroidRealm = function (scrollIntoView) {
    var alloy = OuterContainer({ classes: [$_3sfngaz0jcg9mdhj.resolve('android-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = $_7psgdg129jcg9mdwe.api();
    var switchToEdit = $_8485fq14qjcg9me9e.makeEditSwitch(webapp);
    var socket = $_8485fq14qjcg9me9e.makeSocket();
    var dropup = $_dxyv0k14rjcg9me9l.build($_7bfl0mwajcg9md92.noop, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function () {
      toolbar.focus();
    };
    var restoreToolbar = function () {
      toolbar.restoreToolbar();
    };
    var init = function (spec) {
      webapp.set($_5n43pg13mjcg9me45.produce(spec));
    };
    var exit = function () {
      webapp.run(function (w) {
        w.exit();
        Replacing.remove(socket, switchToEdit);
      });
    };
    var updateMode = function (readOnly) {
      $_8485fq14qjcg9me9e.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: $_7bfl0mwajcg9md92.constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: $_7bfl0mwajcg9md92.constant(socket),
      dropup: $_7bfl0mwajcg9md92.constant(dropup)
    };
  };

  var initEvents$1 = function (editorApi, iosApi, toolstrip, socket, dropup) {
    var saveSelectionFirst = function () {
      iosApi.run(function (api) {
        api.highlightSelection();
      });
    };
    var refreshIosSelection = function () {
      iosApi.run(function (api) {
        api.refreshSelection();
      });
    };
    var scrollToY = function (yTop, height) {
      var y = yTop - socket.dom().scrollTop;
      iosApi.run(function (api) {
        api.scrollIntoView(y, y + height);
      });
    };
    var scrollToElement = function (target) {
      scrollToY(iosApi, socket);
    };
    var scrollToCursor = function () {
      editorApi.getCursorBox().each(function (box) {
        scrollToY(box.top(), box.height());
      });
    };
    var clearSelection = function () {
      iosApi.run(function (api) {
        api.clearSelection();
      });
    };
    var clearAndRefresh = function () {
      clearSelection();
      refreshThrottle.throttle();
    };
    var refreshView = function () {
      scrollToCursor();
      iosApi.run(function (api) {
        api.syncHeight();
      });
    };
    var reposition = function () {
      var toolbarHeight = $_2p843fzqjcg9mdjy.get(toolstrip);
      iosApi.run(function (api) {
        api.setViewportOffset(toolbarHeight);
      });
      refreshIosSelection();
      refreshView();
    };
    var toEditing = function () {
      iosApi.run(function (api) {
        api.toEditing();
      });
    };
    var toReading = function () {
      iosApi.run(function (api) {
        api.toReading();
      });
    };
    var onToolbarTouch = function (event) {
      iosApi.run(function (api) {
        api.onToolbarTouch(event);
      });
    };
    var tapping = $_erpoze13pjcg9me4o.monitor(editorApi);
    var refreshThrottle = $_49m7ou14jjcg9me89.last(refreshView, 300);
    var listeners = [
      editorApi.onKeyup(clearAndRefresh),
      editorApi.onNodeChanged(refreshIosSelection),
      editorApi.onDomChanged(refreshThrottle.throttle),
      editorApi.onDomChanged(refreshIosSelection),
      editorApi.onScrollToCursor(function (tinyEvent) {
        tinyEvent.preventDefault();
        refreshThrottle.throttle();
      }),
      editorApi.onScrollToElement(function (event) {
        scrollToElement(event.element());
      }),
      editorApi.onToEditing(toEditing),
      editorApi.onToReading(toReading),
      $_decepq13jjcg9me3x.bind(editorApi.doc(), 'touchend', function (touchEvent) {
        if ($_9sx28sw7jcg9md8n.eq(editorApi.html(), touchEvent.target()) || $_9sx28sw7jcg9md8n.eq(editorApi.body(), touchEvent.target())) {
        }
      }),
      $_decepq13jjcg9me3x.bind(toolstrip, 'transitionend', function (transitionEvent) {
        if (transitionEvent.raw().propertyName === 'height') {
          reposition();
        }
      }),
      $_decepq13jjcg9me3x.capture(toolstrip, 'touchstart', function (touchEvent) {
        saveSelectionFirst();
        onToolbarTouch(touchEvent);
        editorApi.onTouchToolstrip();
      }),
      $_decepq13jjcg9me3x.bind(editorApi.body(), 'touchstart', function (evt) {
        clearSelection();
        editorApi.onTouchContent();
        tapping.fireTouchstart(evt);
      }),
      tapping.onTouchmove(),
      tapping.onTouchend(),
      $_decepq13jjcg9me3x.bind(editorApi.body(), 'click', function (event) {
        event.kill();
      }),
      $_decepq13jjcg9me3x.bind(toolstrip, 'touchmove', function () {
        editorApi.onToolbarScrollStart();
      })
    ];
    var destroy = function () {
      $_gcfqi6w8jcg9md8v.each(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var $_in1j159jcg9meck = { initEvents: initEvents$1 };

  var refreshInput = function (input) {
    var start = input.dom().selectionStart;
    var end = input.dom().selectionEnd;
    var dir = input.dom().selectionDirection;
    setTimeout(function () {
      input.dom().setSelectionRange(start, end, dir);
      $_g6scf1yfjcg9mdfg.focus(input);
    }, 50);
  };
  var refresh = function (winScope) {
    var sel = winScope.getSelection();
    if (sel.rangeCount > 0) {
      var br = sel.getRangeAt(0);
      var r = winScope.document.createRange();
      r.setStart(br.startContainer, br.startOffset);
      r.setEnd(br.endContainer, br.endOffset);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };
  var $_euaakq15djcg9medg = {
    refreshInput: refreshInput,
    refresh: refresh
  };

  var resume$1 = function (cWin, frame) {
    $_g6scf1yfjcg9mdfg.active().each(function (active) {
      if (!$_9sx28sw7jcg9md8n.eq(active, frame)) {
        $_g6scf1yfjcg9mdfg.blur(active);
      }
    });
    cWin.focus();
    $_g6scf1yfjcg9mdfg.focus($_41aqpdwsjcg9md9w.fromDom(cWin.document.body));
    $_euaakq15djcg9medg.refresh(cWin);
  };
  var $_9uyrzv15cjcg9meda = { resume: resume$1 };

  var FakeSelection = function (win, frame) {
    var doc = win.document;
    var container = $_41aqpdwsjcg9md9w.fromTag('div');
    $_eb18ucxtjcg9mddr.add(container, $_3sfngaz0jcg9mdhj.resolve('unfocused-selections'));
    $_ghqowmy1jcg9mdef.append($_41aqpdwsjcg9md9w.fromDom(doc.documentElement), container);
    var onTouch = $_decepq13jjcg9me3x.bind(container, 'touchstart', function (event) {
      event.prevent();
      $_9uyrzv15cjcg9meda.resume(win, frame);
      clear();
    });
    var make = function (rectangle) {
      var span = $_41aqpdwsjcg9md9w.fromTag('span');
      $_3ibmsu12xjcg9me0l.add(span, [
        $_3sfngaz0jcg9mdhj.resolve('layer-editor'),
        $_3sfngaz0jcg9mdhj.resolve('unfocused-selection')
      ]);
      $_bctu7wzrjcg9mdk0.setAll(span, {
        left: rectangle.left() + 'px',
        top: rectangle.top() + 'px',
        width: rectangle.width() + 'px',
        height: rectangle.height() + 'px'
      });
      return span;
    };
    var update = function () {
      clear();
      var rectangles = $_e2ye6p13vjcg9me5l.getRectangles(win);
      var spans = $_gcfqi6w8jcg9md8v.map(rectangles, make);
      $_7e164ay5jcg9mder.append(container, spans);
    };
    var clear = function () {
      $_9le0u1y4jcg9mdep.empty(container);
    };
    var destroy = function () {
      onTouch.unbind();
      $_9le0u1y4jcg9mdep.remove(container);
    };
    var isActive = function () {
      return $_1lxhd4y2jcg9mdeh.children(container).length > 0;
    };
    return {
      update: update,
      isActive: isActive,
      destroy: destroy,
      clear: clear
    };
  };

  var nu$9 = function (baseFn) {
    var data = $_gb5srhw9jcg9md90.none();
    var callbacks = [];
    var map = function (f) {
      return nu$9(function (nCallback) {
        get(function (data) {
          nCallback(f(data));
        });
      });
    };
    var get = function (nCallback) {
      if (isReady())
        call(nCallback);
      else
        callbacks.push(nCallback);
    };
    var set = function (x) {
      data = $_gb5srhw9jcg9md90.some(x);
      run(callbacks);
      callbacks = [];
    };
    var isReady = function () {
      return data.isSome();
    };
    var run = function (cbs) {
      $_gcfqi6w8jcg9md8v.each(cbs, call);
    };
    var call = function (cb) {
      data.each(function (x) {
        setTimeout(function () {
          cb(x);
        }, 0);
      });
    };
    baseFn(set);
    return {
      get: get,
      map: map,
      isReady: isReady
    };
  };
  var pure$2 = function (a) {
    return nu$9(function (callback) {
      callback(a);
    });
  };
  var $_f19qvb15gjcg9medp = {
    nu: nu$9,
    pure: pure$2
  };

  var bounce = function (f) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var me = this;
      setTimeout(function () {
        f.apply(me, args);
      }, 0);
    };
  };
  var $_33jplw15hjcg9medq = { bounce: bounce };

  var nu$8 = function (baseFn) {
    var get = function (callback) {
      baseFn($_33jplw15hjcg9medq.bounce(callback));
    };
    var map = function (fab) {
      return nu$8(function (callback) {
        get(function (a) {
          var value = fab(a);
          callback(value);
        });
      });
    };
    var bind = function (aFutureB) {
      return nu$8(function (callback) {
        get(function (a) {
          aFutureB(a).get(callback);
        });
      });
    };
    var anonBind = function (futureB) {
      return nu$8(function (callback) {
        get(function (a) {
          futureB.get(callback);
        });
      });
    };
    var toLazy = function () {
      return $_f19qvb15gjcg9medp.nu(get);
    };
    return {
      map: map,
      bind: bind,
      anonBind: anonBind,
      toLazy: toLazy,
      get: get
    };
  };
  var pure$1 = function (a) {
    return nu$8(function (callback) {
      callback(a);
    });
  };
  var $_6pyp6c15fjcg9medo = {
    nu: nu$8,
    pure: pure$1
  };

  var adjust = function (value, destination, amount) {
    if (Math.abs(value - destination) <= amount) {
      return $_gb5srhw9jcg9md90.none();
    } else if (value < destination) {
      return $_gb5srhw9jcg9md90.some(value + amount);
    } else {
      return $_gb5srhw9jcg9md90.some(value - amount);
    }
  };
  var create$8 = function () {
    var interval = null;
    var animate = function (getCurrent, destination, amount, increment, doFinish, rate) {
      var finished = false;
      var finish = function (v) {
        finished = true;
        doFinish(v);
      };
      clearInterval(interval);
      var abort = function (v) {
        clearInterval(interval);
        finish(v);
      };
      interval = setInterval(function () {
        var value = getCurrent();
        adjust(value, destination, amount).fold(function () {
          clearInterval(interval);
          finish(destination);
        }, function (s) {
          increment(s, abort);
          if (!finished) {
            var newValue = getCurrent();
            if (newValue !== s || Math.abs(newValue - destination) > Math.abs(value - destination)) {
              clearInterval(interval);
              finish(destination);
            }
          }
        });
      }, rate);
    };
    return { animate: animate };
  };
  var $_c9sxwg15ijcg9meds = {
    create: create$8,
    adjust: adjust
  };

  var findDevice = function (deviceWidth, deviceHeight) {
    var devices = [
      {
        width: 320,
        height: 480,
        keyboard: {
          portrait: 300,
          landscape: 240
        }
      },
      {
        width: 320,
        height: 568,
        keyboard: {
          portrait: 300,
          landscape: 240
        }
      },
      {
        width: 375,
        height: 667,
        keyboard: {
          portrait: 305,
          landscape: 240
        }
      },
      {
        width: 414,
        height: 736,
        keyboard: {
          portrait: 320,
          landscape: 240
        }
      },
      {
        width: 768,
        height: 1024,
        keyboard: {
          portrait: 320,
          landscape: 400
        }
      },
      {
        width: 1024,
        height: 1366,
        keyboard: {
          portrait: 380,
          landscape: 460
        }
      }
    ];
    return $_6vwq8dydjcg9mdfe.findMap(devices, function (device) {
      return deviceWidth <= device.width && deviceHeight <= device.height ? $_gb5srhw9jcg9md90.some(device.keyboard) : $_gb5srhw9jcg9md90.none();
    }).getOr({
      portrait: deviceHeight / 5,
      landscape: deviceWidth / 4
    });
  };
  var $_fly6o515ljcg9mee8 = { findDevice: findDevice };

  var softKeyboardLimits = function (outerWindow) {
    return $_fly6o515ljcg9mee8.findDevice(outerWindow.screen.width, outerWindow.screen.height);
  };
  var accountableKeyboardHeight = function (outerWindow) {
    var portrait = $_4u2xx713ijcg9me3r.get(outerWindow).isPortrait();
    var limits = softKeyboardLimits(outerWindow);
    var keyboard = portrait ? limits.portrait : limits.landscape;
    var visualScreenHeight = portrait ? outerWindow.screen.height : outerWindow.screen.width;
    return visualScreenHeight - outerWindow.innerHeight > keyboard ? 0 : keyboard;
  };
  var getGreenzone = function (socket, dropup) {
    var outerWindow = $_1lxhd4y2jcg9mdeh.owner(socket).dom().defaultView;
    var viewportHeight = $_2p843fzqjcg9mdjy.get(socket) + $_2p843fzqjcg9mdjy.get(dropup);
    var acc = accountableKeyboardHeight(outerWindow);
    return viewportHeight - acc;
  };
  var updatePadding = function (contentBody, socket, dropup) {
    var greenzoneHeight = getGreenzone(socket, dropup);
    var deltaHeight = $_2p843fzqjcg9mdjy.get(socket) + $_2p843fzqjcg9mdjy.get(dropup) - greenzoneHeight;
    $_bctu7wzrjcg9mdk0.set(contentBody, 'padding-bottom', deltaHeight + 'px');
  };
  var $_ehkznp15kjcg9mee4 = {
    getGreenzone: getGreenzone,
    updatePadding: updatePadding
  };

  var fixture = $_4xy8cmx3jcg9mdb7.generate([
    {
      fixed: [
        'element',
        'property',
        'offsetY'
      ]
    },
    {
      scroller: [
        'element',
        'offsetY'
      ]
    }
  ]);
  var yFixedData = 'data-' + $_3sfngaz0jcg9mdhj.resolve('position-y-fixed');
  var yFixedProperty = 'data-' + $_3sfngaz0jcg9mdhj.resolve('y-property');
  var yScrollingData = 'data-' + $_3sfngaz0jcg9mdhj.resolve('scrolling');
  var windowSizeData = 'data-' + $_3sfngaz0jcg9mdhj.resolve('last-window-height');
  var getYFixedData = function (element) {
    return $_dyzzx213ujcg9me5j.safeParse(element, yFixedData);
  };
  var getYFixedProperty = function (element) {
    return $_ectfz6xvjcg9mddu.get(element, yFixedProperty);
  };
  var getLastWindowSize = function (element) {
    return $_dyzzx213ujcg9me5j.safeParse(element, windowSizeData);
  };
  var classifyFixed = function (element, offsetY) {
    var prop = getYFixedProperty(element);
    return fixture.fixed(element, prop, offsetY);
  };
  var classifyScrolling = function (element, offsetY) {
    return fixture.scroller(element, offsetY);
  };
  var classify = function (element) {
    var offsetY = getYFixedData(element);
    var classifier = $_ectfz6xvjcg9mddu.get(element, yScrollingData) === 'true' ? classifyScrolling : classifyFixed;
    return classifier(element, offsetY);
  };
  var findFixtures = function (container) {
    var candidates = $_fg27d6zjjcg9mdjg.descendants(container, '[' + yFixedData + ']');
    return $_gcfqi6w8jcg9md8v.map(candidates, classify);
  };
  var takeoverToolbar = function (toolbar) {
    var oldToolbarStyle = $_ectfz6xvjcg9mddu.get(toolbar, 'style');
    $_bctu7wzrjcg9mdk0.setAll(toolbar, {
      position: 'absolute',
      top: '0px'
    });
    $_ectfz6xvjcg9mddu.set(toolbar, yFixedData, '0px');
    $_ectfz6xvjcg9mddu.set(toolbar, yFixedProperty, 'top');
    var restore = function () {
      $_ectfz6xvjcg9mddu.set(toolbar, 'style', oldToolbarStyle || '');
      $_ectfz6xvjcg9mddu.remove(toolbar, yFixedData);
      $_ectfz6xvjcg9mddu.remove(toolbar, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverViewport = function (toolbarHeight, height, viewport) {
    var oldViewportStyle = $_ectfz6xvjcg9mddu.get(viewport, 'style');
    $_bg1a2213gjcg9me3k.register(viewport);
    $_bctu7wzrjcg9mdk0.setAll(viewport, {
      position: 'absolute',
      height: height + 'px',
      width: '100%',
      top: toolbarHeight + 'px'
    });
    $_ectfz6xvjcg9mddu.set(viewport, yFixedData, toolbarHeight + 'px');
    $_ectfz6xvjcg9mddu.set(viewport, yScrollingData, 'true');
    $_ectfz6xvjcg9mddu.set(viewport, yFixedProperty, 'top');
    var restore = function () {
      $_bg1a2213gjcg9me3k.deregister(viewport);
      $_ectfz6xvjcg9mddu.set(viewport, 'style', oldViewportStyle || '');
      $_ectfz6xvjcg9mddu.remove(viewport, yFixedData);
      $_ectfz6xvjcg9mddu.remove(viewport, yScrollingData);
      $_ectfz6xvjcg9mddu.remove(viewport, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverDropup = function (dropup, toolbarHeight, viewportHeight) {
    var oldDropupStyle = $_ectfz6xvjcg9mddu.get(dropup, 'style');
    $_bctu7wzrjcg9mdk0.setAll(dropup, {
      position: 'absolute',
      bottom: '0px'
    });
    $_ectfz6xvjcg9mddu.set(dropup, yFixedData, '0px');
    $_ectfz6xvjcg9mddu.set(dropup, yFixedProperty, 'bottom');
    var restore = function () {
      $_ectfz6xvjcg9mddu.set(dropup, 'style', oldDropupStyle || '');
      $_ectfz6xvjcg9mddu.remove(dropup, yFixedData);
      $_ectfz6xvjcg9mddu.remove(dropup, yFixedProperty);
    };
    return { restore: restore };
  };
  var deriveViewportHeight = function (viewport, toolbarHeight, dropupHeight) {
    var outerWindow = $_1lxhd4y2jcg9mdeh.owner(viewport).dom().defaultView;
    var winH = outerWindow.innerHeight;
    $_ectfz6xvjcg9mddu.set(viewport, windowSizeData, winH + 'px');
    return winH - toolbarHeight - dropupHeight;
  };
  var takeover$1 = function (viewport, contentBody, toolbar, dropup) {
    var outerWindow = $_1lxhd4y2jcg9mdeh.owner(viewport).dom().defaultView;
    var toolbarSetup = takeoverToolbar(toolbar);
    var toolbarHeight = $_2p843fzqjcg9mdjy.get(toolbar);
    var dropupHeight = $_2p843fzqjcg9mdjy.get(dropup);
    var viewportHeight = deriveViewportHeight(viewport, toolbarHeight, dropupHeight);
    var viewportSetup = takeoverViewport(toolbarHeight, viewportHeight, viewport);
    var dropupSetup = takeoverDropup(dropup, toolbarHeight, viewportHeight);
    var isActive = true;
    var restore = function () {
      isActive = false;
      toolbarSetup.restore();
      viewportSetup.restore();
      dropupSetup.restore();
    };
    var isExpanding = function () {
      var currentWinHeight = outerWindow.innerHeight;
      var lastWinHeight = getLastWindowSize(viewport);
      return currentWinHeight > lastWinHeight;
    };
    var refresh = function () {
      if (isActive) {
        var newToolbarHeight = $_2p843fzqjcg9mdjy.get(toolbar);
        var dropupHeight_1 = $_2p843fzqjcg9mdjy.get(dropup);
        var newHeight = deriveViewportHeight(viewport, newToolbarHeight, dropupHeight_1);
        $_ectfz6xvjcg9mddu.set(viewport, yFixedData, newToolbarHeight + 'px');
        $_bctu7wzrjcg9mdk0.set(viewport, 'height', newHeight + 'px');
        $_bctu7wzrjcg9mdk0.set(dropup, 'bottom', -(newToolbarHeight + newHeight + dropupHeight_1) + 'px');
        $_ehkznp15kjcg9mee4.updatePadding(contentBody, viewport, dropup);
      }
    };
    var setViewportOffset = function (newYOffset) {
      var offsetPx = newYOffset + 'px';
      $_ectfz6xvjcg9mddu.set(viewport, yFixedData, offsetPx);
      refresh();
    };
    $_ehkznp15kjcg9mee4.updatePadding(contentBody, viewport, dropup);
    return {
      setViewportOffset: setViewportOffset,
      isExpanding: isExpanding,
      isShrinking: $_7bfl0mwajcg9md92.not(isExpanding),
      refresh: refresh,
      restore: restore
    };
  };
  var $_5nekx615jjcg9medu = {
    findFixtures: findFixtures,
    takeover: takeover$1,
    getYFixedData: getYFixedData
  };

  var animator = $_c9sxwg15ijcg9meds.create();
  var ANIMATION_STEP = 15;
  var NUM_TOP_ANIMATION_FRAMES = 10;
  var ANIMATION_RATE = 10;
  var lastScroll = 'data-' + $_3sfngaz0jcg9mdhj.resolve('last-scroll-top');
  var getTop = function (element) {
    var raw = $_bctu7wzrjcg9mdk0.getRaw(element, 'top').getOr(0);
    return parseInt(raw, 10);
  };
  var getScrollTop = function (element) {
    return parseInt(element.dom().scrollTop, 10);
  };
  var moveScrollAndTop = function (element, destination, finalTop) {
    return $_6pyp6c15fjcg9medo.nu(function (callback) {
      var getCurrent = $_7bfl0mwajcg9md92.curry(getScrollTop, element);
      var update = function (newScroll) {
        element.dom().scrollTop = newScroll;
        $_bctu7wzrjcg9mdk0.set(element, 'top', getTop(element) + ANIMATION_STEP + 'px');
      };
      var finish = function () {
        element.dom().scrollTop = destination;
        $_bctu7wzrjcg9mdk0.set(element, 'top', finalTop + 'px');
        callback(destination);
      };
      animator.animate(getCurrent, destination, ANIMATION_STEP, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyScroll = function (element, destination) {
    return $_6pyp6c15fjcg9medo.nu(function (callback) {
      var getCurrent = $_7bfl0mwajcg9md92.curry(getScrollTop, element);
      $_ectfz6xvjcg9mddu.set(element, lastScroll, getCurrent());
      var update = function (newScroll, abort) {
        var previous = $_dyzzx213ujcg9me5j.safeParse(element, lastScroll);
        if (previous !== element.dom().scrollTop) {
          abort(element.dom().scrollTop);
        } else {
          element.dom().scrollTop = newScroll;
          $_ectfz6xvjcg9mddu.set(element, lastScroll, newScroll);
        }
      };
      var finish = function () {
        element.dom().scrollTop = destination;
        $_ectfz6xvjcg9mddu.set(element, lastScroll, destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyTop = function (element, destination) {
    return $_6pyp6c15fjcg9medo.nu(function (callback) {
      var getCurrent = $_7bfl0mwajcg9md92.curry(getTop, element);
      var update = function (newTop) {
        $_bctu7wzrjcg9mdk0.set(element, 'top', newTop + 'px');
      };
      var finish = function () {
        update(destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var updateTop = function (element, amount) {
    var newTop = amount + $_5nekx615jjcg9medu.getYFixedData(element) + 'px';
    $_bctu7wzrjcg9mdk0.set(element, 'top', newTop);
  };
  var moveWindowScroll = function (toolbar, viewport, destY) {
    var outerWindow = $_1lxhd4y2jcg9mdeh.owner(toolbar).dom().defaultView;
    return $_6pyp6c15fjcg9medo.nu(function (callback) {
      updateTop(toolbar, destY);
      updateTop(viewport, destY);
      outerWindow.scrollTo(0, destY);
      callback(destY);
    });
  };
  var $_6mzr9r15ejcg9medi = {
    moveScrollAndTop: moveScrollAndTop,
    moveOnlyScroll: moveOnlyScroll,
    moveOnlyTop: moveOnlyTop,
    moveWindowScroll: moveWindowScroll
  };

  var BackgroundActivity = function (doAction) {
    var action = Cell($_f19qvb15gjcg9medp.pure({}));
    var start = function (value) {
      var future = $_f19qvb15gjcg9medp.nu(function (callback) {
        return doAction(value).get(callback);
      });
      action.set(future);
    };
    var idle = function (g) {
      action.get().get(function () {
        g();
      });
    };
    return {
      start: start,
      idle: idle
    };
  };

  var scrollIntoView = function (cWin, socket, dropup, top, bottom) {
    var greenzone = $_ehkznp15kjcg9mee4.getGreenzone(socket, dropup);
    var refreshCursor = $_7bfl0mwajcg9md92.curry($_euaakq15djcg9medg.refresh, cWin);
    if (top > greenzone || bottom > greenzone) {
      $_6mzr9r15ejcg9medi.moveOnlyScroll(socket, socket.dom().scrollTop - greenzone + bottom).get(refreshCursor);
    } else if (top < 0) {
      $_6mzr9r15ejcg9medi.moveOnlyScroll(socket, socket.dom().scrollTop + top).get(refreshCursor);
    } else {
    }
  };
  var $_cebbl115njcg9meee = { scrollIntoView: scrollIntoView };

  var par$1 = function (asyncValues, nu) {
    return nu(function (callback) {
      var r = [];
      var count = 0;
      var cb = function (i) {
        return function (value) {
          r[i] = value;
          count++;
          if (count >= asyncValues.length) {
            callback(r);
          }
        };
      };
      if (asyncValues.length === 0) {
        callback([]);
      } else {
        $_gcfqi6w8jcg9md8v.each(asyncValues, function (asyncValue, i) {
          asyncValue.get(cb(i));
        });
      }
    });
  };
  var $_9kypg115qjcg9meel = { par: par$1 };

  var par = function (futures) {
    return $_9kypg115qjcg9meel.par(futures, $_6pyp6c15fjcg9medo.nu);
  };
  var mapM = function (array, fn) {
    var futures = $_gcfqi6w8jcg9md8v.map(array, fn);
    return par(futures);
  };
  var compose$1 = function (f, g) {
    return function (a) {
      return g(a).bind(f);
    };
  };
  var $_b54hly15pjcg9meek = {
    par: par,
    mapM: mapM,
    compose: compose$1
  };

  var updateFixed = function (element, property, winY, offsetY) {
    var destination = winY + offsetY;
    $_bctu7wzrjcg9mdk0.set(element, property, destination + 'px');
    return $_6pyp6c15fjcg9medo.pure(offsetY);
  };
  var updateScrollingFixed = function (element, winY, offsetY) {
    var destTop = winY + offsetY;
    var oldProp = $_bctu7wzrjcg9mdk0.getRaw(element, 'top').getOr(offsetY);
    var delta = destTop - parseInt(oldProp, 10);
    var destScroll = element.dom().scrollTop + delta;
    return $_6mzr9r15ejcg9medi.moveScrollAndTop(element, destScroll, destTop);
  };
  var updateFixture = function (fixture, winY) {
    return fixture.fold(function (element, property, offsetY) {
      return updateFixed(element, property, winY, offsetY);
    }, function (element, offsetY) {
      return updateScrollingFixed(element, winY, offsetY);
    });
  };
  var updatePositions = function (container, winY) {
    var fixtures = $_5nekx615jjcg9medu.findFixtures(container);
    var updates = $_gcfqi6w8jcg9md8v.map(fixtures, function (fixture) {
      return updateFixture(fixture, winY);
    });
    return $_b54hly15pjcg9meek.par(updates);
  };
  var $_ecqd7m15ojcg9meeg = { updatePositions: updatePositions };

  var input = function (parent, operation) {
    var input = $_41aqpdwsjcg9md9w.fromTag('input');
    $_bctu7wzrjcg9mdk0.setAll(input, {
      opacity: '0',
      position: 'absolute',
      top: '-1000px',
      left: '-1000px'
    });
    $_ghqowmy1jcg9mdef.append(parent, input);
    $_g6scf1yfjcg9mdfg.focus(input);
    operation(input);
    $_9le0u1y4jcg9mdep.remove(input);
  };
  var $_98jlxc15rjcg9meeo = { input: input };

  var VIEW_MARGIN = 5;
  var register$2 = function (toolstrip, socket, container, outerWindow, structure, cWin) {
    var scroller = BackgroundActivity(function (y) {
      return $_6mzr9r15ejcg9medi.moveWindowScroll(toolstrip, socket, y);
    });
    var scrollBounds = function () {
      var rects = $_e2ye6p13vjcg9me5l.getRectangles(cWin);
      return $_gb5srhw9jcg9md90.from(rects[0]).bind(function (rect) {
        var viewTop = rect.top() - socket.dom().scrollTop;
        var outside = viewTop > outerWindow.innerHeight + VIEW_MARGIN || viewTop < -VIEW_MARGIN;
        return outside ? $_gb5srhw9jcg9md90.some({
          top: $_7bfl0mwajcg9md92.constant(viewTop),
          bottom: $_7bfl0mwajcg9md92.constant(viewTop + rect.height())
        }) : $_gb5srhw9jcg9md90.none();
      });
    };
    var scrollThrottle = $_49m7ou14jjcg9me89.last(function () {
      scroller.idle(function () {
        $_ecqd7m15ojcg9meeg.updatePositions(container, outerWindow.pageYOffset).get(function () {
          var extraScroll = scrollBounds();
          extraScroll.each(function (extra) {
            socket.dom().scrollTop = socket.dom().scrollTop + extra.top();
          });
          scroller.start(0);
          structure.refresh();
        });
      });
    }, 1000);
    var onScroll = $_decepq13jjcg9me3x.bind($_41aqpdwsjcg9md9w.fromDom(outerWindow), 'scroll', function () {
      if (outerWindow.pageYOffset < 0) {
        return;
      }
      scrollThrottle.throttle();
    });
    $_ecqd7m15ojcg9meeg.updatePositions(container, outerWindow.pageYOffset).get($_7bfl0mwajcg9md92.identity);
    return { unbind: onScroll.unbind };
  };
  var setup$3 = function (bag) {
    var cWin = bag.cWin();
    var ceBody = bag.ceBody();
    var socket = bag.socket();
    var toolstrip = bag.toolstrip();
    var toolbar = bag.toolbar();
    var contentElement = bag.contentElement();
    var keyboardType = bag.keyboardType();
    var outerWindow = bag.outerWindow();
    var dropup = bag.dropup();
    var structure = $_5nekx615jjcg9medu.takeover(socket, ceBody, toolstrip, dropup);
    var keyboardModel = keyboardType(bag.outerBody(), cWin, $_6n4ng7y6jcg9mdet.body(), contentElement, toolstrip, toolbar);
    var toEditing = function () {
      keyboardModel.toEditing();
      clearSelection();
    };
    var toReading = function () {
      keyboardModel.toReading();
    };
    var onToolbarTouch = function (event) {
      keyboardModel.onToolbarTouch(event);
    };
    var onOrientation = $_4u2xx713ijcg9me3r.onChange(outerWindow, {
      onChange: $_7bfl0mwajcg9md92.noop,
      onReady: structure.refresh
    });
    onOrientation.onAdjustment(function () {
      structure.refresh();
    });
    var onResize = $_decepq13jjcg9me3x.bind($_41aqpdwsjcg9md9w.fromDom(outerWindow), 'resize', function () {
      if (structure.isExpanding()) {
        structure.refresh();
      }
    });
    var onScroll = register$2(toolstrip, socket, bag.outerBody(), outerWindow, structure, cWin);
    var unfocusedSelection = FakeSelection(cWin, contentElement);
    var refreshSelection = function () {
      if (unfocusedSelection.isActive()) {
        unfocusedSelection.update();
      }
    };
    var highlightSelection = function () {
      unfocusedSelection.update();
    };
    var clearSelection = function () {
      unfocusedSelection.clear();
    };
    var scrollIntoView = function (top, bottom) {
      $_cebbl115njcg9meee.scrollIntoView(cWin, socket, dropup, top, bottom);
    };
    var syncHeight = function () {
      $_bctu7wzrjcg9mdk0.set(contentElement, 'height', contentElement.dom().contentWindow.document.body.scrollHeight + 'px');
    };
    var setViewportOffset = function (newYOffset) {
      structure.setViewportOffset(newYOffset);
      $_6mzr9r15ejcg9medi.moveOnlyTop(socket, newYOffset).get($_7bfl0mwajcg9md92.identity);
    };
    var destroy = function () {
      structure.restore();
      onOrientation.destroy();
      onScroll.unbind();
      onResize.unbind();
      keyboardModel.destroy();
      unfocusedSelection.destroy();
      $_98jlxc15rjcg9meeo.input($_6n4ng7y6jcg9mdet.body(), $_g6scf1yfjcg9mdfg.blur);
    };
    return {
      toEditing: toEditing,
      toReading: toReading,
      onToolbarTouch: onToolbarTouch,
      refreshSelection: refreshSelection,
      clearSelection: clearSelection,
      highlightSelection: highlightSelection,
      scrollIntoView: scrollIntoView,
      updateToolbarPadding: $_7bfl0mwajcg9md92.noop,
      setViewportOffset: setViewportOffset,
      syncHeight: syncHeight,
      refreshStructure: structure.refresh,
      destroy: destroy
    };
  };
  var $_9rc0az15ajcg9mecr = { setup: setup$3 };

  var stubborn = function (outerBody, cWin, page, frame) {
    var toEditing = function () {
      $_9uyrzv15cjcg9meda.resume(cWin, frame);
    };
    var toReading = function () {
      $_98jlxc15rjcg9meeo.input(outerBody, $_g6scf1yfjcg9mdfg.blur);
    };
    var captureInput = $_decepq13jjcg9me3x.bind(page, 'keydown', function (evt) {
      if (!$_gcfqi6w8jcg9md8v.contains([
          'input',
          'textarea'
        ], $_97hwf5xwjcg9mddy.name(evt.target()))) {
        toEditing();
      }
    });
    var onToolbarTouch = function () {
    };
    var destroy = function () {
      captureInput.unbind();
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: destroy
    };
  };
  var timid = function (outerBody, cWin, page, frame) {
    var dismissKeyboard = function () {
      $_g6scf1yfjcg9mdfg.blur(frame);
    };
    var onToolbarTouch = function () {
      dismissKeyboard();
    };
    var toReading = function () {
      dismissKeyboard();
    };
    var toEditing = function () {
      $_9uyrzv15cjcg9meda.resume(cWin, frame);
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: $_7bfl0mwajcg9md92.noop
    };
  };
  var $_8vze9115sjcg9meeu = {
    stubborn: stubborn,
    timid: timid
  };

  var create$7 = function (platform, mask) {
    var meta = $_9huvpt14gjcg9me7s.tag();
    var priorState = $_7psgdg129jcg9mdwe.value();
    var scrollEvents = $_7psgdg129jcg9mdwe.value();
    var iosApi = $_7psgdg129jcg9mdwe.api();
    var iosEvents = $_7psgdg129jcg9mdwe.api();
    var enter = function () {
      mask.hide();
      var doc = $_41aqpdwsjcg9md9w.fromDom(document);
      $_6cxiez14ejcg9me7d.getActiveApi(platform.editor).each(function (editorApi) {
        priorState.set({
          socketHeight: $_bctu7wzrjcg9mdk0.getRaw(platform.socket, 'height'),
          iframeHeight: $_bctu7wzrjcg9mdk0.getRaw(editorApi.frame(), 'height'),
          outerScroll: document.body.scrollTop
        });
        scrollEvents.set({ exclusives: $_fqgkzt14pjcg9me99.exclusive(doc, '.' + $_bg1a2213gjcg9me3k.scrollable()) });
        $_eb18ucxtjcg9mddr.add(platform.container, $_3sfngaz0jcg9mdhj.resolve('fullscreen-maximized'));
        $_7shz2014fjcg9me7k.clobberStyles(platform.container, editorApi.body());
        meta.maximize();
        $_bctu7wzrjcg9mdk0.set(platform.socket, 'overflow', 'scroll');
        $_bctu7wzrjcg9mdk0.set(platform.socket, '-webkit-overflow-scrolling', 'touch');
        $_g6scf1yfjcg9mdfg.focus(editorApi.body());
        var setupBag = $_ahnnvkxljcg9mddc.immutableBag([
          'cWin',
          'ceBody',
          'socket',
          'toolstrip',
          'toolbar',
          'dropup',
          'contentElement',
          'cursor',
          'keyboardType',
          'isScrolling',
          'outerWindow',
          'outerBody'
        ], []);
        iosApi.set($_9rc0az15ajcg9mecr.setup(setupBag({
          cWin: editorApi.win(),
          ceBody: editorApi.body(),
          socket: platform.socket,
          toolstrip: platform.toolstrip,
          toolbar: platform.toolbar,
          dropup: platform.dropup.element(),
          contentElement: editorApi.frame(),
          cursor: $_7bfl0mwajcg9md92.noop,
          outerBody: platform.body,
          outerWindow: platform.win,
          keyboardType: $_8vze9115sjcg9meeu.stubborn,
          isScrolling: function () {
            return scrollEvents.get().exists(function (s) {
              return s.socket.isScrolling();
            });
          }
        })));
        iosApi.run(function (api) {
          api.syncHeight();
        });
        iosEvents.set($_in1j159jcg9meck.initEvents(editorApi, iosApi, platform.toolstrip, platform.socket, platform.dropup));
      });
    };
    var exit = function () {
      meta.restore();
      iosEvents.clear();
      iosApi.clear();
      mask.show();
      priorState.on(function (s) {
        s.socketHeight.each(function (h) {
          $_bctu7wzrjcg9mdk0.set(platform.socket, 'height', h);
        });
        s.iframeHeight.each(function (h) {
          $_bctu7wzrjcg9mdk0.set(platform.editor.getFrame(), 'height', h);
        });
        document.body.scrollTop = s.scrollTop;
      });
      priorState.clear();
      scrollEvents.on(function (s) {
        s.exclusives.unbind();
      });
      scrollEvents.clear();
      $_eb18ucxtjcg9mddr.remove(platform.container, $_3sfngaz0jcg9mdhj.resolve('fullscreen-maximized'));
      $_7shz2014fjcg9me7k.restoreStyles();
      $_bg1a2213gjcg9me3k.deregister(platform.toolbar);
      $_bctu7wzrjcg9mdk0.remove(platform.socket, 'overflow');
      $_bctu7wzrjcg9mdk0.remove(platform.socket, '-webkit-overflow-scrolling');
      $_g6scf1yfjcg9mdfg.blur(platform.editor.getFrame());
      $_6cxiez14ejcg9me7d.getActiveApi(platform.editor).each(function (editorApi) {
        editorApi.clearSelection();
      });
    };
    var refreshStructure = function () {
      iosApi.run(function (api) {
        api.refreshStructure();
      });
    };
    return {
      enter: enter,
      refreshStructure: refreshStructure,
      exit: exit
    };
  };
  var $_dnsllv158jcg9mecc = { create: create$7 };

  var produce$1 = function (raw) {
    var mobile = $_96sv3hxgjcg9mdco.asRawOrDie('Getting IosWebapp schema', MobileSchema, raw);
    $_bctu7wzrjcg9mdk0.set(mobile.toolstrip, 'width', '100%');
    $_bctu7wzrjcg9mdk0.set(mobile.container, 'position', 'relative');
    var onView = function () {
      mobile.setReadOnly(true);
      mode.enter();
    };
    var mask = $_6yv6bm12jjcg9mdxu.build($_fhgviv14ijcg9me83.sketch(onView, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function () {
        mobile.alloy.add(mask);
      },
      hide: function () {
        mobile.alloy.remove(mask);
      }
    };
    var mode = $_dnsllv158jcg9mecc.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: mode.refreshStructure,
      enter: mode.enter,
      exit: mode.exit,
      destroy: $_7bfl0mwajcg9md92.noop
    };
  };
  var $_83lozc157jcg9mec7 = { produce: produce$1 };

  var IosRealm = function (scrollIntoView) {
    var alloy = OuterContainer({ classes: [$_3sfngaz0jcg9mdhj.resolve('ios-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = $_7psgdg129jcg9mdwe.api();
    var switchToEdit = $_8485fq14qjcg9me9e.makeEditSwitch(webapp);
    var socket = $_8485fq14qjcg9me9e.makeSocket();
    var dropup = $_dxyv0k14rjcg9me9l.build(function () {
      webapp.run(function (w) {
        w.refreshStructure();
      });
    }, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function () {
      toolbar.focus();
    };
    var restoreToolbar = function () {
      toolbar.restoreToolbar();
    };
    var init = function (spec) {
      webapp.set($_83lozc157jcg9mec7.produce(spec));
    };
    var exit = function () {
      webapp.run(function (w) {
        Replacing.remove(socket, switchToEdit);
        w.exit();
      });
    };
    var updateMode = function (readOnly) {
      $_8485fq14qjcg9me9e.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: $_7bfl0mwajcg9md92.constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: $_7bfl0mwajcg9md92.constant(socket),
      dropup: $_7bfl0mwajcg9md92.constant(dropup)
    };
  };

  var EditorManager = tinymce.util.Tools.resolve('tinymce.EditorManager');

  var derive$4 = function (editor) {
    var base = $_1ohhokx5jcg9mdbm.readOptFrom(editor.settings, 'skin_url').fold(function () {
      return EditorManager.baseURL + '/skins/' + 'lightgray';
    }, function (url) {
      return url;
    });
    return {
      content: base + '/content.mobile.min.css',
      ui: base + '/skin.mobile.min.css'
    };
  };
  var $_ybuwn15tjcg9mef0 = { derive: derive$4 };

  var fontSizes = [
    'x-small',
    'small',
    'medium',
    'large',
    'x-large'
  ];
  var fireChange$1 = function (realm, command, state) {
    realm.system().broadcastOn([$_g1ca6bynjcg9mdfu.formatChanged()], {
      command: command,
      state: state
    });
  };
  var init$5 = function (realm, editor) {
    var allFormats = $_9is1m7wzjcg9mdag.keys(editor.formatter.get());
    $_gcfqi6w8jcg9md8v.each(allFormats, function (command) {
      editor.formatter.formatChanged(command, function (state) {
        fireChange$1(realm, command, state);
      });
    });
    $_gcfqi6w8jcg9md8v.each([
      'ul',
      'ol'
    ], function (command) {
      editor.selection.selectorChanged(command, function (state, data) {
        fireChange$1(realm, command, state);
      });
    });
  };
  var $_1hqr0s15vjcg9mef2 = {
    init: init$5,
    fontSizes: $_7bfl0mwajcg9md92.constant(fontSizes)
  };

  var fireSkinLoaded = function (editor) {
    var done = function () {
      editor._skinLoaded = true;
      editor.fire('SkinLoaded');
    };
    return function () {
      if (editor.initialized) {
        done();
      } else {
        editor.on('init', done);
      }
    };
  };
  var $_bu3qxo15wjcg9mef5 = { fireSkinLoaded: fireSkinLoaded };

  var READING = $_7bfl0mwajcg9md92.constant('toReading');
  var EDITING = $_7bfl0mwajcg9md92.constant('toEditing');
  ThemeManager.add('mobile', function (editor) {
    var renderUI = function (args) {
      var cssUrls = $_ybuwn15tjcg9mef0.derive(editor);
      if ($_6azauymjcg9mdft.isSkinDisabled(editor) === false) {
        editor.contentCSS.push(cssUrls.content);
        DOMUtils.DOM.styleSheetLoader.load(cssUrls.ui, $_bu3qxo15wjcg9mef5.fireSkinLoaded(editor));
      } else {
        $_bu3qxo15wjcg9mef5.fireSkinLoaded(editor)();
      }
      var doScrollIntoView = function () {
        editor.fire('scrollIntoView');
      };
      var wrapper = $_41aqpdwsjcg9md9w.fromTag('div');
      var realm = $_37ytsswfjcg9md9a.detect().os.isAndroid() ? AndroidRealm(doScrollIntoView) : IosRealm(doScrollIntoView);
      var original = $_41aqpdwsjcg9md9w.fromDom(args.targetNode);
      $_ghqowmy1jcg9mdef.after(original, wrapper);
      $_24go32y0jcg9mde6.attachSystem(wrapper, realm.system());
      var findFocusIn = function (elem) {
        return $_g6scf1yfjcg9mdfg.search(elem).bind(function (focused) {
          return realm.system().getByDom(focused).toOption();
        });
      };
      var outerWindow = args.targetNode.ownerDocument.defaultView;
      var orientation = $_4u2xx713ijcg9me3r.onChange(outerWindow, {
        onChange: function () {
          var alloy = realm.system();
          alloy.broadcastOn([$_g1ca6bynjcg9mdfu.orientationChanged()], { width: $_4u2xx713ijcg9me3r.getActualWidth(outerWindow) });
        },
        onReady: $_7bfl0mwajcg9md92.noop
      });
      var setReadOnly = function (readOnlyGroups, mainGroups, ro) {
        if (ro === false) {
          editor.selection.collapse();
        }
        realm.setToolbarGroups(ro ? readOnlyGroups.get() : mainGroups.get());
        editor.setMode(ro === true ? 'readonly' : 'design');
        editor.fire(ro === true ? READING() : EDITING());
        realm.updateMode(ro);
      };
      var bindHandler = function (label, handler) {
        editor.on(label, handler);
        return {
          unbind: function () {
            editor.off(label);
          }
        };
      };
      editor.on('init', function () {
        realm.init({
          editor: {
            getFrame: function () {
              return $_41aqpdwsjcg9md9w.fromDom(editor.contentAreaContainer.querySelector('iframe'));
            },
            onDomChanged: function () {
              return { unbind: $_7bfl0mwajcg9md92.noop };
            },
            onToReading: function (handler) {
              return bindHandler(READING(), handler);
            },
            onToEditing: function (handler) {
              return bindHandler(EDITING(), handler);
            },
            onScrollToCursor: function (handler) {
              editor.on('scrollIntoView', function (tinyEvent) {
                handler(tinyEvent);
              });
              var unbind = function () {
                editor.off('scrollIntoView');
                orientation.destroy();
              };
              return { unbind: unbind };
            },
            onTouchToolstrip: function () {
              hideDropup();
            },
            onTouchContent: function () {
              var toolbar = $_41aqpdwsjcg9md9w.fromDom(editor.editorContainer.querySelector('.' + $_3sfngaz0jcg9mdhj.resolve('toolbar')));
              findFocusIn(toolbar).each($_4wv38zwujcg9mda1.emitExecute);
              realm.restoreToolbar();
              hideDropup();
            },
            onTapContent: function (evt) {
              var target = evt.target();
              if ($_97hwf5xwjcg9mddy.name(target) === 'img') {
                editor.selection.select(target.dom());
                evt.kill();
              } else if ($_97hwf5xwjcg9mddy.name(target) === 'a') {
                var component = realm.system().getByDom($_41aqpdwsjcg9md9w.fromDom(editor.editorContainer));
                component.each(function (container) {
                  if (Swapping.isAlpha(container)) {
                    $_5tkgezyljcg9mdft.openLink(target.dom());
                  }
                });
              }
            }
          },
          container: $_41aqpdwsjcg9md9w.fromDom(editor.editorContainer),
          socket: $_41aqpdwsjcg9md9w.fromDom(editor.contentAreaContainer),
          toolstrip: $_41aqpdwsjcg9md9w.fromDom(editor.editorContainer.querySelector('.' + $_3sfngaz0jcg9mdhj.resolve('toolstrip'))),
          toolbar: $_41aqpdwsjcg9md9w.fromDom(editor.editorContainer.querySelector('.' + $_3sfngaz0jcg9mdhj.resolve('toolbar'))),
          dropup: realm.dropup(),
          alloy: realm.system(),
          translate: $_7bfl0mwajcg9md92.noop,
          setReadOnly: function (ro) {
            setReadOnly(readOnlyGroups, mainGroups, ro);
          }
        });
        var hideDropup = function () {
          realm.dropup().disappear(function () {
            realm.system().broadcastOn([$_g1ca6bynjcg9mdfu.dropupDismissed()], {});
          });
        };
        $_6ezsyby7jcg9mdey.registerInspector('remove this', realm.system());
        var backToMaskGroup = {
          label: 'The first group',
          scrollable: false,
          items: [$_fwn33tz1jcg9mdhl.forToolbar('back', function () {
              editor.selection.collapse();
              realm.exit();
            }, {})]
        };
        var backToReadOnlyGroup = {
          label: 'Back to read only',
          scrollable: false,
          items: [$_fwn33tz1jcg9mdhl.forToolbar('readonly-back', function () {
              setReadOnly(readOnlyGroups, mainGroups, true);
            }, {})]
        };
        var readOnlyGroup = {
          label: 'The read only mode group',
          scrollable: true,
          items: []
        };
        var features = $_3cxd3lyojcg9mdfw.setup(realm, editor);
        var items = $_3cxd3lyojcg9mdfw.detect(editor.settings, features);
        var actionGroup = {
          label: 'the action group',
          scrollable: true,
          items: items
        };
        var extraGroup = {
          label: 'The extra group',
          scrollable: false,
          items: []
        };
        var mainGroups = Cell([
          backToReadOnlyGroup,
          actionGroup,
          extraGroup
        ]);
        var readOnlyGroups = Cell([
          backToMaskGroup,
          readOnlyGroup,
          extraGroup
        ]);
        $_1hqr0s15vjcg9mef2.init(realm, editor);
      });
      return {
        iframeContainer: realm.socket().element().dom(),
        editorContainer: realm.element().dom()
      };
    };
    return {
      getNotificationManagerImpl: function () {
        return {
          open: $_7bfl0mwajcg9md92.identity,
          close: $_7bfl0mwajcg9md92.noop,
          reposition: $_7bfl0mwajcg9md92.noop,
          getArgs: $_7bfl0mwajcg9md92.identity
        };
      },
      renderUI: renderUI
    };
  });
  var Theme = function () {
  };

  return Theme;

}());
})()
