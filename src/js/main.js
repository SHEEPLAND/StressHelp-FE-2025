import {getUsers, addUser} from '';
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

const logaccordionrm = document.querySelector(".logaccordionrm");
if (logaccordionrm) logaccordionrm.addEventListener("submit", loginUser);