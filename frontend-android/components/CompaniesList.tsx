import {StackNavigationProp} from "@react-navigation/stack";
import {FlatList, SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect, useState} from "react";
import PaginationControls from "./PaginationControls";
import CompanyLogo from "./CompanyLogo";
import LikeIcon from "./LikeIcon";
import useCompanyData from "../hooks/useCompanyData";
import {isAlreadyLiked} from "../utils";

interface CompaniesListProps {
    companies: string[];
    navigation: StackNavigationProp<any>;
}

export default function CompaniesList({companies}: CompaniesListProps) {

    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 10;
    const [sortedCompanies, setSortedCompanies] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    if (companies && companies.length <= 0) {
        return (
            <View>
                <Text style={styles.loadingText}>No companies found...</Text>
                {/*<Button title="Refresh" onPress={onRefresh}/>*/}
            </View>
        );
    }

    useEffect(() => {
        sortCompaniesByLikes().then(() => {
        });
    }, [companies]);

    // Sort companies based on whether they are liked or not
    const sortCompaniesByLikes = async () => {
        try {
            const sorted = [...companies];
            const sortedByLikes = await Promise.all(
                sorted.map(async (company) => {
                    try {
                        const isLiked = await isAlreadyLiked(company);
                        return {company, isLiked};
                    } catch (error) {
                        console.error(`Error fetching like status for company: ${company}`, error);
                        return {company, isLiked: false}; // Assume not liked on error
                    }
                })
            );

            // Sort liked companies first
            const sortedList = sortedByLikes
                .sort((a, b) => (b.isLiked ? 1 : 0) - (a.isLiked ? 1 : 0))
                .map(item => item.company);
            setSortedCompanies(sortedList);
        } catch (error) {
            console.error("Error sorting companies by likes:", error);
        }
    };

    const filteredCompanies = sortedCompanies.filter((company) => {
        return company.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    let currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);


    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1,
        Math.ceil(filteredCompanies.length / companiesPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    const CompanyItem = ({item}: { item: string }) => {
        const {isLiked, toggleLike, jobs} = useCompanyData(item);

        return (
            <SafeAreaView style={styles.companyItem}>
                <CompanyLogo companyName={item} size={30}/>
                <Text style={styles.companyName}>{item} ({jobs.length} jobs)</Text>
                <LikeIcon size={25} isLiked={isLiked} onPress={toggleLike}/>
            </SafeAreaView>
        );
    }

    const renderItem = ({item}: { item: string }) => <CompanyItem item={item}/>

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search companies"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={currentCompanies}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
            <PaginationControls
                currentPage={currentPage}
                jobsLength={filteredCompanies.length}
                jobsPerPage={companiesPerPage}
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
    companyItem: {
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
    companyName: {
        flex: 1,
    }
});