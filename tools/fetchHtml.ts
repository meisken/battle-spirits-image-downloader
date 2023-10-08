import axios from "axios"

export async function fetchHtmlPage(url: string){
	return new Promise<string>(async (resolve,reject) => {
		try{
			const response = await axios.get(url);
			resolve(response.data)
		}catch(err){
			reject(err)
		}
	})
}

