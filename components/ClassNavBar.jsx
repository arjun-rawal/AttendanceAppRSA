import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const ClassNavBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log("AI Summary pressed")}>
        <Icon 
          name="brain" 
          type="material-community" 
          size={28} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log("Attachments pressed")}>
        <Icon 
          name="attach-file" 
          type="material" 
          size={28} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log("Forum pressed")}>
        <Icon 
          name="forum" 
          type="material" 
          size={28} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    // Add a subtle shadow for modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClassNavBar;
