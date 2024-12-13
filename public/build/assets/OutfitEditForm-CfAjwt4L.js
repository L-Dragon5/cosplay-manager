import { r as g, b as B, j as e } from './app-jKCvGqK8.js';
import { l as H } from './react-cropper.es-CeJeJgf5.js';
import A from './TagSelect-C7f4WRL3.js';
import { V as M } from './v-stack-CeaklOe-.js';
import { H as R } from './h-stack-DgkOJJod.js';
import { F as s, I as h, a as d, b as p } from './input-Co9a23Ga.js';
import { F as o } from './form-label-Duwlo-ac.js';
import { S as j } from './select-r-8IvUpk.js';
import { B as y } from './box-DZ06z6RF.js';
import { B as f } from './button-C2Gq51vH.js';
import './stack-DnKf1WGz.js';
function Z({ outfit: n, tags: F, series: u, onClose: L }) {
  var b, C, w, S;
  const [v, _] = g.useState(null),
    [m, O] = g.useState(
      ((b = u.find((a) => a.characters.find((i) => i.id == n.character_id))) ==
      null
        ? void 0
        : b.id) ?? '',
    ),
    {
      data: c,
      setData: l,
      put: T,
      processing: U,
      errors: t,
    } = B({
      title: n.title ?? '',
      status: n.status ?? '',
      tags:
        ((C = n.tags) == null
          ? void 0
          : C.reduce((a, i) => [...a, i.id], [])) ?? [],
      creator: n.creator ?? '',
      storage_location: n.storage_location ?? '',
      times_worn: n.times_worn ?? '',
      character_id: n.character_id ?? '',
      image: n.image ?? '',
    }),
    x = g.useRef();
  function E(a) {
    a.preventDefault(), T(`/outfits/${n.id}`, { onSuccess: () => L() });
  }
  function D(a) {
    const i = a.currentTarget;
    if (i.files !== null && i.files.length > 0) {
      const r = i.files[0],
        I = new FileReader();
      I.addEventListener(
        'load',
        (q) => {
          _(q.target.result);
        },
        !1,
      ),
        r && I.readAsDataURL(r);
    }
  }
  function W() {
    const a = prompt('Enter URL here'),
      i = new XMLHttpRequest();
    (i.onload = () => {
      const r = new FileReader();
      (r.onloadend = () => {
        _(r.result);
      }),
        r.readAsDataURL(i.response);
    }),
      i.open('GET', a),
      (i.responseType = 'blob'),
      i.send();
  }
  function k() {
    var a, i, r;
    l(
      'image',
      (r =
        (i =
          (a = x == null ? void 0 : x.current) == null ? void 0 : a.cropper) ==
        null
          ? void 0
          : i.getCroppedCanvas()) == null
        ? void 0
        : r.toDataURL(),
    );
  }
  return (
    g.useEffect(() => {
      m !== '' && l('character_id', '');
    }, [m]),
    e.jsxs(M, {
      as: 'form',
      onSubmit: E,
      children: [
        e.jsxs(R, {
          width: 'full',
          children: [
            e.jsxs(s, {
              id: 'outfit-series',
              isRequired: !0,
              children: [
                e.jsx(o, { children: 'Outfit Series' }),
                e.jsx(j, {
                  backgroundColor: 'white',
                  placeholder: 'Select series',
                  onChange: (a) => O(a.target.value),
                  value: m,
                  children: u.map((a) =>
                    e.jsx('option', { value: a.id, children: a.title }, a.id),
                  ),
                }),
              ],
            }),
            e.jsxs(s, {
              id: 'outfit-character',
              isRequired: !0,
              children: [
                e.jsx(o, { children: 'Outfit Character' }),
                e.jsx(j, {
                  backgroundColor: 'white',
                  placeholder: 'Select character',
                  onChange: (a) => l('character_id', a.target.value),
                  defaultValue: n.character_id,
                  isDisabled: m === '',
                  children:
                    (S =
                      (w = u == null ? void 0 : u.find((a) => a.id === m)) ==
                      null
                        ? void 0
                        : w.characters) == null
                      ? void 0
                      : S.map((a) =>
                          e.jsx(
                            'option',
                            { value: a.id, children: a.name },
                            a.id,
                          ),
                        ),
                }),
              ],
            }),
          ],
        }),
        e.jsxs(s, {
          id: 'title',
          isInvalid: !!(t != null && t.title),
          isRequired: !0,
          children: [
            e.jsx(o, { children: 'Outfit Title' }),
            e.jsx(h, {
              placeholder: 'Outfit title',
              value: c.title,
              onChange: (a) => l('title', a.target.value),
            }),
            e.jsx(d, { children: t == null ? void 0 : t.title }),
          ],
        }),
        e.jsxs(s, {
          id: 'status',
          isInvalid: !!(t != null && t.status),
          isRequired: !0,
          children: [
            e.jsx(o, { children: 'Outfit Status' }),
            e.jsxs(j, {
              placeholder: 'Select status',
              value: c.status,
              onChange: (a) => l('status', a.target.value),
              children: [
                e.jsx('option', { value: 0, children: 'Future Cosplay' }),
                e.jsx('option', { value: 1, children: 'Owned & Unworn' }),
                e.jsx('option', { value: 2, children: 'Worn' }),
              ],
            }),
            e.jsx(d, { children: t == null ? void 0 : t.status }),
          ],
        }),
        e.jsxs(s, {
          id: 'tags',
          isInvalid: !!(t != null && t.tags),
          children: [
            e.jsx(o, { children: 'Tags' }),
            e.jsx(A, { tags: F, setData: l }),
            e.jsx(d, { children: t == null ? void 0 : t.tags }),
          ],
        }),
        e.jsx(y, { h: '50px' }),
        e.jsxs(s, {
          id: 'creator',
          isInvalid: !!(t != null && t.creator),
          children: [
            e.jsx(o, { children: 'Creator' }),
            e.jsx(h, {
              placeholder: 'Creator',
              value: c.creator,
              onChange: (a) => l('creator', a.target.value),
            }),
            e.jsx(p, {
              children: 'Who made the outfit or what shop did you buy it from?',
            }),
            e.jsx(d, { children: t == null ? void 0 : t.creator }),
          ],
        }),
        e.jsxs(s, {
          id: 'storage_location',
          isInvalid: !!(t != null && t.storage_location),
          children: [
            e.jsx(o, { children: 'Storage Location' }),
            e.jsx(h, {
              placeholder: 'Storage location',
              value: c.storage_location,
              onChange: (a) => l('storage_location', a.target.value),
            }),
            e.jsx(p, {
              children: 'Where is the outfit stored? A bin? What number?',
            }),
            e.jsx(d, { children: t == null ? void 0 : t.storage_location }),
          ],
        }),
        e.jsxs(s, {
          id: 'times_worn',
          isInvalid: !!(t != null && t.times_worn),
          children: [
            e.jsx(o, { children: 'Times Worn' }),
            e.jsx(h, {
              placeholder: 'Times worn',
              value: c.times_worn,
              onChange: (a) => l('times_worn', a.target.value),
            }),
            e.jsx(p, {
              children: 'List out where/when you have worn this outfit',
            }),
            e.jsx(d, { children: t == null ? void 0 : t.times_worn }),
          ],
        }),
        e.jsxs(s, {
          id: 'obtained_on',
          isInvalid: !!(t != null && t.obtained_on),
          children: [
            e.jsx(o, { children: 'Obtained On' }),
            e.jsx(h, {
              type: 'date',
              placeholder: 'Obtained on',
              value: c.obtained_on,
              onChange: (a) => l('obtained_on', a.target.value),
            }),
            e.jsx(p, { children: 'When did you receive this outfit?' }),
            e.jsx(d, { children: t == null ? void 0 : t.obtained_on }),
          ],
        }),
        e.jsxs(R, {
          children: [
            e.jsx(s, {
              id: 'image',
              children: e.jsxs(o, {
                children: [
                  e.jsx(h, {
                    type: 'file',
                    accept: 'image/*',
                    onChange: D,
                    display: 'none',
                  }),
                  e.jsx(f, {
                    as: 'span',
                    colorScheme: 'orange',
                    children: 'Upload Image',
                  }),
                ],
              }),
            }),
            e.jsx(s, {
              id: 'image-url',
              children: e.jsx(f, {
                as: 'span',
                colorScheme: 'orange',
                onClick: W,
                children: 'Get Image from URL',
              }),
            }),
          ],
        }),
        v &&
          e.jsx(y, {
            children: e.jsx(H, {
              ref: x,
              viewMode: 2,
              src: v,
              style: { maxHeight: 350 },
              guides: !1,
              autoCropArea: 1,
              movable: !1,
              zoomable: !1,
              scalable: !1,
              rotatable: !1,
              crop: k,
            }),
          }),
        e.jsx(f, {
          type: 'submit',
          colorScheme: 'green',
          width: 'full',
          isLoading: U,
          children: 'Update Outfit',
        }),
      ],
    })
  );
}
export { Z as default };
