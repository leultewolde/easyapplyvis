import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Linking, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import JobDataContext from "../context/JobDataContext";
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from "@react-native-picker/picker";
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

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

    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        // Request notification permissions on app load
        const requestPermissions = async () => {
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('You need to enable notifications for this app!');
            }
        };

        requestPermissions().then(()=>{});
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
                minimumInterval: 15 * 60, // 15 minutes
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

    const filteredJobs = data.filter((job) => {
        const matchesSearch = job.Position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.Company.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = selectedLocation === 'all' || job.Location === selectedLocation;
        const matchesStatus = selectedStatus === 'all' || job.Status === selectedStatus;

        return matchesSearch && matchesLocation && matchesStatus;
    });

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredJobs.length / jobsPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    const renderItem = ({item}) => (
        <View style={styles.item}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.Position}</Text>
                <Text style={styles.company} numberOfLines={1} ellipsizeMode="tail">{item.Company}</Text>
            </View>

            <Text style={styles.location}>
                <Icon name="location-outline" size={14} color="#4A90E2"/> {item.Location}, {item.Country}
            </Text>

            <Text style={styles.appliedAt}>
                <Icon name="calendar-outline" size={14}
                      color="#4A90E2"/> {moment(item["Applied At"]).format('MMM Do YYYY, h:mm a')}
            </Text>

            <TouchableOpacity onPress={() => Linking.openURL(item["Job Link"])} style={styles.linkContainer}>
                <Icon name="link-outline" size={14} color="#4A90E2"/>
                <Text style={styles.link}>View Job Posting</Text>
            </TouchableOpacity>

            <Text style={[styles.status, item.Status === 'Success' ? styles.success : styles.failed]}>
                <Icon name={item.Status === 'Success' ? 'checkmark-circle-outline' : 'close-circle-outline'} size={16}
                      color={item.Status === 'Success' ? 'green' : 'red'}/>{' '}
                {item.Status}
            </Text>
        </View>
    );

    // Handle changing the page

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Position or Company"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <View style={styles.filterContainer}>
                    <Picker
                        selectedValue={selectedLocation}
                        onValueChange={(value) => setSelectedLocation(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="All Locations" value="all"/>
                        {/* Add location options dynamically */}
                        {Array.from(new Set(data.map(job => job.Location))).map((location, index) => (
                            <Picker.Item key={index} label={location} value={location}/>
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="All Statuses" value="all"/>
                        <Picker.Item label="Success" value="Success"/>
                        <Picker.Item label="Failed" value="Failed"/>
                    </Picker>
                </View>
            </View>
            {filteredJobs && filteredJobs.length <= 0 ? (
                <Text style={styles.loadingText}>No jobs found...</Text>
            ) : (
                <>
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

                    {/* Customized Pagination Controls */}
                    <View style={styles.pagination}>
                        <TouchableOpacity
                            style={[styles.button, currentPage === 1 ? styles.disabledButton : null]}
                            onPress={prevPage}
                            disabled={currentPage === 1}>
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>

                        <Text
                            style={styles.pageNumber}>Page {currentPage} of {Math.ceil(filteredJobs.length / jobsPerPage)}</Text>

                        <TouchableOpacity
                            style={[styles.button, currentPage === Math.ceil(filteredJobs.length / jobsPerPage) ? styles.disabledButton : null]}
                            onPress={nextPage}
                            disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        marginBottom: 5,
        marginHorizontal: 5,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 15
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    picker: {
        height: 40,
        flex: 1,
        marginRight: 10,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    list: {
        paddingHorizontal: 20,
        // paddingTop: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    company: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
        maxWidth: 150,
        flexShrink: 1
    },
    location: {
        fontSize: 14,
        color: '#4A90E2',
        marginBottom: 5,
    },
    appliedAt: {
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    link: {
        color: '#4A90E2',
        textDecorationLine: 'underline',
        marginLeft: 5,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    success: {
        color: 'green',
    },
    failed: {
        color: 'red',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    pageNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});

export default MainScreen;
