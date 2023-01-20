import { Box, Heading, HStack, Link, Spacer } from '@chakra-ui/react';
import { Link as InertiaLink, usePage } from '@inertiajs/react';
import FileDownload from 'js-file-download';
import React, { useState } from 'react';

function Navbar() {
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const { url } = usePage();

  const downloadTBOCSV = () => {
    axios
      .get(`/account/getCSV`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        FileDownload(response.data, 'tborganizer-export.csv');
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
        }
      });
  };

  return (
    <Box as={HStack} backgroundColor="orange.400" p={3} boxShadow="md">
      <Heading size="lg">CosManage</Heading>
      <Spacer />
      <HStack spacing={3}>
        <Link
          as={InertiaLink}
          href="/cosplay-management"
          className={url.startsWith('/cosplay-management') ? 'active' : ''}
          sx={{
            '&.active': {
              borderBottom: '1px solid black',
            },
          }}
        >
          Cosplay Management
        </Link>
        <Link
          as={InertiaLink}
          href="/taobao-organizer"
          className={url.startsWith('/taobao-organizer') ? 'active' : ''}
          sx={{
            '&.active': {
              borderBottom: '1px solid black',
            },
          }}
        >
          Taobao Organizer
        </Link>
        <Link
          as={InertiaLink}
          href="/tag-manager"
          className={url.startsWith('/tag-manager') ? 'active' : ''}
          sx={{
            '&.active': {
              borderBottom: '1px solid black',
            },
          }}
        >
          Tag Manager
        </Link>
      </HStack>
    </Box>
  );
}

export default Navbar;
