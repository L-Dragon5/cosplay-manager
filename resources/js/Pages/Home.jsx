import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Link as InertiaLink } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import Copyright from './components/Copyright';

function Home() {
  const [changelog, setChangelog] = useState(null);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/L-Dragon5/cosplay-manager/v2/CHANGELOG.md',
    )
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Error reading from github.');
      })
      .then((data) => {
        setChangelog(data);
      });
  }, []);

  return (
    <Flex width="full" minHeight="100vh" direction="column">
      <Flex
        width="full"
        height="200px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor="blue.100"
      >
        <HStack>
          <Button as={InertiaLink} colorScheme="teal" href="/login">
            Login
          </Button>
          <Button
            as={InertiaLink}
            colorScheme="teal"
            variant="outline"
            href="/register"
          >
            Sign Up Now
          </Button>
        </HStack>
      </Flex>

      <Flex
        flexDirection="column"
        backgroundColor="green.100"
        py={10}
        flexGrow={1}
      >
        <Container maxW="200ch" centerContent>
          <Heading as="h1" size="2xl" textAlign="center" mb={6}>
            Features
          </Heading>
          <SimpleGrid columns={3} spacing={5}>
            <Flex flexDirection="column">
              <Heading as="h2" size="xl" textAlign="center" mb={3}>
                Cosplay Management
              </Heading>
              <Text textAlign="center" mb={6}>
                Organize your cosplay plans and ones currently owned in one easy
                place. Easy to look through and organize with images and
                customized text fields.
              </Text>
              <Text fontSize="sm" textAlign="center">
                The colors match up to the status of the outfit in the plan.
                (Future = Green, Owned & Unworn = Blue, Worn = Red)
              </Text>
            </Flex>
            <Flex flexDirection="column">
              <Heading as="h2" size="xl" textAlign="center" mb={3}>
                Taobao Organizer
              </Heading>
              <Text textAlign="center">
                If you buy a lot of your cosplays on Taobao and have a
                never-ending folder of bookmarks on your browser, this is the
                right tool for you. Just paste in the taobao link of your choice
                and it will grab the necessary information of the item and
                display in it a grid format for easy viewing and access.
              </Text>
            </Flex>
            <Flex flexDirection="column">
              <Heading as="h2" size="xl" textAlign="center" mb={3}>
                Tag Manager
              </Heading>
              <Text textAlign="center">
                An added bonus for more management, there is a tag management
                system that can be applied to all Outfits in the Cosplay
                Management tool and all Items in the Taobao Organizer tool and
                can be searched for on the corresponding pages. This will make
                it easier to have custom names that aren't available straight
                out of the box.
              </Text>
            </Flex>
          </SimpleGrid>
        </Container>
      </Flex>

      <Flex
        flexDirection="column"
        backgroundColor="orange.100"
        py={10}
        flexGrow={1}
      >
        <Container maxW="150ch" centerContent>
          <Heading as="h1" size="2xl" textAlign="center" mb={4}>
            Who made this?
          </Heading>
          <Text textAlign="center" mb={5}>
            Hi, I'm Joe and I'm the creator and developer of CosManage. I make
            websites for fun (you can check out my{' '}
            <Link
              href="https://github.com/L-Dragon5/"
              color="purple.500"
              isExternal
            >
              GitHub
            </Link>
            ). My girlfriend and a lot of my friends are very active cosplayers,
            so I built this website as a collection of tools for them to use to
            organize their plans.
          </Text>
          <Text textAlign="center" mb={10}>
            Feel free to contact me if you have any problems or any things you
            wanted added in the future. I hope to grow this as much as possible!
          </Text>
          <Button
            as={Link}
            href="mailto:help@cosmanage.com"
            colorScheme="purple"
            maxWidth="300px"
          >
            help@cosmanage.com
          </Button>
        </Container>
      </Flex>

      <Flex
        flexDirection="column"
        alignItems="center"
        backgroundColor="gray.200"
        py={5}
      >
        <Copyright />
      </Flex>
    </Flex>
  );
}

export default Home;
