import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useColorModeValue,
  Stack,
  chakra,
  Container,
  Link,
} from '@chakra-ui/react';

export default function FAQ() {
  const data = [
    {
      title: 'What is Chatpuppy?',
      paragraph:
        "Chatpuppy is a decentralized instant messaging Dapp that enables secure end-to-end encrypted messaging and file sharing, with support for various file formats. It integrates with users' crypto wallets and allows for wallet-to-wallet transactions. Chatpuppy also supports the use of NFTs as avatars and themes, and allows for direct interaction with smart contracts via simple commands.",
    },
    {
      title: 'Is Chatpuppy free to use?',
      paragraph:
        'Chatpuppy is free to use for everyone, but users who hold Chatpuppy NFTs will have access to advanced features such as increased file storage space, the ability to send secret messages, and the ability to add more members to their groups. By owning Chatpuppy NFTs, users can enhance their overall experience and have more control over their messaging.',
    },
    {
      title: 'Does it support social account login?',
      paragraph:
        'Yes, Chatpuppy does support social account login, including popular platforms such as Google, Facebook, and Twitter, among others. Additionally, the platform plans to integrate with more social accounts in the future to provide users with more options for authentication.',
    },
    {
      title:
        'Does Chatpuppy support encrypted transmission of files in any format?',
      paragraph:
        'Yes, Chatpuppy supports end-to-end encryption for image, video, and any other format of files. This means that all files shared on Chatpuppy are completely secure and private.',
    },
    {
      title: 'How many members can be in a Chatpuppy group?',
      paragraph:
        'The free tier of Chatpuppy supports up to 20 members in a group. However, if the group creator holds Chatpuppy NFTs, they can unlock higher limitations, such as supporting up to 1000+ members in a group.',
    },
    {
      title: 'How do I create a Chatpuppy account?',
      paragraph:
        'To create a Chatpuppy account, you need to download the Chatpuppy app from the App Store or Google Play Store and install it on your device. Once you open the app, it will prompt you to create a new wallet account or import an existing one. Follow the on-screen instructions to set up your wallet account and start using Chatpuppy. Alternatively, you can also create a new account in Metamask web browser wallet.',
    },
    {
      title: 'Does Chatpuppy support file sharing?',
      paragraph:
        'Yes, Chatpuppy supports file sharing. Users can send and receive files of various formats, including documents, images, audio, and video files. There is a file size limit for the free tier, but if a user holds Chatpuppy NFTs, they can enjoy higher limitations for file storage space.',
    },
    {
      title: 'How does Chatpuppy integrate with crypto wallets?',
      paragraph:
        'Chatpuppy integrates with crypto wallets by allowing users to import their existing Ethereum-based wallet accounts, such as Metamask, directly into the app. This allows users to seamlessly send and receive cryptocurrency within the app without having to switch between different wallets. Chatpuppy also provides wallet-to-wallet functionality, enabling users to easily send and receive cryptocurrency from other Chatpuppy users who also have connected their wallets to the app.',
    },
    {
      title: 'Can I use Chatpuppy on desktop or web browsers?',
      paragraph:
        'Yes, you can use Chatpuppy on desktop or web browsers through the MetaMask wallet extension. Simply add the MetaMask extension to your browser, import your Chatpuppy wallet, and you can access Chatpuppy on your desktop or browser.',
    },
    {
      title: 'How does Chatpuppy handle user data?',
      paragraph:
        "Chatpuppy takes user data privacy very seriously and follows strict data protection regulations. The app uses end-to-end encryption to ensure that only the intended recipients can access the messages and files sent between them. Additionally, Chatpuppy only stores user data that is necessary for the app's functionality and does not collect any unnecessary personal information. Chatpuppy currently stores user data, including chat messages and files, on a cloud server with end-to-end encryption for security purposes. However, the platform does not save conversation data on a blockchain at this time.",
    },
    {
      title: 'How can I trust Chatpuppy mobile wallet?',
      paragraph:
        'Chatpuppy mobile wallet(android and IOS) is based on AlphaWallet under MIT clause. We have added 2 important methods to support encrypting and decrypting messages, these 2 methods are exactly same as Metamask website extensions which is: getEncryptionPublicKey and decrypt. We don’t change other ready functions and just keep as AlphaWallet did. As AlphaWallet is a famous and secured wallet, you can trust Chatpuppy mobile wallet.',
    },
    {
      title: 'How can I invite my friends to use Chatpuppy?',
      paragraph:
        'Users can invite their friends to use Chatpuppy by creating a group and sharing the group link. To do this, users can create a Chatpuppy group and invite their friends to join by sharing the group link. To share the group link, users can go to the group they created, then tap on the "Invite Members" button and share the link with their friends.',
    },
    {
      title: 'How does Chatpuppy handle spam or inappropriate content?',
      paragraph:
        'As an end-to-end encryption chat app, Chatpuppy cannot access or monitor the contents of user conversations. To address spam or inappropriate content, Chatpuppy uses NFT-based group creation and moderation. Users can create groups with NFTs, which are unique digital assets that act as a proof of ownership and can only be owned by one user at a time. By limiting group creation to users who own specific NFTs, Chatpuppy can help ensure that only legitimate users are creating groups. Additionally, NFTs can be used to create moderation tools that allow group owners to manage their groups and remove users who engage in spam or inappropriate behavior.',
    },
  ];

  return (
    <Box>
      <Container
        as={Stack}
        maxW={'6xl'}
        mt="10"
        py={{ base: '20', sm: '4' }}
        spacing={4}
        justify={'center'}
        align={'center'}>
        <chakra.p
          fontSize={{ base: '3xl', sm: '4xl' }}
          lineHeight="8"
          fontWeight="extrabold"
          letterSpacing="tight"
          color={useColorModeValue('gray.900')}>
          FAQs
        </chakra.p>
        <Accordion w="90%" mx="auto" my="8" allowToggle>
          {data.map((item, key) => (
            <AccordionItem key={key}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {item.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{item.paragraph}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
      <Box align={'center'} justify="center" fontSize={20}>
        <Link
          href={
            'https://mirror.xyz/chatpuppy.eth/WvmZU2qZ3OdrX4bKkTXyeeEpw-NdVusfDEQOggxNYaY'
          }
          target="_blank"
          rel="noopener noreferrer">
          More...
        </Link>
      </Box>
    </Box>
  );
}
