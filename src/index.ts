import express from "express";
import {AddressInfo} from "net";
import { imageRouter } from "./router/ImageRouter";
import { userRouter } from "./router/UserRouter";

const app = express();
var cors = require('cors')

app.use(express.json());
app.use(cors())

app.use("/users", userRouter);
app.use("/images", imageRouter);

const server = app.listen(3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});