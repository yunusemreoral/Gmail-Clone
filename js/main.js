


// ! Diğer dosyalardan import

import { renderCategories, renderMails, showModal} from "./ui.js";
import { getDate } from "./helper.js";
import { categories } from "./contants.js";

// ! Html'deki elemanlara erişme

const hamburgerMenu = document.querySelector(".hamburger-menu");
const navigation = document.querySelector("nav");
const createMailBtn = document.querySelector(".create");
const modal = document.querySelector(".modal-wrapper");
const closeModalBtn = document.querySelector("#close-btn");
const form = document.querySelector("#create-mail-form");
const mailsArea = document.querySelector(".mails-area");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-icon");
const categoryArea = document.querySelector(".nav-middle");

// localstoragedan verileri al
const strMailData = localStorage.getItem("data");

// localstoragedan gelen verileri javascript nesnesine çevir
const mailData = JSON.parse(strMailData) || [];

// sayfanın yüklenme anını izleyerek mailleri render et
document.addEventListener("DOMContentLoaded", () => {
  renderMails(mailsArea, mailData);
});

// Hamburger menüye tıklanınca sol menüyü kapat aç yapan fonksiyon
hamburgerMenu.addEventListener("click", () => {
  navigation.classList.toggle("hide");
});

// Oluştur butonuna tıklanma anını izle

// Oluştur butonuna tıklayınca modalı aç
createMailBtn.addEventListener("click", () => showModal(modal, true));
// Modal kapat butonuna tıklayınca modalı kapat
closeModalBtn.addEventListener("click", () => showModal(modal, false));

// Ekran boyutundaki değişimi izleyerek leftNav kısmının görünürlüğünü ayarla

// Pencerenin genişliğini izle
window.addEventListener("resize", (e) => {
  // ekran genişliğine eriş
  const width = e.target.innerWidth;

  if (width < 1100) {
    // eğer ekran genişliği 1100 px altındaysa lefNav kısmına hide classını ekle
    navigation.classList.add("hide");
  } else {
    // eger ekran genişliği 1100 px altında değilse lefNav kısmına hide classını kaldır
    navigation.classList.remove("hide");
  }
});
const watchCategory = (e) => {
  const leftNav = e.target.parentElement;
  const selectedCategory = leftNav.dataset.name;
  renderCategories(categoryArea, categories, selectedCategory);

  if (selectedCategory === "Yıldızlananlar") {
    const filtred = mailData.filter((i) => i.stared === true);
    renderMails(mailsArea , filtred);
    return; 
  }

  renderMails(mailsArea, mailData);
};

// categori alanında gerçekleşen tıklamaları izle
categoryArea.addEventListener("click", watchCategory);

// Form gönderildiğinde çalışacak fonksyion

const sendMail = (e) => {
  // formlar gönderildiğinde sayfa yenilenmesine sebeb olur bunu engellenmek için
  e.preventDefault();
  const recevier = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;

  // form içersindeki inputların boş olma durumunu kontrol et
  if (!recevier || !title || !message) {
    Toastify({
      text: "Formu doldurunuz !",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#FDCC00",
        borderRadius: "10px",
      },
      onClick: function () {}, // Callback after click
    }).showToast();

    // eger inputlar boşsa uyarı ver ve fonsiyonu durdur
    return;
  }

  // gönderilen form içerisindeki değerler ile bir nesne oluştur

  const newMail = {
    //recevir,title,message,id,date
    id: new Date().getTime(),
    sender: "Yusuf",
    recevier,
    title,
    message,
    stared: false,
    date: getDate(),
  };

  mailData.unshift(newMail);

  // mail objesini localstorage kayıt edebilmek için string veri tipine çevirmemiz
  const strData = JSON.stringify(mailData);
  // stringe çevirilen veriyi localstorage kayıt et.Localstorage verileri key-value

  // formun gönderilmesiyle elde edilen verileri localstorage a kayıt et 
  localStorage.setItem("data", strData);

  // modal içerisindeki inputları sıfırla
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  // modalı kapat
  showModal(modal, false);

  // bildirim gönder
  Toastify({
    text: "Mail başarıyla gönderildi.",
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#24BB33",
      borderRadius: "10px",
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  // mailleri ekrana render et
  renderMails(mailsArea, mailData);
};

const updateMail = (e) => {
  // eger silme butonuna tıklandıysa bu maili sil
  if (e.target.classList.contains("bi-trash-fill")) {
    // sil iconuna tıklayınca mail elemanını silmemiz gerekir.Bunu iconun kapsam elemanına erişerek yaparız.

    // const mail = e.target.parentElement.parentElement.parentElement;
    const mail = e.target.closest(".mail");
    // mailin id'sine eriş
    const mailId = mail.dataset.id;
    // Id si bilinen elemanı diziden kaldır
    const filtredData = mailData.filter((mail) => mail.id != mailId);
    // filtrelenmiş diziyi localstorage aktar
    // i-) filtrelenmiş maili stringe çevir
    const strData = JSON.stringify(filtredData);
    // ii-) Localstoragedan verileri kaldır
    localStorage.setItem("data", strData);

    // kaldıralan maili arayüzden de kaldır
    mail.remove();
  }

  // eger yıldız iconuna tıklandıysa bu maili yıldızla

  if (
    e.target.classList.contains("bi-star") ||
    e.target.classList.contains("bi-star-fill")
  ) {
    // tıklanan yıldız iconunun kapsamına eriş
    const mail = e.target.parentElement.parentElement;
    // tıklanan elemanın data-id sine eriş
    const mailId = mail.dataset.id;
    // mail dizisi içerisinde id'si bilinen elemanı bul
    const foundedMail = mailData.find((i) => i.id == mailId);
    // bulunan elemanın yıldızlımı değerini tersine çevir
    const updateMail = { ...foundedMail, stared: !foundedMail.stared };
    // güncellenen eleanın indexini bul
    const index = mailData.findIndex((i) => i.id == mailId);
    // indexi bulunan eleamnı dizide güncelle
    mailData[index] = updateMail;
    // localstorage ı güncelle
    localStorage.setItem("data",JSON.stringify(mailData));
    // ekranı güncel verilerle render et
    renderMails(mailsArea, mailData);
  }
};

// Formun gönderilmesini izle

form.addEventListener("submit", sendMail);

// mail alanına tıklanınca çalışacak fonksiyon
mailsArea.addEventListener("click", updateMail);

// arama butonuna tıklandığında çalışan fonksiyon
searchButton.addEventListener("click", () => {
  // input içerisindeki değerin mail dizisi içerisinde olup olmadığını kontrol et.Ve eğer varsa bunu filtredArray dizisine aktar
  const filtredArray = mailData.filter((i) => {
    return i.message.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  // bulunan maiileri ekrana render et
  renderMails(mailsArea, filtredArray);
});
