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
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Select,
  SimpleGrid,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { Carousel } from 'react-responsive-carousel';

import Navbar from '../../components/Navbar';
import OutfitCard from './OutfitCard';

function CosplayList({ outfits, series }) {
  /**
   * Filter
   * 0 = none
   * 1 = future
   * 2 = owned & unworn
   * 4 = worn
   */

  const [activeOutfit, setActiveOutfit] = useState({});
  const [filterSeries, setFilterSeries] = useState(0);
  const [filterCharacter, setFilterCharacter] = useState(0);
  const [drawerType, setDrawerType] = useState('');
  const [activeOutfits, setActiveOutfits] = useState(outfits); // All outfits available
  const [search, setSearch] = useState(''); // Search input
  const [filter, setFilter] = useState(7); // Filter mask
  const [checkboxes, setCheckboxes] = useState(['future', 'unworn', 'worn']);

  const { isOpen, onOpen, onClose } = useDisclosure();

  function filterOutfits() {
    const lowerSearch = String(search).toLowerCase();
    const searchBool = (item) => {
      return (
        String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
        String(item?.character?.name).toLowerCase().indexOf(lowerSearch) !==
          -1 ||
        item.tags.filter((tag) => {
          return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
        }).length > 0
      );
    };

    const filterBool = (item) => {
      if (filterSeries === 0 || filterSeries === '') {
        return true;
      }

      if (filterCharacter === 0 || filterCharacter === '') {
        return item?.character?.series_id == filterSeries;
      }

      return (
        item?.character?.series_id === filterSeries &&
        item?.character_id === filterCharacter
      );
    };

    switch (filter) {
      case 0: // None
        setActiveOutfits([]);
        break;
      case 1: // Future Only
        setActiveOutfits(
          outfits.filter(
            (item) => item.status == 0 && searchBool(item) && filterBool(item),
          ),
        );
        break;
      case 2: // Unworn Only
        setActiveOutfits(
          outfits.filter(
            (item) => item.status == 1 && searchBool(item) && filterBool(item),
          ),
        );
        break;
      case 3: // Future + Unworn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              (item.status == 0 || item.status == 1) &&
              searchBool(item) &&
              filterBool(item),
          ),
        );
        break;
      case 4: // Worn Only
        setActiveOutfits(
          outfits.filter(
            (item) => item.status == 2 && searchBool(item) && filterBool(item),
          ),
        );
        break;
      case 5: // Future + Worn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              (item.status == 0 || item.status == 2) &&
              searchBool(item) &&
              filterBool(item),
          ),
        );
        break;
      case 6: // Unworn + Worn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              (item.status == 1 || item.status == 2) &&
              searchBool(item) &&
              filterBool(item),
          ),
        );
        break;
      case 7: // Future + Unworn + Worn
        setActiveOutfits(
          outfits.filter((item) => searchBool(item) && filterBool(item)),
        );
        break;
      default:
        break;
    }
  }

  const handleSearch = (e) => setSearch(e.target.value);
  const handleDelete = (e) => {
    router.delete(`/outfits/${activeOutfit._id}`);
    onClose();
  };

  // Set filter mask based on checkboxes.
  useEffect(() => {
    let mask = 0;

    if (checkboxes.includes('future')) {
      mask += 1;
    }

    if (checkboxes.includes('unworn')) {
      mask += 2;
    }

    if (checkboxes.includes('worn')) {
      mask += 4;
    }

    setFilter(mask);
  }, [checkboxes]);

  // Set outfits based on search and filters.
  useEffect(() => {
    filterOutfits();
  }, [filter, filterSeries, filterCharacter, search, outfits]);

  useEffect(() => {
    if (drawerType !== '') {
      const id = drawerType.split('-').pop();
      setActiveOutfit(outfits.find((outfit) => outfit._id == id));
      onOpen();
    }
  }, [drawerType]);

  useEffect(() => {
    if (!isOpen) setDrawerType('');
  }, [isOpen]);

  useEffect(() => {
    if (filterSeries !== 0) {
      setFilterCharacter(0);
    }
  }, [filterSeries]);

  return (
    <>
      <Head title="Cosplay Management" />
      <Box position="sticky" top={0} zIndex={2}>
        <Navbar />
        <HStack p={4} backgroundColor="gray.50" borderBottom="1px solid #ccc">
          <Heading mr={12} flexBasis="280px">
            Cosplay List
          </Heading>
          <Button
            colorScheme="orange"
            leftIcon={<AddIcon />}
            onClick={() => setDrawerType('Add')}
          >
            Add
          </Button>
          <SimpleGrid columns={2} spacing={2} width="full" maxWidth="1600px">
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
                  <Checkbox value="future">Future</Checkbox>
                  <Checkbox value="unworn">Owned & Unworn</Checkbox>
                  <Checkbox value="worn">Worn</Checkbox>
                </HStack>
              </CheckboxGroup>
            </FormControl>

            <HStack>
              <Select
                placeholder="Select series"
                onChange={(e) => setFilterSeries(e.target.value)}
              >
                {series.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Select character"
                onChange={(e) => setFilterCharacter(e.target.value)}
              >
                {series
                  ?.find((item) => item._id === filterSeries)
                  ?.characters?.map((character) => (
                    <option key={character._id} value={character._id}>
                      {character.name}
                    </option>
                  ))}
              </Select>
            </HStack>
          </SimpleGrid>
        </HStack>
      </Box>

      <Grid
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={4}
        p={4}
      >
        {activeOutfits &&
          activeOutfits.map((outfit) => {
            return (
              <GridItem
                as={OutfitCard}
                key={`o-${outfit._id}`}
                outfit={outfit}
                setDrawerType={setDrawerType}
              />
            );
          })}
      </Grid>

      <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {drawerType.split('-').shift()} -{' '}
            {activeOutfit?.title ?? 'New Outfit'}
          </DrawerHeader>
          <DrawerBody>
            {drawerType.includes('Add') && <Text>Insert add form here</Text>}

            {drawerType.includes('View') && (
              <VStack alignItems="flex-start">
                <Carousel autoPlay={false} showThumbs={false}>
                  {activeOutfit?.images_urls?.map((image) => (
                    <Image key={image} src={image} />
                  ))}
                </Carousel>
                <Text>
                  <strong>Status:</strong>{' '}
                  {activeOutfit.status == 0
                    ? 'Future'
                    : activeOutfit.status == 1
                    ? 'Owned & Unworn'
                    : activeOutfit.status == 2
                    ? 'Worn'
                    : ''}
                </Text>
                {activeOutfit?.character?.name && (
                  <Text>
                    <strong>Character:</strong> {activeOutfit.character.name}
                  </Text>
                )}
                {activeOutfit.tags && (
                  <Text>
                    <strong>Tags:</strong>{' '}
                    {activeOutfit.tags.map((tag, i) => (
                      <Tag key={tag._id} colorScheme="orange" variant="outline">
                        {tag.title}
                      </Tag>
                    ))}
                  </Text>
                )}
                <Text>
                  <strong>Storage Location:</strong>{' '}
                  {activeOutfit.storage_location}
                </Text>
                <Text>
                  <strong>Times Worn:</strong> {activeOutfit.times_worn}
                </Text>
                <Text>
                  <strong>Creator:</strong> {activeOutfit.creator}
                </Text>
              </VStack>
            )}

            {drawerType.includes('Edit') && <Text>Insert edit form here</Text>}

            {drawerType.includes('Delete') && (
              <VStack>
                <Text>
                  Are you sure you want to permanently delete [
                  {activeOutfit.title}]? This action is irreversible.
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

export default CosplayList;
