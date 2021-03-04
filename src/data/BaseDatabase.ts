import dotenv from "dotenv";
import knex from "knex";
import Knex from "knex";

dotenv.config();

export default class BaseDataBase {

   protected static USER_TABLE = "FullStack_user"
   protected static IMAGE_TABLE = "FullStack_image"
   protected static TAG_TABLE = "FullStack_tag"
   protected static IMAGE_TAG_TABLE = "FullStack_image_tag"
   protected static COLLECTION_TABLE = "FullStack_collection"
   protected static IMAGE_COL_TABLE = "FullStack_image_collection"

   protected static connection: Knex = knex({
      client: "mysql",
      connection: {
         host: process.env.DB_HOST,
         port: Number(process.env.PORT || "3306"),
         user: process.env.DB_USER,
         password: process.env.DB_PASSWORD,
         database: process.env.DB_NAME,
      },
   });

   public static async destroyConnection(): Promise<void> {
      await BaseDataBase.connection.destroy();
   }
}
