const statisticsApi = 'http://127.0.0.1:8002';
const playerApi = 'http://127.0.0.1:8001';
const playerPage = 'http://127.0.0.1:5501'


// --- Создание статистики ---
document.getElementById('statForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const goals = parseInt(document.getElementById('goals').value);
    const assists = parseInt(document.getElementById('assists').value);
    const matches = parseInt(document.getElementById('matches').value);

    if (!name) {
        alert("Enter player name");
        return;
    }

    const stat = { name, goals, assists, matches_played: matches };

    try {
        const response = await fetch(`${statisticsApi}/statistics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stat)
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.detail || "Error creating statistics");
            return;
        }

        const data = await response.json();
        alert(`Statistics created for player ID: ${data.id}`);

        document.getElementById('statForm').reset();
        loadAllStatistics();

    } catch (error) {
        alert("Server error");
        console.error(error);
    }
});

// --- Поиск статистики по имени (полная информация) ---
document.getElementById('fullInfoBtn').addEventListener('click', async () => {
    const name = document.getElementById('SearchFullName').value.trim();
    const result = document.getElementById('fullResult');
    result.innerHTML = '';

    if (!name) {
        result.innerHTML = '<li>Enter player name</li>';
        return;
    }

    try {
        const response = await fetch(`${statisticsApi}/statistics/full/${name}`);

        if (!response.ok) {
            result.innerHTML = '<li>Info not found</li>';
            return;
        }

        const data = await response.json();
        const stat = data.statistics;
        const player = data.player;

        const li = document.createElement('li');

        // Если игрок найден в player-service
        if (player) {
            li.textContent =
                `${player.name} | ` +
                `Age: ${player.age} | ` +
                `Club: ${player.club} | ` +
                `Position: ${player.position} | ` +
                `Goals: ${stat.goals} | ` +
                `Assists: ${stat.assists} | ` +
                `Matches: ${stat.matches_played}`;
        } 
        // Если player-service недоступен или игрока там нет
        else {
            li.textContent =
                `${stat.name} | ` +                
                `Goals: ${stat.goals} | ` +
                `Assists: ${stat.assists} | ` +
                `Matches: ${stat.matches_played} | ` +
                `No info`;
        }

        result.appendChild(li);

    } catch (error) {
        result.innerHTML = '<li>Server error</li>';
        console.error(error);
    }
});



// --- Загрузка всех статистик ---
async function loadAllStatistics() {
    const list = document.getElementById('allStats');
    list.innerHTML = '';

    try {
        const response = await fetch(`${statisticsApi}/statistics`);
        const stats = await response.json();

        if (!stats.length) {
            list.innerHTML = '<li>No statistics yet</li>';
            return;
        }

        for (const stat of stats) {
            const li = document.createElement('li');
            li.textContent =
                `${stat.name} | ` +
                `Goals: ${stat.goals} | ` +
                `Assists: ${stat.assists} | ` +
                `Matches: ${stat.matches_played}`;
            list.appendChild(li);
        }

    } catch (error) {
        list.innerHTML = '<li>Error loading statistics</li>';
        console.error(error);
    }
}

// --- Быстрый поиск статистики ---
document.getElementById('searchStatBtn').addEventListener('click', async () => {
    const name = document.getElementById('searchName').value.trim();
    const result = document.getElementById('statResult');
    result.innerHTML = '';

    if (!name) {
        result.innerHTML = '<li>Enter player name</li>';
        return;
    }

    try {
        const response = await fetch(`${statisticsApi}/statistics/by-name/${encodeURIComponent(name)}`);

        if (!response.ok) {
            result.innerHTML = '<li>Statistics not found</li>';
            return;
        }

        let stats = await response.json();

        // Если сервер вернул объект вместо массива, оборачиваем в массив
        stats = Array.isArray(stats) ? stats : [stats];

        if (!stats.length) {
            result.innerHTML = '<li>Statistics not found</li>';
            return;
        }

        for (const stat of stats) {
            const li = document.createElement('li');
            li.textContent =
                `${stat.name} | ` +
                `Goals: ${stat.goals} | ` +
                `Assists: ${stat.assists} | ` +
                `Matches: ${stat.matches_played}`;
            result.appendChild(li);
        }

    } catch (error) {
        result.innerHTML = '<li>Server error</li>';
        console.error(error);
    }
});


// --- Переход на страницу игроков ---
function goToStart() {
    window.location.href = playerPage;
}

// --- Загрузка всех статистик при старте ---
loadAllStatistics();
