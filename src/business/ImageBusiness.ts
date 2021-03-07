import { CustomError } from "../errors/CustomError";
import { Image } from "../model/Image";
import { IdGenerator } from "../services/idGenerator";
import { ImageDatabase } from "../data/ImageDatabase";
import { TokenGenerator } from "../services/tokenGenerator";

export class ImageBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private imageDatabase: ImageDatabase,
      private tokenGenerator: TokenGenerator
      ){}

   public async post(
      subtitle: string,
      file: string,
      tags: string[],
      collections: string[],
      token: string
   ) {
      try {
         if (!subtitle || !file) {
            throw new CustomError(422, "Missing input");
         }

         const id = this.idGenerator.generate();
         const author: any = (this.tokenGenerator.verify(token)).id as any;

         var dayjs = require('dayjs')
         const createdAt: Date = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')

         await this.imageDatabase.postImage(
            new Image(id, subtitle, author, createdAt, file, tags, collections)
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
         
         const resultDB = await this.imageDatabase.getImage(
            id
         ) as any
         
         let tags = []
         for (let i=0; i<resultDB[1].length;i++) {
            tags.push(resultDB[1][i].name)
         }

         let collections = []
         for (let i=0; i<resultDB[2].length;i++) {
            collections.push({
               id: resultDB[2][i].id,
               title: resultDB[2][i].title
            })
         }
         
         let imageData: any[] = []
         imageData.push({
               id: resultDB[0][0].id,
               subtitle: resultDB[0][0].subtitle,
               author: resultDB[0][0].author,
               date: resultDB[0][0].date,
               tags: tags,
               file: resultDB[0][0].file,
               collections: collections,
               nickname: resultDB[0][0].nickname
         })

         const result = imageData[0]
         return { result };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getAllImages(
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         const imageData = await this.imageDatabase.getAllImages() as any

         let finalResult = [];

         for (let i = 0; i < imageData.length; i++) {
            let sameName = false;
            for (let j = 0; j < i; j++) {
               if (finalResult[j] && imageData[i].id === finalResult[j].id) {
                  finalResult[j].tags.push(
                     imageData[i].tag
                     )
                     sameName = true;
                     break;
               }
            }
            if (!sameName) {
               finalResult.push({
                     id: imageData[i].id,
                     subtitle: imageData[i].subtitle,
                     author: imageData[i].author,
                     date: imageData[i].date,
                     tags: [
                        imageData[i].tag
                     ],
                     file: imageData[i].file,
                     collection: imageData[i].collection,
                     nickname: imageData[i].nickname
               })
            }
         }
         const result = finalResult
         return { result };
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

   public async addToCollection(
      image_id: string,
      collection: string[],
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         await this.imageDatabase.addToCollection(
            image_id,
            collection
         );
         return { message: "Added to Collections" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async removeFromCollection(
      image_id: string,
      collection: string[],
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         await this.imageDatabase.removeFromCollection(
            image_id,
            collection
         );
         return { message: "Removed from Collections" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
}

export default new ImageBusiness(new IdGenerator(), new ImageDatabase(), new TokenGenerator())