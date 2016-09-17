(function() {
  'use strict';
  if(typeof window.MODAL !== 'undefined' && typeof window.Modal !== 'undefined'){return;}

  var _zIndex = 1000;
  var _zIndexModal = 2000;
  var style = ['html.hasModal {overflow: hidden !important;}', '.modal {', 'position:relative;', 'z-index:', _zIndex++, ';', 'width:600px;height:400px;', '}', '.modal-wrapper {', '  display: none;', '  position: fixed;', '  top: 0; ', '  left: 0;', 'bottom: 0;', 'right: 0;', '  background: rgba(0, 0, 0, .5);', '  z-index: ', _zIndex++, ';', '}', '.modal {', 'background-color: #fff;', '}'].join('');

  var Modal = function(proto, options) {
    _addStyle();
    _init();
    this.init(proto, options);
  };

  Modal.prototype.init = function(proto, options) {
    proto = proto || '';
    options = options || {};
    var defaults = {
      id: '',
      centered: true,
      title: '',
      content: '',
      parent: null,
      isModalodal: null
    };
    options = Object.assign({}, defaults, options);
    var _this = this;
    Object.assign(_this, options);
    var _id = 'modal' + (options.id ? '-' + options.id : '');
    _this.id = _id;
    var modal = document.querySelector('#' + _id);
    if (modal) {
      _this.modal = modal;
      //_this.modalWrapper = closest(modal, '.modal-wrapper');
      _this.modalWrapper = modal.closest('.modal-wrapper') || closest(modal, '.modal-wrapper');
      _setTitle(options.title, modal);
      _setContent(options.content, modal);
      return;
    }

    if (modal = _newModal(_id, proto)) {
      Object.assign(_this, modal);
      _setContent(options.content, _this.modal);
    }
  };

  Modal.prototype.show = function(content) {
    var _this = this;
    _bindEvents();
    _setContent(content, _this.modal);

    this.modalWrapper.style.display = 'block';
    if (_this.parent && (_this.parent instanceof HTMLElement)) {
      this.modalWrapper.style.position = 'absolute';
      var l = _this.parent.offsetLeft;
      var t = _this.parent.offsetTop;
      var w = _this.parent.offsetWidth;
      var h = _this.parent.offsetHeight;
      this.modalWrapper.style.left = l + 'px';
      this.modalWrapper.style.top = t + 'px';
      this.modalWrapper.style.width = w + 'px';
      this.modalWrapper.style.height = h + 'px';
    }
    this.modal.setAttribute('data-order', Date.now());
    this.modal.setAttribute('data-visible', '');
    if (~~_this.isModal) {
      this.modal.setAttribute('data-modal', '');
    }
    var zIdx;
    if (~~_this.isModal) {
      zIdx = _zIndexModal++;_zIndexModal++;
    } else {
      zIdx = _zIndex++;_zIndex++;
    }
    _this.modalWrapper.style.zIndex = zIdx;
    _this.modal.style.zIndex = ++zIdx;

    if (this.centered && !this.parent) {
      var modalTop = window.innerHeight / 2 - _this.modal.offsetHeight / 2;
      var modalLeft = window.innerWidth / 2 - _this.modal.offsetWidth / 2;
      _this.modal.style.top = modalTop + 'px';
      _this.modal.style.left = modalLeft + 'px';
      window.addEventListener('resize', function() {
        var modalTop = window.innerHeight / 2 - _this.modal.offsetHeight / 2;
        var modalLeft = window.innerWidth / 2 - _this.modal.offsetWidth / 2;
        _this.modal.style.top = modalTop + 'px';
        _this.modal.style.left = modalLeft + 'px';
        _this.modalWrapper.style.height = document.body.offsetHeight + 'px';
        _this.modalWrapper.style.width = document.body.offsetWidth + 'px';
      }, false);
    }
  };

  Modal.prototype.hide = function() {
    _closeModal(this.modal);
  };
  Modal.prototype.remove = function() {
    var _this = this;
    _this.modalWrapper.parentNode.removeChild(_this.modalWrapper);
  };
  var _newModal = function(id, proto) {
    switch (true) {
      case (proto instanceof HTMLElement):
        break;
      case (typeof proto === 'string' && /^[<]/.test(proto)):
        var range = document.createRange();
        range.selectNode(document.body);
        var protoEl = document.createElement('div');
        protoEl.appendChild(range.createContextualFragment(proto));
        proto = protoEl;
        break;
      case (typeof proto === 'string' && /^[#.]/.test(proto)):
        proto = document.querySelector(proto);
        break;
      default:
        proto = document.querySelector('#modal-proto');
    }
    if (!proto) return;
    var t = {};
    t.modal = proto.cloneNode(true);
    t.modal.setAttribute('id', id);
    t.modal.classList.add('modal');
    t.modal.style.display = 'block';

    t.modalWrapper = document.createElement('div');
    t.modalWrapper.setAttribute('class', 'modal-wrapper');

    //t.modalWrapper.style.zIndex = _zIndex++;
    //t.modal.style.zIndex = _zIndex++;

    t.modalWrapper.appendChild(t.modal);
    document.body.appendChild(t.modalWrapper);
    return t;
  };
  var _setTitle = function(title, modal) {
    if (title && modal) {
      var t = modal.querySelector('.modal-title') || false;
      if(!t){ return;};

      t.innerHTML = title;
    }
  };
  var _setContent = function(content, modal) {
    if (content && modal) {
      var t = modal.querySelector('.modal-content');
      t = t || modal;
      t.innerHTML = content;
    }
  };

  var _closeModal = function(modal, force) {
    // закрывает указанное окно (или последнрее открытое)
    // если нет открытых модальых окон (и не указан флаг принудительного закрытия
    force = force || false;
    var _close = function(modal) {
      if (modal && modal.className && modal.className.contains('modal')) {
        modal.removeAttribute('data-order');
        modal.removeAttribute('data-visible');
        modal.parentNode.style.display = 'none';
        _unbindEvents();
      }
    };

    if (force) {
      _close(modal);
      return;
    }

    // если закрываем не принудительно
    var modalModal = null;
    var topmostModal = null;
    // ищем последнее открытое модальное окно
    modalModal = (function() {
      var t = document.querySelectorAll('.modal[data-order][data-modal][data-visible]');
      if (!t || t.length == 0) return;
      return [].reduce.call(t, (previous, current) => {
        var a = previous.getAttribute('data-order') * 1;
        var b = current.getAttribute('data-order') * 1;
        return (a > b ? previous : current);
      });
    }());
    // если есть модальные окно и это не то что пытаемся закрыть - выходим
    if (modalModal && modal && (modalModal !== modal)) {
      return;
    }
    // если пытаемся закрыть последнее открытое окно и есть модальные окно
    if (modalModal) {
      _close(modalModal);
      return;
    }

    // если мы тут то открытых модальных окон нет
    // ищем последнее открытое окно
    topmostModal = (function() {
      var t = document.querySelectorAll('.modal[data-order]');
      if (!t) return;
      return [].reduce.call(t, (previous, current) => {
        var a = previous.getAttribute('data-order') * 1;
        var b = current.getAttribute('data-order') * 1;
        return (a > b ? previous : current);
      });
    }());

    if (topmostModal) {
      _close(topmostModal);
      return;
    }
  };
  var _addStyle = function() {
    var el = document.querySelector('style[rel="modal"]');
    if (el) return false;
    el = document.createElement('style');
    el.setAttribute('type', 'text/css');
    el.setAttribute('rel', 'modal');
    el.textContent = style;

    var targ = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
    targ.appendChild(el);

    return true;
  };
  var _init = function() {
    var exists = document.querySelector('#modal-proto');
    if (exists) return;
    var tpl = ['', '<div id="modal-proto" class="modal">', '  <h3 class="modal-title">', '</h3>', '  <div class="modal-content">', '</div>', '  <div class="modal-controls">', '    <div class="btn-close">', '</div>', '  </div>', '</div>'].join('');
    var range = document.createRange();
    range.selectNode(document.body);
    var protoModal = range.createContextualFragment(tpl);

    document.body.appendChild(protoModal);
  };
  var cancel_handler = function(evt) {
    if (evt && (((evt.type == "keyup") && (typeof evt.keyCode !== "undefined")) && (evt.keyCode === 27))) {
      _closeModal();
    }
    if (evt && ((evt.type == "click") && (evt.target.classList.contains('modal-wrapper')))) {
      _closeModal(evt.target.querySelector('.modal'));
    }
  };
  var _bindEvents = function() {
    var modals = document.querySelector('.modal[data-visible]');
    if (!modals) {
      document.addEventListener('keyup', cancel_handler);
      document.addEventListener('click', cancel_handler, false);
    }
  };
  var _unbindEvents = function() {
    var modals = document.querySelector('.modal[data-visible]');
    if (!modals) {
      document.removeEventListener('keyup', cancel_handler);
      document.removeEventListener('click', cancel_handler, false);
    }
  };
  if(typeof window.MODAL === 'undefined'){
    window.MODAL = new Modal('');
  }
  if(typeof window.Modal === 'undefined'){
    window.Modal = Modal;
  }

  var closest = function(el, selector) {
    var mS = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el)
      if (mS.bind(el)(selector)) return el;
      else el = el.parentElement;
    return false;
  };
}());

/*
  var _status = function(){
      //console.log(window.MODAL, window.Modal);
      console.log(Modal || false, MODAL);
  };
  var _step1 = function(){
    if(document.querySelector('script[rel="utils"]')){
      _step2(); return;
    }
    var scr = document.createElement('script');
        scr.setAttribute('rel','utils');
        scr.type="text/javascript";
        scr.src ="https://dl.dropboxusercontent.com/u/60450856/UserScripts/libraries/utils.js";
        scr.addEventListener("load",_step2);
    document.body.appendChild(scr);
  }
  var _step2 = function(){
    if(document.querySelector('script[rel="modal"]')){
      _main(); return;
    }
    var scr = document.createElement('script');
      scr.setAttribute('rel','modal');
      scr.type="text/javascript";
      scr.src ="https://dl.dropboxusercontent.com/u/60450856/UserScripts/libraries/modal.js";
      scr.addEventListener("load",_main);
    document.body.appendChild(scr);
  }
  _step1();
  var _main = function(ev){
    _status();
    MODAL.show('asdasfadfasfa');
    var m = new Modal("<div><h1>TEST</h1><div>134646564</div></div>",{id: 'test',isModal:true});
    m.parent = document.querySelector('.sidebar-right-section:nth-child(3)');
    m.show();

    var m2 = new Modal("<div><h1>MODAL2</h1><div>231231212412</div></div>",{id: 'test2'});
    m2.show();
  }
*/