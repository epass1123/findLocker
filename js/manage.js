let userId;

//----------공용-----------------

function selectAll(e){
    let checkbox = document.getElementsByName('user');
    checkbox.forEach((x) => {
        x.checked = e.checked;
    })
}

function closePop(){
    let popup = document.getElementById("popup");
    let ul = document.getElementById("info");
    
    ul.innerHTML = ""
    popup.style.display = "none";
}

//-----------------------------------
//--------------index-----------------

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


function filter() {
    let search = document.getElementById("search-input").value.toLowerCase();
    let userItem = document.getElementsByClassName("userItem");
    let select = document.getElementsByName("authority");
    let value = select[0].options[select[0].selectedIndex].text;
    for (let i = 0; i < userItem.length; i++) {
        userID = userItem.item(i).childNodes[3].childNodes;
        userName = userItem.item(i).childNodes[5].childNodes;
        auth = userItem.item(i).childNodes[9].childNodes;
        if(value){
            if(value === "=== 선택 ==="){
                if (userID[0].innerHTML.toLowerCase().includes(search) ||
                userName[0].innerHTML.toLowerCase().includes(search))
                {
                    userItem.item(i).style.display = "table-row"
                } else {
                    userItem.item(i).style.display = "none"
                }
            }
            else if(value === auth[0].innerHTML.toLowerCase()){
                if (userID[0].innerHTML.toLowerCase().includes(search) ||
                userName[0].innerHTML.toLowerCase().includes(search))
                {
                    userItem.item(i).style.display = "table-row"
                } else {
                    userItem.item(i).style.display = "none"
                }
            }
            else{
                userItem.item(i).style.display = "none"
            }
            
        }
        
    }
}


function showLocker(){
    let info = document.getElementById("info");
    let fragment = document.createDocumentFragment();
    let cnt = 0
    info.innerHTML = ""

    lockerlist.forEach(x=>{
        if(userId===x.userName){
            cnt++
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
    });
    
    info.appendChild(fragment);
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

function selectAuth(){
    let select = document.getElementsByName("authority");
    let value = select[0].options[select[0].selectedIndex].text;
    let userItem = document.getElementsByClassName("userItem");
    for (let i = 0; i < userItem.length; i++) {
        auth = userItem.item(i).childNodes[9].childNodes;
        if(value === "=== 선택 ==="){
            userItem.item(i).style.display = "table-row"
        }
        else if(value === auth[0].innerHTML.toLowerCase()){
            userItem.item(i).style.display = "table-row"
            
        }
        else{
            userItem.item(i).style.display = "none"
        }
    }
    
}

//-------------locker-------------------

function lockerInfo(e){                
    let popup = document.getElementById("popup");
    let info = document.getElementById("info");
    let fragment = document.createDocumentFragment();
    info.innerHTML = ""
    let stationName = e.getAttribute('data-value');

    lockerlist.forEach(x=>{
        if(x.id==stationName){
            let li = document.createElement("li");
            let itemStr = `
            <span><b>이름: </b> ${x.stationName}</span>
            <span><b>작성자: </b> ${x.userName}</span>
            <span><b>주소: </b> ${x.address}</span>
            <span><b>위치: </b>${x.location}</span>
            <span><b>좌표: </b> 위도 : ${x.latitude.toFixed(5)}, 경도 : ${x.longitude.toFixed(5)}</span>
            <span><b>개수: </b> ${x.numberOf}개</span>
            <span><b>가격: </b> ${x.price}</span>`;
            li.className = "item";
            li.innerHTML = itemStr;
            fragment.appendChild(li);
        }
    })
    info.appendChild(fragment)

    popup.style.display = "block"
    
}
