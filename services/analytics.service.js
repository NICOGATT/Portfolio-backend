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
        metrics : [
            {
                name : "activeUsers",
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

    const rawDate = row.dimensionValues[0].value; 
    const date = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
    return {
        date, 
        users : Number(row.metricValues[0].value)
    }
}
module.exports = {
    getOverview, 
    getVisits
};