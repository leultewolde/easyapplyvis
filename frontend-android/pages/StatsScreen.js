import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import JobDataContext from "../context/JobDataContext";

export default function StatsScreen() {
    const { data } = useContext(JobDataContext); // Access jobData from context

    // Helper functions to filter jobs based on date
    const isToday = (date) => moment(date).isSame(moment(), 'day');
    const isThisWeek = (date) => moment(date).isSame(moment(), 'week');
    const isThisMonth = (date) => moment(date).isSame(moment(), 'month');

    // Calculate statistics
    const jobsToday = data.filter((job) => isToday(job['Applied At'])).length;
    const jobsThisWeek = data.filter((job) => isThisWeek(job['Applied At'])).length;
    const jobsThisMonth = data.filter((job) => isThisMonth(job['Applied At'])).length;
    const failedJobs = data.filter((job) => job.Status === 'Failed').length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Job Application Statistics</Text>

            <View style={styles.stat}>
                <Text style={styles.label}>Jobs Applied Today: </Text>
                <Text style={styles.value}>{jobsToday}</Text>
            </View>

            <View style={styles.stat}>
                <Text style={styles.label}>Jobs Applied This Week: </Text>
                <Text style={styles.value}>{jobsThisWeek}</Text>
            </View>

            <View style={styles.stat}>
                <Text style={styles.label}>Jobs Applied This Month: </Text>
                <Text style={styles.value}>{jobsThisMonth}</Text>
            </View>

            <View style={styles.stat}>
                <Text style={styles.label}>Failed Applications: </Text>
                <Text style={styles.value}>{failedJobs}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    stat: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#4A90E2',
    },
});