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
    { type: 'loss', amount: 1000, game: 'Roulette' },
    { type: 'win', amount: 5000, game: 'Blackjack' },
    { type: 'loss', amount: 2000, game: 'Poker' },
    { type: 'win', amount: 3000, game: 'Slot Machine' },
    { type: 'loss', amount: 1000, game: 'Roulette' }
];

const key = 'mysecretkey'; // XOR şifreleme için kullanılan anahtar

// XOR şifreleme fonksiyonu (şifrelemek ve çözmek için aynı fonksiyon kullanılır)
function encrypt(text) {
    return text.split('').map((char, index) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
    ).join('');
}

function decrypt(encrypted) {
    return encrypt(encrypted); // XOR şifreleme simetrik olduğu için aynı fonksiyon
}

// Oyuncunun coin değerini LocalStorage'da başlatan fonksiyon
function initializeCoins() {
    const storedCoins = localStorage.getItem('coins');
    if (!storedCoins) {
        const initialCoins = 100; // İlk başlatma için coin miktarı
        const encryptedCoins = encrypt(initialCoins.toString());
        localStorage.setItem('coins', encryptedCoins);
    }
}

// Coin değerini LocalStorage'dan alıp çözerek döndüren fonksiyon
function getCoins() {
    const encryptedCoins = localStorage.getItem('coins');
    return encryptedCoins ? parseInt(decrypt(encryptedCoins), 10) : 0;
}

// Coin değerini günceller ve ekranda gösterir
function updateCoins(amount) {
    const currentCoins = getCoins();
    const newCoins = currentCoins + amount;
    localStorage.setItem('coins', encrypt(newCoins.toString()));
    document.getElementById('coin').textContent = newCoins + '$';
}

// Günlük bonusu talep etmek için fonksiyon
function claimDailyBonus() {
    const lastClaimedDate = localStorage.getItem('lastClaimedDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastClaimedDate === today) {
        alert('Günlük bonusu zaten aldınız!');
        return;
    }

    const randomBonus = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    updateCoins(randomBonus);
    alert(randomBonus + " Coin Kazandınız!");
    localStorage.setItem('lastClaimedDate', today);
    document.getElementById('dailyBonusButton').disabled = true;
}

// Oyun sayfasına yönlendiren fonksiyon
function openGame(index) {
    window.location.href = "/" + games[index].name + ".html";
}

// Oyunları render eden fonksiyon
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

// İşlemleri render eden fonksiyon
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

// Sekmeleri geçiş yapmaya yarayan fonksiyon
function switchTab(tabName) {
    document.querySelectorAll('.menu a').forEach(link => link.classList.remove('active'));
    document.querySelector(`.menu a[data-tab="${tabName}"]`).classList.add('active');

    document.getElementById('gamesContainer').style.display = tabName === 'oyunlar' ? 'grid' : 'none';
    document.getElementById('transactionsContainer').style.display = tabName === 'işlemler' ? 'flex' : 'none';
    document.getElementById('storeContainer').style.display = tabName === 'mağaza' ? 'block' : 'none';

    document.getElementById('pageTitle').textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
}

// Sayfa yüklendiğinde işlemleri başlatan event
document.addEventListener('DOMContentLoaded', () => {
    initializeCoins(); // LocalStorage'da coin varsa başlat
    updateCoins(0); // İlk coin güncellemesi (ekrana yazdırmak için)
    renderGames(); // Oyun kartlarını oluştur
    renderTransactions(); // İşlemleri göster

    // Günlük bonus butonunu duruma göre etkin/deaktif et
    const lastClaimedDate = localStorage.getItem('lastClaimedDate');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dailyBonusButton').disabled = lastClaimedDate === today;

    // Menüdeki sekme geçişlerini ayarla
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(e.target.getAttribute('data-tab'));
        });
    });

    // Günlük bonus butonuna tıklanınca bonusu ver
    document.getElementById('dailyBonusButton').addEventListener('click', claimDailyBonus);

    // Varsayılan sekmeyi aç
    switchTab('oyunlar');
});
