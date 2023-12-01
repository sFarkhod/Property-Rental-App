import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Center,
  HStack,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
  Image,
  VStack,
  Skeleton,
  Modal,
  Button,
  Popover,
} from "native-base";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Menu } from "native-base";

type HomeType = {
  navigate?: any;
};

const HomeScreen: React.FC<HomeType> = ({ navigate }) => {
  const token = useSelector((state: any) => state.auth.access);
  const isRealtor = useSelector((state: any) => state.auth.isRealtor);
  const [userLocation, setUserLocation] = useState("Olmazor");
  const [realEstates, setRealEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("home");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const navigation = useNavigation<any>();

  console.log(isRealtor);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch real estates based on the user's location
      if (userLocation) {
        const apiUrl = `https://absolute-initially-slug.ngrok-free.app/real-estates/?location=${userLocation}&search=${searchQuery}`;

        fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setRealEstates(data);
            setLoading(false);
            console.log("Real Estates:", data);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error fetching real estates:", error);
          })
          .finally(() => {
            setSubmitted(false);
          });
      }
    }, [userLocation, token, submitted])
  );

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleSearchPress = () => {
    setSelectedTab("search");
    setShowSearchModal(true);
  };

  const handleSearchSubmit = () => {
    console.log("Search submitted with query:", searchQuery);
    setSubmitted(true);
    // Close the modal
    setShowSearchModal(false);
  };

  const handleAddPress = () => {
    navigation.navigate("AddRealEstate");
  };

  const handleLogout = async () => {
    try {
      const apiUrl = "https://absolute-initially-slug.ngrok-free.app/logout/";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Logout successful, redirect to login
        navigation.navigate("Login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // padding: 14,
          paddingTop: 10,
          paddingEnd: 14,
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: "#f2f7ff",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {/* Settings Icon */}
        <Pressable onPress={() => console.log("Settings clicked")}>
          <VStack
            ml={2}
            mt={4}
            style={{
              backgroundColor: "#fcafc5", // or "#9bdbf9"
              borderRadius: 50,
              padding: 5,
            }}
          >
            <Icon
              as={<MaterialIcons name="settings" />}
              size={5}
              color="white"
            />
          </VStack>
        </Pressable>

        {/* User's Location Input */}
        <Input
          mt={4}
          width={"20%"}
          placeholder="Enter location"
          variant="unstyled"
          value={userLocation}
          onChangeText={(text) => setUserLocation(text)}
        />

        {/* User's Profile Picture */}
        <Menu
          isOpen={clearOpen}
          onClose={() => setClearOpen(!clearOpen)}
          placement="bottom"
          mr={2}
          mt={1}
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
                onPress={() => setClearOpen(true)}
              >
                <VStack
                  ml={2}
                  mt={4}
                  style={{
                    backgroundColor: "#9bdbf9",
                    borderRadius: 50,
                    padding: 5,
                  }}
                >
                  <Icon
                    as={<MaterialIcons name="person" />}
                    size={5}
                    color="white"
                  />
                </VStack>
              </Pressable>
            );
          }}
        >
          <Menu.Item  onPress={() => navigation.navigate("Profile")}>
            Profile
          </Menu.Item>
          <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
        </Menu>
        {/* <Pressable onPress={() => navigation.navigate("Profile")}>
          <VStack
            ml={2}
            mt={4}
            style={{
              backgroundColor: "#9bdbf9",
              borderRadius: 50,
              padding: 5,
            }}
          >
            <Icon as={<MaterialIcons name="person" />} size={5} color="white" />
          </VStack>
        </Pressable> */}
      </View>

      {/* Main Content Section */}
      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <Center w="100%" style={{ marginTop: 16 }}>
            <VStack
              w="90%"
              maxW="400"
              borderWidth="1"
              space={8}
              overflow="hidden"
              rounded="md"
              _dark={{
                borderColor: "coolGray.500",
              }}
              _light={{
                borderColor: "coolGray.200",
              }}
            >
              <Skeleton height={40} />
              <Skeleton.Text px={4} />
              <Skeleton px={4} my={4} rounded="md" startColor="primary.100" />
            </VStack>
          </Center>
        ) : realEstates.length === 0 ? (
          <Center w="100%" style={{ marginTop: 16 }}>
            <Text>No results found</Text>
          </Center>
        ) : (
          realEstates?.map((estate: any, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate("RealEstateDetail", { estate })}
              style={{
                margin: 16,
                borderRadius: 8,
                overflow: "hidden",
                borderColor: "coolGray.200",
                borderWidth: 1,
                backgroundColor: "gray.50",
                // position: 'relative',
              }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={{
                    uri: `https://absolute-initially-slug.ngrok-free.app/media/images/${getImagePath(
                      estate.image1
                    )}`,
                  }}
                  alt="Real Estate Image"
                  resizeMode="cover"
                  height={200}
                />
                <Center
                  bg="violet.500"
                  _dark={{
                    bg: "violet.400",
                  }}
                  _text={{
                    color: "warmGray.50",
                    fontWeight: "700",
                    fontSize: "xs",
                  }}
                  position="absolute"
                  left={0}
                  bottom={0}
                  px={3}
                  py={1.5}
                >
                  TOP
                </Center>
              </View>
              <Stack p={4} space={3}>
                <Stack space={2}>
                  <Heading size="md" ml={-1}>
                    {estate.title}
                  </Heading>
                  <Text
                    fontSize="xs"
                    _light={{ color: "violet.500" }}
                    _dark={{ color: "violet.400" }}
                    fontWeight="500"
                    ml={-0.5}
                    mt={-1}
                  >
                    {truncateText(estate.description, 100)}
                  </Text>
                </Stack>
                <Text fontWeight="400">Price: {estate.price} $</Text>
                <HStack
                  alignItems="center"
                  space={4}
                  justifyContent="space-between"
                >
                  <HStack alignItems="center">
                    <Text
                      color="coolGray.600"
                      _dark={{ color: "warmGray.200" }}
                      fontWeight="400"
                      fontSize="xs"
                    >
                      {formatDate(estate.created_at)}
                    </Text>
                  </HStack>
                </HStack>
              </Stack>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          // padding: 16,
          paddingLeft: 14,
          paddingRight: 14,
          paddingBottom: 10,
          paddingTop: 14,
          backgroundColor: "#f2f7ff",
        }}
      >
        {/* for selected tab #2d68f6 */}
        {/* Home Tab */}
        <Pressable onPress={() => handleTabPress("home")}>
          <HStack
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Icon
              as={<MaterialIcons name="home" />}
              size={5}
              color={selectedTab === "home" ? "#2d68f6" : "#6d6c6f"}
            />
            <Text color={selectedTab === "home" ? "#2d68f6" : "#6d6c6f"}>
              Home
            </Text>
          </HStack>
        </Pressable>

        {/* Search Tab */}
        <Pressable onPress={handleSearchPress}>
          <HStack
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Icon
              as={<MaterialIcons name="search" />}
              size={5}
              color={selectedTab === "search" ? "#2d68f6" : "#6d6c6f"}
            />
            <Text color={selectedTab === "search" ? "#2d68f6" : "#6d6c6f"}>
              Search
            </Text>
          </HStack>
        </Pressable>

        {/* Add Tab */}
        {isRealtor ? (
          <Pressable onPress={() => handleAddPress()}>
            <HStack
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Icon
                as={<MaterialIcons name="add" />}
                size={5}
                color={selectedTab === "add" ? "#2d68f6" : "#6d6c6f"}
              />
              <Text color={selectedTab === "add" ? "#2d68f6" : "#6d6c6f"}>
                Add
              </Text>
            </HStack>
          </Pressable>
        ) : (
          <></>
        )}
      </View>

      {/* Search Modal */}
      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)}>
        <Modal.Content>
          <Modal.Header>Search</Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Enter search query"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button onPress={handleSearchSubmit}>Submit</Button>
              <Button
                colorScheme="secondary"
                onPress={() => setShowSearchModal(false)}
              >
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
};

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear() % 100;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getImagePath = (fullImagePath: string): string => {
  const imagePath = fullImagePath.split("images/")[1];
  return imagePath;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
};

export default HomeScreen;
