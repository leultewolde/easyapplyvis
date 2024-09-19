import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import JobDataContext, {JobData} from "../context/JobDataContext";
import {StackNavigationProp} from "@react-navigation/stack";

export default function StatsScreen({navigation}: { navigation: StackNavigationProp<any> }) {
    const {data} = useContext(JobDataContext);

    // Helper functions to filter jobs based on date
    const isToday = (date: string) => moment(date).isSame(moment(), 'day');
    const isYesterday = (date: string) => moment(date).isSame(moment().subtract(1, 'days'), 'day');
    const isThisWeek = (date: string) => moment(date).isSame(moment(), 'week');
    const isThisMonth = (date: string) => moment(date).isSame(moment(), 'month');

    // Calculate statistics
    const jobsToday = data.filter((job) => isToday(job['Applied At']));
    const jobsYesterday = data.filter((job) => isYesterday(job['Applied At']));
    const jobsThisWeek = data.filter((job) => isThisWeek(job['Applied At']));
    const jobsThisMonth = data.filter((job) => isThisMonth(job['Applied At']));
    const failedJobs = data.filter((job) => job.Status === 'Failed');

    const uniqueCompanies = new Set(data.map((job) => job.Company)).size;
    const uniqueLocations = new Set(data.map((job) => job.Location)).size;

    const STATS = [
        {label: "Today", value: jobsToday.length, jobs: jobsToday},
        {label: "Yesterday", value: jobsYesterday.length, jobs: jobsYesterday},
        {label: "This Week", value: jobsThisWeek.length, jobs: jobsThisWeek},
        {label: "This Month", value: jobsThisMonth.length, jobs: jobsThisMonth},
        {label: "Failed", value: failedJobs.length, jobs: failedJobs},
        {label: "Companies", value: uniqueCompanies, jobs: []},
        {label: "Locations", value: uniqueLocations, jobs: []},
    ];

    const handleCardPress = (label: string, jobs: JobData[]) => {
        navigation.navigate('JobsListScreen', {jobs, title: label}); // Navigate to JobsListScreen
    };

    const getJobsByDate = (selectedDate: string) => {
        return data.filter((job) => moment(job['Applied At']).format('YYYY-MM-DD') === selectedDate);
    };

    // Handle when a day in the calendar is clicked
    const handleDayPress = (day: number) => {
        const selectedDate = moment().date(day).format('YYYY-MM-DD'); // Get the full date for the selected day
        const jobsOnSelectedDate = getJobsByDate(selectedDate); // Filter jobs on that day
        navigation.navigate('JobsListScreen', {jobs: jobsOnSelectedDate, title: `Jobs on ${selectedDate}`});
    };

    // Calendar
    const calendarData: { [key: string]: number } = {};
    data.forEach((job) => {
        const date = moment(job['Applied At']).format('YYYY-MM-DD');
        calendarData[date] = (calendarData[date] || 0) + 1;
    });

    const renderCalendar = () => {
        const daysInMonth = moment().daysInMonth();
        const calendar = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = moment().date(day).format('YYYY-MM-DD');
            calendar.push(
                <TouchableOpacity key={day} style={styles.calendarDay} onPress={() => handleDayPress(day)}>
                    <Text style={styles.calendarDate}>{day}</Text>
                    <Text style={styles.calendarCount}>
                        {getJobsByDate(date).length} Jobs
                    </Text>
                </TouchableOpacity>
            );
        }

        return <View style={styles.calendarGrid}>{calendar}</View>;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Statistics</Text>
            <View style={styles.row}>
                {STATS.map(({label, value, jobs}, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => handleCardPress(label, jobs)}
                    >
                        <View style={styles.stat}>
                            <Text style={styles.value}>{value}</Text>
                            <Text numberOfLines={1} style={styles.label}>{label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Calendar for Jobs Applied */}
            <Text style={styles.calendarTitle}>Jobs Applied Calendar</Text>
            {renderCalendar()}
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Add spacing between cards
        marginBottom: 20,
        flexWrap: 'wrap', // Wrap if there are too many items
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
        width: '30%',
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