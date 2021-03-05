import BaseDataBase from "./BaseDatabase";
import { Collection } from "../model/Collection";
import BaseDatabase from "./BaseDatabase";

export class CollectionDatabase extends BaseDataBase {

   public async postCollection(collection: Collection): Promise<void> {
      try {
         await BaseDataBase.connection.raw(`
            INSERT INTO ${BaseDatabase.COLLECTION_TABLE} (id, title, subtitle, date, author)
            VALUES (
               '${collection.getId()}', 
               '${collection.getTitle()}',
               '${collection.getSubtitle()}',
               '${collection.getDate()}',
               '${collection.getAuthor()}'
            )`
         );        
         
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getCollection(id: string): Promise<any | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
            SELECT id, subtitle, date, file FROM ${BaseDatabase.IMAGE_TABLE} fsi
            LEFT JOIN ${BaseDatabase.IMAGE_COL_TABLE} fsic ON fsi.id = fsic.image_id
            WHERE fsic.collection_id = "${id}";
         `);

         const collection = await BaseDataBase.connection.raw(`
            SELECT * FROM ${BaseDatabase.COLLECTION_TABLE}
            WHERE id = "${id}";
         `);

         return ([collection[0], result[0]])

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getAllCollections(author: string): Promise<Collection | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
         SELECT * FROM ${BaseDatabase.COLLECTION_TABLE}
         WHERE author = '${author}'
         `);
         return (result[0])

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   // public async addTag(newTag: string[]): Promise<void> {
   //    try {
   //       let i
   //       for (i=0; i<newTag.length; i++) {
   //          await BaseDataBase.connection.raw(`
   //             INSERT INTO ${BaseDatabase.TAG_TABLE} (name)
   //             VALUES ("${newTag[i]}")
   //          `);
   //       }
   //    } catch (error) {
   //       throw new Error(error.sqlMessage || error.message)
   //    }
   // }

   // public async delImage(id: string): Promise<void> {
   //    try {
   //       await BaseDataBase.connection.raw(`
   //          DELETE FROM ${BaseDatabase.IMAGE_TAG_TABLE}
   //          WHERE image_id = "${id}";
   //       `);
   //       await BaseDataBase.connection.raw(`
   //          DELETE FROM ${BaseDatabase.IMAGE_TABLE}
   //          WHERE id = "${id}";
   //       `);
   //    } catch (error) {
   //       throw new Error(error.sqlMessage || error.message)
   //    }
   // }
}

export default new CollectionDatabase()