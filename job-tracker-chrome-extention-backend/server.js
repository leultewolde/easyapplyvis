const express = require('express');
const cors = require('cors');
const {jobAlreadyExists, fetchLastFiveEntries, writeJobToCSV} = require('./csvTools')

const app = express();
app.use(cors());
app.use(express.json());

const createResponse = (res, status, data) => {
    return res.status(status).json(data);
}

app.post('/save-job', (req, res) => {
    const jobData = req.body;

    jobAlreadyExists(jobData)
        .then(alreadyExists => {
            if (alreadyExists) {
                throw new Error('Already Exists'); // Explicitly throw an error if job exists
            }
            return writeJobToCSV(jobData);
        })
        .then(() => createResponse(res, 204, {message: 'Job saved'}))
        .catch(error => {
            if (error.message === 'Already Exists') {
                return createResponse(res, 400, {message: 'Already Exists'});
            }
            return createResponse(res, 500, {message: 'Error saving job'});
        });
});


app.get('/jobs', (req, res) => {
    fetchLastFiveEntries()
        .then((data) => createResponse(res, 200, data))
        .catch(err => createResponse(res, 500, {message: err.message}));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
