const path = require("path");
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");

const { port } = require("./constants/common");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const imagesRouter = require("./routes/images");
const commonRouter = require("./routes/common");
const dashboardRouter = require("./routes/dashboard");
const repairNotificationsRouter = require("./routes/repair-notifications");

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/images", imagesRouter);
app.use("/common", commonRouter);
app.use("/dashboard", dashboardRouter);
app.use("/repair_notifications", repairNotificationsRouter);

app.listen(port, () => console.log(`Server is running on ${port}`));
