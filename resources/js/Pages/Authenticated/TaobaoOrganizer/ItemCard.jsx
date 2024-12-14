import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { CalendarIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
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
import { Carousel } from 'react-responsive-carousel';

function ItemCard({ item, setDrawerType }) {
  const { id, tags, images, original_title, custom_title, is_archived } = item;

  const handleView = (id) => setDrawerType(`View-${id}`);
  const handleEdit = (id) => setDrawerType(`Edit-${id}`);
  const handleArchive = (id) => {
    if (is_archived === 1) {
      setDrawerType(`Unarchive-${id}`);
    } else {
      setDrawerType(`Archive-${id}`);
    }
  };
  const handleDelete = (id) => setDrawerType(`Delete-${id}`);

  return (
    <LazyLoad key={`lazy-${id}`} height={500} once offset={100}>
      <Card
        height="full"
        maxW={400}
        opacity={is_archived === 1 ? '75%' : '100%'}
        border={is_archived === 1 ? '2px solid red' : 'none'}
        boxShadow="md"
      >
        <CardHeader flexGrow={1}>
          <Text fontSize="lg">
            {custom_title && custom_title !== null && custom_title !== ''
              ? custom_title
              : original_title}
          </Text>
          <HStack>
            {tags.map((tag, i) => (
              <Tag key={tag.id} colorScheme="orange" variant="outline">
                {tag.title}
              </Tag>
            ))}
          </HStack>
        </CardHeader>

        <Carousel autoPlay={false} infiniteLoop showThumbs={false}>
          {images?.map((image) => (
            <Image key={image} src={image} height={300} objectFit="cover" />
          ))}
        </Carousel>

        <CardFooter p={0}>
          <ButtonGroup size="lg" variant="outline" width="full" isAttached>
            <IconButton
              colorScheme="orange"
              aria-label="View"
              flex="1 0 auto"
              icon={<ViewIcon />}
              onClick={() => handleView(item.id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label="Edit"
              icon={<EditIcon />}
              onClick={() => handleEdit(item.id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label={is_archived === 1 ? 'Unarchive' : 'Archive'}
              icon={<CalendarIcon />}
              onClick={() => handleArchive(item.id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label="Delete"
              icon={<DeleteIcon />}
              onClick={() => handleDelete(item.id)}
            />
          </ButtonGroup>
        </CardFooter>
      </Card>
    </LazyLoad>
  );
}

export default ItemCard;
