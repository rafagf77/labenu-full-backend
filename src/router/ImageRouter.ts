import express from "express";
import imageController from "../controller/ImageController";

export const imageRouter = express.Router();

imageRouter.post("/post", imageController.post);
imageRouter.get("/get/:id", imageController.getImageById);
imageRouter.get("/all", imageController.getAllImages);
imageRouter.post("/tag", imageController.postTag);
imageRouter.delete("/del/:id", imageController.delImageById);