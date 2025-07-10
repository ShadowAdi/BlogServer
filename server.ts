import express from "express";
import { logger } from "./utils/logger.js";
import { UserRouter } from "./router/UserRouter.js";
import { BlogRouter } from "./router/BlogRouter.js";
import { CommentRouter } from "./router/commentRouter.js";

const app = express();

const PORT = process.env.PORT;

app.use("/api/users",UserRouter)
app.use("/api/blogs",BlogRouter)
app.use("/api/comments",CommentRouter)


app.listen(PORT, () => {
  logger.info(`Server Started at PORT: ${PORT}`);
  console.log("Server Started at PORT: " + PORT);
});
