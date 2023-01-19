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
import ReCAPTCHA from 'react-google-recaptcha';

import Copyright from './components/Copyright';

function Register() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    c_password: '',
    'g-recaptcha-response': '',
  });

  function submit(e) {
    e.preventDefault();
    post('/register');
  }

  return (
    <Flex alignContent="center" justifyContent="center" flexDirection="column" width="full" minHeight="100vh" backgroundColor="pink.100">
      <Container maxW="lg" centerContent>
        <Flex flexDirection="column" justifyContent="center" borderRadius="md" border="1px solid #ccc" p={3} width="full" boxShadow="lg" backgroundColor="white">
          <Flex as="form" flexDirection="column" alignItems="center" onSubmit={submit}>
            <LockIcon boxSize={8} />
            <Heading textAlign="center">Register</Heading>
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
            <FormControl id="c_password" mt={3} isInvalid={!!errors?.c_password} isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" value={data.c_password}
              onChange={e => setData('c_password', e.target.value)}
              placeholder="Confirm password" />
              <FormErrorMessage>{errors?.c_password}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <ReCAPTCHA sitekey={process.env.MIX_GOOGLE_RECAPTCHA_KEY} onChange={(value) => setData('g-recaptcha-response', value)} />
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full" my={4} isLoading={processing}>Register</Button>
          </Flex>
          <HStack>
            <Spacer />
            <InertiaLink href="/login">Already have an account? Sign in!</InertiaLink>
          </HStack>
          <Box mt={6}>
            <Copyright />
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

export default Register;
