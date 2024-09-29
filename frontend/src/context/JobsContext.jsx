import {createContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import {generateChartData, getJobsCount} from "../utils/index.js";



const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:5000';
const socket = io(backendUrl);

const PAGE_RANGE_PER_PAGE = 10;

const JobsContext = createContext({
    jobs: [],
    headers: [],
    totalPages: 0,
    currentPage: 0,
    pageRange: {start: 1, end: PAGE_RANGE_PER_PAGE},
    chartData: {last30Days:[], jobCounts:{}},
    stats: {},
    goToPage: () => {},
    toPrevPageRange: () => {},
    toNextPageRange: () => {},
    searchTerm: "",
    filterLocation: "",
    filterCountry: "",
    filterStatus: "",
    setSearchTerm: () => {},
    setFilterLocation: () => {},
    setFilterCountry: () => {},
    setFilterStatus: () => {},
});

export function JobsProvider({ children }) {
    const [csvData, setCsvData] = useState([]);
    const [headers, setHeaders] = useState([]);

    const [chartData, setChartData] = useState({last30Days:[], jobCounts:{}});

    const [searchTerm, setSearchTerm] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterCountry, setFilterCountry] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);

    const [pageRange, setPageRange] = useState({start: 1, end: PAGE_RANGE_PER_PAGE});

    useEffect(() => {
        const handleCsvData = (data) => {
            setHeaders(data.headers);
            setCsvData(data.data);
            setChartData(generateChartData(data.data));
        };
        const handleFileChanged = () => {
            console.log("File Changed..")
            socket.emit('refresh');
        };

        socket.on('csvData', handleCsvData);

        socket.on('fileChanged', handleFileChanged);

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });

        return () => {
            socket.off('csvData', handleCsvData);
            socket.off('fileChanged', handleFileChanged);
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, []);

    const filteredJobs = csvData.filter(job => {
        const matchesSearchTerm = job['Company'].toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.Position.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = filterLocation ? (job['Location']||"").toLowerCase().includes(filterLocation.toLowerCase()) : true;
        const matchesCountry = filterCountry ? job['Country'].toLowerCase().includes(filterCountry.toLowerCase()) : true;
        const matchesStatus = filterStatus ? job['Status'].toLowerCase() === filterStatus.toLowerCase() : true;

        return matchesSearchTerm && matchesLocation && matchesCountry && matchesStatus;
    });

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handlePrevRange = () => {
        const newStart = Math.max(pageRange.start - PAGE_RANGE_PER_PAGE, 1);
        const newEnd = newStart + (PAGE_RANGE_PER_PAGE - 1);
        setPageRange({start: newStart, end: newEnd});
    }

    const handleNextRange = () => {
        const newStart = Math.min(pageRange.start + PAGE_RANGE_PER_PAGE, totalPages - (PAGE_RANGE_PER_PAGE - 1));
        const newEnd = Math.min(newStart + (PAGE_RANGE_PER_PAGE - 1), totalPages);
        setPageRange({start: newStart, end: newEnd});
    }

    return (
        <JobsContext.Provider value={{
            jobs: currentJobs,
            chartData,
            headers,
            searchTerm,
            filterLocation,
            filterCountry,
            filterStatus,
            currentPage,
            totalPages,
            pageRange,
            stats: {
                today: getJobsCount(csvData, 'today'),
                yesterday: getJobsCount(csvData, 'yesterday'),
                thisWeek: getJobsCount(csvData, 'thisWeek'),
                thisMonth: getJobsCount(csvData, 'thisMonth'),
                failedCount: csvData.filter(row => row['Status'] === 'Failed').length,
            },
            goToPage: paginate,
            toPrevPageRange: handlePrevRange,
            toNextPageRange: handleNextRange,
            setSearchTerm,
            setFilterLocation,
            setFilterCountry,
            setFilterStatus,
        }}>
            {children}
        </JobsContext.Provider>
    )
}

JobsProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default JobsContext;