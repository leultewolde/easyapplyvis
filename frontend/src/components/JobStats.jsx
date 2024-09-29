import {useContext, useState} from "react";
import JobsContext from "../context/JobsContext.jsx";
import ChartModal from "./ChartModal.jsx";


export default function JobStats() {

    const {stats} = useContext(JobsContext);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="job-stats">
            <div className="job-stat__item">
                <div className="stat-content">
                    <p className="stat-number">{stats.today}</p>
                    <p className="stat-label">Today</p>
                </div>
            </div>
            <div className="job-stat__item">
                <div className="stat-content">
                    <p className="stat-number">{stats.yesterday}</p>
                    <p className="stat-label">Yesterday</p>
                </div>
            </div>
            <div className="job-stat__item">
                <div className="stat-content">
                    <p className="stat-number">{stats.thisWeek}</p>
                    <p className="stat-label">This Week</p>
                </div>
            </div>
            <div className="job-stat__item">
                <div className="stat-content">
                    <p className="stat-number">{stats.thisMonth}</p>
                    <p className="stat-label">This Month</p>
                </div>
            </div>
            <div className="job-stat__item">
                <div className="stat-content">
                    <p className="stat-number">{stats.failedCount}</p>
                    <p className="stat-label">Failed</p>
                </div>
            </div>
            <div className="button-container">
                <button className="button-white" onClick={() => setShowModal(true)}>View Job Trends</button>
                <ChartModal showModal={showModal} setShowModal={setShowModal}/>
            </div>
        </div>
    );
}