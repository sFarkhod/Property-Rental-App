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
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type PasswordReqeustType = {
  navigation?: any;
};

const PasswordResetRequest: React.FC<PasswordReqeustType> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");

  const handlePasswordRequest = async () => {
    try {
      // Check if the email is provided
      if (!email) {
        Alert.alert("Validation Error", "Please enter your email.");
        return;
      }

      const apiUrl =
        "https://absolute-initially-slug.ngrok-free.app/password-reset-request/";

      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      };

      const response = await fetch(apiUrl, requestData);

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 400 && errorData) {
          console.log(errorData)
          // const errors = Object.entries(errorData).map(
          //   // @ts-ignore
          //   ([key, value]) => `${key}: ${value.join(", ")}`
          // );
          Alert.alert("Password Request Failed", errorData[0]);
        } else {
          throw new Error(errorData.detail || "An error occurred");
        }
      }

      const responseData = await response.json();

      navigation.navigate('PasswordResetConfirmation', {email: email});
    } catch (error) {
      // @ts-ignore
      // console.error("Password Reset Request Failed:", error.message);
      // Alert.alert("Password Reset Request Failed", "An unexpected error occurred.");
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
          Password Reset
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
          Write your email to continue
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              value={email}
              onChangeText={setEmail}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="email" />}
                  size={5}
                  ml={2}
                  color="orange.500"
                />
              }
              placeholder="Email"
            />
          </FormControl>

          <Button mt="2" colorScheme="indigo" onPress={handlePasswordRequest}>
            Reset Password
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default PasswordResetRequest;
