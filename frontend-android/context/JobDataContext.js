import React, {createContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobDataContext = createContext({
    data: [],
    backendIpAddress: '',
    saveBackendUrl: () => {},
    refreshData: () => {}
});

const DEFAULT_IP_ADDRESS = "192.168.1.109";
const DEFAULT_PORT = "5000";

export function JobDataProvider({children}) {
    const [data, setData] = useState([]);
    const [backendIpAddress, setBackendIpAddress] = useState(DEFAULT_IP_ADDRESS);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const loadBackendUrl = async () => {
            try {
                const storedIP = await AsyncStorage.getItem('backendIp');
                const finalIP = storedIP || DEFAULT_IP_ADDRESS;
                setBackendIpAddress(finalIP);
                initializeSocket(finalIP);
            } catch (error) {
                console.error('Error loading backend URL from storage:', error);
            }
        };

        loadBackendUrl();
    }, []);

    const constructUrl = (ip) => {
        return `http://${ip}:${DEFAULT_PORT}`;
    }

    const initializeSocket = (ip) => {
        const url = constructUrl(ip);
        const socketInstance = io(url);
        setSocket(socketInstance);

        socketInstance.on('csvData', (newData) => {
            setData(newData.data);
        });

        return () => {
            socketInstance.disconnect();
        };
    };

    const saveBackendUrl = async (newIP) => {
        try {
            await AsyncStorage.setItem('backendIp', newIP);
            setBackendIpAddress(newIP);
            initializeSocket(newIP);
        } catch (error) {
            console.error('Error saving backend URL:', error);
        }
    };

    const refreshData = () => {
        if (socket) {
            socket.emit('refresh'); // Trigger data refresh on the server
        }
    };

    return (
        <JobDataContext.Provider value={{data, backendIpAddress, saveBackendUrl, refreshData}}>
            {children}
        </JobDataContext.Provider>
    );
}

export default JobDataContext;