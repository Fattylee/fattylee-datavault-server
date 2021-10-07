import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.cookie("auth-cookie", "hellobobby");
  res.status(200).send("Welcome to DataVault server");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port, ${PORT}`));
