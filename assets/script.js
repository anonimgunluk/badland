function encrypt(text) {
    const key = 'mysecretkey';
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

// Sayfa yüklendiğinde işlemleri başlat
document.addEventListener('DOMContentLoaded', () => {
    initializeCoins();
    const coins = getCoins();
    document.getElementById('coin').textContent = coins;
});