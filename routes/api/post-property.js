const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Property = require("../../models/Property");




router.post("/submit", auth, async (req, res) => {
  const {
    user,
    userTypeSelect,
    propertyForSelect,
    propertyTypeSelect,
    inputLocationCity,
    inputLocationLocality,
    imageDetails,
    furnishings,
    amenities,
    inputBuiltIn,
    inputCarpet,
    propertyBedroom,
    propertyBathroom,
    propertyStudy,
    propertyParking,
    inputCost,
    inputMaintenence,
    builtInUnit
  } = req.body;

  try {
    const property = new Property({
      user: req.user.id,
      postedBy: user,
      userTypeSelect:"",
      propertyForSelect:"",
      propertyTypeSelect:"",
      inputLocationCity:"",
      inputLocationLocality:"",
      imageDetails:[],
      furnishings:[],
      amenities:[],
      inputBuiltIn:"",
      inputCarpet:"",
      propertyBedroom:"",
      propertyBathroom:"",
      propertyStudy:"",
      propertyParking:"",
      inputCost:"",
      inputMaintenence:"",
      builtInUnit:"",
    });
    property.userTypeSelect.set("userTypeSelect",userTypeSelect)
    property.propertyForSelect.set("propertyForSelect",propertyForSelect)
    property.propertyTypeSelect.set("propertyTypeSelect",propertyTypeSelect)
    property.inputLocationCity.set("inputLocationCity",inputLocationCity)
    property.inputLocationLocality.set("inputLocationLocality",inputLocationLocality)
    property.imageDetails=[...imageDetails]
    property.furnishings=[...furnishings]
    property.amenities=[...amenities]
    property.inputBuiltIn.set("inputBuiltIn",inputBuiltIn)
    property.inputCarpet.set("inputCarpet",inputCarpet)
    property.propertyBedroom.set("propertyBedroom",propertyBedroom)
    property.propertyBathroom.set("propertyBathroom",propertyBathroom)
    property.propertyStudy.set("propertyStudy",propertyStudy)
    property.propertyParking.set("propertyParking",propertyParking)
    property.inputCost.set("inputCost",inputCost)
    property.inputMaintenence.set("inputMaintenence",inputMaintenence)
    property.builtInUnit.set("builtInUnit",builtInUnit)
    
    const res_property = await property.save();
    res.json(res_property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
