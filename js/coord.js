import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'

const __dirname = path.resolve();
dotenv.config();

export async function getCoord(x){
        const res = await axios({
            url: 'https://dapi.kakao.com/v2/local/search/keyword.json?query='+encodeURIComponent(x)+"&category_group_code=SW8&page=1",
            method: 'get',
            headers: 'Authorization : KakaoAK e639f9820bd9dfd6a0627ecb6b06f5f3'
        }).then((res)=>{
            return res.data.documents[0]
        })
        .then(station=>{
            let a = {}
            a.longitude = station.x;
            a.latitude = station.y;
            a.address = station.address_name;
            // a.line = station.category_name;
            a.stationName = station.place_name;
            return a
        })
        .catch((err)=>{
            if(err instanceof TypeError){
                let b = {}
                b.longitude = 0;
                b.latitude = 0;
                b.address = ""
                b.location = ""
                // a.line = station.category_name;
                b.stationName = ""
                return b;
            }
        })
        return res
}

