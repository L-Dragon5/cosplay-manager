import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import React from 'react';

function CharacterAddForm({ series, onClose }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    series_id: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/characters', {
      onSuccess: () => onClose(),
    });
  }

  return (
    <VStack as="form" onSubmit={submit}>
      <HStack width="full">
        <FormControl id="series" isRequired>
          <FormLabel>Series</FormLabel>
          <Select
            backgroundColor="white"
            placeholder="Select series"
            onChange={(e) => setData('series_id', e.target.value)}
            value={data.series_id}
          >
            {series.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="character" isInvalid={!!errors?.name} isRequired>
          <FormLabel>Character</FormLabel>
          <Input
            placeholder="Character name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
          <FormErrorMessage>{errors?.name}</FormErrorMessage>
        </FormControl>
      </HStack>

      <Button
        type="submit"
        colorScheme="green"
        width="full"
        isLoading={processing}
      >
        Add Character
      </Button>
    </VStack>
  );
}

export default CharacterAddForm;
