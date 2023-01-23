import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import TagSelect from '../../components/TagSelect';

function ItemEditForm({ item, onClose }) {
  const [tags, setTags] = useState([]);
  const { data, setData, put, processing, errors } = useForm({
    custom_title: item.custom_title ?? '',
    tags: item.tags?.reduce((carry, item) => [...carry, item._id], []) ?? [],
    quantity: item.quantity ?? 0,
    notes: item.notes ?? '',
  });

  function submit(e) {
    e.preventDefault();
    put(`/items/${item._id}`, {
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  }

  useEffect(() => {
    fetch(`tags/item/${item._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setTags(data));
  }, []);

  return (
    <VStack as="form" onSubmit={submit}>
      <FormControl id="custom-title" isInvalid={!!errors?.custom_title}>
        <FormLabel>Custom Title</FormLabel>
        <Input
          value={data.custom_title}
          onChange={(e) => setData('custom_title', e.target.value)}
        />
        <FormErrorMessage>{errors?.custom_title}</FormErrorMessage>
      </FormControl>
      <FormControl id="tags" isInvalid={!!errors?.tags}>
        <FormLabel>Tags</FormLabel>
        <TagSelect tags={tags} setData={setData} />
        <FormErrorMessage>{errors?.tagaaas}</FormErrorMessage>
      </FormControl>
      <FormControl id="quantity" isInvalid={!!errors?.quantity}>
        <FormLabel>Quantity</FormLabel>
        <Input
          type="number"
          value={data.quantity}
          onChange={(e) => setData('quantity', e.target.value)}
        />
        <FormErrorMessage>{errors?.quantity}</FormErrorMessage>
      </FormControl>
      <FormControl id="notes" isInvalid={!!errors?.notes}>
        <FormLabel>Notes</FormLabel>
        <Textarea
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
        />
        <FormErrorMessage>{errors?.notes}</FormErrorMessage>
      </FormControl>
      <ButtonGroup>
        <Button type="submit" colorScheme="green" isLoading={processing}>
          Save
        </Button>
        <Button variant="outline" onClick={onClose} isLoading={processing}>
          Cancel
        </Button>
      </ButtonGroup>
    </VStack>
  );
}

export default ItemEditForm;
