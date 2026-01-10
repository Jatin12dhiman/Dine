import { Image, Text, View, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import { ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';

const home = () => {
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
          source
          >
          <BlurView tint="dark"
            intensity={100}>
            <Text className="text-center text-3xl font-bold text-white" >
              Dine with your loved ones
            </Text>
          </BlurView>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  )
}

export default home