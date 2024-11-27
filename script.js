const indexId = "afc98c53b968b4c47ff1e21e7219d4f41668083405";
const tracker = 'FEE539C0-D206-A685-88F8-0E433FCDFD1D';

const output = document.getElementById('output');
const startBtn = document.getElementById('start-btn');
const languageSelect = document.getElementById('language');
const notification = document.getElementById('notification');

if (!('webkitSpeechRecognition' in window)) {
    alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy.");
} else {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;

    recognition.onstart = function() {
        notification.textContent = "Nagrywanie rozpoczęte...";
        notification.style.color = "green";
        output.textContent = ""; 
    };

    recognition.onend = function() {
        notification.textContent = "Nagrywanie zakończone.";
        notification.style.color = "red";
    };

    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript.trim(); 
            output.textContent += transcript + ' '; 
            console.log(`Rozpoznany tekst: "${transcript}"`); 
            searchWithQuery(transcript); 
        }
    };

    recognition.onerror = function(event) {
        console.error("Błąd rozpoznawania mowy:", event.error);
        notification.textContent = "Wystąpił błąd podczas nagrywania.";
        notification.style.color = "red";
    };

    startBtn.onclick = function() {
        recognition.lang = languageSelect.value;
        recognition.start();
    };
}

async function fetchData(query) {
    const apiUrl = `https://api.synerise.com/search/v2/indices/${indexId}/query?query=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl, {
        headers: {
            "x-api-key": tracker,
        },
    });
    
    if (!response.ok) {
        throw new Error('No data found.');
    }
    
    return await response.json();
}

async function searchWithQuery(query) {
    try {
        const data = await fetchData(query);
        displayData(data);
    } catch (error) {
        console.log("Error:", error);
        notification.textContent = "Wystąpił błąd podczas wyszukiwania.";
        notification.style.color = "red";
    }
}

const displayData = (payload) => {
    const displayItems = payload.data.map((item) => `
        <div class="speechToText-output_item">
            <a href="${item.productUrl}">
                <img class="speechToText-output_img" src="${item.image}" alt="${item.name}" />
                <h3 class="speechToText-output_name">${item.name.substring(0, 25)}...</h3>
                <p class="speechToText-output_price">Cena: ${parseFloat(item.price).toFixed(2)} PLN</p>
            </a>
        </div>
    `).join('');

    apiresults.innerHTML = displayItems || "<p>Brak wyników.</p>";
}
