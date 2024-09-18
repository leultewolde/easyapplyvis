const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors()); // Enable CORS for all routes

// Paths to successful and failed job applications
const csvDirectory = process.env.CSV_DIRECTORY_PATH || 'C:/Users/Leul/Downloads/EasyApplyBot-master/EasyApplyBot-master/source';

const headers = ["Company", "Position", "Job Link", "Location", "Country", "Applied At", "Status"];

// Helper function to read CSV files and append a status
const readCsv = (filePath, status) => {
    return new Promise((resolve) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv({ headers: false })) // Ignore CSV headers if any
            .on('data', (row) => {
                const formattedRow = Object.values(row);
                formattedRow.push(status); // Append the status (e.g., 'Success' or 'Failed')
                data.push(formattedRow);
            })
            .on('end', () => resolve(data));
    });
};

// Function to find CSV files starting with "output" or "failed"
const findCsvFiles = () => {
    const files = fs.readdirSync(csvDirectory);
    const successFiles = files.filter(file => file.startsWith('output') && file.endsWith('.csv'));
    const failedFiles = files.filter(file => file.startsWith('failed') && file.endsWith('.csv'));
    return { successFiles, failedFiles };
};

function sendCsvData(socket) {
    const { successFiles, failedFiles } = findCsvFiles();

    // Read all CSV files starting with "output" (Success) and "failed" (Failed)
    const successPromises = successFiles.map(file => readCsv(path.join(csvDirectory, file), 'Success'));
    const failedPromises = failedFiles.map(file => readCsv(path.join(csvDirectory, file), 'Failed'));

    // Read both CSV files
    Promise.all([...successPromises, ...failedPromises])
        .then((data) => {
            const allData = data.flat(); // Combine successful and failed applications

            // Map each row to the corresponding headers
            const formattedData = allData.map((row) => {
                const mappedRow = {};
                headers.forEach((header, index) => {
                    mappedRow[header] = row[index] || ''; // Map each column to custom headers
                });
                return mappedRow;
            });

            const sortedData = formattedData.sort((a, b) => {
                const dateA = new Date(a["Applied At"]);
                const dateB = new Date(b["Applied At"]);
                return dateB - dateA; // Sort by date in descending order
            });


            // Emit the combined and formatted data
            socket.emit('csvData', { headers, data: sortedData });
        });
}

fs.watch(csvDirectory, () => {
    io.sockets.emit('fileChanged');
});

io.on('connection', (socket) => {
    sendCsvData(socket);
    socket.on('refresh', () => sendCsvData(socket));
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
