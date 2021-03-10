import express from "express";
import imageController from "../controller/ImageController";

export const imageRouter = express.Router();

imageRouter.post("/post", imageController.post);
imageRouter.get("/get/:id", imageController.getImageById);
imageRouter.get("/all", imageController.getAllImages);
imageRouter.delete("/del/:id", imageController.delImageById);
imageRouter.post("/collection/:id", imageController.addToCollection);
imageRouter.delete("/collection/:id", imageController.removeFromCollection);
imageRouter.get("/tag/:id", imageController.getImagesByTagId);