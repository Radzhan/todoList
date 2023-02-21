import express from "express";
import mongoose from "mongoose";
import auth, { RequestWithUser } from "../middleware/auth";
import taskHistory from "../models/Task";

const taskRouter = express.Router();

taskRouter.post("/", auth, async (req, res, next) => {
  const status = req.body.status;
  const userFromToken = (req as RequestWithUser).user;

  if (status !== "new" && status !== "in_progress" && status !== "complete") {
    return res.status(400).send({ error: "incorrect status" });
  }

  const taskData = {
    user: userFromToken._id,
    title: req.body.title,
    status: status,
    description: req.body.description,
  };

  const NewUrl = new taskHistory(taskData);

  try {
    await NewUrl.save();
    return res.send(NewUrl);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.sendStatus(400).send(e);
    } else {
      return next(e);
    }
  }
});

taskRouter.get("/", auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const result = await taskHistory.find({ user: user._id });

    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

taskRouter.put("/:id", auth, async (req, res) => {
  const id = req.params.id as string;
  const object = (req as RequestWithUser).user;
  const task = await taskHistory.findOne({ _id: id });
  if (!task) {
    return res.status(404).send({ error: "task not found" });
  }

  if (object._id.toString() !== task.user.toString()) {
    return res.sendStatus(403);
  }

  const taskData = {
    status: req.body.status,
    title: req.body.title,
    description: req.body.description,
  };

  await taskHistory.updateOne({ _id: id }, taskData);

  res.send(taskData);
});

taskRouter.delete("/:id", auth, async (req, res) => {
  const id = req.params.id as string;
  const object = (req as RequestWithUser).user;
  const task = await taskHistory.findOne({ _id: id });
  if (!task) {
    return res.status(404).send({ error: "task not found" });
  }

  if (object._id.toString() !== task.user.toString()) {
    return res.sendStatus(403);
  }

  await taskHistory.deleteOne({ _id: id });

  res.send("task wad deleted");
});

export default taskRouter;
