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