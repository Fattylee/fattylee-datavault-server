import mongoose from "mongoose";
import { Application } from "express";

export const startConnection = (app: Application) => {
  mongoose
    .connect(process.env.MONGO_URI!)
    .then((_res) => {
      console.log("Succesfully connected to mongodb:", process.env.MONGO_URI!);
      const port = process.env.PORT;
      app.listen(port, () => {
        console.log("Server running on port", port);
      });
    })
    .catch((err) => {
      console.error("Could not connect to db", err);
      process.exit(1);
    });
};
