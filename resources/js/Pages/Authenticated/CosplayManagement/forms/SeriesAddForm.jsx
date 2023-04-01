import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import React from 'react';

function SeriesAddForm({ onClose }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/series', {
      onSuccess: () => onClose(),
    });
  }

  return (
    <VStack as="form" onSubmit={submit}>
      <FormControl id="series" isInvalid={!!errors?.title} isRequired>
        <FormLabel>Series</FormLabel>
        <Input
          placeholder="Series title"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
        />
        <FormErrorMessage>{errors?.title}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        colorScheme="green"
        width="full"
        isLoading={processing}
      >
        Add Series
      </Button>
    </VStack>
  );
}

export default SeriesAddForm;
