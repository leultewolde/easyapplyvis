import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const JobTrendsChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Total Jobs Applied',
                data: data.totalCounts,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Failed Jobs',
                data: data.failedCounts,
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
                text: 'Job Applications Over Time',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

JobTrendsChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        totalCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
        failedCounts: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired
};

export default JobTrendsChart;
