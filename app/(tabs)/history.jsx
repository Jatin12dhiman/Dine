import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebaseConfig';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // To re-fetch when tab is focused

  const fetchBookings = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedBookings = [];
      querySnapshot.forEach((doc) => {
        fetchedBookings.push({ id: doc.id, ...doc.data() });
      });
      setBookings(fetchedBookings);
    } catch (error) {
      console.log("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchBookings();
    }
  }, [isFocused]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "bookings", id));
              // Remove from local state immediately
              setBookings(prev => prev.filter(b => b.id !== id));
            } catch (error) {
              console.log("Error deleting:", error);
              alert("Could not delete booking.");
            }
          }
        }
      ]
    );
  };

  const renderBookingItem = ({ item }) => (
    <View className="bg-[#474747] p-4 mb-3 rounded-xl border border-[#f49b33] flex-row justify-between items-start">
      <View>
        <Text className="text-white text-lg font-bold">{item.restaurantName}</Text>
        <View className="flex-row items-center mt-2">
          <Ionicons name="calendar-outline" size={16} color="#f49b33" />
          <Text className="text-gray-300 ml-2">{item.date}</Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="time-outline" size={16} color="#f49b33" />
          <Text className="text-gray-300 ml-2">{item.slot}</Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="people-outline" size={16} color="#f49b33" />
          <Text className="text-gray-300 ml-2">{item.guests} Guests</Text>
        </View>
      </View>

      <TouchableOpacity
        className="p-2"
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b] p-4">
      <Text className="text-2xl text-[#f49b33] font-bold mb-4">
        Your Bookings
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#f49b33" />
      ) : bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="calendar-outline" size={80} color="#474747" />
          <Text className="text-white text-lg mt-4 font-semibold">
            No bookings yet
          </Text>
          <Text className="text-gray-400 text-center mt-2 px-10">
            Book a table at your favorite restaurant and track it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
        />
      )}
    </SafeAreaView>
  )
}

export default History