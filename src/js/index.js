import { fetchData } from './fetch.js';

console.log('Moi luodaan nyt tokeneita ja kirjaudutaan sisään');

const loginUser = async (event) => {
	event.preventDefault();

	// Haetaan oikea formi
	const logaccordionrm = document.querySelector('.logaccordionrm');

	// Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
	const username = logaccordionrm.querySelector('input[name=username]').value;
	const password = logaccordionrm.querySelector('input[name=password]').value;

	// Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
	const bodyData = {
		username: username,
		password: password,
	};

	// Endpoint
	const url = 'http://127.0.0.1:3000/api/auth/login';

	// Options
	const options = {
		body: JSON.stringify(bodyData),
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
	};
	console.log(options);

	// Hae data
	const response = await fetchData(url, options);

	if (response.error) {
		console.error('Error adding a new user:', response.error);
		return;
	}

	if (response.message) {
		console.log(response.message, 'success');
		localStorage.setItem('token', response.token);
		localStorage.setItem('nimi', response.user.given_name);
		alert('Sisäänkirjautuminen onnistui!! Siirrän sinut pääsivulle!!!');
		location.href = './src/pages/kubios.html';
	}

	console.log(response);
	logaccordionrm.reset(); // tyhjennetään formi
};

const logaccordionrm = document.querySelector('.logaccordionrm');
logaccordionrm.addEventListener('submit', loginUser);
