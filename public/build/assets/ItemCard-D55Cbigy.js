import { j as o } from './app-jKCvGqK8.js';
import {
  L as j,
  C as f,
  a as u,
  T as C,
  I as g,
  b as p,
  V as I,
  E as v,
  D as _,
} from './index-CQPbnsk2.js';
import { T as b } from './text-BAevXw7b.js';
import { H as S } from './h-stack-DgkOJJod.js';
import { B as E } from './button-group-jEtKEu1x.js';
import { I as l } from './icon-button-Bu0BiuMR.js';
import { c as $ } from './create-icon-dPcLk-so.js';
import './index-Chjiymov.js';
import './stack-DnKf1WGz.js';
import './button-C2Gq51vH.js';
const k = $({
  displayName: 'CalendarIcon',
  viewBox: '0 0 14 14',
  d: 'M10.8889,5.5 L3.11111,5.5 L3.11111,7.05556 L10.8889,7.05556 L10.8889,5.5 Z M12.4444,1.05556 L11.6667,1.05556 L11.6667,0 L10.1111,0 L10.1111,1.05556 L3.88889,1.05556 L3.88889,0 L2.33333,0 L2.33333,1.05556 L1.55556,1.05556 C0.692222,1.05556 0.00777777,1.75556 0.00777777,2.61111 L0,12.5 C0,13.3556 0.692222,14 1.55556,14 L12.4444,14 C13.3,14 14,13.3556 14,12.5 L14,2.61111 C14,1.75556 13.3,1.05556 12.4444,1.05556 Z M12.4444,12.5 L1.55556,12.5 L1.55556,3.94444 L12.4444,3.94444 L12.4444,12.5 Z M8.55556,8.61111 L3.11111,8.61111 L3.11111,10.1667 L8.55556,10.1667 L8.55556,8.61111 Z',
});
function D({ item: i, setDrawerType: a }) {
  const {
      id: c,
      tags: t,
      image_url: s,
      original_title: d,
      custom_title: r,
      is_archived: n,
    } = i,
    h = (e) => a(`View-${e}`),
    m = (e) => a(`Edit-${e}`),
    x = (e) => {
      n == 1 ? a(`Unarchive-${e}`) : a(`Archive-${e}`);
    },
    L = (e) => a(`Delete-${e}`);
  return o.jsx(
    j,
    {
      height: 500,
      once: !0,
      offset: 100,
      children: o.jsxs(f, {
        height: 'full',
        maxW: 400,
        opacity: n == 1 ? '75%' : '100%',
        border: n == 1 ? '2px solid red' : 'none',
        boxShadow: 'md',
        children: [
          o.jsxs(u, {
            flexGrow: 1,
            children: [
              o.jsx(b, {
                fontSize: 'lg',
                children: r && r !== null && r !== '' ? r : d,
              }),
              o.jsx(S, {
                children: t.map((e, V) =>
                  o.jsx(
                    C,
                    {
                      colorScheme: 'orange',
                      variant: 'outline',
                      children: e.title,
                    },
                    e.id,
                  ),
                ),
              }),
            ],
          }),
          o.jsx(g, { src: s, height: 300, objectFit: 'cover' }),
          o.jsx(p, {
            p: 0,
            children: o.jsxs(E, {
              size: 'lg',
              variant: 'outline',
              width: 'full',
              isAttached: !0,
              children: [
                o.jsx(l, {
                  colorScheme: 'orange',
                  'aria-label': 'View',
                  flex: '1 0 auto',
                  icon: o.jsx(I, {}),
                  onClick: () => h(i.id),
                }),
                o.jsx(l, {
                  colorScheme: 'orange',
                  'aria-label': 'Edit',
                  icon: o.jsx(v, {}),
                  onClick: () => m(i.id),
                }),
                o.jsx(l, {
                  colorScheme: 'orange',
                  'aria-label': n == 1 ? 'Unarchive' : 'Archive',
                  icon: o.jsx(k, {}),
                  onClick: () => x(i.id),
                }),
                o.jsx(l, {
                  colorScheme: 'orange',
                  'aria-label': 'Delete',
                  icon: o.jsx(_, {}),
                  onClick: () => L(i.id),
                }),
              ],
            }),
          }),
        ],
      }),
    },
    `lazy-${c}`,
  );
}
export { D as default };
