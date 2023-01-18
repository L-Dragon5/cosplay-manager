import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Flex, Heading, Text, Button, Link } from '@chakra-ui/react';

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
    <Flex width="full" flex="1 1 0" direction="column">
      <Flex>
        <Button as={Link} href="/login">
          Login
        </Button>
        <Button as={Link} href="/register">
          Sign Up Now
        </Button>
      </Flex>
      <Flex>
        <Heading>Features</Heading>
        <Flex>
          <Flex>
            <Heading>Cosplay Management</Heading>
            <Text>
              Organize your cosplay plans and ones currently owned in one easy
              place. Easy to look through and organize with images and
              customized text fields.
            </Text>
            <Text>
              The colors match up to the status of the outfit in the plan.
              (Future = Green, Owned & Unworn = Blue, Worn = Red)
            </Text>
          </Flex>
          <Flex>
            <Heading>Taobao Organizer</Heading>
            <Text>
              If you buy a lot of your cosplays on Taobao and have a
              never-ending folder of bookmarks on your browser, this is the
              right tool for you. Just paste in the taobao link of your choice
              and it will grab the necessary information of the item and display
              in it a grid format for easy viewing and access.
            </Text>
          </Flex>
          <Flex>
            <Heading>Tag Manager</Heading>
            <Text>
              An added bonus for more management, there is a tag management
              system that can be applied to all Outfits in the Cosplay
              Management tool and all Items in the Taobao Organizer tool and can
              be searched for on the corresponding pages. This will make it
              easier to have custom names that aren't available straight out of
              the box.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex>
        <ReactMarkdown children={changelog} />
      </Flex>
      <Flex>
        <Heading>Who made this?</Heading>
        <Text>
          Hi, I'm Joe and I'm the creator and developer of CosManage. I make
          websites for fun (you can check out my{' '}
          <Link
            href="https://github.com/L-Dragon5/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          ). My girlfriend and a lot of my friends are very active cosplayers,
          so I built this website as a collection of tools for them to use to
          organize their plans.
        </Text>
        <Text>
          Feel free to contact me if you have any problems or any things you
          wanted added in the future. I hope to grow this as much as possible!
        </Text>
        <Button as={Link} href="mailto:help@cosmanage.com">
          help@cosmanage.com
        </Button>
      </Flex>
      <Flex>
        <Copyright />
      </Flex>
    </Flex>
  );
}

export default Home;
