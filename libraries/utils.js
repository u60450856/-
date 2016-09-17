// ==UserScript==
// @name          Botva - Utils
// _require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==
'use strict';
var w = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;
// http://jsperf.com/32-bit-hash/6
// http://jsperf.com/hashcode1234567890
var hashCode = {};
  hashCode.verbose = function(s) { // verbose == JavaDJB2
    var hash = 0, i, l = s.length, char;
    if (l == 0) return hash;
    for (i = 0; i < l; i++) {
      char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
  hashCode.numbers=function(s) {
    var hash = 0, i, l = s.length, char;
    for (i = 0; i < l; i++) {
      char = s.charCodeAt(i);
      hash = hash * 31 + char;
    }
    return hash;
  }
  hashCode.hashFnv32a = function(s) {
    s = s || '';
    var i, l, hash = 0x811c9dc5;
    for (i = 0, l = s.length; i < l; i++) {
      hash ^= s.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  }
//hashCode = hashCode.verbose;
//hashCode = hashCode.numbers;
hashCode = hashCode.hashFnv32a; // Fastest
if(typeof isUrl == 'undefined'){
  var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
  /*
  var isUrl = function (string){ return matcher.test(string); };
  */
  var isUrl = string => matcher.test(string);
}
// Escape RegExp characters
if (!('escape' in RegExp)){
  RegExp.escape = function(str) {
    //return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
}
if (!('replaceMultiple' in String)){
  String.replaceMultiple = function(str,map,reOptions){
    reOptions = reOptions || 'gi';
    if ((typeof map !== 'object') || (typeof str !== 'string')){
      return str;
    }
    var n = Object.keys(map);
    if(n.length<=0){
      return str;
    }
    for(var i=0;i<n.length;i++){
      n[i]=RegExp.escape(n[i]);
    };
    n=n.join('|');
    var re = new RegExp(n, reOptions)
    var t=str.replace(re,function(a){return map[a];});
    return t;
  }
}
// UTF-8 encode / decode by Johan Sundstr?m
function encode_utf8( s ){
  return unescape( encodeURIComponent( s ) );
}
function decode_utf8( s ) {
  return decodeURIComponent( escape( s ) );
}
var DMap = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190};
//function unicodeToWin1251_UrlEncoded(s) {
function encodeURIComponentAsWin1251(s) {
    s =s || '';
    var L = [];
    for (var i=0; i<s.length; i++) {
        var ord = s.charCodeAt(i);
        if (!(ord in DMap))
            throw "Character "+s.charAt(i)+" isn't supported by win1251!";
        L.push('%'+DMap[ord].toString(16));
    }
    return L.join('').toUpperCase();
}
function encodeWin1251(s) {
    var L = [];
    for (var i=0; i<s.length; i++) {
        var ord = s.charCodeAt(i);
        if (!(ord in DMap))
            throw "Character "+s.charAt(i)+" isn't supported by win1251!";
        //L.push(DMap[ord].toString(16));
        L.push(String.fromCharCode(DMap[ord]));
    }
    return L.join('').toUpperCase();
}
//querySelector
var $$ = function(query, context, all) {
  context = context || document;
  if (typeof all !== 'boolean'){
    all = all || true;
  }
  //var result = context.querySelectorAll(query);
  var result = false;
  if (all){
    result = context.querySelectorAll(query);
    result = [].slice.call(result);
  }else {
    result = context.querySelector(query);
  }
  return result;
}
// Jquery from current page
var $ = function(){};
if(typeof w.jQuery != 'undefined'){$=w.jQuery;}
var closest = function(el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.bind(el)(selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return false;
}
var safeHTML = function(html){
    if(html) {
     // html = html.replace(/(<\/?)(?:script|noscript|style|link|object|iframe)[^>]*/g,'$1pre');
     // inline style
     //html = html.replace(/(\bstyle\s?=["'][^"']+["'])/g,'');
     // inline event handlers
     // html = html.replace(/(\bon.+?\s?=["'][^"']+["'])/g,'');
     // link tag
     //html = html.replace(/(<link[^>]+>)/g,'');
     html = html.replace(/(\bstyle\s?=["'][^"']+["']|<link[^>]+>)/g,'');

     html = html.replace(/(<\/?)(?:script|noscript|style|object|iframe)[^>]*/g,'$1pre');
     //html = html.replace(/(<\/?)(?:script|noscript|style|object|iframe|img)[^>]*/g,'$1pre');
    }
    return html;
};
var HtmlToDom =function(html,safe){
  if(typeof safe == 'undefined'){ safe = true; }
  if(html){
    //if(safe) html = html.replace(/(<\/?)(?:script|noscript|style|link|object|iframe)[^>]*/g,'$1pre');
    if(safe) html = safeHTML(html);
    var range = document.createRange();
        range.selectNode(document.body);
        return range.createContextualFragment( html );
  }
};
var parseHTML =function(html,safe){
  if(typeof safe == 'undefined'){ safe = false; }
  if(html){
    if(safe) html = safeHTML(html);
    var parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }
};
var stripslashes = function(str) {
  return (str + '')
    .replace(/\\(.?)/g, function (s, n1) {
      switch (n1) {
        case '\\': return '\\';
        case '0' : return '\u0000';
        case ''  : return '';
        default  : return n1;
      }
    });
}
var addJS_Node = function(text, s_URL, funcToRun, runOnLoad,id,target) {
  'use strict';
  var D          = document;
  var scriptNode = D.createElement ('script');
  if (runOnLoad) {
    //--- Doesn't always fire on Chrome. Needs @run-at document-start.
    scriptNode.addEventListener ("load", runOnLoad, false);
  }
  scriptNode.type                         = "text/javascript";
  /*
  if (text)       scriptNode.textContent  = text;
  if (s_URL)      scriptNode.src          = s_URL;
  if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')();';
  */
  if (text)       scriptNode.appendChild(D.createTextNode("(" + text + ")();"));
  if (s_URL)      scriptNode.src          = s_URL;
  if (funcToRun)  scriptNode.appendChild(D.createTextNode("(" + funcToRun.toString() + ")();"));
  if(id){scriptNode.setAttribute('name',id);}
  //var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
  //var targ = D.body || D.documentElement;
  var targ = target || D.body || D.documentElement;
  targ.appendChild (scriptNode);
}
if(typeof injectJS == 'undefined'){
  var injectJS = addJS_Node;
}
if(typeof injectCSS == 'undefined'){
  var injectCSS = function(text,url,id,target){
        'use strict';
        text = text || false;
        url  = url  || false;
        if (!text && !url) { return; }
        var styleNode;
        if(text){
          styleNode = document.createElement ('style');
          styleNode.textContent  = text;
        }else if(url){
          styleNode = document.createElement ('link');
          if(url){styleNode.href = url;}
        }
        Object.assign(styleNode,{
                        type : 'text/css',
                        rel  : 'stylesheet',
                      });
        //styleNode.setAttribute('type','text/css');
        //styleNode.setAttribute('rel','stylesheet');
        if(id){styleNode.setAttribute('name',id);}

        var targ = target || document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (styleNode);
    };
}
var escapeQuotes = function(string){return string.replace(/(["'])/g, '\\$1');}
var unescapeQuotes = function(string){return string.replace(/\\(["'])/g, '$1');}

var obj_to_query = function(obj, replacements,win1251) {
  win1251 = win1251 || false;
  var parts = [], value; replacements = replacements || {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      value = replacements[obj[key]] || obj[key];
      if(!win1251){
        parts.push(encodeURIComponent(key)+'='+encodeURIComponent(value));
      } else {
        parts.push(encodeURIComponentAsWin1251(key)+'='+encodeURIComponentAsWin1251(value));
      }
    }
  }
  return parts.join('&');
};

var rand_range  = function( min, max ) {
  var result = 0;
  if(max) {result = Math.floor(Math.random() * (max - min + 1)) + min;}
   else   {result = Math.floor(Math.random() * (min + 1));}

  return result;
};

var reloadSoft = function(){
  var addr = document.location.toString();
  if(addr.indexOf('?')==-1){
    addr+='?';
  }
  if(addr.indexOf('r2=')==-1){
    addr += '&r2='+Math.floor(Math.random()*1000);
  }else{
    //addr = addr.replace(/(.*?r2=)\d+(.*)/,'$1'+Math.floor(Math.random()*1000)+'$2');
    addr = addr.replace(/([&]?r2=\d+)/g,'');
    addr += '&r2='+Math.floor(Math.random()*1000);
  }
  addr = addr.replace('?&','?');
  document.location = addr;
};

var GetUrl = function(url, callbacks, options) {
  var CALLS_MAX = 4;
  var _options = {
        id:'',
        retry: CALLS_MAX,
        method:'GET',
        synchronous: false,
        headers: GM_AJAXHEADER,
        data: null,
      };
  try {
    Object.assign(_options, options);
  } finally { }
  //var _h = {};
  //Object.assign(_h, this.headers,_options.headers);
  var _calls = 0;
  var _callbacks = callbacks || [];
  this.method      = _options.method;
  this.headers     = _options.headers;
  //Object.assign(_options, options);
  this.synchronous = _options.synchronous;
  this.data        = _options.data || null;
  this.id          = _options.id;
  this.url         = url;
  this.onerror = function(response){
    //var calldata = {id: id,cmd: 'error'}; // cmd: [ok|fail|error]
    //_callbacks.forEach(function(c){if(typeof c==='function')c([false,calldata]);});
    console.log('error: ', _options.id);
    _calls = 0;
  };
  this.onload = function(response){
    _calls++;
    var status = false;
    var calldata = {id: _options.id||'',cmd: 'error',data: ''}; // cmd: [ok|fail|error]
    if(response.status==200 && response.statusText==='OK'){
      calldata.cmd = 'ok';
      status = true;
      calldata.data = response.responseText;
    }else if (response.status==503){
      calldata.cmd = 'fail';
    }else{
      calldata.cmd = 'error';
    }
    //console.log(calldata.cmd+': ', calldata.id, response.status, calldata);
    if(calldata.cmd == 'fail' && _calls < CALLS_MAX){
      //console.log(response, this);
      GM_xmlhttpRequest(this);
      //this.init();
    } else {
      _calls = 0;
      _callbacks.forEach(function(c){if(typeof c==='function')c([status,calldata]);});
    }
    return;
  };
  this.addCSRF_header =function(data){
    if (typeof data !== 'string'){
      try {
        var csrf = document.querySelector('meta[name=csrf-token][content]');
        data = csrf.getAttribute('content');
      }finally{};
    }
    if (typeof data === 'string'){
      this.headers['X-CSRF-Token'] = data;
      return data;
    }
  };
  this.init = function(callbacks){
    _callbacks = callbacks || _callbacks || [];
    var t = {
      'context'    : this,
      'method'     : this.method,
      'synchronous': this.synchronous,
      'url'        : this.url,
      'onerror'    : this.onerror,
      'onload'     : this.onload,
      'headers'    : this.headers || GM_AJAXHEADER,
      'data'       : this.data,
    };
    GM_xmlhttpRequest(t);
  };
};

var Config = function(owner,options){
  var _options = {type: 'browser'// [site,browser]
                //,local: true = site, false = browser
                  };

  this.type = _options.type;
  this.data = {};
  this.load = function(param,local) {
    param = typeof param === 'string' ? param    : false;
    local = typeof local !== 'undefined' ? local : true;
    var r, f, storage, ls = window.localStorage;
    storage = local ? (ls || null) : (gmStorage || null);

    // загружаем данные из хранилища
    var tmp = storage.getItem(param);
    if ((typeof tmp !== 'undefined') && tmp !== null){
      tmp = JSON.parse(tmp);
    } else {
      tmp = null;
    }
    if(owner && typeof owner.data !=='undefined'){
      owner.data = tmp;
    }
    return tmp;
  };// load
  this.save = function(param,value,local) {
    param = typeof param === 'string' ? param    : false;
    local = typeof local !== 'undefined' ? local : true;

    var r, f, storage, ls = window.localStorage;
    storage = local ? (ls || null) : (gmStorage || null);
    f = (value !== null) ? 'setItem' : 'removeItem';
    if (typeof value === 'boolean') value = owner.data;
    // сохраняем данные
    try {
      storage[f](param, JSON.stringify(value));
    } catch(e) {
        if(e.name == "NS_ERROR_FILE_CORRUPTED") {
          console.log("Sorry, it looks like your browser storage has been corrupted. Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to 'Everything'. This will remove the corrupted browser storage across all sites.");
        }
    }
  };// save
};
var AlertMe = function (message) {
    var oldTitle = document.title;
    var msg = message;
    var timeoutId;
    var blink = function() { document.title = document.title == msg ? ' ' : msg; };
    var clear = function() {
        clearInterval(timeoutId);
        document.title = oldTitle;
        window.onmousemove = null;
        timeoutId = null;
    };
    this.exec = function (message) {
        if(typeof message === 'string'){
          msg = message;
        }
        if (!timeoutId) {
            timeoutId = setInterval(blink, 1000);
            window.onmousemove = clear;
        }
    };
};
var notifyMe = function (text, options) {
  function grantPermission(){
    if (("Notification" in window) && (Notification.permission !== "granted") && (Notification.permission !== 'denied')) {
      Notification.requestPermission();
    }
  }

  if(typeof text !== 'string'){ text = false; }
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    if(text){
      var alarm = new AlertMe(text);
      alarm.exec();
    }
  }
  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
  if(!text){ grantPermission();return; }
    // If it's okay let's create a notification
    var notification = new Notification(text, options);
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    if(!text){ grantPermission();return; }
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(text, options);
      }
    });
  }
}

var soundTest = function (id, src) {
  src = src || false;
  var beep = (function () {
    var ctx = new(window.AudioContext || window.webkitAudioContext);
    return function (duration, type, finishedCallback) {
    duration = +duration;
    // Only 0-4 are valid types.
    type = (type % 5) || 0;
    if (typeof finishedCallback != "function") {
    finishedCallback = function () {};
    }
    var osc = ctx.createOscillator();
    osc.type = type;
    osc.connect(ctx.destination);
    osc.noteOn(0);
    setTimeout(function () {
    osc.noteOff(0);
    finishedCallback();
    }, duration);
    };
  })();
  function test1 (){
    var a = new Audio(src);
    a.play();
    alert('Ду-ду-ду!');
  }
  function test2 (){
    var a = document.createElement('audio');
    a.preload = 'auto';
    a.src = src;
    a.play();
    alert('Ду-ду-ду!');
  }
  function test3 (){
    if (!("AudioContext" in window)) { return; }
    var context = new (window.AudioContext || window.webkitAudioContext)();
    if (!("createOscillator" in context)) { return; }
    try {
    var a = context.createOscillator();
        a.type = 'sine';
        a.frequency.value = 261.63;
        a.connect(context.destination);

    // Star the sound
    a.start(0);
    // Play the sound for a second before stopping it
    setTimeout(function() { a.stop(0); }, 1000);
    } finally {
    }
    alert('Ду-ду-ду!');
  }
  function test4 (){
    if (!("AudioContext" in window)) { return; }
    beep();
    alert('Ду-ду-ду!');
  }
  switch(true){
    case (id === 1 && src !== false):
      test1();
    break;
    case (id === 2 && src !== false):
      test2();
    break;
    case (id === 3 && ("AudioContext" in window)):
      test3();
    break;
    default:
      alert('Не могу проиграть звук.');
  }
};