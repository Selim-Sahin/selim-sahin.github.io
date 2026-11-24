# selim-sahin.github.io

Selim Şahin'in kişisel portfolyo sitesi → **https://selim-sahin.github.io**

Düz HTML + CSS + biraz JavaScript. Framework, derleme adımı ya da `npm` yok:
dosyaları değiştirip GitHub'a gönderdiğinde site birkaç dakika içinde güncellenir.

## Dosyalar

```
index.html            Sayfanın tamamı (bölümler, metinler, iletişim bağlantıları)
css/style.css         Görünüm: renkler, açık/koyu tema, animasyonlar, mobil düzen
js/main.js            Tema anahtarı, proje kartları, dönen unvan, e-posta, CV düğmesi
data/projeler.json    Proje kartlarının bilgileri
assets/profil.jpg     Profil fotoğrafı
assets/projeler/      Proje ekran görüntüleri
assets/cv/            CV PDF'i (selim-sahin-cv.pdf)
.nojekyll             GitHub Pages'e "dosyaları olduğu gibi yayınla" der
```

## Yerelde açmak

Proje kartları `data/projeler.json`'dan okunduğu için dosyayı çift tıklayıp açmak yetmez
(tarayıcı `file://` adresinden dosya okumaya izin vermez). Klasörde bir terminal açıp:

```bash
python -m http.server 8000
```

sonra tarayıcıda <http://localhost:8000> adresine git. Kapatmak için terminalde `Ctrl+C`.

## Yeni proje eklemek

`data/projeler.json` dosyasına bir kayıt eklemen yeterli; HTML'e dokunmana gerek yok.
Kayıtlar köşeli parantez içinde, aralarında virgülle sıralanır. Kartlar dosyadaki sırayla görünür.

```json
{
  "baslik": "Projenin adı",
  "aciklama": "1–2 cümlelik açıklama.",
  "etiketler": ["C", "Raylib"],
  "gorsel": "assets/projeler/proje-adi.jpg",
  "gorselAlt": "Görselde ne göründüğünü anlatan kısa cümle (ekran okuyucular için)",
  "not": "İsteğe bağlı kısa uyarı, ör. Klavye gerekir.",
  "canli": "https://selim-sahin.github.io/proje-adi/",
  "repo": "https://github.com/Selim-Sahin/proje-adi"
}
```

| Alan | Zorunlu mu? | Ne işe yarar |
|---|---|---|
| `baslik`, `aciklama` | evet | Kartın başlığı ve metni |
| `etiketler` | hayır | Teknoloji etiketleri |
| `gorsel` + `gorselAlt` | hayır | Ekran görüntüsü (en iyi oran 16:10, ör. 960×600). Yoksa gradyanlı yer tutucu çıkar |
| `yerTutucu` | hayır | Görsel yoksa yer tutucuda görünecek emoji, ör. `"🐍"` |
| `not` | hayır | Kartta ⓘ ile gösterilen kısa not |
| `canli` | hayır | Varsa **▶ Oyna** düğmesi çıkar |
| `repo` | hayır | Varsa **Kod** düğmesi çıkar |
| `durum` | hayır | Başlığın yanında rozet, ör. `"Yakında"` |

> İpucu: JSON'da son kaydın sonuna virgül **koyma**; tek bir yanlış virgül bütün kartları bozar.
> Kaydettikten sonra siteyi yerelde açıp kontrol et.

## Sık yapılacak değişiklikler

- **CV:** PDF'i `assets/cv/selim-sahin-cv.pdf` adıyla koy. Dosya varsa "CV'yi indir" düğmeleri
  kendiliğinden çalışır; yoksa "CV yakında" yazar.
- **E-posta:** `index.html`'de `class="iletisim-link eposta"` satırında `data-k` (@ öncesi) ve
  `data-a` (@ sonrası) değerlerini değiştir. Adres botlar kolay bulmasın diye sayfada JS ile birleştirilir.
- **LinkedIn:** `index.html`'de `linkedin.com/in/...` adresini değiştir.
- **Metinler:** Hakkımda, Yetenekler ve CV özeti doğrudan `index.html`'de.
- **Dönen unvanlar:** `js/main.js` içindeki `unvanlar` listesi.

## Gizlilik

Sitede ve herkese açık CV'de telefon, ev adresi, doğum tarihi, TC kimlik no, medeni durum
ve askerlik durumu yer almaz.
