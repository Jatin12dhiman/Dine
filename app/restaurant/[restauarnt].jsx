import { useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { where } from 'firebase/firestore';

export default function Restaurant() {
    const { restauarnt } = useLocalSearchParams();

    const[restaurantData , setRestaurantData] = useState({})
    const[carouselData , setCarouselData] = useState({})
    const[slotsData , setSlotsData] = useState({})

    const getRestaurantData = async () => {
        try{
            const restaurantQuery = query(collection(db , "restaurants"),where("name","==",restauarnt))
            const restaurantSnapshot = await getDocs(restaurantQuery)
            
            if(restaurantSnapshot.empty){
                console.log("No matching restaurant found")
                return ;
            }
            for(const doc of restaurantSnapshot.docs){
                const restaurantData = doc.data();
                setRestaurantData(restaurantData)

                const carouselQuery = query(collection(db , "carousel"),where("res_id","==", doc.ref)
             );
             const carouselSnapshot = await getDocs(carouselQuery);
             const carouselImages = [];
             carouselSnapshot.forEach((carouselDoc)=>{
                carouselImages.push(carouselDoc.data())
             })
             setCarouselData(carouselImages)

            }
        }catch(error){
            console.log(error)
        }
    }
     

    return (
        <SafeAreaView style={[{ backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 10 },
        Platform.OS == "ios" && { paddingBottom: 20 },
        ]}>
            <ScrollView className="h-full">
                <View className="flex">
                    <Text className="text-xl text-[#f49b33] mr-2 mt-[12px] font-semibold">{restauarnt}</Text>
                     
                    <View className="border-b border-[#f49b33] "></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
