import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Tab, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const HomeNavBar = ({ initialIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const navigation = useNavigation();

  function handleChange(e) {
    setActiveIndex(e);
    if (e === 0) {
      navigation.replace("Home");
    } else if (e === 1) {
      navigation.replace("ClassManager");
    } else {
      navigation.replace("Settings");
    }
  }

  return (
    <View style={styles.navbarContainer}>
      <Tab value={activeIndex} onChange={handleChange} indicatorStyle={styles.indicator}>
        {/* Home Tab */}
        <Tab.Item
          title="Home"
          titleStyle={{  // Change the font family
            fontSize: 16,                  // Adjust font size
            fontWeight: 'bold',            // Font weight
            color: 'black',                 // Text color
          }}
          icon={<Icon name="home" type="feather" size={28} color={activeIndex === 0 ? "red" : "gray"} />}
        />

        {/* Classes Tab (Newly Added) */}
        <Tab.Item
          title="Classes"
          titleStyle={{  // Change the font family
            fontSize: 16,                  // Adjust font size
            fontWeight: 'bold',            // Font weight
            color: 'black',                 // Text color
          }}
          icon={<Icon name="book" type="feather" size={28} color={activeIndex === 1 ? "red" : "gray"} />}
        />

        {/* Settings Tab */}
        <Tab.Item
          title="Settings"
          titleStyle={{  // Change the font family
            fontSize: 16,                  // Adjust font size
            fontWeight: 'bold',            // Font weight
            color: 'black',                 // Text color
          }}
          icon={<Icon name="settings" type="feather" size={28} color={activeIndex === 2 ? "red" : "gray"} />}
        />
      </Tab>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    position: "absolute", // Fixed at the bottom
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white", // Ensures it has a visible background
    elevation: 5, // Shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 }, // Shadow above navbar
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,

  },
  indicator: {
    backgroundColor: "red",
    height: 2,
  },
});

export default HomeNavBar;
