import * as cheerio from "cheerio"


export function htmlParser(html: string){
    const querySelector = cheerio.load(html);
    return querySelector
}