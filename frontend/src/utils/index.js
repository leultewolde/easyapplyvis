import dayjs from "dayjs";

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short', // Use 'short' for abbreviated month
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(date);
};

export const isValidUrl = (value) => {
    try {
        new URL(value);
        return true;
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        return false;
    }
};

export const getJobsCount = (csvData, dateRange) => {
    const now = new Date();

    return csvData.filter((row) => {
        const appliedAt = new Date(row["Applied At"]);

        switch (dateRange) {
            case "today":
                return appliedAt.toDateString() === now.toDateString();
            case "yesterday":
                { const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                return appliedAt.toDateString() === yesterday.toDateString(); }
            case "thisWeek":
                { const thisWeek = new Date();
                    thisWeek.setDate(now.getDate() - 7);
                return appliedAt >= thisWeek && appliedAt <= now; }
            case "thisMonth":
                return appliedAt.getMonth() === now.getMonth() && appliedAt.getFullYear() === now.getFullYear();
            default:
                return false;
        }
    }).length;
};

export const generateChartData = (data) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, 'day').format('YYYY-MM-DD')).reverse();

    const jobCounts = last30Days.reduce((acc, date) => {
        acc[date] = { total: 0, failed: 0 };
        return acc;
    }, {});

    data.forEach(job => {
        const jobDate = dayjs(job['Applied At']).format('YYYY-MM-DD');
        if (jobCounts[jobDate]) {
            jobCounts[jobDate].total += 1;
            if (job['Status'] === 'Failed') {
                jobCounts[jobDate].failed += 1;
            }
        }
    });

    return {last30Days, jobCounts}
};