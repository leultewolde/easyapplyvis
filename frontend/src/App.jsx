import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TableHeader from "./components/TableHeader.jsx";
import TableRow from "./components/TableRow.jsx";

import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './styles/App.scss';
import {getJobsCount} from "./utils/index.js";
import Pagination from "./components/Pagination.jsx";
import JobTrendsChart from "./components/JobTrendsChart.jsx";
import Modal from "./components/Modal.jsx";

const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:5000';
const socket = io(backendUrl);

function App() {
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], counts: [] });

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterCountry, setFilterCountry] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Receive initial data from the backend
        socket.on('csvData', (data) => {
            setCsvHeaders(data.headers);
            setCsvData(data.data);
            generateChartData(data.data);
        });

        // Listen for file changes
        socket.on('fileChanged', () => {
            socket.emit('refresh'); // Request updated CSV data
        });

        return () => {
            socket.off('csvData');
            socket.off('fileChanged');
        };
    }, []);

    const jobsToday = getJobsCount(csvData, 'today');
    const jobsYesterday = getJobsCount(csvData, 'yesterday');
    const jobsThisWeek = getJobsCount(csvData, 'thisWeek');
    const jobsThisMonth = getJobsCount(csvData, 'thisMonth');

    const failedJobsCount = csvData.filter(row => row.Status === 'Failed').length;

    const filteredJobs = csvData.filter(job => {
        const matchesSearchTerm = job.Company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.Position.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = filterLocation ? job.Location.toLowerCase().includes(filterLocation.toLowerCase()) : true;
        const matchesCountry = filterCountry ? job.Country.toLowerCase().includes(filterCountry.toLowerCase()) : true;
        const matchesStatus = filterStatus ? job.Status.toLowerCase() === filterStatus.toLowerCase() : true;

        return matchesSearchTerm && matchesLocation && matchesCountry && matchesStatus;
    });

    const generateChartData = (data) => {
        const jobsByDate = {};
        const failedJobsByDate = {};

        // Group job applications by date
        data.forEach((job) => {
            const appliedAtDate = new Date(job['Applied At']).toLocaleDateString();

            // Track total jobs
            if (jobsByDate[appliedAtDate]) {
                jobsByDate[appliedAtDate] += 1;
            } else {
                jobsByDate[appliedAtDate] = 1;
            }

            // Track failed jobs
            if (job.Status === 'Failed') {
                if (failedJobsByDate[appliedAtDate]) {
                    failedJobsByDate[appliedAtDate] += 1;
                } else {
                    failedJobsByDate[appliedAtDate] = 1;
                }
            }
        });

        // Prepare labels and counts for the chart
        const labels = Object.keys(jobsByDate);
        const totalCounts = Object.values(jobsByDate);
        const failedCounts = labels.map(label => failedJobsByDate[label] || 0); // If no failed jobs for a date, set 0

        setChartData({ labels, totalCounts, failedCounts });
    };


    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="table-container">
            <h1>My Jobs</h1>

            <div className="job-stats">
                <p>Today: <b>{jobsToday}</b></p>
                <p>Yesterday: <b>{jobsYesterday}</b></p>
                <p>This Week: <b>{jobsThisWeek}</b></p>
                <p>This Month: <b>{jobsThisMonth}</b></p>
                <p>Failed: <b>{failedJobsCount}</b></p>
                {/* Button to open the chart in a popup */}
                <button className="button" onClick={() => setShowModal(true)}>View Job Trends</button>

            </div>

            {/* Modal for displaying the chart */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <JobTrendsChart data={chartData} />
            </Modal>
            {/* Search Bar and Filters */}
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
            <Pagination
                jobsPerPage={jobsPerPage}
                totalJobs={filteredJobs.length}
                paginate={paginate}
                currentPage={currentPage}
            />
            <table>
                <TableHeader headers={csvHeaders}/>
                <tbody>
                <TransitionGroup component={null}>
                    {currentJobs.map((row, index) => (
                        <CSSTransition
                            key={index}
                            timeout={500}
                            classNames="fade">
                            <TableRow row={row}/>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                </tbody>
            </table>
            <Pagination
                jobsPerPage={jobsPerPage}
                totalJobs={filteredJobs.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    )
}

export default App
