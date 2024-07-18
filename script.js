const NOTION_API_KEY = 'YOUR_NOTION_API_KEY';
const DATABASE_ID = 'YOUR_DATABASE_ID';

const timers = {};
let steps = [];

async function fetchSteps() {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2021-08-16'
        }
    });

    const data = await response.json();
    steps = data.results.map(page => ({
        id: page.id,
        name: page.properties.Schritt.title[0].text.content,
        order: page.properties.Reihenfolge.number
    })).sort((a, b) => a.order - b.order);

    createTimers();
}

function createTimers() {
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
    timers[stepId] = { start: new Date() };
    alert(`${steps.find(step => step.id === stepId).name} gestartet um ${timers[stepId].start}`);
}

function stopTimer(stepId) {
    if (!timers[stepId] || !timers[stepId].start) {
        alert(`Bitte starten Sie zuerst den Timer für ${steps.find(step => step.id === stepId).name}.`);
        return;
    }
    timers[stepId].end = new Date();
    timers[stepId].duration = (timers[stepId].end - timers[stepId].start) / 1000;
    alert(`${steps.find(step => step.id === stepId).name} gestoppt um ${timers[stepId].end}. Dauer: ${timers[stepId].duration} Sekunden`);
}

async function saveData() {
    const data = JSON.stringify(timers, null, 2);
    console.log('Gespeicherte Daten:', data);

    const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2021-08-16'
        },
        body: JSON.stringify({
            parent: { database_id: DATABASE_ID },
            properties: {
                'Name': {
                    title: [
                        {
                            text: {
                                content: 'Morgenroutine ' + new Date().toLocaleDateString()
                            }
                        }
                    ]
                },
                'Daten': {
                    rich_text: [
                        {
                            text: {
                                content: data
                            }
                        }
                    ]
                }
            }
        })
    });

    if (response.ok) {
        alert('Daten erfolgreich gespeichert.');
    } else {
        alert('Fehler beim Speichern der Daten.');
    }
}

fetchSteps();
