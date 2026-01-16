import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function FindSlots({ slots, selectedSlot, setSelectedSlot }) {

    const renderSlot = ({ item }) => {
        const isSelected = selectedSlot === item;

        return (
            <TouchableOpacity
                onPress={() => setSelectedSlot(item)}
                className={`px-4 py-2 m-1 rounded-full border ${isSelected
                        ? 'bg-[#f49b33] border-[#f49b33]'
                        : 'bg-[#474747] border-[#474747]'
                    }`}
            >
                <Text className={`font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View className="m-2 p-3 border border-[#f49b33] rounded-lg">
            <View className="flex-row items-center mb-3">
                <Ionicons name="time-outline" size={20} color="#f49b33" />
                <Text className="text-white text-lg font-bold ml-2">
                    Available Slots
                </Text>
            </View>

            {slots && slots.length > 0 ? (
                <FlatList
                    data={slots}
                    renderItem={renderSlot}
                    keyExtractor={(item) => item}
                    horizontal={false}
                    numColumns={3}
                    scrollEnabled={false}
                    contentContainerStyle={{ alignItems: 'flex-start' }}
                    columnWrapperStyle={{ flexWrap: 'wrap', justifyContent: "flex-start" }}
                />
            ) : (
                <Text className="text-gray-400 italic ml-1">
                    No slots available for this date.
                </Text>
            )}

            {selectedSlot && (
                <View className="mt-4 border-t border-gray-600 pt-2">
                    <Text className="text-[#f49b33] text-center font-semibold">
                        Selected: {selectedSlot}
                    </Text>
                </View>
            )}
        </View>
    )
}
