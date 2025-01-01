import { months } from "./contants.js";

// mail objesi içerisindeki kullanılacak tarih verisini oluşturan fonksiyon
const getDate = () => {
    // genel tarih objesi
    const date = new Date();
    // tarih objesi içerisinde gün değerine erişme
    const day = date.getDate();
    // tarih objesi içerisindeki ay değerine erişme
    const month = date.getMonth() + 1;
    // ay numarasına karşılık gelen ay adını bul
    const updateMonths = months[month - 1];

    // gün ve ay verisini fonksiyon çağırıldığında geri döndür
    return day + " " + updateMonths;
};

// metinleri kısıtlayan fonksiyon
const trimString = (text, max) => {
    // eger ilgili metin max değeri aşmamışsa bunu direkt return etsin
    if (text.length < max) {
        return text;
    }

    // eger ilgili metin max değeri aşarsa bunu kısıtlasın
    else {
        return text.slice(0, max) + "...";
    }
};

export { getDate, trimString };