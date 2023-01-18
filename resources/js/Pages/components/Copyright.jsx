import React from 'react';
import { Text } from '@chakra-ui/react';

function Copyright() {
  return (
    <Text fontSize="sm" textAlign="center">
      Copyright © CosManage {new Date().getFullYear()}
    </Text>
  );
}

export default Copyright;
