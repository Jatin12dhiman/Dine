import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../config/firebaseConfig'

const Profile = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/signup");
  }

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b] p-4">
      <View className="items-center mt-10">
        <View className="h-24 w-24 bg-[#474747] rounded-full items-center justify-center border-2 border-[#f49b33]">
          <Ionicons name="person" size={50} color="#f49b33" />
        </View>

        {user ? (
          <>
            <Text className="text-white text-xl font-bold mt-4">
              {user.email}
            </Text>
            <Text className="text-gray-400 text-sm">
              Verified Account
            </Text>
          </>
        ) : (
          <Text className="text-white text-xl font-bold mt-4">
            Guest User
          </Text>
        )}
      </View>

      <View className="mt-10">
        {user ? (
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-[#474747] p-4 rounded-lg border border-[#f49b33]"
          >
            <Ionicons name="log-out-outline" size={24} color="#f49b33" />
            <Text className="text-white text-lg font-semibold ml-4">
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.replace("/signup")}
            className="flex-row items-center bg-[#f49b33] p-4 rounded-lg"
          >
            <Ionicons name="log-in-outline" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-4">
              Sign Up / Login
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

export default Profile