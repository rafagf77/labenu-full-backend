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
         
         let i
         for (i=0; i<image.getTags().length; i++) {
            const id = await BaseDataBase.connection.raw(`
               SELECT id FROM FullStack_tag
               WHERE name = "${image.getTags()[i]}"
            `)
            await BaseDataBase.connection.raw(`
               INSERT INTO FullStack_image_tag (image_id, tag_id)
               VALUES (
                  '${image.getId()}', 
                  ${id[0][0].id}
            )
            `)
         }
         
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getImage(id: string): Promise<Image | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
            SELECT fsi.id as id, subtitle, author, date, file, collection, name as tag FROM ${this.tableName} fsi
            INNER JOIN FullStack_image_tag fsit ON fsi.id = fsit.image_id
            LEFT JOIN FullStack_tag fst ON fst.id = fsit.tag_id
            WHERE image_id = '${id}'
         `);
         return (result[0]);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   // SELECT * from ${this.tableName} WHERE id = '${id}'
   public async addTag(newTag: string[]): Promise<void> {
      try {
         let i
         for (i=0; i<newTag.length; i++) {
            await BaseDataBase.connection.raw(`
               INSERT INTO FullStack_tag (name)
               VALUES ("${newTag[i]}")
            `);
         }
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async delImage(id: string): Promise<void> {
      try {
         await BaseDataBase.connection.raw(`
            DELETE FROM FullStack_image_tag
            WHERE image_id = "${id}";
         `);
         await BaseDataBase.connection.raw(`
            DELETE FROM FullStack_image
            WHERE id = "${id}";
         `);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }
}

export default new ImageDatabase()