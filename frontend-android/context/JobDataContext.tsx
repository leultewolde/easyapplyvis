import React, {createContext, useEffect, useState} from 'react';
import {JobData, JobStats} from "../types";
import {
    constructUrl,
    DEFAULT_STATS,
    loadFromStorage,
    saveToStorage,
    stats,
    uniqueCompanies,
    uniqueLocations
} from "../utils";
import {DEFAULT_IP_ADDRESS} from "../constants";
import io, {Socket} from "socket.io-client";

type JobDataContextProps = {
    data: JobData[],
    backendIpAddress: string,
    isRefreshing: boolean,
    jobStats: JobStats,
    uniqueCompanies: string[],
    uniqueLocations: string[],
    saveBackendUrl: (newIP: string) => void,
    refreshData: () => void
}

const JobDataContext = createContext<JobDataContextProps>({
    data: [],
    backendIpAddress: '',
    isRefreshing: false,
    jobStats: DEFAULT_STATS,
    uniqueCompanies: [],
    uniqueLocations: [],
    saveBackendUrl: () => {
    },
    refreshData: () => {
    }
});

export function JobDataProvider({children}: { children: React.ReactNode }) {
    const [data, setData] = useState<JobData[]>([]);
    const [backendIpAddress, setBackendIpAddress] = useState<string>(DEFAULT_IP_ADDRESS);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadFromStorage("backendIp")
            .then((value) => {
                const finalIp = value || DEFAULT_IP_ADDRESS;
                setBackendIpAddress(finalIp);
            })
            .catch((reason) => {
                console.error('Error loading backend URL from storage:', reason);
            });
    }, []);

    useEffect(() => {
        const url = constructUrl(backendIpAddress);
        const socketInstance = io(url);

        setSocket(socketInstance);
    }, [backendIpAddress]);

    const handleCsvData = (newData:any) => {
        setData(newData.data);
        setIsRefreshing(false);
    }

    useEffect(() => {
        if(socket) {
            socket.on('csvData', handleCsvData);
            socket.on('fileChanged', refreshData);

            return () => {
                socket.disconnect();
            };
        }
    }, [socket]);

    const saveBackendUrl = async (newIP: string) => {
        try {
            await saveToStorage('backendIp', newIP);
            setBackendIpAddress(newIP);
        } catch (error) {
            console.error('Error saving backend URL:', error);
        }
    };

    const refreshData = () => {
        if (socket && socket.connected) {
            console.log('Emitting refresh event');
            setIsRefreshing(true);
            socket.emit('refresh');
        } else {
            setIsRefreshing(false);
            console.error('Socket not connected, unable to refresh data');
        }
    };

    const jobStats = stats(data);

    return (
        <JobDataContext.Provider value={{
            data,
            backendIpAddress,
            isRefreshing,
            jobStats,
            uniqueCompanies: uniqueCompanies(data),
            uniqueLocations: uniqueLocations(data),
            saveBackendUrl,
            refreshData
        }}>
            {children}
        </JobDataContext.Provider>
    );
}

export default JobDataContext;