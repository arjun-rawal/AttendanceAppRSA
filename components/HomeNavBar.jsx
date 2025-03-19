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
      <Tab
        value={activeIndex}
        onChange={handleChange}
        indicatorStyle={styles.indicator}
      >
        <Tab.Item
          title="Home"
          titleStyle={{
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
          }}
          icon={
            <Icon
              name="home"
              type="feather"
              size={28}
              color={activeIndex === 0 ? "red" : "gray"}
            />
          }
        />

        <Tab.Item
          title="Classes"
          titleStyle={{
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
          }}
          icon={
            <Icon
              name="book"
              type="feather"
              size={28}
              color={activeIndex === 1 ? "red" : "gray"}
            />
          }
        />

        <Tab.Item
          title="Settings"
          titleStyle={{
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
          }}
          icon={
            <Icon
              name="settings"
              type="feather"
              size={28}
              color={activeIndex === 2 ? "red" : "gray"}
            />
          }
        />
      </Tab>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
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
