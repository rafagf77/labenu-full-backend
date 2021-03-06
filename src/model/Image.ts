export class Image {
    constructor (
        private id: string,
        private subtitle: string,
        private author: string,
        private date: Date,
        private file: string,
        private tags: string[],
        private collections: string[]
    ){}

    public getId(): string {
        return this.id;
    }

    public getSubtitle(): string {
        return this.subtitle;
    }  

    public getAuthor(): string {
        return this.author;
    }  

    public getDate(): Date {
        return this.date;
    }  

    public getFile(): string {
        return this.file;
    } 

    public getTags(): string[] {
        return this.tags;
    } 

    public getCollections(): string[] {
        return this.collections;
    }
}