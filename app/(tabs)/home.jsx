import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { restaurants } from "../../store/restaurants";

const home = () => {
  const router = useRouter();


  const renderItem = ({ item }) => (
  <TouchableOpacity
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

  return (
    <SafeAreaView style={{ backgroundColor: "#2b2b2b" }}>
      <View className="flex items-center ">
        <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex flex-row p-2">
          <View className="flex flex-row">
            <Text className={`text-base h-10 pt-[${Platform.OS === "ios" ? 8 : 6.5}] align-middle text-white `}>{" "}
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
        {
          restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
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

export default home