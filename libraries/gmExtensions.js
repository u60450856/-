// ==UserScript==
// @name          gmExtensions
// _require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// _grant GM_getValue
// _grant GM_setValue
// _grant GM_deleteValue
// _grant GM_info
// ==/UserScript==
  'use strict';
  //GM_getMetadata("name");
  var GM_meta = function(name){
    if (typeof name!=='string') return null;
    if (typeof GM_getMetadata!=='undefined') return GM_getMetadata(name);
    //return GM_info.script.name;
      //var re = /^.+@id\s+(.*)\s*$/mg,
      var re = new RegExp('^.+@'+name+'\\s+(.*)\\s*$','img');
      var match = re.exec(GM_info.scriptMetaStr);
          return match && match[1] || '';
  };

  var w = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;
  var gmStorage = {
    getItem:    GM_getValue,
    setItem:    GM_setValue,
    removeItem: GM_deleteValue,
  };
  if(typeof unsafeWindow.console != 'undefined'){
    var GM_log = unsafeWindow.console.log;
  }
  if(typeof GM_xpath == 'undefined'){
    var GM_xpath = function (details) {
        var contextNode, contextDocument, paths, resolver, namespace, result;

        if (typeof details == 'string') {
          details = { path: details };
        }

        contextNode = "node" in details ? details.node : document;
        if (!contextNode) {
          throw new Error("The value specified for node is invalid");
        }

        if (contextNode.ownerDocument) {
          contextDocument = contextNode.ownerDocument;
        }
        else if (contextNode.evaluate) {
          // contextNode is a Document already
          contextDocument = contextNode;
        }
        else {
          throw new Error("No owning document for the specified node. Make sure you pass a valid node!");
        }

        paths = details.paths || details.path;
        if (typeof paths == "string") {
          paths = [paths];
        }

        if (details.resolver) {
          if (typeof details.resolver == "string") {
            //resolver = {lookupNamespaceURI: function(p) details.resolver};
            resolver = {lookupNamespaceURI: function(p){ return details.resolver;}};
          }
          else if (typeof details.resolver == "function") {
            resolver = {lookupNamespaceURI: details.resolver};
          }
          else if (typeof resolver.lookupNamespaceURI == "function") {
            resolver = details.resolver;
          }
          else {
            throw new Error("resolver is invalid");
          }
        }
        else if (contextNode.namepaceURI) {
          namespace = contextNode.namespaceURI;
          //resolver = {lookupNamespaceURI: function(p) namespace};
          resolver = {lookupNamespaceURI: function(p){return namespace;}};
        }

        if (details.all) {
          var rv = [], n;
          for (var [,path] in Iterator(paths)) {
            result = contextDocument.evaluate(
              path,
              contextNode,
              resolver,
              XPathResult.ORDERED_NODE_ITERATOR_TYPE,
              null
            );
            while (n = result.iterateNext()) {
              rv.push(n);
            }
          }
          return rv;
        }

        for (var [,path] in Iterator(paths)) {
           result = contextDocument.evaluate(
              path,
              contextNode,
              resolver,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
          ).singleNodeValue;

          if (result) {
            return result;
          }
        }
        return null;
    };
  }

  if(typeof GM_injectJS == 'undefined'){
    var GM_injectJS = function(text, s_URL, funcToRun, runOnLoad, target, id) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
          //--- Doesn't always fire on Chrome. Needs @run-at document-start.
          scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if(id){ scriptNode.setAttribute('name', id); }
        /*
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')();';
        */
        //if (text)       scriptNode.appendChild(D.createTextNode("(" + text + ")();"));
        if (text)       scriptNode.appendChild(D.createTextNode(text));
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.appendChild(D.createTextNode("(" + funcToRun.toString() + ")();"));

        //var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        //var targ = D.body || D.documentElement;
        var targ = target || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    };
  }


  if(typeof GM_AJAXHEADER == 'undefined'){
    var GM_AJAXHEADER = {
          'Accept':'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': document.referrer,
        };
  }
  if(typeof GM_FORMPOSTHEADER == 'undefined'){
    var GM_FORMPOSTHEADER = {
          "Content-Type": "application/x-www-form-urlencoded",
          //"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          //"Accept": "application/json, text/javascript, */*; q=0.01",
          //"X-Requested-With": "XMLHttpRequest",
        };
  }
