import { Request, Response } from "express";
import { IdGenerator } from "../services/idGenerator";
import { CollectionBusiness } from "../business/CollectionBusiness";
import { CollectionDatabase } from "../data/CollectionDatabase";
import { TokenGenerator } from "../services/tokenGenerator";

const collectionBusiness =
 new CollectionBusiness(new IdGenerator(),
                  new CollectionDatabase(),
                  new TokenGenerator());

export class CollectionController {

   public async post(req: Request, res: Response) {
      try {
         const { title, subtitle } = req.body
         const token: string = req.headers.authorization as string
         const result = await collectionBusiness.post(
            title,
            subtitle,
            token
         );
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async getCollectionById(req: Request, res: Response) {
      try {
         const { id } = req.params
         const token: string = req.headers.authorization as string
         const result = await collectionBusiness.getCollectionById(id, token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   public async getAllCollections(req: Request, res: Response) {
      try {
         const token: string = req.headers.authorization as string
         const result = await collectionBusiness.getAllCollections(token);
         res.status(200).send(result);
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message });
      }
   }

   // public async postTag(req: Request, res: Response) {
   //    try {
   //       const { newTag } = req.query as any
   //       const token: string = req.headers.authorization as string
   //       const result = await imageBusiness.postTag(newTag, token);
   //       res.status(200).send(result);
   //    } catch (error) {
   //       const { statusCode, message } = error
   //       res.status(statusCode || 400).send({ message });
   //    }
   // }

   // public async delImageById(req: Request, res: Response) {
   //    try {
   //       const { id } = req.params
   //       const token: string = req.headers.authorization as string
   //       const result = await imageBusiness.delImageById(id, token);
   //       res.status(200).send(result);
   //    } catch (error) {
   //       const { statusCode, message } = error
   //       res.status(statusCode || 400).send({ message });
   //    }
   // }

}

export default new CollectionController()