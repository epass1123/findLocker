import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'

const __dirname = path.resolve();
dotenv.config();

export async function getCoord(x){
        const res = await axios({
            url: 'https://dapi.kakao.com/v2/local/search/keyword.json?query='+encodeURIComponent(x)+"&page=1",
            method: 'get',
            headers: 'Authorization : KakaoAK e639f9820bd9dfd6a0627ecb6b06f5f3'
        }).then((res)=>{
            return res.data.documents;
        })
        .then(station=>{
            return station;
        })
        .catch((err)=>{
            if(err instanceof TypeError){
                console.log(err)
            }
        })
        return res;
}


