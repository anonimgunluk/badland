const fingerprint = getFingerprint();

// Kullanıcı parmak izini al
function getFingerprint() {
    const msg = navigator.userAgent + navigator.language;
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
    const hashBuffer = crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}


// LocalStorage'da parayı set eden fonksiyon
function getChip() { 
    let encoded = localStorage.getItem("chip");
    
    // Geçersiz değerleri kontrol et
    if (!encoded || encoded === "null" || encoded === "undefined") {
        return 100;
    }

    try {
        const decoded = atob(encoded);

        // Doğrula ve bakiye döndür
        if (decoded.endsWith(fingerprint)) {
            const balance = parseInt(decoded.replace(fingerprint, ""), 10);

            // Eğer `NaN` ise 100 döndür
            return isNaN(balance) ? 100 : balance;
        }
    } catch (error) {
        // Hatalı `atob` işlemi olursa 100 döndür
        console.error("Error decoding chip value:", error);
    }
}

function setChip(amount) {
    const encoded = btoa(`${amount}${fingerprint}`);
    localStorage.setItem("chip", encoded);
}

function reloadChip() {
    const walletElement = document.getElementById('wallet');
    const currentChip = getChip();
    walletElement.textContent = `${currentChip}₺`;
}

// Sayfa yüklendiğinde cüzdan bilgilerini güncelle
document.addEventListener('DOMContentLoaded', () => {
    const walletElement = document.getElementById('wallet');
    const currentChip = getChip();
    walletElement.textContent = `${currentChip}₺`;

    // Oyun kartlarına tıklama olayı
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const h3 = card.querySelector('h3'); // Her bir kart içindeki h3'ü seç
            if (h3) {
                let link = h3.innerText; // Başlık metnini al
                link = encodeURI(link.toLowerCase() + ".html"); // Metni URL'ye uygun hale getir
                window.location.href = "/game/" + link; // Sayfayı yönlendir
            }
        });
    });    
});