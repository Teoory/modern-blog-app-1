🚀 Yepyeni bir proje geliştirme aşamasında! Blog dünyasına adım atmak için heyecan verici bir fırsat geliyor! Yakında herkesle paylaşacağım, takipte kalın!

💡Artık yorum yaparak writer olabilir ve kendi bloglarınızı oluşturarak Master Writer'lığa giden yolda ilk adımı atabilirsiniz. Eğlencenin tadını okuyarak çıkarabilirsiniz! ✍️📖


Dilerseniz Youtube'dan videolara ulaşabilirsiniz.
<br/>
[Playlist](https://youtube.com/playlist?list=PLR_-EKc5hBrEuh7I2JvghWuuaxa6XbCNj&si=a7IW0qtQxUpKbO8t)

<br/>
<hr/>
Check this board: `Daha detaylı bilgi istiyorsanız burayı inceleyebilirsiniz.`
  
- [Trello](https://trello.com/b/VMTJJehJ/fiyasko-blog)
<hr>
Total code lines: https://api.github.com/repos/Teoory/modern-blog-app-1/languages
<hr>

*Need to add Mongodb server link*
</br>edit this line api->index.js
</br>↓
```sh
mongoose.connect('mongodb+srv://username:password@cluster0.hd2atfr.mongodb.net/?retryWrites=true&w=majority');
```
<hr>

# Son Değişiklikler:</br>
### V1.7.4
- Mobile Responsive
  - Mobil görünümde navbar yerine ekranın alt kısmına butonlar yerleştirildi.
- Bazı stlye hataları giderildi

#### -----------

### V1.7.3
- Hatalar giderildi
  - Yorumlarda oluşan hata giderildi
- Email verification görnümü güncellendi

#### -----------

### V1.7.2
- Hatalar giderildi
  - gereksiz endpointler kaldırıldı (Frontend)
- Profil pagedeki email onaylama style güncellendi

#### -----------

### V1.7.1
- Backend
  - 6 haneli rastgele kod oluşturuluyor
  - kodu mongoya gönderme eklendi
  - usermodele isVerified ekllendi
  - oluşturulan kod nodemail ile mail olarak gönderiliyor
- Frontend
  - Profilde emailin onaylanıp onaylanıp onaylanmadığı görülebilir

<hr>

### V1.6.1
- Dovizdeki değişim oklarına dropShadow eklendi
- Aside bölümüne En Beğenilen eklendi
  - Likes ve GhostLikes toplamı en yüksek olanı gösteriyor
- Ticket sistemi eklendi
  - /createticket ile ticket oluşturma sayfasına gidiliyor
  - /ticket ile inceleme sayfasına gidiliyor (Sadece admin)
  - /tickets/:id ile istenene ticket kontorol edilebilir
  - /ticket artık herkesin kullanımına açıldı kullanıcılar ticketlarını inceleyebilirler
  - Başka kullanıcının ticketına girmeye çalışılırsa “yetkin yok” uyarısı çıkıyor
- /settings eklendi
  - Tema değişimi ve Ticket sistemi settings e taşındı

<hr>

### V1.5.1
- BackEndPostTags eklendi
  - Sunucu tarafından /posts/:postTags ile tagdeki postlar görüntülenebilir.
  - /availableTags ile kullanılabilir taglar incelenebilir.
- FrontEnd işlevleri eklendi
  - Postlara etiket ekleme.
  - Posttaki etkiketi düzenleme.
- Anasayfa görünümü
  - Postların hangi etikete sahip olduklarını gösteriyor.
  - Tag filtreleme eklendi. Sadece seçilen tagdeki postların gösterimini sağlıyor.
  - Filtreyi temizleme butonu eklendi.
  - Tüm postlar kısmına görünüm değiştirme butonu eklendi. Grid ve Flex görünüm arasında geçiş yapabilirsiniz.

<hr>

### V1.4.2
- Hatalar giderildi
  - Beğenilen bloglarda beğeni butonunun arka plan rengi mavi kalıyordu düzeltildi artık sayfa yenilense bile beğenmişse turuncu oluyor
- Yorumlara kullanıcıların avatarları ve etkileşimi eklendi
- Aside responsive sınırı arttırıldı
- Tanıtım videoları hazırlandı
- Ufak style güncellemesi
- Navbara doviz eklendi her 2 saate bir verileri güncelliyor
- HomePage güncellendi
  - Artık Son 3 gönderi yatay grid şeklinde sıralanıyorlar diğer gönderliler küçük kutucuklar halinde flex şolarak görünüyor
    

#### -----------

### V1.4.1
- Hatalar giderildi
  - Beğeni ve Super beğeni eklendi artık kullanıcılar istedikleri blogları beğenebilirler
  - profile kısmında boş username girilirse ana sayfaya atıyor
  - post/:id kısmına boş id girilirse ana sayfaya atıyor
- Kullanıcı Profilleri eklendi artık her kullanıcının kendi Profil sayfası mevcut ve herkes tarafından görüntülenebilir
  - kullanıcı "/profile/username" şeklinde
- Profillere kullanıcının Yazdığı Bloglar eklendi artık profiline girdiğiniz kişinin hangi Blogları yazdığını görebilirsiniz.
- Eğer kullanıcı giriş yapmamışsa Profile girmeye çalıştığı zaman login’e yönlendirecek
- Kullanıcı Profillerinde görünen "Son Bloglara" etkileşim eklendi artık kullanıcılar ordaki linkten bloga ulaşabiliyor

<hr>

### V1.3.1
- Hatalar giderildi
  - ipler tekrar localhost olarak güncellendi!
- Yorum yapma sistemi eklendi artık kullanıcıların istedikleri bloglara yorum yapabilirler
- Beğeni ve Super beğeni eklendi artık kullanıcılar istedikleri blogları beğenebilirler
  
<hr>

### V1.2.2
- Hatalar giderildi
  - Profil Photo Backend tarafından sürekli istek atıyordu ve siteye ilk kez giriş yapan kişiler serveri patlatıyordu bu sorun ortadan kaldırıldı
  - previevPage silinirken oluşan hata sorun düzeltildi
- NavBar ve ProfilPage style güncellendi
- DarkMode artık hesabınızla eşleşiyor ve giriş yaptığınızda en son hangi modda bıraktıysanız o moda geri dönüyor
  - Giriş yapmayan kullanıcılar sayfayı yeniledikleri zaman otomatik olarak default’a geçiyor (Aydınlık tema)
- /Test Back End tarafında oluşturuldu
- AdminPage’deki approveBlog kısmı için kaç tane istek olduğu gösteren bir alert box eklendi
  - Eğer hiç istek yoksa alert göstermiyor
- local ip değişti artık localhost:3000 yerine 192.168.1.3:3000

#### -----------

#### V1.2.1
- Bazı Hatalar giderildi
- /previevPage onaylama fonksiyonu oluşturuldu. Artık writer yetkisine sahip kullanıcıların blogları /previevpage bir admin, moderator veya editör onay verirse /postpage e gönderiliyor ve herkesin erişimine açılıyor.
- deletePost fonksiyonu oluşturuldu. Artık admin ve moderator istedikleri blogu silebilirler.
- Genel style güncellemesi
- Search Area (BUG!)
- Ads Area
- Navbar style güncellemesi
- butonlar düzenlendi yazmaya başla ve keşfet dropdownları eklendi
- Dark/Light mode eklendi
- Test sistemi için önizleme oluşturuldu fakat bütün işlevler elde girildi bunlar textAreaya bağlanacak soruları buradan çekecek ayrıca kaç sayı girilirse sorunun altına o kadar cevap seçeneği koyacak ve bütün cevaplara puan ataması yapılabilecek

<hr>

### V1.1.3
- Hatalar giderildi
- Admin Sayfası tekrar güncellendi
- yeni yazarların blogları artık /previev kısmına gidiyor ayrıca blog yazarken /createPreviev kısmından blog yazıyorlar
- /previevPost sayfasına onaylama kutucuğu eklendi fakat işlevi henüz çalışmıyor
- SERVER kısmına /search/:keyword eklendi front-end tarafına işlenmesi gerekiyor backend düzgün sonuç veriyor
- Server kısmına /tags eklendi bu sayede kişilerin aktif üye listesine ve taglarına ulaşılabiliyor, ayrıca /tags/:tag sayesinde hangi tag de kimin olduğu görülebiliyor (örnek: /tags/admin)
- Ufak görsel iyileştirme, Quill-snow Sisteme tamamen entegre edildi

#### -----------

### V1.1.2
- User Taglar eklendi
  - Admin, Moderator, Editor, Master-Writer, Writer, Uye
- Admin sayfası güncellendi
  - Kullanıcı listesi, Kullanıcılara Yetki verme, Sitedeki Alert mesajını düzenleme
- Kullanıcı Profili güncellendi
  - Artık her kullanıcı profil resmi ekleyebiliyor, eski resimler güvenlik amacıyla kaydedilecek
- Sitedeki Alert mesajı MongoDBya entegre edildi artık MogoDBdan ulaşılabilir.

<hr>

### V1.0.2
- Routes ayarları güncellendi
  - AppRoutes, DefRoutes, PrivRoutes
- Sayfa stilleri güncellendi
- Aside eklendi
  - Son paylaşılan Blog, Rastgele Blog ve destek butonu bulunmakta!
- Yeni blog yazarkenki editör ayarları güncellendi

<hr>

### V1.0.1 (BETA)
- Blog yazısı paylaşma ve MongoDB ile eşleşme
- Kullanıcı Girişi ve Kayıt olma
- bcrypt.hashSync ile kullanıcıların şifrelerini saklama
- Anasayfa düzeni
  - Anasayfada blogların gözükmesi
- Önceden paylaşılan Blog yazısını Düzenleme sayfası
- Navbar
  - Kullanıcı giriş yapmışsa Blog yazısı aktif olacak ayrıca Profil ve logout için dropdown menu
- Footer
  - Basit yönlendirmeler bulunmakta
- Blog'lara eklenen resimleri yüklendiği formata uygun olarak kaydetme
