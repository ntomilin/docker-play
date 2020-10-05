const greeting = document.getElementById('greeting');
greeting.innerText = 'Default';

const index = document.getElementById('index');

const name = document.getElementById('name');

let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://127.0.0.1:13000/')
xhr.send();

xhr.onload = function() {
    const response = JSON.parse(xhr.response);
    greeting.innerText = response['Hello'];

    index.innerText = response['counter'];

    name.innerText = response['name'] || 'a';
};