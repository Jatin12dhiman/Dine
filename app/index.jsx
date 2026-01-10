import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/dinetimelogo.png";
import entrying from "../assets/images/Frame.png";
import { StatusBar } from "react-native";


export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ width: 300, height: 300 }} />
          <View className="w-3/4">
            <TouchableOpacity onPress={() => router.push("/signup")} className="p-2 my-2 bg-[#f49b33] text-black rounded-lg">
              <Text className="text-lg font-semibold text-center">
                Sign up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/home")} className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] rounded-lg max-w-fit">
              <Text className="text-lg font-semibold text-center text-[#f49b33]">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        <View>
          <Text className="text-center text-base  font-semibold my-4 text-white">
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> or{" "}
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
          </Text>

          <TouchableOpacity
            className="flex flex-row justify-center items-center"
            onPress={() => router.push("/signin")}
          >
            <Text className="text-white font-semibold">Already a User? </Text>
            <Text className="text-base font-semibold underline text-[#f49b33]">
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Image
            source={entrying}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />        
      </ScrollView>

    </SafeAreaView>
  );
}
