# Zaślepka Produkcyjna – Klinika Piękna KALINA

Ten folder (`zaslepka/`) zawiera kompletną, w pełni niezależną stronę tymczasową typu **"Strona w budowie / Przygotowujemy nowy serwis"**, gotową do natychmiastowego wrzucenia na hosting produkcyjny.

---

## 🚀 Jak wdrożyć na serwer (np. Cyberfolks, Zenbox, dhosting, cPanel, FTP):

1. Połącz się ze swoim serwerem przez FTP/SFTP (np. FileZilla) lub Menadżer Plików w panelu hostingu.
2. Wejdź do głównego katalogu domeny (najczęściej `public_html/` lub `www/` lub `klinikakalina.pl/`).
3. **Wgraj całą ZAWARTOŚĆ tego folderu `zaslepka/`** bezpośrednio do głównego katalogu na serwerze:
   - `index.html`
   - `.htaccess`
   - `robots.txt`
   - `sitemap.xml`
   - folder `css/` (z `style.css`)
   - folder `assets/` (zoptymalizowane zdjęcia, logo i ikony)

---

## ✨ Co zawiera i jak działa ta strona:

1. **Pełna niezależność:** Strona nie wymaga żadnego budowania (`npm`, `build.js`), baz danych ani PHP – to ultra-szybki, czysty HTML5 + CSS3.
2. **Kluczowa informacja dla klientów:**
   - Wyraźny komunikat, że **Klinika funkcjonuje normalnie i przyjmuje pacjentów**, a prace dotyczą jedynie nowego serwisu WWW.
   - Informacja, że pełny aktualny cennik i wolne terminy są stale dostępne w Booksy.
3. **Aktywne rezerwacje i kontakt:**
   - Bezpośredni link do Booksy z wyróżnioną oceną **5.0 ★★★★★ (992 opinie)**.
   - Bezpośrednie klikalne połączenie telefoniczne: `+48 500 516 118` (`tel:+48500516118`).
   - Dokładny adres: `ul. Widoczna 51, 04-647 Warszawa (Wawer / Anin)` + link do nawigacji w Google Maps.
   - Godziny otwarcia z dynamicznym wskaźnikiem czasu rzeczywistego (sprawdza czy klinika jest w danej chwili otwarta).
   - Przegląd kluczowych technologii i zabiegów (HIFU, Dermapen, Intraceuticals, itd.).
4. **Gotowy plik `.htaccess` dla produkcji:**
   - Automatyczne wymuszenie szyfrowania **HTTPS** (przekierowanie 301).
   - Bezpieczne nagłówki HTTP (`nosniff`, `SAMEORIGIN`, `strict-origin`).
   - Kompresja GZIP/Deflate.
   - Pamięć podręczna przeglądarki (Browser Caching) dla błyskawicznego ładowania.
5. **SEO i Rich Snippets:**
   - Pełne mikrodane Schema.org (BeautySalon / MedicalBusiness) – Google natychmiast wie o danych teleadresowych, godzinach i ocenach.
   - Open Graph (dla ładnego podglądu przy udostępnianiu na Facebooku/Instagramie/komunikatorach).
