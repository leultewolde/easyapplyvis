import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import JobDataContext from "../context/JobDataContext";
import {StackNavigationProp} from "@react-navigation/stack";
import {JobData} from "../types";
import {camelCaseToSentence, capitalizeWords} from "../utils";

export default function StatsScreen({navigation}: { navigation: StackNavigationProp<any> }) {
    const {data, jobStats, uniqueCompanies, uniqueLocations} = useContext(JobDataContext);

    // const uniqueCompanies = new Set(data.map((job) => job.Company)).size;
    // const uniqueLocations = new Set(data.map((job) => job.Location)).size;

    const goToJobList = (label: string, jobs: JobData[]) => {
        navigation.navigate('JobsListScreen', {jobs, title: `${label} (${jobs.length})`});
    };

    const goToCompanies = () => {
        navigation.navigate('CompaniesScreen');
    };

    const goToLocations = () => {
        navigation.navigate('LocationsScreen');
    };

    const calendarData: { [key: string]: number } = {};
    data.forEach((job) => {
        const date = moment(job['Applied At']).format('YYYY-MM-DD');
        calendarData[date] = (calendarData[date] || 0) + 1;
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.column}>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={goToCompanies}
                    >
                        <View style={styles.stat}>
                            <Text
                                style={styles.value}>{uniqueCompanies.length}</Text>
                            <Text numberOfLines={1} style={styles.label}>Companies</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={goToLocations}
                    >
                        <View style={styles.stat}>
                            <Text
                                style={styles.value}>{uniqueLocations.length}</Text>
                            <Text numberOfLines={1} style={styles.label}>Locations</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {Object.keys(jobStats).map((statKey, index) => (
                    <View key={index} style={styles.row}>
                        {Object.keys(jobStats[statKey]).map((dataKey, index) => {
                            const jobStat = jobStats[statKey][dataKey];
                            const label = capitalizeWords(dataKey + " " + camelCaseToSentence(statKey));
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => goToJobList(label, jobStat.data)}>
                                    <View style={styles.stat}>
                                        <Text
                                            style={dataKey === "success" ? styles.value : styles.error_value}>{jobStat.length}</Text>
                                        <Text numberOfLines={1} style={styles.label}>{label}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        // marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        // justifyContent: 'space-around', // Add spacing between cards
        // marginBottom: 20,
        flexWrap: 'wrap',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: '48%',
        alignItems: 'center'
    },
    stat: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 12,
        fontWeight: 'light',
        color: '#999',
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    error_value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff0000',
    },
    calendarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    calendarDay: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 5,
        borderRadius: 4,
    },
    calendarDate: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    calendarCount: {
        fontSize: 8,
        color: '#999',
    },
});