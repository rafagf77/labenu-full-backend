import express from "express";
import imageController from "../controller/ImageController";

export const imageRouter = express.Router();

imageRouter.post("/post", imageController.post);