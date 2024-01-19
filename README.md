*Need to add Mongodb server link*
</br>edit this line api->index.js
</br>↓
```sh
mongoose.connect('mongodb+srv://username:password@cluster0.hd2atfr.mongodb.net/?retryWrites=true&w=majority');
```


# Son Değişiklikler:</br>
#### V1.1.2
- User Taglar eklendi
  - Admin, Moderator, Editor, Master-Writer, Writer, Uye
- Admin sayfası güncellendi
  - Kullanıcı listesi, Kullanıcılara Yetki verme, Sitedeki Alert mesajını düzenleme
- Kullanıcı Profili güncellendi
  - Artık her kullanıcı profil resmi ekleyebiliyor, eski resimler güvenlik amacıyla kaydedilecek
- Sitedeki Alert mesajı MongoDBya entegre edildi artık MogoDBdan ulaşılabilir.

##

#### V1.1.1
- Routes ayarları güncellendi
  - AppRoutes, DefRoutes, PrivRoutes
- Sayfa stilleri güncellendi
- Aside eklendi
  - Son paylaşılan Blog, Rastgele Blog ve destek butonu bulunmakta!
- Yeni blog yazarkenki editör ayarları güncellendi

##

#### V1.0.1 (BETA)
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
