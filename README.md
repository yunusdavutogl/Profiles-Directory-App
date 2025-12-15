#  Server for React Native Lab 5

This is a simple Express server that serves as the backend for the React Native Lab 5 project. It provides endpoints to manage a list of profiles.


## Endpoints

- `GET /profiles`: Retrieve the list of profiles.  
  - It accepts 2 query parameters:  
    - `page`: The page number (default is 1).  
    - `limit`: The number of profiles per page (default is 10).   
- `GET /profiles/:id`: Retrieve a specific profile by its ID.  


## Setup

1. Clone the repository.  
2. Navigate to the `ProfilesServer` directory.  
3. Run `npm install` to install the dependencies.  
4. Start the server with `node server.js`.

The server will run on `http://localhost:3000`.

---

# React Native Lab 5 için Sunucu

Bu, React Native Lab 5 projesi için arka uç (backend) olarak hizmet veren basit bir Express sunucusudur. Profil listesini yönetmek için uç noktalar (endpoints) sağlar.

## Uç Noktalar

- `GET /profiles`: Profil listesini getirir.  
  - 2 adet sorgu parametresi kabul eder:  
    - `page`: Sayfa numarası (varsayılan: 1).  
    - `limit`: Sayfa başına düşen profil sayısı (varsayılan: 10).  
- `GET /profiles/:id`: Belirtilen ID’ye sahip belirli bir profili getirir.

## Kurulum

1. Depoyu klonlayın.  
2. `ProfilesServer` dizinine gidin.  
3. Bağımlılıkları yüklemek için `npm install` komutunu çalıştırın.  
4. Sunucuyu `node server.js` komutuyla başlatın.

Sunucu `http://localhost:3000` adresinde çalışacaktır.
