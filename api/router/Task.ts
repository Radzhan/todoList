import express from "express";
import mongoose from "mongoose";
import auth, { RequestWithUser } from "../middleware/auth";
import taskHistory from "../models/Task";

const taskRouter = express.Router();

taskRouter.post("/", auth, async (req, res, next) => {
  const userFromToken = (req as RequestWithUser).user;

  if (req.params.status !== "new" || "in_progress" || "complete") {
    return res.sendStatus(404).send("incorrect status");
  }

  const taskData = {
    user: userFromToken._id,
    title: req.body.title,
    status: req.params.status,
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
  try {
    const id = req.params.id as string;
    const object = (req as RequestWithUser).user;
    const task = await taskHistory.findOne({ _id: id });
    if (!task) {
      return res.sendStatus(404).send("user not found");
    }

    if (object._id.toString() !== task.user.toString()) {
      return res.sendStatus(403);
    }

    const taskData = {
      status: req.params.status,
      title: req.body.title,
      description: req.body.description,
    };

    await taskHistory.updateOne({ _id: id }, taskData);

    res.send(taskData);
  } catch {}
});

export default taskRouter;
