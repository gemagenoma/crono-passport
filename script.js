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
    document.getElementById('passportId').textContent = id;
    document.getElementById('displayTimestamp').textContent = id;

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
    // Replace this URL with your actual Google Apps Script deployment URL
    const scriptURL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb/app';

    const data = {
        name: name,
        alias: alias,
        job: job,
        id: id
    };

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => console.log('Data sent to Google Sheets successfully'))
    .catch(error => console.log('Note: Google Sheets integration not yet configured. Error:', error));
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
            const id = document.getElementById('passportId').textContent;
            link.href = canvas.toDataURL('image/png');
            link.download = `crono-passport-${id}.png`;
            link.click();
        });
    } else {
        // Fallback: simple screenshot using browser's built-in capabilities
        alert('Download feature requires html2canvas library. Check README for setup instructions.');
    }
});

// Create new passport
document.getElementById('newPassportBtn').addEventListener('click', function() {
    document.getElementById('passportForm').reset();
    document.getElementById('passportSection').style.display = 'none';
    document.getElementById('name').focus();
});

// Initialize
console.log('Crono Passport loaded successfully!');
console.log('Replace the scriptURL in sendToGoogleSheets() with your Google Apps Script URL');
