import {useEffect, useState} from "react";
import {ActivityIndicator, Image, StyleSheet} from "react-native";

const US_FLAG_URL = "https://flagcdn.com/h240/us.png";
const getFlagURL = (abbr: string) => abbr === 'us' ? US_FLAG_URL : `https://flagcdn.com/h240/us-${abbr}.png`;

export default function StateFlag({abbr, size = 100}: { abbr: string, size: number }) {
    const [flagUrl, setFlagUrl] = useState<string>(US_FLAG_URL);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchFlag = async () => {
            const flagUrl = getFlagURL(abbr);
            try {
                const response = await fetch(flagUrl);
                if (response.ok) {
                    setFlagUrl(flagUrl);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchFlag();
    }, [abbr]);

    if (loading) {
        return <ActivityIndicator size={size} color="#0000ff"/>;
    }

    return <Image source={{uri: flagUrl}} resizeMode="contain" style={{width: size, height: size}}/>;
};

const styles = StyleSheet.create({
    flagImage: {
        resizeMode: 'contain',
    }
});
