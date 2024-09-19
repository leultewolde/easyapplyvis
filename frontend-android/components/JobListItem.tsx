import {JobData} from "../context/JobDataContext";
import {Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment/moment";
import React from "react";


export default function JobListItem({job}:{job:JobData}) {
    return (
        <View style={styles.item}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{job.Position}</Text>
                <Text style={styles.company} numberOfLines={1} ellipsizeMode="tail">{job.Company}</Text>
            </View>

            <Text style={styles.location}>
                <Icon name="location-outline" size={14} color="#4A90E2"/> {job.Location}, {job.Country}
            </Text>

            <Text style={styles.appliedAt}>
                <Icon name="calendar-outline" size={14}
                      color="#4A90E2"/> {moment(job["Applied At"]).format('MMM Do YYYY, h:mm a')}
            </Text>

            <TouchableOpacity onPress={() => Linking.openURL(job["Job Link"])} style={styles.linkContainer}>
                <Icon name="link-outline" size={14} color="#4A90E2"/>
                <Text style={styles.link}>View Job Posting</Text>
            </TouchableOpacity>

            <Text style={[styles.status, job.Status === 'Success' ? styles.success : styles.failed]}>
                <Icon name={job.Status === 'Success' ? 'checkmark-circle-outline' : 'close-circle-outline'} size={16}
                      color={job.Status === 'Success' ? 'green' : 'red'}/>{' '}
                {job.Status}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    company: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
        maxWidth: 150,
        flexShrink: 1
    },
    location: {
        fontSize: 14,
        color: '#4A90E2',
        marginBottom: 5,
    },
    appliedAt: {
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    link: {
        color: '#4A90E2',
        textDecorationLine: 'underline',
        marginLeft: 5,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    success: {
        color: 'green',
    },
    failed: {
        color: 'red',
    },
});