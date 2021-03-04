import { CustomError } from "../errors/CustomError";
import { Collection } from "../model/Collection";
import { IdGenerator } from "../services/idGenerator";
import { CollectionDatabase } from "../data/CollectionDatabase";
import { TokenGenerator } from "../services/tokenGenerator";

export class CollectionBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private collectionDatabase: CollectionDatabase,
      private tokenGenerator: TokenGenerator
      ){}

   public async post(
      title: string,
      subtitle: string,
      image: string,
      token: string
   ) {
      try {
         if (!subtitle || !title) {
            throw new CustomError(422, "Missing input");
         }

         const id = this.idGenerator.generate();
         const author: any = (this.tokenGenerator.verify(token)).id as any;

         var dayjs = require('dayjs')
         const createdAt: Date = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
         console.log(createdAt)

         await this.collectionDatabase.postCollection(
            new Collection(id, title, subtitle, createdAt, image, author)
         );

         return { message: "Sucessfull collection posted" };
      } catch (error) {
         console.log(error)
         throw new CustomError(error.statusCode, error.message)
      }
   }

   // public async getCollectionById(
   //    id: string,
   //    token: string
   // ) {
   //    try {
   //       this.tokenGenerator.verify(token);
         
   //       const imageData = await this.collectionDatabase.getCollection(
   //          id
   //       ) as any
         
   //       let finalResult = [];

   //       for (let i = 0; i < imageData.length; i++) {
   //          let sameName = false;
   //          for (let j = 0; j < i; j++) {
   //             if (finalResult[j] && imageData[i].id === finalResult[j].id) {
   //                finalResult[j].tags.push(
   //                   imageData[i].tag
   //                   )
   //                   sameName = true;
   //                   break;
   //             }
   //          }
   //          if (!sameName) {
   //             finalResult.push({
   //                   id: imageData[i].id,
   //                   subtitle: imageData[i].subtitle,
   //                   author: imageData[i].author,
   //                   date: imageData[i].date,
   //                   tags: [
   //                      imageData[i].tag
   //                   ],
   //                   file: imageData[i].file,
   //                   collection: imageData[i].collection,
   //                   nickname: imageData[i].nickname
   //             })
   //          }
   //       }
   //       const result = finalResult[0]
   //       return { result };
   //    } catch (error) {
   //       throw new CustomError(error.statusCode, error.message)
   //    }
   // }

   public async getAllCollections(
      token: string
   ) {
      try {
         const author = (this.tokenGenerator.verify(token)).id;
         
         const result = await this.collectionDatabase.getAllCollections(author) as any

         return { result };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }


   // public async postTag(
   //    newTag: string[],
   //    token: string
   // ) {
   //    try {
   //       this.tokenGenerator.verify(token);
         
   //       await this.collectionDatabase.addTag(
   //          newTag
   //       );
   //       return { message: "Tags added" };
   //    } catch (error) {
   //       throw new CustomError(error.statusCode, error.message)
   //    }
   // }

   // public async delImageById(
   //    id: string,
   //    token: string
   // ) {
   //    try {
   //       this.tokenGenerator.verify(token);
         
   //       await this.collectionDatabase.delImage(
   //          id
   //       ) as any
   //       return { message: "Image deleted" };
   //    } catch (error) {
   //       throw new CustomError(error.statusCode, error.message)
   //    }
   // }
}

export default new CollectionBusiness(new IdGenerator(), new CollectionDatabase(), new TokenGenerator())