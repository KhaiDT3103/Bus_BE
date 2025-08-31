const express = require("express");
const router = express.Router();
const bus_routesController = require('../controllers/bus_routesControllers');

router.post("/addBusRoutes", bus_routesController.addBusRoutes);
router.get("/getBusRoutesList", bus_routesController.getAllBusRoutes);
router.get("/routeInfo/:route_id", bus_routesController.getRouteInfoByID);
router.get("/search", bus_routesController.searchBusRoutes);
router.put("/routes/:id", bus_routesController.updateBusRoute);
router.delete('/deleteBusRoute/:id', bus_routesController.deleteBusRoute);
module.exports = router;