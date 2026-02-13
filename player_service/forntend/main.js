const playerApi = 'http://127.0.0.1:8001';


async function loadPlayers() {
    const response = await fetch(`${playerApi}/players`);
    const players = await response.json();

    const list = document.getElementById('playersList');
    list.innerHTML = '';

    for (const player of players) {
        const li = document.createElement('li');
        li.textContent = `${player.name}, Age: ${player.age}, Club: ${player.club}, Position: ${player.position}`;
        
        
        list.appendChild(li);
    }
}


loadPlayers();
