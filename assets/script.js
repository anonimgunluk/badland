
const key = 'mysecretkey';

function encrypt(text) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return encrypted;
}

function decrypt(encrypted) {
    return encrypt(encrypted);
}

// LocalStorage'da para kontrolü ve başlangıç ayarı
function initializeCoins() {
    const storedCoins = localStorage.getItem('coins');
    if (!storedCoins) {
        const initialCoins = 100; // Başlangıç parası
        const encryptedCoins = encrypt(initialCoins.toString());
        localStorage.setItem('coins', encryptedCoins);
    }
}

// Para miktarını al
function getCoins() {
    const encryptedCoins = localStorage.getItem('coins');
    if (encryptedCoins) {
        return parseInt(decrypt(encryptedCoins), 10);
    }
    return 0; // Eğer para yoksa 0 döner
}

// Günlük bonusu al
function claimDailyBonus() {
    const lastClaimedDate = localStorage.getItem('lastClaimedDate');
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi

    if (lastClaimedDate === today) {
        alert('Günlük bonusu zaten aldınız!'); // Kullanıcıya bilgi ver
        return;
    }
    
    const currentCoins = getCoins();
    
    // Rastgele bir miktar belirle (örneğin 1 ile 100 arasında)
    const random = Math.floor(Math.random() * 100) + 1;
    const newCoins = currentCoins + random;
    alert(random + " Coin Kazandın");
    // Güncel parayı kaydet
    localStorage.setItem("coins", encrypt(newCoins.toString()));
    document.getElementById("coin").textContent = newCoins;
    localStorage.setItem('lastClaimedDate', today);
    document.getElementById("dailyBonusButton").disabled = true;
}

// Sayfa yüklendiğinde işlemleri başlat
document.addEventListener('DOMContentLoaded', () => {
    initializeCoins();
    const coins = getCoins();
    document.getElementById('coin').textContent = coins;
    
    // Eğer bonus zaten alındıysa butonu devre dışı bırak
    const lastClaimedDate = localStorage.getItem('lastClaimedDate');
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi

    if (lastClaimedDate === today) {
        document.getElementById("dailyBonusButton").disabled = true;
    }
});