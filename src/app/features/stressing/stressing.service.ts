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

const STRESSING_WALLETS = [
  // {
  //   'privateKey': 'EKFPG9bmMqMBu2B7VapzuqtTARLVHEzbiQnV9P5MqzhpKMsorYDG',
  //   'publicKey': 'B62qkHW1CZFuYjQto88GP2zocqrnkWXVGDBBa6mx5FHcNTU7Dsef63n',
  // },
  // {
  //   'privateKey': 'EKEYzXLTkNXR3gpU9gE16jGdd4tt9NzHfdCxFCuuRRxtQf4HFuPu',
  //   'publicKey': 'B62qrySSsHsbF6Hsjkj63178kYhbc1EntKgKJmm6M6YkThFkqB6aCBv',
  // },
  // {
  //   'privateKey': 'EKExjmKkgZmiLMF48NEQGfTRo76u6Ef2KUHaBNfvFykGyFsACCc8',
  //   'publicKey': 'B62qnBMeqRJ7jBBZucxeWzQFNoB4nb96kw6EyKWYZafpYNWaQBw9xDb',
  // },
  // {
  //   'privateKey': 'EKE8P2gbdiT4VvpLZrrYS6jMQ1qvUk1cymy9mLsiU9zBfw1cBk7W',
  //   'publicKey': 'B62qkVzpV1rLtukC8cn9JbSC4QTB5xv9Y79VccTLV4M6DEdg5jM8VDH',
  // },
  // {
  //   'privateKey': 'EKFQysYZgjrA3PNpoWBdNAS5zuhYZf8ChgANuPrdVN6CgJexe6Qw',
  //   'publicKey': 'B62qitppTLCigDozzQUafNwVbNuwsPjC7QgvvR2NYTrMAKHpafMB5wt',
  // },
  // {
  //   'privateKey': 'EKF4ANFhUvDuAMgPF5gYU2x4hL8A65MDndm9B4s1HuUJCBVvixS1',
  //   'publicKey': 'B62qo2XetrRgsmzdZHCTDSucnGTj49RFNGpCS81hYbwkQ8DaF15jXj1',
  // },
  // {
  //   'privateKey': 'EKEtPrtgepmJd8rYKNcYUzdsQ9po4N5f3a8zHvjAR3QQqrbAFyfD',
  //   'publicKey': 'B62qrzHKVUfNLtoGpYHQJCZci1NJ9P1qusWaA21DFtjopanuAQRbdLu',
  // },
  // {
  //   'privateKey': 'EKFQKW1wu8i1iHBg7r2aVEUmrVQGqdRQojGzwaCBbPh3TCDXVNKp',
  //   'publicKey': 'B62qnjWkPRiS6jizaWQtZCc58KkwVGVMSBW6RdeXnHxLf8berv8527W',
  // },
  // {
  //   'privateKey': 'EKFNxdZBGPYDccAj6tDmKXZaYndS2aYC6c75qWciYnZjRb28y8TN',
  //   'publicKey': 'B62qpmDksAhABLvTubbb1yyE42Rf6CE6sAqvRbxpfUkE8XNc1RTftL1',
  // },
  // {
  //   'privateKey': 'EKF54foCPHWm5T36KYyrvEWfLPgUuRZuKzGA7v7rKMWd851VPnTD',
  //   'publicKey': 'B62qjJApo1yKNBcnsPG58PaUFMCXViAqtg9nXvZUhcRySnyDr3tDFmS',
  // },
  // {
  //   'privateKey': 'EKF1qNQAiodem1f5vXeup48ZpgCAXQnvRYWHCC3CNyDTEbHkXQBH',
  //   'publicKey': 'B62qnNXvCYa79q657rphCvKPSKUUoBbtqPm2ES2DWAcejxNJz9x9s9Z',
  // },
  // {
  //   'privateKey': 'EKFSemiu5tN3N6E8KhB2nhdtYxKheMaX2cohPnfxHysC2S9PVTjo',
  //   'publicKey': 'B62qqxhLSg6tnHVXwbaxWu59yJpAJ1VgUtbnRFH3oujnr46HssYALPv',
  // },
  // {
  //   'privateKey': 'EKFF8x4Xnuo42hSvzB9vCxgmgUqWkvvSbiRRGZbVcpdeJA3yJ4M7',
  //   'publicKey': 'B62qiwYZ4uj9EamnxmtnUnYB9T9nyejnsZe5nunx9LP3A5fUsxKVyf7',
  // },
  // {
  //   'privateKey': 'EKFA4T8V3BhwBeySQ7NSPXNE6oX33MSMrgR4wqaXLSmnB5sA3zZU',
  //   'publicKey': 'B62qq9JHqB3XCW49thgXpUVzo1DEsvazQBRZ9UbbLjjuFaVZoF96iEk',
  // },
  // {
  //   'privateKey': 'EKECeKTh1NjWARJKh6KvNnA2rGCScNBaMxqW6CVUbmmt4wYP9H2Y',
  //   'publicKey': 'B62qmuv23Sz61sYqvHQZCym2YAPrXLz474Twn7echwEtpHo8Fs1yuT7',
  // },
  // {
  //   'privateKey': 'EKFamYSzgPg1DVEcS6np7AnzKRVj9pPpdSEwrEJnkyd4Hxs1LxD9',
  //   'publicKey': 'B62qksGAxqzaP3Wubc4GCuLy9NVVo5JY6Jzj5pi9ttUk7GQPz22Tm8w',
  // },
  // {
  //   'privateKey': 'EKDzKcdVRLa95mFn6QbMgzpvGWntWexfx2zZDrkhuz7ZA5Kx6Zsh',
  //   'publicKey': 'B62qqYzGbTt7jEZAvaaHJJT2ptzvPYbi6YpRhPtfffMKMPc5rjVe5hu',
  // },
  // {
  //   'privateKey': 'EKEBrkc7cMq5YoL3u6Rh3stqzv6YFfQMiEAqViqHT7E2EXoprkQQ',
  //   'publicKey': 'B62qm5vcuBytSAAJb5RpUW5Y75kUMWmqxZXLD13ndcbMXgSag72ZrrA',
  // },
  // {
  //   'privateKey': 'EKFaYsh6GfSjXNEg1PKChofoyGTdw9y5kKJd2o8LT6dfVGMWjGrU',
  //   'publicKey': 'B62qo6REApC4Wkxotq5utKz7vi1Y4p6cuzCVo8F3DVr29V8R1VGtQju',
  // },
  // {
  //   'privateKey': 'EKF5uMi7kpTLMnREoBVenAZQ5R7KYh4k5mWtSub8Jo29cuV1FmVs',
  //   'publicKey': 'B62qmxPJZjoAZ8V4WR5UxZefbVAxK413SuQqK2xV6Q8TBDdAPAN4ydM',
  // },
  // {
  //   'privateKey': 'EKFaXwNnJZN4bQwqzR97az8CdFZWsd2FtXQRoHgwoioykUW5w4qx',
  //   'publicKey': 'B62qnpmVZGUZXZUMwVCND3FN57vedAtjLUiYc4XvAr8wEbvDT5spH9A',
  // },
  // {
  //   'privateKey': 'EKFDXtFJR5Kg4P33DrFsFPfiuSdxFfJgR3jxe3EFhHTAyjAVMArK',
  //   'publicKey': 'B62qrgYXmWZXqLCacMcZ5RFmaWTyB57GwxBUNjuMbY3ucrYgL3SSV1P',
  // },
  // {
  //   'privateKey': 'EKFSmBbh7AHrv4LDndLeR7gjvMJudDqkGyLL6tPsWXtBb6cTHnGz',
  //   'publicKey': 'B62qrdReReiNJpTGWSgtjPBeKtkCARDCApNA9ompCvKC5WbbG2pm9d8',
  // },
  // {
  //   'privateKey': 'EKEWCXn36keThN4k8RxzSogEHagux8YYqWsVzYRpXo95B8FCcsks',
  //   'publicKey': 'B62qrbeX9SRsbwVmV3KWB2YHbeKgAfRDbVtvEbW8e2c4ZjtDYhnrPqt',
  // },
  // {
  //   'privateKey': 'EKEmZE3JJ5R3y5gdmS3FuyjfV2EpVhvxeQh1KGwcfMaHx5kQHTSA',
  //   'publicKey': 'B62qmoCihpyULUGRkHTEznNvvCwanfSvquuPtDo1zBeD6p386QyP1k7',
  // },
  // {
  //   'privateKey': 'EKDrwbAxCkYv2c21GfbZD8SwwKz8u5jPkGqeCg1Fn6u38zNWm1Rt',
  //   'publicKey': 'B62qksjNfAbZicvG4abUHjN7EEokWKdfMLcwe4cMwoquBUZtnSiGEFD',
  // },
  // {
  //   'privateKey': 'EKDmhPkz8DYhP2aPesVoeqwTPjStk6VvEdTUaEbF563517n2J352',
  //   'publicKey': 'B62qmKfwaQ9RBxgaDk6vS6dWSjaRHAvMz9FvTSywegJL4N4q4TYZg73',
  // },
  // {
  //   'privateKey': 'EKFMic44BHsZyVUf6JxoNAgB7yX9acnGf6FC4Mz3DuqMQpNYbyAd',
  //   'publicKey': 'B62qqoeoDcM2dGCagCirBwDq5eS3LLTyaBqmZX9gNX7pz4ctuKkH2p9',
  // },
  // {
  //   'privateKey': 'EKDvjqjzdgbDQbw2KgugxKmdZSskbEwzrRh6rCo9ov4SVrEpWpKe',
  //   'publicKey': 'B62qqWy9ymtsCDkDBevjJrNoxD6JNgv2sEjBmLU4y5tnxqZhZLQdooa',
  // },
  // {
  //   'privateKey': 'EKEcREuLZEpDk1bQxR3Ed3r5HHmKj5gKwg6ycEtpHfsCGCfEjjF1',
  //   'publicKey': 'B62qrg9NKTZ3bfym8jogKGAPCLT3rw3kkcz9qbGjYHkKETe8SbtKYhk',
  // },
  // {
  //   'privateKey': 'EKFL5z9K4sCr5srUv1svToUuC1URjDYoytS3xmjmhBLFP52zdAjM',
  //   'publicKey': 'B62qii1wjvzjFGfCvKTFHYvBdz9vCUQ6JomtA8d9Kjps3vWpYc4qZDq',
  // },
  // {
  //   'privateKey': 'EKF59YDQJFBh3NoyDfzU2zsXYYZ1Z491znXq8ZcBQfuXH2qk6mnw',
  //   'publicKey': 'B62qr3Jpm7UKMsghVyzw4Q2fhFBPmKfAfbaphKmxAamEb2Ko2VKUXwG',
  // },
  // {
  //   'privateKey': 'EKEef9wZ8Uct3JJUxSUhL9yTd6ZVXdtVcVwntrjDgT1wE4r7RCwA',
  //   'publicKey': 'B62qitQ5RY5TrsRitYvC7ukZ5Wm1n5mqvTCp9j5QmDdz7s6PH5azdju',
  // },
  // {
  //   'privateKey': 'EKFQn29RGgefegDhGdTtHw17EvJzx3vcuEMZP91tBwHtRsJTkjuW',
  //   'publicKey': 'B62qmU5e4wu5WL8fBXXKN1mzaZ8BMm1kG8oHPZnB2TGyYNNT1X1RCDJ',
  // },
  // {
  //   'privateKey': 'EKF9asZ8hGsrzqS4UmgJ67iungFQLQR1QgGtyY3ZwPwUG19JmE3B',
  //   'publicKey': 'B62qnRMD8YC3nH2i22emyxVGS8Abxg6sHT5heeFkmHvdc3rcNyAw2jQ',
  // },
  // {
  //   'privateKey': 'EKExq5fLLYDoUHYiEsUdXD4Pkr45DZtpfpYvAn9a6ZXuX2XyAXq6',
  //   'publicKey': 'B62qkYCegJT7ES1uVHAmEe5wRktmdsPWxpRzK3d6ELRFucVvjq6ZaY5',
  // },
  // {
  //   'privateKey': 'EKFNJME3KxsVNBMJgVH4DMyNy9n6U2CKrp4tjG2XoVAdYnJNjVwk',
  //   'publicKey': 'B62qnvo7Yk8BsZ8MbMfQafHNsrLXmchW8usiSxw15C6zeW53Q413hdt',
  // },
  // {
  //   'privateKey': 'EKF9uQaTw8gESJF5QM1sg7PzLBNFLtcDvhJrum3T8BqhXhoDsRHw',
  //   'publicKey': 'B62qjNqpPXiqQixxbs9bNCTPuHBMftRAZB6DZk3adt4aZUqJkkNgedo',
  // },
  // {
  //   'privateKey': 'EKEjmZJ6xQS5Yyon7dekuH52qqvLQR5EPRWguCmh52yuvypVBAqW',
  //   'publicKey': 'B62qrABxNyB7QvLRF213cwhw9TxtjhAf1Naqhv4jLjFG3QxGg4Ct2ap',
  // },
  // {
  //   'privateKey': 'EKDjjhiCjXAKLFo7nsc7fPLrpzhEQmhXSUkwxydPM5Jb2pYyBnuT',
  //   'publicKey': 'B62qnyXBE3f7mSJay7ds34AJZgnRTZZEFucRPVAmCGuUiXrQUR9RTWL',
  // },
  // {
  //   'privateKey': 'EKEcsCt1qeFmFSf5m5fQ4Y5uDjKG8F1UnH1P8LLfgZ9fUy4h3CWW',
  //   'publicKey': 'B62qnGgaSB9iR9GL6KJuxreQtLoHDFUkmuvPm8Zaaoyb91q7oE89Dik',
  // },
  // {
  //   'privateKey': 'EKFVCCQi5vdx7rT9ETPGqv7HhQ2VKEn3kQ2os2ZMnPWAvbMwcmEy',
  //   'publicKey': 'B62qkep2t4XK2LM5YjDHkbwrNCszZtwW5ErCFUXSEUodyxH44eQGYBA',
  // },
  // {
  //   'privateKey': 'EKEmU12SQwYefP1sZesrq7mqEb3sXwY122nTQWVc7UHscPRyPPQB',
  //   'publicKey': 'B62qmjCKQBmnxQES6tygG7ccQK9QGmaR8pCPZzVmA7Kg2ezFSzNTfww',
  // },
  // {
  //   'privateKey': 'EKFZpYyDg3gaUGpAT4oAADYWeys315swiZLLi2r6WeHPTnJE7JLX',
  //   'publicKey': 'B62qja3MWX3GAmnC66bzKywxkDZpTHZbQ6bZ4Qi7DX413G8o5NqyAsB',
  // },
  // {
  //   'privateKey': 'EKEHJUqHdqmkeiXqvzxnocPStEmTFWF5wadkAeFUY3VMjNCseoca',
  //   'publicKey': 'B62qqWUtrFvmbE3cxrPVRBS1wLspnSM348cf76oULfPWTyQxKbJwr23',
  // },
  // {
  //   'privateKey': 'EKFEbQgg13oz3ZZaCDvz2BPt9A6ohtiUC1wputB8fi38Z1U4pXfR',
  //   'publicKey': 'B62qpP5Y9oDquu5rEzZUaSfVKF4ZMqP1Cs9evhwh6vqEZnfxEmHPsns',
  // },
  // {
  //   'privateKey': 'EKFFfgJh66KTgxtfHZVhn2zcrBow5rNva78UUTgWfaNZZcsJR5NZ',
  //   'publicKey': 'B62qkpR2tSELPiJ9j5TcfJtVnYFSwvFSi7CjoDxMHrNPrafzPZu55ty',
  // },
  // {
  //   'privateKey': 'EKER9qSc6JHSCvJ7vimqvtgYF4rBQjY6kN8GVd8YkX99NuZNcyk9',
  //   'publicKey': 'B62qr398nYtqtAXVsfmXShjUGjDnziAgNEdTgxuJqfz6aZBBy5TYnWq',
  // },
  // {
  //   'privateKey': 'EKEYvYSohv8YjGEdsQZwuqneSifz6Ci2zdamVQ3BMxrtSKVupQbF',
  //   'publicKey': 'B62qmFm8zkEmRMN2AXSYoJzTPFPAtNhMtJ13TKogDGLV37vqqBahPkU',
  // },
  // {
  //   'privateKey': 'EKFKiy8Yj1ajRk7q57xFDGRCiaRcfNwfTweKMyZe6pLUuKuLmkE8',
  //   'publicKey': 'B62qnoopmuMGCbMPvnQ66S9fXwuTMJYRUP7K3xpt8Ue2MKR3e1hpaHQ',
  // },
  // {
  //   'privateKey': 'EKE78caXLxoA56qVqiSD2eofYwPXCSnC579XcsciAMxwzdFwbtMT',
  //   'publicKey': 'B62qm4txaE9ySWGcvvTQFUBnnhqbq166uZRQR5TQQm5xrpp3HvKy7Up',
  // },
  // {
  //   'privateKey': 'EKDieKWs7GbXCz9o21iYu4JzCWYnTGCGim4tShc8KuhZNEpKrBsa',
  //   'publicKey': 'B62qmX9dX3XJdLsbPyf2hSJ6EUY38K3ri3TxWxoJoMJhvEXGPVZkKTZ',
  // },
  // {
  //   'privateKey': 'EKDoBiLZZdnF887JJc3Dq8zaKrvzEpWGRpcL9PaWYxkLRUvATMaA',
  //   'publicKey': 'B62qrHENtF2w7Tx4c8GcZd8ZBArVS4rz1vb1iz5cLdCXi63wT65YfoS',
  // },
  // {
  //   'privateKey': 'EKE4CFCv5vstLW8BxaBLD2hSF4wSCTPPEwHuVA34zrpG2tqknJUt',
  //   'publicKey': 'B62qomRwCHQwKjWHXGcx6kxHu8quqMedimTv3Pccsr3nR21vsF2MWRU',
  // },
  // {
  //   'privateKey': 'EKEpm8kexFdaeBKvVV3GqEDK7inmeb5v8nRHaTxnpNAa2TXBUo5e',
  //   'publicKey': 'B62qjvDGHWhTSQntbfsY7ikWA6hu1MUstXM775io9gGoD59GTtZvphn',
  // },
  // {
  //   'privateKey': 'EKDjGFvwttR9et9s1REBNSTyFbFgn5Rgc8F53MJV3k1uP2buVbBf',
  //   'publicKey': 'B62qkcSPNaQqeJ5tdoSSBC3XiQ4UMgJsEnu3WSkuGaqLu8CQ5DUywAZ',
  // },
  // {
  //   'privateKey': 'EKF1EEewnMHoNjNikuMfP3oFp2DUtqjmoZM7TTpe9mrN9ejvMuV4',
  //   'publicKey': 'B62qiaDPBvx4saqgc9Nz534gsqv7m5S45W34UuhNnptzeYVQpWcxjJL',
  // },
  // {
  //   'privateKey': 'EKEde4j6E5JmZ1QHFq7K7Sf8P1p3orgr9rdvAKrbCnnSqnAPdKyq',
  //   'publicKey': 'B62qk8Zi87WXfccL7Cc5DfHNTHp9hpto5BaGUhPJeA8Y4Y4QwQ9jCM7',
  // },
  // {
  //   'privateKey': 'EKEDqEaXCdDuJXv8nJhS1dwPgnemfQ6PTynxnjrVLPfoneg3HbWV',
  //   'publicKey': 'B62qpV6Nw9qWggh1mHjYQEPw4CjBwqaVJfdH4nTrT213L54KZJbdZT1',
  // },
  // {
  //   'privateKey': 'EKE96sPijQhBk8DihjUDVVZxKnhiH2ocDJpcpUHzXESoWQY5fC2A',
  //   'publicKey': 'B62qmvrFfZF9LtBJ84r9qqZn45hpBbZjCPj3UXdRnpvSPH66FLAMBkV',
  // },
  // {
  //   'privateKey': 'EKECbvYgWF4GwfEa3hrYA4UpUhvswGFKGQpi7nCKKYFGJ7jYLQa7',
  //   'publicKey': 'B62qj33ZYhM2UQr5BkuN3veLritMyxCFHmgTQXWvVNwxSZN2uMniAbg',
  // },
  // {
  //   'privateKey': 'EKEHF4M4u88zn1KgkyWYqoeAen3xnXyWJwYxvzaY4Hmme13Bapyj',
  //   'publicKey': 'B62qs15bXTJeotc6Ymhv92VQVFfXeHuXRYHZLr2sbVKkbgk4zoQghND',
  // },
  // {
  //   'privateKey': 'EKEekVS6ZCkKKihcYF1fQnDcsKrr6XKWjxEpsXW5YfSaTvnWho4v',
  //   'publicKey': 'B62qkyJWQtYVXSjmvNA2z36Rg9LBSquTYXKNHoKmjEGNHnm6oWD4tcd',
  // },
  // {
  //   'privateKey': 'EKFDCqvzvegbhDfipJuRi5kDsTtksmaVbKXiP2fS1AFBhhfJ6XRN',
  //   'publicKey': 'B62qrQdFco4zctKyZgAbAbZ739dQTrWAkfnhR1zGpdSxSo8Jedp5SBF',
  // },
  // {
  //   'privateKey': 'EKEokxMwf7Q87MF1QRjVoXcQbn3UDioxEmBQ6inLRXXnNdzTskYn',
  //   'publicKey': 'B62qmBo71y8FnQ86m7NVa23W6Y1XRDNiKaZ4d9ji46W1A8qySb37L95',
  // },
  // {
  //   'privateKey': 'EKEWnM5e8u5BzdKuY9gABoskYTLHC51XRfiRwjSiFwYQSRx35pMJ',
  //   'publicKey': 'B62qmWcKgBbPH3BaNrVj2PvY6MDmprsx9t8NhUuatDEtT3odG7QL4A3',
  // },
  // {
  //   'privateKey': 'EKDyhLiWJnspdnRpm5CsHn4XJjq59U44uZqp5yJVCgLUYxrMP6c4',
  //   'publicKey': 'B62qr3JwaqsLQ352P8imgGhbf2AJvgBuMvaTv7fngtevMKnajSgsweC',
  // },
  // {
  //   'privateKey': 'EKFBYtcaNYUUoDUCeXQavo5oZYtqfs71jWzXt9uNC5yftVmJrZgs',
  //   'publicKey': 'B62qkhzji4fUxt8a4CrZHBfTmXGXiDAh445c8m4phr8iYqH731Khae5',
  // },
  // {
  //   'privateKey': 'EKE1fjeyBbB8fZmfR3KbCwQGAEjz1ZQ1WhN9eLngnphnjyBA5FVG',
  //   'publicKey': 'B62qmZw7Yhkfdh9NJkTWoN5J3nr2rG8S34vNsyXp2cn5nNeFB5iuChy',
  // },
  // {
  //   'privateKey': 'EKFPS7xRmaks97ThmEKWhPhBQRFagi6rbGTVgvbKg5UoiofKy1ur',
  //   'publicKey': 'B62qicLXorKwiLDRZ1wxAX2RUJZ6XZG8SBjDvs3v4R1np9r84JDBFCr',
  // },
  // {
  //   'privateKey': 'EKEUPxwnsoviWmMHUmRBzDL1fb44FS2TnutvjW9S1wMw7da5Sc1y',
  //   'publicKey': 'B62qn2Ak9TpkvQMrj58GGr4824USAYcUqEQFDVJCCkWuQ4HXvowhqqt',
  // },
  // {
  //   'privateKey': 'EKEz1V2nmM3qbmFQxigZe27mFS7NHSNBTfB5zsm51aubqiAQE8ie',
  //   'publicKey': 'B62qnLHBnp3suKEoFog5ii3TSErbqBpuAcUoLb3xmFGfh2hdB9hsmrn',
  // },
  // {
  //   'privateKey': 'EKEqgT2fRrPFPUEv3UAWwdGTrTcTVqUCehEcLLv4Ywuv5BTtXnhE',
  //   'publicKey': 'B62qmPqjhzedudPmU9MZL5VF3vwYLnceN2rxCRubrBhfUWtnGHB3WNa',
  // },
  // {
  //   'privateKey': 'EKEeowEJSotwQ9LteZfnc29SzZTkSZFjxujyPbHuZFt3pkm6ejdq',
  //   'publicKey': 'B62qn2khM74e4QsjDn7XjAYQ1JRuYJ4eFRfcEAZQfFyokLPZAhzc31y',
  // },
  // {
  //   'privateKey': 'EKF85QwLjPmc1dU8BBCMJsHkAubrxEeRJg2sKUpoZwVgnHxASjXz',
  //   'publicKey': 'B62qpBU2Cqryq5ZMUbqPD9pr21Pk7p6gfq5XorREEV3CUm8sRdHLRr8',
  // },
  // {
  //   'privateKey': 'EKFZpywT6HfchSKtDyhBfvu8voYBvfnW7iVJuuTAgwh2QGstwYFg',
  //   'publicKey': 'B62qpGYSmnPEf6zeTtUALsbh26PAZwbL2iqANr9ry8WgWgTHHca3Deq',
  // },
  // {
  //   'privateKey': 'EKDsruJp4rxc9VJdo1shftviwXx3AJAuw6amnUwG7pd7HnVq6Qz2',
  //   'publicKey': 'B62qkcGAcackbFkGPHrzgFKdMWJQUposgPN3FUS3XcPVFo28z5ThcRN',
  // },
  // {
  //   'privateKey': 'EKE8yZEBa3xRdAJJEMtBWVALTziGKwZQnu6LbhHGdfEdpkPHPSSm',
  //   'publicKey': 'B62qo4rbpWeZ7WXLaWfnVFwwaEwUZyEYjz4ce1YG1cd2wrudhUPsQ4X',
  // },
  // {
  //   'privateKey': 'EKDnVa8UW5BpPe8zZXDDpELGEGvN7bcbRAdt7CmcTGeDv8kXRWz7',
  //   'publicKey': 'B62qpjg4pRvbd8yJa6pwpSsJA9vxF1kr6Yy29VfEjdTc1QGQfgbnANk',
  // },
  // {
  //   'privateKey': 'EKDhyJG6rGWedNtA65STu7bCYoqQpAvzZp9NJgUeU8UgUsHw7Zi2',
  //   'publicKey': 'B62qrYiiKQt7aTDTfuozjfgb832LX7rqFtnPM2wm1JUTC46CmWpyuAc',
  // },
  // {
  //   'privateKey': 'EKExxWmjLWGJwqS3AwuKzQgWndb6gw6UYe6iTLbJFda6Po4poPwn',
  //   'publicKey': 'B62qkuwMALT3RBhmANsZrKg6kTLdv7BVBANGCWVhwWiCYg13yaTEGkq',
  // },
  // {
  //   'privateKey': 'EKEBccukDBtykNakAaUjMy9riusEzknjm7cRfzPTxayiVfWKEA5T',
  //   'publicKey': 'B62qn6k5vrTLTj2oiAKzZCiFJuceWBni87eGRKVMaB96cFAgpSw4uJz',
  // },
  // {
  //   'privateKey': 'EKEGcXmxMkq88jfzJS9EVnjt9ALFJNxpT94Lmp7ESzfifZ5WjCPM',
  //   'publicKey': 'B62qisHACdZ4mstid65NmEbgM5HSBt4JbseT4Dc5A2VajYP7KcqyGuw',
  // },
  // {
  //   'privateKey': 'EKEYuGToWXFeqyueS95pXmsg9A7UPNAbFM9w4Q3PjzRUHwjQfR7n',
  //   'publicKey': 'B62qpvk8BuLHWCHKoPbaHTURJ7mVBPXCvyZCxFRTFpwwsv5ZAE1FMWN',
  // },
  // {
  //   'privateKey': 'EKF8mCrBsuTXCYaTBvsyXuG2dgQw2ujNVUf3FNCeZF2FHPBc7Dai',
  //   'publicKey': 'B62qj8wiSMw8pJEi6oSvrvRMW31qXSjJKGsawUQVGDcM8Mf3cvDbpF2',
  // },
  // {
  //   'privateKey': 'EKED9yg7UBoqN8Tb1q1H5oNFwRZNCs4DsqQxE6ZQhCEnaWctUJt1',
  //   'publicKey': 'B62qnpPRcjgJxSXxsWcqx81cwWUC9g6SzbbMvDQR7X4gecdHJz7T5Ht',
  // },
  // {
  //   'privateKey': 'EKDtYmpVAo3DMuq1mw78TXgG5Wypo8s4foSR8unDAvm47FMBaREw',
  //   'publicKey': 'B62qqeSeSXuDa6MYEgekfHtdx9PDfVPq1R61JBRtyxviSXUeSieSi4x',
  // },
  // {
  //   'privateKey': 'EKDyQAXtWKkuVZEv6qbQBBctNAeGgm8wb472hxVZjXw8qgTqDTX3',
  //   'publicKey': 'B62qpCFNQDzz7ZySRTE8i6SEAvgtXHcXj2iHjpDjDM2T6RKwHu31PPk',
  // },
  // {
  //   'privateKey': 'EKEfq62nwwhcyhjTfmHTPPc1FHYe7HoKJELeQBRgDi7mB5G4QWry',
  //   'publicKey': 'B62qoda6wfZjMdwarjaiTAmevsoUu7NTQ8zDBcXnzNHHwC1kh6mZ1H5',
  // },
  // {
  //   'privateKey': 'EKEmaF95bJ7sX2PWzV6y5dSjTbfw4T2FxroTJKSgdrTB439oXjk5',
  //   'publicKey': 'B62qrRm4wLdZfU2i7HGoRCq16sL8Zhy9UhAvrWxh7KqoKokSheCEWGL',
  // },
  // {
  //   'privateKey': 'EKE8iBtqS8k7yV9PYnMX7YPz2wus3m6ohcnxqU2tuxVAJB2cbXGE',
  //   'publicKey': 'B62qiwbz4B2RsSCzWesCdp7siscAndeWimX1pLuEnuwqUYob1UAEHzo',
  // },
  // {
  //   'privateKey': 'EKEVyN5fsCMLRJTMaGVgpGpJs3ixooVW71QdFJD8PRE8jMq158Wm',
  //   'publicKey': 'B62qq7K8eEEtRT4F2zRxgLeiZHW9eouq1KYcMJufmf7mSUPndnNpgev',
  // },
  // {
  //   'privateKey': 'EKFbdNdKwaESs3ynds82dGwfbpD4Kt3eqp2t2thoDB6AisYEQbNm',
  //   'publicKey': 'B62qosNA8qNFytx2JFwCXXPzu1vzfUiZtyrM2mANMyNUvH92rSdvecK',
  // },
  // {
  //   'privateKey': 'EKF1UWsSVzBWqYWSMmH3QCYs5VkacbWHmj1usGZYFq1PDuMTJu1d',
  //   'publicKey': 'B62qrskYPRFNoM41zDKGQjRbKCdSgrJHSc3ncNxARFyG9imZ2wq5gQp',
  // },
  // {
  //   'privateKey': 'EKE2N52AtPb6WBDxiT2MjBjExAt33Gu8Q1SyeX71EJDuygQuaVvF',
  //   'publicKey': 'B62qokMmjEacjhyPKNTkZyZbwV81BB52SX49zpR4Aaxc76RNraGnrSy',
  // },
  // {
  //   'privateKey': 'EKEJS92QwpWAjL7VtTEnc8XkRuvsP2zCVmBj63uv5bJvXV8HwFD4',
  //   'publicKey': 'B62qoYfWM6PqRL4k5wEe2LmPBqEqSSYGsjLrgvpWmsFR1EwNhGia5iU',
  // },
  // {
  //   'privateKey': 'EKFNuBAWdc8UVjzo5YqfC8qsCdRFwekaqxkP6Vpugzm9wGVqRUrA',
  //   'publicKey': 'B62qoQuVmBQXrD5ozvVM6gSwtpo7igKvC8FCJWbN2NBDADqPD2eyquc',
  // },
  {
    'privateKey': 'EKEUKdxUCUTgkXMoR6q8tHKdD9cCreUBHM7YMRie7fbkmUjRHeYB',
    'publicKey': 'B62qoEbHiZVpQNFwKHMADLo5pqsG5HKwH8FdaTNNqSkbpXs2k1zYPGE',
  },
  {
    'privateKey': 'EKEtiehv2omuU6G4EHZVfUxHLWiXyDMHGVvQDMTHnJHnqSPURYpS',
    'publicKey': 'B62qksgvFsy9UKcANPGtLQXKGrg5BbVYpAaEPPCDVE1DtGtbG2gHSe8',
  },
  {
    'privateKey': 'EKEUew3w5oZKQKGsCiwt6ZhgoserJ7Fd3H6JojDjTke4DWDfGWEF',
    'publicKey': 'B62qs2jxHAWDRURbA6WqcPaombBYrQ45BU8Y8d7kN79iFTkBdp7qk2g',
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
        }))),
      );
  }

  createTransaction(): void {
    const p: Payment = {
      from: this.wallets[0].publicKey,
      to: this.wallets[1].publicKey,
      fee: '1000000000',
      amount: '1000000000',
      memo: '',
      nonce: '0',
      validUntil: '4294967295',
    };
    const signedPayment = this.client.signPayment(p, this.wallets[0].privateKey);
    this.sendTx(p, signedPayment);
  }

  sendTx(transaction: Payment, signedPayment: Signed<Payment>) {
    const variables = getGQLVariables(transaction, signedPayment, true);
    const txBody: string = sendTxGraphQLMutationBody();

    this.graphQL.mutation('sendTx', txBody, variables).subscribe(response => {
      console.log('response');
      console.log(response);
    });
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
  //         .addTokensToWallet(wallet.publicKey)
  //         .pipe(
  //           map(() => final.push(wallet)),
  //           catchError(e => e),
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
