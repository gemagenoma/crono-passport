# Email Validation Implementation

## Overview

Complete email validation solution with **frontend** and **backend** validation for the Crono Passport Generator.

## Frontend Validation

### Features
- **Empty field check**: Prevents empty email submission
- **Syntax validation**: Validates email format using regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Real-time feedback**: Shows validation status as user types

### Behavior
1. **On input**: 
   - Empty field → No error, button hidden
   - Invalid syntax → Error message displayed, button hidden
   - Valid syntax → No error, button shown

2. **On blur (Lost focus)**:
   - Triggers backend validation (DNS, disposable email check)
   - Shows appropriate error if backend validation fails

### Error Messages (Soft Red: #e8bab8)
- `"Por favor, introduce un correo válido"` - Syntax error
- Displayed below the email input field in the same Courier New font
- Uses animated slide-up effect for smooth appearance

## Backend Validation

### API Endpoint
- **URL**: `POST /api/validate-email`
- **Port**: 3000 (configurable via `PORT` env var)
- **Request body**: `{ "email": "user@example.com" }`
- **Response**: `{ "valid": true/false, "error": "error message if invalid" }`

### Validation Checks

#### 1. **Syntax Validation**
- Checks email format: `user@domain.com`
- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Error: `"Por favor, introduce un correo válido"`

#### 2. **Disposable Email Detection**
- Maintains a blocklist of 300+ known temporary email providers
- Includes: tempmail.com, guerrillamail.com, 10minutemail.com, mailinator.com, etc.
- Error: `"No se aceptan correos temporales"` (Temporary emails not accepted)

#### 3. **Domain MX Record Check**
- Verifies the email domain actually exists via DNS MX records
- Uses Node.js native `dns.resolveMx()` for zero external API dependency
- Error: `"El dominio del correo no existe"` (Email domain doesn't exist)

### Tech Stack
- **Framework**: Express.js (lightweight, fast)
- **DNS Resolution**: Node.js built-in `dns.promises` module
- **No external APIs**: All validation is done locally
- **CORS**: Serves from localhost, no CORS issues

## How It Works

### Step-by-Step User Flow

1. User enters name → Alias field appears
2. User enters alias → Job field appears
3. User enters job → Email field appears
4. User enters email:
   - **Immediate (frontend)**: Checks empty and syntax
   - **On field blur**: Calls backend API for:
     - Syntax re-check
     - Disposable email blocklist check
     - DNS MX record verification
5. If all validations pass → Submit button shows
6. User clicks submit → Passport generated and data sent to Google Sheets

### Error Display
- All errors appear in **soft red (#e8bab8)**
- Font: Same Courier New as the form
- Location: Directly below the email input field
- Styling: `font-size: 0.9em`, `margin-top: -20px`
- Animation: Slide-up effect (0.3s ease-out)

## Installation & Usage

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start the server
npm start
# Server runs on http://localhost:3000
```

### Testing

#### Test Frontend Validation
1. Open http://localhost:3000
2. Enter name, alias, job in sequence
3. Email field appears
4. Try typing invalid formats:
   - `test` → Error: "Por favor, introduce un correo válido"
   - `test@` → Error: "Por favor, introduce un correo válido"
   - `test@domain` → Error: "Por favor, introduce un correo válido"

#### Test Backend Validation via cURL

**Test 1: Disposable Email**
```bash
curl -X POST http://localhost:3000/api/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@tempmail.com"}'
# Response: {"valid": false, "error": "No se aceptan correos temporales"}
```

**Test 2: Non-existent Domain**
```bash
curl -X POST http://localhost:3000/api/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@thisisnotarealdomain12345.com"}'
# Response: {"valid": false, "error": "El dominio del correo no existe"}
```

**Test 3: Valid Email**
```bash
curl -X POST http://localhost:3000/api/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
# Response: {"valid": true}
```

## File Structure

```
/vercel/share/v0-project/
├── server.js              # Backend Express server
├── package.json           # Node dependencies
├── index.html             # Form with email field
├── script.js              # Frontend validation logic
├── style.css              # Styles (including error message styles)
└── EMAIL_VALIDATION_README.md (this file)
```

## Customization

### Change Email Blocklist
Edit the `DISPOSABLE_EMAILS` Set in `server.js` (lines 9-299):
```javascript
const DISPOSABLE_EMAILS = new Set([
    'your-domain.com',
    'another-temp-email.com',
    // ... more domains
]);
```

### Change Error Messages
In `server.js`, update the response messages:
```javascript
return res.json({ valid: false, error: "Your custom message" });
```

### Change Error Color
In `style.css`, modify the CSS variable:
```css
:root {
    --error-color: #e8bab8;  /* Change this value */
}
```

### Change Validation Regex
In `script.js`, modify the pattern:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Change this
```

## Important Notes

- **No external API calls**: All validation is local and instant (except DNS MX check)
- **DNS MX check**: Takes 100-500ms depending on the domain's DNS provider
- **Production Ready**: Includes proper error handling and logging
- **CORS Friendly**: Frontend and backend on same origin (localhost:3000)
- **User Experience**: Progressive validation (syntax first, then backend)
- **Privacy**: Email is only validated, never stored (unless sent to Google Sheets)

## Disposable Email Domains Included

The blocklist includes 300+ temporary/disposable email providers:
- **Tempmail variants**: tempmail.com, temp-mail.io, temporary-mail.net
- **Guerrilla Mail variants**: guerrillamail.com, sharklasers.com
- **10 Minute Mail**: 10minutemail.com, nada.tf, getnada.com
- **Throwaway services**: throwaway.email, dispostable.com
- **Mailinator**: mailinator.com, maildrop.cc
- **YOPmail**: yopmail.com
- **Plus many more...**

New temporary email services are created regularly. Update the list periodically as needed.

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### DNS Resolution Slow
- DNS queries can take 100-500ms
- This is normal; results are cached
- Consider adding a timeout if needed

### "Backend validation not running"
- Ensure server is running: `npm start`
- Check port: `lsof -i :3000`
- Check console for errors

### CORS Issues
- Not applicable; both frontend and backend run on `localhost:3000`
- If deployed, ensure CORS is configured in `server.js`

## Future Enhancements

- Add SMTP verification (connect to mail server and verify account exists)
- Implement rate limiting on validation endpoint
- Add caching for DNS results
- Generate more dynamic blocklist from public sources
- Add email deliverability scoring
