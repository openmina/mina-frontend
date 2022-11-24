import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import Client from 'mina-signer';
import { WebNodeWalletService } from '@web-node/web-node-wallet/web-node-wallet.service';
import { first, forkJoin, map, Observable } from 'rxjs';
import { Payment, Signed } from 'mina-signer/dist/src/TSTypes';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '@shared/constants/config';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';

const STRESSING_WALLETS: any[] = [
  {
    'privateKey': 'EKE44MbKsa8ziitY4uyD8xeATvGMpBw4cM5ZEVUqdZVthJftpeK1',
    'publicKey': 'B62qnKNXqqGR8YXiaPjoBuAvTMXPBKnqQs5LAC3bKbTF3GzxpGsTHRe',
  },
  {
    'privateKey': 'EKFW8eYE2DJdY2vFUS4qGvN8mSUV3uFaxSnY9YtYJm3RZ54iL6sB',
    'publicKey': 'B62qp4iNHj8zDvWDFrCg3hf9UTyo3k1i9EDQAtngmP491QdMM6Fa891',
  },
  {
    'privateKey': 'EKFSg5C3GQS4TYPkWvguGv4J4VQXh84fFnXmNsXrrT7ZzfEy8zWi',
    'publicKey': 'B62qo5Wb2NyNmJ4iy5T2Ds9pTKrFJcWrKf8pJZVK5w6F3paeWhK3oiz',
  },
  {
    'privateKey': 'EKE95f57XyZfUe1bgw7sAo3WAyagzozHVeb8ohUfokmjXVnRsfAb',
    'publicKey': 'B62qqa3Hhq5BGfoSiYfgXdd2Lqj9MjDnsNqFnv7MiPnb8BL5a8yDw6P',
  },
  {
    'privateKey': 'EKEivgSynsTPHVVNiQdojQ5mvxUxVkgDZSMad8TsFSmoHCphPVGg',
    'publicKey': 'B62qrvzrv5AGhiNzqbXNUdV7JH6UWTAMz4inRrmxCETGsJFRABD7Sa8',
  },
  {
    'privateKey': 'EKFUkQxVvJ1DG8YrXFVfRd1vr2uzxjfJGhDqXaBg7iG7ZmqKjfPg',
    'publicKey': 'B62qndRK1W393SFReew9yz7JY67My2opwMurZ97TgrGDPoHkyuvqEVD',
  },
  {
    'privateKey': 'EKEsdD6m8z5LcFyp5iWei6EfLh2b1MdertjY7yvGkg9pgCQwLvvm',
    'publicKey': 'B62qrCxiHQAhxuEnLrWj3esmkB3DQJKuh8SwhNxKTLAD4fSKC4ZAwM7',
  },
  {
    'privateKey': 'EKEjueRPRmWc3WQYgqkWTqHDxQkgNCtYJW29zCvXvrtGkXFJPaVA',
    'publicKey': 'B62qjJBXwwtVpxf8f2FsHTj1RU59pJxmuB3C4Way1caYVqHvdynFh5V',
  },
  {
    'privateKey': 'EKEhNtkVjoDgAaqGxSRDhjcxRkRni11RssoYvtqP9oSasbQ4mvwv',
    'publicKey': 'B62qmyrqBAo9dXAbvRnuK8hni8JkdzKdMxX3gobBpD1m5JB3oGExWez',
  },
  {
    'privateKey': 'EKDveGJuhPwK4DWwNTCEQPe7ZzNNZu82fZdWGVhVVnEJFd48usxM',
    'publicKey': 'B62qq2YgsABNa1JmDzui6cs8yPguKh5yohezFoyUJwth4jb1rjqA8rA',
  },
  {
    'privateKey': 'EKFYvVeGcMhk2cUdoxEjX5gFW95MJm3wfEsHg6iVZLfKYQLMLwdM',
    'publicKey': 'B62qkm9Y5wnWFw6dYQQvwX5TjuvUnMeZrr4breDezdv9u1yU2xhGCjJ',
  },
  {
    'privateKey': 'EKEQLVnmTjgvshUQgK8suvsY3HPpbXPwNeyUMaAv4vHxkZ1keoE1',
    'publicKey': 'B62qquwqduCAHMpjpC3MS5ryUxPSvzek4D2DQNbpzgmfYZ3TDdsQUNs',
  },
  {
    'privateKey': 'EKEXFxw7M2e6Zh2qYi7cRC43jYW9nHcrKPurxrk53bjjUoDjMNqL',
    'publicKey': 'B62qrvB3r7zSDd4Jfhypdt3vn5E4NZGEc1A7AGW56bh8nY3nZNqAAAT',
  },
  {
    'privateKey': 'EKDj9WpNwRzZDBz5qxCwBJL3wpqzoXxYMA7sKExRcmmFTmjV5ria',
    'publicKey': 'B62qkzuEbuetJpDSoGo7c5jVWTp4X6PNDVLHaipAW2SACQpcfbJPQsA',
  },
  {
    'privateKey': 'EKFXmUVpFVvJ15v8iiqYJzsKy8LmYUnAAQSXGZixFLfgDKcS2U2c',
    'publicKey': 'B62qnwcHw2UauaH4tuwuJd9RaEroJQ2GpAdion3ruXxQK4At7jDwiiG',
  },
  {
    'privateKey': 'EKF382tCn2X5YXhvH4vnhSpjtaPHmvtX6MXypyJfmVXY4b6TmVQn',
    'publicKey': 'B62qq37CinpbU3Y1RBvvEiCenCKPUFPDhQBXjSi3bMwkL6N9PKFs3mz',
  },
  {
    'privateKey': 'EKFEU5FBXFkbkutRcXh6WXF23ymRxqrwEVD6BCp46esVWTcy7adW',
    'publicKey': 'B62qkw5aeLa5xDoQmhfaTo4A58RJZjp1VFRfcN5hWM3gY56nYzwxSyB',
  },
  {
    'privateKey': 'EKFSXaE1YsaC8xUoUx7dc6JWm8jeVD7MhDKGskGs7a9rXNwDm2Fq',
    'publicKey': 'B62qijuuEqc8DKLJ7hKo7U6uMmBizCAyyb98XtVy8Wzo6q7xAavcugh',
  },
  {
    'privateKey': 'EKEADop3ZYR9Mqdw5TbqXMT3pPNQKyHvRfPFFxgArixQhsRHB2JP',
    'publicKey': 'B62qmHs3fJZuVzELoAUXJXAAXjMNcRbz8xHn4W5D39vqdocMS8mqfWz',
  },
  {
    'privateKey': 'EKEazMzRXknraiQ343tBynifRrKRZrhf5fhQuHwWhrtgMAHBajMb',
    'publicKey': 'B62qma9E11PkvBvjhh9vXgWHo9LVbVwfXTHNk8WPJgxQ7sJDfAnNvoG',
  },
  {
    'privateKey': 'EKEcGDJoHrQwKacbTTVvnJeHKXJPurmSdJd2WFbcM5rjWeqzH1pq',
    'publicKey': 'B62qroVHmWopgAiDY4jqgmEbSUnqCFmGRkDggFnS86QtNNztn6b5e1a',
  },
  {
    'privateKey': 'EKEoX68GeffUH5nd1xrUiZ9bmbv13yLYBZkaBQL63txowJ8RGq6U',
    'publicKey': 'B62qnR6Jq8ohAfh4UFqJyqFHreRaE5WuBYAfg19Y18dXyhMmjmwQfHL',
  },
  {
    'privateKey': 'EKEvybZapQuHChPDjw2AKkCUGN6a6vNwWUNfwFYqDa2QzBQLCScK',
    'publicKey': 'B62qkoW9HEaNC5jJ9Jgw2S2R4WWzVpNY2WHpybJcEQExqHnXZLFpwNY',
  },
  {
    'privateKey': 'EKEPbKwcU7C8F1B5ggcxkLuE5AvWRTWgLbY3okSmwwG1P1f7s8iQ',
    'publicKey': 'B62qroFm3NMnbakrs8JTr31TsC7Uj7dYwpbjxUr2Ka9x4QumJdMH8Z1',
  },
  {
    'privateKey': 'EKERY3bNtLJUaPhZbpnqjnpktFXqHwaSnE8qYNAnZymU1siBZrYx',
    'publicKey': 'B62qpZPR9GJgrfjwiZJdNqSzDjhh3ABF6QKb9DTY7QMmc5zHniYpkme',
  },
  {
    'privateKey': 'EKFPNT5KyjD5uHHJoNtQjdyjdKUrCCn578VwUjTXGGvjGZT9YWgH',
    'publicKey': 'B62qrghkDasFryuYFFhT7mk14RgkG2HzECeHFt1eoSfzAswHhyBL2Lq',
  },
  {
    'privateKey': 'EKFEZ6b2HUM2UU9CfWPrLLX8yRLoYomDKo3zaZS8Tv5LXqaWUnPL',
    'publicKey': 'B62qniUPfkeWY73s6kz9iQPDdZGKuf69Exiym47Wujktrau2S9vUrzj',
  },
  {
    'privateKey': 'EKELsbug7Kawe1X6qYrdYyb3a4PBzRQs9kZTJzvgo88jZ7431tKV',
    'publicKey': 'B62qmdda9AWKc6hQ8qFDbiam8Cov8aNtqSo5QGfVHUZWaRJJuD2JPRx',
  },
  {
    'privateKey': 'EKFGKmTaCGxQrpDvQrCTeNs1NdDnvB2mQLjoq2FDc3FK6HytdTBx',
    'publicKey': 'B62qmW7XdnPJakm7mxJ7S7EjcbmUhYJfwRkzQmC4U9UBuQDzptt3NBX',
  },
  {
    'privateKey': 'EKEkP1Pw8NzGJfwU7q1rWALHGZ2M3mutndNj1awbY1D17Znj23cm',
    'publicKey': 'B62qoX31dagDBwEUkGJnCyn4mxszj6mr8Pvpw3SMvqSPJigyFS1NSbe',
  },
  {
    'privateKey': 'EKF5fyFD41NiPorrNr617sKBMddGu4Fw9ay2wiXh6yHCTCasGkTd',
    'publicKey': 'B62qpGyhJRWPUGXbGiCibkK7fMU2WTTQzRbEYgUNMiWt5NE5xHfsioE',
  },
  {
    'privateKey': 'EKDzfyD4pMznDmHxWFVnzsxVudAKTdL294dt9uVtZM8hEZpNCdsN',
    'publicKey': 'B62qoVWU19WRwW3G8NaRjrvdwrq4xgVaYfjXbnXJVyu3wJ6NayVEBGn',
  },
  {
    'privateKey': 'EKDpiJ1xEZk49TrM5rRoKNKjbKveL3Ua3iBFjXNa533RfdwH4D7z',
    'publicKey': 'B62qrXvaa5EQrLnAdcRffqHFExzgR1rRpvp7v7jgZ5jN8mQPGWUxSxB',
  },
  {
    'privateKey': 'EKFTviJYJYCxeh1TrmSwffr9vaZvcTtJMccFiCJpXRwTN445eUbG',
    'publicKey': 'B62qq84FmVKsU4oatAi7PPFgeniwA5ksXErGuKXHTSrbRMoWWUvxgHA',
  },
  {
    'privateKey': 'EKER43NcqpXjRsL6zZGPL1j8Vizo2btjeJrsHiYBkWQmZ8KgdJMJ',
    'publicKey': 'B62qnWiAdsCSEm1fukxHYw6PLnwvuqEdg3BEMzPwxisXpEKW17RWUXH',
  },
  {
    'privateKey': 'EKENvZaWErJEsoqHf93U6GKq4CEWrxaTsAPjQ8jAhVW3AR6aR1Sc',
    'publicKey': 'B62qohnjJjeqToSLSS7THuTgr7TYnSGxBgFK6MpLC62vZURyBUdExVS',
  },
  {
    'privateKey': 'EKEUbxRB1Qgt9hD9RB9vr1pPMugtE3QhaZocUXGWZzCCqzSsnpzg',
    'publicKey': 'B62qpgzvyQrmujo7K1HZdLgdVo15tjXC95Gq7SGWTCm17EdJkx8AXAo',
  },
  {
    'privateKey': 'EKE8WSBwmGt5Ysbhj9Si6S4yenD4YxPH9JNWyo7z5LMFnnk1yTDn',
    'publicKey': 'B62qoLbStYC2pcrU4vFcismjpgiy6k4rje4ixuoWZHSGcwBq3dGf83E',
  },
  {
    'privateKey': 'EKE5bgHKwgr7Yb2YMznmYStLMa2JinpSXYzcjHKRY6ogsWtXNxeC',
    'publicKey': 'B62qqMNJ91jvnQ22qAdd3yviTAmr4YZkHKjatK3BPUzvQ9u17Xsy33X',
  },
  {
    'privateKey': 'EKE3uMMM5ZikV33ZVMCmGxPZ3eFzddAVessqbztZ4xmWShK9hZXp',
    'publicKey': 'B62qke4CZDLziEUMaBzwpZDxKzqy5fYTAJfvrMxZ95YjBKJH6WFM8WZ',
  },
  {
    'privateKey': 'EKFVBKQF2xYQDqAxsnzLmDKUoSrZYZAgUHLhkUqL5L1iZ9BohUYr',
    'publicKey': 'B62qiZYg78QaipAerYesr6S5Gyp9qAzYSiVaBiQQmTP2zS5j4pV5uzg',
  },
  {
    'privateKey': 'EKEU5MWdoiGs9zPCiAtWUbZFQHnE18aLF8k8FXFWfCpTL5Mq7tvq',
    'publicKey': 'B62qroD86tXYRsy5Q188fddcFoxGXkRwM5majQB9T1W6AWQqYaRwEtY',
  },
  {
    'privateKey': 'EKEi7gVHVvc7c9zBZQkvH4ZWebbKWupAWu9kxKvB7W9LGh45F3Wc',
    'publicKey': 'B62qjcnekFYBpAMKYxLtHka36xns6Yc4piUQXoSHsXMjAJ1uyDGtRue',
  },
  {
    'privateKey': 'EKDk7xcdJCneaFDdSSEM1gu5h6nJwkTn5jKEJCQ747yaF1EjHTmE',
    'publicKey': 'B62qn4brPfsKQUPBMb3XPtft8zjnfXQifZG6oiDJwZxCj9hjj11WHad',
  },
  {
    'privateKey': 'EKFP6iPrWN1n1Rrz3nNojK6q3FDhvQagAstLXpjXeGiJ7gL4ehWN',
    'publicKey': 'B62qj1FpTBETsRYusJ2HsUmWzihJAWFqnJuhyZ9Er6CffyJHeLLuayY',
  },
  {
    'privateKey': 'EKFXPnnc9T3KWc3HwfRHc8WP15sGg5wdGS3JzhbDfnVzvCGMM8wd',
    'publicKey': 'B62qoBwsNnZ3DnFAQCwFFGy18N31BufmKUQQ2Meb8kRK2SFLNv65qPJ',
  },
  {
    'privateKey': 'EKF5dcJ6yv3Dkda8aztvXRHRE2Cxsjfwo3Azm8DyeDrNfwbU8vL4',
    'publicKey': 'B62qo53mMXrcq5u2Z5y66f4SpWzRewh5aAwGCLPV7DUu7JAmuKqJ7pV',
  },
  {
    'privateKey': 'EKFZPseR583Uyd7kjNdxeRnFzVCNx8rcaNF2eRtmj3yyeAEMTu9d',
    'publicKey': 'B62qntGSB8eG4auDaVrjspsM2Sp1zKn4nXHyXxxAs6AbeiaeDFS1rvb',
  },
  {
    'privateKey': 'EKFKGxmaHjnzuESKC6CRf6ECAGFdcY7tp1wSXCcdVp1FbvCEVU9U',
    'publicKey': 'B62qr1C6SsvGfT8TVnBgbC7D3m6fqn28NjNzS5Y7A3M9nFLTWGmup35',
  },
  {
    'privateKey': 'EKDxbKkjYqx6fu2hUTYm66Na6N6A8Ay5nUjPqqGpdh3bmnD4ChZC',
    'publicKey': 'B62qrqVAYCVVTSmUnPzfBt9oHcppJY4nm6rTsik3c1BES2PXr7ew8de',
  },
  {
    'privateKey': 'EKFKYBJzh6hHS6B6pgDwwKa8Qp2siJUC3fVa32GaW45UpahKPNKx',
    'publicKey': 'B62qm6sxCs1UDg1G5yAVC1JjS3eMU8UStACVbadoAiXQ4ErRRuPAWSu',
  },
  {
    'privateKey': 'EKFALJZnYoVqyADhneBxdyicCBdJhaFiBDaLFZUE1CRzpMYhAkBU',
    'publicKey': 'B62qqaRZbJEFqFmkBwp8FB5rf836nVrGcy5JSgcyvELDj5qUZaqd81p',
  },
  {
    'privateKey': 'EKF2KaZK3Y3zHj4qubQrQc9Y2cqKh2cdQQkby7nE3UgfJuLxowK1',
    'publicKey': 'B62qp1jgJX9aviXRuLbMdTYERjNf47KCCumjYDZsUq8Wwzhmot9s1dF',
  },
  {
    'privateKey': 'EKEHF4zYdpxkjV6udk7CiiJv15d3s116AA9fznETnFq7JQbr9r3q',
    'publicKey': 'B62qoe36Kr29nhitT8uMZFmi2YMxjtifKYF3twmtXTMGVvLc5DmxHfA',
  },
  {
    'privateKey': 'EKDsimyYwX889tJSkpSNBQJbHHf37ep3f5gTFoPyYydXRu7qZWE1',
    'publicKey': 'B62qm11s8Md9wwaRa6Jy2d1ZNFXhLRuV96HML6k8et4Z1xUfFYb3v8G',
  },
  {
    'privateKey': 'EKFVYcdNhMTyaR93j65omxiAkz5wDt27tTiXbRPVSfF53RneXTYa',
    'publicKey': 'B62qitdvtGZ8gunJovysN1HB8wMEBquQcAH35g78354qGhML69RTABM',
  },
  {
    'privateKey': 'EKErGEVnXsLBk5peP4nHQ6btTiervrnvyhfZwbnUt7itHEdzkYLY',
    'publicKey': 'B62qoCyLiJZWUFpmMK5YgQQasgR6ikmX7mbW9TdRKGLuhdETTBrUdZz',
  },
  {
    'privateKey': 'EKFLDhvEFwQ3pJjXbP9rK6JbSf8VhmCKc5ycRLRMSoMKeKrfsJ7A',
    'publicKey': 'B62qpBem5M1xSaQi2KxxEXfKhwJAS3HHQ7f7Q66vD1Zf3BCgAiN3Xc6',
  },
  {
    'privateKey': 'EKFaKmq7yCT6TFtfhJzBzmdFsLd9rpaEWDRWGL5drCJZBPDAafw3',
    'publicKey': 'B62qngs2UkCNL9KovydfaWDAhGfiDTMGBDswd2aejuMWLWtaz8iWcEZ',
  },
  {
    'privateKey': 'EKEwHWeQXYtLhsX6cfLHu9D7fn5qnTrCPsoLxjboiEaxtEAmJRik',
    'publicKey': 'B62qismNVgJqRixqxHRcT3fVD69sAjEWV4kvZgKUJPcrA2V8LuVeTXd',
  },
  {
    'privateKey': 'EKDw5TjShzAmh1Mnaq97RMJUzLFUaiKH8k8dpg2itJx3oPX6ytEc',
    'publicKey': 'B62qnJinQiNBKnye8zUnMJwLBUPFnRWTrMe36ASv19mfTrmvihCg8PY',
  },
  {
    'privateKey': 'EKE8QWsvxiD2rycNoAhuFgKph7y2TdAWAfw7o9fQ5zLM2ndsETcd',
    'publicKey': 'B62qpgw1FRK5BV5ev1UdSwM8ehuEzdDwyNhKzL2RrME14zDS3WeqLGP',
  },
  {
    'privateKey': 'EKFbAkao1CYx9VauujR7UibJGN7PGLjmEFWGNeLnFRcDhy2amcrm',
    'publicKey': 'B62qroDXkWydLs9TLnya1eMnF9LufH3NUdVWrNJrcApJFjrQFYn1BBW',
  },
  {
    'privateKey': 'EKEd4brNyeZqTkGNBNkj6SqeTzu9QnreYQQ9GKECLEA1oNQZrfdL',
    'publicKey': 'B62qk1AsMvzrUVy1YeymvMTeoSBUswhpFw3mL4nGG48mHQj9aYNtW6i',
  },
  {
    'privateKey': 'EKF4K32KUNNcPtEKqRgZZERcq42qFSFFSj7jmRHLEA4f9hEKeuya',
    'publicKey': 'B62qjxKGN1Cym5nZMDA6SuHKAMKLVF67REBtXR2FsGxYfd51tTbJp3z',
  },
  {
    'privateKey': 'EKFToYg7Mp4XNsA9WSHsUD9Q2sHrgFrKM6iNCzFNqTQgsNHSbTYQ',
    'publicKey': 'B62qmCC59gEcRuhCcRmYW7wXEvkUPbxE8QRJWhFKyypwYUEoGgXZKk3',
  },
  {
    'privateKey': 'EKEqS57GG6DbdfCoE5Pgq7KZK5gASPfTLrxSR3yJ7PZYMUCd6Ei2',
    'publicKey': 'B62qpYM7mxZ8wsHP4JwKKAf5DCp7uz5UfB8Cc9readeRM8G7MT5AR2f',
  },
  {
    'privateKey': 'EKDyRZ1cXgzRikhipKFHP89UCo8BTkErcYtL2rcFohWzABdMpMe9',
    'publicKey': 'B62qopAFekKTBmCt5pYjK5Mu7QvHUFPUGVEoTSvvLCDciy3oATsJ3Kc',
  },
  {
    'privateKey': 'EKDjUgyDMoehAxR6uYdJn8xZwFxsNshVkRKPdZAjR98CbdyxUCFB',
    'publicKey': 'B62qn8L5CYB9wRLU7gQkRxxNEQFNKoZvNEvgccwLQzX3GKQNpW8PYEd',
  },
  {
    'privateKey': 'EKFaRWMy6NitLSjytPy2BN7N5mAkzztBPgFjMsm2sndQfp26pwBn',
    'publicKey': 'B62qqb7ZcYAymMTYQhkZicRZuHNkcnsCZq4NU9JN57So98mdiVduJCE',
  },
  {
    'privateKey': 'EKFLXQfUckrX4ygG1iJB6oYqHKDxeX16jEtPEmQfpHhH6ZKfWkJP',
    'publicKey': 'B62qpCT5ANRuLcugUmAo6bJMnkTGkgAHFEKYJ2NwHJzXVgVRZZTinkJ',
  },
  {
    'privateKey': 'EKFW6AGQaRvmD3imS2NEZDMyhssn638LXSTThdG43bJMp5FUxfVQ',
    'publicKey': 'B62qkCCGGtpk1j63sEkTosGTph3iiDAJuV6KzcYTyXH4AU7XoCFHVc5',
  },
  {
    'privateKey': 'EKE1uTAX5ALQNtVpu7KDezRcMLLgCG8583kmZRpayrpKXxRxVSAQ',
    'publicKey': 'B62qr2puZwRpqxDWideMN4sKoDa7c1Ppkr3jXTg4mXD6GRMLxVDMpdz',
  },
  {
    'privateKey': 'EKECAuP4B1s18oBQ976XfvJ6M75WNTeH8oEEVEFM6zsBMUNJ4zbP',
    'publicKey': 'B62qpUYj4XvWtK4ehHoKh3AHUcCZMUWFMUcwRYeVLqspjRQPH9c3LE8',
  },
  {
    'privateKey': 'EKE4KiKohpheySr6VK6hK5XZVYQCgzDVb5syhQbTaVPupUpQHtTB',
    'publicKey': 'B62qrPcqphPHs6dzwquyRLfjmj5kV7amEWbb7R5cJNxWoE4wkYann3r',
  },
  {
    'privateKey': 'EKEUYyxwn3XtvuDdMdEBWfUgrw8ATFbW4qiNShcSt4Qu2Vb1BPsT',
    'publicKey': 'B62qncFnURfKfgh431BN6zbZ9FZLmqWvBkQjWeo1qawtPMLvMDARpN8',
  },
  {
    'privateKey': 'EKEbsrAfYpqHPeGLbWbpnNJAzESjJRQF93zPfFpq4vDHFNFBadUC',
    'publicKey': 'B62qmkwbAQ53Sew1TvyQ8jpwV8YZHKtL9FHaFbmKS38xFRQpziWrMqD',
  },
  {
    'privateKey': 'EKE72f9S1N8PUFzaFrXysZ4VLxZUnQ1yZRGtFkx47rrLnvZCGYij',
    'publicKey': 'B62qjiW5d4rB8zwYvaLar2zZsERfSBx1X8H5L4ZV2mfpaPhLh2p6sAQ',
  },
  {
    'privateKey': 'EKFbDTBjMu5ynCqMspUJBSPK7JDXTKWVFBEUNkersrNQi2XbjDFT',
    'publicKey': 'B62qppBY3fyjBx4tDJHyppCBAk3ZciNYTN4QXyQ7pkqQmoGG6iNAjJp',
  },
  {
    'privateKey': 'EKEaJrEx3BfA7DKDZ1Yrf4smYQsEBm6nkNRjngqMx2MqT8vRR3QC',
    'publicKey': 'B62qmubBP7hdiaxer67pNbn53rwsBuptpFQweq5K8hLT7UAUHtQJ19J',
  },
  {
    'privateKey': 'EKEMKbdG5DT76jz4CxQ2U9jUTzkrcqfVGYXe7HoFpcXdvPzxiWtG',
    'publicKey': 'B62qkApGThrJs14nry2qycpdGVQjtaz57qvNZafC3u9mm2juPooNpNd',
  },
  {
    'privateKey': 'EKEWSYFGFQo176Z1ev2zmznAeL7HrLmE1d88gx5fBZBW7NwkGnUF',
    'publicKey': 'B62qqb1uzJzzrGnzYUTpCppxnHb4TGJKeCn1Vix3p5AHXHdM3Q6KVE7',
  },
  {
    'privateKey': 'EKEUyqpGdSe6oAAPe6otyKLt9ARvvhMyyyB89X7a268vS4YPDtvp',
    'publicKey': 'B62qmqFtmoa23A1pyx9bPPsKrjKUMchEuTAecAqCYXMMNCVXFqUN61x',
  },
  {
    'privateKey': 'EKFbyxwfp7mhZ8r7x9Vovo8Vabc5ZyStNPTS3LAvK9AZyrDYt8oY',
    'publicKey': 'B62qrvEUXDWd2bbLkx5oAQPEyWMUGAvHrXjFgymqU75Dwh9zzGt8YDp',
  },
  {
    'privateKey': 'EKDnWN45KQUoDUQshkGp2eXo3QWZ8Rwk1cENGD2v6h6JyZJATbmw',
    'publicKey': 'B62qk6HHTGcfhXEX1nP9b5LeejkERrXsT1avu72mJnKpEHonmHxCtbr',
  },
  {
    'privateKey': 'EKEutmXgmwsnCrZQL1TBPYujWAuFbmP4jLqBigLLVfb6LRDqqTU7',
    'publicKey': 'B62qnCULAPAm929JMS9iMF6RHEPNjWhdgbmtuCT7KppovUc3sNuqajc',
  },
  {
    'privateKey': 'EKEBvuDQ8kX82sHzeXvt4vM2igpbCM992MooT4iZpCJkkvCoArzU',
    'publicKey': 'B62qip49bHMh6PqZuLSzdmJF2AKL1rrPLaHP8fJJo1quHGY1KHnTpmn',
  },
  {
    'privateKey': 'EKFS1rGqe76VvuJaUJPaFeDjhEqceLqGcdpUgKy36ZdiF9Nxb1Ww',
    'publicKey': 'B62qjqyzHjgDCDcoK2rfGtAoEixW4rVmQL85dNRRqV4rMEDULz7Sskk',
  },
  {
    'privateKey': 'EKDv3UncPh32W1DsUvNcZ5hhNMEJMr2MnfFyg6uD9b4XFwFcnvUk',
    'publicKey': 'B62qpEo8RjSmP1vqZ5CWsowPRaYpErwHdsyUF41gDpJGmM58bvt9GYX',
  },
  {
    'privateKey': 'EKFWe2Z8cjAYKHDhYhAA2bdB2qkDmfSMr5FhA29U3auH2J9or7vp',
    'publicKey': 'B62qjavRda69rJP3aKB5wbiYoLWWgeN2QzTHkArgKAjuvoWbRVJNJ7r',
  },
  {
    'privateKey': 'EKDwVqnbRhosVUPKEVggWK9oJUQNAYQaZDk49sQL4Zaj7Bg3omSr',
    'publicKey': 'B62qpS86if7m922cN9PBWPw2jXMAF7ZGievuL4tVns754hDg2hee5Wa',
  },
  {
    'privateKey': 'EKF62GZkTjSy4H2vtRdSia69w69FT3izek6cCie8efhEt9B18C8F',
    'publicKey': 'B62qomD5QH3xBbTvEJivnhnRZXSXpgDmBCAXeadUrnnhTXxnMXsrDvd',
  },
  {
    'privateKey': 'EKFDe9k4Pugqy24M4Jbikc4qxnbssXDftwAKy69j947S4HLDFRuH',
    'publicKey': 'B62qpBbaZrwL1A2qzfWjTLtHkvBGBajraEfvMuPdYqHjiBmUfBeN7KF',
  },
  {
    'privateKey': 'EKEpzJDmkrAJSMJ46gcDJDJJ3QCA3S5e7mUtitBHHU6aEEjDgftQ',
    'publicKey': 'B62qrcMEoYZ94yrgtQyBVmPSE62xsFw9JK9oS2ZFSp26GwUqVAhtToG',
  },
  {
    'privateKey': 'EKF999uBykGzyzhErUjESr6Bv8DdXb2kGYoNAYTmwbg2VAgDNy5W',
    'publicKey': 'B62qrmqZdHUAMDdsz654VxVWNUsg9F7Wjoiok2diRnBfBy2VYaSwa1y',
  },
  {
    'privateKey': 'EKFZyUCFsWVV3kHsniXkCheBsveHvWamT2CWZ1HVfRD2ypijzCam',
    'publicKey': 'B62qr8cRVgznpbWxNdJrb6n5ED8JTVYcVkR5NWBVJtQi8tjbPnKjdFm',
  },
  {
    'privateKey': 'EKDvX4UmQeSK4HZs9bEzRzfxtP1ubqGwQUeWfJWcKxi7uViNLX48',
    'publicKey': 'B62qofoDrCebfczCw7csqZnuin5daoircZ1Hvsab3KcaFVKZ3VomtAD',
  },
  {
    'privateKey': 'EKDqLc1PhQ4B2ofkeN8kJjrcZGxchS8QWX1k6CBcK4krQxMhUtiD',
    'publicKey': 'B62qpCwMNnmU9DLqypNFMru13kT2oaLqP7LyFh59LzbBuXAi159CGnS',
  },
  {
    'privateKey': 'EKEedw1ngUniXDb6vLXNxzPcR4SKHcbYRQugJPR7NrP6R1YQ1kYd',
    'publicKey': 'B62qjpYGnaVR71VLxq4ZRrZknh7HKYf7rfFNdV8mDLWoze2cBHvynY9',
  },
  {
    'privateKey': 'EKDxdwfkYRXzyxZTSFFHSGoPi75rxu11KqdSvjXfJN9wPRn9DHjm',
    'publicKey': 'B62qoGahSWoMFpNJMz4bZcERkJgo5Ygdi4nWsUNeYhcXoRReWYvF4Yy',
  },
];

@Injectable({
  providedIn: 'root',
})
export class StressingService {

  private readonly MINA_EXPLORER: string = CONFIG.minaExplorer;

  private wallets = STRESSING_WALLETS;

  private client: Client = new Client({ network: 'testnet' });

  constructor(private http: HttpClient,
              private graphQL: GraphQLService,
              private walletService: WebNodeWalletService) {}

  getWallets(): Observable<StressingWallet[]> {
    return forkJoin(this.wallets.map(wallet => this.walletService.getAccount(wallet.publicKey)))
      .pipe(
        map(response => response.map((r: any, i: number) => ({
          ...this.wallets[i],
          minaTokens: Number(r.account.balance.total),
          nonce: r.account.nonce,
        }))),
      );
  }

  createBulkTransactions(wallets: { from: StressingWallet, to: string }[]): Observable<any> {
    return forkJoin(wallets.map(wallet => this.createTransaction(wallet.from, wallet.to)));
  }

  createTransaction(from: StressingWallet, to: string): Observable<any> {
    const payment: Payment = {
      from: from.publicKey,
      to,
      fee: '1000000000',
      amount: '1000000000',
      memo: '',
      nonce: from.nonce.toString(),
      validUntil: '4294967295',
    };
    console.log({ from, to });
    const signedPayment = this.client.signPayment(payment, from.privateKey);
    return this.sendTx(payment, signedPayment);
  }

  sendTx(transaction: Payment, signedPayment: Signed<Payment>): Observable<any> {
    const variables = getGQLVariables(transaction, signedPayment, true);
    const txBody: string = sendTxGraphQLMutationBody();
    return this.graphQL.mutation('sendTx', txBody, variables);
  }

  getTransactions(): Observable<StressingTransaction[]> {
    const appliedTransactions$: Observable<any[]> = this.http.get<any>(this.MINA_EXPLORER + '/blocks?limit=500')
      .pipe(
        first(),
        map(response => response.blocks.reduce((acc: any, current: any) => [
          ...acc,
          ...current.transactions.userCommands
            .map((t: any) => ({ ...t, status: 'included' })),
        ], [])),
      );
    const mempoolTransactions$: Observable<any[]> = this.graphQL.query<any>('pooledUserCommands',
      `{ pooledUserCommands { ... on UserCommandPayment {
            id
            hash
            fee
            amount
            kind
            nonce
            to
            memo
            from
            feeToken
            failureReason
            token
            validUntil } } }`)
      .pipe(
        first(),
        map((data: any) =>
          data.pooledUserCommands.map((t: any) => ({ ...t, isInMempool: true, status: 'pending' })),
        ),
      );
    return forkJoin([
      appliedTransactions$,
      mempoolTransactions$,
    ]).pipe(
      map((response: [any[], any[]]) => [...response[1], ...response[0]]),
    );
  }

  // createWalletAndAddFunds(): void {
  //   const kp: { privateKey: string; publicKey: string; }[] = [];
  //   for (let i = 0; i < 25; i++) {
  //     kp.push(this.client.genKeys());
  //   }
  //
  //   const keypair = this.client.genKeys();
  //   console.log(keypair);
  //
  //   const final: any[] = [];
  //   forkJoin(
  //     kp.map(
  //       wallet => this.walletService
  //         .addTokensToWallet(wallet.publicKey, 'berkeley-qanet')
  //         .pipe(
  //           map(() => final.push(wallet)),
  //           catchError(e => of(null)),
  //         ),
  //     ),
  //   ).subscribe(r => {
  //     console.log(final);
  //   });
  // }
}

function getGQLVariables(transaction: Payment, signedPayment: Signed<Payment>, includeAmount = true) {
  let variables: any = {
    fee: transaction.fee,
    to: transaction.to,
    from: transaction.from,
    nonce: transaction.nonce,
    memo: transaction.memo || '',
    validUntil: transaction.validUntil,
  };
  if (includeAmount) {
    variables.amount = transaction.amount;
  }
  variables.field = signedPayment.signature.field;
  variables.scalar = signedPayment.signature.scalar;
  for (let pro in variables) {
    variables[pro] = String(typeof variables[pro] === 'undefined' ? '' : variables[pro]);
  }
  return variables;
}

function sendTxGraphQLMutationBody(): string {
  return (`
($fee:UInt64!, $amount:UInt64!,
$to: PublicKey!, $from: PublicKey!, $nonce:UInt32, $memo: String,
$validUntil: UInt32,$scalar: String!, $field: String!
) {
  sendPayment(
    input: {
      fee: $fee,
      amount: $amount,
      to: $to,
      from: $from,
      memo: $memo,
      nonce: $nonce,
      validUntil: $validUntil
    }, 
    signature: {
      field: $field, scalar: $scalar
    }) {
    payment {
      amount
      fee
      feeToken
      from
      hash
      id
      isDelegation
      memo
      nonce
      kind
      to
    }
  }
}
`);
}
