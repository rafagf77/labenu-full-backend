import express from "express";
import collectionController from "../controller/CollectionController";

export const collectionRouter = express.Router();

collectionRouter.post("/post", collectionController.post);
// collectionRouter.get("/get/:id", collectionController.getCollectionById);
collectionRouter.get("/get/all", collectionController.getAllCollections);