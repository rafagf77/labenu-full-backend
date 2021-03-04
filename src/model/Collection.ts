export class Collection {
    constructor (
        private id: string,
        private title: string,
        private subtitle: string,
        private date: Date,
        private image: string,
        private author: string
    ){}

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    } 

    public getSubtitle(): string {
        return this.subtitle;
    }  

    public getDate(): Date {
        return this.date;
    }  

    public getImage(): string {
        return this.image;
    }  

    public getAuthor(): string {
        return this.author;
    }  
}