            let userId;

            function closePop(){
                let popup = document.getElementById("popup");
                let ul = document.getElementById("info");
                
                ul.innerHTML = ""
                popup.style.display = "none";
            }

            function showLocker(){
                let info = document.getElementById("info");
                let fragment = document.createDocumentFragment();
                info.innerHTML = ""
                lockerlist.forEach(x=>{
                    if(userId===x.userName){
                        let li = document.createElement("li");
                        let itemStr = `
                        <span><b>보관함명: </b> ${x.stationName}</span>
                        <span><b>등록자: </b> ${x.userName}</span>
                        <span><b>주소: </b> ${x.address}</span>
                        <span><b>위치: </b> ${x.location}</span>
                        <span><b>경도: </b>${x.latitude.toFixed(5)}, <b>위도: </b>${x.longitude.toFixed(5)}</span>`;
                        li.className = "item";
                        li.innerHTML = itemStr;
                        fragment.appendChild(li);
                    }
                })
                info.appendChild(fragment)
            }

            function showUser(){
                let info = document.getElementById("info");
                let fragment = document.createDocumentFragment();
                info.innerHTML = ""
                userlist.forEach(x=>{
                    if(x.id===userId){
                        let li = document.createElement("li");
                        let itemStr = `
                        <span><b>아이디: </b> ${userId}</span>
                        <span><b>이름: </b> ${x.name}</span>
                        <span><b>이메일: </b> ${x.email}</span>
                        <span><b>권한: </b> ${x.authority}</span>
                        <span><b>즐겨찾기: </b>${x.favorites.join(',')}</span>`;
                        li.className = "item";
                        li.innerHTML = itemStr;
                        fragment.appendChild(li);
                    }
                })
                info.appendChild(fragment)
            }

            function userClick(e){                
                let popup = document.getElementById("popup");
                let info = document.getElementById("info");
                let fragment = document.createDocumentFragment();
                info.innerHTML = ""
                userId = e.text;

                userlist.forEach(x=>{
                    if(x.id===userId){
                        let li = document.createElement("li");
                        let itemStr = `
                        <span><b>아이디: </b> ${userId}</span>
                        <span><b>이름: </b> ${x.name}</span>
                        <span><b>이메일: </b> ${x.email}</span>
                        <span><b>권한: </b> ${x.authority}</span>
                        <span><b>즐겨찾기: </b>${x.favorites.join(',')}</span>`;
                        li.className = "item";
                        li.innerHTML = itemStr;
                        fragment.appendChild(li);
                    }
                })
                info.appendChild(fragment)

                popup.style.display = "block"
                
            }