const {BetaAnalyticsDataClient} = require('@google-analytics/data'); 

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GA_CLIENT_EMAIL; 
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

if(!propertyId || !clientEmail || !privateKey) {
    throw new Error(
        'Faltan GA_PROPERTY_ID, GA_CLIENT_EMAIL o GA_PRIVATE_KEY'
    )
}

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        clientEmail,
        privateKey,
    },
});

const analyticsProperty = `properties/${propertyId}`;

module.exports = {analyticsDataClient, analyticsProperty};

