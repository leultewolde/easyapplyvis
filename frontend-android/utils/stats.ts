import moment from "moment/moment";
import {JobData, JobStats} from "../types";

export const isToday = (date: string) => moment(date).isSame(moment(), 'day');
export const isYesterday = (date: string) => moment(date).isSame(moment().subtract(1, 'days'), 'day');
export const isThisWeek = (date: string) => moment(date).isSame(moment(), 'week');
export const isThisMonth = (date: string) => moment(date).isSame(moment(), 'month');


const filterDataByStatusAndDate = (data: JobData[], status: string) => {
    const filteredData = filterDataByStatus(data, status);
    return (filterFunc: ((date: string) => boolean) | null) => {
        if (!filterFunc) return filteredData;
        return filteredData.filter((job) => filterFunc(job['Applied At']));
    }
}

const filterDataByStatus = (data: JobData[], status: string) => {
    return data.filter((job) => job.Status === status);
}

const generateStats = (filter: ((date: string) => boolean) | null) => {
    return (successDataFilter: (filter: ((date: string) => boolean) | null) => JobData[],
            failedDataFilter: (filter: ((date: string) => boolean) | null) => JobData[]) => {

        const filteredFailedData = failedDataFilter(filter);
        const filteredSuccessData = successDataFilter(filter);
        return {
            success: {
                data: filteredSuccessData, length: filteredSuccessData.length
            },
            failed: {
                data: filteredFailedData, length: filteredFailedData.length
            }
        }
    }
}

export const DEFAULT_STATS: JobStats = {
    today: {success: {data: [], length: 0}, failed: {data: [], length: 0}},
    yesterday: {success: {data: [], length: 0}, failed: {data: [], length: 0}},
    thisWeek: {success: {data: [], length: 0}, failed: {data: [], length: 0}},
    thisMonth: {success: {data: [], length: 0}, failed: {data: [], length: 0}},
    total: {success: {data: [], length: 0}, failed: {data: [], length: 0}},
}

export const stats = (data: JobData[]): JobStats => {
    const filterFailedData = filterDataByStatusAndDate(data, 'Failed');
    const filterSuccessData = filterDataByStatusAndDate(data, 'Success');

    return {
        today: generateStats(isToday)(filterSuccessData, filterFailedData),
        yesterday: generateStats(isYesterday)(filterSuccessData, filterFailedData),
        thisWeek: generateStats(isThisWeek)(filterSuccessData, filterFailedData),
        thisMonth: generateStats(isThisMonth)(filterSuccessData, filterFailedData),
        total: generateStats(null)(filterSuccessData, filterFailedData),
    }
}

export const successfulJobs = (data: JobData[]) => data.filter((value) => value.Status === "Success");
export const uniqueCompanies = (data: JobData[]) => [...new Set(successfulJobs(data).map(item => item.Company))];
export const uniqueLocations = (data: JobData[]) => [...new Set(successfulJobs(data).map(item => item.Location))];