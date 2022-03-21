import { Flex, Box, SkeletonCircle, SkeletonText, useColorModeValue } from '@chakra-ui/react';

export const skeleton = (key) => 
<Flex w="full" p={5} key={key}>
	<Box 
		w="md" 
		pl={10} 
		pr={10} pt={20} pd={20} 
		h="lg" 
		maxW="md" 
		max="auto" 
		shadow="lg" 
		rounded="lg" 
		// bg={useColorModeValue("gray.100", "gray.800")}
	>
		<SkeletonCircle size="100"/><SkeletonText mt='6' noOfLines={6} spacing='4'/>
	</Box>
</Flex>;

