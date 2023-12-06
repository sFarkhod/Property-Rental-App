// @ts-nocheck
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
import { PinInput } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@env";

type PasswordReqeustType = {
  route?: any;
};

const PasswordResetConfirmation: React.FC<PasswordReqeustType> = ({
  route,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation<any>();
  const { email } = route.params;

  const handlePasswordRequest = async () => {
    if (!verificationCode || !newPassword) {
      Alert.alert(
        "Validation Error",
        "Please enter verification code and new password."
      );
      return;
    }

    try {
      const apiUrl = `${BASE_URL}password-reset-confirm/`;
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          verification_code: verificationCode,
          new_password: newPassword,
        }),
      };

      const response = await fetch(apiUrl, requestData);

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 400 && errorData) {
          console.log(errorData);
          const errors = Object.entries(errorData).map(
            // @ts-ignore
            ([key, value]) => `${key}: ${value.join(", ")}`
          );
          Alert.alert("Resetting Password Failed", errors.join("\n"));
        } else {
          throw new Error(errorData.detail || "An error occurred");
        }
      }

      const responseData = await response.json();

      navigation.navigate("Login");
    } catch (error) {
      // @ts-ignore
      // console.error("Resetting Password Failed:", error.message);
      // Alert.alert(
      //   "Resetting Password Failed",
      //   "An unexpected error occurred."
      // );
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
          Password Confirmation
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
          Write a code that send to your email and your new password
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>OTP: </FormControl.Label>
            <PinInput
              value={verificationCode}
              onChange={(value: any) => setVerificationCode(value)}
            >
              <PinInput.Field />
              <PinInput.Field />
              <PinInput.Field />
              <PinInput.Field />
              <PinInput.Field />
            </PinInput>
          </FormControl>
          <FormControl>
            <FormControl.Label>New Password: </FormControl.Label>
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="lock" />}
                  size={5}
                  ml={2}
                  color="orange.500"
                />
              }
              placeholder="New Password"
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

export default PasswordResetConfirmation;
