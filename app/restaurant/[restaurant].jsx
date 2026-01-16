import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// FIXED IMPORT: Single dot dot "../"
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, db } from "../config/firebaseConfig";
// FIXED IMPORTS: Single dot dot "../"
import DatePickerComponent from "../components/restaurant/DatePickerComponent";
import FindSlots from "../components/restaurant/FindSlots";
import GuestPickerComponent from "../components/restaurant/GuestPickerComponent";

export default function Restaurant() {
    const { restaurant } = useLocalSearchParams();
    const flatListRef = useRef(null);
    const windowWidth = Dimensions.get("window").width;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [restaurantData, setRestaurantData] = useState({});
    const [carouselData, setCarouselData] = useState([]); // Initialize as array

    const [slotsData, setSlotsData] = useState([]); // Initialize as array

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(2);
    const [date, setDate] = useState(new Date());

    const handleNextImage = () => {
        if (!carouselData[0]?.images) return;
        const carouselLength = carouselData[0]?.images.length;
        if (currentIndex < carouselLength - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }

        if (currentIndex == carouselLength - 1) {
            const nextIndex = 0;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
    };
    const handlePrevImage = () => {
        if (!carouselData[0]?.images) return;
        const carouselLength = carouselData[0]?.images.length;
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
        }

        if (currentIndex == 0) {
            const prevIndex = carouselLength - 1;
            setCurrentIndex(prevIndex);
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
        }
    };

    const carouselItem = ({ item }) => {
        return (
            <View style={{ width: windowWidth - 2 }} className="h-64 relative">
                <View
                    style={{
                        position: "absolute",
                        top: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 50,
                        padding: 5,
                        zIndex: 10,
                        right: "6%",
                    }}
                >
                    <Ionicons
                        onPress={handleNextImage}
                        name="arrow-forward"
                        size={24}
                        color="white"
                    />
                </View>
                <View
                    style={{
                        position: "absolute",
                        top: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 50,
                        padding: 5,
                        zIndex: 10,
                        left: "2%",
                    }}
                >
                    <Ionicons
                        onPress={handlePrevImage}
                        name="arrow-back"
                        size={24}
                        color="white"
                    />
                </View>
                <View
                    style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        left: "50%",
                        transform: [{ translateX: -50 }],
                        zIndex: 10,
                        bottom: 15,
                    }}
                >
                    {carouselData[0]?.images?.map((_, i) => (
                        <View
                            key={i}
                            className={`bg-white h-2 w-2 ${i == currentIndex && "h-3 w-3"
                                } p-1 mx-1 rounded-full`}
                        />
                    ))}
                </View>
                <Image
                    source={{ uri: item }}
                    style={{
                        opacity: 0.5,
                        backgroundColor: "black",
                        marginRight: 20,
                        marginLeft: 5,
                        borderRadius: 25,
                    }}
                    className="h-64"
                />
            </View>
        );
    };

    const getRestaurantData = async () => {
        try {
            const restaurantQuery = query(
                collection(db, "restaurants"),
                where("name", "==", restaurant)
            );
            const restaurantSnapshot = await getDocs(restaurantQuery);

            if (restaurantSnapshot.empty) {
                console.log("No matching restaurant found");
                return;
            }

            for (const doc of restaurantSnapshot.docs) {
                const restaurantData = doc.data();
                setRestaurantData(restaurantData);

                console.log("Found restaurant ref ID:", doc.id);

                // --- CAROUSEL FETCHING ---
                let carouselSnapshot;
                // 1. Try Reference
                let carouselQuery = query(collection(db, "carousel"), where("res_id", "==", doc.ref));
                carouselSnapshot = await getDocs(carouselQuery);

                if (carouselSnapshot.empty) {
                    console.log("Carousel not found by Ref. Trying Path...");
                    // 2. Try Path String
                    const qPath = query(collection(db, "carousel"), where("res_id", "==", doc.ref.path));
                    carouselSnapshot = await getDocs(qPath);
                }

                if (carouselSnapshot.empty) {
                    console.log("Carousel not found by Path. Trying ID String...");
                    // 3. Try ID String
                    const qID = query(collection(db, "carousel"), where("res_id", "==", doc.id));
                    carouselSnapshot = await getDocs(qID);
                }

                if (carouselSnapshot.empty) {
                    console.log("Carousel not found by ID. Trying Leading Slash Path...");
                    // 4. Try Leading Slash Path (e.g., "/restaurants/restaurant_10")
                    const qSlashPath = query(collection(db, "carousel"), where("res_id", "==", "/" + doc.ref.path));
                    carouselSnapshot = await getDocs(qSlashPath);
                }

                const carouselImages = [];
                if (carouselSnapshot.empty) {
                    console.log("No matching carousel found for:", doc.id)
                } else {
                    console.log("Carousel FOUND. Size:", carouselSnapshot.size);
                    carouselSnapshot.forEach((carouselDoc) => {
                        carouselImages.push(carouselDoc.data())
                    })
                }
                setCarouselData(carouselImages);

                // --- SLOTS FETCHING ---
                let slotsSnapshot;
                // 1. Try Reference
                let slotsQuery = query(collection(db, "slots"), where("ref_id", "==", doc.ref));
                slotsSnapshot = await getDocs(slotsQuery);

                if (slotsSnapshot.empty) {
                    console.log("Slots not found by Ref. Trying Path...");
                    // 2. Try Path String
                    const qPathSlots = query(collection(db, "slots"), where("ref_id", "==", doc.ref.path));
                    slotsSnapshot = await getDocs(qPathSlots);
                }

                if (slotsSnapshot.empty) {
                    console.log("Slots not found by Path. Trying ID String...");
                    // 3. Try ID String
                    const qIDSlots = query(collection(db, "slots"), where("ref_id", "==", doc.id));
                    slotsSnapshot = await getDocs(qIDSlots);
                }

                if (slotsSnapshot.empty) {
                    console.log("Slots not found by ID. Trying Leading Slash Path...");
                    // 4. Try Leading Slash Path (e.g., "/restaurants/restaurant_10")
                    const qSlashPathSlots = query(collection(db, "slots"), where("ref_id", "==", "/" + doc.ref.path));
                    slotsSnapshot = await getDocs(qSlashPathSlots);
                }

                const slots = [];
                if (slotsSnapshot.empty) {
                    console.log("No matching slots found for:", doc.id)
                } else {
                    console.log("Slots FOUND. Size:", slotsSnapshot.size);
                    slotsSnapshot.forEach((slotDoc) => {
                        slots.push(slotDoc.data())
                    })
                }

                // Correctly set slots data for FindSlots component (expects the array of slot times)
                // Check if slots[0] exists before accessing .slot
                setSlotsData(slots.length > 0 ? slots[0]?.slot : []);
            }
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    const handleLocation = async () => {
        const url = "https://maps.app.goo.gl/TtSmNr394bVp9J8n8";
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Don't know how to open URL", url);
        }
    };

    const handleBookSlot = async () => {
        if (!selectedSlot || !auth.currentUser) {
            alert("Please select a slot and ensure you are logged in.");
            return;
        }

        try {
            await addDoc(collection(db, "bookings"), {
                userId: auth.currentUser.uid,
                restaurantName: restaurant,
                date: date.toDateString(),
                slot: selectedSlot,
                guests: selectedNumber,
                createdAt: new Date()
            });
            alert("Booking Confirmed!");
            setSelectedSlot(null); // Reset selection
        } catch (error) {
            console.log("Booking Error:", error);
            alert("Failed to book slot.");
        }
    };

    useEffect(() => {
        getRestaurantData();
    }, []);

    return (
        <SafeAreaView
            style={[
                { backgroundColor: "#2b2b2b" },
                Platform.OS == "android" && { paddingBottom: 55 },
                Platform.OS == "ios" && { paddingBottom: 20 },
            ]}
        >
            <ScrollView className="h-full">
                <View className="flex-1 my-2 p-2">
                    <Text className="text-xl text-[#f49b33] mr-2 font-semibold">
                        {restaurant}
                    </Text>
                    <View className="border-b border-[#f49b33]" />
                </View>
                <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
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
                <View className="flex-1 flex-row mt-2 p-2">
                    <Ionicons name="location-sharp" size={24} color="#f49b33" />
                    <Text className="max-w-[75%] text-white">
                        {restaurantData?.address} |{"  "}
                        <Text
                            onPress={handleLocation}
                            className="underline flex items-center mt-1 text-[#f49b33] italic font-semibold"
                        >
                            Get Direction
                        </Text>
                    </Text>
                </View>
                <View className="flex-1 flex-row p-2">
                    <Ionicons name="time" size={20} color="#f49b33" />
                    <Text className="max-w-[75%] mx-2 font-semibold text-white">
                        {restaurantData?.opening} - {restaurantData?.closing}
                    </Text>
                </View>
                <View className="flex-1 border m-2 p-2 border-[#f49b33] rounded-lg">
                    <View className="flex-1 flex-row m-2 p-2 justify-end items-center">
                        <View className="flex-1 flex-row">
                            <Ionicons name="calendar" size={20} color="#f49b33" />
                            <Text className="text-white mx-2 text-base">
                                Select booking date
                            </Text>
                        </View>
                        <DatePickerComponent date={date} setDate={setDate} />
                    </View>
                    <View className="flex-1 flex-row bg-[#474747] rounded-lg  m-2 p-2 justify-end items-center">
                        <View className="flex-1 flex-row">
                            <Ionicons name="people" size={20} color="#f49b33" />
                            <Text className="text-white mx-2 text-base">
                                Select number of guests
                            </Text>
                        </View>
                        <GuestPickerComponent
                            selectedNumber={selectedNumber}
                            setSelectedNumber={setSelectedNumber}
                        />
                    </View>
                </View>
                <View className="flex-1">
                    <FindSlots
                        restaurant={restaurant}
                        date={date}
                        selectedNumber={selectedNumber}
                        slots={slotsData}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                    />
                </View>
                <View className="m-4">
                    <TouchableOpacity
                        onPress={handleBookSlot}
                        disabled={!selectedSlot}
                        className={`p-4 rounded-xl ${selectedSlot ? 'bg-[#f49b33]' : 'bg-gray-600'}`}
                    >
                        <Text className="text-center text-white font-bold text-lg">
                            {selectedSlot ? "Book Appointment" : "Select a Slot first"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}