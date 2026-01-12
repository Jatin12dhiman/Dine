import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { db } from '../config/firebaseConfig';


export default function Home() {
  const router = useRouter();

  const [restaurant, setRestaurant] = useState([])


  const renderItem = ({ item }) => (
    <TouchableOpacity
    onPress={()=>router.push(`/restaurant/${item.name}`)}
      className="bg-[#5f5f5f] w-72 rounded-lg p-4 mx-2 shadow-md overflow-hidden"
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        className="w-full h-28 rounded-lg mb-2"
      />

      <Text
        className="text-white text-lg font-bold mb-1"
        numberOfLines={1}
      >
        {item.name}
      </Text>

      <Text
        className="text-white text-sm mb-1"
        numberOfLines={2}
      >
        {item.address}
      </Text>

      <Text
        className="text-white text-sm"
        numberOfLines={2}
      >
        Opening: {item.opening} – Closing: {item.closing}
      </Text>
    </TouchableOpacity>
  );

  // Firestore se data kaise lekr aana h , wo hm yha krenge
  const getRestaurants = async () => {
    const q = query(collection(db, "restaurants"))
    const res = await getDocs(q);

    res.forEach((item) => {
      setRestaurant((prev) => [...prev, item.data()])
    })
  }

  useEffect(() => {
    getRestaurants()
  }, [])

  return (
    <SafeAreaView
      style={[{ backgroundColor: "#2b2b2b" },
      Platform.OS == "android" && { paddingBottom: 10 },
      Platform.OS == "ios" && { paddingBottom: 20 },
      ]}>
      <View className="flex items-center ">
        <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex flex-row p-2">
          <View className="flex flex-row">
            <Text className={`text-base h-10 
              pt-[${Platform.OS === "ios" ? "pt-[8px]" : "pt-1"}] align-middle text-white `}>{" "}
              Welcome to {""}</Text>
            <Image resizeMode="cover" className={"w-20 h-11"} source={logo} />
          </View>
        </View>
      </View>
      <ScrollView stickyHeaderIndices={[0]}>
        <ImageBackground
          resizeMode="cover"
          className="my-4 w-full bg-[#2b2b2b] h-52 items-center justify-center mb-4"
          source={banner}
        >
          <BlurView tint="dark"
            intensity={Platform.OS === "android" ? 100 : 50}
            className="w-full p-4 shadow-lg"
          >
            <Text className="text-center text-3xl font-bold text-white">
              Dine with your loved ones
            </Text>
          </BlurView>
        </ImageBackground>
        <View clssName="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-white mr-2 font-semibold">
            Special Discount %
          </Text>
        </View>
        {
          restaurant.length > 0 ? (
            <FlatList
              data={restaurant}
              renderItem={renderItem}
              horizontal
              contentContainerStyle={{ padding: 16 }} showHorizontalScrollIndicator={false} scrollEnabled={true}
            />) : (
            <ActivityIndicator animating color={"#fb9b33"} />
          )
        }

        <View clssName="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-[#fb9b33] mr-2 font-semibold">
            Our Restaurants
          </Text>
        </View>
        {
          restaurant.length > 0 ? (
            <FlatList
              data={restaurant}
              renderItem={renderItem}
              horizontal
              contentContainerStyle={{ padding: 16 }} showHorizontalScrollIndicator={false} scrollEnabled={true}
            />) : (
            <ActivityIndicator animating color={"#fb9b33"} />
          )
        }


      </ScrollView>


    </SafeAreaView>
  )
}

