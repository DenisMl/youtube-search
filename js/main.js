// const TicTacToe = require('./src/tic-tac-toe.js');
let storage = {};
document.getElementById("search-form").onsubmit = function(e) {
    search(e)
};

window.addEventListener('resize', function(event){
    setResultBoxWidth();
    if (storage.data && getComponentsQuantity() !== storage.componentsPP) {
        storage.componentsPP = getComponentsQuantity();
        showSearchResults(storage.data);
    }
});

let resultsBox = document.getElementById("searchResults");
  resultsBox.addEventListener("touchstart", touchstart);
  resultsBox.addEventListener("mousedown", mousedown);

  resultsBox.addEventListener("touchend", touchend);
  resultsBox.addEventListener("mouseup", mouseup);

  resultsBox.addEventListener("touchcancel", touchcancel);

  resultsBox.addEventListener("touchmove", touchmove);
  resultsBox.addEventListener("mousemove", mousemove);

function touchstart(event) {    //TOUCH EVENTS TODO: calls mouse events
    console.log('T start');
    console.log(event);
    let touch = event.changedTouches[0];
    resultsBox.style.transitionProperty = "none";

    storage.startX = touch.clientX;
    storage.startTime = event.timeStamp;
    storage.resultsBoxStartX = resultsBox.offsetLeft;
    storage.swipeStarted = true;
}

function touchend(event) {
    console.log('T end');
    let touch = event.changedTouches[0];

    storage.endX = touch.clientX;
    storage.endTime = event.timeStamp;
    storage.swipeStarted = false;
    let dx = storage.startX - storage.endX;
    let dt = storage.endTime - storage.startTime;
    if (Math.abs(dx) > 50 && dt < 1000 && resultsBox.offsetLeft > -1 * (resultsBox.offsetWidth - window.innerWidth - 50)) {
        swipe(dx, dt);
    } else {
        toInitialState(dx, dt);
    }
}

function touchcancel(event) {
    console.log('T cancel');

}

function touchmove(event) {
    console.log('T move');
    let touch = event.changedTouches[0];
    if (storage.swipeStarted === true) {
        let dx = storage.resultsBoxStartX + touch.clientX - storage.startX;
        if (dx < 0 && dx > -1 * (resultsBox.offsetWidth - window.innerWidth - 50)) {
            resultsBox.style.left = dx + "px";

        }
    }
}


function mousedown(event) {    //MOUSE EVENTS
    console.log('M down');
    resultsBox.style.transitionProperty = "none";

    storage.startX = event.clientX;
    storage.startTime = event.timeStamp;
    storage.resultsBoxStartX = resultsBox.offsetLeft;
    storage.swipeStarted = true;
    // console.log(`startX: ${storage.startX}, resStart: ${storage.resultsBoxStartX}`);
}

function mouseup(event) {
    console.log('M up');
    storage.endX = event.clientX;
    storage.endTime = event.timeStamp;
    storage.swipeStarted = false;
    let dx = storage.startX - storage.endX;
    let dt = storage.endTime - storage.startTime;
    if (Math.abs(dx) > 50 && dt < 1000 && resultsBox.offsetLeft > -1 * (resultsBox.offsetWidth - window.innerWidth - 50)) {
        swipe(dx, dt);
    } else {
        toInitialState(dx, dt);
    }
}

function mousemove(event) {
    // console.log('M move');
    if (storage.swipeStarted === true) {
        let dx = storage.resultsBoxStartX + event.clientX - storage.startX;
        if (dx < 0 && dx > -1 * (resultsBox.offsetWidth - window.innerWidth - 50)) {
            resultsBox.style.left = dx + "px";

        }
    }

}

function swipe(dx, dt) {
    console.log('swipe');
    let vw = window.innerWidth;
    let time, newX, distance;
    let direction = (dx > 0)? -1: 1; //>0: left(forward); <0: right(backward)
    if (dx > 0) {   //left(forward)
        distance = vw + resultsBox.offsetLeft % vw;
    } else {    //right(backward)
        distance = resultsBox.offsetLeft % vw;
    }
    time = dt / dx * distance;
    if (time > 400) {
        time = 400;
    }
    newX = resultsBox.offsetLeft - (distance) + "px";
    resultsBox.style.transitionProperty = "left";
    resultsBox.style.transitionDuration = time + 'ms';
    resultsBox.style.left = newX;
}

function toInitialState(dx, dt) {
    console.log('toInitialState');
    let vw = window.innerWidth;
    let time, newX, distance;
    let direction = (dx > 0)? -1: 1; //>0: left(forward); <0: right(backward)
    if (dx < 0) {
        distance = vw + resultsBox.offsetLeft % vw;
    } else {
        distance = resultsBox.offsetLeft % vw;
    }
    time = dt / dx * distance;
    if (time > 200) {
        time = 200;
    }
    newX = resultsBox.offsetLeft - (distance) + "px";
    resultsBox.style.transitionProperty = "left";
    resultsBox.style.transitionDuration = time + 'ms';
    resultsBox.style.left = newX;
}

function search(event) {
    event.preventDefault();
    let keyWord = event.target.elements.q.value;
    let xhr = new XMLHttpRequest();
    let url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyAPnt_YTlH0wGQtBIlRNU7jPih57hfi7WA&type=video&part=snippet&maxResults=15&q=' + keyWord;
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
            return;

        if (xhr.status != 200) {
            // обработать ошибку
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                var response = JSON.parse(xhr.responseText);
            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            getVideoInfo(response);
        }
    }
    xhr.send();
}

function getVideoInfo(res) {
    let videoId = '';
    for (var i = 0; i < res.items.length; i++) {
        videoId += res.items[i].id.videoId + ',';
    }
    let xhr = new XMLHttpRequest();
    let url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAPnt_YTlH0wGQtBIlRNU7jPih57hfi7WA&id=' + videoId + '&part=snippet,statistics';
    let response;
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
            return;

        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                response = JSON.parse(xhr.responseText);

            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            data = processResponse(response);

            storage.componentsPP = getComponentsQuantity();
            showSearchResults(data);
        }
    }
    xhr.send();
}

function processResponse(response) {
    let data = [];
    let titleText,
        views,
        date,
        description,
        likesPercentage,
        likes,
        overall;

    for (var i = 0; i < response.items.length; i++) {
        titleText = response.items[i].snippet.title.replace(/\"/g, "&quot");
        description = response.items[i].snippet.description.replace(/\"/g, "&quot");
        views = response.items[i].statistics.viewCount;
        views = views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); //number spacing
        date = response.items[i].snippet.publishedAt;
        date = moment(date).format("Do MMM YYYY");
        likes = +response.items[i].statistics.likeCount;
        overall = +response.items[i].statistics.likeCount + (+ response.items[i].statistics.dislikeCount);
        if (!overall > 0)
            overall = 0;
        likesPercentage = 100 * likes / overall;
        if (!likesPercentage > 0)
            likesPercentage = 0;
        overall = overall.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); //number spacing
        likesPercentage = Math.ceil(likesPercentage) + `% of ${overall}`;

        data[i] = {
            imgSRC: response.items[i].snippet.thumbnails.medium.url,
            titleHREF: 'https://www.youtube.com/watch?v=' + response.items[i].id,
            titleText,
            authorHREF: 'https://www.youtube.com/channel/' + response.items[i].snippet.channelId,
            author: response.items[i].snippet.channelTitle,
            views,
            date,
            description,
            likesPercentage
        };
    }
    storage.data = data;
    return data;
}

function showSearchResults(data) {
    let resultsBox = document.getElementById('searchResults');
    let component = '';
    let componentsPP = storage.componentsPP;
    while (resultsBox.firstChild) {
        resultsBox.removeChild(resultsBox.firstChild);
    }
    let tmplComponent = _.template(document.getElementById('component-template').innerHTML);
    let tmplPS = _.template(document.getElementById('components-page-start-template').innerHTML);
    let tmplPE = _.template(document.getElementById('components-page-end-template').innerHTML);
    component += tmplPS({pageNumber: 1});
    for (var i = 0; i < data.length; i++) {
        component += tmplComponent(data[i]);
        if ((i + 1) % componentsPP === 0) {
            component += tmplPE();
            if (i !== data.length - 1) {
                storage.numberOfPages = ((i + 1) / componentsPP) + 1;
                component += tmplPS({
                    pageNumber: ((i + 1) / componentsPP) + 1
                });
            }
        }
    }
    setResultBoxWidth();
    resultsBox.insertAdjacentHTML('beforeEnd', component);

}

function getComponentsQuantity() {
    let vw = window.innerWidth;
    let quantity = Math.floor((vw - 30) / 220);
    if (!quantity > 0)
        quantity = 1;
    return quantity;
}

function setResultBoxWidth() {
    let resultsBox = document.getElementById('searchResults');
    resultsBox.style.width = storage.numberOfPages * (window.innerWidth + 10) + 'px';
}

function renderResults(res) {}
// function render() {
//     let html = '';
//
//     for (let i = 0; i < 3; i++) {
//         html += '<div class="row">';
//
//         for (let j = 0; j < 3; j++) {
//             html += `<div class="column">${game.getFieldValue(i, j) || ''}</div>`;
//         }
//
//         html += '</div>';
//     }
//
// }
//
// render();
