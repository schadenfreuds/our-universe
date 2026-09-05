# ✨ Bizim Evrenimiz — Estetik Kozmik Yıldönümü & Anı Sandığı Web Uygulaması

> **Kodlarla dokunmuş sonsuz bir aşk yolculuğu.** Çiftlerin birlikte geçen zamanlarını kutlamaları için tasarlanmış modern, estetik ve açık kaynaklı bir web deneyimi. Kaydırmaya duyarlı 3D derinlikli yıldız gökyüzü, saniye saniye işleyen canlı zaman sayacı ve yıldönümü şifresiyle korunan gizli anı sandığı içerir.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![Lisans: MIT](https://img.shields.io/badge/Lisans-MIT-rose.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan.svg)

---

## 🌟 Öne Çıkan Özellikler

- 🌌 **Kaydırmaya Duyarlı (Scroll-Driven) 3D Uzay Paralaksı:** HTML5 Canvas ile 60 FPS çalışan akıcı uzay deneyimi. Aşağı doğru kaydırdıkça kamera uzayın derinliklerine doğru süzülür, yıldızlar ve bulutsular katman katman hareket eder.
- ⏱️ **Canlı İşleyen Yıldönümü Sayacı:** Belirlediğiniz tarihten bugüne geçen gün, saat, dakika ve saniyeleri cam efektli (*glassmorphism*) kutularda canlı olarak hesaplar ve her saniye günceller.
- 🔒 **Yıldönümü Şifresiyle Korunan Anı Sandığı:** Zaman tüneli bölümü, sevgiliniz yıldönümü tarihinizi (örn: `0709`, `07.09`, `07092024`) girene kadar kilitli kalır. Şifre doğru girildiğinde konfeti yağmuruyla anılar açılır.
- 📸 **Tarayıcı İçi Akıllı Retina Görsel Sıkıştırma:** Telefondan çektiğiniz 8–12 MB'lık dev fotoğrafları doğrudan yükleyebilirsiniz. Dahili sıkıştırıcı gözle görülür tek bir piksel bile kalite kaybetmeden görseli 1800px 2K Retina kalitesine (~250 KB) otomatik optimize eder.
- ⚙️ **Dahili Kodsuz Yönetim Paneli (Admin):** Sağ üstteki kilit ikonuna tıklayarak (varsayılan PIN: `0411`) isimleri, tarihleri değiştirebilir, fotoğraf yükleyebilir ve anı açıklamalarını tarayıcınızdan tek tıkla düzenleyebilirsiniz.
- 🎵 **Entegre Huzurlu Müzik Çalar:** Arka planda çalan atmosferik parça ve ses açma/kapama butonu.
- 🌍 **Çift Dil Desteği (TR 🇹🇷 / EN 🌍):** Yönetici panelinden tek tıkla seçilebilen, hem Türkçe hem İngilizce tam arayüz desteği.

---

## 🚀 Hızlı Başlangıç (1 Dakikada Kurulum)

```bash
# 1. Repoyu klonlayın
git clone https://github.com/schadenfreuds/our-universe.git

# 2. Proje dizinine girin
cd our-universe

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirici sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine gidin.

---

## 🛠️ Nasıl Özelleştirilir?

### 1. Yönetim Paneli ile (En Kolay Yol):
1. Siteyi tarayıcınızda açın.
2. Sağ üstteki 🔒 **Kilit** simgesine tıklayın.
3. Varsayılan PIN: **`0411`** (Panel içinden değiştirebilirsiniz).
4. **Genel Ayarlar** sekmesinde:
   - Kendi isimlerinizi, hikaye başlığınızı, tanışma tarihinizi ve kilit şifrenizi belirleyin.
5. **Anı Sandığı** sekmesinde:
   - Fotoğraflarınızı yükleyin, tarihleri, konumları ve anı açıklamalarınızı yazın.
6. **Kaydet** butonuna basın. Tek bir kod satırına dokunmadan her şey anında güncellenir!

### 2. Doğrudan Dosyadan (`src/data/story.json`):
Tüm veriler `src/data/story.json` içinde temiz bir JSON formatında saklanır.

---

## 🌐 Ücretsiz Canlıya Alma (Vercel)

1. Bu projeyi kendi GitHub hesabınıza yükleyin (push edin).
2. [Vercel](https://vercel.com) hesabınıza girip **Add New Project** deyin.
3. Reponuzu seçip **Deploy** butonuna basın.
4. 30 saniye içinde sevgilinize gönderebileceğiniz canlı linkiniz (örn: `our-universe.vercel.app`) hazır!

---

## 💖 Katkıda Bulunma
Bu açık kaynaklı şablonu sevdiyseniz repoya bir ⭐️ yıldız bırakmayı unutmayın!

## 📄 Lisans
MIT Lisansı • Sevdiklerinizle özgürce paylaşabilir, geliştirebilir ve kullanabilirsiniz.
