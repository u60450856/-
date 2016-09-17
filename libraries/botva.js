// ==UserScript==
// @name          Botva - Utils
// _require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==
var w = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;
// console.log(w,w.BOTVA);
w.BOTVA = w.BOTVA || {};

if (typeof w.BOTVA.utils == 'undefined'){
  w.BOTVA.utils = (function(){
    'use strict';
    var t = {
      id: 'botva_utils',
      config:{
        type:'browser', // site,browser
        data:{},
        // local: true = site, false = browser
        load: function(param,local) {
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
          return tmp;
        },// load
        save: function(param,value,local) {
          param = typeof param === 'string' ? param    : false;
          local = typeof local !== 'undefined' ? local : true;

          var r, f, storage, ls = window.localStorage;
          storage = local ? (ls || null) : (gmStorage || null);
          f = (value !== null) ? 'setItem' : 'removeItem';
          // сохраняем данные
          storage[f](param, JSON.stringify(value));
        },// save
      }, // config
      kParam : (function(){
        var t  = { '@': 0, };
        t.init = function (param) {
            var rKey = /var\sKEY=(\d*)/;
            var p,i;
            if (typeof param === 'undefined'){
              param = document.getElementsByTagName('script');
              for (i = 0; i < param.length; i++){
                p = param[i].text.match(rKey);
                if (p) {
                  param = (this['@'] = p[1]);
                  break;
                }
              }
            } else {
              p = param.match(rKey);
              param = (this['@'] = p[1]);
            }
            return param;
        }; // t.init
        t.init();
        return t;
      })(), // kParam
      ImgUrlParam : (function(){
        var t = { '@': 0, };
        t.init = function(param) {
          var rImgUrl = /var\sIMG_URL=(?:"|')([^;]*)(?:"|')/;
          var p, i;
          if (typeof param === 'undefined'){
            param = document.getElementsByTagName('script');
            for (i = 0; i < param.length; i++){
              p = param[i].text.match(rImgUrl);
              if (p){
                param = (this['@'] = p[1]);
                break;
              }
            }
          } else {
            p = param.match(rKey);
            param = (this['@'] = p[1]);
          }
          return param;
        };
        t.init();
        return t;
      })(), // imgUrlParam
    };
    return t;
  })();
}
console.time('popupsIdx');
// w.BOTVA.utils.config.save(w.BOTVA.utils.id+'\#popupsIdx',null,true);
if (!('popupsIdx' in w.BOTVA.utils)){
  Object.defineProperty(w.BOTVA.utils, 'popupsIdx', {
      get: function() {
        'use strict';
        if('#popupsIdx' in this){
          return this['#popupsIdx'];
        }
        // загружаем данные из хранилища
        var local = true,
            data  = this.config.load(this.id+'\#'+'popupsIdx',local);
        //if(data !== null && typeof data==='object' && Object.keys(data).length!=0) return data;
        if(data === null || typeof data !== 'object' || Object.keys(data).length === 0){
          var pp = w.popups || {},
              ax = Object.keys(pp),
              re = /^item_\d+$/i;
          data = {};
          for(var i=ax.length-1;i>=0;i--){
            if(re.test(ax[i])){
              data[pp[ax[i]][0].toLowerCase()] = ax[i].toLowerCase();
            }
          }

          if(Object.keys(data).length){
            this.config.save(this.id+'\#popupsIdx',data,local);
          }
        }else{
        }

        this['#popupsIdx'] = data;
        return data;
      },
  });
}// popupIdx
console.timeEnd('popupsIdx');
