import React, { useState } from "react";
import {
  FormControl,
  Input,
  Button,
  Text,
  Center,
  Box,
  Heading,
  VStack,
  Link,
  HStack,
  Pressable,
  Icon,
} from "native-base";
import { Alert } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { loginUser, LoginResult } from '../services/api';
import { useDispatch } from 'react-redux';
import { setIsRealtor, setToken } from '../src/redux/actions/authActions'; 

type LoginType = {
  navigation?: any;
};

const LoginScreen: React.FC<LoginType> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result: LoginResult = await loginUser({ username, password });

      if (result.success) {
        // console.log(result.tokens)
        // @ts-ignore
        dispatch(setToken(result?.tokens));
        // @ts-ignore
        dispatch(setIsRealtor(result?.is_realtor));
        navigation.navigate("Home", { token: result.tokens });
      } else {
        // Handle login failure
        Alert.alert(
          "Login Failed",
          result.errorMessage || "An error occurred during login."
        );
      }
    } catch (error) {
      // @ts-ignore
      console.error("Login failed:", error.message);
      Alert.alert("Login Failed", "An unexpected error occurred.");
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Welcome to RentLY
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              value={username}
              onChangeText={setUsername}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml={2}
                  color="orange.500"
                />
              }
              placeholder="Username"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              value={password}
              onChangeText={setPassword}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="lock" />}
                  size={5}
                  ml={2}
                  color="orange.500"
                />
              }
              placeholder="Password"
            />
            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Forget Password?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              I'm a new user.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              // href="#"
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginScreen;
