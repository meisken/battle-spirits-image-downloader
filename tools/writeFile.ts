import fs from "fs"



export function writeTextToFile(text: string, path: fs.PathLike, override: boolean = false){
    return new Promise<void>((resolve,reject) => {
        const ifFileExist = fs.existsSync(path);
        if(ifFileExist && !override){
            reject("File exists")
            console.log(`File exists`);
            return
        }
        fs.writeFile(path, text, function(err) {
            if(err) {
                reject(err)
            }else{
                resolve()
                console.log(`${path} was saved!`);
            }
          
        }); 
        
    })
}


