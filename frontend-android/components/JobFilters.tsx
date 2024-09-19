import React from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {Picker} from "@react-native-picker/picker";

interface JobFiltersProps {
    searchQuery: string;
    selectedLocation: string;
    selectedStatus: string;
    locations: string[];
    changeSearchQuery: (value: string) => void;
    changeSelectedLocation: (value: string) => void;
    changeSelectedStatus: (value: string) => void;
}

export default function JobFilters({
                                       searchQuery,
                                       selectedLocation,
                                       selectedStatus,
                                       changeSearchQuery,
                                       changeSelectedLocation,
                                       changeSelectedStatus,
                                       locations
                                   }: JobFiltersProps) {

    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by Position or Company"
                value={searchQuery}
                onChangeText={changeSearchQuery}
            />

            <View style={styles.filterContainer}>
                <Picker
                    selectedValue={selectedLocation}
                    onValueChange={(value) => changeSelectedLocation(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="All Locations" value="all"/>

                    {locations.map((location, index) => (
                        <Picker.Item key={index} label={location} value={location}/>
                    ))}
                </Picker>

                <Picker
                    selectedValue={selectedStatus}
                    onValueChange={(value) => changeSelectedStatus(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="All Statuses" value="all"/>
                    <Picker.Item label="Success" value="Success"/>
                    <Picker.Item label="Failed" value="Failed"/>
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
})