
const event = new Date(2027,0,1);
const interval = 10
// Get time left in centiseconds
function getTimeLeft() {
    const now = new Date();
    const timeLeft = (event - now) / interval;
	return Math.floor(timeLeft)
} 

// Countdown timer
function updateTimer() {
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = getTimeLeft();
    }
}

updateTimer();
setInterval(updateTimer, interval);

// Form submission
document.getElementById('passportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generatePassport();
});

// Hide Fields
function hideFields() {
	document.getElementById('alias').style.display = 'none';
	document.getElementById('job').style.display = 'none';
	document.getElementById('generate').style.display = 'none';
}

// Show Alias
document.getElementById('name').addEventListener('input', function (evt) {
    if(this.value.length > 0) document.getElementById('alias').style.display = 'block'
		else hideFields();
});

// Show job
document.getElementById('alias').addEventListener('input', function (evt) {
    if(this.value.length > 0) document.getElementById('job').style.display = 'block'
	else {
        document.getElementById('job').style.display = 'none';
        document.getElementById('generate').style.display = 'none';
    }
});

// Show button
document.getElementById('job').addEventListener('input', function (evt) {
    if(this.value.length > 0) document.getElementById('generate').style.display = 'block'
	else document.getElementById('generate').style.display = 'none';
});

// Generate passport
function generatePassport() {
    const name = document.getElementById('name').value.trim();
    const alias = document.getElementById('alias').value.trim();
    const job = document.getElementById('job').value.trim();

    // Generate ID based on milliseconds until January 1st 2027
    const id = getTimeLeft();

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
