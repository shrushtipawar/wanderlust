const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapasync(listingController.index))
 .post(isLoggedIn,upload.single('listing[image]') ,wrapasync(listingController.createListing));






// New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Show route
router.get("/:id", wrapasync(listingController.showListing));






// Edit route
router.get("/:id/edit", isLoggedIn, wrapasync(isOwner), wrapasync(listingController.renderEditform));


// Update route
router.put("/:id",
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),  // <-- ADD THIS HERE
  validateListing,
  wrapasync(listingController.updateListing)
);


// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapasync,(listingController.renderDelete));

module.exports = router;