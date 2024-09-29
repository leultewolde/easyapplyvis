const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());


const csvDirectory = process.env.CSV_DIRECTORY_PATH || 'C:/Users/Leul/Downloads/EasyApplyBot-master/EasyApplyBot-master/source';

const headers = ["Company", "Position", "Job Link", "Location", "Country", "Applied At", "Status"];

const readCsv = (filePath, status) => {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                const formattedRow = Object.values(row);
                formattedRow.push(status);
                data.push(formattedRow);
            })
            .on('end', () => resolve(data))
            .on('error', (err) => reject(err))
    });
};

const findCsvFiles = () => {
    const files = fs.readdirSync(csvDirectory);
    const successFiles = files.filter(file => file.startsWith('output') && file.endsWith('.csv'));
    const failedFiles = files.filter(file => file.startsWith('failed') && file.endsWith('.csv'));
    return { successFiles, failedFiles };
};

function sendCsvData(socket) {
    const { successFiles, failedFiles } = findCsvFiles();

    const successPromises = successFiles.map(file => readCsv(path.join(csvDirectory, file), 'Success'));
    const failedPromises = failedFiles.map(file => readCsv(path.join(csvDirectory, file), 'Failed'));

    // Read both CSV files
    Promise.all([...successPromises, ...failedPromises])
        .then((data) => {
            const successData = data.slice(0, successFiles.length).flat();
            const failedData = data.slice(successFiles.length).flat();

            const failedJobsSet = new Set(failedData.map(row => row[2]));
            const filteredSuccessData = successData.filter(row => !failedJobsSet.has(row[2]));

            const allData = [...filteredSuccessData, ...failedData];

            const formattedData = allData.map((row) => {
                const mappedRow = {};
                headers.forEach((header, index) => {
                    mappedRow[header] = row[index] || '';
                });
                return mappedRow;
            });

            const sortedData = formattedData.sort((a, b) => {
                const dateA = new Date(a["Applied At"]);
                const dateB = new Date(b["Applied At"]);
                return dateB - dateA; // Sort by date in descending order
            });

            socket.emit('csvData', { headers, data: sortedData });
        })
        .catch((err) => {
            console.error('Error reading CSV files:', err);
        });
}

const watcher = chokidar.watch(csvDirectory, {
    persistent: true,
    ignoreInitial: true,
});

watcher.on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    io.sockets.emit('fileChanged');
});

// fs.watch(csvDirectory, () => {
//     io.sockets.emit('fileChanged');
// });

io.on('connection', (socket) => {
    sendCsvData(socket);
    socket.on('refresh', () => sendCsvData(socket));
});


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
