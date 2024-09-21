const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

const csvFilePath = 'data/job-applications.csv';

const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        {id: 'company', title: 'Company'},
        {id: 'position', title: 'Position'},
        {id: 'link', title: 'Job Link'},
        {id: 'location', title: 'Location'},
        // {id: 'salary', title: 'Salary'},
        {id: 'country', title: 'Country'},
        {id: 'dateApplied', title: 'Applied At'}
    ],
    append: fs.existsSync(csvFilePath)
});

function getAllJobs() {
    return new Promise((resolve, reject) => {
        const entries = [];

        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
                entries.push(row);
            })
            .on('end', () => {
                resolve(entries);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

function compareJobs(newJob, existingJob) {

    const mappedNewJob = {
        Company: newJob.company,
        Position: newJob.position,
        'Job Link': newJob.link,
        Location: newJob.location,
        Country: newJob.country,
        // 'Applied At': newJob.dateApplied
    };

    // Compare only common properties between new and existing jobs
    const commonKeys = Object.keys(mappedNewJob).filter(key => key in existingJob);

    // Check if all common keys have the same values
    return commonKeys.every(key => mappedNewJob[key] === existingJob[key]);
}

function jobAlreadyExists(job) {
    return getAllJobs()
        .then((data) => {
            return data.some(existingObject => compareJobs(job, existingObject))
        })
        .catch((err) => {
            throw err;
        });
}

function fetchLastFiveEntries() {
    return getAllJobs()
        .then((data) => {
            return data.sort((a, b) => new Date(b['Applied At']) - new Date(a['Applied At'])).slice(0, 5);
        })
        .catch((err) => {
            throw err;
        });
}

function writeJobToCSV(record) {
    return csvWriter.writeRecords([record]);
}

module.exports = {jobAlreadyExists, fetchLastFiveEntries, writeJobToCSV};