const root = document.getElementById('root');
const input = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const loadMoreBtn = document.querySelector('.load-more');
const list = document.querySelector('#characters-wrap');

let searchQuery = '';
const BASE_URL = 'https://rickandmortyapi.com/api/character/';
let totalItem = 5;
const five = 5;
let dataList = [];

if (JSON.parse(localStorage.getItem('data'))) {
    dataList = JSON.parse(localStorage.getItem('data'));
}

input.addEventListener('input', onInput);
searchBtn.addEventListener('click', onSearchBtnClick);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

loadMoreBtn.hidden = true;

if (dataList) {
    renderResponce(dataList);
}

function onInput(event) {
    searchQuery = event.target.value.trim();
}

function onSearchBtnClick() {
    totalItem = five;
    if (searchQuery !== '') {
        return fetch(`${BASE_URL}${searchQuery}`).then(response => {
        if (response.ok) {
            return response.json().then(addToDataList);
        }
        throw new Error();
        })
        .catch(() => alert('Character not found'));
    }
    
}

function addToDataList(data) {
    const { id, image, name } = data;
    let dataItem = { id, image, name };
    let status = dataList.find(el => el.id === dataItem.id);
    
    if (status && dataList !== []) {
            alert('Character is already in the list');
        }

    if (!status) {
            dataList.unshift(dataItem);
    }

    localStorage.setItem('data', JSON.stringify(dataList));
    renderResponce(dataList);
}

function renderResponce(dataList) {
    list.innerHTML = itemTemplate(dataList);
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', onDeleteBtnClick));
    
    if (list.children.length > five) {
        loadMoreBtn.hidden = false;
        for (let i = 5; i < list.children.length; i++) {
            list.children[i].style.display = 'none';
        }
    }
    return list;
}

function itemTemplate(dataList) {
    return dataList
        .map((item, i) => `<div class="item-wrapper"><img id="${item.id}" src="${item.image}" 
        alt="${item.name}" class="item"/><button id="${i}" class="delete-btn">Delete</button></div>`)
        .join('');
}


function onLoadMoreBtnClick() {
    
    if (list.children.length - totalItem <= totalItem) {
        loadMoreBtn.hidden = true;
    }
    if (list.children.length >= totalItem) {
        
        for (let i = totalItem; i < totalItem + five; i++) {
            list.children[i].style.display = 'block';
        }
    } else {
        
        for (let i = totalItem; i < list.children.length; i++) {
            list.children[i].style.display = 'block';
            return;
        }
    }

    totalItem += five;
    window.scrollTo(0, document.body.scrollHeight)
}

function onDeleteBtnClick(event) {
    let answer = confirm('Are you really want to delete item?');
    if (answer) {
        let btnId = event.target.id;
        dataList.splice(btnId, 1);
        localStorage.setItem('data', JSON.stringify(dataList));
        renderResponce(dataList);
    } else {
        return;
    }
}