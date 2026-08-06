const event = new Date(2027,0,1);
const timerInterval = 10;
// Get time left in centiseconds
function getTimeLeft() {
    const now = new Date();
    const timeLeft = (event - now) / timerInterval;
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
const timerIntervalId = setInterval(updateTimer, timerInterval);

// Form submission
document.getElementById('passportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generatePassport();
});

// Tracks whether the backend confirmed the email is completely valid
let emailValidated = false;

// Debounce timer for email validation
let emailValidationTimeout;

// Hide Fields
function hideFields() {
	document.getElementById('alias').style.display = 'none';
	document.getElementById('job').style.display = 'none';
	document.getElementById('emailContainer').style.display = 'none';
	document.getElementById('generate').style.display = 'none';
}

// Show Alias
document.getElementById('name').addEventListener('input', function (evt) {
    if(this.value.length > 0) document.getElementById('alias').style.display = 'block'
		else hideFields();
});

// Show job
document.getElementById('alias').addEventListener('input', function (evt) {
    if (this.value.length > 0) {
        document.getElementById('job').style.display = 'block';
    } else {
        document.getElementById('job').style.display = 'none';
        document.getElementById('emailContainer').style.display = 'none';
        document.getElementById('generate').style.display = 'none';
    }
});

// Show email container
document.getElementById('job').addEventListener('input', function (evt) {
    if (this.value.length > 0) {
        document.getElementById('emailContainer').style.display = 'block';
    } else {
        document.getElementById('emailContainer').style.display = 'none';
        document.getElementById('generate').style.display = 'none';
    }
});

// Email validation regex
function isValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setRequestLoading(isLoading, message = '') {
    const status = document.getElementById('emailStatus');
    const statusText = document.getElementById('emailStatusText');
    statusText.textContent = message;
    status.style.display = isLoading ? 'flex' : 'none';
}

// Validate email with backend - debounced to 1 second
async function validateEmailWithBackend(email) {
    const emailError = document.getElementById('emailError');
    const generateBtn = document.getElementById('generate');

    // Reset any prior confirmation before re-validating
    emailValidated = false;
    generateBtn.style.display = 'none';

    if (!email) {
        setRequestLoading(false);
        return;
    }

    // Skip the backend call if the frontend syntax check already failed
    if (!isValidEmailFormat(email)) {
        setRequestLoading(false);
        return;
    }

    // Show the loading indicator while the backend validates the email
    emailError.textContent = '';
    setRequestLoading(true, 'Validando correo...');

    try {
        const response = await fetch('/api/validate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        // Handle unexpected server/client errors (4xx / 5xx)
        if (!response.ok) {
            emailError.textContent = 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.';
            document.getElementById('email').classList.add('error');
            return;
        }

        const result = await response.json();

        if (!result.valid) {
            emailError.textContent = result.error || 'Correo no válido';
            document.getElementById('email').classList.add('error');
        } else {
            // Backend confirmed the email is completely valid
            emailValidated = true;
            emailError.textContent = '';
            document.getElementById('email').classList.remove('error');
            generateBtn.style.display = 'block';
        }
    } catch (error) {
        // Network failure or unexpected client-side problem
        console.error('[v0] Error validating email:', error);
        emailError.textContent = 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.';
        document.getElementById('email').classList.add('error');
    } finally {
        // Always hide the shared loading indicator when the request settles
        setRequestLoading(false);
    }
}

// Frontend validate email while typing
document.getElementById('email').addEventListener('input', function (evt) {
    const emailError = document.getElementById('emailError');
    const email = this.value.trim();

    // Any change invalidates a previous backend confirmation
    emailValidated = false;
    document.getElementById('generate').style.display = 'none';

    // Check if empty
    if (email.length === 0) {
        emailError.textContent = '';
        this.classList.remove('error');
        clearTimeout(emailValidationTimeout);
        setRequestLoading(false);
        return;
    }

    // Check syntax
    if (!isValidEmailFormat(email)) {
        emailError.textContent = 'Por favor, introduce un correo válido';
        this.classList.add('error');
        clearTimeout(emailValidationTimeout);
        setRequestLoading(false);
        return;
    }

    // Frontend syntax is valid. Clear any pending timeout and set a new one.
    // This ensures we wait 1 second after the user stops typing before validating.
    clearTimeout(emailValidationTimeout);
    this.classList.remove('error');
    emailError.textContent = '';
    
    // Set loading indicator to show we're waiting
    setRequestLoading(true, 'Esperando...');
    
    // Debounce: wait 1 second before sending request
    emailValidationTimeout = setTimeout(() => {
        validateEmailWithBackend(email);
    }, 1000);
});

// Generate passport
async function generatePassport() {
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('emailError');
    const generateBtn = document.getElementById('generate');

    // Do not generate until the backend confirmed a completely valid email
    if (!emailValidated) {
        emailError.textContent = 'Verifica tu correo antes de generar el pasaporte';
        document.getElementById('email').classList.add('error');
        return;
    }

    const name = document.getElementById('name').value.trim();
    const alias = document.getElementById('alias').value.trim();
    const job = document.getElementById('job').value.trim();

    // Generate ID based on milliseconds until January 1st 2027
    const id = getTimeLeft();

    // Immediately remove form
	document.getElementById('formSection').style.display = 'none';

    // Start decelerations for the UI counters and the globe
    const globePromise = (window.startGlobeDeceleration) ? window.startGlobeDeceleration(3000) : Promise.resolve();

    // Use the same loading indicator as email validation while submitting.
    generateBtn.disabled = true;
    setRequestLoading(true, 'Enviando datos...');

    try {
        await sendToGoogleSheets(name, alias, job, id, email);
    } finally {
        setRequestLoading(false);
        generateBtn.disabled = false;
    }

    // Wait for both decelerations to finish before showing the passport
    await Promise.all([globePromise]);

    // Display passport
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayAlias').textContent = alias;
    document.getElementById('displayJob').textContent = job;
    document.getElementById('displayId').textContent = id;

    // Show passport section
	document.getElementById('formSection').style.display = 'none';
    document.getElementById('passportSection').style.display = 'block';

    // Scroll to passport
    setTimeout(() => {
        document.getElementById('passportSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Send data to Google Sheets
function sendToGoogleSheets(name, alias, job, id, email) {
   /*
		Pre-filled URL:
		https://docs.google.com/forms/d/e/1FAIpQLScesUbH2jqt1qE1MFt26vBk9pQkichI3hna3yHr9ta6biDk0Q/viewform
		?usp=pp_url&entry.88077336=name&entry.1844988031=alias&entry.1579998128=job&entry.198676562=email&entry.27143037=id
	*/

	// Prepare data    
	const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScesUbH2jqt1qE1MFt26vBk9pQkichI3hna3yHr9ta6biDk0Q/formResponse";
	const data = new URLSearchParams();
	data.append("entry.88077336", name);
	data.append("entry.1844988031", alias);
	data.append("entry.1579998128", job);
	data.append("entry.198676562", email);
	data.append("entry.27143037", id);

	// Send silent POST request and return the promise so callers can await it
	return fetch(formURL, {
     method: "POST",
     	mode: "no-cors", // Stop CORS error message
     	body: data
	}).catch((error) => {
		// Swallow network errors: the submission is best-effort (no-cors)
		console.error('[v0] Error sending to Google Sheets:', error);
	});
}

// Initialize
console.log('Crono Passport loaded successfully!');
