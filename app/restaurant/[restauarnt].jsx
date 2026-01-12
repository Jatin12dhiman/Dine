import { useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Restaurant() {
    const { restauarnt } = useLocalSearchParams();

    return (
        <SafeAreaView style={[{ backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 10 },
        Platform.OS == "ios" && { paddingBottom: 20 },
        ]}>
            <ScrollView className="h-full">
                <View className="flex">
                    <Text className="text-xl text-[#f49b33] mr-2 font-semibold">{restauarnt}</Text>
                     
                    <View className="border-b border-[#f49b33] "></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
