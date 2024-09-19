import React, {useContext, useEffect, useState} from 'react';
import JobDataContext from "../context/JobDataContext";
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import JobsList from "../components/JobsList";

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        console.log('Background fetch running...');

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Job Applications',
                body: `You have applied for 0 jobs`,
            },
            trigger: null, // Show the notification immediately
        });

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error(error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

const MainScreen = () => {

    const {data, refreshData} = useContext(JobDataContext);

    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Request notification permissions on app load
        const requestPermissions = async () => {
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('You need to enable notifications for this app!');
            }
        };

        requestPermissions();
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Job Applications',
                    body: `You have applied for ${data.length} jobs`,
                },
                trigger: null, // This will show the notification immediately
            });
        }
    }, [data]);

    useEffect(() => {
        const setupBackgroundFetch = async () => {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
                minimumInterval: 60 * 60, // 15 minutes
                stopOnTerminate: false,
                startOnBoot: true,
            });
        };

        setupBackgroundFetch();

        return () => {
            BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK).then(r => console.log(r)); // Clean up on unmount
        };
    }, []);

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
