import express from 'express';
import foodController from '../controllers/foodController';

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const foodList = await foodController.listFood();
    res.json(foodList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching food list" });
  }
});

export default router;