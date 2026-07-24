const {BetaAnalyticsDataClient} = require('@google-analytics/data'); 

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GA_CLIENT_EMAIL; 
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!propertyId) {
  throw new Error('Falta GA_PROPERTY_ID');
}

if (!clientEmail) {
  throw new Error('Falta GA_CLIENT_EMAIL');
}

if (!privateKey) {
  throw new Error('Falta GA_PRIVATE_KEY');
}

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email : clientEmail,
        private_key : privateKey,
    },
});

const analyticsProperty = `properties/${propertyId}`;

module.exports = {analyticsDataClient, analyticsProperty};

