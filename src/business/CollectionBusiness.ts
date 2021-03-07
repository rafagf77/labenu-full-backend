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

         await this.collectionDatabase.postCollection(
            new Collection(id, title, subtitle, createdAt, author)
         );

         return { message: "Sucessfull collection posted" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getCollectionById(
      id: string,
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         const result = await this.collectionDatabase.getCollection(
            id
         ) as any
         
         return { result } ;
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getAllCollections(
      token: string
   ) {
      try {
         const author = (this.tokenGenerator.verify(token)).id as any;
         // console.log(author)
         // console.log("token",token)
         const result = await this.collectionDatabase.getAllCollections(author) as any

         return { result };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async delCollectionById(
      id: string,
      token: string
   ) {
      try {
         this.tokenGenerator.verify(token);
         
         await this.collectionDatabase.delCollection(
            id
         ) as any
         return { message: "Collection deleted" };
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

}

export default new CollectionBusiness(new IdGenerator(), new CollectionDatabase(), new TokenGenerator())