const NOTION_API_KEY = 'secret_tiNobiUpYspVLQP24sA9gEFbJuMEWxbc3N68N3KzylY';
const DATABASE_ID = '509e136d09404128b9af63f7fdc886f4';

async function fetchSteps() {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2021-08-16'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const steps = data.results.map(page => ({
            id: page.id,
            name: page.properties.Schritt.title[0].text.content,
            order: page.properties.Reihenfolge.number
        }));

        createTimers(steps);
    } catch (error) {
        console.error('Error fetching steps:', error);
        alert('Fehler beim Abrufen der Schritte aus Notion. Überprüfe die Konsole für Details.');
    }
}

function createTimers(steps) {
    const container = document.getElementById('timers');
    container.innerHTML = '';

    steps.forEach(step => {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'timer';
        timerDiv.id = step.id;

        const label = document.createElement('label');
        label.innerText = step.name;

        const startButton = document.createElement('button');
        startButton.innerText = 'Start';
        startButton.onclick = () => startTimer(step.id);

        const stopButton = document.createElement('button');
        stopButton.innerText = 'Stop';
        stopButton.onclick = () => stopTimer(step.id);

        timerDiv.appendChild(label);
        timerDiv.appendChild(startButton);
        timerDiv.appendChild(stopButton);

        container.appendChild(timerDiv);
    });
}

function startTimer(stepId) {
    // Implementiere deine Logik zum Starten des Timers hier
}

function stopTimer(stepId) {
    // Implementiere deine Logik zum Stoppen des Timers hier
}

fetchSteps();
