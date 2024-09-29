import {Button, FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";
import JobListItem from "./JobListItem";
import JobFilters from "./JobFilters";
import PaginationControls from "./PaginationControls";
import {JobData} from "../types";
import {StackNavigationProp} from "@react-navigation/stack";

interface JobListProps {
    title?: string;
    jobs: JobData[],
    isRefreshing: boolean,
    onRefresh: () => void,
    enableRefresh?: boolean,
    enableJobFilters?: boolean,
    enablePaginationControls?: boolean,
    navigation: StackNavigationProp<any>
}

export default function JobsList({
                                     title,
                                     jobs,
                                     isRefreshing,
                                     onRefresh,
                                     navigation,
                                     enableRefresh = false,
                                     enableJobFilters = false,
                                     enablePaginationControls = false,
                                 }: JobListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const renderItem = ({item}: { item: JobData }) =>
        <JobListItem
            job={item}
            onPress={() => navigation.navigate('JobItemScreen', {job: item})}/>

    if (jobs && jobs.length <= 0) {
        return (
            <View>
                <Text style={styles.loadingText}>No jobs found...</Text>
                <Button title="Refresh" onPress={onRefresh}/>
            </View>
        );
    }

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.Position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.Company.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = selectedLocation === 'all' || job.Location === selectedLocation;
        const matchesStatus = selectedStatus === 'all' || job.Status === selectedStatus;

        return matchesSearch && matchesLocation && matchesStatus;
    });

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    let currentJobs: JobData[];
    if (enablePaginationControls) {
        currentJobs = (enableJobFilters ? filteredJobs : jobs).slice(indexOfFirstJob, indexOfLastJob);
    } else {
        currentJobs = (enableJobFilters ? filteredJobs : jobs);
    }

    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredJobs.length / jobsPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            {enableJobFilters && (
                <JobFilters searchQuery={searchQuery}
                            selectedLocation={selectedLocation}
                            selectedStatus={selectedStatus}
                            locations={Array.from(new Set(jobs.map(job => job.Location)))}
                            changeSearchQuery={setSearchQuery}
                            changeSelectedLocation={setSelectedLocation}
                            changeSelectedStatus={setSelectedStatus}/>
            )}
            {isRefreshing && (<Text style={styles.loadingText}>Refreshing jobs...</Text>)}
            {enableRefresh ? (
                <FlatList
                    data={currentJobs}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            tintColor="#4A90E2"
                            title="Pull to refresh"
                            colors={['#4A90E2']}
                        />
                    }
                />
            ) : (
                <FlatList
                    data={currentJobs}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
            {enablePaginationControls && (
                <PaginationControls
                    currentPage={currentPage}
                    jobsLength={filteredJobs.length}
                    jobsPerPage={jobsPerPage}
                    prevPage={prevPage}
                    nextPage={nextPage}/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        paddingHorizontal: 20,
    },
    loadingText: {
        textAlign: 'center',
        padding: 10,
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
});