router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authController.login(req, res);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});