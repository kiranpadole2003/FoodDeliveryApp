import foodModel from "../models/foodModel.js";
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';


// add food item

const addFood = async (req,res) => {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) {
        return res.json({ success: false, message: "Image file missing" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try {
        await food.save();
        res.json({succes:true,message:"Food Added"})
    } catch (error) {
        console.log("Error saving food:", error);
        res.json({success:false,message:"Error"})
    }

}

// all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// remove food item
const removeFood = async (req, res) => {
    try {
      const food = await foodModel.findById(req.body.id);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food not found" });
      }
  
      // Get the image path
      const imagePath = path.join("uploads", food.image);
  
      // Check if file exists before deleting
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log("Image deleted:", imagePath);
            }
          });
        } else {
          console.warn("Image file not found:", imagePath);
        }
      });
  
      // Delete document from MongoDB
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
  
    } catch (error) {
      console.log("Error deleting food:", error);
      res.status(500).json({ success: false, message: "Error" });
    }
  };
  

export {addFood,listFood,removeFood}