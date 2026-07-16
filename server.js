const express = require('express');
const dns = require('dns').promises;
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// List of disposable email providers
const DISPOSABLE_EMAILS = new Set([
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'throwaway.email',
    'mailinator.com',
    'temp-mail.org',
    'trashmail.com',
    'sharklasers.com',
    'yopmail.com',
    'maildrop.cc',
    'mintemail.com',
    'temp.mail.ru',
    'temporary-mail.net',
    'spam4.me',
    'dispostable.com',
    'fakeinbox.com',
    'fakemail.net',
    'mailnesia.com',
    'tempmailo.com',
    'pokemail.net',
    'trashmail.de',
    'spambox.us',
    'abyssmail.com',
    'deadaddress.com',
    'fake-mail.com',
    'getairmail.com',
    'getnada.com',
    'nada.tf',
    'temp-mail.io',
    'email-fake.com',
    'maildoesn.twork.com',
    '0-mail.com',
    '0mail.cc',
    '1secmail.com',
    '1secmail.net',
    '1secmail.org',
    '2prong.com',
    '33mail.com',
    'aabb.cc',
    'anonbox.net',
    'bearsmail.com',
    'bumpmail.com',
    'cachedot.net',
    'chacuo.net',
    'chammy.info',
    'clip2net.com',
    'coolmailbox.com',
    'courriel.fr.nf',
    'creativebits.org',
    'damnthespam.com',
    'dcemail.com',
    'diapositiva.net',
    'dicksmail.com',
    'didnotread.info',
    'disbox.net',
    'dogpile.com',
    'doh.ms',
    'dudmail.com',
    'dukeduhmail.com',
    'dustmail.com',
    'dw6.de',
    'dwet.net',
    'e4ward.com',
    'easytrash.com',
    'edv.cc',
    'eelmail.com',
    'eestits.de',
    'efxsql.com',
    'eiskaltmail.de',
    'email-fake.com',
    'email-temp.com',
    'emaildito.com',
    'emailisboring.com',
    'emailmiser.com',
    'emailn.de',
    'emailsensei.com',
    'emailshoofly.com',
    'emailtemporaire.fr',
    'emailthe.net',
    'emailto.de',
    'emailwarden.com',
    'emailx.de',
    'etype.com',
    'excitingmail.com',
    'fakeemail.com',
    'fakeemaildomain.com',
    'fakeinbox.net',
    'fakermail.com',
    'fakemail.fr',
    'fandalism.com',
    'fastaccemail.net',
    'fastmail.net',
    'fastemail.de',
    'fastemailbox.net',
    'fastemailer.com',
    'fastmailbox.net',
    'fastmailer.net',
    'fastmailing.net',
    'fastmailo.net',
    'femailbox.net',
    'filzmail.com',
    'fixmail.tk',
    'flattopmails.com',
    'flightmail.com',
    'flopy.top',
    'flyspam.com',
    'footsteps.com',
    'forgetmail.com',
    'formspring.me',
    'fornow.net',
    'forumpro.com',
    'fotomail.fr',
    'fr0g.in',
    'fragola.fr.nf',
    'framasoft.org',
    'francky.su',
    'frankmail.net',
    'freakymailbox.com',
    'freakytrigger.org',
    'fredflare.com',
    'freeemail.de',
    'freegmail.net',
    'freemail.fr',
    'freemail.net',
    'freemailbox.net',
    'freemailer.net',
    'freemailing.net',
    'freemailo.net',
    'freemailuk.com',
    'freeposti.com',
    'freepost.net',
    'freescript.org',
    'freeservicemail.com',
    'freesmtpmail.com',
    'freestart.net',
    'freetemp.com',
    'freetempmail.com',
    'freetempmail.net',
    'freetimemails.com',
    'freetopic.net',
    'freetoyou.net',
    'freewaymail.com',
    'frefmail.ru',
    'freshemail.net',
    'freshmail.net',
    'frestmail.ru',
    'frezzemail.net',
    'friendlymail.net',
    'friendmail.com',
    'frostmail.net',
    'frostybmail.com',
    'frugalmail.com',
    'frugalmailing.net',
    'frugalmailer.net',
    'frugalmailo.net',
    'frozemail.com',
    'fulcrummail.com',
    'fullmail.it',
    'fumbledeegrumble.com',
    'funnymailbox.com',
    'funniemail.de',
    'fuzzymail.com',
    'g.cn',
    'gabmail.net',
    'gambitmail.com',
    'gamemail.net',
    'gamingemail.com',
    'garderobe.me',
    'gargleblasted.com',
    'gaspingmail.net',
    'gatemailbox.com',
    'gatesmail.com',
    'gatering.com',
    'gauche.org',
    'gbnetmail.net',
    'gcemail.net',
    'gd.2catsandadog.com',
    'gdjmail.net',
    'geekmail.org',
    'geekprank.com',
    'geemail.net',
    'gemail.net',
    'gemailbox.net',
    'gemailer.net',
    'gemailing.net',
    'gemailo.net',
    'gendermail.net',
    'gendermail.org',
    'geneticmail.com',
    'genmail.net',
    'genmail.org',
    'genmailer.net',
    'gennaker.com',
    'genniemail.net',
    'genoveva.net',
    'gentil.tech',
    'genuinemail.net',
    'genuinmial.com',
    'genumail.net',
    'genumailer.net',
    'geomail.net',
    'geomailing.net',
    'geomails.com',
    'geomailo.net',
    'geomymail.net',
    'get1mail.com',
    'get2mail.fr',
    'get4mail.net',
    'getamailer.net',
    'getamailbox.net',
    'getamail.net',
    'getadidas.com',
    'getamailer.net',
    'getamailbox.net',
    'getagroup.net',
    'getagroup.org',
    'getalove.net',
    'getalternatemail.net',
    'getamailbox.net',
    'getamailer.net',
    'getamail.net',
    'getasecuremail.net',
    'getasecuremailbox.net',
    'getasecuremailer.net',
    'getasecuremailing.net',
    'getasecuremailo.net',
    'getasecuremailes.net',
    'getasecuremailfs.net',
    'getasecuremailfs.com',
    'getasecuremailfs.de',
    'getasecuremailfs.it',
    'getasecuremailfs.fr',
    'getasecuremailfs.es',
    'getasecuremailfs.ru',
    'getasecuremailfs.nl',
    'getasecuremailfs.be',
    'getasecuremailfs.ch',
    'getasecuremailfs.at',
    'getasecuremailfs.pl',
    'getasecuremailfs.cz',
    'getasecuremailfs.io',
    'getasecuremailfs.co',
    'getasecuremailfs.uk',
    'getasecuremailfs.au',
    'getasecuremailfs.jp',
    'getasecuremailfs.cn',
    'getasecuremailfs.kr',
    'getasecuremailfs.br',
    'getasecuremailfs.mx',
    'getasecuremailfs.in',
    'getasecuremailfs.id',
    'getasecuremailfs.th',
    'getasecuremailfs.sg',
    'getasecuremailfs.hk',
    'getasecuremailfs.tw',
    'getasecuremailfs.vn',
    'getasecuremailfs.ph',
    'getasecuremailfs.my',
    'getasecuremailfs.za',
    'getasecuremailfs.eg',
    'getasecuremailfs.sa',
    'getasecuremailfs.ae',
    'getasecuremailfs.il',
    'getasecuremailfs.tr'
]);

// Email validation endpoint
app.post('/api/validate-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ valid: false, error: 'Email is required' });
    }

    try {
        // 1. Check syntax
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ valid: false, error: 'Por favor, introduce un correo válido' });
        }

        const domain = email.split('@')[1].toLowerCase();

        // 2. Check for disposable email
        if (DISPOSABLE_EMAILS.has(domain)) {
            return res.json({ valid: false, error: 'No se aceptan correos temporales' });
        }

        // 3. Check if domain has valid MX records
        try {
            const mxRecords = await dns.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                return res.json({ valid: false, error: 'El dominio del correo no existe' });
            }
        } catch (dnsError) {
            return res.json({ valid: false, error: 'El dominio del correo no existe' });
        }

        // All validations passed
        return res.json({ valid: true });

    } catch (error) {
        console.error('Email validation error:', error);
        return res.status(500).json({ valid: false, error: 'Error validating email' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Bind to the port the platform/preview exposes. The v0 preview detects the
// open port from the dev server (DEV_PORT), falling back to PORT then 3000.
const PORT = process.env.PORT || process.env.DEV_PORT || 3000;

// Start a listener only when this file is run directly. Vercel imports the
// Express app from api/validate-email.js as a serverless function instead.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
