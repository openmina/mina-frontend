import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BenchmarksWallet } from '@shared/types/benchmarks/benchmarks-wallet.type';
import { ConfigService } from '@core/services/config.service';
import { toReadableDate } from '@shared/helpers/date.helper';
import { BenchmarksMempoolTx } from '@shared/types/benchmarks/benchmarks-mempool-tx.type';
import { BenchmarksTransaction } from '@shared/types/benchmarks/benchmarks-transaction.type';
// import Client from 'mina-signer';

const WALLETS: any[] = [
  {
    publicKey: 'B62qrztYfPinaKqpXaYGY6QJ3SSW2NNKs7SajBLF1iFNXW9BoALN2Aq',
    privateKey: 'EKEEpMELfQkMbJDt2fB4cFXKwSf1x4t7YD4twREy5yuJ84HBZtF9',
  }, {
    publicKey: 'B62qrJKtrMJCFDaYTqaxpY5KU1XuwSiL1ZtWteNFKxsmW9xZzG3cYX2',
    privateKey: 'EKEFi6hzC6F3H6gsDMF271ZUGg59cFxEhaWcdd3JazWbgf414T9K',
  }, {
    publicKey: 'B62qrjBnFGr7KRDrMa6XwWpGhdxVNV1NeJptDj2tbzaCTWCjfmUjnNd',
    privateKey: 'EKFDW1oR4xquffCrJdqduYavmMG8KS8EeHWV2kDipvEJiVi9b5oK',
  }, {
    publicKey: 'B62qoGg77bjwPm3kncsjnBChAbeipbotqUCpcGe8FGPbLAJegj6K7od',
    privateKey: 'EKEcgHvJouecpGztiGRjXP5ftY1kpXJ3YmzHSsZA8cs2gB88qhfD',
  }, {
    publicKey: 'B62qos2NxSras7juEwPVnkoV23YTFvWawyko8pgcf8S5nccTFCzVpdy',
    privateKey: 'EKELeJwj9QPxGdwvsjAxmKXvYY2pUaEVE8Eufg5e8LoKCzTBNZNh',
  }, {
    publicKey: 'B62qjW2AZJBc3H17pMvz73JLRLxSdFHjymkzMTTA9sv3bVKSm63B5FQ',
    privateKey: 'EKDvKUAwhdKjeqU4wWD8PNrQNaVBiVGhcpMFeZkFRjsSNiHLppyN',
  }, {
    publicKey: 'B62qrsEWVgwRMJatJzQCrepPisMF4QcB2PPBbu9pbodZRvxWM7ochkx',
    privateKey: 'EKFbTQSagw6vVaZyGWGZUE6GKKfMG8QTX5xoPPnXSeWhe2uaCCTD',
  }, {
    publicKey: 'B62qk8YAtjoJy4EvHeZsjLHX6GRkJTi6cBcksa4i3YKuqzMAfRpW5wD',
    privateKey: 'EKDhaEurqVTbuGRqrVe2SYZwrsnaQewLCQQS5PitEAdXxcG6vB2i',
  }, {
    publicKey: 'B62qmrqiRDgVjJgrEFvSUdANT5wYiZZvLLMk3Kt6tJ6ZYvnbJ7tAccf',
    privateKey: 'EKE9TGDciVh6v7Dj8L8kN5pCXVbQ193i75UGpyxcvRB39rQBQuGd',
  }, {
    publicKey: 'B62qqPz9DfFwDNJP4e2GPpb5aQ7gibaXAwcsLAyQhTb14gExwXCJypD',
    privateKey: 'EKEUvmfp8QdpKYhg6xmjwGyZuJSU5RJ8kihM39F63bwao3tL3dXi',
  }, {
    publicKey: 'B62qjWp1iFZF23RtfW9tEtaF92hgGYR3x2VxWyzSHYC7sXdSD8Hqfmj',
    privateKey: 'EKDz57VhBK6ZJyN86SrLsAi26chMwWB6qRfWQi6ehSyX5mV4XcRP',
  }, {
    publicKey: 'B62qkZ8yMxrQPtnAu5PD4AMDnpuPUhmAKwFGEqPgmYyMGcTp4pepiXf',
    privateKey: 'EKF3qyZ7eoZZhnGoWsGW6bpv8rE3mZmrUtyMWAotJX7ZiLympqhH',
  }, {
    publicKey: 'B62qmYcD17DeQWzB6taVcAmga42PfZgTY8iLXeiZaKQ7dhkQf6H3DYX',
    privateKey: 'EKDhDVFBWE6byqmutWvWDmr7BxjF6F89LJgGXMicpqPmgNUMdqV9',
  }, {
    publicKey: 'B62qjedom5jrwSp1aoX8gdVB3U5GVgRXospbPSrr5cjwsFHoMU3P4PJ',
    privateKey: 'EKDuTuazTB8eXSqiaCVsmiPt21XEsjJzbf8uAxhF4BnEfBxs2Tzi',
  }, {
    publicKey: 'B62qkwsYqedxnkMRUQJB1U5q2SGJdXUe6wTBQzVmgs4uM8E4iV2LyQm',
    privateKey: 'EKEkphbBgedVTuMjvLoL3Rd7bxophyZupnVVvH9hWEBvjbKBm992',
  }, {
    publicKey: 'B62qrXX4Rb7WdFVqQU9YZn1MEs4dyEH8wEBMAZiNPqU9bPrjAxw6oWv',
    privateKey: 'EKEmCf5ZPjGxuNFk3hGhuUj5CzoDvZjfAYvL3PzGfdBCU7P2PSh9',
  }, {
    publicKey: 'B62qnqufchM2cjvTXHpNDQnxbTucAa6NG2zbrviZNSvFZPWTuttp7r3',
    privateKey: 'EKEkZjv28vD7ouBpj3TKiTtsoegZttHh7sSiHZfGPZCH3BwhZAHF',
  }, {
    publicKey: 'B62qkLwLTELP5bZTBd47SjijqUKB2nAxumXVGTP4tUGFV1rp655Ttgn',
    privateKey: 'EKDva5cGdW71kKfKk55NeKXstc13mY1FSd5QGTkoRcDtRWoNuw5z',
  }, {
    publicKey: 'B62qrFVp2UgY2AkVxsPQqperKYnRGQB4WscAQbnHxpKyaVKaNk39oRu',
    privateKey: 'EKF4iyBxcRxLcJZLodR5EidWZA44UWEmjKNDFnf3Ekv86VguQPFu',
  }, {
    publicKey: 'B62qr8Vhwd582hw4yPqyKVfTEPUp5JcjmP1fsUNHNKmnRvm2kS7nYSt',
    privateKey: 'EKEQZ9iB3zX4HjH4V4BBBYtKAYU6KRg5E2zJHN1Y2SakJVXMHoy3',
  }, {
    publicKey: 'B62qpQxrFMDk64APEmGmYpde9a6XrRBYChnKRh8fkUEKfwyPmtMLL89',
    privateKey: 'EKDzwsrLg4Gd24SxrPQB8tnswKAk8dM3zXABbWdh8vc6TzBY2TNL',
  }, {
    publicKey: 'B62qrHRMVRVHQFkieq7CwDNCexFbMCN9RJnwdG9gUG1bvLJeQ5Nrew3',
    privateKey: 'EKE22VNQdacpbzRdkFGpB7hFW9P6qh7CbPaPoDs2fXFktVUophCm',
  }, {
    publicKey: 'B62qkzkv5Q66qa26P4voA5kWEZw6kmR311JR12DHX6mfWTW81tuEZ4q',
    privateKey: 'EKFXGvPPT1xR7Ef4mYp26bKKLDnryvanUUA4rkvJMTLnEeXmkjkH',
  }, {
    publicKey: 'B62qjUi8jyVzw1Mt8Cbi4zbXkU1Kj3L1f2hsytEHHGH5osrCbZXCB9S',
    privateKey: 'EKED3QybgLQPzZL2vNLwJko93FG69z66aaEvGYLa99LLFR38ZRRp',
  }, {
    publicKey: 'B62qqMwKY8TJjG1Rasi9PnVXMY6oTFwdxWrqhkQfweSrYzjBSum4nWS',
    privateKey: 'EKFZxG1EQQYYuEVcLXfX4gZ3vC66jze4dG95u5oigPryx3WzHKEU',
  }, {
    publicKey: 'B62qotCsPHFB4mWf7ooV9z7CqRh16zzyVV3ftoD5pQx8zoNkfwawtuR',
    privateKey: 'EKFWXydTq88jVqhkmqGRtva82wJTb5PQPgDfdWj5Fj3cSTGaEbaE',
  }, {
    publicKey: 'B62qqn6hZPqresjH7Zb5dixZE93asymfiiSjKTWcdPcXwQuxXJsHn1S',
    privateKey: 'EKFbmV2Lgu7hcezMa3MpnRbGa7VUKr3NrJC17GnpvtbLV8dq7GBa',
  }, {
    publicKey: 'B62qohMRgGwuSU4haLbHVk9zj1tyPuyYqKrYK5TN3aWrHK9En6yDpuZ',
    privateKey: 'EKEpmmtzSLcTvcxom5885qkmjxoqqbRp1HrhzZFEpULf2QZ7T46w',
  }, {
    publicKey: 'B62qkc6sDb3hrYcc8VGwLTFY6nN8PakLffLZSXKh5rMipeZ4b5X9D3s',
    privateKey: 'EKFYCXMECBhB52kcuwswu2Vn2fXyR4UsKwxgCaYTn1Rd5fPAxZPA',
  }, {
    publicKey: 'B62qqvxSokGBKd88wyTrEzr8S1s2LDLGtbd1eJo6izrc72bJHLn2PYA',
    privateKey: 'EKERU95CfpeztUiHauqS22HAMyL28YT7ha9G8TAgLi1rd2w3K5CY',
  }, {
    publicKey: 'B62qjnfHSjFK1Yx6j9mRe6ApUB4XaU1h9KhFXeCTRZUv6m9X78tLGVa',
    privateKey: 'EKFG6aMFPbcVkH8hzUVvmZBCEvujwzmT7qLK6R5hbyagMdgoxSTz',
  }, {
    publicKey: 'B62qofu2x9KnckTrhXe4eoGcVE6BcmuqjvLJKnDbyFrpVHZEA4mMS7G',
    privateKey: 'EKDnxKxXeS6EWtxDAwbw3mAjKdDQXLB9TRJtyDGPgDki4Ctf9y5r',
  }, {
    publicKey: 'B62qjdLNsPPmgMnuowkM5DNkY7eyEstWfL7ACn3SJkU3t15RE3YVbHc',
    privateKey: 'EKFbVNVyP2BSeTirSJQWcrvFkYqhEzAYQaVRKvFkn5EQ17drt2tD',
  }, {
    publicKey: 'B62qp2uJK9YBhFVufsAjTN62Wae57D46xXhVPhRK226jgM2SpDQciTC',
    privateKey: 'EKERGEQmneWt5PtSjrXadAFshPVTkkkYyQtXXmYj5WZqkkPkRUnR',
  }, {
    publicKey: 'B62qjJAmYtCpAiVceDj7dvyH3P2XsLbwcyjQe1AjfPpQwJcdBWECuyp',
    privateKey: 'EKF3ZGhwmcRLmVxnoBERfgQSxaWfU5j27guK283M1wVj4XSmui1J',
  }, {
    publicKey: 'B62qnKJtPBvEAGGKj29NJnf2tkrAw182Arde57dHEVUWrXZHKDP2upV',
    privateKey: 'EKEpSnS36pq8ZX8H2cKm6tJZTa2wAjedQnBuUprS3vNxr15GXivt',
  }, {
    publicKey: 'B62qoyDCsPSAAyAdfMPfJBntwC4Ny4BF1SWW1Y8uxDA2wGALN3itGbr',
    privateKey: 'EKEhdjr8baTM67FChWHQxJiE93ZzteeTKLj3XhrH6UEaBNFg6i8z',
  }, {
    publicKey: 'B62qjoPYqx8jXdW35opXQ8b7yMhThHxnkLDCJ7sLBtfqLaDCjRbij1M',
    privateKey: 'EKFFDLNh2K91CVgsNaPG5rUXcqeagLSBFJZdHu8q3VJZcVn8kLkN',
  }, {
    publicKey: 'B62qpgvmP4HRz2sYff9kRkdCfua5aUEiybk6JCE3M6c87EsFwNLmtWx',
    privateKey: 'EKF6jwSsTp9W767aAt4pTx3PAXKESMzqnPL6a2UnMsFw9unz3qzP',
  }, {
    publicKey: 'B62qjbcDVVFy8PGZ5nLY91rz96qK92vVap2yjDYrrbvPFgadodvvpsn',
    privateKey: 'EKFGd9mZqohAgUtXmtq3qycW9F8wXKh3Bc5EkZc4LqMePkh3XfW4',
  }, {
    publicKey: 'B62qrNWPwvBha5c3VcR2TFp4ZcrwP3miYSLFybSGChKfeG7NjRobRs4',
    privateKey: 'EKEP6ndLAipNMPAfosUcuLA7jXbe6XT6VWK6NZ71jd1cH9VHg5Vv',
  }, {
    publicKey: 'B62qnLPQJckyCYG1wj3JAZFYZg51zjasZfLLZNDWrRgiMiy49v2Td19',
    privateKey: 'EKE9L81onojDSKktaaxh8ogzwsp5GXgxGcttuUQnMaLQ4oEXGNh5',
  }, {
    publicKey: 'B62qptVhZiXDcMUjYKG6Ho5GBAed54oi8uVbmZ5P3orjGGkUcB9d5EA',
    privateKey: 'EKEA7UCNR5A8Z9dfm8CAoR7GeXhyfU2AcYSJmia8XDCpUWhb72ZZ',
  }, {
    publicKey: 'B62qouEtUMNfjxku2J5Txc5Qr9zdunRWT4Uch3bWhgTaPnK9FEfhP3C',
    privateKey: 'EKEJD4n6ZByiXB319z4G3dmvytj96TFFu69kCWJF6ZryYpYeHQam',
  }, {
    publicKey: 'B62qotRuQqDBS8mshA1X1KziBHX6TVojK4wGTbajTbxK1vKmeaoSjNm',
    privateKey: 'EKFYjtr35ooJQMruCMZPdWBwoNXrd8cPHHmF69XSQBTy8LDCgJt5',
  }, {
    publicKey: 'B62qkwHaTnGVn7iEfqWJrwsVU6x29XGbmHaeohGbmPxasceJukiedy8',
    privateKey: 'EKErdLz6UkBqWXLAjQbcdhSLniJGtqZcwCW2EQPd1AVkDqw54uo6',
  }, {
    publicKey: 'B62qqoJwzud33gwDPUPmB8adftE6bBG6barKVXkXZK67SHKraKJ7eQQ',
    privateKey: 'EKFGtQewSbjDq9cscWTU2bXj9HUYG7FULFmfvWtkeo2pfiW3bEuh',
  }, {
    publicKey: 'B62qjBAz8ZqJhQAGhayRQSL8G6Biq59umFKXaBM8W3LX1oKw2EN6453',
    privateKey: 'EKEinQTis632LQZsewncLyYeJHHWRZrG4yfTcbFZuBswYxj5skL2',
  }, {
    publicKey: 'B62qmoDvCvcGkniCfkMTLuNFeUb8NPnDzwRfRXGTNcXoR8ZMqPCnvSb',
    privateKey: 'EKFUcZW4YGuya54nu9Uq4oddjnD2HbogSLtzyFWNUNeNYwqRaaL5',
  }, {
    publicKey: 'B62qrRTPWGzQLinkDteJ56SV8w4zmSpwHLxqY2AyxHzDxPANavSpieC',
    privateKey: 'EKFCS686SFzaYwTAdB2QcYF4LaR2wSQa8T1hEjAqxdT4VpyhUggy',
  }, {
    publicKey: 'B62qr4Q92ktPmKcS3YzuuNSnoUBh2rxe4j2FYM4oR123xhLidLBedsm',
    privateKey: 'EKEJHiUR4TF27xCKhbdUJV81BshrW9P3S4oNv3MNa8RKxzrmN4m8',
  }, {
    publicKey: 'B62qqSTG1iXh34uf1PSAwBEExPmyPxGX6XBxUUhRGnQiDafhCuwKm6f',
    privateKey: 'EKE6b9nFrj1csxfBChsKkCfm5iXJ1XNp6xuGNNVojVxc94GrDL6a',
  }, {
    publicKey: 'B62qkqRXGnCieiNpLCbceUSy5pXidZy57wCmMWDuskP3oV6jtBEt2a4',
    privateKey: 'EKF2pepte4tkNXYMAKKj27rJQtwKAMWGrQ3VYHmCdSApsNnE76db',
  }, {
    publicKey: 'B62qqR3PE2YfG5DFbu4HHXHCzFxfJxuoxwxV8i4Ss4RhhtbazeU5EKT',
    privateKey: 'EKExy5XoaZc7FkbbLz3w3uCZGZ1ZdHgf9YJfFAAGqBjBLqQuunoQ',
  }, {
    publicKey: 'B62qj9meTjyCzEYmsbyo1CL4NdEZwL7afFhqPvz3NJBfBrr3AVKE84c',
    privateKey: 'EKEyVuL3sWEG62NAhvYnNpGydhmPYBVwBGTkRq96iqAQ7KsnqP9d',
  }, {
    publicKey: 'B62qrw8fC5gs9BHZ1bFhEHxqngQFeZzQQbUoM1N1othUUFh7tpjwFdV',
    privateKey: 'EKE9KYvoWDQ8UvjkgmzLSFTP5NuXRtXKrqfhyRLdvv7kFPqpuoMe',
  }, {
    publicKey: 'B62qjtzRYjWzECt3mdAUMKeDLMyMXJqW5a2Bbs7P1MtLwGrvARA6on8',
    privateKey: 'EKFaZyVJbZMgy2b9BhQ3XH2F6zzTbPyjWaGmU7yAuCSEv2uGxhLi',
  }, {
    publicKey: 'B62qrF9J1d7NbMh6EKHRP7xz242k8TZpuLfNKtds7QsxHJ1xpvhovXL',
    privateKey: 'EKFCLTEWTqn1GN8XWTN6ykBvrhpHugzHcqgsvVPGzo9Vo7jutpsx',
  }, {
    publicKey: 'B62qndU62QA69H6tXqeGqtxYHJYCwAfnhHqFhYQ8z9xqQGxd69pqnqF',
    privateKey: 'EKDm1dp2LKGLq1jadKryi659FxRcqUJ7UCPBtxr4TEUbTMCthhiM',
  }, {
    publicKey: 'B62qoyXR5oPzrts9YRo1kiQQjvHxvfKVMN5YXkv6mvFQRV6bq2WoZzk',
    privateKey: 'EKFULRWRTLhVUDTmsvSTh3N9zjwXTzM8X1wc29hkSoJmgPfMgLH2',
  }, {
    publicKey: 'B62qoQr9ZY5DqmtDc6YphpxjtJnzu19adbXSG9RRcP2ATXp4zh2aekU',
    privateKey: 'EKEoDxHZzmavyFJVzUEMkLMByNcmvJhk2z2r8tq8tb8LZfqPrK82',
  }, {
    publicKey: 'B62qpwVx2h4WbscvcsDS3xzXwmzsrPB1uidfgr4YAGfsXJtoqrNgvZ2',
    privateKey: 'EKEaX7FBDy1xYQ5RS2YLFSJRXNFeAxWgg4F9gcZk2xqjLF3f9eJa',
  }, {
    publicKey: 'B62qocxm2jNs8yKzhW9aupyugtYN74WgJTL98xWDPcAP4gDtncsHXuT',
    privateKey: 'EKE2QJunnc89hWQ1hDQq6pYmNgqduCRhCESiNnG4SrTtELiByLSG',
  }, {
    publicKey: 'B62qkNLkjYLEJaFFZAHx7MSyd8j6LqEtzks7fsACxa3vjgDBTuH1wnq',
    privateKey: 'EKF8qfoaTNrudUFMAz27SDd7Yaoy77VBg1y6xckQzgEkN4VKzBqp',
  }, {
    publicKey: 'B62qqdJNhBDHH8YiPoy7XfEkzcRiXeW8cxjUK82GQRSvApo4c1wWJG8',
    privateKey: 'EKDoLQydsB7ockqkXd63VSua9iiXebujrzCjPpQmf7kvNepoo9XT',
  }, {
    publicKey: 'B62qmuga7itpKkKByfnKQfikANW9UX3cEW2j1DbsUWDB1HV6GY9E7jQ',
    privateKey: 'EKDx1WzHvghFw9JWbat9TqJ6TBsNAG7mdseQbVEZvmKPCizpL7VC',
  }, {
    publicKey: 'B62qodmr5Ht7hejVETpBXn8TJTSGe1kkvY3sYugW3Q2b8EXgxxzytJv',
    privateKey: 'EKFGKnDJPCa1zSJYF6AeCgbEGrg4qHTpTnsFuk3b3aGWUhpBkgws',
  }, {
    publicKey: 'B62qqtMJLKYzTUu68sD4J25Bq5CwcCFPHmigJHEGFwx1693D5JeuS6b',
    privateKey: 'EKEt8FjerS97RHsC7LfNsYKPFaXyEVwdKns2my594UXURYdJmzdL',
  }, {
    publicKey: 'B62qoRgWtaFteU67peddDRtqkGY6otuThro19S4K5EgRPhXwm5TJqrg',
    privateKey: 'EKFAddRK1wUWqbZrpZSwpTHm8U4bjgPTgFLtWy8UHm71PFZMhGBS',
  }, {
    publicKey: 'B62qnJbm8vvq45oyKo3FNg4XSfDS3MoBJEwBCQesKhRRHqnDtNsZKdD',
    privateKey: 'EKEArSkKdbgRvsK79rgnoCA4DcJNCFsfMiL8rvSGjueM83SswYXG',
  }, {
    publicKey: 'B62qrtGNiBZXqe4A3gqC25ihEVsF4L1ZDG53ifmH6ha7GpT2DdnDvLv',
    privateKey: 'EKEkzJXFzAtkeKsYaVNusqz3bV7h3P6WvJoh8vyWddQ91V36ZEkK',
  }, {
    publicKey: 'B62qnmqZhWwBqYHXwcfGV3Zq2DAcriAPjn1hCPEoPe1tFnE4fxnwjm2',
    privateKey: 'EKDqFEKoQs8gacXHMSe4bQMdHE2eif5n4DyWCGyrqfdHv9XhYe8m',
  }, {
    publicKey: 'B62qocLuWvpbva6qx8TYNUQGubEFhRVy539GuMiHEiL1PPF5w14QXKF',
    privateKey: 'EKEshDNZyp8Ydp3hPS3wsj6GGrhckqBCXnxBHaafmA29teZtkzmQ',
  }, {
    publicKey: 'B62qmsJAvb1oGCXDpYmxykNRGjM59CxmcmTV9nsXiwAYxuzgoLPrpNh',
    privateKey: 'EKEpcxoimmGy4TUhPJE9QWiwVciHqwiZYFTfuWGvvUSoZVWdx2qP',
  }, {
    publicKey: 'B62qrfYi83cWtHDvVw8ZvdMC1N1ERVVjoJbPxEPZKGygbCBGLzsZEAN',
    privateKey: 'EKEr49PaSjp4q4HqstQkc2zt3voD1QEoN3YdaobGvxoLfxDY8GMr',
  }, {
    publicKey: 'B62qmyApFQEH9FYKdNdS6SwSRPnnMLoBBW1JnUrDEXnPCuwtiUySm9j',
    privateKey: 'EKDqnrQbnNBN3CumDsBrvwSPkrt7uGo5scoqhWaAYkt8zo73QCsG',
  }, {
    publicKey: 'B62qmLMWamHLx5UPjxaipPtY2P3sKbQXHxrXiDqftLGvGYMZDaQ1TuZ',
    privateKey: 'EKE9ReN3umyowic1G3HR62ukbdYM4H3WAmBk8BZWwLupJJzvH6RD',
  }, {
    publicKey: 'B62qrF4kUXY4MSCJStFQzH1isSuvBnRKsxCiuz1FD5Js55GQnjcX9Y9',
    privateKey: 'EKENgs2qma4cuZqrtk1htcZsgQsQYjRkPmCBYLtiXmaEBx8wZg6K',
  }, {
    publicKey: 'B62qrrtG9m8FRLot9SbH4XM8FNbvAQv7RveD5irC4sAB3WhARFqA8BD',
    privateKey: 'EKEts8sLvDbTftxZLvj6EWv5xTBHmZPvH3cd7Rpgg4XrUjtNFvXM',
  }, {
    publicKey: 'B62qn7icNkSRzjUtQd6QNBQXSEqJRoj76yzy4dcezqQdNEU6HRdib6e',
    privateKey: 'EKEcNdwVKNrfTZHVxTN4isaGj1LxgKxWHPYkFHPDAZWzdmnzyowA',
  }, {
    publicKey: 'B62qrKbaj1yxLe6Sa25aWNFKAEsSGMXCG8PGbLiSzLtDvRfCa5bzxvB',
    privateKey: 'EKFRYj4pdqGbXmX2gfBJCofU9fGdZiPKX6QG837ejAoERG2x1wRZ',
  }, {
    publicKey: 'B62qmgTSvifHasYjBysMcUXEdk3L9Vrvz8QeJJMfUQbfRh2UJRWRSCF',
    privateKey: 'EKDkVCbHx3uptrFLbHrRZwTesY7k1BLy383i61rvfcJKo2bLKvL4',
  }, {
    publicKey: 'B62qpyUw2tW8p7rG5ym3YfZpVRYC4JMDFWoEiELjVFanm3A2wxpUbmM',
    privateKey: 'EKDtyXS4NNgMnNSXtTBhtTmq7QDFuVQs17D1zyEi2v71k9wD5jiN',
  }, {
    publicKey: 'B62qjos2zMb6K8V7w474NJrLHxjTJN9mVADYQHQmMryZSSFwKQnTcDo',
    privateKey: 'EKEEEjxhD7bCnD4CHKS7FaKJxpYpaxFweTCGATHcrAeGDjU41D1m',
  }, {
    publicKey: 'B62qqE7F1hogKNGfCaGXFSFmhByzvmCD9yHDQWN2b42HR8YzX2PrHRo',
    privateKey: 'EKEqSdopLWcerxuoDo6KUHiBg7CMSGF4Ny4NsxWRNnjpZFnCgpnN',
  }, {
    publicKey: 'B62qpYxP8uBdoLxXubU8jBCu4aARvHA9ZA995pFNhBn6yWR85wfFo7Q',
    privateKey: 'EKE72ioAoThQ5pP5hA9fvu5Wga3Hac9sEVCW1w4jau2nVubW3qfV',
  }, {
    publicKey: 'B62qriGHPgMX6ozXRNMfGyVY4e24QsizLYz74vSonEQKifp3TZmYZdQ',
    privateKey: 'EKFWtxpXcbCqsoTQPQeSVRajR3MTqUoDP8Mq2FvbQKrira8cKDaf',
  }, {
    publicKey: 'B62qqMQpZ6jD2Krc1DEkJQeSbvS8TdLZGRs17Q6pzCAi1i72ws1G6gT',
    privateKey: 'EKEMyGYjsCn7WvikQbqLDNEfUfPZw2xiFTAHLWMkydFi1AtHVm62',
  }, {
    publicKey: 'B62qri9h15mnFn1JUVAScewmWV8Es5SpkKy7PNgk8qDTKYdwYZHsKvv',
    privateKey: 'EKFa4nG6QQcfefvZ2bRsfSCTbUMXfn5tep3fACG4wsjVTMHiHBgk',
  }, {
    publicKey: 'B62qrb1rUmtJkFpBfnBjztscTgdR9U3FGZtnrJVNbJF9bKyJDk9bFeD',
    privateKey: 'EKDqydzBh7tAtcm6oYB4NhxjHtNXX2wmeEJdCKxBzmdUznpKchWR',
  }, {
    publicKey: 'B62qpmvYDS3YLhWJXSFyJhoHoouwrVKRZZ3ooiiKWLoXw6vqHvScUqm',
    privateKey: 'EKFJRf2MbzCtnufvhc86aMDUQVFsjpmzUsujoCxk2JhXYsREy8SH',
  }, {
    publicKey: 'B62qnoorwJ8nJyTHSsMEoDXyU9E5CsE2JTkzcuVEn2LYUPDGvagzntH',
    privateKey: 'EKFd1xvWfSLqXaTWoBnZ9cZK8vaLKSigzA1VL4QvnDAdhPxRLewK',
  }, {
    publicKey: 'B62qnuMC4fVxJJSjosJiS8DzqpWvSkD85QrizB3c3ECLW6b91i79qFs',
    privateKey: 'EKFBbiqMuDgV1BZF1v4iQu6BUR7NKgSFDxy6PpX1kfzpGcGwBRVm',
  }, {
    publicKey: 'B62qq58dhRrUhq6GLFJwxJk81RwF6YANaUogTPz5okbr9fScnswY1mh',
    privateKey: 'EKEecAqwgkkqTENn1PVkLSefWC6Xa9WVx4eecKfJfHWPSjESAuFP',
  }, {
    publicKey: 'B62qj337ATPaxs6TxNExQNHx8EK99ALLmzPPkFNUjx5hsvfs3Fbyjhs',
    privateKey: 'EKFPbxoQctGcLrDtnrQcK4qTd68P5fXnkkQoXmnLpmXM5oxWwmVa',
  }, {
    publicKey: 'B62qqfx1hXnEEamFW723RV3YJd82s3APxezBfBoMNi8tG3UodvgrwM8',
    privateKey: 'EKEPh3VhizSr1hy27Me6Gewhi7BThXNaZA2CjNoKwTNpRvWAjFMN',
  }, {
    publicKey: 'B62qqQf3yk8rECbdBZqyCovzNpvELYwcHdCWpynJBqZoToyDYDg9r72',
    privateKey: 'EKFa2Z5NWMWa337pX2MH69rFTM36RQmZbby8yJECLtc3mZ17jwPt',
  }, {
    publicKey: 'B62qkFJwENqb7RGh4NGbKWqYk3dWgkFQYdCj6x6y5NdxiVdKoYki4Gr',
    privateKey: 'EKFDCYyswsFkDMKchknkYLN7X7kWcdWzyLDPzo1x9KZKxFMwUmXf',
  }, {
    publicKey: 'B62qn7G9oFofQDGiAoP8TmYce7185PjWJ39unqjr2v7EgsRDoFCFc1k',
    privateKey: 'EKFS625h2nmxJR3YiPTQupLM9aQyayNBqbXqw4evsb7yEamcWnmj',
  }, {
    publicKey: 'B62qn58Qehj4qkKFSwthDyJkKT82N26FnGNZcWp5VN8n3VTgE8cunU1',
    privateKey: 'EKEeB5mFqqVcRojbnLhU3btYKiTkVvNVEfUTTH5L2eYG6CEPsPNF',
  }, {
    publicKey: 'B62qpgoTyJ3nouKCWTPhuUUWMBkchytKCU2ArsudR37k13McYZ9qETD',
    privateKey: 'EKEEBMwAYwEZ1fDr96D853iveQFRRYjzmAzZADpDdEqWjXCXXHfc',
  }, {
    publicKey: 'B62qpuMj59PDWquSUQFamJnntVVmVB4TqfF8ut6pqLhouo66G2GDvHE',
    privateKey: 'EKFTjp5RrGk4cA5WSKVC6x1Ax7hTg8oSfoVhAm7aCKxndKEMrHv5',
  }, {
    publicKey: 'B62qqt6yPwiGnFfSzXCekwDi7b5fXfQEvWcxD3ZZpXjQmZKpActMYgu',
    privateKey: 'EKDu2gXNJKb9bVZhWVVKHM4MqWhggSDX1wziCQFip9uFTfGPjjjL',
  }, {
    publicKey: 'B62qor5daq22pyvuo7aEdUWLmXTt1Zdudj8vtbhGT4eLwB6sg3LBCWj',
    privateKey: 'EKFDN1N8xCgboV8bqp3WozJFVpBgMUyxDtSK4bxa8fEysZpqiy7D',
  }, {
    publicKey: 'B62qqj7zRkPGeRHxaRuk1bFQcXqHY4cx2E5Df73h9iGgR6JhJPst4kG',
    privateKey: 'EKDvj6yMF3ZsPNP3DppMnmnEfJQMoFE6kaTMS9EPjyCVD3c635vH',
  }, {
    publicKey: 'B62qrp9yrafLqVPCmJqjgXE6GpHjncMf3Lns6WjnYC3jBW7ikbdxLX6',
    privateKey: 'EKELBkwHqTvrJicJNpJNC6S3NF4LX46XeicszPPyp4PC6g7DfAFY',
  }, {
    publicKey: 'B62qomBgCdbTqfAJ7K8jUWryHvNyWnqHMPHcf3XpYexRrRmd6HWtd54',
    privateKey: 'EKFZL148LM3bxGirTv83bBNduMSfUHHy6YWWGsAW9tX5m8DGwqBN',
  }, {
    publicKey: 'B62qqh9NPAxdjhSjXUSLfHgw37ue4NVZKamMUA9dD7ZFMYh2wcH4sBF',
    privateKey: 'EKEhJiEm3tbQQVPmbLFQcA2QqQ9YKJBmQv2Lpn2cZ75usYVCR4pX',
  }, {
    publicKey: 'B62qmbhmfhCNDqpydyjRXHeEZSm1qeSBETmeHtCkB5Lt8VXQW9V6cfg',
    privateKey: 'EKEUYuqr9xgaRWMDqBYNYe24kF9GVsJ5KBjM44Ea4rwAogop8dYr',
  }, {
    publicKey: 'B62qnXL9qN68TLBefsn7ypMJrxPUDjnMfEBWeBTicrc762FyNgMHT9G',
    privateKey: 'EKEpSn1xBnUfMFQwE4hqWs1PZgtvpBRRGSxBvEbCNaW5XVNx9Abg',
  }, {
    publicKey: 'B62qmHgWwpBAUCqNVGQwuWbFfDwzF4qL28euToZSeHavBKXoidMQvGZ',
    privateKey: 'EKFdtfhxcdpXcDg5CBSkHApDhxZwPjGzoHRWopuKr6AZUUQ5gNoB',
  }, {
    publicKey: 'B62qpFZzWAx27u1Ls23TUtyW8zAx5D29roTGUVkDq17hkXfmvuWWpqc',
    privateKey: 'EKEvKjUnBsX1Jmt3eG7G8jBNLUqPVnfmfi3DGKy7tucP64biep3t',
  }, {
    publicKey: 'B62qmndTRatbMsze4WhbaptgLoUBxzAiMNio8kv9Q1HG6yNZrjzGL7j',
    privateKey: 'EKFRWyx9wrjbV5rpcmfWdifDB62vVty8dn3CUdBfmugUjwQUAg4n',
  }, {
    publicKey: 'B62qma817qajMtX18C2YaX9Rr4fKYmYgPBtoxs2VAH8rKhZYKNHTqSX',
    privateKey: 'EKEGWVkDT394Ne1fGAf5nXuH7xCkN36LheKNc6XeRs5Hy44X6CWu',
  }, {
    publicKey: 'B62qqPLkhe1xTBsbLtU8L6afF9itMt1wV4qNBdT34AW7M4L8qtoDfRq',
    privateKey: 'EKEg6u2Qum4PjTZhWZHyP6iN3sNCxegrczVLbh2nnVXEDPCvw3km',
  }, {
    publicKey: 'B62qnbF6V6GeUrU4rFeEUE76yVEnnfgv1xJqJiy9fX1XhZztJ4v8TEm',
    privateKey: 'EKE8tXg7MS7SaBFnv7ftLHEP3Pmd1UfS5XCKijxuX4qayfGpisCv',
  }, {
    publicKey: 'B62qkfwrXA42tY6tdUuRQQY3QhCgNQHbWxKgtm5Z1pPpH7yF642Mw1U',
    privateKey: 'EKFYuMpCu5s8WoyWeTPWbRjXTLjRMns4xiBhjKVQ5FhH97f3hqbj',
  }, {
    publicKey: 'B62qkeBYcKC6vBWtJT8GdSudN74aV5v92V9gAh2TJ7wQSELaUGaCTbm',
    privateKey: 'EKEt5qSVcXQMBE9L2ipw7mRQxsQxFuw2VHwS9LH8m2AwnauJhj4Z',
  }, {
    publicKey: 'B62qn4sbLM1EtGbjzxLbp8Fdesw97ihw1r8BsxPGFGxLcFysgwodeRk',
    privateKey: 'EKEEytyg7NSdp7aDtbYC6ZPh8zqmLpiKW4yPLkdPHDb5qLAx5Y6h',
  }, {
    publicKey: 'B62qpyWQ8sGFEnMFxpf4yEPQCErnrkGudfnLUZxo7mEwFUVMPdxGFHp',
    privateKey: 'EKENDkD2JN1XdP4kNT2vjcNKnF1gg9WT7MQk374bh4T6Hje1etU4',
  }, {
    publicKey: 'B62qrAX9j3QwGMrcdBVHxM3dEhV1GqsuSdrquEBqdubnL3LHjgAkv8v',
    privateKey: 'EKEYVP34cCbPSTxsm8TiAXG4jsSu87wo7MTXf667gdM2EBtcEx81',
  }, {
    publicKey: 'B62qkoi34AqBCDFN6Wqn96217aZCEhLyqd2X6dDnnTf2Y57kuD84FKM',
    privateKey: 'EKEBPBq3MAS147Z5xRmD4r2KKdu48EuseLMcoYDoRjf3VD38hXtK',
  }, {
    publicKey: 'B62qjWEXKkxyNVqFrFQszF5C8CNx6YLo8tBmQF54tPtrYJTUw9upYJu',
    privateKey: 'EKEHXpxho5yz19FZqeyLqRdN4U2SUpo4hMEzDRfyjvSGnrA1jkEq',
  }, {
    publicKey: 'B62qm5R8SQDLkdbZjQzByAvwUcJVzKVmzmkBJauHAAHvoByFymNWkKB',
    privateKey: 'EKESVJYjSHjuVKbzjTEX2y441HjBxYgbMuCezLJA16Safpx3PjzU',
  }, {
    publicKey: 'B62qp313FkuG2dCv62wcLtah9Q3YUjbh6PQ11wf9ktdpVq21x7UKVhf',
    privateKey: 'EKDxgBWP2cF1Dq2MGtCnWMrbVoLVfBqbJvqJWzMf6zLxfQj9Gr9U',
  }, {
    publicKey: 'B62qrh4XxvY1mLvhM6jAK71eRYiLuPMuH1Nc699NCyz5ZbfSAiTnYhf',
    privateKey: 'EKDkbUMiVdrZ3nAsXofx2QCkcWaWPzurEtNMjHRC98QSpkxJSjBe',
  }, {
    publicKey: 'B62qjEcHZN5ecUTYwpxnJ6Ab1R5XTxR2xqRJmiBTvFKyc3txkgmPrpe',
    privateKey: 'EKDk24UqfGwfF3r5xjX7gFHnMv79RjC5fozUocBUWRhFUc6x1nEs',
  }, {
    publicKey: 'B62qifUprFj15FFParQ1QoEC6DzSUWGFVLLerbC9Agm52xdncXahaqi',
    privateKey: 'EKFFihKFKw4pTrY34zPuajKyFaZ918J2K8pWQgVF7mG86UJ6rdpK',
  }, {
    publicKey: 'B62qro2suURqq6ExNq6FZE6XAtTbsM3FQ47zQknKCHr998WkoxNUNhL',
    privateKey: 'EKEyhZudnCVC1tPdwtyMVKB8g6ijUzhhT9ERgd7HBkAnEDnmJAdD',
  }, {
    publicKey: 'B62qnWC9bWxiVDm3wYeUHm5RkLCFhB2LcWZvXhz7A8FY79V8YzDrDCE',
    privateKey: 'EKDv9hz3QxkJmj4uTAN52QLTQsj4j3G93aBp2EehUt2jW2j59apd',
  }, {
    publicKey: 'B62qjUX47dGPsoD4Kp6xBRJfrMiQ8GC3pP2FEhXhqwgRGZ4PnB18TUZ',
    privateKey: 'EKE8Yg6p2diLZFftTTnFiu5HAJpKaSTHzAobrJHRJvvPcjrGUxLm',
  }, {
    publicKey: 'B62qmJJmoChfnNinz9StaNTH6CmfDRLocYoN4hZ5S5Md3yAP8gb3zTL',
    privateKey: 'EKDoygU87WGXyDAh8r3DfeUVGSMP5PYjmpBnhszPYS9MwMFe8GuX',
  }, {
    publicKey: 'B62qnYBWvKHpeZjn9fYRRFfmy3Cpk2Mm7X6o9NDgyt6husvpU8q3pWp',
    privateKey: 'EKEqNdA7t5S4dKKUMXWa9RVmkPFUEfWy8X7mXKEZDgHwNjYXFuNc',
  }, {
    publicKey: 'B62qp7s9FazhYVj6UymYXyGfh3Vu1rCXjKFJnC6aNua3G1izE4WGN1g',
    privateKey: 'EKEQjFA7o1ouLABHY81NWove2hNLvfRiHixDPiFHUB8W16pTDJHH',
  }, {
    publicKey: 'B62qpd8imhhPUuznwYwuYEWBaX3Dh5brZ6JZzJirmjmj2uuCRDBExQY',
    privateKey: 'EKEdMkjKhZvweaf26stG3NtU7mHNVpnNKMp6kbGPurneT7ESiMxY',
  }, {
    publicKey: 'B62qppkKrfb87s87C4R9iAgrgYa9T4va8Gnky9ewVk34rEtmDMLXmAX',
    privateKey: 'EKF7q6iEzZ8hWMM6qzv58wcPCt7NAFBhsmEsLHteBty9C2nBhJQF',
  }, {
    publicKey: 'B62qnGyJuvmhVKSpiBV2MfBfbqAnjGY9HeijsHqi2YsBgHdEsnJrNu1',
    privateKey: 'EKFXb39h31iwKFwhgRCQKU8B5GFfGFirNiE3muGpta8jknFM1UEv',
  }, {
    publicKey: 'B62qjdKbRrfdVq2rwka5segFK6ZtsV2iE9tuFzMrYDDXAZfMuqBCskv',
    privateKey: 'EKFLzE8wXbvRzmQe4X6pRYZPtZP7E4FFp9HmC2CXC27YKbFDs85Z',
  }, {
    publicKey: 'B62qnHoao5rFXq7eHzv3AGwQBBPub2uaMuuQ5eArUEuAifvnhKaR8WM',
    privateKey: 'EKFaBrYCUcgCLstnXLmuANhjFzUxETm8r31ayCuxmx12GfymLTiH',
  }, {
    publicKey: 'B62qriC4fkCWoPt4YDkyK78ZqSRa78w2tZjQ9RurS4S3bs95Fwxhpw3',
    privateKey: 'EKFU9gd1CsDa5UxLHWJYX1YgRejaWTz4tH5sSYAgKWhQzBwZAu8A',
  }, {
    publicKey: 'B62qpzQP3Qq6zGhHBzx1A7n9214v2CCWwpnpg79MYgVZKzpkvPAU57b',
    privateKey: 'EKEvSs2qkqTwiBCVNtJwjb1t44zR1RyrFcAoxYnPx5WNpoFxnVFk',
  }, {
    publicKey: 'B62qmYzCTHVLprN79qha2Cm9pWX5AjRrEuX8V8WVEVq5MmASv4PHWiQ',
    privateKey: 'EKEUXDC3aZi8afUy1b4J3tpPLaUZpCPdq22ghVpdhXHi12HCNLg4',
  }, {
    publicKey: 'B62qongmatRPr3Tvhv435RaerJ2poFpfLJBR9YBu3ryoLPco4EPERJp',
    privateKey: 'EKE9jbJNPyHYWGxTBmWk9uRUtoPestbDYrxob52KbkH3Qi3WYfFd',
  }, {
    publicKey: 'B62qpa2J92UcWZoSB7HBXhj1wc1FRHQEWgUYAtonshyyAk9JuWQS211',
    privateKey: 'EKFYuoYLN5xNwFjacd94rwhowbkHLteuySw3pw6Hq9J5RUf5NBio',
  }, {
    publicKey: 'B62qj3wW7dqi4CVbht9HLzesqv1K4yw5mRkupin4mKUy1R9YtkA2rvV',
    privateKey: 'EKEcfwQkRCcHL7oPxvkrLvcKzJ4Qom27Dpkn3yapvEkV5yL4Z1N6',
  }, {
    publicKey: 'B62qqueCvFySHn1PMobieBXDP6mBaBojrpz7AQacLZXGA3MwzRBecah',
    privateKey: 'EKF3SQzf1PnkeAjXacuQMJyNy1ANiyDyCpBL7t24SkErGNb9hMS9',
  }, {
    publicKey: 'B62qrxpK1MQBRRk5fefEkbkVwmNP5HxomCDKMB43re4GxHHWbJfjwxR',
    privateKey: 'EKDo4fZyaRhA3QqzVsNjTFoeVmvbg2i1uRKME2CTUPxHHc4fCJPX',
  }, {
    publicKey: 'B62qnKhtp1VBbbtzEgKZtWzDRoW155TPRdPtoL2k7URpDdjTLPkpT6A',
    privateKey: 'EKEfGQ5bEiAT4SPKHNUx7qtgVkiQXmE7FTzdTsNxgm5wbF4RJo89',
  }, {
    publicKey: 'B62qrwBYv1GtU6hyF1jeSSht9EdwZ5i1xkJubHiDDu8rRPikzgktfHn',
    privateKey: 'EKEcybCzhcwZdXepAJw219PPjbheqKAULB43sqQ6rhts3du17hd3',
  }, {
    publicKey: 'B62qqR5mBX6vugKQdqQXsM6v8HZ5eqUKbqvEHeeUmbXpJL9Q691sJou',
    privateKey: 'EKEFfuLu7PcdnTqWTvhHecEoBQYB3jhCCr5DY6GLPwXGXRSHmyKi',
  }, {
    publicKey: 'B62qohFXgkmctyVYBQJvz4FJKqRYMDCFhjHBq9yoapQzkkLRhyJbPRf',
    privateKey: 'EKFXtWkGUEJ4rMZy2RZGdp28TGJWtPmHEuBGSJscNQ7Pj2w3nUoz',
  }, {
    publicKey: 'B62qiZg43riJKu3wjQaSXg4LLcBvs4fSyLbRUtmUCyR2PLstQhG28z9',
    privateKey: 'EKFCSzUrBiUL9CmaM8H4RFRyFNJWvJuavCFoF6LFZW2Rbqmkqv6Y',
  }, {
    publicKey: 'B62qpnRhN32cbb9WLELmC4uKwFkBKqBGvhXJSMNxcCwiwf6vKjgwK1S',
    privateKey: 'EKER5imJxGCmFhdT25GndEYmqWjDPeJHbhPRtkrhvGZMRNPeELCn',
  }, {
    publicKey: 'B62qpTJdNbQm64zLJr9GZ2LSPTFDy37aUwLbkTyJGQHceKYtbU6YHqJ',
    privateKey: 'EKFVfG3ugZtwtdy7aHHchtecMBzY3csALenY7Rs9YKqPsN6uBm5k',
  }, {
    publicKey: 'B62qngXmZuBBfP5meesPDfbprVbtKBEQntSKGMXJ52Fpd2ZnxobY23v',
    privateKey: 'EKDiYtMoXBggrmv17yC7EjsypnHUjyJi9cjfoKtRbVvbxzfPFgHP',
  }, {
    publicKey: 'B62qp4NzLneLRZ6MPoqLr5RV112jMdbpiB4CcUSfSnVSUmWXgzN76e1',
    privateKey: 'EKF7YvRvkLmJQLmaBBXbtdriQkE4auZrTRx5A8MaYJgiR5N7np1C',
  }, {
    publicKey: 'B62qq3NSER1S3Gdp3MgvxdHekaxUETj1ZLNwgNeP5W15trNE4qYDjUi',
    privateKey: 'EKE3r2NneQz49gGifAchr4EmS2f9EGMAuCo5Rz1rWqWQrNihxqGG',
  }, {
    publicKey: 'B62qnrpAotFabqVyaVh41N8mhzHMJgeWjv3RcDNuNLECUns4SzW7UMr',
    privateKey: 'EKEzWLyxQNZK7C5kJRGrXrgAmCvsUoHRTjMAJNvtehckpbwbz9AE',
  }, {
    publicKey: 'B62qoNR747N4HbgfKX2yhy3mbVk6eMk9DyQeWChWonBV5Yy2KnhzNdv',
    privateKey: 'EKEQoezWoahKgc2GMEywXoeCd28pqxAvmZuYC1ay9KBLF71HaoSV',
  }, {
    publicKey: 'B62qphAb9ZmcGHbcQ8myARWje739767ZUi9pR7fcpzmZbCHrYprqxki',
    privateKey: 'EKESz9eewoFZ54vc6FdxYMpLhGV7e3V1EFUN2KnCFiiTh3dfm5G5',
  }, {
    publicKey: 'B62qj4ggmhHw3YnMHMsjHDkuQrZvVJ5sCe2mqSwkCdGaawp38tp2e3o',
    privateKey: 'EKE3Et3AVRsgMxML4APMxrZxapHxgbV9PMWXhZCiAjtWGc4iKVpf',
  }, {
    publicKey: 'B62qorBvna4NHKz1si2H5gY3GeEkTdSTAnmDWP2kpoAnynpCYfEKHKt',
    privateKey: 'EKFXf1WhtYpNz8qMTJ7Wb1cpTGTeb2a6BYtu6QSxrzbz63pvZMFU',
  }, {
    publicKey: 'B62qqJAwfzhyAZmq5oggd6D6fhxLQF4CMWnYeKX4sc4FvMNE46fu7CT',
    privateKey: 'EKEzfoMH5TLMDCtjXsNEkgpf4SnBbRXpzfuJdAkZ6SEEfnTEBMPk',
  }, {
    publicKey: 'B62qpXLNgM8Rwj99a7TZzJB2DkeJ8XDEDwXnn2anUjqPtMBGYCshw23',
    privateKey: 'EKEVuVfqyqt635SvwgVh7kdvKPqstnNty8Aq3KxsLgeNdx7kaQg4',
  }, {
    publicKey: 'B62qpVraHasZ42KmfyGcmXz1hJGALoVuq1hStZtLoccFbHDqBjuH1nW',
    privateKey: 'EKFDC3oXu7P3zvtaKLBtPuhVnBN25pN8fJCC3MAyDipsbz3A3iJV',
  }, {
    publicKey: 'B62qo9n3XWPiMHevbqo7VopZjLYqonht9eovXSdAqSk34iYj48W3qnP',
    privateKey: 'EKEaMHPP8Uvsh8YLUY5hcjH4LWgEdgA81XyHd68bi6JUccLdcDos',
  }, {
    publicKey: 'B62qkJNwxtoMdTH74YdAxte3MeVDKyYVQXb8Fpak3S1wCAm8uEGrLZi',
    privateKey: 'EKDrdLGqVTE4fcSVtziPeTQvkoR2bBYT64Gg4aBksYd9eM157nFM',
  }, {
    publicKey: 'B62qnacSPpdk8wdkEKQGtqGy6fWoaveLo8s521vrjG6TDWjKBdfuQoL',
    privateKey: 'EKFNS4JNz9zyk9uVdkRVxDx71dRPYwyaVqqD2fEZ3QjiYQ8HJcLC',
  }, {
    publicKey: 'B62qjpdXHeSamg1LYVsbYv5SG4gLx4bt67rjBmLJYJubcMyC3qNuPFY',
    privateKey: 'EKFR1ZM7pGi9aXTu5qxPmCB3NdcyYzRAUz8YQNJ2ME26EGy1gCrv',
  }, {
    publicKey: 'B62qnnrKBqRoP1by1rGUWATUaMUcm4ai26G1GhTe3MLigtbLAfB3q1q',
    privateKey: 'EKDwUyhB57p8mT4MhDovjACunp2T5uVzMwSBXozcKTqeb1U4K4hr',
  }, {
    publicKey: 'B62qoWhcbqUtUHGUxXkUogpx3sGzZ54sq1LL54myycp7rFaeVNKYMuF',
    privateKey: 'EKDhn82PB9rsbBW4supwuEukNRGbKqWEq8esR9vJ2AcZf82cnNyn',
  }, {
    publicKey: 'B62qm93CaRRes1epFJnXShzjKFqej3r5QBrXUUnzK2xVp3TgMyYdbTr',
    privateKey: 'EKEuzPUtX8xTbtU32QMHzeikXUfRmtjh1njGrwK2sxSmAkfmqEHf',
  }, {
    publicKey: 'B62qpsHhAU543tHycpUXbdGwTDHSDFgHfNHPGxdrfr4r6DgZ9v9DSPu',
    privateKey: 'EKEo5cRM5tAFaagy3giThsLkzLrx2sJHvmPStnBaaEQW1WBjUU1X',
  }, {
    publicKey: 'B62qkQTtkBH9TCdYx8Qyq7aXDTocfEEauy2JWxCbGLi2uQdhaY2HXV5',
    privateKey: 'EKEc6tStC7PVBEjeFqVRUqvedfZSUaqqsytmkLZeCjCX42j97xBT',
  }, {
    publicKey: 'B62qpfJ567bv68CRXVeGHfjXusQVhM66SuTPLPew7adVngDcKsMxURu',
    privateKey: 'EKEcPBZQM7rFnVUCUn7A46aHYLNKtfgDAHcYfGcwuEnY4pqmnAF1',
  }, {
    publicKey: 'B62qiyJgzwVhuvEsPW8wa635S1m1nasmqhbP5k12fB24aX5fx18fK3C',
    privateKey: 'EKDzxZMwgLrX9V88ERcxQyMebM5ue9siTcxcYXWVMLtNonyySpoY',
  }, {
    publicKey: 'B62qrg3gYGUDDDpJCMyQTQHHTA7UTh5WMuSttk6Nz9boTkrBg3afJZk',
    privateKey: 'EKDmSiNHobE138R7qmegj2ddMKJSfZgfREu9y6ubCJak1g52WQUh',
  }, {
    publicKey: 'B62qkjewmsMmzKE24wvGvbZB59EVHQiPfx9UzX1ru8S2YE4Mbuhxpvc',
    privateKey: 'EKDqCgdfnWyxosDggWHU2r7MddoU9xcNhFs6sd81V5DawTat16gs',
  }, {
    publicKey: 'B62qjqvgvYH6d9n91wca53W9qoyicoAknJ4rgPpsfVxMNgv4efH6DJs',
    privateKey: 'EKEUEJiBT1qL7EprHipAJ3cc13FcJ7sDMoByknWSDRGwPDGK1nmN',
  }, {
    publicKey: 'B62qqJKv6nQ7LpRDGUa8RNLP1epatB2YbNYfSCE8ij3czi3khexpzXt',
    privateKey: 'EKEKm4e9yQKvKotUMXZUUmqM8qBamouG3w3TmuyuSRdYVTDf5iq1',
  }, {
    publicKey: 'B62qm7HcDq5pXpGdhFhzr3JYv6WSUcGa4tfRWCNu1SedSfdnBs2bKCv',
    privateKey: 'EKFaiCdRMYmM1kEiLvLRtdQ8sGMTdnuHwf6K6EDnhSbbH11gpxup',
  }, {
    publicKey: 'B62qjNQxLjXhhe2UQkE5UuZF7ZT9gDMZUQgGjkBnUwafJ57Bzr2fiYq',
    privateKey: 'EKEBVQd13hQNMfDWxpxHtw4vrwKRJDL7XajiyoBqv6f4YEwHLDGp',
  }, {
    publicKey: 'B62qpWrxPAx227bBQoALaCupVQuxE3hY2SveviyPrpsDG3Qo2kqy2nd',
    privateKey: 'EKFBQTN1W2pEWtKYNHW4amYjm18GP4UHFGzRgBRrod9DqW6BTcaa',
  }, {
    publicKey: 'B62qn5TWynAMMnDJBj1yPRYjCA1145HUqFZUqsGG84WUwHp8tWtNXDS',
    privateKey: 'EKF2gCphKUWLT2xxspqQSDLc4WGpmjubzMQjAprWctz4RRbfFra5',
  }, {
    publicKey: 'B62qmtxPyUqMiXqRKze5SPxceyiQWaCf1f29kJvgG4wK2AzyPLcT5eC',
    privateKey: 'EKEo69RM5Ny1yM3z2ch4zx8hrQ481r67e3Did4avEiBWWFtkqcgY',
  }, {
    publicKey: 'B62qpFNUKPnTxHAZgiXLgpDYUWt8w1Buhndx6U7mL21Acr2iaNJcbFZ',
    privateKey: 'EKEP7XzLjeYVSR2KEGj8bVqWJd5FmucZJ7SAosHzDcVR95wFdVaf',
  }, {
    publicKey: 'B62qmoNZVrN6Yi8N9dnt4T3hbVGVqMUzXAQghdf874d3r9YbBozE8Df',
    privateKey: 'EKELLKgzDzheiQkQcJ2Jtbm4iGooYYpjXAUPtJXVs1b7CmX6U1b8',
  }, {
    publicKey: 'B62qoFXR1YvmRpd3xw4WuJDqtY47PNpdeQzTemopSXpBtG9zMcARfuk',
    privateKey: 'EKDxKGwK7y5Cw7FjFn5d8EGiZppSZiWG3uYzEqpaDDFCS9NSkbqx',
  }, {
    publicKey: 'B62qoPCFFBGtHNTDTn33ut6xdKg9AsTPvdsHukrAJdNu3nSvNS5XkPW',
    privateKey: 'EKEgvw79MLDDGtwYVkpvcRA9erfU2ggA4xB2iMhfTErjQPFaQFEt',
  }, {
    publicKey: 'B62qoPPAPbJSREmSHsuVkkgsjJc1NxuyheL5QBGcFZmC9y3quBpxpfZ',
    privateKey: 'EKF7UKk2FK7AcHnf5YvXiYG565pC713Ln8YDJsyoyDK1wM9ppKDK',
  }, {
    publicKey: 'B62qro8vUushB3nLWnXxQwqM2ZAKUCmnovt9sfNS8ZLywm6BAR35ndH',
    privateKey: 'EKEimo3GaDvf43R9ooKBvtk78QDtk8fHx6dSv5gMJVw5X8AApidD',
  }, {
    publicKey: 'B62qkii6M3ndrNiv6JcjFJQp3LD6o1AquVtXKDtQp9wTBFEp5KFhFAT',
    privateKey: 'EKESF3M7H8HLXzA557TuufPd3gMw1d9dNaExYnxAtK5DHiNCUuhj',
  }, {
    publicKey: 'B62qksEEYKPjYoegQEVh2mSQxZSwFHUGYpAg8y6DHUCdkZcidv5TT31',
    privateKey: 'EKE2w9n1ZpEZ8kiWjdL6iTQJiUTPHCBjRTVmjAoy1aEh8F5QvtuD',
  }, {
    publicKey: 'B62qq87GkLSL8pMH75WUcDeaQr6iy9YzNWbpDNcBec1qKtbQv7yfmu3',
    privateKey: 'EKE3Qde1NXCuRv3MQEKiXUQUnu53GrpSg7bx4FyWPGW7V2h4sc7q',
  }, {
    publicKey: 'B62qjGyn2QdR24vPywWQUQNkeXnLe4y3A3Yr63bm4gxgepfwUmHLfkj',
    privateKey: 'EKEGbjJ8ZKZadjgfiEaxmbbhXyZ7mmua6yhbFD1FjK9udW6RPVB6',
  }, {
    publicKey: 'B62qjfVSBW5A8EdWverTSPcfUeV4D2zkusr49tX517LYr6eMsP8g7k6',
    privateKey: 'EKDhVdBTX3Ywi5gnZ5varFGSf6MNiLiGkjHYyNci4pHKniuCYh29',
  }, {
    publicKey: 'B62qojPZDofedbm6tAJtbxKTTAAhzmoghBQc4Y6LH2gMuZqHEKCh2zn',
    privateKey: 'EKEtApvWXWP24tYdnnkrWEpiEXi8jM9EJ9oyoL38BR2h3Guo2u2U',
  }, {
    publicKey: 'B62qpxiNcrxUniraFdC4bZe9XXwLz6MaqXqPH6wQeQMK5LSpxsEpyxy',
    privateKey: 'EKERdDHh6xnX2VBzNpRgMnpgXbxfxvsrRkCmGfa2VePjZwcyzNka',
  }, {
    publicKey: 'B62qp8iy2kUcn7hJgEaDPdrRXE4KQ59vz6shpUT4cmrhhKUDvvrkKZL',
    privateKey: 'EKDq7AdisPoHNG3GSn34XHqKQDKhsszwygtmwbgjxzFHkd2aiGFQ',
  }, {
    publicKey: 'B62qpPita1s7Dbnr7MVb3UK8fdssZixL1a4536aeMYxbTJEtRGGyS8U',
    privateKey: 'EKE5WXywUNqyPoNpU8D9682z6fxcnUdDMQaQN4x6K1wmC8sYXWa1',
  },
];

@Injectable({
  providedIn: 'root',
})
export class BenchmarksService {

  private wallets = WALLETS;
  // private client: Client = new Client({ network: 'testnet' });
  client: any = null;
  constructor(private http: HttpClient,
              private config: ConfigService,
              private graphQL: GraphQLService) {
    // this.createWalletAndAddFunds();
    if (!localStorage.getItem('browserId')) {
      localStorage.setItem('browserId', Math.floor(Math.random() * 999999999).toString());
    }
  }

  getAccounts(): Observable<BenchmarksWallet[]> {
    let query = '{';
    this.wallets.forEach((wallet, i: number) => query += `account${i}: account(publicKey: "${wallet.publicKey}") { nonce balance { liquid } }, `);
    query += '}';

    return this.graphQL.query<any>('getAccounts', query)
      .pipe(
        map((gqlResponse: any) => Object.keys(gqlResponse).map((key: any, i: number) => ({
          ...this.wallets[i],
          minaTokens: Number(gqlResponse[`account${i}`].balance.liquid),
          nonce: Number(gqlResponse[`account${i}`].nonce),
          successTx: 0,
          failedTx: 0,
        }))),
      );
  }

  sendOneTx(transaction: BenchmarksTransaction): Observable<BenchmarksTransaction | { error: Error }> {
    const signedPayment = this.client.signPayment(transaction, transaction.privateKey);
    const signedTx = {
      ...transaction,
      field: signedPayment.signature.field,
      scalar: signedPayment.signature.scalar,
    };

    const txBody: string = sendTxGraphQLMutationBody();
    return this.graphQL.mutation('sendTx', txBody, signedTx).pipe(
      map((result: any) => {
        const response = result.sendPayment.payment;
        return {
          ...response,
          from: response.from,
          memo: response.memoVerbatim ?? response.memo,
          dateTime: response.memoVerbatim?.includes(',') ? toReadableDate(response.memoVerbatim.split(',')[0]) : undefined,
        };
      }),
      catchError((err) => {
        const error = new Error(err.message);
        (error as any).data = {
          ...signedTx,
          dateTime: signedTx.memo?.includes(',') ? toReadableDate(signedTx.memo.split(',')[0]) : undefined,
        };
        return of({ error });
      }),
    );
  }

  getMempoolTransactions(): Observable<BenchmarksMempoolTx[]> {
    return this.graphQL.query<any>('pooledUserCommands',
      `{ pooledUserCommands { ... on UserCommandPayment {
            nonce
            memoVerbatim
            from } } }`)
      .pipe(
        map((data: any) => data.pooledUserCommands
          .map((tx: any) => ({
            from: tx.from,
            nonce: tx.nonce,
            memo: tx.memoVerbatim,
            dateTime: tx.memoVerbatim?.includes(',') ? toReadableDate(tx.memoVerbatim.split(',')[0]) : undefined,
          } as BenchmarksMempoolTx)),
        ),
      );
  }

  // getWallets(updateNonceOnly: boolean): Observable<BenchmarksWallet[]> {
  //   let query = '{';
  //   this.wallets.forEach((wallet, i: number) => {
  //     query += `account${i}: account(publicKey: "${wallet.publicKey}") { nonce balance { liquid } }, `;
  //   });
  //   query += '}';
  //   return this.getMempoolTransactions().pipe(
  //     map((txs: any[]) => this.wallets.map((wallet: any) => {
  //       const txsInMempool = txs.filter(tx => tx.from === wallet.publicKey).map(tx => tx.nonce);
  //       const mempoolNonce = txsInMempool.length ? Math.max(...txsInMempool) : undefined;
  //       return ({ ...wallet, mempoolNonce });
  //     })),
  //     switchMap((wallets: any[]) =>
  //       updateNonceOnly
  //         ? of(wallets)
  //         : this.graphQL.query<any>('getAccounts', query)
  //           .pipe(
  //             map((gqlResponse: any) => Object.keys(gqlResponse).map((key: any, i: number) => ({
  //               ...wallets[i],
  //               minaTokens: Number(gqlResponse[`account${i}`].balance.liquid),
  //               nonce: Number(gqlResponse[`account${i}`].nonce),
  //               successTx: 0,
  //               failedTx: 0,
  //             }))),
  //           ),
  //     ),
  //   );
  // }

  // createTransaction(
  //   { from, to }: { from: BenchmarksWallet, to: string }, counter: number
  // ): Observable<{ from: string, memo: string, dateTime: string }> {
  //   const memo = Date.now() + ',' + (counter + 1) + ',' + localStorage.getItem('browserId');
  //   const payment: Payment = {
  //     from: from.publicKey,
  //     to,
  //     fee: '1000000000',
  //     amount: '2000000000',
  //     memo,
  //     nonce: from.nonce.toString(),
  //     validUntil: '4294967295',
  //   };
  //   const signedPayment = this.client.signPayment(payment, from.privateKey);
  //   return this.sendTx(payment, signedPayment).pipe(
  //     map((result: any) => {
  //       const response = result.sendPayment.payment;
  //       return {
  //         from: response.from,
  //         memo: response.memoVerbatim ?? response.memo,
  //         dateTime: response.memoVerbatim?.includes(',') ? toReadableDate(response.memoVerbatim.split(',')[0]) : undefined,
  //       };
  //     }),
  //     catchError((err) => {
  //       (err as any).data = from.publicKey;
  //       return throwError(err);
  //     }),
  //   );
  // }
  //
  // private sendTx(transaction: Payment, signedPayment: Signed<Payment>): Observable<any> {
  //   const variables = {
  //     ...transaction,
  //     field: signedPayment.signature.field,
  //     scalar: signedPayment.signature.scalar,
  //   };
  //   const txBody: string = sendTxGraphQLMutationBody();
  //   return this.graphQL.mutation('sendTx', txBody, variables);
  // }

  // getTransactions(): Observable<StressingTransaction[]> {
  //   const appliedTransactions$: Observable<any[]> = this.graphQL.query<any>('getTransactions',
  //     '  {bestChain(maxLength: 100) {\n' +
  //     '    protocolState {\n' +
  //     '      consensusState {\n' +
  //     '        blockHeight\n' +
  //     '      }\n' +
  //     '    }\n' +
  //     '    transactions {\n' +
  //     '      userCommands {\n' +
  //     '        memo\n' +
  //     '        memoVerbatim\n' +
  //     '        hash\n' +
  //     '        amount\n' +
  //     '        fee\n' +
  //     '        from\n' +
  //     '        to\n' +
  //     '        nonce\n' +
  //     '        id\n' +
  //     '        failureReason\n' +
  //     '        kind\n' +
  //     '      }\n' +
  //     '    }}}')
  //     .pipe(
  //       first(),
  //       map((response: any) => response.bestChain?.reduce((acc: StressingTransaction[], chain: any) => [
  //         ...acc,
  //         ...chain.transactions.userCommands.map((tx: any) => {
  //           return {
  //             ...tx,
  //             isBenchmarkTx: !!tx.memoVerbatim,
  //             dateTime: tx.memoVerbatim?.includes(',') ? toReadableDate(tx.memoVerbatim.split(',')[0]) : undefined,
  //             counter: tx.memoVerbatim ? tx.memoVerbatim.split(',')[1] : undefined,
  //             browserId: tx.memoVerbatim ? Number(tx.memoVerbatim.split(',')[2]) : undefined,
  //             amount: Number(tx.amount),
  //             blockHeight: chain.protocolState.consensusState.blockHeight,
  //             status: 'included',
  //           } as StressingTransaction;
  //         }),
  //       ], [])),
  //     );
  //   const mempoolTransactions$: Observable<any[]> = this.getMempoolTransactions();
  //   return forkJoin([
  //     appliedTransactions$,
  //     mempoolTransactions$,
  //   ]).pipe(
  //     map((response: [any[], any[]]) => [...response[1], ...response[0]]),
  //   );
  // }

  // getTransactionStatuses(transactionIds: string[]): Observable<{ [id: string]: string }> {
  //   const mapResponse = {};
  //   const observables = transactionIds.map((id: string) =>
  //     this.graphQL.query<any>('transactionStatus', `{ transactionStatus(payment: "${id}") }`)
  //       .pipe(
  //         first(),
  //         tap((response: any) => mapResponse[id] = response.transactionStatus.toLowerCase()),
  //       ),
  //   );
  //
  //   return forkJoin(observables).pipe(map(() => mapResponse));
  // }

  // createWalletAndAddFunds(): void {
  //   const kp: { privateKey: string; publicKey: string; }[] = [];
  //   for (let i = 0; i < 25; i++) {
  //     kp.push(this.client.genKeys());
  //   }
  //
  //   const final: any[] = [];
  //   const txs: any[] = [];
  //   forkJoin(
  //     kp.map(
  //       wallet => this.walletService
  //         .addTokensToWallet(wallet.publicKey, 'berkeley-qanet')
  //         .pipe(
  //           map((tx) => {
  //             txs.push(tx);
  //             return final.push(wallet);
  //           }),
  //           catchError(e => of(null)),
  //         ),
  //     ),
  //   ).subscribe(r => {
  //     console.log(final);
  //     console.log(txs);
  //   });
  // }
}

function sendTxGraphQLMutationBody(): string {
  return `
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
          memoVerbatim
          nonce
          kind
          to
        }
      }
    }`;
}
