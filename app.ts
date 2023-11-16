
import { downloadFile } from "./tools/downloadImages";
import { fetchHtmlPage } from "./tools/fetchHtml";
import { htmlParser } from "./tools/htmlParser";
import { writeTextToFile } from "./tools/writeFile";
import fs from "fs"
//const htmlFilePath: fs.PathLike = "./assets/page.html"
const interval = 1500;
const targetCardNumber = "bs65"
const theLastPage = 14;

const urlGenerator = (cardNumber: string, page?: number) =>  `https://battlespiritsnova.com/search.php?input_num=${cardNumber}&input_name=&input_rare=&input_set=&input_block=&input_type=&input_system=&input_system2=&input_color_nature=%E5%8F%AA%E9%99%90&input_sign=%3D&input_cost=&input_reduction=&input_reduction2=&input_symbol=&input_symbol2=&input_bnr=&input_effect_jp=&input_effect2_jp=&input_effect_chin=&input_effect2_chin=${page && page > 1? `&page=${page}` : ""}#anchor`
//const sourcePage = "https://00cardlist.blog.fc2.com/blog-entry-634.html"
const cardPathPrefix = "https://batspi.com/card/BS6/";
const lowQualitySuffix = "small/"
const imageFolder = "./assets/"

const main = async (page: number) => {
    return new Promise<void>(async (resolve,reject) => {
        try{
            const html = await fetchHtmlPage(urlGenerator(targetCardNumber,page));

            const querySelectorAll = htmlParser(html);
        
            interface Card{
                src: string,
                filename: string
            }
        
        
            const cardNames: Card[] = []
            querySelectorAll("img.search_card_small_pic").each((i, image) => {
                const imgSrc = querySelectorAll(image).attr("src")
            
                if(imgSrc?.includes(cardPathPrefix)){
            
                    const filename = imgSrc.replace(`${cardPathPrefix}${lowQualitySuffix}`,"")
                    cardNames.push({
                        filename,
                        src: cardPathPrefix + filename
                    })
                  
                    
                }
            })
        
        
            // const waitForTimeout: (timeout: number, callback: Function) => Promise<void> = (timeout,callback) => {
            //     return new Promise<void>((resolve,reject) => {
            //         setTimeout(() => {
            //             callback();
            //             resolve();
            //         }, timeout);
            //     });
            // }  
        
   
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
                            resolve()
                        }
                    },interval)
                }
            
           
            }
            downloadAllImages(0);

        
        }
        catch(err){
            reject(err)
        }
    })

    
 


}

const run = async () => {
    for(let i = 1; i <= theLastPage; i++){
        await main(i);
    }
}
run()