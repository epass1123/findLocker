function login(){
    var form = document.getElementById("login-form");
    var check = document.getElementById("remember-check")
    let user = form.id.value;

    if(localStorage.length !== 0 && user){
        if(localStorage.getItem("ID") !== user){
            localStorage.clear();
        }
    }

    if (!user) { //아이디를 입력하지 않으면.
        alert("아이디를 입력 해주세요!");
        form.id.focus();
        return;
    }
    if (!form.password.value) { //패스워드를 입력하지 않으면.
        alert("패스워드를 입력 해주세요!");
        form.password.focus();
        return;
    }

    if ( check.checked == true) { // 아이디 저장을 체크 하였을때
        localStorage.setItem("saveID",form.id.value);
    } else { // 아이디 저장을 체크 하지 않았을때
        localStorage.removeItem("saveID");
    }
}

window.onload = function() {
    var form = document.getElementById("login-form");
    var check = document.getElementById("remember-check")

    if (localStorage.getItem("saveID")) { // getCookie함수로 id라는 이름의 쿠키를 불러와서 있을경우
        form.id.value = localStorage.getItem("saveID"); //input 이름이 id인곳에 getCookie("id")값을 넣어줌
        check.checked = true; // 체크는 체크됨으로
    }

}
