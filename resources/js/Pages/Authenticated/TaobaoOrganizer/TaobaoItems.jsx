import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  SimpleGrid,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Head, InfiniteScroll, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { Carousel } from 'react-responsive-carousel';

import Navbar from '../../components/Navbar';
import ItemCard from './ItemCard';
import ItemEditForm from './ItemEditForm';

function TaobaoItems({ items }) {
  const [activeItem, setActiveItem] = useState({});
  const [drawerType, setDrawerType] = useState('');
  const [activeItems, setActiveItems] = useState(items.data);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(3);
  const [checkboxes, setCheckboxes] = useState(['active', 'archived']);

  const { data, setData, post, reset, processing, errors } = useForm({
    url: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  function submit(e) {
    e.preventDefault();
    post('/items', {
      preserveScroll: true,
      onSuccess: () => reset('url'),
    });
  }

  // Set outfits based on search and filters.
  function filterItems() {
    const lowerSearch = String(search);

    if (items !== null) {
      switch (filter) {
        case 0: // None
          setActiveItems(null);
          break;
        case 1: // Active Only
          setActiveItems(
            items.data.filter(
              (item) =>
                !!item.is_archived === false &&
                (String(item.custom_title).indexOf(lowerSearch) !== -1 ||
                  String(item.original_title).indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.title.indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 2: // Archive Only
          setActiveItems(
            items.data.filter(
              (item) =>
                !!item.is_archived === true &&
                (String(item.custom_title).indexOf(lowerSearch) !== -1 ||
                  String(item.original_title).indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.title.indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 3: // Active & Archive
          setActiveItems(
            items.data.filter(
              (item) =>
                String(item.custom_title).indexOf(lowerSearch) !== -1 ||
                String(item.original_title).indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag?.title?.indexOf(lowerSearch) !== -1;
                }).length > 0,
            ),
          );
          break;
        default:
          break;
      }
    }
  }

  const handleSearch = (e) => setSearch(e.target.value);
  const handleDelete = (e) => {
    router.delete(`/items/${activeItem.id}`);
    onClose();
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text');
    }
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

  useEffect(() => {
    if (drawerType !== '') {
      const id = drawerType.split('-').pop();
      if (drawerType.includes('Archive')) {
        router.put(`/items/${id}/archive`);
      } else if (drawerType.includes('Unarchive')) {
        router.put(`/items/${id}/unarchive`);
      } else {
        setActiveItem(items.data.find((item) => item.id == id));
        onOpen();
      }
    }
  }, [drawerType]);

  useEffect(() => {
    if (!isOpen) setDrawerType('');
  }, [isOpen]);

  return (
    <>
      <Head title="Taobao Organizer" />
      <Box position="sticky" top={0} zIndex={2}>
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
                    backgroundColor="white"
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
                      disabled={data.url.length < 1}
                    >
                      Add Item
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>
                  Enter json data here (links don't work anymore due to TB
                  requiring login)
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
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  as={DebounceInput}
                  debounceTimeout={300}
                  backgroundColor="white"
                  placeholder="Search"
                  onChange={handleSearch}
                />
              </InputGroup>
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
      </Box>

      <InfiniteScroll data="items" buffer={500}>
        <Grid
          gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          gap={4}
          p={4}
        >
          {activeItems?.map((item) => (
            <GridItem
              as={ItemCard}
              key={`i-${item.id}`}
              item={item}
              setDrawerType={setDrawerType}
            />
          ))}
        </Grid>
      </InfiniteScroll>

      <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {drawerType.split('-').shift()} -{' '}
            {activeItem.custom_title
              ? activeItem.custom_title
              : activeItem.original_title}
          </DrawerHeader>
          <DrawerBody>
            {drawerType.includes('View') && (
              <VStack alignItems="flex-start">
                <Carousel autoPlay={false} infiniteLoop showThumbs={false}>
                  {activeItem?.images?.map((image) => (
                    <Image key={image} src={image} objectFit="cover" />
                  ))}
                </Carousel>

                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Field</Th>
                        <Th>Value</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {activeItem.tags && (
                        <Tr>
                          <Td>Tags:</Td>{' '}
                          <Td>
                            {activeItem.tags.map((tag, i) => (
                              <Tag
                                key={tag.id}
                                colorScheme="orange"
                                variant="outline"
                              >
                                {tag.title}
                              </Tag>
                            ))}
                          </Td>
                        </Tr>
                      )}

                      {activeItem.custom_title && (
                        <Tr>
                          <Td>Custom Title:</Td>
                          <Td>{activeItem.custom_title}</Td>
                        </Tr>
                      )}

                      <Tr>
                        <Td>Original Title:</Td>
                        <Td>{activeItem.original_title}</Td>
                      </Tr>
                      <Tr>
                        <Td>Seller:</Td>
                        <Td>{activeItem.seller_name}</Td>
                      </Tr>
                      <Tr>
                        <Td>Price:</Td>
                        <Td>{activeItem.original_price}</Td>
                      </Tr>
                      <Tr>
                        <Td>Quantity:</Td>
                        <Td>{activeItem.quantity}</Td>
                      </Tr>
                      {activeItem.notes && (
                        <Tr>
                          <Td>Notes:</Td>
                          <Td>{activeItem.notes}</Td>
                        </Tr>
                      )}
                      <Tr>
                        <Td>Created At:</Td>
                        <Td>
                          {new Date(activeItem.created_at).toLocaleDateString()}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Updated At:</Td>
                        <Td>
                          {new Date(activeItem.updated_at).toLocaleDateString()}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>URL</Td>
                        <Td onClick={() => copyText(activeItem.listing_url)}>
                          {activeItem.listing_url}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                <Button
                  as={Link}
                  colorScheme="orange"
                  width="full"
                  href={activeItem.listing_url}
                  isExternal
                >
                  Original Listing
                </Button>
              </VStack>
            )}

            {drawerType.includes('Edit') && (
              <ItemEditForm item={activeItem} onClose={onClose} />
            )}

            {drawerType.includes('Delete') && (
              <VStack>
                <Text>
                  Are you sure you want to permanently delete [
                  {activeItem.custom_title
                    ? activeItem.custom_title
                    : activeItem.original_title}
                  ]? This action is irreversible.
                </Text>
                <ButtonGroup>
                  <Button colorScheme="red" variant="outline" onClick={onClose}>
                    No
                  </Button>
                  <Button colorScheme="red" onClick={handleDelete}>
                    Yes
                  </Button>
                </ButtonGroup>
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default TaobaoItems;
