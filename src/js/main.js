import {getUsers, addUser} from './users.js';
import { loginUser } from "./login.js"; 
import {getEntries} from './diaryentries.js';


document.querySelector('#app').innerHTML = 'Moi';

getData();

const getUserBtn = document.querySelector('.get_users');
getUserBtn.addEventListener('click', getUsers);

const addUserForm = document.querySelector('.formpost');
addUserForm.addEventListener('click', addUser);

const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);

const loginForm = document.querySelector(".loginForm");
if (loginForm) loginForm.addEventListener("submit", loginUser);