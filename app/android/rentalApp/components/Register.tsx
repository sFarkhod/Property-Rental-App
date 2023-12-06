// @ts-nocheck
import React, { useState } from "react";
import {
  Container,
  FormControl,
  Input,
  Button,
  Text,
  Center,
  Box,
  Heading,
  VStack,
  Icon,
  Pressable,
  Checkbox,
  ScrollView,
  Divider,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { registerUser } from "../services/api";
import Toast from "react-native-toast-message";

type RegisterType = {
  navigation?: any;
};

const RegisterScreen: React.FC<RegisterType> = ({ navigation }) => {
  const [show, setShow] = React.useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isRealtor, setIsRealtor] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [goToLogin, setGoToLogin] = useState(false)

  const handleRegister = async () => {
    if (!username) {
      setUsernameError("Username is required");
      return;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError("Email is required");
      return;
    } else {
      setEmailError("");
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required");
      return;
    } else {
      setPhoneNumberError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const userData = {
        username,
        email,
        password,
        phone_number: phoneNumber,
        is_realtor: isRealtor,
      };
      const registrationSuccessful = await registerUser(userData);

      if (registrationSuccessful) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Registration Successful',
        });
  
        navigation.navigate('Login');
      }
    } catch (error) {
      const errorMessage =
      // @ts-ignore
        error.response?.data.detail || "An error occurred during registration";
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Registration Failed",
        text2: errorMessage,
      });
    }
  };

  return (
    <ScrollView>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading
            size="lg"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
            fontWeight="semibold"
          >
            Welcome to RentLY
          </Heading>
          <Heading
            mt="1"
            color="coolGray.600"
            _dark={{
              color: "warmGray.200",
            }}
            fontWeight="medium"
            size="xs"
          >
            Sign up to continue!
          </Heading>
          <VStack space={3} mt="5">
            <FormControl isInvalid={!!usernameError}>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                value={username}
                onChangeText={setUsername}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="person" />}
                    name="person"
                    size={5}
                    ml={2}
                    color="orange.500"
                  />
                }
                placeholder="Username"
              />
              <FormControl.ErrorMessage>
                {!!usernameError && (
                  <Text color="red.500" fontSize="sm">
                    {usernameError}
                  </Text>
                )}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!emailError}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                value={email}
                onChangeText={setEmail}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="email" />}
                    name="person"
                    size={5}
                    ml={2}
                    color="orange.500"
                  />
                }
                placeholder="Email"
              />
              <FormControl.ErrorMessage>
                {!!emailError && (
                  <Text color="red.500" fontSize="sm">
                    {emailError}
                  </Text>
                )}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!phoneNumberError}>
              <FormControl.Label>Phone Number</FormControl.Label>
              <Input
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="phone" />}
                    name="person"
                    size={5}
                    ml={2}
                    color="orange.500"
                  />
                }
                placeholder="Phone number"
              />
              <FormControl.ErrorMessage>
                {!!phoneNumberError && (
                  <Text color="red.500" fontSize="sm">
                    {phoneNumberError}
                  </Text>
                )}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!passwordError}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type={show ? "text" : "password"}
                value={password}
                onChangeText={setPassword}
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                      mr="2"
                      color="orange.500"
                    />
                  </Pressable>
                }
                placeholder="Password"
              />
              <FormControl.ErrorMessage>
                {!!passwordError && (
                  <Text color="red.500" fontSize="sm">
                    {passwordError}
                  </Text>
                )}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl.Label>User Type</FormControl.Label>
            <Checkbox
              isChecked={isRealtor}
              onChange={() => setIsRealtor(!isRealtor)}
              value="realtor"
            >
              I am a Realtor
            </Checkbox>
            <Button mt="2" colorScheme="indigo" onPress={handleRegister}>
              Sign up
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default RegisterScreen;
