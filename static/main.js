if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(reg => {

		if(reg.installing) {
			console.log('Service worker installing')
		} else if(reg.waiting) {
			console.log('Service worker installed')
		} else if(reg.active) {
			console.log('Service worker active')
		}

	}).catch(error => {
		console.log('Registration failed with ' + error)
	})
}

const restart = document.getElementById('restart')

const main = () => {
    const box = document.getElementById('box'), name = document.getElementById('name')
    let currentSide = true
    const circle = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1 1">
        <circle cx="0.5" cy="0.5" r="0.35" stroke="black" stroke-width="0.05" fill="none" />
    </svg>`
    const cross = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1 1">
        <line x1="0.15" y1="0.15" x2="0.85" y2="0.85" stroke="black" stroke-width="0.05" />
        <line x1="0.15" y1="0.85" x2="0.85" y2="0.15" stroke="black" stroke-width="0.05" />
    </svg>`

    const board = []
    const handlers = []
    box.innerHTML = ''
    name.innerHTML = 'Tic Tac Toe'

    const win = (side) => {
        if (side === 2) {
            name.innerHTML = 'Draw'
        } else {
            name.innerHTML = side ? 'O won' : 'X won'
        }
        
        for(const h of handlers) {
            h.item.removeEventListener('click', h.handler)
            h.item.className = ''
        }
    }

    const checkForWin = () => {
        for (let x = 0; x < 3; x++) {
            let curr = 0
            for (let i = 3 * x; i < 3 + 3 * x; i++) {
                if (i === 3 * x) {
                    curr = board[i]
                } else {
                    if (board[i] !== curr) {
                        curr = 0
                        break
                    }
                }
            }

            if(curr !== 0) {
                return curr
            }
        }

        for (let x = 0; x < 3; x++) {
            let curr = 0
            for (let i = x; i < 9; i += 3) {
                if (i === x) {
                    curr = board[i]
                } else {
                    if (board[i] !== curr) {
                        curr = 0
                        break
                    }
                }
            }

            if(curr !== 0) {
                return curr
            }
        }

        for (let x = 0; x < 3; x += 2) {
            let curr = 0
            for (let i = x; i < (!x ? 9 : 8); i += !x ? 4 : 2) {
                if (i === x) {
                    curr = board[i]
                } else {
                    if (board[i] !== curr) {
                        curr = 0
                        break
                    }
                }
            }

            if(curr !== 0) {
                return curr
            }
        }

        let filled = true
        for (let i = 0; i < 9; i++) {
            if (board[i] === 0) {
                filled = false
                break
            }
        }

        if (filled) {
            return 3
        }

        return 0
    }

    for (let i = 0; i < 9; i++) {
        board.push(0)
        box.innerHTML += `<div id="element-${i}" class="active"></div>`
    }

    for (let i = 0; i < 9; i++) {
        const curr = document.getElementById(`element-${i}`)
        const handler = () => {
            curr.innerHTML = currentSide ? cross : circle
            currentSide = !currentSide
            curr.removeEventListener('click', handler)
            curr.className = ''
            board[i] = currentSide + 1
            const score = checkForWin()
            if (score) win(score - 1)
        }
        handlers.push({
            item: curr,
            handler,
        })
        curr.addEventListener('click', handler)
    }
}

restart.addEventListener('click', () => {
    main()
})

main()