// Countdown timer
function updateTimer() {
    const now = new Date();
    const timeLeft = event - now;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = Math.max(0, timeLeft);
    }
}

const event = new Date(2027,0,1);
updateTimer();
setInterval(updateTimer, 100); // Update timer every 100ms

// Form submission
document.getElementById('passportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generatePassport();
});

// Generate passport
function generatePassport() {
    const name = document.getElementById('name').value;
    const alias = document.getElementById('alias').value;
    const job = document.getElementById('job').value;

    // Generate ID based on milliseconds until January 1st 2027
    const now = new Date();
    const id = Math.max(0, event - now);

    // Display passport
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayAlias').textContent = alias;
    document.getElementById('displayJob').textContent = job;
    document.getElementById('displayId').textContent = id;

    // Show passport section
	document.getElementById('formSection').style.display = 'none';
    document.getElementById('passportSection').style.display = 'block';

    // Send data to Google Sheets
    sendToGoogleSheets(name, alias, job, id);

    // Scroll to passport
    setTimeout(() => {
        document.getElementById('passportSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Send data to Google Sheets
function sendToGoogleSheets(name, alias, job, id) {
   /*
		Pre-filled URL:
		https://docs.google.com/forms/d/e/1FAIpQLScesUbH2jqt1qE1MFt26vBk9pQkichI3hna3yHr9ta6biDk0Q/viewform
		?usp=pp_url&entry.88077336=name&entry.1844988031=alias&entry.1579998128=job&entry.27143037=id
	*/

	// Prepare data    
	const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScesUbH2jqt1qE1MFt26vBk9pQkichI3hna3yHr9ta6biDk0Q/formResponse";
	const data = new URLSearchParams();
	data.append("entry.88077336", name);
	data.append("entry.1844988031", alias);
	data.append("entry.1579998128", job);
	data.append("entry.27143037", id);

	// Send silent POST request
	fetch(formURL, {
     method: "POST",
     	mode: "no-cors", // Stop CORS error message
     	body: data
	});
}

// Initialize
console.log('Crono Passport loaded successfully!');
