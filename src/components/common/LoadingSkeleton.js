import { Flex, Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

export const skeleton = <Flex w="full" p={5}>
<Box w="md" pl={10} pr={10} pt={20} pd={20} h="lg" maxW="md" max="auto" shadow="lg" rounded="lg" bg="gray.50">
<SkeletonCircle size="100"/><SkeletonText mt='6' noOfLines={6} spacing='4'/>
</Box>
</Flex>;

