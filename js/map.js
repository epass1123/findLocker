var infowindow = new kakao.maps.InfoWindow({zIndex:1});
var markers = [] //마커들을 일괄 관리
var container = document.getElementById('map');
var geocoder = new kakao.maps.services.Geocoder();
var options = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3
};
var selectedMarker = null;
var selectedInfowindow = null;
var selectedItem = null;
var map = new kakao.maps.Map(container, options),
    ps = new kakao.maps.services.Places();

var MARKER_WIDTH = 25, // 기본, 클릭 마커의 너비
MARKER_HEIGHT = 30, // 기본, 클릭 마커의 높이
OVER_MARKER_WIDTH = 31, // 오버 마커의 너비
OVER_MARKER_HEIGHT = 35; // 오버 마커의 높이

    // 마커 이미지의 이미지 크기 입니다
var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
    overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT)
      
//ejs로 부터 받아온 변수
var lockerList = _list;
let _user = user
let fav = _fav

if(_user){
    if(localStorage.getItem("fav") !== null){
        console.log("로컬스토리지 존재함: ", localStorage.getItem("fav"));
        fav = JSON.parse(localStorage.getItem("fav"));
        console.log("fav: ", fav);
        localStorage.setItem("fav", JSON.stringify(fav));
    }
    else{
        console.log("초기 fav:",fav)
        localStorage.setItem("fav", JSON.stringify(fav));
        localStorage.setItem("ID", JSON.stringify(_user.id))
    }
}

var search = document.getElementById('btn1')
search.onclick = searchPlaces;

function searchPlaces() {
    var keyword = document.getElementById('search-input').value;
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch( keyword, placesSearchCB ); 
}

function placesSearchCB(data, status) {
    bounds = new kakao.maps.LatLngBounds();
    if (status === kakao.maps.services.Status.OK) {
        var message = `<div style="padding:5px;">${data[0].place_name}</div>`;
        var placePosition = new kakao.maps.LatLng(data[0].y,data[0].x)
        removeMarker();
        displayMarker(placePosition, message);
        displayLocker();
        bounds.extend(placePosition);
        map.setBounds(bounds);
        // 정상적으로 검색이 완료됐으면
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

function currentLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude,
                lon = position.coords.longitude;

            var currentPos = new kakao.maps.LatLng(lat,lon);
            var message = '<div style="padding:5px;">현위치</div>';
            removeMarker();
            displayMarker(currentPos, message);
            displayLocker();
		});
	} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

		var locPosition = new kakao.maps.LatLng(37.4812845080678, 126.952713197762),
			message = '현재 위치를 알 수 없어 기본 위치로 이동합니다.'

		currentLatLon['lat'] = 33.450701
		currentLatLon['lon'] = 126.570667

        removeMarker();
		displayMarker(locPosition, message);
        displayLocker();
	}
	
}

let currentLoc = document.getElementById('currentPos')
currentLoc.onclick = currentLocation;

function displayMarker(locPosition, message) {
	var imageSize = new kakao.maps.Size(24, 35);
    var imageSrc = '../img/focus.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37)
	var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		map: map, 
		position: locPosition, 
		image : markerImage, 
	});

    kakao.maps.event.addListener(marker, 'mouseover', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(message);
        infowindow.open(map, marker);
    });
    kakao.maps.event.addListener(marker, 'mouseout', function(){
        infowindow.close();
    })

    map.setLevel(3);
    removeMarker();
    marker.setMap(map);
    markers.push(marker) 
	// 지도 중심좌표를 접속위치로 변경합니다
	map.setCenter(locPosition);
}

function displayLocker(){
    var normalImageSrc = '../img/locker.png',
        overImageSrc = '../img/lockerOver.png',
        clickImageSrc = '../img/lockerClicked.png'
    
    var normalImage = createMarkerImage(markerSize, normalImageSrc),
        overImage = createMarkerImage(overMarkerSize, overImageSrc),
        clickImage = createMarkerImage(markerSize, clickImageSrc);

    for (var i = 0; i < lockerList.length; i ++) {

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: new kakao.maps.LatLng(lockerList[i].latitude,lockerList[i].longitude), // 마커를 표시할 위치
            image : normalImage // 마커 이미지 
        });
    
        showList();
        
        marker.normalImage = normalImage;

        var infowindow = new kakao.maps.InfoWindow({
            content : '<div style="padding:5px">' + lockerList[i].stationName.split(" ")[0] + '</div>'
        });
    
        markers.push(marker)

        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map,marker,infowindow,overImage));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(marker,infowindow, normalImage))
        kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow ,clickImage))
    }
}

function createMarkerImage(markerSize,imgSrc) {
    // 락커 이미지 주소입니다
    var imageSrc = imgSrc; 
    // var spriteImageSize = new kakao.maps.Size(126, 146);
    var markerImage = new kakao.maps.MarkerImage(
        imageSrc, // 스프라이트 마커 이미지 URL
        markerSize
    );
    
    return markerImage;
}

//클로저를 생성해야 모든 마커에 대해 생성됨 아니면 마지막거에만 생성됨
function makeOverListener(map, marker, infowindow, overImage){
    return function(){
        infowindow.open(map,marker);
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(overImage);
        }
    }
}

function makeOutListener(marker, infowindow, normalImage) { 
    return function() {
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalImage);
            infowindow.close();
        }
    };
}

function makeClickListener(map, marker, infowindow, clickImage){
    return function(){
         // 클릭됐던 마커가 없고, click 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 클릭 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            // 클릭됐던 마커 객체가 null이 아니면
            // 클릭됐던 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);
            !!selectedInfowindow && selectedInfowindow.close();
            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(clickImage);
            infowindow.open(map,marker);
        }

        // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
        selectedInfowindow = infowindow;
        selectedMarker = marker;
    };
}

if(!_user){
    localStorage.clear();
}

function showList(){
    var list = lockerList
    var center = map.getCenter();
    var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementsByClassName('controller'),
    fragment = document.createDocumentFragment();
    clickImage = createMarkerImage(markerSize,'../img/lockerClicked.png');
    removeAllChildNods(listEl);
    for(let i = 0;i<list.length;i++){
        list[i].latlng = new kakao.maps.LatLng(list[i].latitude,list[i].longitude)
        var poly = new kakao.maps.Polyline({
            path:[center,list[i].latlng]
        });

        var dist = poly.getLength();

        list[i].title =list[i].stationName.split(" ")[0];
        list[i].distance = dist;        
    }

    list = list.sort((a,b)=>{
        return a.distance - b.distance
    })

    list.forEach(x=>{
        var marker = null;
        var el = document.createElement('li');
        var button = document.createElement('button');
        var input = document.createElement('input');
        var inputValue = document.createElement('input');
        var form = document.createElement('form');

        button.innerText = "길찾기";
        button.className = "findWay";

        input.className = "favorite";
        input.type = "checkbox";
        input.name = "checkbox";

        form.method = "post";

        inputValue.type = "inpValue";
        inputValue.name = "inpValue";
        inputValue.value = x.id;
        inputValue.readOnly = true;
        inputValue.style.display = "none"

        button.onclick = function(){
            geocoder.coord2Address(center.getLng(),center.getLat(),function(res,status){
                if(status === kakao.maps.services.Status.OK){
                    var center = res[0]["address"]["address_name"]
                    window.open(`https://map.kakao.com/?sName=${center}&eName=${x.title}`)
                }
            })
        }

        input.onchange = function(e){
            if(fav){
                console.log(input.checked)
                if(input.checked && !fav.includes(inputValue.value)){
                    fav.push(inputValue.value)
                }
                else if(!input.checked && fav.includes(inputValue.value)){
                    console.log("fav:",fav)
                    fav.splice(fav.indexOf(inputValue.value),1);
                }
            }

            localStorage.setItem("fav", JSON.stringify(fav));
            form.submit();
        }

        if(x.title){
            var itemStr = `<div class="info"><span class="title">${x.title} ${x.line}</span>`;
            if(x.location){
                itemStr += `<span>${x.location}</span>`
            }
            itemStr += `<span>${x.price}</span></div>`
        }else{
            itemStr = null;
        }

        (function(){
            el.onmouseover = function(){
                if(!selectedItem || selectedItem !== el){
                    el.style.backgroundColor = 'gainsboro'
                }
                el.appendChild(button)
                if(_user){
                let storage = localStorage.getItem("fav")
                    if(storage){
                        console.log(storage)
                        console.log(inputValue.value)
                       if(storage.includes(inputValue.value)){
                            input.checked = true;
                       }
                       else{
                        input.checked = false;
                       }
                    }
                    form.appendChild(input)
                    form.appendChild(inputValue)
                    el.appendChild(form);
                }
            };
            //onmouseout을 사용하면 자식요소에서도 작동해서 버튼에 마우스 올리면 버튼이 사라짐.
            el.onmouseleave = function(){
                if(!selectedItem || selectedItem !== el){
                    el.style.backgroundColor = 'white'
                }
                if(button){
                    button.remove();
                }
                if(form){
                    form.remove();
                }
            }
            el.onclick = function(){
                if(!selectedItem || selectedItem !== el){
                    
                    if(!!selectedItem){
                        selectedItem.style.backgroundColor = "white"
                    }

                    el.style.backgroundColor = "darkgray"
                }
                selectedItem = el;
                markers.forEach(p=>{
                    if(p.getPosition().getLat().toFixed(5) === x.latlng.getLat().toFixed(5) && p.getPosition().getLng().toFixed(5) === x.latlng.getLng().toFixed(5)){
                        marker = p;
                    };
                });
                if (!selectedMarker || selectedMarker !== marker) {
                    // 클릭된 마커 객체가 null이 아니면
                    // 클릭된 마커의 이미지를 기본 이미지로 변경하고
                    if(!!selectedMarker) selectedMarker.setImage(selectedMarker.normalImage);
                    !!selectedInfowindow && selectedInfowindow.close();
                    // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
                    
                    infowindow.setContent(x.title)
                    infowindow.open(map,marker);
                    marker.setImage(clickImage);
                }
                selectedInfowindow = infowindow;
                selectedMarker = marker;  
                map.setCenter(x.latlng);
            }
        })()
        el.className = 'item';
        el.innerHTML = itemStr;
        fragment.appendChild(el)
    })

    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
}

function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

