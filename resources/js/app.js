import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
  titlee: (title) => `${title} - ${appName}`,
  resolve: name => require(`./Pages/${name}.jsx`),
  setup({ el, App, props }) {
    createRoot(el.render(<App {...props} />))
  },
})
