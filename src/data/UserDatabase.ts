import BaseDataBase from "./BaseDatabase";
import { User } from "../model/User";
import BaseDatabase from "./BaseDatabase";

export class UserDatabase extends BaseDataBase {

   private toModel(dbModel?: any): User | undefined {
      return (
         dbModel &&
         new User(
            dbModel.id,
            dbModel.name,
            dbModel.email,
            dbModel.nickname,
            dbModel.password
         )
      );
   }

   public async createUser(user: User): Promise<void> {
      try {
         await BaseDataBase.connection.raw(`
            INSERT INTO ${BaseDatabase.USER_TABLE} (id, name, email, nickname, password)
            VALUES (
            '${user.getId()}', 
            '${user.getName()}', 
            '${user.getEmail()}',
            '${user.getNickname()}',
            '${user.getPassword()}'
            )`
         );
      } catch (error) {
         throw new Error(error.sqlMessage || error.message)
      }
   }

   public async getUserByEmail(email: string): Promise<User | undefined> {
      try {
         const result = await BaseDataBase.connection.raw(`
            SELECT * from ${BaseDatabase.USER_TABLE} WHERE email = '${email}'
         `);
         return this.toModel(result[0][0]);
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

   // public async getAllUsers(): Promise<User[]> {
   //    try {
   //       const result = await BaseDataBase.connection.raw(`
   //          SELECT * from ${this.tableName}
   //       `);
   //       return result[0].map((res: any) => {
   //          return this.toModel(res);
   //       });
   //    } catch (error) {
   //       throw new Error(error.sqlMessage || error.message)
   //    }
   // }
}

export default new UserDatabase()