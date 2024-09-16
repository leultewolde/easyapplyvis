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
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors()); // Enable CORS for all routes

// Paths to successful and failed job applications
const csvFilePathSuccess = process.env.CSV_SUCCESS_PATH || 'C:/Users/Leul/Downloads/EasyApplyBot-master/EasyApplyBot-master/source/output_USA.csv'; // Successful applications
const csvFilePathFailed = process.env.CSV_FAILED_PATH || 'C:/Users/Leul/Downloads/EasyApplyBot-master/EasyApplyBot-master/source/failed_USA.csv'; // Failed applications

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

function sendCsvData(socket) {
    // Read both CSV files
    Promise.all([readCsv(csvFilePathSuccess, 'Success'), readCsv(csvFilePathFailed, 'Failed')])
        .then((data) => {
            const allData = [...data[0], ...data[1]]; // Combine successful and failed applications

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

// Watch for file changes in both the successful and failed CSVs
const watchCsvFiles = () => {
    [csvFilePathSuccess, csvFilePathFailed].forEach((filePath) => {
        fs.watch(filePath, () => {
            io.sockets.emit('fileChanged');
        });
    });
};

io.on('connection', (socket) => {
    sendCsvData(socket);
    socket.on('refresh', () => sendCsvData(socket));
});

watchCsvFiles(); // Start watching both CSV files

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
