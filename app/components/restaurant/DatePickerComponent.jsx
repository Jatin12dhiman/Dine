import {View , Text} from 'react-native'
import React from 'react'
import { DateTimePicker } from '@react-native-community/datetimepicker'
const DatePickerComponent =() =>{

    const [show , setShow] = useState(false);
    const [date , setDate] = useState(new Date());

    const handlePress = () =>{
        setShow(true)
    }
    return(
        <View className="flex-1">
            <TouchableOpacity onPress={handlePress}>
                <DateTimePicker 
                value={date}
                mode="date"
                display="default"
                minimumDate={new Date()} 
                maximumDate={newDate(newDate().setDate(newDate().getDate()+7))}
                />

                
            </TouchableOpacity>
        </View>
    )
}

export default DatePickerComponent