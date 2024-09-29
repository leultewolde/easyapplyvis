import {useContext} from "react";
import JobsContext from "../context/JobsContext.jsx";

export default function SearchFilters() {

    const {
        searchTerm,
        filterLocation,
        filterCountry,
        filterStatus,
        setSearchTerm,
        setFilterLocation,
        setFilterCountry,
        setFilterStatus
    } = useContext(JobsContext);

    return (
        <div className="filters">
            <input
                type="text"
                placeholder="Search by Company or Position"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
                type="text"
                placeholder="Filter by Location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
            />
            <input
                type="text"
                placeholder="Filter by Country"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
            />
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
            </select>
        </div>
    )
}