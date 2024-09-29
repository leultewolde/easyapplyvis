import {FlatList, SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useState} from "react";
import PaginationControls from "./PaginationControls";
import {getStateAbbrFromLocation} from "../utils";
import StateFlag from "./StateFlag";


export default function LocationsList({locations}: { locations: string[] }) {

    const [currentPage, setCurrentPage] = useState(1);
    const locationsPerPage = 10;

    const [searchQuery, setSearchQuery] = useState('');


    if (locations && locations.length <= 0) {
        return (
            <View>
                <Text style={styles.loadingText}>No companies found...</Text>
                {/*<Button title="Refresh" onPress={onRefresh}/>*/}
            </View>
        );
    }

    const filteredLocations = locations.filter((location) => {
        return location.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const indexOfLastLocation = currentPage * locationsPerPage;
    const indexOfFirstCompany = indexOfLastLocation - locationsPerPage;
    let currentLocations = filteredLocations.slice(indexOfFirstCompany, indexOfLastLocation);


    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1,
        Math.ceil(filteredLocations.length / locationsPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    const LocationItem = ({item}: { item: string }) => {
        const stateAbbr = getStateAbbrFromLocation(item);
        return (
            <SafeAreaView style={styles.locationItem}>
                <StateFlag abbr={stateAbbr} size={30}/>
                <Text style={styles.locationText}>{item}</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({item}: { item: string }) => <LocationItem item={item}/>

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search locations"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={currentLocations}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
            <PaginationControls
                currentPage={currentPage}
                jobsLength={filteredLocations.length}
                jobsPerPage={locationsPerPage}
                prevPage={prevPage}
                nextPage={nextPage}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 20
    },
    list: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10
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
    locationItem: {
        // padding: 10,
        padding: 15,
        // marginBottom: 10,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,

        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    locationText: {
        flex: 1,
    }
});