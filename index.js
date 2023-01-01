// dotenv config
require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

// database connnection
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
