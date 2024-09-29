import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { BACKGROUND_FETCH_TASK } from "./constants";
import BottomTabNavigation from "./navigation/BottomTabNavigation";
import * as Notifications from "expo-notifications";
import { JobDataProvider } from "./context/JobDataContext";
// if (__DEV__) {
//     require("./ReactotronConfig");
// }
if (__DEV__) {
    console.log("Reactotron Configuring");
    
    require("./ReactotronConfig");
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export default function App() {

    useEffect(() => {
        let isRegistered = false;
        Notifications.requestPermissionsAsync()
            .then(({ status }) => {
                if (status !== 'granted') {
                    alert('You need to enable notifications for this app!');
                    throw new Error("You need to enable notifications for this app!");
                }
                return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
                    minimumInterval: 15 * 60, // 15 minutes
                    stopOnTerminate: false,
                    startOnBoot: true,
                });
            })
            .then(() => {
                isRegistered = true;
            })
            .catch(console.error);


        return () => {
            if (isRegistered) {
                BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK)
                    .then(() => {
                        isRegistered = false;
                    });
            }
        }
    }, []);

    return (
        <JobDataProvider>
            <NavigationContainer>
                <BottomTabNavigation />
            </NavigationContainer>
        </JobDataProvider>
    );
}
