import fs from "fs"
import Axios from "axios"

export async function downloadFile(fileUrl: string, outputLocationPath: fs.PathLike, override = false) {

  
    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
  
      //ensure that the user can call `then()` only when the file has
      //been downloaded entirely.
  
        return new Promise((resolve, reject) => {

            const ifFileExist = fs.existsSync(outputLocationPath);
            if(!override && ifFileExist){
                reject("file exist")
                return
            }

            const writer = fs.createWriteStream(outputLocationPath);
            response.data.pipe(writer);

            let error: null | Error = null;

            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });

            writer.on('close', () => {
                if (!error) {
                    console.log(`${outputLocationPath} saved`)
                    resolve(true);
                }
    
            });
                
        });
    });
}

