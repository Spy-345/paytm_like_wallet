import express from "express";
import { User } from "./db.js";
import cors from "cors";
import { rootRouter } from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

//Using the cors to allow the cross site connection
app.use(cors());

// bodyParser not needed as it is integrated in the express to the parse the request body from the JSON string to json object.
app.use(express.json());

//Routing the all requests to the Index router
app.use("/api/v1", rootRouter);

//Express listening on port 3000 or process port
app.listen(port, () => console.log("Server Started on port ", port));
