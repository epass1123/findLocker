let menu = document.getElementById("menu")
            let hamburger = document.getElementById("hamburger");
            let label = document.querySelector('label[for="hamburger"]')
            document.addEventListener('click',(e)=>{
                const target = e.target;
                if(target === hamburger || hamburger.contains(target)){
                    e.preventDefault();
                }
                else if(target === label || label.contains(target)){
                    hamburger.checked = !hamburger.checked
                }else if(!menu.contains(target)){
                    hamburger.checked = false;
                }
            })