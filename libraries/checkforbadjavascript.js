// ==UserScript==
// @name          checkForBadJavascript
// ==/UserScript==
'use strict';
/*--- Check for bad scripts to intercept and specify any actions to take. */
function checkForBadJavascripts (controlArray) {
  /*--- Note that this is a self-initializing function. The controlArray
    parameter is only active for the FIRST call. After that, it is an
    event listener.
    The control array row is defines like so:
      [bSearchSrcAttr, identifyingRegex, callbackFunction]
    Where:
      bSearchSrcAttr True to search the SRC attribute of a script tag
        false to search the TEXT content of a script tag.
      identifyingRegex A valid regular expression that should be unique
        to that particular script tag.
      bRemoveOriginal True to remove original <script> element
      callbackFunction An optional function to execute when the script is
        found. Use null if not needed.
  */
  if (!controlArray.length){ return null; }

  checkForBadJavascripts = function (zEvent) {
    for (var J = controlArray.length - 1; J >= 0; --J) {
      var bSearchSrcAttr  = controlArray[J][0];
      var rIdentifying    = controlArray[J][1];
      var bRemoveOriginal = controlArray[J][2];
      var sIdentifying    = bSearchSrcAttr ? zEvent.target.src : zEvent.target.textContent;
      if (rIdentifying.test(sIdentifying)){
        stopBadJavascript (J);
        return (bSearchSrcAttr ? !bRemoveOriginal : false);
      }
      /*
      var bSearchSrcAttr   = controlArray[J][0];
      var identifyingRegex = controlArray[J][1];
      var bRemoveOriginal  = controlArray[J][2];
      if (bSearchSrcAttr) {
        if (identifyingRegex.test (zEvent.target.src)) {
          stopBadJavascript (J);
          //return false;
          return !bRemoveOriginal;
        }
      } else {
        if (identifyingRegex.test (zEvent.target.textContent) ) {
          stopBadJavascript (J);
          return false;
        }
      }
      */
    }

    function stopBadJavascript (controlIndex) {
      if (bRemoveOriginal) {
        zEvent.stopPropagation ();
        zEvent.preventDefault ();
      }

      var callbackFunction = controlArray[J][3];
      if (typeof callbackFunction == 'function'){
        callbackFunction (zEvent);
      }

      // --- Remove the node just to clear clutter from Firebug inspection.
      if (bRemoveOriginal) {
        zEvent.target.parentNode.removeChild (zEvent.target);
      }

      // --- Script is intercepted, remove it from the list.
      controlArray.splice (J, 1);
      if (!controlArray.length) {
        // --- All done, remove the listener.
        window.removeEventListener('beforescriptexecute', checkForBadJavascripts, true);
      }
    }
  }
  /*--- Use the "beforescriptexecute" event to monitor scipts as they are loaded.
  See https://developer.mozilla.org/en/DOM/element.onbeforescriptexecute
  Note that it does not work on acripts that are dynamically created.
  */
  window.addEventListener ('beforescriptexecute', checkForBadJavascripts, true);

  return checkForBadJavascripts;
}

function checkForBadJavascriptsAfter (controlArray) {
  /*--- Note that this is a self-initializing function. The controlArray
    parameter is only active for the FIRST call. After that, it is an
    event listener.
    The control array row is defines like so:
      [bSearchSrcAttr, identifyingRegex, callbackFunction]
    Where:
      bSearchSrcAttr True to search the SRC attribute of a script tag
        false to search the TEXT content of a script tag.
      identifyingRegex A valid regular expression that should be unique
        to that particular script tag.
      bRemoveOriginal True to remove original <script> element
      callbackFunction An optional function to execute when the script is
        found. Use null if not needed.
  */
  if (!controlArray.length){ return null; }

  checkForBadJavascriptsAfter = function (zEvent) {
    for (var J = controlArray.length - 1; J >= 0; --J) {
      var bSearchSrcAttr  = controlArray[J][0];
      var rIdentifying    = controlArray[J][1];
      var bRemoveOriginal = controlArray[J][2];
      var sIdentifying    = bSearchSrcAttr ? zEvent.target.src : zEvent.target.textContent;
      if (rIdentifying.test(sIdentifying)){
        stopBadJavascript (J);
        return (bSearchSrcAttr ? !bRemoveOriginal : false);
      }
      /*
      var bSearchSrcAttr = controlArray[J][0];
      var identifyingRegex = controlArray[J][1];
      var bRemoveOriginal = controlArray[J][2];
      if (bSearchSrcAttr) {
        if (identifyingRegex.test (zEvent.target.src) ) {
          stopBadJavascript (J);
          return false;
          //return !bRemoveOriginal;
        }
      } else {
        if (identifyingRegex.test (zEvent.target.textContent) ) {
          stopBadJavascript (J);
          return false;
        }
      }
      */
    }

    function stopBadJavascript (controlIndex) {
      if (bRemoveOriginal) {
        zEvent.stopPropagation ();
        zEvent.preventDefault ();
      }

      var callbackFunction = controlArray[J][3];
      if (typeof callbackFunction === 'function'){
        callbackFunction (zEvent);
      }

      // --- Remove the node just to clear clutter from Firebug inspection.
      if (bRemoveOriginal) {
        zEvent.target.parentNode.removeChild (zEvent.target);
      }

      // --- Script is intercepted, remove it from the list.
      controlArray.splice (J, 1);
      if (!controlArray.length) {
        // --- All done, remove the listener.
        window.removeEventListener ('afterscriptexecute', checkForBadJavascriptsAfter, true);
      }
    }
  };
  /*--- Use the "afterscriptexecute" event to monitor scipts after they are loaded.
  See https://developer.mozilla.org/en/DOM/element.onafterscriptexecute
  Note that it does not work on acripts that are dynamically created.
  */
  window.addEventListener ('afterscriptexecute', checkForBadJavascriptsAfter, true);

  return checkForBadJavascriptsAfter;
}