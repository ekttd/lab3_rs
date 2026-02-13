const playerApi = 'http://127.0.0.1:8001';


document.getElementById('playerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const player = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        club: document.getElementById('club').value,
        position: document.getElementById('position').value
    };


    const response = await fetch(`${playerApi}/players`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(player)
    });

    const data = await response.json();
    alert(`Player added with ID: ${data.id}`);

    loadPlayers();

    document.getElementById('playerForm').reset();
});


async function loadPlayers() {
    const response = await fetch(`${playerApi}/players`);
    const players = await response.json();

    const list = document.getElementById('playersList');
    list.innerHTML = '';

    if (players.length === 0) {
        list.innerHTML = '<li>No players yet</li>';
        return;
    }

    for (const player of players) {
        const li = document.createElement('li');
        li.textContent = `${player.name}, Age: ${player.age}, Club: ${player.club}, Position: ${player.position}`;
        list.appendChild(li);
    }
}

loadPlayers();
