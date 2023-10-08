
import { downloadFile } from "./tools/downloadImages";
import { fetchHtmlPage } from "./tools/fetchHtml";
import { htmlParser } from "./tools/htmlParser";
import { writeTextToFile } from "./tools/writeFile";
import fs from "fs"
//const htmlFilePath: fs.PathLike = "./assets/page.html"
const interval = 1500;
const sourcePage = "https://00cardlist.blog.fc2.com/blog-entry-634.html"
const cardPathPrefix = "https://battlespirits.com/images/cards/";
const imageFolder = "./assets/"

const main = async () => {
    const html = await fetchHtmlPage(sourcePage);

    const querySelector = htmlParser(html);

    interface Card{
        src: string,
        filename: string
    }
    const cardNames: Card[] = []
    querySelector("img").each((i, image) => {
        const imgSrc = querySelector(image).attr("src")
      
        if(imgSrc?.includes(cardPathPrefix)){
    
            const filename = imgSrc.replace(cardPathPrefix,"")
            cardNames.push({
                filename,
                src: imgSrc
            })
      
            
        }
    })

    const waitForTimeout: (timeout: number, callback: Function) => Promise<void> = (timeout,callback) => {
        return new Promise<void>((resolve,reject) => {
            setTimeout(() => {
                callback();
                resolve();
            }, timeout);
        });
    }  

    const downloadAllImages = async (index: number) => {
     
        const { src, filename } = cardNames[index]
        try{
            await downloadFile(src,imageFolder+filename)
        }catch(err){
            console.log(err)
        }finally{
            setTimeout(() => {
                let nextIndex = index + 1;
                if(nextIndex  < cardNames.length ){
                    downloadAllImages(nextIndex++)
                }
            },interval)
        }
    
   
    }
    downloadAllImages(0);

 


}

main();