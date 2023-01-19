import { LockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
} from '@chakra-ui/react';
import { Link as InertiaLink, useForm } from '@inertiajs/react';
import React from 'react';

import Copyright from './components/Copyright';

function ForgotPassword() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/forgot-password');
  }

  return (
    <Flex alignContent="center" justifyContent="center" flexDirection="column" width="full" minHeight="100vh" backgroundColor="pink.100">
      <Container maxW="lg" centerContent>
        <Flex flexDirection="column" justifyContent="center" borderRadius="md" border="1px solid #ccc" p={3} width="full" boxShadow="lg" backgroundColor="white">
          <Flex as="form" flexDirection="column" alignItems="center" onSubmit={submit}>
            <LockIcon boxSize={8} />
            <Heading textAlign="center">Forgot Password</Heading>
            <FormControl id="email" mt={4} isInvalid={!!errors?.email} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Email address"
              />
              <FormErrorMessage>{errors?.email}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full" my={4} isLoading={processing}>Sign in</Button>
          </Flex>
          <HStack>
            <Spacer />
            <InertiaLink href="/login">Back to sign in</InertiaLink>
          </HStack>
          <Box mt={6}>
            <Copyright />
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

export default ForgotPassword;
