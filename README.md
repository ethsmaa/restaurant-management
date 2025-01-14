# ✨ adimlar

- Docker yuklediginden emin ol
- projeyi klonla `git clone https://github.com/ethsmaa/restaurant-management`
- proje dizinine git `cd restaurant-management`
- Bagimlikliklari yukle
    `yarn install`
- database i baslatmak icin database servisin ayaga kaldir
    `docker compose up -d`
- database migrationlarini uygula
    `yarn migrate`
- uygulamayi baslat
    `yarn dev`

> Not: Bir nedenden dolayi db i bozarsan bu komutla sifirlayabilirsin.
    ```
    docker compose down -v && docker compose up -d
    ``` 

Databasei goruntulemek icin istersen Dbeaver i kullanabilirssin. indirmek icin
```
brew install --cask dbeaver-community
```

DBeaver adli uygulama yuklenecktir. Sonrasinda yeni bir mysql baglantisi ekle ve url kismina

```
jdbc:mysql://localhost:3306?allowPublicKeyRetrieval=true&useSSL=false
```

yazarak baglanabilrisin



