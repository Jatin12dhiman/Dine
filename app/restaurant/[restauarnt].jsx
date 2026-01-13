import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';


export default function Restaurant() {
    const { restauarnt } = useLocalSearchParams();
    const flatListRef = useRef()
    const windowWidth = Dimensions.get("window").width;
    const [restaurantData, setRestaurantData] = useState({})
    const [carouselData, setCarouselData] = useState({})
    const [slotsData, setSlotsData] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleNextImage = () => {
        const carouselLength = carouselData[0]?.images.length;
        if (currentIndex < carouselLength - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true })
        }
        if (currentIndex == carouselLength - 1) {
            const nextIndex = 0;
            setCurrentIndex(nextIndex)
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true })
        }
    }

    const handlePrevImage = () => {
        const carouselLength = carouselData[0]?.images.length;
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true })
        }
        if (currentIndex == 0) {
            const prevIndex = carouselLength - 1;
            setCurrentIndex(prevIndex)
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true })
        }
    }

    const carouselItem = ({ item }) => {
        return (
            <View style={{ width: windowWidth - 2 }} className="h-64 relative ">
                <View
                    style={{
                        position: "absolute", top: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 50,
                        padding: 5,
                        zIndex: 10,
                        right: "6%"
                    }}>
                    <Ionicons onPress={handleNextImage} name="arrow-forward" size={24} color="white" />
                </View>
                <View
                    style={{
                        position: "absolute", top: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 50,
                        padding: 5,
                        zIndex: 10,
                        left: "6%"
                    }}>
                    <Ionicons onPress={handlePrevImage} name="arrow-back" size={24} color="white" />
                </View>
                <View>
                    <Image source={{ uri: item }}
                        style={{
                            top: "5%",
                            opacity: 0.5, backgroundColor: "black",
                            marginRight: 15,
                            marginLeft: 15,
                            borderRadius: 25,
                        }}
                        className="h-64" />
                </View>
            </View>
        )
    }

    const getRestaurantData = async () => {
        try {
            const restaurantQuery = query(collection(db, "restaurants"), where("name", "==", restauarnt))
            const restaurantSnapshot = await getDocs(restaurantQuery)

            if (restaurantSnapshot.empty) {
                console.log("No matching restaurant found")
                return;
            }
            for (const doc of restaurantSnapshot.docs) {
                const restaurantData = doc.data();
                setRestaurantData(restaurantData)

                const carouselQuery = query(collection(db, "carousel"), where("res_id", "==", doc.ref)
                );
                const carouselSnapshot = await getDocs(carouselQuery);
                const carouselImages = [];

                if (carouselSnapshot.empty) {
                    console.log("No matching carousel found")
                    return;
                }

                carouselSnapshot.forEach((carouselDoc) => {
                    carouselImages.push(carouselDoc.data())
                })
                setCarouselData(carouselImages)

                const slotsQuery = query(collection(db, "slots"), where("ref_id", "==", doc.ref)
                );
                const slotsSnapshot = await getDocs(slotsQuery);
                const slots = [];

                if (slotsSnapshot.empty) {
                    console.log("No matching slots found")
                    return;
                }
                slotsSnapshot.forEach((slotDoc) => {
                    slots.push(slotDoc.data())
                })
                setSlotsData(slots)

            }
        } catch (error) {
            console.log("Error fetching restaurant data: ", error)
        }
    }
    useEffect(() => {
        getRestaurantData()
    }, [])

    return (
        <SafeAreaView style={[{ backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 10 },
        Platform.OS == "ios" && { paddingBottom: 20 },
        ]}>
            <ScrollView className="h-full">
                <View className="flex">
                    <Text className="text-xl text-[#f49b33] mr-2 mt-[12px] font-semibold">{restauarnt}</Text>

                    <View className="border-b border-[#f49b33] "></View>
                </View>
                <View className="h-64 max-w-[98%] rounded-[25px]">
                    <FlatList
                        ref={flatListRef}
                        data={carouselData[0]?.images}
                        renderItem={carouselItem}
                        horizontal
                        scrollEnabled={false}

                        showsHorizontalScrollIndicator={false}
                        style={{ borderRadius: 25 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
