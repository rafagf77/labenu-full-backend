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
      date: Date,
      file: string,
      tags: string[],
      collection: string,
      token: string
   ) {
      try {
         if (!subtitle || !author || !date || !file) {
            throw new CustomError(422, "Missing input");
         }

         const id = this.idGenerator.generate();
         this.tokenGenerator.verify(token);
         
         // var dayjs = require('dayjs')
         // const createdAt: Date = dayjs(Date.now()).format('YYYY/MM/DD')

         await this.imageDatabase.postImage(
            new Image(id, subtitle, author, date, file, tags, collection)
         );

         return { message: "Sucessfull image posted" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }

   }

}

export default new ImageBusiness(new IdGenerator(), new ImageDatabase(), new TokenGenerator())