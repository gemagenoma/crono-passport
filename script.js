// Form submission
document.getElementById('passportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generatePassport();
});

// Generate passport
function generatePassport() {
    const title = document.getElementById('title').value;
    const name = document.getElementById('name').value;
    const alias = document.getElementById('alias').value;
    const expertise = document.getElementById('expertise').value;

    // Generate Linux timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const readableDate = new Date().toLocaleString();

    // Display passport
    document.getElementById('displayTitle').textContent = title;
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayAlias').textContent = alias;
    document.getElementById('displayExpertise').textContent = expertise;
    document.getElementById('passportNumber').textContent = timestamp;
    document.getElementById('displayTimestamp').textContent = readableDate;

    // Show passport section
    document.getElementById('passportSection').style.display = 'block';

    // Send data to Google Sheets
    sendToGoogleSheets(title, name, alias, expertise, timestamp, readableDate);

    // Scroll to passport
    setTimeout(() => {
        document.getElementById('passportSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Send data to Google Sheets
function sendToGoogleSheets(title, name, alias, expertise, timestamp, readableDate) {
    // Replace this URL with your actual Google Apps Script deployment URL
    const scriptURL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb/app';

    const data = {
        title: title,
        name: name,
        alias: alias,
        expertise: expertise,
        timestamp: timestamp,
        readableDate: readableDate
    };

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => console.log('Data sent to Google Sheets successfully'))
    .catch(error => console.log('Error sending to Google Sheets:', error));
}

// Download passport as image
document.getElementById('downloadBtn').addEventListener('click', function() {
    const passportCard = document.querySelector('.passport-card');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size (A5 passport size: 148x210mm ≈ 560x794px at 96dpi)
    canvas.width = 560;
    canvas.height = 794;

    // Create image from HTML element
    html2canvas(passportCard, {
        canvas: canvas,
        backgroundColor: '#ffffff',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        const timestamp = document.getElementById('passportNumber').textContent;
        link.href = canvas.toDataURL('image/png');
        link.download = `crono-passport-${timestamp}.png`;
        link.click();
    });
});

// Create new passport
document.getElementById('newPassportBtn').addEventListener('click', function() {
    document.getElementById('passportForm').reset();
    document.getElementById('passportSection').style.display = 'none';
    document.getElementById('title').focus();
});

// Initialize
console.log('Crono Passport loaded successfully!');
console.log('Replace the scriptURL in sendToGoogleSheets() with your Google Apps Script URL');
