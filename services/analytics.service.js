const { date } = require('joi');
const {
    analyticsDataClient, 
    analyticsProperty
} = require('../config/googleAnalitycs');

function getMetricValue(metricValues, index) {
    return Number(metricValues?.[index]?.value || 0)
}

async function getOverview(startDate = '30daysAgo', endDate = 'today') {
    const [response] = await analyticsDataClient.runReport({
        property : analyticsProperty,
        dateRanges: [
            {
                startDate,
                endDate,
            }
        ],
        metrics: [
            {name: 'totalUsers'},
            {name: 'activeUsers'},
            {name: 'newUsers'},
            {name: 'sessions'},
            {name: "screenPageViews"},
            {name: 'engagementRate'},
            {name: 'averageSessionDuration'},
        ],
    })

    const metricValues = response.rows?.[0]?.metricValues; 

    return {
        users : getMetricValue(metricValues, 0),
        activeUsers : getMetricValue(metricValues, 1),
        newUsers : getMetricValue(metricValues, 2),
        sessions : getMetricValue(metricValues, 3),
        screenPageViews : getMetricValue(metricValues, 4),
        engagementRate : getMetricValue(metricValues, 5),
        averageSessionDuration : getMetricValue(metricValues, 6),
    }
}

async function getVisits(startDate = "30daysAgo", endDate = "today") {
    const [response] = await analyticsDataClient.runReport({
        property : analyticsProperty, 
        dateRanges : [
            {
                startDate, 
                endDate, 
            }, 
        ], 
        dimensions : [
            {
                name : "date",
            }
        ], 
        orderBys : [
            {
                dimension : {
                    dimensionName : "date"
                }
            }
        ]
    })

    return response.rows.map((row) => ({
        date : row.dimensionValues[0].value, 
        users : Number(row.metricValues[0].value)
    }))
}
module.exports = {
    getOverview, 
    getVisits
};