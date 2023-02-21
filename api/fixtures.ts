import crypto from "crypto";
import mongoose from "mongoose";
import config from "./config";
import taskHistory from "./models/Task";
import Users from "./models/Users";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("taskhistories");
    await db.dropCollection("users");
  } catch (e) {
    console.log("Collections were not present, skipping drop...");
  }

  const [doe, user] = await Users.create(
    {
      username: "doe",
      password: "1234",
      token: crypto.randomUUID(),
    },
    {
      username: "user",
      password: "5678",
      token: crypto.randomUUID(),
    }
  );

  await taskHistory.create(
    {
      user: doe._id,
      title: "Intel Core i7 12700K",
      status: "new",
      description: "some desc",
    },
    {
      user: user._id,
      title: "Intel Core i7 12700K",
      status: "complete",
      description: "another one desc",
    }
  );

  await db.close();
};

run().catch(console.error);
