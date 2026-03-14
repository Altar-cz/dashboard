const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: "*" } 
});

app.use(express.static(path.join(__dirname)));

const rooms = {};

io.on('connection', (socket) => {
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        if (!rooms[roomCode]) {
            rooms[roomCode] = { players: [] };
        }
        console.log(`Zařízení ${socket.id} vstoupilo do místnosti: ${roomCode}`);
    });

    socket.on('drive-data', (data) => {
        // Broadcast game data to all participants in the room
        socket.to(data.room).emit('update-game', data);
    });

    socket.on('disconnect', () => {
        // Cleanup could be handled here if needed
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Ultimate Chill Drive běží na portu ${PORT}`));
