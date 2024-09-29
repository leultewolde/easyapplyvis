export interface JobData {
    Company: string;
    Position: string;
    "Job Link": string;
    Location: string;
    Country: string;
    "Applied At": string;
    Status: string;
}

type JobStatData = {
    data: JobData[];
    length: number;
}

type JobStat = {
    [key: string]: JobStatData;
    success: JobStatData,
    failed: JobStatData
}

export type JobStats = {
    [key: string]: JobStat;
    today: JobStat,
    yesterday: JobStat,
    thisWeek: JobStat,
    thisMonth: JobStat,
    total: JobStat,
}