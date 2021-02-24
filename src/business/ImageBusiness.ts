import { CustomError } from "../errors/CustomError";
import { Image } from "../model/Image";
import { IdGenerator } from "../services/idGenerator";
import { ImageDatabase } from "../data/ImageDatabase";
import { TokenGenerator } from "../services/tokenGenerator";
import { IncomingHttpHeaders } from "http";

export class ImageBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private imageDatabase: ImageDatabase,
      private tokenGenerator: TokenGenerator
      ){}

   public async post(
      subtitle: string,
      author: string,
      file: string,
      tags: string[],
      collection: string,
      token: string
   ) {
      try {
         if (!subtitle || !author || !file) {
            throw new CustomError(422, "Missing input");
         }

         const id = this.idGenerator.generate();
         this.tokenGenerator.verify(token);
         
         var dayjs = require('dayjs')
         const createdAt: Date = dayjs(Date.now()).format('YYYY/MM/DD')

         await this.imageDatabase.postImage(
            new Image(id, subtitle, author, createdAt, file, tags, collection)
         );

         return { message: "Sucessfull image posted" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getImageById(
      id: string,
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         const result = await this.imageDatabase.getImage(
            id
         ) as any
         
         let finalResult = [];

         for (let i = 0; i < result.length; i++) {
            let sameName = false;
            for (let j = 0; j < i; j++) {
               if (finalResult[j] && result[i].id === finalResult[j].id) {
                  finalResult[j].tags.push(
                        result[i].tag
                     )
                     sameName = true;
                     break;
               }
            }
            if (!sameName) {
               finalResult.push({
                     id: result[i].id,
                     subtitle: result[i].subtitle,
                     author: result[i].author,
                     date: result[i].date,
                     tags: [
                        result[i].tag
                     ],
                     file: result[i].file,
                     collection: result[i].collection
               })
            }
         }
         const imageData = finalResult[0]
         return { imageData };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async postTag(
      newTag: string[],
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         await this.imageDatabase.addTag(
            newTag
         );
         return { message: "Tags added" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async delImageById(
      id: string,
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         await this.imageDatabase.delImage(
            id
         ) as any
         return { message: "Image deleted" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
}

export default new ImageBusiness(new IdGenerator(), new ImageDatabase(), new TokenGenerator())