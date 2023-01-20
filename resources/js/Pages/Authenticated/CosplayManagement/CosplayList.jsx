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
  SimpleGrid,
} from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';

import Navbar from '../../components/Navbar';

function CosplayList({ outfits, characters, series }) {
  /**
   * Filter
   * 0 = none
   * 1 = future
   * 2 = owned & unworn
   * 4 = worn
   */
  console.log(outfits);
  console.log(characters);
  console.log(series);

  const [activeOutfits, setActiveOutfits] = useState([]); // All outfits available
  const [search, setSearch] = useState(''); // Search input
  const [filter, setFilter] = useState(7); // Filter mask

  const [checkboxes, setCheckboxes] = useState({
    futureCheckbox: true,
    ownedUnwornCheckbox: true,
    wornCheckbox: true,
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChange = (e) => {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  };

  // Set filter mask based on checkboxes.
  useEffect(() => {
    let mask = 0;

    if (checkboxes.futureCheckbox) {
      mask += 1;
    }

    if (checkboxes.ownedUnwornCheckbox) {
      mask += 2;
    }

    if (checkboxes.wornCheckbox) {
      mask += 4;
    }

    setFilter(mask);
  }, [checkboxes]);

  // Set outfits based on search and filters.
  useEffect(() => {
    const lowerSearch = String(search).toLowerCase();

    switch (filter) {
      case 0: // None
        setActiveOutfits([]);
        break;
      case 1: // Future Only
        setActiveOutfits(
          outfits.filter(
            (item) =>
              item.status === 0 &&
              (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0),
          ),
        );
        break;
      case 2: // Unworn Only
        setActiveOutfits(
          outfits.filter(
            (item) =>
              item.status === 1 &&
              (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0),
          ),
        );
        break;
      case 3: // Future + Unworn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              (item.status === 0 || item.status === 1) &&
              (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0),
          ),
        );
        break;
      case 4: // Worn Only
        setActiveOutfits(
          outfits.filter(
            (item) =>
              item.status === 2 &&
              (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0),
          ),
        );
        break;
      case 5: // Future + Worn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              (item.status === 0 || item.status === 2) &&
              (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0),
          ),
        );
        break;
      case 6: // Unworn + Worn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              (item.status === 1 || item.status === 2) &&
              (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0),
          ),
        );
        break;
      case 7: // Future + Unworn + Worn
        setActiveOutfits(
          outfits.filter(
            (item) =>
              String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
              String(item.character_name).toLowerCase().indexOf(lowerSearch) !==
                -1 ||
              item.tags.filter((tag) => {
                return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
              }).length > 0,
          ),
        );
        break;
      default:
        break;
    }
  }, [filter, search]);

  return (
    <>
      <Head title="Cosplay Management" />
      <Box position="sticky" top={0} zIndex={2}>
        <Navbar />
        <HStack>
          <Heading p={4}>Cosplay List</Heading>
        </HStack>
      </Box>

      <SimpleGrid>
        {activeOutfits &&
          activeOutfits.map((item) => {
            return (
              <LazyLoad key={`lazy-${item._id}`} height={600} once offset={100}>
                <Box key={`o-${item._id}`} item={item} />
              </LazyLoad>
            );
          })}
      </SimpleGrid>
    </>
  );
}

export default CosplayList;
