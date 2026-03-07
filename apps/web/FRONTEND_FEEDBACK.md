## CineMatch Frontend Feedback (`apps/web`)

Bu dosya, CineMatch öğrencisinin `apps/web` tarafında yaptığı geliştirmeler için detaylı bir code review / feedback dokümanıdır. Amaç, hem mevcut yapıyı takdir etmek hem de boilerplate ile mimari uyumu ve sürdürülebilirliği artırmak için iyileştirme alanlarını netleştirmektir.

---

### 1. Kapsam

- **İncelenen alan**: Sadece `apps/web` tarafı.
- **Odak noktası**: `features/movies` ve bu feature’ı kullanan `features/dashboard` (yeni CineMatch ana deneyimi).
- **Boilerplate bağlamı**: `features` klasöründeki tüm feature’lar bu projeye ait değil. `companies`, `projects`, `audit-logs`, `demo` vb. dosyalar ana boilerplate’in örnek SaaS modülleri; öğrenci çalışması esas olarak `movies` etrafında.

---

### 2. Güçlü Yönler

- **Net feature ayrımı**: `features/movies` altında sayfalar (`pages`), bileşenler (`components`), hook’lar (`hooks`), tipler (`types`), sabitler (`constants`) ve query tanımları (`queries`) ile domain’e göre anlamlı bir modüler yapı oluşturulmuş.
- **Kullanıcı deneyimi**:
  - `Navbar` + mobil bottom navigation ile hem desktop hem mobile için tutarlı bir navigasyon deneyimi sağlanmış.
  - `HeroSlider` ve `MovieCard` görsel olarak güçlü, modern ve ürün kalitesinde bir arayüz sunuyor.
  - Mood seçimi, süre filtresi, “Senin İçin Bulduklarımız” grid’i, profile sayfasındaki kategoriler (izleyeceklerim, izlediklerim, puanladıklarım) kullanıcı açısından anlaşılır ve motive edici.
- **Veri yönetimi ve cache kullanımı**:
  - TanStack Query ile TMDB istekleri cache’leniyor.
  - `useMovies` içinde optimistic update ve `localStorage` kullanımı ile hızlı geri bildirim veren bir etkileşim deneyimi sağlanmış (watch, rate, watchlist).
- **Tip güvenliği**:
  - `features/movies/types/index.ts` yeterince detaylı; `Movie`, `MovieDetails`, `MovieInteraction`, prop tipleri ve hook opsiyon tipleri düzgün tanımlanmış ve kullanılmış.

---

### 3. Boilerplate ile Mimari Uyum

#### 3.1. Public API (`index.ts`) yapısı

- Boilerplate örneği (`features/projects/index.ts` vb.):
  - Feature’lar için net bir public API yüzü var: `pages`, `hooks`, `queries`, `schemas`, `columns`, `components`, `types` tek bir `index.ts` üzerinden export ediliyor.
- Mevcut `features/movies/index.ts`:
  - Sadece belirli dosyaları export ediyor (`hero-slider`, `mood-button`, `movie-card`, `constants`, bazı hook’lar, `explore-page`, `movie-queries`, `types`).

**İyileştirme önerileri**

- `movies/index.ts` dosyasını diğer feature’larda olduğu gibi daha tutarlı hale getirmek:
  - Örneğin:
    - `export * from './pages';`
    - `export * from './hooks';`
    - `export * from './components';`
    - `export * from './queries';`
    - `export * from './types';`
- `Dashboard` veya başka yerlerde mümkün olduğunca bu public API üzerinden import yapmak (deep import yerine), böylece feature boundary daha net olur ve ileride refactor yapmak kolaylaşır.

#### 3.2. Route / sayfa isimlendirmesi

- `features/dashboard/index.tsx` şu an tamamen CineMatch ana deneyimine (movies) göre tasarlanmış. Eski SaaS dashboard konseptinden kopmuş durumda.

**İyileştirme önerileri**

- Bu repository tamamen CineMatch’e evrilecekse:
  - `Dashboard` ismini daha domain-spesifik bir isme (`MoviesDashboard` gibi) taşımak düşünülebilir.
  - Route yapısını sadeleştirip sadece CineMatch ile ilgili path’leri barındıran bir yapı kurmak (`/discover`, `/popular`, `/profile` gibi).
- Eğer hem SaaS hem CineMatch aynı repo içinde yaşamaya devam edecekse:
  - Bu iki dünyanın route ve layout seviyesinde daha net ayrılması (farklı root layout’lar, farklı navigasyonlar) uzun vadede kafa karışıklığını azaltır.

---

### 4. Hook’lar ve State Yönetimi

#### 4.1. `useMovies` hook’unun sorumlulukları

`features/movies/hooks/use-movies.ts` şu anda çok fazla sorumluluk üstleniyor:

- Discover listesi + pagination:
  - `discoverResponse`, `isDiscoverLoading`, `isDiscoverFetching`
  - `discoverPage`, `setDiscoverPage`, `discoverTotalPages`
- Kullanıcı etkileşimleri:
  - `interactions`
  - `watchedMovies`, `ratedMovies`, `watchlistMovies`
- Kategori listeleri:
  - `trendingMovies`
  - `topRatedMovies`, `upcomingMovies`, `popularMovies`
- Optimistic update ve `localStorage` persistence:
  - `updateInteractionOptimistically`
  - `handleWatchToggle`, `handleRate`, `handleWatchlistToggle`

Boilerplate’te genel yaklaşım:

- Data fetch etmek için daha odaklı hook’lar (`useProjects`, `useCompanies` gibi).
- UI state için context/store (Zustand, React Context).
- Mutations ve optimistic update davranışları daha net izole edilmiş.

**İyileştirme önerileri**

- `useMovies`’i daha küçük, amaca özel hook’lara bölmek:
  - `useDiscoverMovies(mood, maxDuration)` → sadece discover listesi + pagination.
  - `useMovieInteractions()` → `interactions`, `watchedMovies`, `ratedMovies`, `watchlistMovies`.
  - `useMovieCategories()` → `topRatedMovies`, `upcomingMovies`, `popularMovies`, `trendingMovies`.
  - `useMovieMutations()` → `handleWatchToggle`, `handleRate`, `handleWatchlistToggle` + optimistic update.
- Sayfalar sadece ihtiyaç duydukları slice’ı import eder:
  - Örneğin `ProfilePage` sadece `useMovieInteractions` ve `useMovieMutations`’ı kullanabilir.
  - `ExplorePage` ise `useDiscoverMovies` + `useMovieCategories` kullanabilir.

Bu hem okunabilirliği artırır, hem de gereksiz query’lerin tetiklenmesini engeller.

#### 4.2. `GenreRow` içinde `useMovies` kullanımı

- `GenreRow` bileşeni (`components/genre-row.tsx`) sadece şunlara ihtiyaç duyuyor:
  - `interactions`
  - `handleWatchToggle`, `handleRate`
- Şu an `useMovies` hook’unu çağırdığı için teorik olarak:
  - Discover sorgusu, kategori sorguları vs. da bu bileşen monte edildiğinde birlikte ayağa kalkabiliyor (React Query cache ile çoğu durum yönetiliyor olsa da mental model karmaşıklaşıyor).

**İyileştirme önerileri**

- `GenreRow`’u sadece interaction odaklı küçük bir hook ile beslemek:
  - Örneğin `useMovieInteractions` + `useMovieMutations` gibi.
- Böylece `GenreRow`’un sorumluluğu “bu genre’daki filmleri getir ve interaction’ları uygula” ile sınırlı kalır; global discover/pagination state’ine dokunmaz.

#### 4.3. Zustand store (`useMovieStore`)

- `stores/useMovieStore.ts` içinde:
  - `mood`, `maxDuration`, `activeTab`, `selectedMovieId` ve `reset` fonksiyonu var.
- Basit, anlaşılır ve boilerplate’teki context/store yapılarıyla uyumlu.

**Küçük iyileştirme fikri**

- `reset` şu anda:
  - Mood ve süreyi sıfırlıyor.
  - `activeTab`’i her zaman `'discover'`’a çekiyor.
- Bazı durumlarda (örneğin kullanıcı `movies` tab’ında iken sadece filtreyi sıfırlamak istediğinde) daha esnek bir `reset` gerekebilir:
  - Örneğin `reset({ keepActiveTab: true })` gibi opsiyonel parametrelerle daha granular bir kontrol düşünülebilir. Şu an için zorunlu değil, ileride UX ihtiyaçlarına göre bakılabilir.

---

### 5. TypeScript ve Kod Kalitesi

#### 5.1. Tip dosyası (types) kalitesi

- `features/movies/types/index.ts`:
  - Domain modelleri (`Movie`, `MovieDetails`, `Cast`, `Video`, `MovieInteraction`, `DiscoverResponse`) net.
  - Bileşen ve hook prop tipleri (`NavbarProps`, `GenreRowProps`, `HeroSliderProps`, `MovieCardProps`, `MovieDetailsModalProps`, `MovieRatingProps`, `UseSliderOptions`, `UseInfiniteScrollOptions`, `UseMovieCardProps`, `UseMovieRatingProps`, `SearchPageProps`) iyi ayrıştırılmış.
- Bu seviye, boilerplate’in beklenen tip kalitesini karşılıyor.

#### 5.2. Eksik veya potansiyel sorun çıkarabilecek tip kullanımları

- `useMovieRating` (`hooks/use-movie-rating.ts`):
  - `React.MouseEvent` tipleri kullanılıyor fakat dosyada `React` import’u yok.
- `useMovieCard` (`hooks/use-movie-card.ts`):
  - Benzer şekilde `React.MouseEvent` kullanımı var ama `React` veya `MouseEvent` tipi import edilmemiş.

Bu, TS config’e bağlı olarak:

- Derleme hatasına,
- Ya da en azından linter uyarılarına sebep olabilir.

**İyileştirme önerileri**

- Bu hook’ların başına uygun type import’larını eklemek:
  - Örnek:
    - `import type React from 'react';`
    - veya `import type { MouseEvent } from 'react';` ve imzalarda `React.MouseEvent` yerine `MouseEvent` kullanmak.

#### 5.3. Kullanılmayan state ve basitleştirilebilecek kodlar

- `useMovieCard` içinde:
  - `isImgLoaded` state’i set ediliyor fakat şu an UI’de hiçbir yerde kullanılmıyor.
- Bu, muhtemelen ileride blur/fade-in animasyonu için düşünülmüş ama tamamlanmamış bir parça.

**İyileştirme önerileri**

- Ya gerçekten `isImgLoaded`’i `MovieCard` içinde bir loading skeleton / blur kaldırma davranışına bağlamak,
- Ya da kullanılmıyorsa state’i tamamen kaldırmak. Boilerplate prensibine göre “ölü” state ve prop’ların bırakılmaması tercih edilir.

---

### 6. API / Config ve `.env` Uyumu

- `apps/web/src/lib/tmdb.ts` içinde:
  - Hem `VITE_TMDB_API_KEY` hem `VITE_TMDB_TOKEN` destekleniyor.
  - Token varsa `Authorization: Bearer <TOKEN>` header’ı kullanılıyor, yoksa `api_key` query param’ına düşülüyor.
- Son commit’lerden birinde:
  - `.env.example` içinden `VITE_TMDB_TOKEN` kaldırılmış; ancak kod hâlâ bu env değişkenini okuyor.

Bu durum, projeye yeni gelen biri için kafa karıştırıcı olabilir:

- “Token gerekli mi, opsiyonel mi?”
- “Sadece API key yeterli mi?”

**İyileştirme önerileri**

İki net seçenek:

1. **Sadece API key ile ilerlemek istiyorsak**:
   - `tmdb.ts` içinden token ile ilgili tüm mantığı kaldırmak.
   - Her yerde API key üzerinden giden tek bir yol bırakmak.

2. **Hem token hem API key opsiyonel olarak desteklenecekse**:
   - `.env.example` içine `VITE_TMDB_TOKEN`’ı geri eklemek.
   - Dosyada kısa bir açıklama eklemek:
     - “Token varsa Authorization header üzerinden kullanılır, yoksa API key query parametresi kullanılır” gibi.

Bu sayede config davranışı daha öngörülebilir ve self-documented olur.

---

### 7. UI / UX ve Bileşen Tasarımı

#### 7.1. Navbar ve mobil bottom navigation

- `Navbar`:
  - Scroll olduğunda arka plan ve border değişimi ile güzel bir “elevation” hissi veriyor.
  - Search bar’ın genişleyip daralması modern ve anlaşılır.
- Mobil bottom navigation:
  - Tab yapısı (`discover`, `movies`, `popular`, `profile`) net ve ikonlarla desteklenmiş.

Bu kısım boilerplate’in sağladığı UI/UX standartlarını yakalıyor, hatta üzerinde.

#### 7.2. `MovieCard` ve `MovieDetailsModal`

- `MovieCard`:
  - Hover overlay, rating badge, yıl bilgisi, açıklama gibi alanlar kullanıcıya yeterli sinyal veriyor.
  - `useMovieCard` ile tıklama ve watch toggle davranışlarının ayrıştırılması güzel bir adım.
- `MovieDetailsModal`:
  - TMDB’den gelen detay + cast + video bilgilerini zengin bir şekilde gösteriyor.
  - İzleme listesi ve izledim/izlemedim butonları ile modaldan etkileşim mümkün.

**İyileştirme önerileri**

- Trailer autoplay davranışı:
  - Şu an modal açılır açılmaz Youtube trailer otomatik oynatılıyor (sessiz ama autoplay var).
  - Bazı kullanıcılar için bu agresif olabilir, özellikle mobilde veya düşük bağlantı hızlarında.
  - Daha kontrollü bir deneyim için:
    - Başta static backdrop/poster gösterip,
    - Kullanıcı `Oynat` butonuna tıkladığında trailer’ı embed eden bir akış düşünülebilir.

#### 7.3. Tekrarlayan grid ve liste pattern’leri

- `ExplorePage`, `PopularPage`, `ProfilePage`, `GenreRow` gibi yapılarda:
  - Benzer grid layout’lar ve boş state pattern’leri tekrar ediyor.

**İyileştirme önerileri**

- Küçük ortak layout bileşenleri üretmek:
  - Örn. `MovieGridSection`:
    - Başlık (`title`),
    - Opsiyonel ikon,
    - Çocuk olarak `MovieCard` listesi,
    - Boş state mesajı.
- Bu sayede:
  - Hem kod okunabilirliği artar,
  - Hem de ileride bir tasarım değişikliğinde tek noktadan güncelleme yapma imkânı doğar.

---

### 8. Hata Yönetimi ve Boş State’ler

- Çoğu sayfada loading state var (`RefreshCcw` spinner’ı ile), fakat:
  - TMDB istekleri hata verdiğinde kullanıcıya özel bir hata mesajı gösterilmiyor (boş listeler üzerinden dolaylı anlaşılabiliyor).

**İyileştirme önerileri**

- TanStack Query içinden `isError` ve `error` bilgilerini alıp:
  - Örneğin `ExplorePage` ve `PopularPage` üzerinde bir “Hata kartı” göstermek (yeniden dene butonu ile).
- En azından:
  - “Şu anda filmleri getirirken bir hata oluştu, lütfen daha sonra tekrar deneyin.” gibi genel bir mesaj + loglama.

---

### 9. Somut Önerilen İyileştirme Adımları (Özet Checklist)

Uygulanabilir küçük adımlar halinde bir özet:

1. **`movies/index.ts`’i standardize et**  
   - Diğer feature’lar gibi `pages`, `hooks`, `components`, `queries`, `types` export’larını toparla.  
   - `Dashboard` ve diğer tüketen kodları mümkün olduğunca bu public API’dan import edecek şekilde güncelle.

2. **`useMovies` hook’unu böl**  
   - Discover, interactions, categories ve mutations için ayrı hook’lar tanımla.  
   - `ProfilePage`, `ExplorePage`, `PopularPage`, `GenreRow` gibi bileşenleri sadece ihtiyaç duydukları slice’ı kullanacak şekilde sadeleştir.

3. **TS type importlarını düzelt**  
   - `use-movie-card.ts` ve `use-movie-rating.ts` içinde `React.MouseEvent` için uygun type importlarını ekle.  
   - Kullanılmayan state (ör. `isImgLoaded`) gerçekten kullanılmayacaksa kaldır.

4. **TMDB config davranışını netleştir**  
   - `.env.example` ile `tmdb.ts`’i tekrar senkronize et:  
     - Ya sadece API key,  
     - Ya da hem token hem key’in nasıl kullanılacağını kısa bir yorumla açıkla.

5. **Hata state’leri ve autoplay ince ayarı**  
   - `ExplorePage` / `PopularPage` / `MoviesPage` / `ProfilePage` için basit bir error UI ekle.  
   - `MovieDetailsModal`’da trailer autoplay davranışını kullanıcı aksiyonuna bağlamayı düşün.

Bu adımlar uygulandığında:

- Kod yapısı boilerplate ile daha tutarlı olacak,
- Hook ve state yönetimi daha okunabilir/parçalı hale gelecek,
- Yeni gelen bir geliştiricinin projeyi anlaması ve genişletmesi çok daha kolay olacaktır.

