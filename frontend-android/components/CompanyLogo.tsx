import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';

const CompanyLogo = ({companyName, size=100}: { companyName: string, size: number }) => {
    const [logoUrl, setLogoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLogo = async () => {
            const domain = companyName.replace(/\s+/g, '').toLowerCase(); // Clean the company name
            const logo = `https://logo.clearbit.com/${domain}.com`; // Construct the logo URL

            try {
                const response = await fetch(logo);
                if (response.ok) {
                    setLogoUrl(logo);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchLogo();
    }, [companyName]);

    if (loading) {
        return <ActivityIndicator size={size} color="#0000ff"/>;
    }

    const placeholderImage = `https://placehold.jp/35545a/ffffff/${size}x${size}.png?text=No%20Logo`;
    return (
        <>
            {logoUrl ? (
                <Image source={{uri: logoUrl}} style={[styles.logo, {width: size, height: size}]}/>
            ) : (
                <Image source={{uri: placeholderImage}} style={[styles.logo, {width: size, height: size}]}/>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    logo: {
        resizeMode: 'contain',
    },
});

export default CompanyLogo;
