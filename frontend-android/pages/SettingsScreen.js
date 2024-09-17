import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import JobDataContext from "../context/JobDataContext";

const SettingsScreen = ({ navigation }) => {
  const { saveBackendUrl, backendIpAddress } = useContext(JobDataContext); // Access saveBackendUrl from context
  const [ipAddress, setIpAddress] = useState(backendIpAddress);

  // Save the backend URL and navigate back
  const handleSave = () => {
    saveBackendUrl(ipAddress);
    navigation.goBack();
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.label}>Enter Backend IP Address:</Text>

        <TextInput
            style={styles.input}
            placeholder="Enter Backend IP Address"
            value={ipAddress}
            onChangeText={setIpAddress}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
        />
        <Button title="Save" onPress={handleSave} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A90E2',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#4A90E2',  // Blue border color
    borderWidth: 2,           // Thicker border
    borderRadius: 10,         // Rounded corners
    paddingHorizontal: 15,    // Padding inside the input box
    marginBottom: 20,         // Margin below the input box
    backgroundColor: '#fff',  // White background
    fontSize: 16,
    color: '#333',            // Text color inside the input box
  },
});
export default SettingsScreen;
