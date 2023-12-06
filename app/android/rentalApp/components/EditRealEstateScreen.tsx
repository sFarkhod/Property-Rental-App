// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  VStack,
  Input,
  Button,
  Text,
  Center,
  Box,
  Heading,
  Image,
  HStack,
  Pressable,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import { Alert } from "react-native";
import { FormControl } from "native-base";
import { BASE_URL } from '@env';

const EditRealEstateScreen: React.FC = ({ route }) => {
  const { home } = route.params;
  console.log(home);
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rieltorPrice, setRieltorPrice] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [hajmi, setHajmi] = useState();

  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [video1, setVideo1] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useSelector((state: any) => state.auth.access);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchRealEstateData = async () => {
      try {
        const apiUrl = `${BASE_URL}real-estate/${home}/`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLocation(data.location);
          setPrice(data.price);
          setRieltorPrice(data?.rieltor_price);
          setDescription(data?.description);
          setTitle(data.title);
          setHajmi(data.hajmi);
          setImage(
            `${BASE_URL}${data.image1}`
          );
          setImage2(
            `${BASE_URL}${data.image2}`
          );
          setImage3(
            `${BASE_URL}${data.image3}`
          );
          if (data.video) {
            setVideo1(
              `${BASE_URL}${data?.video}`
            );
          }
          // console.log(
          //   `https://absolute-initially-slug.ngrok-free.app${data.video}`
          // );
        } else {
          console.error(
            "Error fetching real estate data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetch real estate data:", error);
      }
    };

    fetchRealEstateData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result?.assets?.uri);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (!result.cancelled) {
        setVideo(result?.assets?.uri);
      }
    } catch (error) {
      console.error("Error picking video:", error);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    formData.append("location", location);
    formData.append("price", price);
    formData.append("rieltorPrice", rieltorPrice);
    formData.append("description", description);
    formData.append("title", title);
    formData.append("hajmi", JSON.stringify(hajmi));

    formData.append("image1", {
      type: "image/jpg",
      uri: image,
      name: new Date() + "image.jpg",
    });
    formData.append("image2", {
      type: "image/jpg",
      uri: image2,
      name: new Date() + "image.jpg",
    });
    formData.append("image3", {
      type: "image/jpg",
      uri: image3,
      name: new Date() + "image.jpg",
    });
    if (video1) {
      formData.append("video", {
        type: "video/mp4",
        uri: video1,
        name: new Date() + "video.mp4",
      });
    }

    try {
      setIsSubmitting(true);
      const updateResponse = await fetch(
        `${BASE_URL}real-estates/${home}/update/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!updateResponse.ok) {
        console.error("Error updating real estate:", updateResponse);
        Alert.alert("Error", "Failed to update real estate", [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("Success", "Real Estate updated successfully", [
          { text: "OK" },
        ]);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error during update:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="coolGray.800" fontWeight="semibold">
            Edit Real Estate
          </Heading>
          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Location:
              </FormControl.Label>
              <Input
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Price:
              </FormControl.Label>
              <Input
                value={price}
                onChangeText={setPrice}
                placeholder="Price"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Realtor Price:
              </FormControl.Label>
              <Input
                value={rieltorPrice}
                onChangeText={setRieltorPrice}
                placeholder="Realtor Price"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Description:
              </FormControl.Label>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Title:
              </FormControl.Label>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Width:
              </FormControl.Label>
              <Input
                value={hajmi?.width}
                onChangeText={(text) => setHajmi({ ...hajmi, width: text })}
                placeholder="Width"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Height:
              </FormControl.Label>
              <Input
                value={hajmi?.height}
                onChangeText={(text) => setHajmi({ ...hajmi, height: text })}
                placeholder="Height"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Depth:
              </FormControl.Label>
              <Input
                value={hajmi?.depth}
                onChangeText={(text) => setHajmi({ ...hajmi, depth: text })}
                placeholder="Depth"
              />
            </FormControl>

            {/* Image Picker */}
            <Pressable onPress={pickImage}>
              <Button>Pick First Image</Button>
            </Pressable>
            {image && (
              <Box>
                <Text>First Image Preview:</Text>
                <Image source={{ uri: image }} alt="Preview" size="xl" />
              </Box>
            )}

            <Pressable onPress={pickImage}>
              <Button>Pick Second Image</Button>
            </Pressable>
            {image2 && (
              <Box>
                <Text>Second Image Preview:</Text>
                <Image source={{ uri: image2 }} alt="Preview" size="xl" />
              </Box>
            )}

            <Pressable onPress={pickImage}>
              <Button>Pick Third Image</Button>
            </Pressable>
            {image3 && (
              <Box>
                <Text>Third Image Preview:</Text>
                <Image source={{ uri: image3 }} alt="Preview" size="xl" />
              </Box>
            )}

            {/* Video Picker */}
            <Pressable onPress={pickVideo}>
              <Button>Pick Video</Button>
            </Pressable>
            {video1 ? (
              <Box key={video1}>
                <Text>Video Preview:</Text>
                <Video
                  key={video1}
                  source={{ uri: video1 }}
                  shouldPlay
                  resizeMode="cover"
                  isLooping
                  style={{ height: 200 }}
                />
              </Box>
            ) : (
              <Text>No video available</Text>
            )}

            {/* ... other input fields */}
            <Button onPress={handleUpdate} isLoading={isSubmitting}>
              Update Real Estate
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default EditRealEstateScreen;
