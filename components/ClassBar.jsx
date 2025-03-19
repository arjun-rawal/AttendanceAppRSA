import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Tab, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const ClassBar = ({ initialIndex, selectedInfo }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const navigation = useNavigation();
  console.log("Information the Class Bar got", selectedInfo);
  
  function handleChange(e) {
    setActiveIndex(e);
    if (e === 0) {
      navigation.replace("Assistant", selectedInfo);
    } else if (e === 1) {
      navigation.replace("Content", selectedInfo);
    } else {
      navigation.replace("Forum", selectedInfo);
    }
  }

  return (
    <View style={styles.navbarContainer}>
      <Tab value={activeIndex} onChange={handleChange} indicatorStyle={styles.indicator}>
        <Tab.Item
          title="Assistant"
          titleStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}
          icon={<Icon name="chat" type="entypo" size={28} color={activeIndex === 0 ? "red" : "gray"} />}
        />
        <Tab.Item
          title="Content"
          titleStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}
          icon={<Icon name="file-text" type="feather" size={28} color={activeIndex === 1 ? "red" : "gray"} />}
        />
        <Tab.Item
          title="Forum"
          titleStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}
          icon={<Icon name="forum" type="material" size={28} color={activeIndex === 2 ? "red" : "gray"} />}
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
  indicator: { backgroundColor: "red", height: 2 },
});

export default ClassBar;
