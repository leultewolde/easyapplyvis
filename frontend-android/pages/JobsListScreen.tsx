import React, {useContext, useState} from 'react';
import {StackScreenProps} from "@react-navigation/stack";
import JobDataContext, {JobData} from "../context/JobDataContext";
import JobsList from "../components/JobsList";

type StackParamList = {
    Stats: undefined;
    JobsListScreen: { jobs: JobData[]; title: string }; // Define the type for the JobsList route params
};

type JobsListScreenProps = StackScreenProps<StackParamList, 'JobsListScreen'>;

export default function JobsListScreen({route}: JobsListScreenProps) {
    const {jobs, title} = route.params;
    const {refreshData} = useContext(JobDataContext);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const onRefresh = () => {
        setIsRefreshing(true);
        refreshData();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return <JobsList
        title={title}
        jobs={jobs}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        enableJobFilters
        enablePaginationControls
    />;
}
