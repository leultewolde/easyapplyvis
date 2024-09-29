import React, {useContext, useState} from 'react';
import {StackScreenProps} from "@react-navigation/stack";
import JobDataContext from "../context/JobDataContext";
import JobsList from "../components/JobsList";
import {JobData} from "../types";

type StackParamList = {
    JobsListScreen: { jobs: JobData[]; title: string }; // Define the type for the JobsList route params
};

type JobsListScreenProps = StackScreenProps<StackParamList, 'JobsListScreen'>;

export default function JobsListScreen({route, navigation}: JobsListScreenProps) {
    const {jobs} = route.params;
    const {isRefreshing, refreshData} = useContext(JobDataContext);


    return <JobsList
        navigation={navigation}
        jobs={jobs}
        isRefreshing={isRefreshing}
        onRefresh={refreshData}
        enableJobFilters
        enablePaginationControls
    />;
}
