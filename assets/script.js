const games = [
    { name: "slot", icon: "🎰 ", color: "#3498db" },
    { name: "rulet", icon: "🎡 ",color: "#e74c3c" },
    { name: "blackjack", icon: "🃏 ",color: "#2ecc71" },
    { name: "bonanza", icon: "🍬 ",color: "#f39c12" }
];

const transactions = [
    { type: 'win', amount: 5000, game: 'Blackjack' },
    { type: 'loss', amount: 2000, game: 'Poker' },
    { type: 'win', amount: 3000, game: 'Slot Machine' },
    { type: 'loss', amount: 1000, game: 'Roulette' }
];

const key = 'mysecretkey';

function encrypt(text) {
    return text.split('').map((char, index) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
    ).join('');
}

function decrypt(encrypted) {
    return encrypt(encrypted); // XOR şifreleme simetrik olduğu için aynı fonksiyon kullanılabilir
}

function initializeCoins() {
    const storedCoins = localStorage.getItem('coins');
    if (!storedCoins) {
        const initialCoins = 100;
        const encryptedCoins = encrypt(initialCoins.toString());
        localStorage.setItem('coins', encryptedCoins);
    }
}

function getCoins() {
    const encryptedCoins = localStorage.getItem('coins');
    return encryptedCoins ? parseInt(decrypt(encryptedCoins), 10) : 0;
}

function updateCoins(amount) {
    const currentCoins = getCoins();
    const newCoins = currentCoins + amount;
    localStorage.setItem('coins', encrypt(newCoins.toString()));
    document.getElementById('coin').textContent = newCoins + '$';
}

function claimDailyBonus() {
    const lastClaimedDate = localStorage.getItem('lastClaimedDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastClaimedDate === today) {
        alert('Günlük bonusu zaten aldınız!');
        return;
    }
    
    const random = Math.floor(Math.random() * 100) + 1;
    updateCoins(random);
    alert(random + " Coin Kazandın");
    localStorage.setItem('lastClaimedDate', today);
    document.getElementById('dailyBonusButton').disabled = true;
}

function openGame(index) {
    window.location.href = "/" + games[index].name + ".html"
}

function renderGames() {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';
    games.forEach((game, index) => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.style.backgroundColor = game.color;
        gameCard.textContent = game.icon + game.name;
        gameCard.onclick = () => openGame(index);
        gamesContainer.appendChild(gameCard);
    });
}

function renderTransactions() {
    const transactionsContainer = document.getElementById('transactionsContainer');
    transactionsContainer.innerHTML = '';
    transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = `transaction ${transaction.type}`;
        transactionElement.innerHTML = `
            <span class="game">${transaction.game}</span>
            <span class="amount">${transaction.type === 'win' ? '+' : '-'}${transaction.amount}$</span>
        `;
        transactionsContainer.appendChild(transactionElement);
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.menu a').forEach(link => link.classList.remove('active'));
    document.querySelector(`.menu a[data-tab="${tabName}"]`).classList.add('active');
    
    document.getElementById('gamesContainer').style.display = tabName === 'games' ? 'grid' : 'none';
    document.getElementById('transactionsContainer').style.display = tabName === 'transactions' ? 'flex' : 'none';
    document.getElementById('storeContainer').style.display = tabName === 'store' ? 'block' : 'none';
    
    document.getElementById('pageTitle').textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCoins();
    updateCoins(0);
    renderGames();
    renderTransactions();

    const lastClaimedDate = localStorage.getItem('lastClaimedDate');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dailyBonusButton').disabled = lastClaimedDate === today;

    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(e.target.getAttribute('data-tab'));
        });
    });

    document.getElementById('dailyBonusButton').addEventListener('click', claimDailyBonus);

    switchTab('games');
});