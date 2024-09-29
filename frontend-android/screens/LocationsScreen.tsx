import {useContext} from "react";
import JobDataContext from "../context/JobDataContext";
import LocationsList from "../components/LocationsList";

export default function LocationsScreen() {
    const {uniqueLocations} = useContext(JobDataContext);

    return <LocationsList locations={uniqueLocations}/>;
}
