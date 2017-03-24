[TÜRKÇE]
===

Basit html şablonlar oluşturmak ve assetleri organize eden 
gulp ortamı

**Yüklenmesi :**
```
git clone https://github.com/Projekod/GulpScaffold.git <dizinadı>
cd dizinadı
npm install
```


**Development :**

```
gulp
```

**Deploy :**

```
gulp deploy
```
*Çıktı dosyaları `dist` klasörü içerisine otomatik olarak yüklenir.*


##Özellikler

* Sass Derleme
* Css Küçültme ve sıkıştırma 
* Image optimize
* Otomatik Versiyonlama
* Javascript küçültme ve sıkıştırma
* Tarayıcıda Anlık değişiklik izleme (browsersync)
* Html dosyaları içinde kullanılmayan sınıfları css dosyasından çıkarma 

##İçindekiler

`src/css/inc` dizini içerisine istediğiniz şekilde kütüphane ekleyip,
`gulpfile.js` dosyası içerisindeki `cssFiles` değişkenine kendi kütüphanelerinizi ekleyebilirsiniz.

şu an üzerinde,
Bootstrap 3 ve Font Awesome kütüphaneleri kurulu geliyor.


`src/css/custom.css` dosyası üzerine sass dışında yazmak istediğiniz native css kodunu yazabilirsiniz.

## Versiyonlama

Her deploy yaptığınızda `*.html` uzantılı dosyalarınız içerisindeki css ve js dosyalarınıza otomatik versiyon hash ekler. 

