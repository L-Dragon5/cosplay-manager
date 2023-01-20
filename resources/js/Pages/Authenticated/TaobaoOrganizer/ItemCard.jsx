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

function ItemCard({ item, setDrawerType }) {
  const { _id, tags, image_url, original_title, custom_title, is_archived } =
    item;

  const handleView = (id) => setDrawerType(`View-${id}`);
  const handleEdit = (id) => setDrawerType(`Edit-${id}`);
  const handleArchive = (id) => {
    if (is_archived) {
      setDrawerType(`Unarchive-${id}`);
    } else {
      setDrawerType(`Archive-${id}`);
    }
  };
  const handleDelete = (id) => setDrawerType(`Delete-${id}`);

  return (
    <LazyLoad key={`lazy-${_id}`} height={500} once offset={100}>
      <Card
        height="full"
        maxW={400}
        opacity={is_archived ? '75%' : '100%'}
        border={is_archived ? '2px solid red' : 'none'}
        boxShadow="md"
      >
        <CardHeader flexGrow={1}>
          <Text fontSize="lg">
            {custom_title !== null && custom_title !== ''
              ? custom_title
              : original_title}
          </Text>
          <HStack>
            {tags.map((tag, i) => (
              <Tag key={tag._id} colorScheme="orange" variant="outline">
                {tag.title}
              </Tag>
            ))}
          </HStack>
        </CardHeader>

        <Image src={image_url} height={300} objectFit="cover" />

        <CardFooter p={0}>
          <ButtonGroup size="lg" variant="outline" width="full" isAttached>
            <IconButton
              colorScheme="orange"
              aria-label="View"
              flex="1 0 auto"
              icon={<ViewIcon />}
              onClick={() => handleView(item._id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label="Edit"
              icon={<EditIcon />}
              onClick={() => handleEdit(item._id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label={is_archived ? 'Unarchive' : 'Archive'}
              icon={<CalendarIcon />}
              onClick={() => handleArchive(item._id)}
            />
            <IconButton
              colorScheme="orange"
              aria-label="Delete"
              icon={<DeleteIcon />}
              onClick={() => handleDelete(item._id)}
            />
          </ButtonGroup>
        </CardFooter>
      </Card>
    </LazyLoad>
  );
}

export default ItemCard;
