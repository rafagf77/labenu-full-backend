import BaseDataBase from "./BaseDatabase";
import { Image } from "../model/Image";

export class ImageDatabase extends BaseDataBase {

   protected tableName: string = "FullStack_image";

   private toModel(dbModel?: any): Image | undefined {
      return (
         dbModel &&
         new Image(
            dbModel.id,
            dbModel.subtitle,
            dbModel.author,
            dbModel.date,
            dbModel.file,
            dbModel.tags,
            dbModel.collection
         )
      );
   }

   public async postImage(image: Image): Promise<void> {
      try {
         await BaseDataBase.connection.raw(`
            INSERT INTO ${this.tableName} (id, subtitle, author, date, file, collection)
            VALUES (
            '${image.getId()}', 
            '${image.getSubtitle()}',
            '${image.getAuthor()}', 
            '${image.getDate()}',
            '${image.getFile()}',
            '${image.getCollection()}'
            )`
         );
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }



   // public async getUserById(id: string): Promise<User | undefined> {
   //    try {
   //       const result = await BaseDataBase.connection.raw(`
   //          SELECT * from ${this.tableName} WHERE id = '${id}'
   //       `);
   //       return this.toModel(result[0][0]);
   //    } catch (error) {
   //       throw new Error(error.sqlMessage || error.message)
   //    }
   // }


}

export default new ImageDatabase()