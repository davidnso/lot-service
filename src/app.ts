import * as http from "http";
import { ExpressDriver } from "./drivers/express/ExpressDriver";
import { MongoDriver } from "./drivers/mongo/MongoDriver";
//import { MongoDriver } from "./drivers/mongo/MongoDataStoreBuilder";
require("dotenv").config();
new MongoDriver();

const app = ExpressDriver.build();
const server = http.createServer(app);

// const DB_URI = process.env.DB_URI?.replace(
//   /<password>/g,
//   process.env.DB_PASSWORD as string
// );
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`)
  })

if (MongoDriver.getInstance() !==undefined) {
  // new MongoDriver(DB_URI)
  server.listen(process.env.PORT, () => {
    console.log(`LOT Server listening on port ${process.env.PORT}`);
  });
} else {
  console.log(`Database Uri is undefined`);
  server.listen(process.env.PORT, () => {
    console.log(`LOT Server listening on port ${process.env.PORT}`);
  });
}