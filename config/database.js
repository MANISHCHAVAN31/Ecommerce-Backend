const mongoose = require("mongoose");

const connectDatabase = async () => {
  mongoose.set("strictQuery", false);

  await mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DATABASE CONNECTED SUCCESSFULLY"))
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDatabase;
