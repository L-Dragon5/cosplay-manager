import {
  Box,
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
import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-cropper';

import TagSelect from '../../../components/TagSelect';

function OutfitAddForm({ tags, series, onClose }) {
  const [image, setImage] = useState(null);

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    status: '',
    tags: [],
    creator: '',
    storage_location: '',
    times_worn: '',
    character_id: '0',
    image: '',
  });

  const cropper = useRef();

  function submit(e) {
    e.preventDefault();
    post('/outfits', {
      onSuccess: () => onClose(),
    });
  }

  function getBase64(e) {
    const node = e.currentTarget;

    if (node.files !== null && node.files.length > 0) {
      const tempImage = node.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        (evt) => {
          setImage(evt.target.result);
        },
        false,
      );

      if (tempImage) {
        reader.readAsDataURL(tempImage);
      }
    }
  }

  function getImageFromUrl() {
    const url = prompt('Enter URL here');

    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  const [seriesChoice, setSeriesChoice] = useState(0);

  useEffect(() => {
    if (seriesChoice !== 0) {
      setData('character_id', '');
    }
  }, [seriesChoice]);

  return (
    <VStack as="form" onSubmit={submit}>
      <HStack width="full">
        <FormControl id="outfit-series" isRequired>
          <FormLabel>Outfit Series</FormLabel>
          <Select
            backgroundColor="white"
            placeholder="Select series"
            onChange={(e) => setSeriesChoice(e.target.value)}
          >
            {series.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="outfit-character" isRequired>
          <FormLabel>Outfit Character</FormLabel>
          <Select
            backgroundColor="white"
            placeholder="Select character"
            onChange={(e) => setData('character_id', e.target.value)}
          >
            {series
              ?.find((item) => item._id === seriesChoice)
              ?.characters?.map((character) => (
                <option key={character._id} value={character._id}>
                  {character.name}
                </option>
              ))}
          </Select>
        </FormControl>
      </HStack>
      <FormControl id="title" isInvalid={!!errors?.title} isRequired>
        <FormLabel>Outfit Title</FormLabel>
        <Input
          placeholder="Outfit title"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
        />
        <FormErrorMessage>{errors?.title}</FormErrorMessage>
      </FormControl>
      <FormControl id="status" isInvalid={!!errors?.status} isRequired>
        <FormLabel>Outfit Status</FormLabel>
        <Select
          placeholder="Select status"
          value={data.status}
          onChange={(e) => setData('status', e.target.value)}
        >
          <option value={0}>Future Cosplay</option>
          <option value={1}>Owned & Unworn</option>
          <option value={2}>Worn</option>
        </Select>
        <FormErrorMessage>{errors?.status}</FormErrorMessage>
      </FormControl>
      <FormControl id="tags" isInvalid={!!errors?.tags}>
        <FormLabel>Tags</FormLabel>
        <TagSelect tags={tags} setData={setData} />
        <FormErrorMessage>{errors?.tags}</FormErrorMessage>
      </FormControl>

      <Box h="50px" />

      <FormControl id="creator" isInvalid={!!errors?.creator}>
        <FormLabel>Creator</FormLabel>
        <Input
          placeholder="Creator"
          value={data.creator}
          onChange={(e) => setData('creator', e.target.value)}
        />
        <FormErrorMessage>{errors?.creator}</FormErrorMessage>
      </FormControl>
      <FormControl id="storage_location" isInvalid={!!errors?.storage_location}>
        <FormLabel>Storage Location</FormLabel>
        <Input
          placeholder="Storage location"
          value={data.storage_location}
          onChange={(e) => setData('storage_location', e.target.value)}
        />
        <FormErrorMessage>{errors?.storage_location}</FormErrorMessage>
      </FormControl>
      <FormControl id="times_worn" isInvalid={!!errors?.times_worn}>
        <FormLabel>Times Worn</FormLabel>
        <Input
          type="number"
          placeholder="Times worn"
          value={data.times_worn}
          onChange={(e) => setData('times_worn', e.target.value)}
        />
        <FormErrorMessage>{errors?.times_worn}</FormErrorMessage>
      </FormControl>
      <FormControl id="obtained_on" isInvalid={!!errors?.obtained_on}>
        <FormLabel>Obtained On</FormLabel>
        <Input
          type="date"
          placeholder="Obtained on"
          value={data.obtained_on}
          onChange={(e) => setData('obtained_on', e.target.value)}
        />
        <FormErrorMessage>{errors?.obtained_on}</FormErrorMessage>
      </FormControl>
      <HStack>
        <FormControl id="image">
          <FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={getBase64}
              display="none"
            />
            <Button as="span" colorScheme="orange">
              Upload Image
            </Button>
          </FormLabel>
        </FormControl>
        <FormControl id="image-url">
          <Button as="span" colorScheme="orange" onClick={getImageFromUrl}>
            Get Image from URL
          </Button>
        </FormControl>
      </HStack>

      {image && (
        <Box>
          <Cropper
            ref={cropper}
            viewMode={1}
            src={image}
            style={{ maxHeight: 350 }}
            guides={false}
            autoCropArea={1}
            movable={false}
            zoomable={false}
            scalable={false}
            rotatable={false}
            crop={() =>
              setData(
                'image',
                cropper?.current?.getCroppedCanvas()?.toDataURL(),
              )
            }
          />
        </Box>
      )}

      <Button
        type="submit"
        colorScheme="green"
        width="full"
        isLoading={processing}
      >
        Add Outfit
      </Button>
    </VStack>
  );
}

export default OutfitAddForm;
