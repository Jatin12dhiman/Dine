import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Restaurant() {
    const { restauarnt } = useLocalSearchParams();

    return (
        <SafeAreaView>
            <Text>{restauarnt}</Text>
        </SafeAreaView>
    )
}
