import express from "express";
import collectionController from "../controller/CollectionController";

export const collectionRouter = express.Router();

collectionRouter.post("/post", collectionController.post);
collectionRouter.get("/get/:id", collectionController.getCollectionById);
collectionRouter.get("/all", collectionController.getAllCollections);
collectionRouter.delete("/del/:id", collectionController.delCollectionById);