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
         const { subtitle, author, date, file, tags, collection } = req.body
         const token: string = req.headers.authorization as string
         const result = await imageBusiness.post(
            subtitle,
            author,
            date,
            file,
            tags,
            collection,
            token
         );
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   // public async getUserById(req: Request, res: Response) {
   //    try {
   //       const { id } = req.params
   //       const result = await userBusiness.getUserById(id);
   //       res.status(200).send(result);
   //    } catch (error) {
   //       const { statusCode, message } = error
   //       res.status(statusCode || 400).send({ message });
   //    }
   // }
}

export default new ImageController()