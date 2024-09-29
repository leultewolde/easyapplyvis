import {View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, Dimensions} from "react-native";
import {JobData} from "../types";
import moment from "moment";
import CompanyLogo from "../components/CompanyLogo";
import StateFlag from "../components/StateFlag";
import {getStateAbbrFromLocation, getStateFromLocation} from "../utils";


type StackParamList = {
    params: { job: JobData; };
};

export default function JobItemScreen({route}: {route: StackParamList}) {
    const {job} = route.params;

    const getStatusColor = (status:string) => {
        switch (status) {
            case 'Under Review':
                return '#FFA500';
            case 'Success':
                return '#32CD32';
            case 'Failed':
                return '#FF4500';
            default:
                return '#000';
        }
    };

    const getStateAbbr = () => {
        let abbr = getStateAbbrFromLocation(job.Location);
        if (abbr === 'us') abbr = getStateAbbrFromLocation(job.Country);
        return abbr;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={{alignSelf: 'center', marginVertical: 20}}><CompanyLogo companyName={job.Company} size={100}/></View>
                <Text style={styles.title}>{job.Position}</Text>
                <Text style={styles.company}>{job.Company}</Text>

                <View style={styles.separator} />

                <View style={styles.infoRow}>
                    <StateFlag abbr={getStateAbbr()} size={40}/>
                    <Text style={styles.value}>{job.Location}, {job.Country}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.icon}>📅</Text>
                    <Text style={styles.value}>Applied on {moment(job["Applied At"]).format('MMM Do YYYY, h:mm a')}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.icon}>📝</Text>
                    <Text style={[styles.value, { color: getStatusColor(job.Status) }]}>
                        {job.Status}
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(job["Job Link"])}>
                    <Text style={styles.buttonText}>View Job Posting</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
    },
    card: {
        width: width * 0.9,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        elevation: 4, // For Android shadow
        shadowColor: '#000000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333333',
    },
    company: {
        fontSize: 20,
        color: '#777777',
        marginBottom: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 10
    },
    icon: {
        fontSize: 22,
        marginRight: 12,
    },
    value: {
        fontSize: 18,
        color: '#555555',
        flexShrink: 1,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#1E90FF',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#1E90FF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5, // For Android
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});