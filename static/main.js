if ('serviceWorker' in navigator)
	navigator.serviceWorker.register('/sw.js');

const boxContainer = document.querySelector('.box');
const title = document.querySelector('.title');
const restart = document.getElementById('restart');

// If we didn't set the width safari wouldn't render the svg...
const circleSvg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" viewBox="0 0 1 1">
	<circle cx="0.5" cy="0.5" r="0.35" stroke="black" stroke-width="0.05" fill="none"></circle>
</svg>`;
const crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" viewBox="0 0 1 1">
	<line x1="0.15" y1="0.15" x2="0.85" y2="0.85" stroke="black" stroke-width="0.05"></line>
	<line x1="0.15" y1="0.85" x2="0.85" y2="0.15" stroke="black" stroke-width="0.05"></line>
</svg>`;

let currentSide = true;
let board = [], tiles = [], handlers = [];

const win = (side) => {
	if (side === 2)
		title.innerHTML = 'Draw';
	else
		title.innerHTML = side ? 'X won' : 'O won';

	for (const h of handlers) {
		h.item.removeEventListener('click', h.handler);
		h.item.className = '';
	}
};

const checkForWin = () => {
	for (let x = 0; x < 3; x++) {
		let curr = 0;
		for (let i = 3 * x; i < 3 + 3 * x; i++) {
			if (i === 3 * x) {
				curr = board[i];
			} else {
				if (board[i] !== curr) {
					curr = 0;
					break;
				}
			}
		}

		if(curr !== 0)
			return curr;
	}

	for (let x = 0; x < 3; x++) {
		let curr = 0;
		for (let i = x; i < 9; i += 3) {
			if (i === x) {
				curr = board[i];
			} else {
				if (board[i] !== curr) {
					curr = 0;
					break;
				}
			}
		}

		if(curr !== 0)
			return curr;
	}

	for (let x = 0; x < 3; x += 2) {
		let curr = 0;
		for (let i = x; i < (!x ? 9 : 8); i += !x ? 4 : 2) {
			if (i === x) {
				curr = board[i];
			} else {
				if (board[i] !== curr) {
					curr = 0;
					break;
				}
			}
		}

		if(curr !== 0)
			return curr;
	}

	let filled = true;
	for (let i = 0; i < 9; i++) {
		if (board[i] === 0) {
			filled = false;
			break;
		}
	}

	if (filled)
		return 3;

	return 0;
};

const setup = () => {
	title.innerHTML = 'Tic Tac Toe';
	boxContainer.innerHTML = '';

	for (let i = 0; i < 3 ** 2; i++)
		boxContainer.appendChild(document.createElement('div'));

	tiles = [ ...boxContainer.children ];
	board = Array(9).fill(0);
	currentSide = true;
};

const main = () => {
	setup();

	handlers = [];
	for (let i = 0; i < 9; i++) {
		const handler = () => {
			tiles[i].innerHTML = currentSide ? crossSvg : circleSvg;
			tiles[i].removeEventListener('click', handler);
			tiles[i].className = '';

			board[i] = currentSide + 1, currentSide = !currentSide;

			const score = checkForWin();
			if (score)
				win(score - 1);
		}

		handlers.push({
			item: tiles[i],
			handler,
		});

		tiles[i].classList.add('active');
		tiles[i].addEventListener('click', handler);
	}
}

main();
restart.onclick = () => main();
