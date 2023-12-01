// @ts-nocheck
import React, { useState } from "react";
import {
  ScrollView,
  VStack,
  Input,
  Button,
  Text,
  Center,
  Box,
  Heading,
  Icon,
  Checkbox,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useSelector } from "react-redux";
import { Alert } from "react-native";
import { View } from "native-base";

const AddRealEstateScreen: React.FC = () => {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [rieltorPrice, setRieltorPrice] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [hajmi, setHajmi] = useState({ width: "", height: "", depth: "" });
  const [image1, setImage1] = useState([]);
  const [image2, setImage2] = useState([]);
  const [image3, setImage3] = useState([]);
  const [video, setVideo] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locationError, setLocationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [rieltorPriceError, setRieltorPriceError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [hajmiError, setHajmiError] = useState({
    width: "",
    height: "",
    depth: "",
  });
  const [image1Error, setImage1Error] = useState("");
  const [image2Error, setImage2Error] = useState("");
  const [image3Error, setImage3Error] = useState("");
  const [videoError, setVideoError] = useState("");
  const token = useSelector((state: any) => state.auth.access);

  const navigation = useNavigation<any>();

  const pickImage = async (imageNumber: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      switch (imageNumber) {
        case 1:
          setImage1(result.assets);
          break;
        case 2:
          setImage2(result.assets);
          break;
        case 3:
          setImage3(result.assets);
          break;
        default:
          break;
      }
    }
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        setVideo(result?.assets);
      } else {
        console.log("Video picker canceled");
      }
    } catch (error) {
      console.error("Error picking video:", error);
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    // clearErrors();

    let hasErrors = false;
    // Add validation for required fields
    if (!location) {
      setLocationError("Location is required");
      hasErrors = true;
    }
    if (!price) {
      setPriceError("Price is required");
      hasErrors = true;
    }
    if (!rieltorPrice) {
      setRieltorPriceError("Realtor Price is required");
      hasErrors = true;
    }
    if (!description) {
      setDescriptionError("Description is required");
      hasErrors = true;
    }
    if (!title) {
      setTitleError("Title is required");
      hasErrors = true;
    }
    if (!hajmi.width) {
      setHajmiError((prev) => ({ ...prev, width: "Width is required" }));
      hasErrors = true;
    }
    if (!hajmi.height) {
      setHajmiError((prev) => ({ ...prev, height: "Height is required" }));
      hasErrors = true;
    }
    if (!hajmi.depth) {
      setHajmiError((prev) => ({ ...prev, depth: "Depth is required" }));
      hasErrors = true;
    }
    if (!image1) {
      setImage1Error("Image 1 is required");
      hasErrors = true;
    }
    if (!image2) {
      setImage2Error("Image 2 is required");
      hasErrors = true;
    }
    if (!image3) {
      setImage3Error("Image 3 is required");
      hasErrors = true;
    }

    // Check if any errors occurred
    if (hasErrors) {
      Alert.alert(
        "Error",
        "Please fill in all required fields",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    } else {
      const realEstateData = new FormData();
      realEstateData.append("location", location);
      realEstateData.append("price", price);
      realEstateData.append("rieltor_price", rieltorPrice);
      realEstateData.append("description", description);
      realEstateData.append("title", title);
      realEstateData.append("hajmi", JSON.stringify(hajmi));
      realEstateData.append("image1", {
        type: "image/jpg",
        uri: image1[0]?.uri,
        name: new Date() + "image.jpg",
      });
      realEstateData.append("image2", {
        type: "image/jpg",
        uri: image2[0]?.uri,
        name: new Date() + "image.jpg",
      });
      realEstateData.append("image3", {
        type: "image/jpg",
        uri: image3[0]?.uri,
        name: new Date() + "image.jpg",
      });
      if (video.length > 0) {
        realEstateData.append("video", {
          type: "video/mp4",
          uri: video[0]?.uri,
          name: new Date() + "video.mp4",
        });
      }

      try {
        setIsSubmitting(true);
        // Make the request here
        const response = await fetch(
          "https://absolute-initially-slug.ngrok-free.app/create-real-estate/",
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            body: realEstateData,
          }
        );

        if (!response.ok) {
          console.error("Error submitting real estate:", response);
          Alert.alert("Error", "Failed to add real estate", [{ text: "OK" }], {
            cancelable: false,
          });
        } else {
          // Reset the form on success
          clearForm();
          Alert.alert(
            "Success",
            "Real Estate added successfully",
            [{ text: "OK" }],
            { cancelable: false }
          );
          navigation.navigate("Home");
        }
      } catch (error) {
        Alert.alert(
          "Failed",
          'Cannot Add Real Estate check your "Data" again before sending'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const clearForm = () => {
    setLocation("");
    setPrice("");
    setRieltorPrice("");
    setDescription("");
    setTitle("");
    setHajmi({ width: "", height: "", depth: "" });
    setImage1([]);
    setImage2([]);
    setImage3([]);
    setVideo([]);
  };

  const clearErrors = () => {
    setLocationError("");
    setPriceError("");
    setRieltorPriceError("");
    setDescriptionError("");
    setTitleError("");
    setHajmiError({ width: "", height: "", depth: "" });
    setImage1Error("");
    setImage2Error("");
    setImage3Error("");
    setVideoError("");
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
            Add Real Estate
          </Heading>
          <VStack space={3} mt="5">
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
            />
            {!!locationError && (
              <Text color="red.500" fontSize="sm">
                {locationError}
              </Text>
            )}
            <Input value={price} onChangeText={setPrice} placeholder="Price" />
            {!!priceError && (
              <Text color="red.500" fontSize="sm">
                {priceError}
              </Text>
            )}
            <Input
              value={rieltorPrice}
              onChangeText={setRieltorPrice}
              placeholder="Realtor Price"
            />
            {!!rieltorPriceError && (
              <Text color="red.500" fontSize="sm">
                {rieltorPriceError}
              </Text>
            )}
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
            />
            {!!descriptionError && (
              <Text color="red.500" fontSize="sm">
                {descriptionError}
              </Text>
            )}
            <Input value={title} onChangeText={setTitle} placeholder="Title" />
            {!!titleError && (
              <Text color="red.500" fontSize="sm">
                {titleError}
              </Text>
            )}
            <Input
              value={hajmi.width}
              onChangeText={(text) => setHajmi({ ...hajmi, width: text })}
              placeholder="Width"
            />
            {!!hajmiError.width && (
              <Text color="red.500" fontSize="sm">
                {hajmiError.width}
              </Text>
            )}
            <Input
              value={hajmi.height}
              onChangeText={(text) => setHajmi({ ...hajmi, height: text })}
              placeholder="Height"
            />
            {!!hajmiError.height && (
              <Text color="red.500" fontSize="sm">
                {hajmiError.height}
              </Text>
            )}
            <Input
              value={hajmi.depth}
              onChangeText={(text) => setHajmi({ ...hajmi, depth: text })}
              placeholder="Depth"
            />
            {!!hajmiError.depth && (
              <Text color="red.500" fontSize="sm">
                {hajmiError.depth}
              </Text>
            )}
            <Button mt="2" onPress={() => pickImage(1)}>
              Pick Image 1
            </Button>
            {image1.length != 0 && (
              <Text fontSize="sm" color="green.500">
                Image 1 selected
              </Text>
            )}

            <Button onPress={() => pickImage(2)}>Pick Image 2</Button>
            {image2.length != 0 && (
              <Text fontSize="sm" color="green.500">
                Image 2 selected
              </Text>
            )}

            <Button onPress={() => pickImage(3)}>Pick Image 3</Button>
            {image3.length != 0 && (
              <Text fontSize="sm" color="green.500">
                Image 3 selected
              </Text>
            )}

            {/* Video Picker */}
            <Button onPress={pickVideo}>Pick Video</Button>
            {video.length != 0 && (
              <Text fontSize="sm" color="green.500">
                Video selected
              </Text>
            )}
            <View
              mt={4}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 15,
              }}
            >
              <Button
                // mt="2"
                colorScheme="indigo"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              >
                Add Real Estate
              </Button>
              <Button
                // mt="2"
                colorScheme="red"
                onPress={() => navigation.navigate("Home")}
                // isLoading={isSubmitting}
              >
                Cancel
              </Button>
            </View>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default AddRealEstateScreen;
