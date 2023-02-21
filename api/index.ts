import express from "express";
import mongoose from "mongoose";
import taskRouter from "./router/Task";
import usersRouter from "./router/User";

const app = express();
const port = 8000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/tasks", taskRouter);

const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect("mongodb://localhost/Todoist");

  app.listen(port, () => {
    console.log("we are live on " + port);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
