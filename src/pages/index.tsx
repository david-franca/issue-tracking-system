import { Button, Flex, Heading, Input } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { MouseEvent } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  
  const handleLogin = (e: MouseEvent) => {
    e.preventDefault();
    router.push("/issues");
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      background="gray.500"
    >
      <Flex direction="column" background="gray.300" p={12} rounded={6}>
        <Heading mb={6}>Entrar</Heading>
        <Input
          placeholder="email@dominio.com"
          variant="filled"
          mb={3}
          type="email"
        />
        <Input placeholder="********" variant="filled" mb={6} type="password" />
        <Button colorScheme="teal" onClick={handleLogin}>
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
