import {
  f as _,
  F as S,
  o as T,
  p as C,
  j as s,
  c as F,
  d as q,
  r as g,
  b as I,
} from './app-jKCvGqK8.js';
import b from './TagSelect-C7f4WRL3.js';
import { V as E } from './v-stack-CeaklOe-.js';
import { u as k, F as u, I as j, a as m } from './input-Co9a23Ga.js';
import { F as d } from './form-label-Duwlo-ac.js';
import { B } from './button-group-jEtKEu1x.js';
import { B as p } from './button-C2Gq51vH.js';
import './stack-DnKf1WGz.js';
const N = ['h', 'minH', 'height', 'minHeight'],
  f = _((e, o) => {
    const c = S('Textarea', e),
      { className: r, rows: n, ...i } = T(e),
      x = k(i),
      l = n ? C(c, N) : c;
    return s.jsx(F.textarea, {
      ref: o,
      rows: n,
      ...x,
      className: q('chakra-textarea', r),
      __css: l,
    });
  });
f.displayName = 'Textarea';
function $({ item: e, onClose: o }) {
  var h;
  const [c, r] = g.useState([]),
    {
      data: n,
      setData: i,
      put: x,
      processing: l,
      errors: t,
    } = I({
      custom_title: e.custom_title ?? '',
      tags:
        ((h = e.tags) == null
          ? void 0
          : h.reduce((a, v) => [...a, v.id], [])) ?? [],
      quantity: e.quantity ?? 0,
      notes: e.notes ?? '',
    });
  function y(a) {
    a.preventDefault(),
      x(`/items/${e.id}`, { preserveScroll: !0, onSuccess: () => o() });
  }
  return (
    g.useEffect(() => {
      fetch(`tags/item/${e.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((a) => a.json())
        .then((a) => r(a));
    }, []),
    s.jsxs(E, {
      as: 'form',
      onSubmit: y,
      children: [
        s.jsxs(u, {
          id: 'custom-title',
          isInvalid: !!(t != null && t.custom_title),
          children: [
            s.jsx(d, { children: 'Custom Title' }),
            s.jsx(j, {
              value: n.custom_title,
              onChange: (a) => i('custom_title', a.target.value),
            }),
            s.jsx(m, { children: t == null ? void 0 : t.custom_title }),
          ],
        }),
        s.jsxs(u, {
          id: 'tags',
          isInvalid: !!(t != null && t.tags),
          children: [
            s.jsx(d, { children: 'Tags' }),
            s.jsx(b, { tags: c, setData: i }),
            s.jsx(m, { children: t == null ? void 0 : t.tagaaas }),
          ],
        }),
        s.jsxs(u, {
          id: 'quantity',
          isInvalid: !!(t != null && t.quantity),
          children: [
            s.jsx(d, { children: 'Quantity' }),
            s.jsx(j, {
              type: 'number',
              value: n.quantity,
              onChange: (a) => i('quantity', a.target.value),
            }),
            s.jsx(m, { children: t == null ? void 0 : t.quantity }),
          ],
        }),
        s.jsxs(u, {
          id: 'notes',
          isInvalid: !!(t != null && t.notes),
          children: [
            s.jsx(d, { children: 'Notes' }),
            s.jsx(f, {
              value: n.notes,
              onChange: (a) => i('notes', a.target.value),
            }),
            s.jsx(m, { children: t == null ? void 0 : t.notes }),
          ],
        }),
        s.jsxs(B, {
          children: [
            s.jsx(p, {
              type: 'submit',
              colorScheme: 'green',
              isLoading: l,
              children: 'Save',
            }),
            s.jsx(p, {
              variant: 'outline',
              onClick: o,
              isLoading: l,
              children: 'Cancel',
            }),
          ],
        }),
      ],
    })
  );
}
export { $ as default };
