import * as React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

createInertiaApp({
  resolve: (name) => require(`./Pages/${name}.jsx`),
  setup({ el, App, props }) {
    createRoot(el).render(
      <ChakraProvider resetCSS>
        <App {...props} />
      </ChakraProvider>,
    );
  },
});
