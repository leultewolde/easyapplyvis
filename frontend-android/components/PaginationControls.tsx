import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

interface PaginationControlsProps {
    currentPage: number;
    jobsLength: number;
    jobsPerPage: number;
    prevPage: () => void;
    nextPage: () => void;
}

export default function PaginationControls({
                                               currentPage,
                                               prevPage,
                                               nextPage,
                                               jobsLength,
                                               jobsPerPage
                                           }: PaginationControlsProps) {
    return (
        <View style={styles.pagination}>
            <TouchableOpacity
                style={[styles.button, currentPage === 1 ? styles.disabledButton : null]}
                onPress={prevPage}
                disabled={currentPage === 1}>
                <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <Text
                style={styles.pageNumber}>Page {currentPage} of {Math.ceil(jobsLength / jobsPerPage)}</Text>

            <TouchableOpacity
                style={[styles.button, currentPage === Math.ceil(jobsLength / jobsPerPage) ? styles.disabledButton : null]}
                onPress={nextPage}
                disabled={currentPage === Math.ceil(jobsLength / jobsPerPage)}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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