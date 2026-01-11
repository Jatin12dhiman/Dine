import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ImageBackground, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { restaurants } from "../../store/restaurants";

const home = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: "#2b2b2b" }}>
      <View className="flex items-center mt-1">
        <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex flex-row p-2">
          <View className="flex flex-row">
            <Text className={`text-base h-10 pt-[${Platform.OS === "ios" ? 8 : 6.5}] align-middle text-white `}>{" "}
              Welcome to {""}</Text>
            <Image resizeMode="cover" className={"w-20 h-11"} source={logo} />
          </View>
        </View>
      </View>
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          className="my-4 w-full h-52 items-center justify-center"
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
      </ScrollView>

      {
        restaurants.length > 0 ?
          <FlatList /> : <ActivityIndicator animating color={"#fb9b33"} />
      }

    </SafeAreaView>
  )
}

export default home