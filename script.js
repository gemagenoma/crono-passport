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

    // Generate Unix timestamp as ID
    const id = Math.floor(Date.now() / 1000);

    // Display passport
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayAlias').textContent = alias;
    document.getElementById('displayJob').textContent = job;
    document.getElementById('displayId').textContent = id;

    // Show passport section
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

// Download passport as image
document.getElementById('downloadBtn').addEventListener('click', function() {
    const passportCard = document.querySelector('.passport-card');
    
    // Use html2canvas library (need to add to HTML)
    if (typeof html2canvas !== 'undefined') {
        html2canvas(passportCard, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            const id = document.getElementById('displayId').textContent;
            link.href = canvas.toDataURL('image/png');
            link.download = `crono-passport-${id}.png`;
            link.click();
        });
    } else {
        // Fallback: simple screenshot using browser's built-in capabilities
        alert('Download feature requires html2canvas library. Check README for setup instructions.');
    }
});
