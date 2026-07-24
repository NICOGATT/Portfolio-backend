const analyticsService = require('../services/analytics.service');

async function getOverview(req, res) {
    try {
        const startDate = 
            typeof req.query.startDate === "string"
                ? req.query.startDate
                : '30daysAgo';

        const endDate = 
            typeof req.query.endDate === "string"
                ? req.query.endDate
                : 'today';

        const overview = await analyticsService.getOverview(startDate, endDate);
        return res.status(200).json(overview);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
}

async function getVisits(req, res) {
  try {
    const startDate =
      typeof req.query.startDate === "string"
        ? req.query.startDate
        : "30daysAgo";

    const endDate =
      typeof req.query.endDate === "string"
        ? req.query.endDate
        : "today";

    const visits = await analyticsService.getVisits(startDate, endDate);

    return res.status(200).json(visits);
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    return res.status(500).json({
      error: "Error al obtener visitas",
    });
  }
}
module.exports = {
    getOverview, 
    getVisits
};