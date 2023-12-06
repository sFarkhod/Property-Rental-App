// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { View, Image, Pressable, ActivityIndicator } from "react-native";
import ImageView from "react-native-image-viewing";
// import { VStack } from "native-base";
import {
  Center,
  HStack,
  Heading,
  Icon,
  Input,
  Stack,
  VStack,
  Skeleton,
  Modal,
  Button,
  Popover,
  ScrollView,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { usePlaybackStatus } from "expo-av";
import { BASE_URL } from '@env';

const ImageIndicator = ({ totalImages, currentIndex }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
      }}
    >
      {Array.from({ length: totalImages }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
            backgroundColor: index === currentIndex ? "blue" : "gray",
          }}
        />
      ))}
    </View>
  );
};

const RealEstateDetail = ({ route }) => {
  const { estate } = route.params;
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      uri: `${BASE_URL}media/images/${getImagePath(
        estate.image1
      )}`,
    },
    {
      uri: `${BASE_URL}media/images/${getImagePath(
        estate.image2
      )}`,
    },
    {
      uri: `${BASE_URL}media/images/${getImagePath(
        estate.image3
      )}`,
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: "#f2f7ff" }}>
      <VStack mt={30} mr={5} ml={5}>
        {/* Display details, including the large image */}
        <Pressable onPress={() => setImageViewVisible(true)}>
          <Image
            source={{ uri: images[0].uri }}
            resizeMode="cover"
            height={300}
          />
        </Pressable>

        {/* Swipeable Image Viewer */}
        <ImageView
          images={images}
          imageIndex={currentIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
          onIndexChange={(index) => setCurrentIndex(index)}
          animationType="fade"
        />
        <ImageIndicator
          totalImages={images.length}
          currentIndex={currentIndex}
        />
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
              {estate.description}
            </Text>
          </Stack>
          <Text fontWeight="400">Price: {estate.price} $</Text>
          <Text fontWeight="400" color={"danger.400"}>
            Realtor Price: {estate.rieltor_price} $
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
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
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Icon
                as={<MaterialIcons name="home" />}
                size={5}
                color="orange.500"
              />
              <Text
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
                fontWeight="400"
                fontSize="xs"
                ml={2}
              >
                {"Height: " +
                  estate?.hajmi?.height +
                  "   " +
                  "Width: " +
                  estate?.hajmi?.width +
                  "   " +
                  "Depth:  " +
                  estate?.hajmi?.depth}
              </Text>
              {/* hajmi, location, rieltor_price, video */}
            </HStack>
          </HStack>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Icon
                as={<MaterialIcons name="location-on" />}
                size={5}
                color="orange.500"
              />
              <Text
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
                fontWeight="400"
                fontSize="xs"
                ml={2}
              >
                {"Location: " + estate.location}
              </Text>
            </HStack>
          </HStack>
          {estate.video ? <VideoComponent uri={estate.video} /> : <></>}
        </Stack>
      </VStack>
    </ScrollView>
  );
};

const VideoComponent = ({ uri }) => {
  const videoRef = useRef(null);
  const [isVideoLoading, setVideoLoading] = useState(true);

  const onLoad = (status) => {
    console.log("testvideoloaded");
    setVideoLoading(false);
  };

  const onError = (error) => {
    console.error("Error loading video:", error);
    setVideoLoading(false);
  };

  return (
    <View>
      {isVideoLoading && (
        <ActivityIndicator size="large" color="blue" mt={15} />
      )}
      <Video
        ref={videoRef}
        style={{ width: 300, height: 200 }}
        source={{ uri: uri }}
        useNativeControls={isVideoLoading ? false : true}
        resizeMode="contain"
        shouldPlay={true}
        isLooping
        onReadyForDisplay={onLoad}
        onError={onError}
      />
    </View>
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

export default RealEstateDetail;
