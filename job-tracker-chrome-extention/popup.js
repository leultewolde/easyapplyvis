function getJobsFromBackend() {
    return new Promise((resolve, reject) =>
        fetch('http://localhost:5000/jobs')
            .then(response => response.json())
            .then(data => resolve(data))
            .catch((error) => reject(error)))
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
    });
}

// Populate the popup with the 5 most recent jobs
document.addEventListener('DOMContentLoaded', function () {
    const jobsList = document.getElementById('jobsList');
    const noJobsMessage = document.getElementById('noJobsMessage');

    const renderJobs = (data) => {
        noJobsMessage.style.display = 'none';

        data.forEach(job => {
            const jobItem = document.createElement('li');
            jobItem.classList.add('job-item');

            jobItem.innerHTML = `
                      <p class="job-title">
                        ${job['Position']}
                        <span class="job-company">(${job['Company']})</span>
                      </p>
                      <p class="job-date">${formatDate(job['Applied At'])}</p>
                    `;

            jobsList.appendChild(jobItem);
        });
    }

    getJobsFromBackend()
        .then((data) => {
            if (data.length === 0) {
                noJobsMessage.style.display = 'block';
            } else {
                renderJobs(data);
            }
            if (data.length === 0) {
                jobsList.innerHTML = '<li>No tracked jobs yet.</li>';
            }
        })
        .catch((reason) => {
            jobsList.innerHTML = `<li>${reason}</li>`;
        })
});
