import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, Input, Button } from "native-base";

const UserProfileScreen: React.FC = () => {
  const token = useSelector((state: any) => state.auth.access);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone_number: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data based on the token
    fetch("https://absolute-initially-slug.ngrok-free.app/get_user_data/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Perform API request to update user data
    fetch("https://absolute-initially-slug.ngrok-free.app/update-user/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data updated successfully:", data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  return (
    <View mt={16}>
      <Text textAlign={'center'} fontSize="xl" fontWeight="bold" mb={4}>
        User Profile
      </Text>
      <View mb={4} ml={5} mr={5}>
        <Text mb={1}>Username:</Text>
        <Input
          value={userData.username}
          isReadOnly={!isEditing}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
        />
      </View>
      <View mb={4} ml={5} mr={5}>
        <Text mb={1}>Email:</Text>
        <Input
          value={userData.email}
          isReadOnly={!isEditing}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
        />
      </View>
      <View mb={4} ml={5} mr={5}>
        <Text mb={1}>Phone Number:</Text>
        <Input
          value={userData.phone_number}
          isReadOnly={!isEditing}
          onChangeText={(text) => setUserData({ ...userData, phone_number: text })}
        />
      </View>
      {isEditing ? (
        <Button ml={5} mr={5} onPress={handleSave}>Save</Button>
      ) : (
        <Button ml={5} mr={5} onPress={handleEditToggle}>Edit</Button>
      )}
    </View>
  );
};

export default UserProfileScreen;
