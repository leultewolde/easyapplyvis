import {useContext} from "react";
import JobDataContext from "../context/JobDataContext";
import {StackScreenProps} from "@react-navigation/stack";
import CompaniesList from "../components/CompaniesList";

export default function CompaniesScreen({navigation}: StackScreenProps<any>) {
    const {uniqueCompanies} = useContext(JobDataContext);

    return <CompaniesList
        companies={uniqueCompanies}
        navigation={navigation}/>
}
