const express = require("express");
const router = express.Router();
const StopController = require('../controllers/stopsControllers');

router.post("/addStop", StopController.addStop);
router.post("/addMultiStop", StopController.addMultipleStops);
router.get("/getStops", StopController.getAllStops);
router.get("/getDuplicateNames", StopController.getDuplicateNames);
router.get("/getStopByRouteID/:routeNumber", StopController.getStopsByRoutesID);
router.delete("/delStop/:id", StopController.deleteStopById);
module.exports = router;