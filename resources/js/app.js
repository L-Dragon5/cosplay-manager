import { ChakraProvider } from '@chakra-ui/react';
import { createInertiaApp } from '@inertiajs/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  title: (title) => `${title} | CosManage`,
  resolve: (name) => require(`./Pages/${name}.jsx`),
  setup({ el, App, props }) {
    createRoot(el).render(
      <ChakraProvider resetCSS>
        <App {...props} />
      </ChakraProvider>,
    );
  },
});
