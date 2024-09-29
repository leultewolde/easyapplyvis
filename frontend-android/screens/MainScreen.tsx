import React, {useContext, useEffect, useState} from 'react';
import JobDataContext from "../context/JobDataContext";
import * as Notifications from 'expo-notifications';
import JobsList from "../components/JobsList";
import {StackNavigationProp} from "@react-navigation/stack";

export default function MainScreen({navigation}: { navigation: StackNavigationProp<any> }) {

    const {data, jobStats, isRefreshing, refreshData} = useContext(JobDataContext);

    const [notificationId, setNotificationId] = useState<string | null>(null);

    useEffect(() => {
        if (data && data.length > 0) {
            // Cancel the previous notification (if any) before scheduling a new one
            if (notificationId) {
                Notifications.cancelScheduledNotificationAsync(notificationId).then(r => {
                });
            }

            // Schedule a new notification with the updated job count
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Job Applications',
                    body: `You have applied for ${jobStats.today.success.length} jobs today.`,
                },
                trigger: null, // Trigger immediately
            }).then((id) => {
                // Store the notification ID so it can be canceled later
                setNotificationId(id);
            });
        }
    }, [data]);

    return <JobsList
        navigation={navigation}
        jobs={data}
        isRefreshing={isRefreshing}
        onRefresh={refreshData}
        enableRefresh
        enableJobFilters
        enablePaginationControls
    />;

};
