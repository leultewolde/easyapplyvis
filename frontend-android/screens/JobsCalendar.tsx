import React, {useContext} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment/moment";
import JobDataContext from "../context/JobDataContext";
import {StackNavigationProp} from "@react-navigation/stack";

export default function JobsCalendar({navigation}: { navigation: StackNavigationProp<any> }) {
    const {data} = useContext(JobDataContext);

    const getJobsByDate = (selectedDate: string) => {
        return data.filter((job) => moment(job['Applied At']).format('YYYY-MM-DD') === selectedDate);
    };

    const handleDayPress = (day: number) => {
        const selectedDate = moment().date(day).format('YYYY-MM-DD');
        const jobsOnSelectedDate = getJobsByDate(selectedDate);
        navigation.navigate('JobsListScreen', {jobs: jobsOnSelectedDate,
            title: `${moment().date(day).format('MMM DD, YYYY')} (${jobsOnSelectedDate.length})`});
    };

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
}

const styles = StyleSheet.create({
    calendarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    calendarGrid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    calendarDay: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 5,
        borderRadius: 4,
    },
    calendarDate: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    calendarCount: {
        fontSize: 10,
        color: '#999',
    }
});