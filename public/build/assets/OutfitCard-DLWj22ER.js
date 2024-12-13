import { a as J, j as N } from './app-jKCvGqK8.js';
import {
  L as Ie,
  C as Me,
  a as Ce,
  T as Le,
  I as De,
  b as Ae,
  V as We,
  E as ke,
  D as ze,
} from './index-CQPbnsk2.js';
import { r as Ne } from './index-Chjiymov.js';
import { T as oe } from './text-BAevXw7b.js';
import { H as xe } from './h-stack-DgkOJJod.js';
import { B as He } from './button-group-jEtKEu1x.js';
import { I as te } from './icon-button-Bu0BiuMR.js';
var re = {},
  K = {},
  Q = {},
  Z = {},
  ae;
function qe() {
  return (
    ae ||
      ((ae = 1),
      (function (l) {
        (function (O, v) {
          v(l, J(), Ne());
        })(Z, function (O, v, C) {
          Object.defineProperty(O, '__esModule', { value: !0 }),
            (O.setHasSupportToCaptureOption = y);
          var w = b(v),
            i = b(C);
          function b(f) {
            return f && f.__esModule ? f : { default: f };
          }
          var I =
            Object.assign ||
            function (f) {
              for (var S = 1; S < arguments.length; S++) {
                var g = arguments[S];
                for (var u in g)
                  Object.prototype.hasOwnProperty.call(g, u) && (f[u] = g[u]);
              }
              return f;
            };
          function L(f, S) {
            var g = {};
            for (var u in f)
              S.indexOf(u) >= 0 ||
                (Object.prototype.hasOwnProperty.call(f, u) && (g[u] = f[u]));
            return g;
          }
          function E(f, S) {
            if (!(f instanceof S))
              throw new TypeError('Cannot call a class as a function');
          }
          var D = (function () {
            function f(S, g) {
              for (var u = 0; u < g.length; u++) {
                var c = g[u];
                (c.enumerable = c.enumerable || !1),
                  (c.configurable = !0),
                  'value' in c && (c.writable = !0),
                  Object.defineProperty(S, c.key, c);
              }
            }
            return function (S, g, u) {
              return g && f(S.prototype, g), u && f(S, u), S;
            };
          })();
          function R(f, S) {
            if (!f)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called",
              );
            return S && (typeof S == 'object' || typeof S == 'function')
              ? S
              : f;
          }
          function d(f, S) {
            if (typeof S != 'function' && S !== null)
              throw new TypeError(
                'Super expression must either be null or a function, not ' +
                  typeof S,
              );
            (f.prototype = Object.create(S && S.prototype, {
              constructor: {
                value: f,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              S &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(f, S)
                  : (f.__proto__ = S));
          }
          var _ = !1;
          function y(f) {
            _ = f;
          }
          try {
            addEventListener(
              'test',
              null,
              Object.defineProperty({}, 'capture', {
                get: function () {
                  y(!0);
                },
              }),
            );
          } catch {}
          function M() {
            var f =
              arguments.length > 0 && arguments[0] !== void 0
                ? arguments[0]
                : { capture: !0 };
            return _ ? f : f.capture;
          }
          function k(f) {
            if ('touches' in f) {
              var S = f.touches[0],
                g = S.pageX,
                u = S.pageY;
              return { x: g, y: u };
            }
            var c = f.screenX,
              A = f.screenY;
            return { x: c, y: A };
          }
          var x = (function (f) {
            d(S, f);
            function S() {
              var g;
              E(this, S);
              for (var u = arguments.length, c = Array(u), A = 0; A < u; A++)
                c[A] = arguments[A];
              var n = R(
                this,
                (g = S.__proto__ || Object.getPrototypeOf(S)).call.apply(
                  g,
                  [this].concat(c),
                ),
              );
              return (
                (n._handleSwipeStart = n._handleSwipeStart.bind(n)),
                (n._handleSwipeMove = n._handleSwipeMove.bind(n)),
                (n._handleSwipeEnd = n._handleSwipeEnd.bind(n)),
                (n._onMouseDown = n._onMouseDown.bind(n)),
                (n._onMouseMove = n._onMouseMove.bind(n)),
                (n._onMouseUp = n._onMouseUp.bind(n)),
                (n._setSwiperRef = n._setSwiperRef.bind(n)),
                n
              );
            }
            return (
              D(S, [
                {
                  key: 'componentDidMount',
                  value: function () {
                    this.swiper &&
                      this.swiper.addEventListener(
                        'touchmove',
                        this._handleSwipeMove,
                        M({ capture: !0, passive: !1 }),
                      );
                  },
                },
                {
                  key: 'componentWillUnmount',
                  value: function () {
                    this.swiper &&
                      this.swiper.removeEventListener(
                        'touchmove',
                        this._handleSwipeMove,
                        M({ capture: !0, passive: !1 }),
                      );
                  },
                },
                {
                  key: '_onMouseDown',
                  value: function (u) {
                    this.props.allowMouseEvents &&
                      ((this.mouseDown = !0),
                      document.addEventListener('mouseup', this._onMouseUp),
                      document.addEventListener('mousemove', this._onMouseMove),
                      this._handleSwipeStart(u));
                  },
                },
                {
                  key: '_onMouseMove',
                  value: function (u) {
                    this.mouseDown && this._handleSwipeMove(u);
                  },
                },
                {
                  key: '_onMouseUp',
                  value: function (u) {
                    (this.mouseDown = !1),
                      document.removeEventListener('mouseup', this._onMouseUp),
                      document.removeEventListener(
                        'mousemove',
                        this._onMouseMove,
                      ),
                      this._handleSwipeEnd(u);
                  },
                },
                {
                  key: '_handleSwipeStart',
                  value: function (u) {
                    var c = k(u),
                      A = c.x,
                      n = c.y;
                    (this.moveStart = { x: A, y: n }),
                      this.props.onSwipeStart(u);
                  },
                },
                {
                  key: '_handleSwipeMove',
                  value: function (u) {
                    if (this.moveStart) {
                      var c = k(u),
                        A = c.x,
                        n = c.y,
                        a = A - this.moveStart.x,
                        P = n - this.moveStart.y;
                      this.moving = !0;
                      var r = this.props.onSwipeMove({ x: a, y: P }, u);
                      r && u.cancelable && u.preventDefault(),
                        (this.movePosition = { deltaX: a, deltaY: P });
                    }
                  },
                },
                {
                  key: '_handleSwipeEnd',
                  value: function (u) {
                    this.props.onSwipeEnd(u);
                    var c = this.props.tolerance;
                    this.moving &&
                      this.movePosition &&
                      (this.movePosition.deltaX < -c
                        ? this.props.onSwipeLeft(1, u)
                        : this.movePosition.deltaX > c &&
                          this.props.onSwipeRight(1, u),
                      this.movePosition.deltaY < -c
                        ? this.props.onSwipeUp(1, u)
                        : this.movePosition.deltaY > c &&
                          this.props.onSwipeDown(1, u)),
                      (this.moveStart = null),
                      (this.moving = !1),
                      (this.movePosition = null);
                  },
                },
                {
                  key: '_setSwiperRef',
                  value: function (u) {
                    (this.swiper = u), this.props.innerRef(u);
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    var u = this.props;
                    u.tagName;
                    var c = u.className,
                      A = u.style,
                      n = u.children;
                    u.allowMouseEvents,
                      u.onSwipeUp,
                      u.onSwipeDown,
                      u.onSwipeLeft,
                      u.onSwipeRight,
                      u.onSwipeStart,
                      u.onSwipeMove,
                      u.onSwipeEnd,
                      u.innerRef,
                      u.tolerance;
                    var a = L(u, [
                      'tagName',
                      'className',
                      'style',
                      'children',
                      'allowMouseEvents',
                      'onSwipeUp',
                      'onSwipeDown',
                      'onSwipeLeft',
                      'onSwipeRight',
                      'onSwipeStart',
                      'onSwipeMove',
                      'onSwipeEnd',
                      'innerRef',
                      'tolerance',
                    ]);
                    return w.default.createElement(
                      this.props.tagName,
                      I(
                        {
                          ref: this._setSwiperRef,
                          onMouseDown: this._onMouseDown,
                          onTouchStart: this._handleSwipeStart,
                          onTouchEnd: this._handleSwipeEnd,
                          className: c,
                          style: A,
                        },
                        a,
                      ),
                      n,
                    );
                  },
                },
              ]),
              S
            );
          })(v.Component);
          (x.displayName = 'ReactSwipe'),
            (x.propTypes = {
              tagName: i.default.string,
              className: i.default.string,
              style: i.default.object,
              children: i.default.node,
              allowMouseEvents: i.default.bool,
              onSwipeUp: i.default.func,
              onSwipeDown: i.default.func,
              onSwipeLeft: i.default.func,
              onSwipeRight: i.default.func,
              onSwipeStart: i.default.func,
              onSwipeMove: i.default.func,
              onSwipeEnd: i.default.func,
              innerRef: i.default.func,
              tolerance: i.default.number.isRequired,
            }),
            (x.defaultProps = {
              tagName: 'div',
              allowMouseEvents: !1,
              onSwipeUp: function () {},
              onSwipeDown: function () {},
              onSwipeLeft: function () {},
              onSwipeRight: function () {},
              onSwipeStart: function () {},
              onSwipeMove: function () {},
              onSwipeEnd: function () {},
              innerRef: function () {},
              tolerance: 0,
            }),
            (O.default = x);
        });
      })(Z)),
    Z
  );
}
var se;
function ge() {
  return (
    se ||
      ((se = 1),
      (function (l) {
        (function (O, v) {
          v(l, qe());
        })(Q, function (O, v) {
          Object.defineProperty(O, '__esModule', { value: !0 });
          var C = w(v);
          function w(i) {
            return i && i.__esModule ? i : { default: i };
          }
          O.default = C.default;
        });
      })(Q)),
    Q
  );
}
var B = {},
  ne = { exports: {} }; /*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
var ue;
function je() {
  return (
    ue ||
      ((ue = 1),
      (function (l) {
        (function () {
          var O = {}.hasOwnProperty;
          function v() {
            for (var i = '', b = 0; b < arguments.length; b++) {
              var I = arguments[b];
              I && (i = w(i, C(I)));
            }
            return i;
          }
          function C(i) {
            if (typeof i == 'string' || typeof i == 'number') return i;
            if (typeof i != 'object') return '';
            if (Array.isArray(i)) return v.apply(null, i);
            if (
              i.toString !== Object.prototype.toString &&
              !i.toString.toString().includes('[native code]')
            )
              return i.toString();
            var b = '';
            for (var I in i) O.call(i, I) && i[I] && (b = w(b, I));
            return b;
          }
          function w(i, b) {
            return b ? (i ? i + ' ' + b : i + b) : i;
          }
          l.exports
            ? ((v.default = v), (l.exports = v))
            : (window.classNames = v);
        })();
      })(ne)),
    ne.exports
  );
}
var le;
function _e() {
  if (le) return B;
  (le = 1),
    Object.defineProperty(B, '__esModule', { value: !0 }),
    (B.default = void 0);
  var l = O(je());
  function O(w) {
    return w && w.__esModule ? w : { default: w };
  }
  function v(w, i, b) {
    return (
      i in w
        ? Object.defineProperty(w, i, {
            value: b,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (w[i] = b),
      w
    );
  }
  var C = {
    ROOT: function (i) {
      return (0, l.default)(v({ 'carousel-root': !0 }, i || '', !!i));
    },
    CAROUSEL: function (i) {
      return (0, l.default)({ carousel: !0, 'carousel-slider': i });
    },
    WRAPPER: function (i, b) {
      return (0, l.default)({
        'thumbs-wrapper': !i,
        'slider-wrapper': i,
        'axis-horizontal': b === 'horizontal',
        'axis-vertical': b !== 'horizontal',
      });
    },
    SLIDER: function (i, b) {
      return (0, l.default)({ thumbs: !i, slider: i, animated: !b });
    },
    ITEM: function (i, b, I) {
      return (0, l.default)({ thumb: !i, slide: i, selected: b, previous: I });
    },
    ARROW_PREV: function (i) {
      return (0, l.default)({
        'control-arrow control-prev': !0,
        'control-disabled': i,
      });
    },
    ARROW_NEXT: function (i) {
      return (0, l.default)({
        'control-arrow control-next': !0,
        'control-disabled': i,
      });
    },
    DOT: function (i) {
      return (0, l.default)({ dot: !0, selected: i });
    },
  };
  return (B.default = C), B;
}
var V = {},
  X = {},
  fe;
function Ue() {
  if (fe) return X;
  (fe = 1),
    Object.defineProperty(X, '__esModule', { value: !0 }),
    (X.outerWidth = void 0);
  var l = function (v) {
    var C = v.offsetWidth,
      w = getComputedStyle(v);
    return (C += parseInt(w.marginLeft) + parseInt(w.marginRight)), C;
  };
  return (X.outerWidth = l), X;
}
var $ = {},
  ce;
function ie() {
  if (ce) return $;
  (ce = 1),
    Object.defineProperty($, '__esModule', { value: !0 }),
    ($.default = void 0);
  var l = function (v, C, w) {
    var i = v === 0 ? v : v + C,
      b = w === 'horizontal' ? [i, 0, 0] : [0, i, 0],
      I = 'translate3d',
      L = '(' + b.join(',') + ')';
    return I + L;
  };
  return ($.default = l), $;
}
var Y = {},
  pe;
function Pe() {
  if (pe) return Y;
  (pe = 1),
    Object.defineProperty(Y, '__esModule', { value: !0 }),
    (Y.default = void 0);
  var l = function () {
    return window;
  };
  return (Y.default = l), Y;
}
var de;
function Re() {
  if (de) return V;
  (de = 1),
    Object.defineProperty(V, '__esModule', { value: !0 }),
    (V.default = void 0);
  var l = L(J()),
    O = b(_e()),
    v = Ue(),
    C = b(ie()),
    w = b(ge()),
    i = b(Pe());
  function b(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function I() {
    if (typeof WeakMap != 'function') return null;
    var n = new WeakMap();
    return (
      (I = function () {
        return n;
      }),
      n
    );
  }
  function L(n) {
    if (n && n.__esModule) return n;
    if (n === null || (E(n) !== 'object' && typeof n != 'function'))
      return { default: n };
    var a = I();
    if (a && a.has(n)) return a.get(n);
    var P = {},
      r = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var t in n)
      if (Object.prototype.hasOwnProperty.call(n, t)) {
        var o = r ? Object.getOwnPropertyDescriptor(n, t) : null;
        o && (o.get || o.set) ? Object.defineProperty(P, t, o) : (P[t] = n[t]);
      }
    return (P.default = n), a && a.set(n, P), P;
  }
  function E(n) {
    '@babel/helpers - typeof';
    return (
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? (E = function (P) {
            return typeof P;
          })
        : (E = function (P) {
            return P &&
              typeof Symbol == 'function' &&
              P.constructor === Symbol &&
              P !== Symbol.prototype
              ? 'symbol'
              : typeof P;
          }),
      E(n)
    );
  }
  function D() {
    return (
      (D =
        Object.assign ||
        function (n) {
          for (var a = 1; a < arguments.length; a++) {
            var P = arguments[a];
            for (var r in P)
              Object.prototype.hasOwnProperty.call(P, r) && (n[r] = P[r]);
          }
          return n;
        }),
      D.apply(this, arguments)
    );
  }
  function R(n, a) {
    if (!(n instanceof a))
      throw new TypeError('Cannot call a class as a function');
  }
  function d(n, a) {
    for (var P = 0; P < a.length; P++) {
      var r = a[P];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        'value' in r && (r.writable = !0),
        Object.defineProperty(n, r.key, r);
    }
  }
  function _(n, a, P) {
    return a && d(n.prototype, a), n;
  }
  function y(n, a) {
    if (typeof a != 'function' && a !== null)
      throw new TypeError('Super expression must either be null or a function');
    (n.prototype = Object.create(a && a.prototype, {
      constructor: { value: n, writable: !0, configurable: !0 },
    })),
      a && M(n, a);
  }
  function M(n, a) {
    return (
      (M =
        Object.setPrototypeOf ||
        function (r, t) {
          return (r.__proto__ = t), r;
        }),
      M(n, a)
    );
  }
  function k(n) {
    var a = S();
    return function () {
      var r = g(n),
        t;
      if (a) {
        var o = g(this).constructor;
        t = Reflect.construct(r, arguments, o);
      } else t = r.apply(this, arguments);
      return x(this, t);
    };
  }
  function x(n, a) {
    return a && (E(a) === 'object' || typeof a == 'function') ? a : f(n);
  }
  function f(n) {
    if (n === void 0)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return n;
  }
  function S() {
    if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham)
      return !1;
    if (typeof Proxy == 'function') return !0;
    try {
      return (
        Date.prototype.toString.call(
          Reflect.construct(Date, [], function () {}),
        ),
        !0
      );
    } catch {
      return !1;
    }
  }
  function g(n) {
    return (
      (g = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function (P) {
            return P.__proto__ || Object.getPrototypeOf(P);
          }),
      g(n)
    );
  }
  function u(n, a, P) {
    return (
      a in n
        ? Object.defineProperty(n, a, {
            value: P,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (n[a] = P),
      n
    );
  }
  var c = function (a) {
      return a.hasOwnProperty('key');
    },
    A = (function (n) {
      y(P, n);
      var a = k(P);
      function P(r) {
        var t;
        return (
          R(this, P),
          (t = a.call(this, r)),
          u(f(t), 'itemsWrapperRef', void 0),
          u(f(t), 'itemsListRef', void 0),
          u(f(t), 'thumbsRef', void 0),
          u(f(t), 'setItemsWrapperRef', function (o) {
            t.itemsWrapperRef = o;
          }),
          u(f(t), 'setItemsListRef', function (o) {
            t.itemsListRef = o;
          }),
          u(f(t), 'setThumbsRef', function (o, s) {
            t.thumbsRef || (t.thumbsRef = []), (t.thumbsRef[s] = o);
          }),
          u(f(t), 'updateSizes', function () {
            if (!(!t.props.children || !t.itemsWrapperRef || !t.thumbsRef)) {
              var o = l.Children.count(t.props.children),
                s = t.itemsWrapperRef.clientWidth,
                e = t.props.thumbWidth
                  ? t.props.thumbWidth
                  : (0, v.outerWidth)(t.thumbsRef[0]),
                h = Math.floor(s / e),
                p = h < o,
                m = p ? o - h : 0;
              t.setState(function (T, W) {
                return {
                  itemSize: e,
                  visibleItems: h,
                  firstItem: p ? t.getFirstItem(W.selectedItem) : 0,
                  lastPosition: m,
                  showArrows: p,
                };
              });
            }
          }),
          u(f(t), 'handleClickItem', function (o, s, e) {
            if (!c(e) || e.key === 'Enter') {
              var h = t.props.onSelectItem;
              typeof h == 'function' && h(o, s);
            }
          }),
          u(f(t), 'onSwipeStart', function () {
            t.setState({ swiping: !0 });
          }),
          u(f(t), 'onSwipeEnd', function () {
            t.setState({ swiping: !1 });
          }),
          u(f(t), 'onSwipeMove', function (o) {
            var s = o.x;
            if (
              !t.state.itemSize ||
              !t.itemsWrapperRef ||
              !t.state.visibleItems
            )
              return !1;
            var e = 0,
              h = l.Children.count(t.props.children),
              p = -(t.state.firstItem * 100) / t.state.visibleItems,
              m = Math.max(h - t.state.visibleItems, 0),
              T = (-m * 100) / t.state.visibleItems;
            p === e && s > 0 && (s = 0), p === T && s < 0 && (s = 0);
            var W = t.itemsWrapperRef.clientWidth,
              z = p + 100 / (W / s);
            return (
              t.itemsListRef &&
                [
                  'WebkitTransform',
                  'MozTransform',
                  'MsTransform',
                  'OTransform',
                  'transform',
                  'msTransform',
                ].forEach(function (H) {
                  t.itemsListRef.style[H] = (0, C.default)(
                    z,
                    '%',
                    t.props.axis,
                  );
                }),
              !0
            );
          }),
          u(f(t), 'slideRight', function (o) {
            t.moveTo(t.state.firstItem - (typeof o == 'number' ? o : 1));
          }),
          u(f(t), 'slideLeft', function (o) {
            t.moveTo(t.state.firstItem + (typeof o == 'number' ? o : 1));
          }),
          u(f(t), 'moveTo', function (o) {
            (o = o < 0 ? 0 : o),
              (o = o >= t.state.lastPosition ? t.state.lastPosition : o),
              t.setState({ firstItem: o });
          }),
          (t.state = {
            selectedItem: r.selectedItem,
            swiping: !1,
            showArrows: !1,
            firstItem: 0,
            visibleItems: 0,
            lastPosition: 0,
          }),
          t
        );
      }
      return (
        _(P, [
          {
            key: 'componentDidMount',
            value: function () {
              this.setupThumbs();
            },
          },
          {
            key: 'componentDidUpdate',
            value: function (t) {
              this.props.selectedItem !== this.state.selectedItem &&
                this.setState({
                  selectedItem: this.props.selectedItem,
                  firstItem: this.getFirstItem(this.props.selectedItem),
                }),
                this.props.children !== t.children && this.updateSizes();
            },
          },
          {
            key: 'componentWillUnmount',
            value: function () {
              this.destroyThumbs();
            },
          },
          {
            key: 'setupThumbs',
            value: function () {
              (0, i.default)().addEventListener('resize', this.updateSizes),
                (0, i.default)().addEventListener(
                  'DOMContentLoaded',
                  this.updateSizes,
                ),
                this.updateSizes();
            },
          },
          {
            key: 'destroyThumbs',
            value: function () {
              (0, i.default)().removeEventListener('resize', this.updateSizes),
                (0, i.default)().removeEventListener(
                  'DOMContentLoaded',
                  this.updateSizes,
                );
            },
          },
          {
            key: 'getFirstItem',
            value: function (t) {
              var o = t;
              return (
                t >= this.state.lastPosition && (o = this.state.lastPosition),
                t < this.state.firstItem + this.state.visibleItems &&
                  (o = this.state.firstItem),
                t < this.state.firstItem && (o = t),
                o
              );
            },
          },
          {
            key: 'renderItems',
            value: function () {
              var t = this;
              return this.props.children.map(function (o, s) {
                var e = O.default.ITEM(!1, s === t.state.selectedItem),
                  h = {
                    key: s,
                    ref: function (m) {
                      return t.setThumbsRef(m, s);
                    },
                    className: e,
                    onClick: t.handleClickItem.bind(t, s, t.props.children[s]),
                    onKeyDown: t.handleClickItem.bind(
                      t,
                      s,
                      t.props.children[s],
                    ),
                    'aria-label': ''
                      .concat(t.props.labels.item, ' ')
                      .concat(s + 1),
                    style: { width: t.props.thumbWidth },
                  };
                return l.default.createElement(
                  'li',
                  D({}, h, { role: 'button', tabIndex: 0 }),
                  o,
                );
              });
            },
          },
          {
            key: 'render',
            value: function () {
              var t = this;
              if (!this.props.children) return null;
              var o = l.Children.count(this.props.children) > 1,
                s = this.state.showArrows && this.state.firstItem > 0,
                e =
                  this.state.showArrows &&
                  this.state.firstItem < this.state.lastPosition,
                h = {},
                p = -this.state.firstItem * (this.state.itemSize || 0),
                m = (0, C.default)(p, 'px', this.props.axis),
                T = this.props.transitionTime + 'ms';
              return (
                (h = {
                  WebkitTransform: m,
                  MozTransform: m,
                  MsTransform: m,
                  OTransform: m,
                  transform: m,
                  msTransform: m,
                  WebkitTransitionDuration: T,
                  MozTransitionDuration: T,
                  MsTransitionDuration: T,
                  OTransitionDuration: T,
                  transitionDuration: T,
                  msTransitionDuration: T,
                }),
                l.default.createElement(
                  'div',
                  { className: O.default.CAROUSEL(!1) },
                  l.default.createElement(
                    'div',
                    {
                      className: O.default.WRAPPER(!1),
                      ref: this.setItemsWrapperRef,
                    },
                    l.default.createElement('button', {
                      type: 'button',
                      className: O.default.ARROW_PREV(!s),
                      onClick: function () {
                        return t.slideRight();
                      },
                      'aria-label': this.props.labels.leftArrow,
                    }),
                    o
                      ? l.default.createElement(
                          w.default,
                          {
                            tagName: 'ul',
                            className: O.default.SLIDER(!1, this.state.swiping),
                            onSwipeLeft: this.slideLeft,
                            onSwipeRight: this.slideRight,
                            onSwipeMove: this.onSwipeMove,
                            onSwipeStart: this.onSwipeStart,
                            onSwipeEnd: this.onSwipeEnd,
                            style: h,
                            innerRef: this.setItemsListRef,
                            allowMouseEvents: this.props.emulateTouch,
                          },
                          this.renderItems(),
                        )
                      : l.default.createElement(
                          'ul',
                          {
                            className: O.default.SLIDER(!1, this.state.swiping),
                            ref: function (z) {
                              return t.setItemsListRef(z);
                            },
                            style: h,
                          },
                          this.renderItems(),
                        ),
                    l.default.createElement('button', {
                      type: 'button',
                      className: O.default.ARROW_NEXT(!e),
                      onClick: function () {
                        return t.slideLeft();
                      },
                      'aria-label': this.props.labels.rightArrow,
                    }),
                  ),
                )
              );
            },
          },
        ]),
        P
      );
    })(l.Component);
  return (
    (V.default = A),
    u(A, 'displayName', 'Thumbs'),
    u(A, 'defaultProps', {
      axis: 'horizontal',
      labels: {
        leftArrow: 'previous slide / item',
        rightArrow: 'next slide / item',
        item: 'slide item',
      },
      selectedItem: 0,
      thumbWidth: 80,
      transitionTime: 350,
    }),
    V
  );
}
var G = {},
  he;
function Fe() {
  if (he) return G;
  (he = 1),
    Object.defineProperty(G, '__esModule', { value: !0 }),
    (G.default = void 0);
  var l = function () {
    return document;
  };
  return (G.default = l), G;
}
var q = {},
  me;
function Oe() {
  if (me) return q;
  (me = 1),
    Object.defineProperty(q, '__esModule', { value: !0 }),
    (q.setPosition =
      q.getPosition =
      q.isKeyboardEvent =
      q.defaultStatusFormatter =
      q.noop =
        void 0);
  var l = J(),
    O = v(ie());
  function v(L) {
    return L && L.__esModule ? L : { default: L };
  }
  var C = function () {};
  q.noop = C;
  var w = function (E, D) {
    return ''.concat(E, ' of ').concat(D);
  };
  q.defaultStatusFormatter = w;
  var i = function (E) {
    return E ? E.hasOwnProperty('key') : !1;
  };
  q.isKeyboardEvent = i;
  var b = function (E, D) {
    if ((D.infiniteLoop && ++E, E === 0)) return 0;
    var R = l.Children.count(D.children);
    if (D.centerMode && D.axis === 'horizontal') {
      var d = -E * D.centerSlidePercentage,
        _ = R - 1;
      return (
        E && (E !== _ || D.infiniteLoop)
          ? (d += (100 - D.centerSlidePercentage) / 2)
          : E === _ && (d += 100 - D.centerSlidePercentage),
        d
      );
    }
    return -E * 100;
  };
  q.getPosition = b;
  var I = function (E, D) {
    var R = {};
    return (
      [
        'WebkitTransform',
        'MozTransform',
        'MsTransform',
        'OTransform',
        'transform',
        'msTransform',
      ].forEach(function (d) {
        R[d] = (0, O.default)(E, '%', D);
      }),
      R
    );
  };
  return (q.setPosition = I), q;
}
var U = {},
  ve;
function Ke() {
  if (ve) return U;
  (ve = 1),
    Object.defineProperty(U, '__esModule', { value: !0 }),
    (U.fadeAnimationHandler =
      U.slideStopSwipingHandler =
      U.slideSwipeAnimationHandler =
      U.slideAnimationHandler =
        void 0);
  var l = J(),
    O = C(ie()),
    v = Oe();
  function C(R) {
    return R && R.__esModule ? R : { default: R };
  }
  function w(R, d) {
    var _ = Object.keys(R);
    if (Object.getOwnPropertySymbols) {
      var y = Object.getOwnPropertySymbols(R);
      d &&
        (y = y.filter(function (M) {
          return Object.getOwnPropertyDescriptor(R, M).enumerable;
        })),
        _.push.apply(_, y);
    }
    return _;
  }
  function i(R) {
    for (var d = 1; d < arguments.length; d++) {
      var _ = arguments[d] != null ? arguments[d] : {};
      d % 2
        ? w(Object(_), !0).forEach(function (y) {
            b(R, y, _[y]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(R, Object.getOwnPropertyDescriptors(_))
          : w(Object(_)).forEach(function (y) {
              Object.defineProperty(
                R,
                y,
                Object.getOwnPropertyDescriptor(_, y),
              );
            });
    }
    return R;
  }
  function b(R, d, _) {
    return (
      d in R
        ? Object.defineProperty(R, d, {
            value: _,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (R[d] = _),
      R
    );
  }
  var I = function (d, _) {
    var y = {},
      M = _.selectedItem,
      k = M,
      x = l.Children.count(d.children) - 1,
      f = d.infiniteLoop && (M < 0 || M > x);
    if (f)
      return (
        k < 0
          ? d.centerMode && d.centerSlidePercentage && d.axis === 'horizontal'
            ? (y.itemListStyle = (0, v.setPosition)(
                -(x + 2) * d.centerSlidePercentage -
                  (100 - d.centerSlidePercentage) / 2,
                d.axis,
              ))
            : (y.itemListStyle = (0, v.setPosition)(-(x + 2) * 100, d.axis))
          : k > x && (y.itemListStyle = (0, v.setPosition)(0, d.axis)),
        y
      );
    var S = (0, v.getPosition)(M, d),
      g = (0, O.default)(S, '%', d.axis),
      u = d.transitionTime + 'ms';
    return (
      (y.itemListStyle = {
        WebkitTransform: g,
        msTransform: g,
        OTransform: g,
        transform: g,
      }),
      _.swiping ||
        (y.itemListStyle = i(
          i({}, y.itemListStyle),
          {},
          {
            WebkitTransitionDuration: u,
            MozTransitionDuration: u,
            OTransitionDuration: u,
            transitionDuration: u,
            msTransitionDuration: u,
          },
        )),
      y
    );
  };
  U.slideAnimationHandler = I;
  var L = function (d, _, y, M) {
    var k = {},
      x = _.axis === 'horizontal',
      f = l.Children.count(_.children),
      S = 0,
      g = (0, v.getPosition)(y.selectedItem, _),
      u = _.infiniteLoop
        ? (0, v.getPosition)(f - 1, _) - 100
        : (0, v.getPosition)(f - 1, _),
      c = x ? d.x : d.y,
      A = c;
    g === S && c > 0 && (A = 0), g === u && c < 0 && (A = 0);
    var n = g + 100 / (y.itemSize / A),
      a = Math.abs(c) > _.swipeScrollTolerance;
    return (
      _.infiniteLoop &&
        a &&
        (y.selectedItem === 0 && n > -100
          ? (n -= f * 100)
          : y.selectedItem === f - 1 && n < -f * 100 && (n += f * 100)),
      (!_.preventMovementUntilSwipeScrollTolerance ||
        a ||
        y.swipeMovementStarted) &&
        (y.swipeMovementStarted || M({ swipeMovementStarted: !0 }),
        (k.itemListStyle = (0, v.setPosition)(n, _.axis))),
      a && !y.cancelClick && M({ cancelClick: !0 }),
      k
    );
  };
  U.slideSwipeAnimationHandler = L;
  var E = function (d, _) {
    var y = (0, v.getPosition)(_.selectedItem, d),
      M = (0, v.setPosition)(y, d.axis);
    return { itemListStyle: M };
  };
  U.slideStopSwipingHandler = E;
  var D = function (d, _) {
    var y = d.transitionTime + 'ms',
      M = 'ease-in-out',
      k = {
        position: 'absolute',
        display: 'block',
        zIndex: -2,
        minHeight: '100%',
        opacity: 0,
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        transitionTimingFunction: M,
        msTransitionTimingFunction: M,
        MozTransitionTimingFunction: M,
        WebkitTransitionTimingFunction: M,
        OTransitionTimingFunction: M,
      };
    return (
      _.swiping ||
        (k = i(
          i({}, k),
          {},
          {
            WebkitTransitionDuration: y,
            MozTransitionDuration: y,
            OTransitionDuration: y,
            transitionDuration: y,
            msTransitionDuration: y,
          },
        )),
      {
        slideStyle: k,
        selectedStyle: i(i({}, k), {}, { opacity: 1, position: 'relative' }),
        prevStyle: i({}, k),
      }
    );
  };
  return (U.fadeAnimationHandler = D), U;
}
var ye;
function Be() {
  if (ye) return K;
  (ye = 1),
    Object.defineProperty(K, '__esModule', { value: !0 }),
    (K.default = void 0);
  var l = D(J()),
    O = L(ge()),
    v = L(_e()),
    C = L(Re()),
    w = L(Fe()),
    i = L(Pe()),
    b = Oe(),
    I = Ke();
  function L(r) {
    return r && r.__esModule ? r : { default: r };
  }
  function E() {
    if (typeof WeakMap != 'function') return null;
    var r = new WeakMap();
    return (
      (E = function () {
        return r;
      }),
      r
    );
  }
  function D(r) {
    if (r && r.__esModule) return r;
    if (r === null || (R(r) !== 'object' && typeof r != 'function'))
      return { default: r };
    var t = E();
    if (t && t.has(r)) return t.get(r);
    var o = {},
      s = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var e in r)
      if (Object.prototype.hasOwnProperty.call(r, e)) {
        var h = s ? Object.getOwnPropertyDescriptor(r, e) : null;
        h && (h.get || h.set) ? Object.defineProperty(o, e, h) : (o[e] = r[e]);
      }
    return (o.default = r), t && t.set(r, o), o;
  }
  function R(r) {
    '@babel/helpers - typeof';
    return (
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? (R = function (o) {
            return typeof o;
          })
        : (R = function (o) {
            return o &&
              typeof Symbol == 'function' &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? 'symbol'
              : typeof o;
          }),
      R(r)
    );
  }
  function d() {
    return (
      (d =
        Object.assign ||
        function (r) {
          for (var t = 1; t < arguments.length; t++) {
            var o = arguments[t];
            for (var s in o)
              Object.prototype.hasOwnProperty.call(o, s) && (r[s] = o[s]);
          }
          return r;
        }),
      d.apply(this, arguments)
    );
  }
  function _(r, t) {
    var o = Object.keys(r);
    if (Object.getOwnPropertySymbols) {
      var s = Object.getOwnPropertySymbols(r);
      t &&
        (s = s.filter(function (e) {
          return Object.getOwnPropertyDescriptor(r, e).enumerable;
        })),
        o.push.apply(o, s);
    }
    return o;
  }
  function y(r) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t] != null ? arguments[t] : {};
      t % 2
        ? _(Object(o), !0).forEach(function (s) {
            a(r, s, o[s]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o))
          : _(Object(o)).forEach(function (s) {
              Object.defineProperty(
                r,
                s,
                Object.getOwnPropertyDescriptor(o, s),
              );
            });
    }
    return r;
  }
  function M(r, t) {
    if (!(r instanceof t))
      throw new TypeError('Cannot call a class as a function');
  }
  function k(r, t) {
    for (var o = 0; o < t.length; o++) {
      var s = t[o];
      (s.enumerable = s.enumerable || !1),
        (s.configurable = !0),
        'value' in s && (s.writable = !0),
        Object.defineProperty(r, s.key, s);
    }
  }
  function x(r, t, o) {
    return t && k(r.prototype, t), r;
  }
  function f(r, t) {
    if (typeof t != 'function' && t !== null)
      throw new TypeError('Super expression must either be null or a function');
    (r.prototype = Object.create(t && t.prototype, {
      constructor: { value: r, writable: !0, configurable: !0 },
    })),
      t && S(r, t);
  }
  function S(r, t) {
    return (
      (S =
        Object.setPrototypeOf ||
        function (s, e) {
          return (s.__proto__ = e), s;
        }),
      S(r, t)
    );
  }
  function g(r) {
    var t = A();
    return function () {
      var s = n(r),
        e;
      if (t) {
        var h = n(this).constructor;
        e = Reflect.construct(s, arguments, h);
      } else e = s.apply(this, arguments);
      return u(this, e);
    };
  }
  function u(r, t) {
    return t && (R(t) === 'object' || typeof t == 'function') ? t : c(r);
  }
  function c(r) {
    if (r === void 0)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return r;
  }
  function A() {
    if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham)
      return !1;
    if (typeof Proxy == 'function') return !0;
    try {
      return (
        Date.prototype.toString.call(
          Reflect.construct(Date, [], function () {}),
        ),
        !0
      );
    } catch {
      return !1;
    }
  }
  function n(r) {
    return (
      (n = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function (o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          }),
      n(r)
    );
  }
  function a(r, t, o) {
    return (
      t in r
        ? Object.defineProperty(r, t, {
            value: o,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (r[t] = o),
      r
    );
  }
  var P = (function (r) {
    f(o, r);
    var t = g(o);
    function o(s) {
      var e;
      M(this, o),
        (e = t.call(this, s)),
        a(c(e), 'thumbsRef', void 0),
        a(c(e), 'carouselWrapperRef', void 0),
        a(c(e), 'listRef', void 0),
        a(c(e), 'itemsRef', void 0),
        a(c(e), 'timer', void 0),
        a(c(e), 'animationHandler', void 0),
        a(c(e), 'setThumbsRef', function (p) {
          e.thumbsRef = p;
        }),
        a(c(e), 'setCarouselWrapperRef', function (p) {
          e.carouselWrapperRef = p;
        }),
        a(c(e), 'setListRef', function (p) {
          e.listRef = p;
        }),
        a(c(e), 'setItemsRef', function (p, m) {
          e.itemsRef || (e.itemsRef = []), (e.itemsRef[m] = p);
        }),
        a(c(e), 'autoPlay', function () {
          l.Children.count(e.props.children) <= 1 ||
            (e.clearAutoPlay(),
            e.props.autoPlay &&
              (e.timer = setTimeout(function () {
                e.increment();
              }, e.props.interval)));
        }),
        a(c(e), 'clearAutoPlay', function () {
          e.timer && clearTimeout(e.timer);
        }),
        a(c(e), 'resetAutoPlay', function () {
          e.clearAutoPlay(), e.autoPlay();
        }),
        a(c(e), 'stopOnHover', function () {
          e.setState({ isMouseEntered: !0 }, e.clearAutoPlay);
        }),
        a(c(e), 'startOnLeave', function () {
          e.setState({ isMouseEntered: !1 }, e.autoPlay);
        }),
        a(c(e), 'isFocusWithinTheCarousel', function () {
          return e.carouselWrapperRef
            ? !!(
                (0, w.default)().activeElement === e.carouselWrapperRef ||
                e.carouselWrapperRef.contains((0, w.default)().activeElement)
              )
            : !1;
        }),
        a(c(e), 'navigateWithKeyboard', function (p) {
          if (e.isFocusWithinTheCarousel()) {
            var m = e.props.axis,
              T = m === 'horizontal',
              W = { ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, ArrowLeft: 37 },
              z = T ? W.ArrowRight : W.ArrowDown,
              H = T ? W.ArrowLeft : W.ArrowUp;
            z === p.keyCode ? e.increment() : H === p.keyCode && e.decrement();
          }
        }),
        a(c(e), 'updateSizes', function () {
          if (
            !(!e.state.initialized || !e.itemsRef || e.itemsRef.length === 0)
          ) {
            var p = e.props.axis === 'horizontal',
              m = e.itemsRef[0];
            if (m) {
              var T = p ? m.clientWidth : m.clientHeight;
              e.setState({ itemSize: T }),
                e.thumbsRef && e.thumbsRef.updateSizes();
            }
          }
        }),
        a(c(e), 'setMountState', function () {
          e.setState({ hasMount: !0 }), e.updateSizes();
        }),
        a(c(e), 'handleClickItem', function (p, m) {
          if (l.Children.count(e.props.children) !== 0) {
            if (e.state.cancelClick) {
              e.setState({ cancelClick: !1 });
              return;
            }
            e.props.onClickItem(p, m),
              p !== e.state.selectedItem && e.setState({ selectedItem: p });
          }
        }),
        a(c(e), 'handleOnChange', function (p, m) {
          l.Children.count(e.props.children) <= 1 || e.props.onChange(p, m);
        }),
        a(c(e), 'handleClickThumb', function (p, m) {
          e.props.onClickThumb(p, m), e.moveTo(p);
        }),
        a(c(e), 'onSwipeStart', function (p) {
          e.setState({ swiping: !0 }), e.props.onSwipeStart(p);
        }),
        a(c(e), 'onSwipeEnd', function (p) {
          e.setState({
            swiping: !1,
            cancelClick: !1,
            swipeMovementStarted: !1,
          }),
            e.props.onSwipeEnd(p),
            e.clearAutoPlay(),
            e.state.autoPlay && e.autoPlay();
        }),
        a(c(e), 'onSwipeMove', function (p, m) {
          e.props.onSwipeMove(m);
          var T = e.props.swipeAnimationHandler(
            p,
            e.props,
            e.state,
            e.setState.bind(c(e)),
          );
          return e.setState(y({}, T)), !!Object.keys(T).length;
        }),
        a(c(e), 'decrement', function () {
          var p =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
          e.moveTo(e.state.selectedItem - (typeof p == 'number' ? p : 1));
        }),
        a(c(e), 'increment', function () {
          var p =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
          e.moveTo(e.state.selectedItem + (typeof p == 'number' ? p : 1));
        }),
        a(c(e), 'moveTo', function (p) {
          if (typeof p == 'number') {
            var m = l.Children.count(e.props.children) - 1;
            p < 0 && (p = e.props.infiniteLoop ? m : 0),
              p > m && (p = e.props.infiniteLoop ? 0 : m),
              e.selectItem({ selectedItem: p }),
              e.state.autoPlay &&
                e.state.isMouseEntered === !1 &&
                e.resetAutoPlay();
          }
        }),
        a(c(e), 'onClickNext', function () {
          e.increment(1);
        }),
        a(c(e), 'onClickPrev', function () {
          e.decrement(1);
        }),
        a(c(e), 'onSwipeForward', function () {
          e.increment(1),
            e.props.emulateTouch && e.setState({ cancelClick: !0 });
        }),
        a(c(e), 'onSwipeBackwards', function () {
          e.decrement(1),
            e.props.emulateTouch && e.setState({ cancelClick: !0 });
        }),
        a(c(e), 'changeItem', function (p) {
          return function (m) {
            (!(0, b.isKeyboardEvent)(m) || m.key === 'Enter') && e.moveTo(p);
          };
        }),
        a(c(e), 'selectItem', function (p) {
          e.setState(y({ previousItem: e.state.selectedItem }, p), function () {
            e.setState(e.animationHandler(e.props, e.state));
          }),
            e.handleOnChange(
              p.selectedItem,
              l.Children.toArray(e.props.children)[p.selectedItem],
            );
        }),
        a(c(e), 'getInitialImage', function () {
          var p = e.props.selectedItem,
            m = e.itemsRef && e.itemsRef[p],
            T = (m && m.getElementsByTagName('img')) || [];
          return T[0];
        }),
        a(c(e), 'getVariableItemHeight', function (p) {
          var m = e.itemsRef && e.itemsRef[p];
          if (e.state.hasMount && m && m.children.length) {
            var T = m.children[0].getElementsByTagName('img') || [];
            if (T.length > 0) {
              var W = T[0];
              if (!W.complete) {
                var z = function j() {
                  e.forceUpdate(), W.removeEventListener('load', j);
                };
                W.addEventListener('load', z);
              }
            }
            var H = T[0] || m.children[0],
              F = H.clientHeight;
            return F > 0 ? F : null;
          }
          return null;
        });
      var h = {
        initialized: !1,
        previousItem: s.selectedItem,
        selectedItem: s.selectedItem,
        hasMount: !1,
        isMouseEntered: !1,
        autoPlay: s.autoPlay,
        swiping: !1,
        swipeMovementStarted: !1,
        cancelClick: !1,
        itemSize: 1,
        itemListStyle: {},
        slideStyle: {},
        selectedStyle: {},
        prevStyle: {},
      };
      return (
        (e.animationHandler =
          (typeof s.animationHandler == 'function' && s.animationHandler) ||
          (s.animationHandler === 'fade' && I.fadeAnimationHandler) ||
          I.slideAnimationHandler),
        (e.state = y(y({}, h), e.animationHandler(s, h))),
        e
      );
    }
    return (
      x(o, [
        {
          key: 'componentDidMount',
          value: function () {
            this.props.children && this.setupCarousel();
          },
        },
        {
          key: 'componentDidUpdate',
          value: function (e, h) {
            !e.children &&
              this.props.children &&
              !this.state.initialized &&
              this.setupCarousel(),
              !e.autoFocus && this.props.autoFocus && this.forceFocus(),
              h.swiping &&
                !this.state.swiping &&
                this.setState(
                  y({}, this.props.stopSwipingHandler(this.props, this.state)),
                ),
              (e.selectedItem !== this.props.selectedItem ||
                e.centerMode !== this.props.centerMode) &&
                (this.updateSizes(), this.moveTo(this.props.selectedItem)),
              e.autoPlay !== this.props.autoPlay &&
                (this.props.autoPlay
                  ? this.setupAutoPlay()
                  : this.destroyAutoPlay(),
                this.setState({ autoPlay: this.props.autoPlay }));
          },
        },
        {
          key: 'componentWillUnmount',
          value: function () {
            this.destroyCarousel();
          },
        },
        {
          key: 'setupCarousel',
          value: function () {
            var e = this;
            this.bindEvents(),
              this.state.autoPlay &&
                l.Children.count(this.props.children) > 1 &&
                this.setupAutoPlay(),
              this.props.autoFocus && this.forceFocus(),
              this.setState({ initialized: !0 }, function () {
                var h = e.getInitialImage();
                h && !h.complete
                  ? h.addEventListener('load', e.setMountState)
                  : e.setMountState();
              });
          },
        },
        {
          key: 'destroyCarousel',
          value: function () {
            this.state.initialized &&
              (this.unbindEvents(), this.destroyAutoPlay());
          },
        },
        {
          key: 'setupAutoPlay',
          value: function () {
            this.autoPlay();
            var e = this.carouselWrapperRef;
            this.props.stopOnHover &&
              e &&
              (e.addEventListener('mouseenter', this.stopOnHover),
              e.addEventListener('mouseleave', this.startOnLeave));
          },
        },
        {
          key: 'destroyAutoPlay',
          value: function () {
            this.clearAutoPlay();
            var e = this.carouselWrapperRef;
            this.props.stopOnHover &&
              e &&
              (e.removeEventListener('mouseenter', this.stopOnHover),
              e.removeEventListener('mouseleave', this.startOnLeave));
          },
        },
        {
          key: 'bindEvents',
          value: function () {
            (0, i.default)().addEventListener('resize', this.updateSizes),
              (0, i.default)().addEventListener(
                'DOMContentLoaded',
                this.updateSizes,
              ),
              this.props.useKeyboardArrows &&
                (0, w.default)().addEventListener(
                  'keydown',
                  this.navigateWithKeyboard,
                );
          },
        },
        {
          key: 'unbindEvents',
          value: function () {
            (0, i.default)().removeEventListener('resize', this.updateSizes),
              (0, i.default)().removeEventListener(
                'DOMContentLoaded',
                this.updateSizes,
              );
            var e = this.getInitialImage();
            e && e.removeEventListener('load', this.setMountState),
              this.props.useKeyboardArrows &&
                (0, w.default)().removeEventListener(
                  'keydown',
                  this.navigateWithKeyboard,
                );
          },
        },
        {
          key: 'forceFocus',
          value: function () {
            var e;
            (e = this.carouselWrapperRef) === null || e === void 0 || e.focus();
          },
        },
        {
          key: 'renderItems',
          value: function (e) {
            var h = this;
            return this.props.children
              ? l.Children.map(this.props.children, function (p, m) {
                  var T = m === h.state.selectedItem,
                    W = m === h.state.previousItem,
                    z =
                      (T && h.state.selectedStyle) ||
                      (W && h.state.prevStyle) ||
                      h.state.slideStyle ||
                      {};
                  h.props.centerMode &&
                    h.props.axis === 'horizontal' &&
                    (z = y(
                      y({}, z),
                      {},
                      { minWidth: h.props.centerSlidePercentage + '%' },
                    )),
                    h.state.swiping &&
                      h.state.swipeMovementStarted &&
                      (z = y(y({}, z), {}, { pointerEvents: 'none' }));
                  var H = {
                    ref: function (j) {
                      return h.setItemsRef(j, m);
                    },
                    key: 'itemKey' + m + (e ? 'clone' : ''),
                    className: v.default.ITEM(
                      !0,
                      m === h.state.selectedItem,
                      m === h.state.previousItem,
                    ),
                    onClick: h.handleClickItem.bind(h, m, p),
                    style: z,
                  };
                  return l.default.createElement(
                    'li',
                    H,
                    h.props.renderItem(p, {
                      isSelected: m === h.state.selectedItem,
                      isPrevious: m === h.state.previousItem,
                    }),
                  );
                })
              : [];
          },
        },
        {
          key: 'renderControls',
          value: function () {
            var e = this,
              h = this.props,
              p = h.showIndicators,
              m = h.labels,
              T = h.renderIndicator,
              W = h.children;
            return p
              ? l.default.createElement(
                  'ul',
                  { className: 'control-dots' },
                  l.Children.map(W, function (z, H) {
                    return (
                      T &&
                      T(e.changeItem(H), H === e.state.selectedItem, H, m.item)
                    );
                  }),
                )
              : null;
          },
        },
        {
          key: 'renderStatus',
          value: function () {
            return this.props.showStatus
              ? l.default.createElement(
                  'p',
                  { className: 'carousel-status' },
                  this.props.statusFormatter(
                    this.state.selectedItem + 1,
                    l.Children.count(this.props.children),
                  ),
                )
              : null;
          },
        },
        {
          key: 'renderThumbs',
          value: function () {
            return !this.props.showThumbs ||
              !this.props.children ||
              l.Children.count(this.props.children) === 0
              ? null
              : l.default.createElement(
                  C.default,
                  {
                    ref: this.setThumbsRef,
                    onSelectItem: this.handleClickThumb,
                    selectedItem: this.state.selectedItem,
                    transitionTime: this.props.transitionTime,
                    thumbWidth: this.props.thumbWidth,
                    labels: this.props.labels,
                    emulateTouch: this.props.emulateTouch,
                  },
                  this.props.renderThumbs(this.props.children),
                );
          },
        },
        {
          key: 'render',
          value: function () {
            var e = this;
            if (
              !this.props.children ||
              l.Children.count(this.props.children) === 0
            )
              return null;
            var h =
                this.props.swipeable &&
                l.Children.count(this.props.children) > 1,
              p = this.props.axis === 'horizontal',
              m =
                this.props.showArrows &&
                l.Children.count(this.props.children) > 1,
              T =
                (m &&
                  (this.state.selectedItem > 0 || this.props.infiniteLoop)) ||
                !1,
              W =
                (m &&
                  (this.state.selectedItem <
                    l.Children.count(this.props.children) - 1 ||
                    this.props.infiniteLoop)) ||
                !1,
              z = this.renderItems(!0),
              H = z.shift(),
              F = z.pop(),
              j = {
                className: v.default.SLIDER(!0, this.state.swiping),
                onSwipeMove: this.onSwipeMove,
                onSwipeStart: this.onSwipeStart,
                onSwipeEnd: this.onSwipeEnd,
                style: this.state.itemListStyle,
                tolerance: this.props.swipeScrollTolerance,
              },
              ee = {};
            if (p) {
              if (
                ((j.onSwipeLeft = this.onSwipeForward),
                (j.onSwipeRight = this.onSwipeBackwards),
                this.props.dynamicHeight)
              ) {
                var Te = this.getVariableItemHeight(this.state.selectedItem);
                ee.height = Te || 'auto';
              }
            } else
              (j.onSwipeUp =
                this.props.verticalSwipe === 'natural'
                  ? this.onSwipeBackwards
                  : this.onSwipeForward),
                (j.onSwipeDown =
                  this.props.verticalSwipe === 'natural'
                    ? this.onSwipeForward
                    : this.onSwipeBackwards),
                (j.style = y(
                  y({}, j.style),
                  {},
                  { height: this.state.itemSize },
                )),
                (ee.height = this.state.itemSize);
            return l.default.createElement(
              'div',
              {
                'aria-label': this.props.ariaLabel,
                className: v.default.ROOT(this.props.className),
                ref: this.setCarouselWrapperRef,
                tabIndex: this.props.useKeyboardArrows ? 0 : void 0,
              },
              l.default.createElement(
                'div',
                {
                  className: v.default.CAROUSEL(!0),
                  style: { width: this.props.width },
                },
                this.renderControls(),
                this.props.renderArrowPrev(
                  this.onClickPrev,
                  T,
                  this.props.labels.leftArrow,
                ),
                l.default.createElement(
                  'div',
                  {
                    className: v.default.WRAPPER(!0, this.props.axis),
                    style: ee,
                  },
                  h
                    ? l.default.createElement(
                        O.default,
                        d({ tagName: 'ul', innerRef: this.setListRef }, j, {
                          allowMouseEvents: this.props.emulateTouch,
                        }),
                        this.props.infiniteLoop && F,
                        this.renderItems(),
                        this.props.infiniteLoop && H,
                      )
                    : l.default.createElement(
                        'ul',
                        {
                          className: v.default.SLIDER(!0, this.state.swiping),
                          ref: function (Ee) {
                            return e.setListRef(Ee);
                          },
                          style: this.state.itemListStyle || {},
                        },
                        this.props.infiniteLoop && F,
                        this.renderItems(),
                        this.props.infiniteLoop && H,
                      ),
                ),
                this.props.renderArrowNext(
                  this.onClickNext,
                  W,
                  this.props.labels.rightArrow,
                ),
                this.renderStatus(),
              ),
              this.renderThumbs(),
            );
          },
        },
      ]),
      o
    );
  })(l.default.Component);
  return (
    (K.default = P),
    a(P, 'displayName', 'Carousel'),
    a(P, 'defaultProps', {
      ariaLabel: void 0,
      axis: 'horizontal',
      centerSlidePercentage: 80,
      interval: 3e3,
      labels: {
        leftArrow: 'previous slide / item',
        rightArrow: 'next slide / item',
        item: 'slide item',
      },
      onClickItem: b.noop,
      onClickThumb: b.noop,
      onChange: b.noop,
      onSwipeStart: function () {},
      onSwipeEnd: function () {},
      onSwipeMove: function () {
        return !1;
      },
      preventMovementUntilSwipeScrollTolerance: !1,
      renderArrowPrev: function (t, o, s) {
        return l.default.createElement('button', {
          type: 'button',
          'aria-label': s,
          className: v.default.ARROW_PREV(!o),
          onClick: t,
        });
      },
      renderArrowNext: function (t, o, s) {
        return l.default.createElement('button', {
          type: 'button',
          'aria-label': s,
          className: v.default.ARROW_NEXT(!o),
          onClick: t,
        });
      },
      renderIndicator: function (t, o, s, e) {
        return l.default.createElement('li', {
          className: v.default.DOT(o),
          onClick: t,
          onKeyDown: t,
          value: s,
          key: s,
          role: 'button',
          tabIndex: 0,
          'aria-label': ''.concat(e, ' ').concat(s + 1),
        });
      },
      renderItem: function (t) {
        return t;
      },
      renderThumbs: function (t) {
        var o = l.Children.map(t, function (s) {
          var e = s;
          if (
            (s.type !== 'img' &&
              (e = l.Children.toArray(s.props.children).find(function (h) {
                return h.type === 'img';
              })),
            !!e)
          )
            return e;
        });
        return o.filter(function (s) {
          return s;
        }).length === 0
          ? (console.warn(
              "No images found! Can't build the thumb list without images. If you don't need thumbs, set showThumbs={false} in the Carousel. Note that it's not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md",
            ),
            [])
          : o;
      },
      statusFormatter: b.defaultStatusFormatter,
      selectedItem: 0,
      showArrows: !0,
      showIndicators: !0,
      showStatus: !0,
      showThumbs: !0,
      stopOnHover: !0,
      swipeScrollTolerance: 5,
      swipeable: !0,
      transitionTime: 350,
      verticalSwipe: 'standard',
      width: '100%',
      animationHandler: 'slide',
      swipeAnimationHandler: I.slideSwipeAnimationHandler,
      stopSwipingHandler: I.slideStopSwipingHandler,
    }),
    K
  );
}
var Se = {},
  we;
function Ve() {
  return we || (we = 1), Se;
}
var be;
function Xe() {
  return (
    be ||
      ((be = 1),
      (function (l) {
        Object.defineProperty(l, '__esModule', { value: !0 }),
          Object.defineProperty(l, 'Carousel', {
            enumerable: !0,
            get: function () {
              return O.default;
            },
          }),
          Object.defineProperty(l, 'CarouselProps', {
            enumerable: !0,
            get: function () {
              return v.CarouselProps;
            },
          }),
          Object.defineProperty(l, 'Thumbs', {
            enumerable: !0,
            get: function () {
              return C.default;
            },
          });
        var O = w(Be()),
          v = Ve(),
          C = w(Re());
        function w(i) {
          return i && i.__esModule ? i : { default: i };
        }
      })(re)),
    re
  );
}
var $e = Xe();
function Ye({ outfit: l, setDrawerType: O }) {
  const {
      id: v,
      tags: C,
      images_urls: w,
      character: i,
      title: b,
      status: I,
    } = l,
    { name: L } = i,
    E = (d) => O(`View-${d}`),
    D = (d) => O(`Edit-${d}`),
    R = (d) => O(`Delete-${d}`);
  return N.jsx(
    Ie,
    {
      height: 600,
      once: !0,
      offset: 100,
      children: N.jsxs(Me, {
        height: 'full',
        maxW: 400,
        backgroundColor:
          I == 0
            ? 'green.200'
            : I == 1
              ? 'blue.200'
              : I == 2
                ? 'red.100'
                : 'white',
        boxShadow: 'md',
        children: [
          N.jsxs(Ce, {
            flexGrow: 1,
            children: [
              N.jsx(oe, { fontSize: 'lg', children: b }),
              N.jsx(oe, { fontSize: 'md', color: 'gray.600', children: L }),
              N.jsx(xe, {
                children: C.map((d, _) =>
                  N.jsx(
                    Le,
                    {
                      colorScheme: 'orange',
                      variant: 'outline',
                      children: d.title,
                    },
                    d.id,
                  ),
                ),
              }),
            ],
          }),
          N.jsx($e.Carousel, {
            autoPlay: !1,
            showThumbs: !1,
            children: w.map((d) => N.jsx(De, { src: d }, d)),
          }),
          N.jsx(Ae, {
            p: 0,
            children: N.jsxs(He, {
              size: 'lg',
              variant: 'outline',
              width: 'full',
              isAttached: !0,
              children: [
                N.jsx(te, {
                  colorScheme: 'orange',
                  'aria-label': 'View',
                  flex: '1 0 auto',
                  icon: N.jsx(We, {}),
                  onClick: () => E(l.id),
                }),
                N.jsx(te, {
                  colorScheme: 'orange',
                  'aria-label': 'Edit',
                  icon: N.jsx(ke, {}),
                  onClick: () => D(l.id),
                }),
                N.jsx(te, {
                  colorScheme: 'orange',
                  'aria-label': 'Delete',
                  icon: N.jsx(ze, {}),
                  onClick: () => R(l.id),
                }),
              ],
            }),
          }),
        ],
      }),
    },
    `lazy-${v}`,
  );
}
const it = Object.freeze(
  Object.defineProperty({ __proto__: null, default: Ye }, Symbol.toStringTag, {
    value: 'Module',
  }),
);
export { Ye as O, it as a, $e as j };
