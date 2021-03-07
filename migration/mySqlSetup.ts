import  BaseDatabase from "../src/data/BaseDatabase"

export class MySqlSetup extends BaseDatabase{
    public async createTable(): Promise<void> {
    try {
        await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.USER_TABLE} (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                nickname VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `)

        await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.IMAGE_TABLE} (
                id VARCHAR(255) PRIMARY KEY,
                subtitle VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                file VARCHAR(255) NOT NULL,
                collection VARCHAR(255),
                FOREIGN KEY (author) REFERENCES ${BaseDatabase.USER_TABLE}(id)
            )
        `)

        await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.TAG_TABLE} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            )
        `)

        await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS ${BaseDatabase.IMAGE_TAG_TABLE} (
                image_id VARCHAR(255) NOT NULL,
                tag_id INT NOT NULL,
                FOREIGN KEY (image_id) REFERENCES ${BaseDatabase.IMAGE_TABLE}(id),
                FOREIGN KEY (tag_id) REFERENCES ${BaseDatabase.TAG_TABLE}(id)
            )
        `)

        await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS FullStack_collection (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL UNIQUE,
                subtitle VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                FOREIGN KEY (author) REFERENCES FullStack_user(id)
            )
        `)

        await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS FullStack_image_collection (
                image_id VARCHAR(255) NOT NULL,
                collection_id VARCHAR(255) NOT NULL,
                FOREIGN KEY (image_id) REFERENCES FullStack_image(id),
                FOREIGN KEY (collection_id) REFERENCES FullStack_collection(id)
            )
        `)

        console.log("MySql setup completed!")
        BaseDatabase.destroyConnection()

        } catch (error) {
            console.log(error)
        } 
    }
}

new MySqlSetup().createTable()