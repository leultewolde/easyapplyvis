import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoComponent = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/briefcase-icon.png')}  // Adjust the path based on where your logo is
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#fff',  // Set the background color if necessary
    },
    logo: {
        width: 150,  // Adjust the width to your preference
        height: 150, // Adjust the height to your preference
    },
});

export default LogoComponent;
