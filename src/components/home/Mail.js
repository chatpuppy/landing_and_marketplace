import React from "react";
import {
  chakra, Box, Flex, useColorModeValue, SimpleGrid, GridItem, Input, Button,
  VisuallyHidden, Icon, Stack
} from "@chakra-ui/react";
import { useForm, ValidationError } from '@formspree/react';
import { AiOutlineCheckCircle } from "react-icons/ai";
import ReCAPTCHA from "react-google-recaptcha";

export default function Mail() {
  const [state, handleSubmit] = useForm("xzboggld");
  const recaptchaRef = React.createRef();

  // function onChange(value) {
  //   console.log("Captcha value:", value);
  // }

  const Feature = (props) => (
    <Flex alignItems="center" color={useColorModeValue(null, "white")}>
      <Icon
        boxSize={4}
        mr={1}
        color="green.600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </Icon>
      {props.children}
    </Flex>
  );
  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.800")}
      p={{base: "", md: "50"}}
      w="full"
      alignItems="center"
      justifyContent="center"
      id="mail"
    >
      <Flex
        shadow="xl"
        rounded={{base: "", sm: "xl"}}
        justify="center"
        bg="brand.100"
        w="full"
      >
        <Box
          w={{ base: "full", md: "75%", lg: "50%" }}
          px={4}
          py={20}
          textAlign={{ base: "left", md: "center" }}
        >
          <chakra.span
            fontSize={{ base: "3xl", sm: "4xl" }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="shorter"
            color={useColorModeValue("gray.100", "gray.100")}
            mb={6}
          >
            <chakra.span display="block">Want to get new updates?</chakra.span>
            <chakra.span
              display="block"
              color={useColorModeValue("gray.400", "gray.500")}
            >
              Join the mail list today.
            </chakra.span>
          </chakra.span>
          <form 
            style={{width: "full", alignItems: "center", justifyContent: "center"}} 
            onSubmit={handleSubmit}
          >
          <SimpleGrid
            w={{ base: "full", md: 7 / 12 }}
            columns={{ base: 1, lg: 6 }}
            spacing={3}
            pt={1}
            mx="auto"
            mt={4}
          >
          <GridItem as="label" colSpan={{ base: "auto", lg: 6 }}>
            <VisuallyHidden>Your Email</VisuallyHidden>
            <Input
              id="email"
              name="email"
              mt={0}
              size="lg"
              type="email"
              placeholder="Enter your email..."
              required={true}
              color="white"
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
            />
          </GridItem>
          {state.succeeded || state.submitting ? '' : 
          <GridItem>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdJuLAeAAAAAEWb9E4BoUD2g7Jgzc98dPqCWPpx"
              // onChange={onChange}
            />
          </GridItem>
          }
          <GridItem as="label" colSpan={{ base: "auto", lg: 6 }}>
            <Button
              w="full"
              variant="solid"
              colSpan={{ base: "auto", lg: 2 }}
              size="lg"
              type="submit"
              cursor="pointer"
              disabled={state.submitting || state.succeeded}
            >
              {state.succeeded ? 'Thanks for your subscription!' : 'Subscribe'}
            </Button>
          </GridItem>
        </SimpleGrid>
        </form>
        <Stack
          display="flex"
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "start", md: "center" }}
          mt={3}
          spacing={{ base: 2, md: 8 }}
          fontSize="xs"
          color="gray.100"
        >
          <Feature>No Spam</Feature>
          <Feature>Latest Updates</Feature>
          <Feature>Cancel anytime</Feature>
        </Stack>
        </Box>

      </Flex>
    </Flex>
  );
}