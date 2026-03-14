const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    // Připojení do místnosti
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        console.log(`Zařízení ${socket.id} vstoupilo do místnosti: ${roomCode}`);
    });

    // Přeposílání dat o pohybu volantu
    socket.on('drive-data', (data) => {
        // Pošleme data všem v téže místnosti (hlavně monitoru)
        socket.to(data.room).emit('update-game', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Hra běží!'));
