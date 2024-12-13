import { r as a, j as r, M as Y, h as q } from './app-jKCvGqK8.js';
import { O as v, j as J } from './OutfitCard-DLWj22ER.js';
import {
  u as K,
  A as w,
  S as Q,
  l as X,
  C as Z,
  a as k,
  G as O,
  D as rr,
  M as er,
  b as sr,
  c as or,
  d as ar,
  e as nr,
  f as lr,
} from './index-Cz7EXHCE.js';
import tr from './Navbar-BvqPsX_u.js';
import cr from './CharacterAddForm-CL_Kq5jl.js';
import dr from './OutfitAddForm-wevmUEhc.js';
import ir from './OutfitEditForm-CfAjwt4L.js';
import hr from './SeriesAddForm-DG2WSmxr.js';
import { B as xr } from './box-DZ06z6RF.js';
import { H as S } from './h-stack-DgkOJJod.js';
import { H as ur } from './heading-POHmOB42.js';
import { B as p } from './button-C2Gq51vH.js';
import { S as pr, G as jr } from './simple-grid-DS3nMfP1.js';
import { F as M, I as mr } from './input-Co9a23Ga.js';
import { I as fr, a as gr } from './input-element-C6Z8ckGb.js';
import { F as Cr } from './flex-Cgg7uoG9.js';
import { S as G } from './select-r-8IvUpk.js';
import { V as L } from './v-stack-CeaklOe-.js';
import { I as Sr, T as br } from './index-CQPbnsk2.js';
import { T as u } from './text-BAevXw7b.js';
import { B as wr } from './button-group-jEtKEu1x.js';
import './index-Chjiymov.js';
import './icon-button-Bu0BiuMR.js';
import './stack-DnKf1WGz.js';
import './create-icon-dPcLk-so.js';
import './spacer-DMj9zHo6.js';
import './link-BPl0eTcv.js';
import './form-label-Duwlo-ac.js';
import './react-cropper.es-CeJeJgf5.js';
import './TagSelect-C7f4WRL3.js';
function Or({ outfits: n, series: h, tags: I }) {
  var E, B, T, D;
  const [o, H] = a.useState({}),
    [c, W] = a.useState(''),
    [g, F] = a.useState(''),
    [l, j] = a.useState(''),
    [_, d] = a.useState(n),
    [y, z] = a.useState(''),
    [A, N] = a.useState(7),
    [m, R] = a.useState(['future', 'unworn', 'worn']),
    { isOpen: b, onOpen: V, onClose: i } = K();
  function U() {
    const s = String(y).toLowerCase(),
      t = (e) => {
        var f;
        return (
          String(e.title).toLowerCase().indexOf(s) !== -1 ||
          String(
            (f = e == null ? void 0 : e.character) == null ? void 0 : f.name,
          )
            .toLowerCase()
            .indexOf(s) !== -1 ||
          e.tags.filter((C) => C.label.toLowerCase().indexOf(s) !== -1).length >
            0
        );
      },
      x = (e) => {
        var f, C;
        return c === 0 || c === ''
          ? !0
          : g === 0 || g === ''
            ? ((f = e == null ? void 0 : e.character) == null
                ? void 0
                : f.series_id) == c
            : ((C = e == null ? void 0 : e.character) == null
                ? void 0
                : C.series_id) === c &&
              (e == null ? void 0 : e.character_id) === g;
      };
    switch (A) {
      case 0:
        d([]);
        break;
      case 1:
        d(n.filter((e) => e.status == 0 && t(e) && x(e)));
        break;
      case 2:
        d(n.filter((e) => e.status == 1 && t(e) && x(e)));
        break;
      case 3:
        d(n.filter((e) => (e.status == 0 || e.status == 1) && t(e) && x(e)));
        break;
      case 4:
        d(n.filter((e) => e.status == 2 && t(e) && x(e)));
        break;
      case 5:
        d(n.filter((e) => (e.status == 0 || e.status == 2) && t(e) && x(e)));
        break;
      case 6:
        d(n.filter((e) => (e.status == 1 || e.status == 2) && t(e) && x(e)));
        break;
      case 7:
        d(n.filter((e) => t(e) && x(e)));
        break;
    }
  }
  const $ = (s) => z(s.target.value),
    P = (s) => {
      q.delete(`/outfits/${o.id}`), i();
    };
  return (
    a.useEffect(() => {
      let s = 0;
      m.includes('future') && (s += 1),
        m.includes('unworn') && (s += 2),
        m.includes('worn') && (s += 4),
        N(s);
    }, [m]),
    a.useEffect(() => {
      U();
    }, [A, c, g, y, n]),
    a.useEffect(() => {
      if (l !== '') {
        const s = l.split('-').pop();
        H(n.find((t) => t.id == s)), V();
      }
    }, [l]),
    a.useEffect(() => {
      b || j('');
    }, [b]),
    a.useEffect(() => {
      c !== '' && F('');
    }, [c]),
    r.jsxs(r.Fragment, {
      children: [
        r.jsx(Y, { title: 'Cosplay Management' }),
        r.jsxs(xr, {
          position: 'sticky',
          top: 0,
          zIndex: 2,
          children: [
            r.jsx(tr, {}),
            r.jsxs(S, {
              p: 4,
              backgroundColor: 'gray.50',
              borderBottom: '1px solid #ccc',
              children: [
                r.jsx(ur, {
                  mr: 12,
                  flexBasis: '280px',
                  children: 'Cosplay List',
                }),
                r.jsx(p, {
                  colorScheme: 'orange',
                  leftIcon: r.jsx(w, {}),
                  onClick: () => j('Add'),
                  children: 'Add',
                }),
                r.jsxs(pr, {
                  columns: 2,
                  spacing: 2,
                  width: 'full',
                  maxWidth: '1600px',
                  children: [
                    r.jsx(M, {
                      id: 'search',
                      border: '1px solid #ddd',
                      borderRadius: 'md',
                      p: 1,
                      children: r.jsxs(fr, {
                        children: [
                          r.jsx(gr, {
                            pointerEvents: 'none',
                            children: r.jsx(Q, { color: 'gray.300' }),
                          }),
                          r.jsx(mr, {
                            as: X.DebounceInput,
                            debounceTimeout: 300,
                            backgroundColor: 'white',
                            placeholder: 'Search',
                            onChange: $,
                          }),
                        ],
                      }),
                    }),
                    r.jsx(M, {
                      as: Cr,
                      id: 'filter',
                      border: '1px solid #ddd',
                      borderRadius: 'md',
                      p: 1,
                      alignItems: 'center',
                      children: r.jsx(Z, {
                        colorScheme: 'orange',
                        value: m,
                        size: 'lg',
                        onChange: (s) => R(s),
                        children: r.jsxs(S, {
                          children: [
                            r.jsx(k, { value: 'future', children: 'Future' }),
                            r.jsx(k, {
                              value: 'unworn',
                              children: 'Owned & Unworn',
                            }),
                            r.jsx(k, { value: 'worn', children: 'Worn' }),
                          ],
                        }),
                      }),
                    }),
                    r.jsxs(S, {
                      children: [
                        r.jsx(G, {
                          backgroundColor: 'white',
                          placeholder: 'Select series',
                          onChange: (s) => W(s.target.value),
                          children: h.map((s) =>
                            r.jsx(
                              'option',
                              { value: s.id, children: s.title },
                              s.id,
                            ),
                          ),
                        }),
                        r.jsx(G, {
                          backgroundColor: 'white',
                          placeholder: 'Select character',
                          onChange: (s) => F(s.target.value),
                          isDisabled: c === '',
                          children:
                            (B =
                              (E =
                                h == null
                                  ? void 0
                                  : h.find((s) => s.id === c)) == null
                                ? void 0
                                : E.characters) == null
                              ? void 0
                              : B.map((s) =>
                                  r.jsx(
                                    'option',
                                    { value: s.id, children: s.name },
                                    s.id,
                                  ),
                                ),
                        }),
                      ],
                    }),
                    r.jsxs(S, {
                      children: [
                        r.jsx(p, {
                          colorScheme: 'teal',
                          leftIcon: r.jsx(w, {}),
                          onClick: () => j('Series'),
                          children: 'Add Series',
                        }),
                        r.jsx(p, {
                          colorScheme: 'teal',
                          leftIcon: r.jsx(w, {}),
                          onClick: () => j('Character'),
                          children: 'Add Character',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        r.jsx(jr, {
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 4,
          p: 4,
          children:
            _ &&
            _.map((s) =>
              r.jsx(O, { as: v, outfit: s, setDrawerType: j }, `o-${s.id}`),
            ),
        }),
        r.jsxs(rr, {
          size: 'lg',
          isOpen: b,
          placement: 'right',
          onClose: i,
          children: [
            r.jsx(er, {}),
            r.jsxs(sr, {
              children: [
                r.jsx(or, {}),
                r.jsxs(ar, {
                  children: [
                    l.split('-').shift(),
                    ' -',
                    ' ',
                    (o == null ? void 0 : o.title) ?? 'New Outfit',
                  ],
                }),
                r.jsxs(nr, {
                  children: [
                    l.includes('Add') &&
                      r.jsx(dr, { tags: I, series: h, onClose: i }),
                    l.includes('Series') && r.jsx(hr, { onClose: i }),
                    l.includes('Character') &&
                      r.jsx(cr, { series: h, onClose: i }),
                    l.includes('View') &&
                      r.jsxs(L, {
                        alignItems: 'flex-start',
                        children: [
                          r.jsx(J.Carousel, {
                            autoPlay: !1,
                            showThumbs: !1,
                            children:
                              (T = o == null ? void 0 : o.images_urls) == null
                                ? void 0
                                : T.map((s) => r.jsx(Sr, { src: s }, s)),
                          }),
                          r.jsxs(u, {
                            children: [
                              r.jsx('strong', { children: 'Status:' }),
                              ' ',
                              (o == null ? void 0 : o.status) == 0
                                ? 'Future'
                                : (o == null ? void 0 : o.status) == 1
                                  ? 'Owned & Unworn'
                                  : (o == null ? void 0 : o.status) == 2
                                    ? 'Worn'
                                    : '',
                            ],
                          }),
                          ((D = o == null ? void 0 : o.character) == null
                            ? void 0
                            : D.name) &&
                            r.jsxs(u, {
                              children: [
                                r.jsx('strong', { children: 'Character:' }),
                                ' ',
                                o.character.name,
                              ],
                            }),
                          (o == null ? void 0 : o.tags) &&
                            r.jsxs(u, {
                              children: [
                                r.jsx('strong', { children: 'Tags:' }),
                                ' ',
                                o.tags.map((s, t) =>
                                  r.jsx(
                                    br,
                                    {
                                      colorScheme: 'orange',
                                      variant: 'outline',
                                      children: s.title,
                                    },
                                    s.id,
                                  ),
                                ),
                              ],
                            }),
                          r.jsxs(u, {
                            children: [
                              r.jsx('strong', {
                                children: 'Storage Location:',
                              }),
                              ' ',
                              o == null ? void 0 : o.storage_location,
                            ],
                          }),
                          r.jsxs(u, {
                            children: [
                              r.jsx('strong', { children: 'Times Worn:' }),
                              ' ',
                              o == null ? void 0 : o.times_worn,
                            ],
                          }),
                          r.jsxs(u, {
                            children: [
                              r.jsx('strong', { children: 'Creator:' }),
                              ' ',
                              o == null ? void 0 : o.creator,
                            ],
                          }),
                        ],
                      }),
                    l.includes('Edit') &&
                      r.jsx(ir, { outfit: o, tags: I, series: h, onClose: i }),
                    l.includes('Delete') &&
                      r.jsxs(L, {
                        children: [
                          r.jsxs(u, {
                            children: [
                              'Are you sure you want to permanently delete [',
                              o.title,
                              ']? This action is irreversible.',
                            ],
                          }),
                          r.jsxs(wr, {
                            children: [
                              r.jsx(p, {
                                colorScheme: 'red',
                                variant: 'outline',
                                onClick: i,
                                children: 'No',
                              }),
                              r.jsx(p, {
                                colorScheme: 'red',
                                onClick: P,
                                children: 'Yes',
                              }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
                r.jsx(lr, {
                  children: r.jsx(p, {
                    variant: 'outline',
                    mr: 3,
                    onClick: i,
                    children: 'Close',
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
export { Or as default };
