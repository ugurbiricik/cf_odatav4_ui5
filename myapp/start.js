const cds = require('@sap/cds');
const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

async function startApplication() {
    // Express app oluştur
    const app = express();

    try {
        // XSUAA service konfigürasyonu (cloud için)
        if (process.env.VCAP_SERVICES) {
            const xsuaaService = xsenv.getServices({ uaa: 'nodeuaa' });
            passport.use(new JWTStrategy(xsuaaService.uaa));
            app.use(passport.initialize());
        }

        app.use(express.json());

        // CDS servisleri başlat
        await cds.connect.to('db'); // Veritabanı bağlantısı
        const service = await cds.serve('UserService').in(app);

        // CORS ayarları (development için)
        if (process.env.NODE_ENV !== 'production') {
            app.use((req, res, next) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                next();
            });
        }

    } catch (err) {
        console.error('Error starting services:', err);
    }

    // Port ayarı
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startApplication().catch(console.error);