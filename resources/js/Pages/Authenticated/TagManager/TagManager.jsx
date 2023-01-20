import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Tree, { useTreeState } from 'react-hyper-tree';

import Navbar from '../../components/Navbar';

function TagManager({ tags }) {
  const [activeButton, setActiveButton] = useState(null);
  const { required, handlers, instance } = useTreeState({
    data: tags,
    id: 'tags-tree',
    idKey: '_id',
    defaultOpened: true,
  });
  const { data, setData, reset, post, put, processing, errors } = useForm({
    title: '',
    parent_id: '0',
  });
  const node = instance?.flatData?.find(
    (item) => item.options.selected === true,
  );

  function submit(e) {
    e.preventDefault();
    if (node) {
      if (activeButton.includes('add')) {
        router.post('/tags', {
          title: data.title,
          parent_id: node.id,
        });
      } else if (activeButton.includes('edit')) {
        put(`/tags/${node.id}`);
      }
    } else if (activeButton.includes('add')) {
      post('/tags');
    }
  }

  useEffect(() => {
    const { _id, title } = { ...node?.data };
    if (activeButton?.includes('add')) {
      reset('title');
    } else if (activeButton?.includes('edit')) {
      if (node) {
        setData('title', title);
      } else {
        setActiveButton(null);
      }
    } else if (activeButton?.includes('delete')) {
      if (node) {
        router.delete(`/tags/${_id}`, {
          onBefore: () =>
            confirm(
              `Are you sure you want to delete thie tag [${title}] and all its children?`,
            ),
          onFinish: () => reset('title'),
        });
      } else {
        alert('No tag selected.');
      }

      setActiveButton(null);
    }
  }, [node, activeButton]);

  return (
    <>
      <Head title="Tag Manager" />
      <Box position="sticky" top={0} zIndex={2}>
        <Navbar />
        <HStack>
          <Heading p={4}>Tags</Heading>

          <ButtonGroup>
            <Button
              colorScheme="orange"
              variant={activeButton?.includes('add') ? 'solid' : 'outline'}
              onClick={() => setActiveButton('add')}
            >
              Add
            </Button>
            <Button
              colorScheme="teal"
              variant={activeButton?.includes('edit') ? 'solid' : 'outline'}
              onClick={() => setActiveButton('edit')}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              variant={activeButton?.includes('delete') ? 'solid' : 'outline'}
              onClick={() => setActiveButton('delete')}
            >
              Delete
            </Button>
          </ButtonGroup>

          <Box as="form" onSubmit={submit}>
            {(activeButton?.includes('add') ||
              activeButton?.includes('edit')) && (
              <FormControl id="add-tag" isInvalid={!!errors?.title}>
                <InputGroup>
                  <Input
                    placeholder="Add new tag"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      type="submit"
                      icon={<CheckIcon />}
                      colorScheme="green"
                      isLoading={processing}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.title}</FormErrorMessage>
              </FormControl>
            )}
          </Box>
        </HStack>
      </Box>

      <Box pl={6}>
        <Tree {...required} {...handlers} />
      </Box>
    </>
  );
}

export default TagManager;
