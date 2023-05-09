let fav = JSON.parse(localStorage.getItem("fav"));
let arr = []

function selectAll(e){
    let checkbox = document.getElementsByName('locker');
    checkbox.forEach((x) => {
        x.checked = e.checked;
    })
}

function saveLocal(){
    document.getElementsByName('locker').forEach((x)=>{
        if(x.checked){
            fav.splice(fav.indexOf(x),1)
        }
    })

    localStorage.setItem("fav",JSON.stringify(fav))
};

(function (){
    let locker = document.getElementById("mylocker");
    let span = document.createElement('span')
    span.innerHTML = `${fav.length}개의 보관함이 있습니다.`;

    locker.prepend(span)
    let form = document.getElementById("lockerlist");
    let div = document.createElement('div');
    
    _list.forEach(x=>{
        for(let i = 0;i<fav.length; i++){
            if(x.id === Number(fav[i])){
                arr.push(x);
            }
        }

    })


    if(!fav.length){
        div.innerHTML = `즐겨찾기는 보관함을 추가해보세요!`
        form.appendChild(div)
    }

    else{
        let str = ""
            for(let i = 0;i<fav.length;i++){
                str += 
                    `<div>
                    <div>
                        <input type="checkbox" name="locker" id="lockerChk${i}" value="${arr[i].stationName}">
                    </div>
                    <label for="lockerChk${i}">
                        <div>
                            <li><b>보관함 이름:</b> ${arr[i].stationName}</li>
                            <li><b>보관함 주소:</b> ${arr[i].address}</li>
                            <li><b>등록자:</b> ${arr[i].userName}</li>
                        </div>    
                    </label>
                    </div>`
                
            }
            form.innerHTML = str
    }

    fav.forEach(x=>{
        let el = document.createElement('li');
    });
})();

