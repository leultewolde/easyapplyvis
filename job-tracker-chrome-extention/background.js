// const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Job Application Tracker Extension Installed');
});

// Handle action (like clicking the extension icon)
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

// // Listen for messages from the content script (when a job is applied)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'jobApplied') {
        console.log('Job Applied: ', request.job);

        // Retrieve jobs, send to backend, and store the updated list
        // updateJobsList(request.job);
        sendResponse({ status: 'success' });
    }
    return true; // Keep the messaging channel open for sendResponse
});
// Function to check and delete expired jobs periodically
// function getJobsFromStorage(callback) {
//     chrome.storage.local.get({ jobs: [] }, function(result) {
//         callback(result.jobs);
//     });
// }
// function filterExpiredJobs(jobs) {
//     const now = Date.now();
//     return jobs.filter(job => {
//         const timeDifference = now - job.timestamp;
//         return timeDifference < EXPIRATION_TIME; // Keep jobs that are less than 24 hours old
//     });
// }
// // Function to save updated jobs list to local storage
// function saveJobsToStorage(jobs, callback) {
//     chrome.storage.local.set({ jobs: jobs }, function() {
//         if (callback) callback();
//     });
// }
// function checkAndDeleteExpiredJobs() {
//     getJobsFromStorage(function(jobs) {
//         const recentJobs = filterExpiredJobs(jobs);
//         saveJobsToStorage(recentJobs);
//         // console.log('Expired jobs deleted.');
//     });
// }
// Set an interval to remove jobs older than 24 hours
// setInterval(checkAndDeleteExpiredJobs, 60 * 60 * 1000);
