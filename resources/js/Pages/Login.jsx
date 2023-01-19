import React from 'react';

import {
  Box,
  Flex,
  Container,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Spacer,
  HStack,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { Link as InertiaLink, useForm } from '@inertiajs/react';
import Copyright from './components/Copyright';

function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/login');
  }

  return (
    <Flex alignContent="center" justifyContent="center" flexDirection="column" width="full" minHeight="100vh" backgroundColor="pink.100">
      <Container maxW="lg" centerContent>
        <Flex flexDirection="column" justifyContent="center" borderRadius="md" border="1px solid #ccc" p={3} width="full" boxShadow="lg" backgroundColor="white">
          <Flex as="form" flexDirection="column" alignItems="center" onSubmit={submit}>
            <LockIcon boxSize={8} />
            <Heading textAlign="center">Sign in</Heading>
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
            <FormControl id="password" mt={3} isInvalid={!!errors?.password} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Password"
              />
              <FormErrorMessage>{errors?.password}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full" my={4} isLoading={processing}>Sign in</Button>
          </Flex>
          <HStack>
            <InertiaLink href="/forgot-password">Forgot password?</InertiaLink>
            <Spacer />
            <InertiaLink href="/register">Don&apos;t have an account? Sign Up!</InertiaLink>
          </HStack>
          <Box mt={6}>
            <Copyright />
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

export default Login;