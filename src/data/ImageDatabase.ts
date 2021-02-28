import BaseDataBase from "./BaseDatabase";
import { Image } from "../model/Image";
import BaseDatabase from "./BaseDatabase";

export class ImageDatabase extends BaseDataBase {

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
            INSERT INTO ${BaseDatabase.IMAGE_TABLE} (id, subtitle, author, date, file, collection)
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
               SELECT id FROM ${BaseDatabase.TAG_TABLE}
               WHERE name = "${image.getTags()[i]}"
            `)

            if (id[0].length===0) {
               await BaseDataBase.connection.raw(`
                  INSERT INTO ${BaseDatabase.TAG_TABLE} (name)
                  VALUES ("${image.getTags()[i]}")
               `);
            }

            await BaseDataBase.connection.raw(`
               INSERT INTO ${BaseDatabase.RELATION_TABLE} (image_id, tag_id)
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
            SELECT fsi.id as id, subtitle, author, date, file, collection, nickname, fst.name as tag FROM ${BaseDatabase.IMAGE_TABLE} fsi
            INNER JOIN ${BaseDatabase.RELATION_TABLE} fsit ON fsi.id = fsit.image_id
            LEFT JOIN ${BaseDatabase.TAG_TABLE} fst ON fst.id = fsit.tag_id
            LEFT JOIN ${BaseDatabase.USER_TABLE} fsu ON fsu.id = fsi.author
            WHERE image_id = '${id}'
         `);
         if (result[0].length!=0) {
            return (result[0])
         } else {
            const newResult = await BaseDataBase.connection.raw(`
               SELECT * from ${BaseDatabase.IMAGE_TABLE} WHERE id = '${id}'
            `);
            return (newResult[0]);
         }

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getAllImages(): Promise<Image[] | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
         SELECT fsi.id as id, subtitle, author, date, file, collection, nickname, fst.name as tag FROM ${BaseDatabase.IMAGE_TABLE} fsi
	         LEFT JOIN ${BaseDatabase.USER_TABLE} fsu ON fsu.id = fsi.author
            LEFT JOIN ${BaseDatabase.RELATION_TABLE} fsit ON fsi.id = fsit.image_id
            LEFT JOIN ${BaseDatabase.TAG_TABLE} fst ON fst.id = fsit.tag_id;
         `);
         return (result[0])

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async addTag(newTag: string[]): Promise<void> {
      try {
         let i
         for (i=0; i<newTag.length; i++) {
            await BaseDataBase.connection.raw(`
               INSERT INTO ${BaseDatabase.TAG_TABLE} (name)
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
            DELETE FROM ${BaseDatabase.RELATION_TABLE}
            WHERE image_id = "${id}";
         `);
         await BaseDataBase.connection.raw(`
            DELETE FROM ${BaseDatabase.IMAGE_TABLE}
            WHERE id = "${id}";
         `);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }
}

export default new ImageDatabase()