import { connectDb } from "./db/index.js";
import { app } from "./app.js";

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("Db is connected and app is started listening");
    });
  })
  .catch((err) => {
    console.log("Connection Fialed");
  });
