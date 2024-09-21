function sendDataToBackend(job) {
    return new Promise((resolve, reject) =>
        fetch('http://localhost:5000/save-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(job)
        })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch((error) => reject(error)));
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(6, '0'); // Add microsecond precision

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function getJobLinkFromDocument() {
    let jobLinkElement = document.querySelector('.job-details-jobs-unified-top-card__job-title a');
    return jobLinkElement ? jobLinkElement.href : 'Job link not available';
}

function extractJobFromDocument() {
    let companyNameElement = document.querySelector('.jpac-modal-header');
    let companyName = companyNameElement ? companyNameElement.innerText.match(/to (.+)!/)[1].trim() : 'Unknown Company';

    let positionElement = document.querySelector('.job-details-jobs-unified-top-card__job-title h1');
    let position = positionElement ? positionElement.innerText.trim() : 'Unknown Position';

    let locationElement = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container .t-black--light span');
    let location = locationElement ? locationElement.innerText.trim() : 'Unknown Location';

    let salaryElement =
        document.querySelector('.jobs-unified-top-card__job-insight--highlight')
        || document.querySelector('.job-details-salary');
    let salary = salaryElement ? salaryElement.innerText.trim() : 'Salary not disclosed';

    let country = '';

    return {
        company: companyName,
        position: position,
        location: location,
        salary: salary,
        link: getJobLinkFromDocument(),
        country: country,
        dateApplied: formatDate(new Date()),
        timestamp: Date.now()
    };
}

let savedJobs = [];

function extractJobDetails() {
    let jobLink = getJobLinkFromDocument();

    if (savedJobs.includes(jobLink)) {
        return;
    }

    let job = extractJobFromDocument();

    savedJobs.push(jobLink);

    sendDataToBackend(job)
        .then((result) => console.log(result, job))
        .catch((reason) => {
            console.log(JSON.stringify(reason, null, 2));
        });
}

const observer = new MutationObserver(() => {
    const confirmationModal = document.querySelector('h2#post-apply-modal') ||
        document.querySelector('.jpac-modal-header');

    if (confirmationModal && (confirmationModal.innerText.includes('Application sent') || confirmationModal.innerText.includes('application was sent'))) {
        extractJobDetails();
    }
});

observer.observe(document.body, {childList: true, subtree: true});
