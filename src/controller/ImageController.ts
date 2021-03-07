import { Request, Response } from "express";
import { IdGenerator } from "../services/idGenerator";
import { ImageBusiness } from "../business/ImageBusiness";
import { ImageDatabase } from "../data/ImageDatabase";
import { TokenGenerator } from "../services/tokenGenerator";

const imageBusiness =
 new ImageBusiness(new IdGenerator(),
                  new ImageDatabase(),
                  new TokenGenerator());

export class ImageController {

   public async post(req: Request, res: Response) {
      try {
         const { subtitle, file, tags, collections } = req.body
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.post(
            subtitle,
            file,
            tags,
            collections,
            token
         );
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async getImageById(req: Request, res: Response) {
      try {
         const { id } = req.params
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.getImageById(id, token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async getAllImages(req: Request, res: Response) {
      try {
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.getAllImages(token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async postTag(req: Request, res: Response) {
      try {
         const { newTag } = req.query as any
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.postTag(newTag, token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async delImageById(req: Request, res: Response) {
      try {
         const { id } = req.params
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.delImageById(id, token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async addToCollection(req: Request, res: Response) {
      try {
         const { collection } = req.query as any
         const image_id = req.params.id as any
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.addToCollection(image_id, collection, token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async removeFromCollection(req: Request, res: Response) {
      try {
         const { collection } = req.query as any
         const image_id = req.params.id as any
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.removeFromCollection(image_id, collection, token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }


}

export default new ImageController()