import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import React from 'react';

const ItemEditForm = ({ item, onClose }) => {
  const { data, setData, put, processing, errors } = useForm({
    custom_title: item.custom_title || '',
    tags: item.tags || [],
    quantity: item.quantity || 0,
    notes: item.notes || '',
  });

  function submit(e) {
    e.preventDefault();
    put(`/items/${item._id}`, {
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  }

  console.log(item);

  return (
    <VStack as="form" onSubmit={submit}>
      <FormControl id="custom-title" isInvalid={!!errors?.custom_title}>
        <FormLabel>Custom Title</FormLabel>
        <Input value={data.custom_title} onChange={e => setData('custom_title', e.target.value)} />
        <FormErrorMessage>{errors?.custom_title}</FormErrorMessage>
      </FormControl>
      <FormControl id="tags" isInvalid={!!errors?.tags}>
        <FormLabel>Tags</FormLabel>
        <Input value={data.tags} onChange={e => setData('tags', e.target.value)} />
        <FormErrorMessage>{errors?.tags}</FormErrorMessage>
      </FormControl>
      <FormControl id="quantity" isInvalid={!!errors?.quantity}>
        <FormLabel>Quantity</FormLabel>
        <Input type="number" value={data.quantity} onChange={e => setData('quantity', e.target.value)} />
        <FormErrorMessage>{errors?.quantity}</FormErrorMessage>
      </FormControl>
      <FormControl id="notes" isInvalid={!!errors?.notes}>
        <FormLabel>Notes</FormLabel>
        <Textarea value={data.notes} onChange={e => setData('notes', e.target.value)} />
        <FormErrorMessage>{errors?.notes}</FormErrorMessage>
      </FormControl>
      <ButtonGroup>
        <Button type="submit" colorScheme="green" isLoading={processing}>Save</Button>
        <Button variant="outline" onClick={onClose} isLoading={processing}>Cancel</Button>
      </ButtonGroup>
    </VStack>
  );
};

export default ItemEditForm;
