// @ts-nocheck
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
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Menu } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '@env';

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
  const [realtorId, setRealtorId] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  // for likes
  const [likedRealEstates, setLikedRealEstates] = useState<any>([]);
  const [likedOrNot, setLikedOrNot] = useState('false')
  const [likesCount, setLikesCount] = useState<number>(0);

  

  const navigation = useNavigation<any>();

  const fetchAddedHomes = async () => {
    try {
      const apiUrl =
        `${BASE_URL}real-estates-for-realtor/`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRealEstates(data);
        setLoading(false);
        // console.log(data?.liked_users)
        // setLikesCount(data?.liked_users)
        // console.log("Real Estates for Realtor:", data);
      } else {
        setLoading(false);
        console.error("Error fetching real estates for realtor");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during fetching real estates for realtor:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        // Fetch real estates based on the user's location
        if (userLocation) {
          setLoading(true);

          if (selectedTab === "myHomes") {
            // Fetch added homes for realtor
            await fetchAddedHomes();
          } else {
            // Fetch general real estates
            const apiUrl = `${BASE_URL}real-estates/?location=${userLocation}&search=${searchQuery}&liked_homes=${likedOrNot}`;

            try {
              const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.ok) {
                const data = await response.json();
                setRealEstates(data);
                setLoading(false);
                console.log("Real Estates:", data);
              } else {
                setLoading(false);
                console.error(
                  "Error fetching real estates:",
                  response.statusText
                );
              }
            } catch (error) {
              setLoading(false);
              console.error("Error during fetching real estates:", error);
            }
          }
        }
      };

      fetchData();
    }, [userLocation, token, searchQuery, selectedTab, realtorId, likedOrNot])
  );

  useEffect(() => {
    const retrieveLikedRealEstates = async () => {
      try {
        const storedLikedRealEstates = await AsyncStorage.getItem(
          "likedRealEstates"
        );
        if (storedLikedRealEstates) {
          setLikedRealEstates(JSON.parse(storedLikedRealEstates));
        }
      } catch (error) {
        console.error(
          "Error retrieving likedRealEstates from AsyncStorage:",
          error
        );
      }
    };

    retrieveLikedRealEstates();
  }, []);

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

  const handleLikeToggle = async (realEstateId: any) => {
    try {
      const response = await fetch(
        `${BASE_URL}real-estate/${realEstateId}/like/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Update the likedRealEstates state based on the response
        setLikedRealEstates((prevLiked: any) =>
          prevLiked.includes(realEstateId)
            ? prevLiked.filter((id: any) => id !== realEstateId)
            : [...prevLiked, realEstateId]
        );

        AsyncStorage.setItem(
          "likedRealEstates",
          JSON.stringify(
            likedRealEstates.includes(realEstateId)
              ? likedRealEstates.filter((id: any) => id !== realEstateId)
              : [...likedRealEstates, realEstateId]
          )
        );
      } else {
        console.error("Failed to toggle like status");
      }
    } catch (error) {
      console.error("Error during like toggle:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const apiUrl = `${BASE_URL}/logout/`;

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

  const renderRealtorTabs = () => {
    if (isRealtor) {
      return (
        <>
          {/* Add Tab */}
          <Pressable
            onPress={() => {
              handleAddPress();
              handleTabPress("home");
            }}
          >
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

          {/* Added Homes Tab */}
          <Pressable
            onPress={() => {
              handleTabPress("myHomes");
            }}
          >
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
                color={selectedTab === "myHomes" ? "#2d68f6" : "#6d6c6f"}
              />
              <Text color={selectedTab === "myHomes" ? "#2d68f6" : "#6d6c6f"}>
                My Home's
              </Text>
            </HStack>
          </Pressable>
        </>
      );
    } else {
      return (
        <>
          <Pressable onPress={() => {
              handleTabPress("likedHomes");
              setLikedOrNot('true')
            }}>
            <HStack
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Icon
                as={<MaterialIcons name="favorite" />}
                size={5}
                color={selectedTab === "likedHomes" ? "#2d68f6" : "#6d6c6f"}
              />
              <Text
                color={selectedTab === "likedHomes" ? "#2d68f6" : "#6d6c6f"}
              >
                Liked Homes
              </Text>
            </HStack>
          </Pressable>
        </>
      );
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
          <Menu.Item onPress={() => navigation.navigate("Profile")}>
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
              onPress={() =>
                navigation.navigate("RealEstateDetail", { estate })
              }
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
                    uri: `${BASE_URL}media/images/${getImagePath(
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
                <TouchableOpacity
                  style={{ display: "flex" }}
                  onPress={() => handleLikeToggle(estate.id)}
                >
                  <Icon
                    as={
                      <MaterialIcons
                        name={
                          // @ts-ignore
                          likedRealEstates.includes(estate.id)
                            ? "favorite"
                            : "favorite-border"
                        }
                      />
                    }
                    size={18}
                    color={
                      // @ts-ignore
                      likedRealEstates.includes(estate.id)
                        ? "danger.600"
                        : "black"
                    }
                  />
                  <Text style={{marginLeft: 4}}>{estate?.liked_users?.length || 0}</Text>
                </TouchableOpacity>
                {selectedTab === "myHomes" && (
                  <HStack
                    position="absolute"
                    bottom={4}
                    right={4}
                    space={2}
                    alignItems="center"
                  >
                    <Pressable>
                      <Button
                        onPress={() => {
                          navigation.navigate("EditRealEstateScreen", {
                            home: estate.id,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </Pressable>
                    <Pressable>
                      <Button
                        style={{ backgroundColor: "red" }}
                        onPress={async () => {
                          try {
                            const deleteUrl = `${BASE_URL}real-estates/${estate?.id}/delete/`;

                            const deleteResponse = await fetch(deleteUrl, {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                            });

                            if (deleteResponse.ok) {
                              Alert.alert(
                                "Success",
                                "Real Estate Deleted Successfully"
                              );
                              await fetchAddedHomes();
                            } else {
                              console.error(
                                "Error deleting real estate:",
                                deleteResponse.statusText
                              );
                            }
                          } catch (error) {
                            console.error("Error during delete:", error);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Pressable>
                  </HStack>
                )}
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
        <Pressable onPress={() => {
            handleTabPress("home");
            setLikedOrNot('false');
          }}>
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
        {renderRealtorTabs()}
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
