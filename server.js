const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Povolí připojení z jakékoli adresy
    methods: ["GET", "POST"]
  }
});

// Port pro Render (Render si ho nastavuje sám přes env)
const PORT = process.env.PORT || 3001;

// Jednoduchá databáze v paměti (pro začátek)
let globalGameState = {
  quantium: 0,
  autoPower: 0,
  upgrades: { clicker: 0, bot: 0, reactor: 0, fleet: 0 }
};

io.on('connection', (socket) => {
  console.log('Nové zařízení připojeno:', socket.id);

  // Pošle aktuální stav nově připojenému zařízení
  socket.emit('gameStateUpdate', globalGameState);

  // Reakce na těžbu z telefonu
  socket.on('mine', () => {
    globalGameState.quantium += 1;
    io.emit('gameStateUpdate', globalGameState); // Rozeslat všem (PC i mobilu)
  });

  // Reakce na nákup vylepšení
  socket.on('buyUpgrade', (upgradeId) => {
    // Zde by měla být logika ověření ceny, ale pro prototyp:
    globalGameState.upgrades[upgradeId]++;
    io.emit('gameStateUpdate', globalGameState);
  });

  socket.on('disconnect', () => {
    console.log('Zařízení odpojeno');
  });
});

// Statické soubory frontendu (pokud je chceš hostovat společně)
app.use(express.static(path.join(__dirname, '../client/dist')));

server.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
