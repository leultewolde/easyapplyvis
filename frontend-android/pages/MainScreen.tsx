import React, {useContext, useEffect, useState} from 'react';
import JobDataContext from "../context/JobDataContext";
import * as Notifications from 'expo-notifications';
import JobsList from "../components/JobsList";

const MainScreen = () => {

    const {data, refreshData} = useContext(JobDataContext);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notificationId, setNotificationId] = useState<string | null>(null);

    useEffect(() => {
        if (data && data.length > 0) {
            // Cancel the previous notification (if any) before scheduling a new one
            if (notificationId) {
                Notifications.cancelScheduledNotificationAsync(notificationId);
            }

            // Schedule a new notification with the updated job count
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Job Applications',
                    body: `You have applied for ${data.length} jobs.`,
                },
                trigger: null, // Trigger immediately
            }).then((id) => {
                // Store the notification ID so it can be canceled later
                setNotificationId(id);
            });
        }
    }, [data]);

    const onRefresh = () => {
        setIsRefreshing(true);
        refreshData();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return <JobsList
        jobs={data}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        enableRefresh
        enableJobFilters
        enablePaginationControls
    />;

};

export default MainScreen;
