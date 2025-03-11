import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";

export default function HomeScreen(navigation){
    return(
    <SafeAreaView style={styles.container}>
        
    <View style={styles.content}>
      <Text style={styles.text}>You are logged in!</Text>

      {/* Sign out button */}
      <Button
        title="Sign Out"
        onPress={() => signOut(auth).catch((err) => console.error(err))}
      />

      {/* Calendar component */}
      <Calendar
        markedDates={{
          '2025-03-12': { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
          '2025-03-15': { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
          // TODO: update using google classroom/teacher backend, make this interact more with classes screen
        }}
        onDayPress={(day) => {
          // go to classes screen with the selected date
          navigation.navigate('Classes', { selectedDate: day.dateString });
        }}
      />
    </View>
    <BottomNavBar />
  </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80, // so content doesn't get hidden behind nav bar
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
});