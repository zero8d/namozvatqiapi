# Namoz Vaqti API

Namoz vaqtlarini bilish mumkin bo'lgan API. Ma'lumotlar islom.uz saytidan olingan.
Serverga request ni json shaklida jo'nating.

| API Endpoints       | description                                              |
| ------------------- | -------------------------------------------------------- |
| `/api/monthly`      | Bir oylik ma'lumotni obyeklar massivi sifatida qaytaradi |
| `/api/daily`        | Bir kunlik ma'lumotni obyekt sifatida qaytaradi          |
| `/api/present/day`  | Request jonatilgan kun boyicha malumot qaytaradi         |
| `/api/present/week` | Request jonatilgan hafta boyicha malumot qaytaradi       |

| request body element | description                                              |
| -------------------- | -------------------------------------------------------- |
| region               | hudud nomi. masalan: Toshkent, Qo'qon                    |
| month                | oy raqamda 0-12gacha bo'lgan raqam. masalan: 1, 9        |
| day                  | kun raqam bo'lishi kerak. 1-31 gacha. masalan: 1, 15, 31 |

## Example request

[GET] `/api/monthly` endpoint uchun

| Parameter | value       |
| --------- | ----------- |
| `region`  | "Toshkent", |
| `month`   | 9           |

final: `/api/monthly?region=Toshkent&month=9`

[GET] `/api/daily` endpoint uchun

| Parameter | value      |
| --------- | ---------- |
| `region`  | "Toshkent" |
| `month`   | 9          |
| `day`     | 1          |

final: `/api/daily?region=Toshkent&month=9&day=1`

[GET] `/api/present/day` endpoint uchun

| Parameter | value      |
| --------- | ---------- |
| `region`  | "Toshkent" |

final: `/api/present/day?region=Toshkent`

[GET] `/api/present/week` endpoint uchun

| Parameter | value      |
| --------- | ---------- |
| `region`  | "Toshkent" |

final: `/api/present/week?region=Toshkent`

API so'rovlari:

Bugungi namoz vatlarini olish uchun: https://islomapi.uz/api/present/day?region=Toshkent

Shu hafta uchun namoz taqvimi olish uchun: https://islomapi.uz/api/present/week?region=Toshkent

Bir kun uchun namoz taqvimini olish uchun: https://islomapi.uz/api/daily?region=Toshkent&month=4=4&day=5

Bir oylik namoz taqvimini olish uchun: https://islomapi.uz/api/present/monthly?region=Toshkent&month=4

### Author: [Zero8D](https://t.me/Zero_8D)
