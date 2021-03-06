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
            dbModel.collections
         )
      );
   }

   public async postImage(image: Image): Promise<void> {
      try {
         await BaseDataBase.connection.raw(`
            INSERT INTO ${BaseDatabase.IMAGE_TABLE} (id, subtitle, author, date, file)
            VALUES (
               '${image.getId()}', 
               '${image.getSubtitle()}',
               '${image.getAuthor()}', 
               '${image.getDate()}',
               '${image.getFile()}'
            )`
         );
         
         for (let i=0; i<image.getTags().length; i++) {
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

            const tagId = await BaseDataBase.connection.raw(`
               SELECT id FROM ${BaseDatabase.TAG_TABLE}
               WHERE name = "${image.getTags()[i]}"
            `)

            await BaseDataBase.connection.raw(`
               INSERT INTO ${BaseDatabase.IMAGE_TAG_TABLE} (image_id, tag_id)
               VALUES (
                  '${image.getId()}', 
                  ${tagId[0][0].id}
               )
            `)
         }

         for (let j=0; j<image.getCollections().length; j++) {
            await BaseDataBase.connection.raw(`
               INSERT INTO ${BaseDatabase.IMAGE_COL_TABLE} (image_id, collection_id)
               VALUES ('${image.getId()}', '${image.getCollections()[j]}')
            `);
         }
         
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getImage(id: string): Promise<any | undefined> {
      try {
         const imageData = await BaseDataBase.connection.raw(`
            SELECT fsi.id as id, subtitle, author, date, file, nickname from ${BaseDatabase.IMAGE_TABLE} fsi
            LEFT JOIN ${BaseDatabase.USER_TABLE} fsu ON fsu.id = fsi.author
            WHERE fsi.id = '${id}'
         `);

         const tags = await BaseDataBase.connection.raw(`
            SELECT id, name FROM ${BaseDatabase.IMAGE_TAG_TABLE} fit
            LEFT JOIN ${BaseDatabase.TAG_TABLE} ft ON fit.tag_id = ft.id
            WHERE image_id = '${id}'
         `);

         const collections = await BaseDataBase.connection.raw(`
            SELECT id, title FROM ${BaseDatabase.IMAGE_COL_TABLE} fic
            LEFT JOIN ${BaseDatabase.COLLECTION_TABLE} fc ON fic.collection_id = fc.id
            WHERE image_id = '${id}'
         `);

         return ([imageData[0], tags[0], collections[0]]);

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getAllImages(): Promise<Image[] | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
         SELECT fsi.id as id, fsi.subtitle as subtitle, fsi.author as author, fsi.date as date, file, nickname, fst.name as tag, fsit.tag_id as tag_id, fsic.collection_id as collection_id, fsc.title as title FROM ${BaseDatabase.IMAGE_TABLE} fsi
	         LEFT JOIN ${BaseDatabase.USER_TABLE} fsu ON fsu.id = fsi.author
            LEFT JOIN ${BaseDatabase.IMAGE_TAG_TABLE} fsit ON fsi.id = fsit.image_id
            LEFT JOIN ${BaseDatabase.TAG_TABLE} fst ON fst.id = fsit.tag_id
            LEFT JOIN ${BaseDatabase.IMAGE_COL_TABLE} fsic ON fsi.id = fsic.image_id
            LEFT JOIN ${BaseDatabase.COLLECTION_TABLE} fsc ON fsc.id = fsic.collection_id
         `);

         return (result[0])

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getImagesByTagId(id: string): Promise<Image[] | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
         SELECT fsi.id as id, fsi.subtitle as subtitle, fsi.author as author, fsi.date as date, file, nickname, fst.name as tag, fsit.tag_id as tag_id, fsic.collection_id as collection_id, fsc.title as title FROM ${BaseDatabase.IMAGE_TABLE} fsi
	         LEFT JOIN ${BaseDatabase.USER_TABLE} fsu ON fsu.id = fsi.author
            LEFT JOIN ${BaseDatabase.IMAGE_TAG_TABLE} fsit ON fsi.id = fsit.image_id
            LEFT JOIN ${BaseDatabase.TAG_TABLE} fst ON fst.id = fsit.tag_id
            LEFT JOIN ${BaseDatabase.IMAGE_COL_TABLE} fsic ON fsi.id = fsic.image_id
            LEFT JOIN ${BaseDatabase.COLLECTION_TABLE} fsc ON fsc.id = fsic.collection_id
            WHERE fsit.tag_id = ${id} 
         `);

         return (result[0])

      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async delImage(id: string): Promise<void> {
      try {
         await BaseDataBase.connection.raw(`
            DELETE FROM ${BaseDatabase.IMAGE_TAG_TABLE}
            WHERE image_id = "${id}"
         `);
         await BaseDataBase.connection.raw(`
            DELETE FROM ${BaseDatabase.IMAGE_COL_TABLE}
            WHERE image_id = "${id}"
      `);
         await BaseDataBase.connection.raw(`
            DELETE FROM ${BaseDatabase.IMAGE_TABLE}
            WHERE id = "${id}"
         `);
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async addToCollection(image_id: string, collection: string[]): Promise<void> {
      try {
         let i
         for (i=0; i<collection.length; i++) {
            await BaseDataBase.connection.raw(`
               INSERT INTO ${BaseDatabase.IMAGE_COL_TABLE}
               VALUES ("${image_id}", "${collection[i]}")
            `);
         }
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async removeFromCollection(image_id: string, collection: string[]): Promise<void> {
      try {
         let i
         for (i=0; i<collection.length; i++) {
            await BaseDataBase.connection.raw(`
               DELETE FROM ${BaseDatabase.IMAGE_COL_TABLE}
               WHERE image_id= "${image_id}"
               AND collection_id= "${collection[i]}"
            `);
         }
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }
}

export default new ImageDatabase()