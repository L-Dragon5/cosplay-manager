import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  Card,
  CardFooter,
  CardHeader,
  HStack,
  IconButton,
  Image,
  Tag,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import LazyLoad from 'react-lazyload';

function OutfitCard({ outfit, setDrawerType }) {
  const { _id, tags, images_urls, character, title, status } = outfit;
  const { name: character_name } = character;

  const handleView = (id) => setDrawerType(`View-${id}`);
  const handleEdit = (id) => setDrawerType(`Edit-${id}`);
  const handleDelete = (id) => setDrawerType(`Delete-${id}`);

  /*
  const handleRemovePhoto = (e, index) => {
    e.stopPropagation();

    axios
      .get(`/api/outfit/${id}/deleteImage/${index}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccessAlertMessage(response.data.message);
          setSnackbarStatus(true);
          setImages(response.data.images);
        }
      })
      .catch((error) => {
        if (error.response) {
          let message = '';

          if (Array.isArray(error.response)) {
            Object.keys(error.response.data.message).forEach((key) => {
              message += `[${key}] - ${error.response.data.message[key]}\r\n`;
            });
          } else {
            message += error.response.data.message;
          }

          setErrorAlertMessage(message);
          setSnackbarStatus(true);
        }
      });
  };

  useEffect(() => {
    if (images.length > 0) {
      setRenderCarousel(true);
    }
  }, [images]);
  */

  // 0 = Future Cosplay, 1 = Owned & Unworn, 2 = Worn
  return (
    <LazyLoad key={`lazy-${_id}`} height={600} once offset={100}>
      <Card
        height="full"
        maxW={400}
        backgroundColor={
          status == 0
            ? 'green.200'
            : status == 1
            ? 'blue.200'
            : status == 2
            ? 'red.100'
            : 'white'
        }
        boxShadow="md"
      >
        <CardHeader flexGrow={1}>
          <Text fontSize="lg">{title}</Text>
          <Text fontSize="md" color="gray.600">
            {character_name}
          </Text>
          <HStack>
            {tags.map((tag, i) => (
              <Tag key={tag._id} colorScheme="orange" variant="outline">
                {tag.title}
              </Tag>
            ))}
          </HStack>
        </CardHeader>

        <CardFooter p={0}>
          <ButtonGroup size="lg" variant="outline" width="full" isAttached>
            <IconButton
              colorScheme="orange"
              aria-label="View"
              flex="1 0 auto"
              icon={<ViewIcon />}
              onClick={() => handleView(outfit._id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label="Edit"
              icon={<EditIcon />}
              onClick={() => handleEdit(outfit._id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label="Delete"
              icon={<DeleteIcon />}
              onClick={() => handleDelete(outfit._id)}
            />
          </ButtonGroup>
        </CardFooter>
      </Card>
    </LazyLoad>
  );
}

export default OutfitCard;
