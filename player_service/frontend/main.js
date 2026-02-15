const playerApi = 'http://127.0.0.1:8001';
const statPage = 'http://127.0.0.1:5500'

document.getElementById('playerForm').addEventListener('submit', async (e) => {
e.preventDefault();

const player = {
    name: document.getElementById('name').value.trim(),
    age: parseInt(document.getElementById('age').value),
    club: document.getElementById('club').value.trim(),
    position: document.getElementById('position').value.trim()
};

if (!player.name) {
    alert("Enter player name");
    return;
}

try {
    const response = await fetch(`${playerApi}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.detail || "Error creating player");
        return;
    }

    alert(`Player added with ID: ${data.id}`);

    document.getElementById('playerForm').reset();
    loadPlayers();

} catch (error) {
    alert("Server error");
    console.error(error);
}

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
        li.textContent = `${player.name} | Age: ${player.age} | Club: ${player.club} | Position: ${player.position}`;
        list.appendChild(li);
    }
}

//инфа от игроке
document.getElementById('searchBtn').addEventListener('click', async () => {
    const name = document.getElementById('searchName').value.trim();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';

    if (!name) {
        results.innerHTML = '<li>Enter player name</li>';
        return;
    }

    try {
        const response = await fetch(`${playerApi}/players/search/${encodeURIComponent(name)}`);
        if (!response.ok) {
            results.innerHTML = '<li>Error searching players</li>';
            return;
        }

        const players = await response.json();
        if (players.length === 0) {
            results.innerHTML = '<li>No players found</li>';
            return;
        }

        for (const player of players) {
            const li = document.createElement('li');
            li.textContent = `${player.name} | Club: ${player.club} | Position: ${player.position}`;
            results.appendChild(li);
        }
    } catch (err) {
        results.innerHTML = '<li>Server error</li>';
        console.error(err);
    }
});

//полная инфа
document.getElementById('fullBtn').addEventListener('click', async () => {
    const name = document.getElementById('fullName').value.trim();
    const results = document.getElementById('fullResults');
    results.innerHTML = '';

    if (!name) {
        results.innerHTML = '<li>Enter player name</li>';
        return;
    }

    try {
        const response = await fetch(`${playerApi}/players/full/${encodeURIComponent(name)}`);

        if (!response.ok) {
            results.innerHTML = '<li>Player not found</li>';
            return;
        }

        const data = await response.json();
        const player = data.player;
        const stats = data.statistics;

        const li = document.createElement('li');

        if (stats) {
            li.textContent =
                `${player.name} | Age: ${player.age} | Club: ${player.club} | Position: ${player.position} | ` +
                `Goals: ${stats.goals} | Assists: ${stats.assists} | Matches: ${stats.matches_played}`;
        } else {
            li.textContent =
                `${player.name} | Age: ${player.age} | Club: ${player.club} | Position: ${player.position} | No statistics`;
        }

        results.appendChild(li);

    } catch (error) {
        results.innerHTML = '<li>Server error</li>';
        console.error(error);
    }
});


function goToStatistics() {
    window.location.href = statPage;
}

loadPlayers();
