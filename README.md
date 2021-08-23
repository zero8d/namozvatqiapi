# Namoz Vaqti API

Namoz vaqtlarini bilish mumkin bo'lgan API. Ma'lumotlar islom.uz saytidan olingan.
Serverga request ni json shaklida jo'nating.

| API Endpoints  | description                                              |
| -------------- | -------------------------------------------------------- |
| `/api/monthly` | Bir oylik ma'lumotni obyeklar massivi sifatida qaytaradi |
| `/api/daily`   | Bir kunlik ma'lumotni obyekt sifatida qaytaradi          |

| request body element | description                                              |
| -------------------- | -------------------------------------------------------- |
| region               | hudud nomi. masalan: Toshkent, Qo'qon                    |
| month                | oy raqamda 0-12gacha bo'lgan raqam. masalan: 1, 9        |
| day                  | kun raqam bo'lishi kerak. 1-31 gacha. masalan: 1, 15, 31 |

## Example request

`/api/monthly` endpoint uchun

```JSON
{
  "region": "Toshkent",
  "month": 9
}
```

`/api/daily` endpoint uchun

```JSON
{
  "region": "Toshkent",
  "month": 9,
  "day": 1
}
```

### Author: [Zero8D](https://t.me/Zero_8D)
