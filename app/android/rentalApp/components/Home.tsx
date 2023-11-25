import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { HStack, Icon, Input } from 'native-base';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

type HomeType = {
  navigate?: any;
};

const HomeScreen: React.FC<HomeType> = ({ navigate }) => {
  const [userLocation, setUserLocation] = useState('Olmazor');
  const token = useSelector((state: any) => state.auth.access);

  // Fetch real estates based on the user's location
  useEffect(() => {
    if (userLocation) {
      const apiUrl = `https://absolute-initially-slug.ngrok-free.app/real-estates/?search=${userLocation}`;

      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data (list of real estates)
          console.log('Real Estates:', data);
        })
        .catch((error) => {
          console.error('Error fetching real estates:', error);
        });
    }
  }, [userLocation, token]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'lightblue',
        }}
      >
        {/* Settings Icon */}
        <Pressable onPress={() => console.log('Settings clicked')}>
          <Icon as={<MaterialIcons name="settings" />} size={8} ml={2} color="orange.500" />
        </Pressable>

        {/* User's Location Input */}
        <Input
          placeholder="Enter location"
          variant="unstyled"
          value={userLocation}
          onChangeText={(text) => setUserLocation(text)}
        />

        {/* User's Profile Picture */}
        <Pressable onPress={() => console.log('User Profile clicked')}>
          <Icon as={<MaterialIcons name="person" />} size={8} ml={2} color="orange.500" />
        </Pressable>
      </View>

      {/* Main Content Section */}
      <ScrollView style={{ flex: 1 }}>
        {/* {realEstates.map((estate, index) => (
          <View key={index}>
            <Text>{estate.name}</Text>
          </View>
        ))} */}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'lightblue', // Set your desired background color
        }}
      >
        {/* Home Tab */}
        <Pressable onPress={() => console.log('Home clicked')}>
          <HStack>
            <Icon as={<MaterialIcons name="home" />} size={8} color="orange.500" />
            <Text>Home</Text>
          </HStack>
        </Pressable>

        {/* Search Tab */}
        <Pressable onPress={() => console.log('Search clicked')}>
          <HStack>
            <Icon as={<MaterialIcons name="search" />} size={8} color="orange.500" />
            <Text>Search</Text>
          </HStack>
        </Pressable>

        {/* Add Tab */}
        <Pressable onPress={() => console.log('Add clicked')}>
          <HStack>
            <Icon as={<MaterialIcons name="add" />} size={8} color="orange.500" />
            <Text>Add</Text>
          </HStack>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
