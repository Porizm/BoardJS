/*!
 * BoardJS v2.0
 * Copyright (c) 2013-2026 Firas Moussa — MIT License
 *
 * New API — options objects, sensible defaults, no positional guessing.
 *
 * Quick start:
 *   const board = new BoardJS('myDiv');
 *   board
 *     .text('Hello!',  { x: 50, y: 80, class: 'title', show: 'fade', duration: 600 })
 *     .image('hero.png', { x: 0, y: 0, show: 'zoom', duration: 400, wait: true })
 *     .delay(500)
 *     .go();
 *
 * Constants  (optional — plain strings also work):
 *   BoardJS.SHOW  — APPEAR, FADE, ZOOM, SPLIT, FROM_LEFT, FROM_RIGHT, FROM_TOP, FROM_BOTTOM
 *   BoardJS.EASE  — LINEAR, IN, OUT, BACK_IN, BACK_OUT, ELASTIC, BOUNCE
 */

const BoardJS = (() => {

  let _instanceCount = 0;

  // ── Easing library ───────────────────────────────────────────────────────────
  const EASINGS = {
    linear:  t => t,
    easeout: t => Math.pow(t, 0.48),
    easein:  t => Math.pow(t, 1.7),
    backin:  t => t * t * (2.7 * t - 1.7),
    backout: t => { const u = t - 1; return u * u * (2.7 * u + 1.7) + 1; },
    elastic: t => t === 0 || t === 1 ? t
               : Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1,
    bounce:  t => {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      if (t < 2 / 2.75) { t -= 1.5  / 2.75; return 7.5625 * t * t + 0.75; }
      if (t < 2.5/ 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
      t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375;
    },
  };

  // ── Constructor ──────────────────────────────────────────────────────────────
  function BoardJS(handleId) {
    _instanceCount++;

    const me         = this;
    me._id           = _instanceCount;
    me._handle       = document.getElementById(handleId);
    me._commands     = [];
    me._functions    = [];
    me._loadingList  = [];
    me._basePath     = '';
    me._currentStep  = -1;
    me._started      = false;
    me._stopped      = false;
    me._paused       = false;
    me._onDone       = () => {};
    me._delayTimer   = null;
    me._loadedCount  = 0;

    if (!me._handle) {
      console.error(`BoardJS: element #${handleId} not found`);
    }

    // ── Internal command queue helper ─────────────────────────────────────────
    // While the board is running, commands execute immediately.
    // Before .go(), they are queued.
    function enqueue(type, params) {
      const cmd = Object.assign({ type }, params);
      if (me._started) _exec(cmd);
      else me._commands.push(cmd);
      return me;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Add a text element.
     * @param {string} content - Plain text or safe HTML (<b>, <a>, <br>)
     * @param {{ x?, y?, class?, show?, duration?, easing?, id?, wait? }} opts
     *   wait: true — pause the timeline until this animation finishes
     */
    me.text = (content, opts = {}) => {
      const {
        x = 0, y = 0,
        class: cls = '',
        show = 'appear',
        duration = 400,
        easing = 'linear',
        id = `bjs${me._id}t${me._commands.length}`,
        wait = false,
      } = opts;
      return enqueue('text', { content, x, y, cls, show, duration, easing, id, wait });
    };

    /**
     * Add an image element.
     * @param {string} src
     * @param {{ x?, y?, width?, height?, show?, duration?, easing?, id?, wait? }} opts
     */
    me.image = (src, opts = {}) => {
      const {
        x = 0, y = 0,
        width = '', height = '',
        show = 'appear',
        duration = 400,
        easing = 'linear',
        id = `bjs${me._id}i${me._commands.length}`,
        wait = false,
      } = opts;
      const fullSrc = me._basePath + src;
      if (!me._loadingList.find(i => i.src === fullSrc)) {
        me._loadingList.push({ type: 'image', src: fullSrc });
      }
      return enqueue('image', { src: fullSrc, x, y, width, height, show, duration, easing, id, wait });
    };

    /**
     * Set the stage background (color or image).
     * @param {string} src - CSS color ('#f00', 'rgb(…)') or image path
     * @param {{ duration?, wait? }} opts
     */
    me.background = (src, opts = {}) => {
      const { duration = 500, wait = false } = opts;
      const fullSrc = me._basePath + src;
      const isColor = /^(#|rgb|rgba)/i.test(src);
      if (!isColor && !me._loadingList.find(i => i.src === fullSrc)) {
        me._loadingList.push({ type: 'image', src: fullSrc });
      }
      return enqueue('background', { src: fullSrc, isColor, duration, wait });
    };

    /**
     * Pause the timeline for `ms` milliseconds.
     * @param {number} ms
     */
    me.delay = ms => enqueue('delay', { ms });

    /**
     * Move an element to new coordinates.
     * @param {string} id
     * @param {{ x?, y?, duration?, easing?, wait? }} opts
     */
    me.move = (id, opts = {}) => {
      const { x = null, y = null, duration = 600, easing = 'linear', wait = false } = opts;
      return enqueue('move', { id, x, y, duration, easing, wait });
    };

    /**
     * Fade an element in.
     * @param {string} id
     * @param {{ duration?, wait? }} opts
     */
    me.fadeIn = (id, opts = {}) => {
      const { duration = 500, wait = false } = opts;
      return enqueue('fadeIn', { id, duration, wait });
    };

    /**
     * Fade an element out.
     * @param {string} id
     * @param {{ duration?, wait? }} opts
     */
    me.fadeOut = (id, opts = {}) => {
      const { duration = 500, wait = false } = opts;
      return enqueue('fadeOut', { id, duration, wait });
    };

    /**
     * Flash (blink) an element.
     * @param {string} id
     * @param {{ count?, duration?, wait? }} opts
     *   count: number or 'always'
     */
    me.flash = (id, opts = {}) => {
      const { count = 3, duration = 400, wait = false } = opts;
      return enqueue('flash', { id, count, duration, wait });
    };

    /**
     * Rotate an element to an angle.
     * @param {string} id
     * @param {number} angle - Target angle in degrees
     * @param {{ duration?, easing?, wait? }} opts
     */
    me.rotate = (id, angle, opts = {}) => {
      const { duration = 500, easing = 'linear', wait = false } = opts;
      return enqueue('rotate', { id, angle, duration, easing, wait });
    };

    /**
     * Scale an element.
     * @param {string} id
     * @param {number} scale - Target scale (1 = original, 2 = double, etc.)
     * @param {{ duration?, easing?, wait? }} opts
     */
    me.zoom = (id, scale, opts = {}) => {
      const { duration = 500, easing = 'linear', wait = false } = opts;
      return enqueue('zoom', { id, scale, duration, easing, wait });
    };

    /**
     * Apply inline CSS to an element.
     * @param {string} id
     * @param {string} css - e.g. 'color:red; font-size:20px'
     */
    me.style = (id, css) => enqueue('style', { id, css });

    /**
     * Set the innerHTML of an element.
     * @param {string} id
     * @param {string} content - HTML string
     */
    me.html = (id, content) => enqueue('html', { id, content });

    /**
     * Remove element(s) from the stage.
     * @param {string} id - Space-separated IDs
     */
    me.remove = id => enqueue('remove', { id });

    /**
     * Attach a hover animation to an element.
     * @param {string} id - Space-separated IDs
     * @param {string} css - CSS to apply on hover, e.g. 'scale:1.2; rotate:15'
     * @param {{ duration?, easing? }} opts
     */
    me.hover = (id, css, opts = {}) => {
      const { duration = 300, easing = 'linear' } = opts;
      return enqueue('hover', { id, css, duration, easing });
    };

    /** Remove hover behaviour from an element. */
    me.unhover = id => enqueue('unhover', { id });

    /**
     * Attach a persistent tooltip (shows on mouseover).
     * @param {string} id
     * @param {string} content
     */
    me.tooltip = (id, content) => enqueue('tooltip', { id, content });

    /** Remove a persistent tooltip. */
    me.removeTooltip = id => enqueue('removeTooltip', { id });

    /**
     * Show a tooltip for a fixed duration.
     * @param {string} id
     * @param {string} content
     * @param {{ duration?, wait? }} opts
     *   duration: ms to display, or omit for permanent
     */
    me.showTooltip = (id, content, opts = {}) => {
      const { duration = null, wait = false } = opts;
      return enqueue('showTooltip', { id, content, duration, wait });
    };

    /**
     * Swap an element's image source.
     * @param {string} id
     * @param {string} src
     */
    me.changeImage = (id, src) => {
      const fullSrc = me._basePath + src;
      if (!me._loadingList.find(i => i.src === fullSrc)) {
        me._loadingList.push({ type: 'image', src: fullSrc });
      }
      return enqueue('changeImage', { id, src: fullSrc });
    };

    /**
     * Attach an event listener.
     * @param {string} id - Space-separated IDs
     * @param {string} event - e.g. 'click', 'mouseover'
     * @param {Function} fn
     */
    me.on = (id, event, fn) => {
      me._functions.push(fn);
      return enqueue('on', { id, event, fnIndex: me._functions.length - 1 });
    };

    /**
     * Remove all listeners for an event from an element.
     * @param {string} id
     * @param {string} event
     */
    me.off = (id, event) => enqueue('off', { id, event });

    /**
     * Make element circular.
     * @param {string} id
     * @param {string} [extraCss] - Additional inline CSS
     */
    me.circle = (id, extraCss = '') => enqueue('circle', { id, extraCss });

    /**
     * Apply border-radius to an element.
     * @param {string} id
     * @param {number} radius - Pixels
     */
    me.round = (id, radius) => enqueue('round', { id, radius });

    /**
     * Move a child element inside a parent (for grouped transforms).
     * @param {string} id - Space-separated child IDs
     * @param {string} parent - Parent element ID
     */
    me.merge = (id, parent) => enqueue('merge', { id, parent });

    /** Move merged elements back to the stage root. */
    me.unmerge = id => enqueue('unmerge', { id });

    /**
     * Play a sound file.
     * @param {string} src
     * @param {{ wait? }} opts
     */
    me.sound = (src, opts = {}) => {
      const { wait = false } = opts;
      const fullSrc = me._basePath + src;
      if (!me._loadingList.find(i => i.src === fullSrc)) {
        me._loadingList.push({ type: 'sound', src: fullSrc });
      }
      return enqueue('sound', { src: fullSrc, wait });
    };

    /**
     * Stop a sound, or all sounds if no src given.
     * @param {string} [src]
     */
    me.stopSound = (src) => {
      const fullSrc = src ? me._basePath + src : null;
      return enqueue('stopSound', { src: fullSrc });
    };

    /**
     * Jump to a specific command index in the timeline.
     * @param {number} index
     */
    me.seek = index => enqueue('seek', { index });

    /** Pause the timeline (until .resume() is called). */
    me.pause = () => enqueue('pause', {});

    /** Resume a paused timeline. */
    me.resume = () => enqueue('resume', {});

    /**
     * Start playback.
     * @param {Function} [onDone] - Called when the timeline finishes
     */
    me.go = (onDone) => {
      setTimeout(() => {
        if (typeof onDone === 'function') me._onDone = onDone;
        me._stopped = false;
        const hasSounds = me._loadingList.some(i => i.type === 'sound');
        const smPending = typeof SoundManagerReady !== 'undefined' && !SoundManagerReady;
        if (hasSounds && smPending) {
          const loader = _createLoader('Preparing audio…');
          window.SoundManagerReadyFunction = () => {
            loader.remove();
            _loadAssets();
          };
        } else {
          _loadAssets();
        }
      }, 100);
      return me;
    };

    /**
     * Stop and clear the stage.
     * @param {boolean} [keepBackground] - Keep the background element
     */
    me.reset = (keepBackground = false) => {
      clearTimeout(me._delayTimer);
      _stop();
      if (typeof window !== 'undefined') window.SoundManagerReadyFunction = () => {};
      me._onDone = () => {};
      _cleanupRange(0, me._commands.length, keepBackground);
      if (!keepBackground) {
        me._loadingList = [];
        me._commands    = [];
        me._functions   = [];
        me._currentStep = -1;
        me._handle.innerHTML = '';
      }
      return me;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // INTERNALS — nothing below is part of the public API
    // ═══════════════════════════════════════════════════════════════════════════

    function _stop() {
      me._stopped = true;
      me._started = false;
      _execStopSound(null);
    }

    me._next = function () {
      if (me._stopped || me._paused) return;
      me._currentStep++;
      if (me._currentStep >= me._commands.length) {
        me._currentStep--;
        me._onDone();
        return;
      }
      _exec(me._commands[me._currentStep]);
    };

    function _exec(c) {
      switch (c.type) {
        case 'text':         return _showText(c);
        case 'image':        return _showImage(c);
        case 'background':   return _background(c);
        case 'delay':        return _delay(c);
        case 'move':         return _move(c);
        case 'fadeIn':       return _fade(c, true);
        case 'fadeOut':      return _fade(c, false);
        case 'flash':        return _flash(c);
        case 'rotate':       return _rotate(c);
        case 'zoom':         return _zoom(c);
        case 'style':        return _style(c);
        case 'html':         return _html(c);
        case 'remove':       return _remove(c);
        case 'hover':        return _hover(c);
        case 'unhover':      return _unhover(c);
        case 'tooltip':      return _addTooltip(c);
        case 'removeTooltip':return _removeTooltip(c);
        case 'showTooltip':  return _showTooltip(c);
        case 'changeImage':  return _changeImage(c);
        case 'on':           return _on(c);
        case 'off':          return _off(c);
        case 'circle':       return _circle(c);
        case 'round':        return _round(c);
        case 'merge':        return _merge(c, true);
        case 'unmerge':      return _merge(c, false);
        case 'sound':        return _sound(c);
        case 'stopSound':    return _execStopSound(c.src);
        case 'seek':         return _seek(c);
        case 'pause':        me._paused = true; break;
        case 'resume':       if (me._paused) { me._paused = false; me._next(); } break;
      }
    }

    // ── Command handlers ───────────────────────────────────────────────────────

    function _showText({ content, x, y, cls, show, duration, easing, id, wait }) {
      const el = document.createElement('div');
      el.innerHTML = _sanitize(content);
      el.className = `${cls} bjs-text`.trim();
      el.id = id;
      _noSelectDrag(el);
      Object.assign(el.style, {
        whiteSpace: 'nowrap', margin: '0', position: 'absolute',
        left: `${x}px`, top: `${y}px`,
      });
      _showObjectAnimated(el, '', show, easing, duration, wait ? () => me._next() : '');
      if (!wait) setTimeout(() => me._next(), 1);
    }

    function _showImage({ src, x, y, width, height, show, duration, easing, id, wait }) {
      const el = document.createElement('div');
      el.id = id;
      el.className = 'bjs-image';
      const img = document.createElement('img');
      img.alt = '';
      if (width)  img.width  = parseInt(width);
      if (height) img.height = parseInt(height);
      el.appendChild(img);
      _noSelectDrag(el);
      Object.assign(el.style, {
        visibility: 'hidden', overflow: 'hidden',
        border: '0', margin: '0', padding: '0', position: 'absolute',
        left: `${x}px`, top: `${y}px`,
      });
      // Append immediately so subsequent commands (.style, .on, .hover) can
      // find the element by ID — animation runs async after the image loads.
      me._handle.appendChild(el);
      _showObjectAnimated(el, src, show, easing, duration, wait ? () => me._next() : '');
      if (!wait) setTimeout(() => me._next(), 1);
    }

    function _background({ src, isColor, duration, wait }) {
      const bgId = `bjs_bg_${me._id}`;
      let bg = document.getElementById(bgId);
      if (!bg) {
        bg = document.createElement('img');
        bg.id = bgId;
        bg.alt = '';
        Object.assign(bg.style, {
          position: 'absolute', left: '0', top: '0',
          width: '100%', height: '100%', opacity: '0',
          borderRadius: '13px', pointerEvents: 'none',
        });
        me._handle.insertBefore(bg, me._handle.firstChild);
      }
      const show = () => _animate(bg, { opacity: 1 }, duration, 'linear', () => { if (wait) me._next(); });
      _animate(bg, { opacity: 0 }, duration / 3, 'linear', () => {
        if (isColor) {
          bg.style.backgroundColor = src;
          bg.style.backgroundImage = 'none';
          bg.removeAttribute('src');
          show();
        } else {
          bg.onload = show;
          bg.src = src;
        }
      });
      if (!wait) me._next();
    }

    function _delay({ ms }) {
      clearTimeout(me._delayTimer);
      me._delayTimer = setTimeout(() => me._next(), parseFloat(ms) || 0);
    }

    function _move({ id, x, y, duration, easing, wait }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      const props = {};
      if (x !== null) props.left = `${x}px`;
      if (y !== null) props.top  = `${y}px`;
      if (!Object.keys(props).length) { me._next(); return; }
      els.forEach((el, i) => {
        if (el._myCSS && x !== null) el._myCSS.left = x;
        if (el._myCSS && y !== null) el._myCSS.top  = y;
        _animate(el, props, duration, easing, i === 0 ? () => { if (wait) me._next(); } : () => {});
      });
      if (!wait) me._next();
    }

    function _fade({ id, duration, wait }, isIn) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      els.forEach(el => {
        if (isIn) el.style.display = 'block';
        _animate(el, { opacity: isIn ? 1 : 0 }, duration, 'linear', who => {
          if (!isIn) who.style.display = 'none';
          if (wait) me._next();
        });
      });
      if (!wait) me._next();
    }

    function _flash({ id, count, duration, wait }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      const always = String(count).toLowerCase() === 'always';
      let remaining = always ? Infinity : parseInt(count) || 1;
      const fadeIn  = () => els.forEach(el => _animate(el, { opacity: 1 }, duration, 'linear', () => {
        if (me._stopped || remaining === 0) { if (wait) me._next(); return; }
        fadeOut();
      }));
      const fadeOut = () => {
        if (!always) remaining--;
        els.forEach(el => _animate(el, { opacity: 0 }, duration, 'linear', fadeIn));
      };
      fadeOut();
      if (!wait) me._next();
    }

    function _rotate({ id, angle, duration, easing, wait }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      els.forEach((el, i) => {
        if (el._myCSS) el._myCSS.rotate = angle;
        _animate(el, { rotate: parseFloat(angle) }, duration, easing,
          i === 0 ? () => { if (wait) me._next(); } : () => {});
      });
      if (!wait) me._next();
    }

    function _zoom({ id, scale, duration, easing, wait }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      els.forEach((el, i) => {
        if (el._myCSS) el._myCSS.scale = scale;
        _animate(el, { scale: parseFloat(scale) }, duration, easing,
          i === 0 ? () => { if (wait) me._next(); } : () => {});
      });
      if (!wait) me._next();
    }

    function _style({ id, css }, noNext = false) {
      const els = _get(id);
      if (!els) { if (!noNext) me._next(); return; }
      els.forEach(el => { el.style.cssText += ';' + css; });
      if (!noNext) me._next();
    }

    function _html({ id, content }) {
      const els = _get(id);
      if (els) els.forEach(el => { el.innerHTML = _sanitize(content); });
      me._next();
    }

    function _remove({ id }) {
      const els = _get(id);
      if (els) els.forEach(el => el.parentNode?.removeChild(el));
      me._next();
    }

    function _hover({ id, css, duration, easing }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      const hoverProps = {};
      css.split(';').forEach(s => {
        const idx = s.indexOf(':');
        if (idx !== -1) hoverProps[s.slice(0, idx).trim()] = s.slice(idx + 1).trim();
      });
      els.forEach(el => {
        const original = Object.fromEntries(Object.keys(hoverProps).map(k => [k, _cssGet(el, k)]));
        el._hoverStyle  = hoverProps;
        el._myCSS       = original;
        el._hoverOver   = function () { if (this._hoverAnim) this._hoverAnim.stop(); this._hoverAnim = _animate(this, this._hoverStyle, duration, easing, () => {}); };
        el._hoverOut    = function () { if (this._hoverAnim) this._hoverAnim.stop(); this._hoverAnim = _animate(this, this._myCSS,    duration, easing, () => {}); };
        el.addEventListener('mouseover',  function () { this._hoverOver(); });
        el.addEventListener('mouseout',   function () { this._hoverOut(); });
        el.addEventListener('touchstart', function () { this._hoverOver(); }, { passive: true });
        el.addEventListener('touchend',   function () { this._hoverOut(); },  { passive: true });
      });
      me._next();
    }

    function _unhover({ id }) {
      const els = _get(id);
      if (els) els.forEach(el => { el._hoverOver = () => {}; el._hoverOut = () => {}; });
      me._next();
    }

    function _addTooltip({ id, content }) {
      const els = _get(id);
      if (els) {
        els.forEach(el => {
          el.style.cursor = 'pointer';
          el.addEventListener('mouseover', () => _renderTooltip(el.id, content));
          el.addEventListener('mouseout',  () => _destroyTooltip(el.id));
        });
      }
      me._next();
    }

    function _removeTooltip({ id }) {
      const els = _get(id);
      if (els) {
        els.forEach(el => {
          el.style.cursor = 'default';
          _destroyTooltip(el.id);
          const clone = el.cloneNode(true);
          el.parentNode?.replaceChild(clone, el);
        });
      }
      me._next();
    }

    function _showTooltip({ id, content, duration, wait }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      els.forEach(el => _renderTooltip(el.id, content, duration, () => { if (wait) me._next(); }));
      if (!wait) me._next();
    }

    function _changeImage({ id, src }) {
      const els = _get(id);
      if (els) els.forEach(el => _showObjectAnimated(el, src, 'fade', 'linear', 200, ''));
      me._next();
    }

    function _on({ id, event, fnIndex }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      const fn = me._functions[fnIndex];
      const key = `_bjs_${event}`;
      els.forEach(el => {
        if (!el[key]) el[key] = [];
        el[key].push({ fnIndex, fn });
        el.addEventListener(event, fn);
      });
      me._next();
    }

    function _off({ id, event }) {
      const els = _get(id);
      if (!els) { me._next(); return; }
      const key = `_bjs_${event}`;
      els.forEach(el => {
        (el[key] || []).forEach(({ fn }) => el.removeEventListener(event, fn));
        el[key] = [];
      });
      me._next();
    }

    function _circle({ id, extraCss }) {
      const els = _get(id);
      if (els) {
        els.forEach(el => {
          const s = Math.max(el.offsetWidth, el.offsetHeight);
          Object.assign(el.style, { lineHeight: `${s}px`, padding: '10px', width: `${s}px`, height: `${s}px`, borderRadius: '50%' });
          if (extraCss) _style({ id: el.id, css: extraCss }, true);
        });
      }
      me._next();
    }

    function _round({ id, radius }) {
      const els = _get(id);
      if (els) els.forEach(el => { el.style.borderRadius = `${radius}px`; });
      me._next();
    }

    function _merge({ id, parent }, doMerge) {
      const els    = _get(id);
      const target = doMerge ? _get(parent) : null;
      if (!els || (doMerge && !target)) { me._next(); return; }
      els.forEach(el => {
        const px = doMerge ? (parseFloat(target[0].style.left) || 0) : (parseFloat(el.parentNode.style.left) || 0);
        const py = doMerge ? (parseFloat(target[0].style.top)  || 0) : (parseFloat(el.parentNode.style.top)  || 0);
        let cx = parseFloat(el.style.left) || 0;
        let cy = parseFloat(el.style.top)  || 0;
        if (doMerge) {
          target[0].appendChild(el);
          cx = cx === px ? 0 : cx - px;
          cy = cy === py ? 0 : cy - py;
        } else {
          me._handle.appendChild(el);
          cx += px; cy += py;
        }
        el.style.left = `${cx}px`;
        el.style.top  = `${cy}px`;
      });
      me._next();
    }

    function _sound({ src, wait }) {
      if (typeof PlaySoundID === 'function') {
        PlaySoundID(src, () => { if (wait) me._next(); });
      } else {
        if (wait) me._next();
      }
      if (!wait) me._next();
    }

    function _execStopSound(src) {
      if (typeof StopSoundID === 'function') {
        if (!src) me._loadingList.filter(i => i.type === 'sound').forEach(i => StopSoundID(i.src));
        else StopSoundID(src);
      }
    }

    function _seek({ index }) {
      _stop();
      _cleanupRange(index, me._commands.length);
      me._currentStep = index - 1;
      setTimeout(() => { me._paused = false; me._started = true; me._stopped = false; me._next(); }, 100);
    }

    // ── Animation engine ───────────────────────────────────────────────────────

    function _animate(element, properties, duration, easing, callback) {
      if (me._stopped) return { stop: () => {} };
      const easeFn  = EASINGS[(easing || 'linear').toLowerCase()] || EASINGS.linear;
      const dur     = parseInt(duration, 10) || 500;

      const interps = {};
      for (const p in properties) {
        if (p === 'rotate' || p === 'scale') {
          interps[p] = { start: _getTx(element, p), end: parseFloat(properties[p]) };
        } else {
          const endStr = String(properties[p]);
          interps[p] = {
            start: parseFloat(element.style[p]) || 0,
            end:   parseFloat(endStr.match(/-?\d+(\.\d+)?/)?.[0] ?? properties[p]) || 0,
            unit:  (element.style[p] || endStr).match(/px|em|%/i)?.[0] || '',
          };
        }
      }

      const t0 = performance.now();
      let raf, done = false;
      const step = now => {
        if (me._stopped || done) return;
        const t = Math.min((now - t0) / dur, 1);
        const p = easeFn(t);
        for (const k in interps) {
          const { start, end, unit } = interps[k];
          const val = start + (end - start) * p;
          if (k === 'rotate' || k === 'scale') _setTx(element, k, val);
          else element.style[k] = val + unit;
        }
        if (t >= 1) { done = true; if (typeof callback === 'function') setTimeout(() => callback(element), 10); return; }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return { stop: () => { done = true; cancelAnimationFrame(raf); } };
    }

    function _getTx(el, type) {
      return type === 'rotate' ? parseFloat(el.dataset.bjsR || 0)
           : type === 'scale'  ? parseFloat(el.dataset.bjsS || 1) : 0;
    }

    function _setTx(el, type, val) {
      const r = type === 'rotate' ? val : _getTx(el, 'rotate');
      const s = type === 'scale'  ? val : _getTx(el, 'scale');
      el.style.transform = `rotate(${r}deg) scale(${s})`;
      el.dataset.bjsR = r;
      el.dataset.bjsS = s;
    }

    // ── Show animations ────────────────────────────────────────────────────────

    function _showObjectAnimated(el, src, show, easing, duration, onFinish) {
      const types = show.split(' ');
      const run = () => {
        _doShowAnim(el, types[0], easing, true, onFinish, duration);
        types.slice(1).forEach(t => _doShowAnim(el, t, 'linear', false, '', duration));
      };
      if (el.className === 'bjs-image') {
        const img = el.querySelector('img');
        img.onload = () => {
          setTimeout(() => {
            if (img.naturalWidth)  { el.style.width  = img.naturalWidth  + 'px'; img.style.width  = '100%'; }
            if (img.naturalHeight) { el.style.height = img.naturalHeight + 'px'; img.style.height = '100%'; }
            // append=false — element is already in the DOM (added in _showImage)
            _doShowAnim(el, types[0], easing, false, onFinish, duration);
            types.slice(1).forEach(t => _doShowAnim(el, t, 'linear', false, '', duration));
          }, 10);
          img.onload = null;
        };
        img.onerror = () => { _doShowAnim(el, types[0], easing, false, onFinish, duration); };
        img.src = src;
      } else {
        run();
      }
    }

    function _doShowAnim(el, type, easing, append, onFinish, duration) {
      if (me._stopped) return;
      type     = (type || 'appear').toLowerCase();
      onFinish = onFinish || (() => {});
      duration = duration || 0;
      if (append) me._handle.appendChild(el);
      if (type === 'split' && el.className === 'bjs-image') type = 'appear';

      switch (type) {
        case 'appear':
          el.style.display = 'none';
          setTimeout(() => { el.style.display = 'block'; onFinish(); }, duration);
          break;
        case 'split': {
          const full = el.innerHTML;
          let cur = 0;
          el.innerHTML = '';
          const iv = setInterval(() => {
            if (cur < full.length) { cur++; el.innerHTML = full.substring(0, cur) + '▐'; }
            else { el.innerHTML = full; clearInterval(iv); onFinish(); }
          }, duration / Math.max(full.length, 1));
          break;
        }
        case 'fade':
          el.style.opacity = '0';
          _animate(el, { opacity: 1 }, duration, easing, onFinish);
          break;
        case 'zoom':
          _setTx(el, 'scale', 0);
          _animate(el, { scale: 1 }, duration, easing, onFinish);
          break;
        case 'fromleft': case 'fromright': case 'fromtop': case 'frombottom': {
          const ox = parseFloat(el.style.left) || el.offsetLeft || 0;
          const oy = parseFloat(el.style.top)  || el.offsetTop  || 0;
          const w  = el.offsetWidth  || 0, h = el.offsetHeight || 0;
          const props = {};
          if (type === 'fromleft')   { props.left = `${ox}px`; el.style.left = `${-w}px`; }
          if (type === 'fromright')  { props.left = `${ox}px`; el.style.left = `${w  + (me._handle.offsetWidth  || 700)}px`; }
          if (type === 'fromtop')    { props.top  = `${oy}px`; el.style.top  = `${-h}px`; }
          if (type === 'frombottom') { props.top  = `${oy}px`; el.style.top  = `${h  + (me._handle.offsetHeight || 450)}px`; }
          _animate(el, props, duration, easing, onFinish);
          break;
        }
      }
      el.style.visibility = 'visible';
    }

    // ── Tooltip ────────────────────────────────────────────────────────────────

    function _renderTooltip(id, content, removeAfter, onRemove) {
      const anchor = _get(id)?.[0];
      if (!anchor) return;
      _destroyTooltip(id);

      const tip   = document.createElement('div');
      tip.id = `${id}_tooltip`;
      tip.className = 'bjs-tooltip';

      const body  = document.createElement('div');
      body.innerHTML = _sanitize(content).replace(/<br\s*\/?>/gi, '<br>&nbsp;');
      tip.appendChild(body);

      const arrow = document.createElement('div');
      arrow.id = `${id}_tooltipArrow`;
      arrow.className = 'bjs-tooltip-arrow';
      tip.appendChild(arrow);

      tip.style.visibility = 'hidden';
      me._handle.appendChild(tip);

      setTimeout(() => {
        const tw = tip.offsetWidth, th = tip.offsetHeight;
        const mw = me._handle.offsetWidth;
        let tx = parseFloat(anchor.style.left) - (tw / 2 - anchor.offsetWidth / 2);
        let ty = parseFloat(anchor.style.top)  - th - 20;
        if (tx < 0) tx = 0;
        if (ty < 0) ty = 0;
        if (tw + tx > mw) {
          tx = mw - tw - 30;
          arrow.style.left = `${parseFloat(anchor.style.left) - tx + anchor.offsetWidth / 2.5}px`;
          tip.style.width  = `${mw - tx - 20}px`;
        }
        Object.assign(tip.style, { left: `${tx}px`, top: `${ty}px`, visibility: 'visible' });
      }, 100);

      if (removeAfter != null) {
        setTimeout(() => { _destroyTooltip(id); if (typeof onRemove === 'function') onRemove(); }, removeAfter);
      }
    }

    function _destroyTooltip(id) {
      document.getElementById(`${id}_tooltip`)?.remove();
    }

    // ── Asset loader ──────────────────────────────────────────────────────────

    function _loadAssets() {
      if (me._stopped) return;
      if (me._loadingList.length === 0) { _startPlay(); return; }
      me._loadedCount = 0;
      const loader = _createLoader('Loading');
      const bar    = document.getElementById(`bjs_bar_${me._id}`);
      const tick   = () => {
        if (me._stopped) return;
        me._loadedCount++;
        if (bar) bar.style.width = `${(me._loadedCount / me._loadingList.length) * 230}px`;
        if (me._loadedCount >= me._loadingList.length) { loader.remove(); _startPlay(); }
      };
      me._loadingList.forEach(item => {
        if (item.type === 'image') {
          const img = new Image();
          img.onload = img.onerror = tick;
          img.src = item.src;
        } else if (item.type === 'sound' && typeof PrepareSound === 'function') {
          PrepareSound(item.src, tick);
        } else {
          tick();
        }
      });
    }

    function _startPlay() {
      me._started = true;
      me._paused  = false;
      me._next();
    }

    function _createLoader(label) {
      document.getElementById(`bjs_loader_${me._id}`)?.remove();
      const el = document.createElement('div');
      el.id = `bjs_loader_${me._id}`;
      el.className = 'bjs-loader';
      el.innerHTML = `<span>${_sanitize(label)}</span><div id="bjs_bar_${me._id}" class="bjs-loader-bar"></div>`;
      me._handle.appendChild(el);
      return el;
    }

    function _cleanupRange(from, to, keepBackground = false) {
      for (let i = from; i < Math.min(to, me._commands.length); i++) {
        const c = me._commands[i];
        if (!c) continue;
        if (c.type === 'text' || c.type === 'image') document.getElementById(c.id)?.remove();
        else if (c.type === 'showTooltip')            _destroyTooltip(c.id);
        else if (c.type === 'background' && !keepBackground) document.getElementById(`bjs_bg_${me._id}`)?.remove();
      }
    }

    // ── Utilities ──────────────────────────────────────────────────────────────

    function _get(id) {
      if (!id) return false;
      if (typeof id === 'object') return id ? [id] : false;
      const els = String(id).split(' ').filter(Boolean).map(i => document.getElementById(i)).filter(Boolean);
      return els.length ? els : false;
    }

    function _cssGet(el, prop) {
      if (prop === 'rotate') return _getTx(el, 'rotate');
      if (prop === 'scale')  return _getTx(el, 'scale');
      return el.style[prop] || window.getComputedStyle(el).getPropertyValue(prop) || '';
    }

    function _noSelectDrag(el) {
      el.draggable = false;
      el.style.userSelect = el.style.webkitUserSelect = 'none';
      el.onselectstart = el.ondragstart = () => false;
    }

    // Strips <script> tags and inline event handlers — allows <a>, <b>, <br>, etc.
    function _sanitize(html) {
      if (!html) return '';
      return String(html)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
    }

    return me;
  }

  // ── Static constants ─────────────────────────────────────────────────────────
  BoardJS.SHOW = Object.freeze({
    APPEAR:      'appear',
    FADE:        'fade',
    ZOOM:        'zoom',
    SPLIT:       'split',
    FROM_LEFT:   'fromleft',
    FROM_RIGHT:  'fromright',
    FROM_TOP:    'fromtop',
    FROM_BOTTOM: 'frombottom',
  });

  BoardJS.EASE = Object.freeze({
    LINEAR:   'linear',
    IN:       'easein',
    OUT:      'easeout',
    BACK_IN:  'backin',
    BACK_OUT: 'backout',
    ELASTIC:  'elastic',
    BOUNCE:   'bounce',
  });

  return BoardJS;
})();
