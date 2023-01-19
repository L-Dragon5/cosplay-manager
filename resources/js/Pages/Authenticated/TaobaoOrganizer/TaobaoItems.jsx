import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
} from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Navbar from '../../components/Navbar';

function TaobaoItems({ items }) {
  const [activeItems, setActiveItems] = useState(items);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(3);
  const [checkboxes, setCheckboxes] = useState(['active', 'archived']);

  const { data, setData, post, reset, processing, errors } = useForm({
    url: '',
  });

  function submit(e) {
    e.preventDefault;
    post('/items', {
      preserveScroll: true,
      onSuccess: () => reset('url'),
    });
  }

  // Set outfits based on search and filters.
  function filterItems() {
    const lowerSearch = String(search).toLowerCase();

    if (items !== null) {
      switch (filter) {
        case 0: // None
          setActiveItems(null);
          break;
        case 1: // Active Only
          setActiveItems(
            items.filter(
              (item) =>
                !!item.is_archived === false &&
                (String(item.custom_title)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                  String(item.original_title)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 2: // Archive Only
          setActiveItems(
            items.filter(
              (item) =>
                !!item.is_archived === true &&
                (String(item.custom_title)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                  String(item.original_title)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 3: // Active & Archive
          setActiveItems(
            items.filter(
              (item) =>
                String(item.custom_title).toLowerCase().indexOf(lowerSearch) !==
                  -1 ||
                String(item.original_title)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0,
            ),
          );
          break;
        default:
          break;
      }
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Set filter mask based on checkboxes.
  useEffect(() => {
    let mask = 0;

    if (checkboxes.includes('active')) {
      mask += 1;
    }

    if (checkboxes.includes('archived')) {
      mask += 2;
    }

    setFilter(mask);
  }, [checkboxes]);

  useEffect(() => {
    filterItems();
  }, [filter, search, items]);

  return (
    <>
      <Head title="Taobao Organizer" />
      <Navbar />
      <HStack p={4} backgroundColor="gray.50" borderBottom="1px solid #ccc">
        <Heading mr={12}>Items</Heading>
        <SimpleGrid columns={2} spacing={2} width="full" maxWidth="1600px">
          <form onSubmit={submit}>
            <FormControl
              id="add-item"
              border="1px solid #ddd"
              borderRadius="md"
              p={1}
              isInvalid={!!errors?.url}
            >
              <InputGroup size="md">
                <Input
                  placeholder="Add item"
                  value={data.url}
                  onChange={(e) => setData('url', e.target.value)}
                />
                <InputRightElement width="120px">
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="orange"
                    type="submit"
                    isLoading={processing}
                  >
                    Add Item
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>
                Enter http links or json data here
              </FormHelperText>
              <FormErrorMessage>{errors?.url}</FormErrorMessage>
            </FormControl>
          </form>

          <Box />

          <FormControl
            id="search"
            border="1px solid #ddd"
            borderRadius="md"
            p={1}
          >
            <Input
              as={DebounceInput}
              debounceTimeout={300}
              placeholder="Search"
              onChange={handleSearch}
            />
          </FormControl>

          <FormControl
            as={Flex}
            id="filter"
            border="1px solid #ddd"
            borderRadius="md"
            p={1}
            alignItems="center"
          >
            <CheckboxGroup
              colorScheme="orange"
              value={checkboxes}
              size="lg"
              onChange={(e) => setCheckboxes(e)}
            >
              <HStack>
                <Checkbox value="active">Active Items</Checkbox>
                <Checkbox value="archived">Archived Items</Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
        </SimpleGrid>
      </HStack>

      <SimpleGrid minChildWidth="250px" spacing={4} p={4}>
        {activeItems &&
          activeItems.map((item) => {
            return (
              <Box key={`i-${item._id}`} item={item} id={item.id}>
                {item.original_title}
              </Box>
            );
          })}
      </SimpleGrid>
    </>
  );
}

export default TaobaoItems;
