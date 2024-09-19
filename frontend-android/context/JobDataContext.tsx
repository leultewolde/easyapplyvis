import React, {createContext, useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JobData {
    Company: string;
    Position: string;
    "Job Link": string;
    Location: string;
    Country: string;
    "Applied At": string;
    Status: string;
}

type JobDataContextProps = {
    data: JobData[],
    backendIpAddress: string,
    saveBackendUrl: (newIP:string) => void,
    refreshData: () => void
}

const JobDataContext = createContext<JobDataContextProps>({
    data: [],
    backendIpAddress: '',
    saveBackendUrl: () => {},
    refreshData: () => {}
});

const DEFAULT_IP_ADDRESS:string = "192.168.1.109";
const DEFAULT_PORT:string = "5000";

export function JobDataProvider({children}: {children: React.ReactNode}) {
    const [data, setData] = useState<JobData[]>([]);
    const [backendIpAddress, setBackendIpAddress] = useState<string>(DEFAULT_IP_ADDRESS);
    const [socket, setSocket] = useState<Socket|null>(null);

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

    const constructUrl = (ip:string) => {
        return `http://${ip}:${DEFAULT_PORT}`;
    }

    const initializeSocket = (ip:string) => {
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

    const saveBackendUrl = async (newIP:string) => {
        try {
            await AsyncStorage.setItem('backendIp', newIP);
            setBackendIpAddress(newIP);
            initializeSocket(newIP);
        } catch (error) {
            console.error('Error saving backend URL:', error);
        }
    };

    const refreshData = () => {
        if (socket && socket.connected) {
            console.log('Emitting refresh event');
            socket.emit('refresh'); // Emit the refresh event to the server
        } else {
            console.error('Socket not connected, unable to refresh data');
        }
    };

    return (
        <JobDataContext.Provider value={{data, backendIpAddress, saveBackendUrl, refreshData}}>
            {children}
        </JobDataContext.Provider>
    );
}

export default JobDataContext;