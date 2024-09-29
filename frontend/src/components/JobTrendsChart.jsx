import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement, TimeScale,
    Title,
    Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import {useContext} from "react";
import JobsContext from "../context/JobsContext.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const JobTrendsChart = () => {
    const {chartData} = useContext(JobsContext);

    const data = {
        labels: chartData.last30Days,
        datasets: [
            {
                label: 'Total Jobs Applied',
                data: chartData.last30Days.map(date => chartData.jobCounts[date].total),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Failed Jobs',
                data: chartData.last30Days.map(date => chartData.jobCounts[date].failed),
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
                fill: true,
                tension: 0.4,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Job Applications Over the Last 30 Days',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MMM dd',
                    displayFormats: {
                        day: 'MMM dd',
                    },
                },
            },
        },
    };

    return <Line data={data} options={options}/>;
};

export default JobTrendsChart;
