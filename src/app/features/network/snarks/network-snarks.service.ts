import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';
import { toReadableDate } from '@shared/helpers/date.helper';

@Injectable({
  providedIn: 'root'
})
export class NetworkSnarksService {

  constructor() { }

  getSnarks(): Observable<NetworkSnark[]> {
    return of(mock).pipe(
      map(r => r.map(item => ({
        hash: item.hash,
        height: item.height,
        datetime: toReadableDate(item.datetime),
      })))
    );
  }
}

const mock: any[] = [
  {
    "hash": "c07d7556-044e-4a26-a53e-f3e83b5cfac9",
    "datetime": 1669744534,
    "height": 3523
  },
  {
    "hash": "eaa4b675-7931-45fa-b9b2-7a3fdb31730f",
    "datetime": 1669732605,
    "height": 3479
  },
  {
    "hash": "27ada19e-7a06-40aa-933c-c156c86bbecf",
    "datetime": 1669726404,
    "height": 3465
  },
  {
    "hash": "4fdc71ab-6d21-470d-a087-8d25fe744fa6",
    "datetime": 1669750334,
    "height": 3672
  },
  {
    "hash": "7d735110-40e7-47fc-9ac7-7fa301915a18",
    "datetime": 1669725928,
    "height": 3447
  },
  {
    "hash": "0dc4aa67-d46c-4613-bbf1-3c730ec1ab0f",
    "datetime": 1669735308,
    "height": 3842
  },
  {
    "hash": "bd1557c8-eb1e-4dab-a093-2ca23ff56423",
    "datetime": 1669733011,
    "height": 3243
  },
  {
    "hash": "cfbd1784-c147-4baf-9b3a-ad27958d6422",
    "datetime": 1669743189,
    "height": 3552
  },
  {
    "hash": "3fa8f7cb-9ea7-467e-b518-591400e25c42",
    "datetime": 1669750440,
    "height": 3689
  },
  {
    "hash": "4c402463-f456-418e-b250-21a1adc2303e",
    "datetime": 1669723596,
    "height": 3469
  },
  {
    "hash": "78e0e1b9-59e5-42f4-a1f8-c58f737636b0",
    "datetime": 1669723209,
    "height": 3358
  },
  {
    "hash": "079427fd-3d3f-4fc2-ab2b-8e253b48e0a7",
    "datetime": 1669744330,
    "height": 3795
  },
  {
    "hash": "d5285c8b-a6d1-4be5-b7e5-8a6606c1c3dd",
    "datetime": 1669732799,
    "height": 3537
  },
  {
    "hash": "397656be-ff70-434d-9c8d-c95be68162c4",
    "datetime": 1669744781,
    "height": 3031
  },
  {
    "hash": "e09ae014-6fec-420d-bdfa-6a5f48a9891c",
    "datetime": 1669730975,
    "height": 3872
  },
  {
    "hash": "c2235e68-5db6-4bd4-931b-23ae3a982945",
    "datetime": 1669747803,
    "height": 3039
  },
  {
    "hash": "4dad03e5-7e8b-44fa-b583-f17514acbead",
    "datetime": 1669730056,
    "height": 3707
  },
  {
    "hash": "32e118ab-0e3b-4053-9e59-9f5119fca411",
    "datetime": 1669739286,
    "height": 3484
  },
  {
    "hash": "8cc9934b-79c7-4dcc-95ad-eba6452866e4",
    "datetime": 1669745569,
    "height": 3206
  },
  {
    "hash": "b23d16ea-7d00-44a8-8d33-5de1928f5bf6",
    "datetime": 1669741708,
    "height": 3600
  },
  {
    "hash": "3aa81f01-c5c9-4153-a771-790f4ede2367",
    "datetime": 1669733583,
    "height": 3204
  },
  {
    "hash": "a1356cac-667e-4b48-8a8c-d3f9a69bb881",
    "datetime": 1669722403,
    "height": 3098
  },
  {
    "hash": "e1a65005-8931-4700-bd2a-b98b50b7ac3b",
    "datetime": 1669748742,
    "height": 3859
  },
  {
    "hash": "b5682667-22ae-4074-8736-cf2238645609",
    "datetime": 1669741749,
    "height": 3616
  },
  {
    "hash": "3dd15b15-deed-4f1c-a1ed-856109aa748e",
    "datetime": 1669747675,
    "height": 3272
  },
  {
    "hash": "b0322e72-f1b5-466e-b84c-38ca7bc8d540",
    "datetime": 1669722881,
    "height": 3936
  },
  {
    "hash": "974987bf-3d2d-4e16-a487-980553a496cd",
    "datetime": 1669730752,
    "height": 3604
  },
  {
    "hash": "e2153579-76a5-4ea0-b5c2-a6a6b48d32eb",
    "datetime": 1669748557,
    "height": 3140
  },
  {
    "hash": "419cbc03-e09a-4905-ad1f-3eccdc66f1f9",
    "datetime": 1669733402,
    "height": 3734
  },
  {
    "hash": "955f4144-c250-4d8d-a1ca-52929e55d720",
    "datetime": 1669738478,
    "height": 3551
  },
  {
    "hash": "2f520ac7-8cad-4ab9-8f41-17312eba15a2",
    "datetime": 1669750710,
    "height": 3809
  },
  {
    "hash": "273577be-2b14-4a83-93c7-a3aa815f060a",
    "datetime": 1669750703,
    "height": 3185
  },
  {
    "hash": "c6ec68e0-113d-4904-b023-441113eaf37f",
    "datetime": 1669734819,
    "height": 3389
  },
  {
    "hash": "6db3519c-081d-4a56-b343-e6928d0bfe74",
    "datetime": 1669746620,
    "height": 3726
  },
  {
    "hash": "d8af9837-05dd-40ba-9ca0-ef10c8620e4b",
    "datetime": 1669730690,
    "height": 3398
  },
  {
    "hash": "75d37601-0039-4343-bfbf-3fc416927c20",
    "datetime": 1669725618,
    "height": 3526
  },
  {
    "hash": "584f06da-ffbf-4256-9f93-54e42633a79a",
    "datetime": 1669747508,
    "height": 3616
  },
  {
    "hash": "fb28adc8-d455-4f43-9cfc-9e7266efff13",
    "datetime": 1669729332,
    "height": 3834
  },
  {
    "hash": "faea04ae-310a-4dbb-896f-a95ba8f08a74",
    "datetime": 1669728357,
    "height": 3077
  },
  {
    "hash": "ec43c950-5f2f-4e53-84f5-77e61690c948",
    "datetime": 1669737425,
    "height": 3613
  },
  {
    "hash": "a884fa1e-7129-4560-be67-200207966d96",
    "datetime": 1669750002,
    "height": 3494
  },
  {
    "hash": "03cca5dc-4a48-4783-8f6d-589718a7d390",
    "datetime": 1669745278,
    "height": 3576
  },
  {
    "hash": "13ff8c7c-047f-4707-861d-ac5aee00b201",
    "datetime": 1669747110,
    "height": 3962
  },
  {
    "hash": "d06c79dc-15dd-423d-a827-6e473cc1ca48",
    "datetime": 1669745246,
    "height": 3990
  },
  {
    "hash": "7a95fc68-c53e-4a93-9f0d-a53e1508ffcf",
    "datetime": 1669721532,
    "height": 3788
  },
  {
    "hash": "5d137e84-9194-4f19-926f-e37672fc49b2",
    "datetime": 1669740222,
    "height": 3426
  },
  {
    "hash": "cda6b5e8-dfba-4ab8-9e2c-be154af57313",
    "datetime": 1669730244,
    "height": 3451
  },
  {
    "hash": "b0872958-b7b4-441f-858f-c4d5530ba989",
    "datetime": 1669722630,
    "height": 3554
  },
  {
    "hash": "b90d8bec-a1e1-4f1e-91f1-43787bdbad05",
    "datetime": 1669747547,
    "height": 3988
  },
  {
    "hash": "08ffd679-8a4f-486e-afe7-780d587c8b53",
    "datetime": 1669740279,
    "height": 3331
  },
  {
    "hash": "8fccd3b2-1942-4ca5-ba86-d82caca28fe0",
    "datetime": 1669750250,
    "height": 3563
  },
  {
    "hash": "7659ff58-8908-4803-a143-220b3d99a938",
    "datetime": 1669731246,
    "height": 3011
  },
  {
    "hash": "341117f5-3b93-4f92-b8f6-9f22e6443e4a",
    "datetime": 1669726442,
    "height": 3212
  },
  {
    "hash": "fba8936a-ec79-4686-a20b-8e8bc62ecf26",
    "datetime": 1669745225,
    "height": 3801
  },
  {
    "hash": "9c98e939-d997-42d9-9b80-ca18579e9ef5",
    "datetime": 1669735790,
    "height": 3114
  },
  {
    "hash": "f5362e47-3e6e-46e7-ac6a-b99669162993",
    "datetime": 1669724212,
    "height": 3678
  },
  {
    "hash": "3a3b39a9-3a2a-4b02-a187-93da893d6cb8",
    "datetime": 1669726447,
    "height": 3358
  },
  {
    "hash": "aad484f9-b0b9-4c32-ba33-0694f685d7ad",
    "datetime": 1669733401,
    "height": 3563
  },
  {
    "hash": "2bf19dc7-8058-4cd8-8f50-685392abed69",
    "datetime": 1669745688,
    "height": 3340
  },
  {
    "hash": "6985333c-e7a5-4939-9c99-b06bcf53a1b1",
    "datetime": 1669731721,
    "height": 3812
  },
  {
    "hash": "6de5185a-3d2b-4368-b52f-0932184b20ad",
    "datetime": 1669750653,
    "height": 3207
  },
  {
    "hash": "045b69f3-3cba-4dd4-84a1-255bd3dbf6ec",
    "datetime": 1669743477,
    "height": 3585
  },
  {
    "hash": "4b879729-6f6e-47cb-abec-1e1868cde62e",
    "datetime": 1669734826,
    "height": 3949
  },
  {
    "hash": "9598c6fa-8f69-4db7-9bb8-d1b477c5e03b",
    "datetime": 1669744485,
    "height": 3152
  },
  {
    "hash": "cc4e080f-b867-48bc-aef2-fab0e6174505",
    "datetime": 1669729639,
    "height": 3054
  },
  {
    "hash": "b0be1431-70cd-44cd-acfe-7620db1355b2",
    "datetime": 1669749673,
    "height": 3904
  },
  {
    "hash": "71674243-a778-4d7b-a869-e8b36a25994d",
    "datetime": 1669747297,
    "height": 3662
  },
  {
    "hash": "9bfb11f8-28ab-4bb2-a1ef-f4d6f37cc4ad",
    "datetime": 1669737459,
    "height": 3516
  },
  {
    "hash": "3a1e1a55-921f-4e0d-b968-34541b0a1a6c",
    "datetime": 1669738306,
    "height": 3357
  },
  {
    "hash": "47bd373c-8b1b-442b-a526-84541e9adfc5",
    "datetime": 1669727150,
    "height": 3216
  },
  {
    "hash": "261afd1c-c453-48ad-a5b2-9a197fd787f8",
    "datetime": 1669743079,
    "height": 3404
  },
  {
    "hash": "ffda3625-97c0-4da8-9710-811ef90c184f",
    "datetime": 1669729463,
    "height": 3043
  },
  {
    "hash": "0966acee-8227-4152-a835-46316308a19c",
    "datetime": 1669723480,
    "height": 3822
  },
  {
    "hash": "390500b4-5b5b-4be2-98dc-60be2bbf439a",
    "datetime": 1669722070,
    "height": 3900
  },
  {
    "hash": "fa5d26e0-888b-436b-9e44-7920b9ba9a41",
    "datetime": 1669742932,
    "height": 3684
  },
  {
    "hash": "723e07ad-5ef3-4284-bb97-218ae18ba63c",
    "datetime": 1669738623,
    "height": 3443
  },
  {
    "hash": "52e5a40b-a8c2-4fbf-a8c1-64b1abb815f7",
    "datetime": 1669735182,
    "height": 3559
  },
  {
    "hash": "03f59845-bc07-4da2-a2c0-f1f742066164",
    "datetime": 1669729413,
    "height": 3935
  },
  {
    "hash": "8c7a07d9-1fca-48dd-8249-95cde26caebf",
    "datetime": 1669730092,
    "height": 3854
  },
  {
    "hash": "6beb11b2-e990-4a23-a0ad-c6a7f4c47aee",
    "datetime": 1669727164,
    "height": 3859
  },
  {
    "hash": "fc842f4f-32b1-4133-9b11-10900c7d74e6",
    "datetime": 1669730721,
    "height": 3705
  },
  {
    "hash": "7898391b-2dfe-4ad6-a4bc-a7f342030e53",
    "datetime": 1669734885,
    "height": 3405
  },
  {
    "hash": "95a1b1cd-1e3b-451a-9e3b-61cc78980b80",
    "datetime": 1669735619,
    "height": 3166
  },
  {
    "hash": "d7591774-66dc-4364-9dd0-46023df96323",
    "datetime": 1669735823,
    "height": 3797
  },
  {
    "hash": "953bd803-8909-434a-a1d6-3f89766c532a",
    "datetime": 1669721249,
    "height": 3538
  },
  {
    "hash": "bd1de9af-4a91-4c9f-b702-94e43a68aec7",
    "datetime": 1669741693,
    "height": 3238
  },
  {
    "hash": "b3170a5c-7480-4aa3-b9fe-137c6a5d7d22",
    "datetime": 1669747350,
    "height": 3362
  },
  {
    "hash": "fec2b8db-6751-4572-894b-96721abde9d6",
    "datetime": 1669731089,
    "height": 3112
  },
  {
    "hash": "ca31c222-617a-4ffa-b2ee-49db2313a4e5",
    "datetime": 1669730078,
    "height": 3644
  },
  {
    "hash": "f9d1485d-d38d-4c2d-a143-5f3c42ff69c2",
    "datetime": 1669729852,
    "height": 3774
  },
  {
    "hash": "01fdc5cf-d8f5-4092-a19f-e1d71ac499b2",
    "datetime": 1669739559,
    "height": 3880
  },
  {
    "hash": "939cc7d6-54b1-4e49-8a2e-a0454e4af762",
    "datetime": 1669735783,
    "height": 3728
  },
  {
    "hash": "f17aaae2-8bd5-433a-9792-45e3c96762a0",
    "datetime": 1669731803,
    "height": 3715
  },
  {
    "hash": "c4bd9975-d2ab-4516-b517-840619600a6c",
    "datetime": 1669724569,
    "height": 3719
  },
  {
    "hash": "9183aeaf-9978-4f99-bed9-c1f9acd0e9b2",
    "datetime": 1669734783,
    "height": 3320
  },
  {
    "hash": "f78bb186-e588-4257-956a-885428db410a",
    "datetime": 1669728513,
    "height": 3851
  },
  {
    "hash": "638353dc-ce8b-4031-8c89-9af299d38ccf",
    "datetime": 1669734202,
    "height": 3264
  },
  {
    "hash": "36d16fa3-eb66-4449-ae18-d14875ac4c35",
    "datetime": 1669728341,
    "height": 3684
  },
  {
    "hash": "93642ae1-7605-474e-b5bd-68c7f71dd6dc",
    "datetime": 1669739930,
    "height": 3980
  },
  {
    "hash": "c2a9b348-add8-457f-8967-94f73f117960",
    "datetime": 1669742996,
    "height": 3698
  },
  {
    "hash": "f1f57457-3fa7-48b6-a71d-88e3d5392c24",
    "datetime": 1669737602,
    "height": 3865
  },
  {
    "hash": "116f3311-f26a-418f-82eb-713ff7709077",
    "datetime": 1669729651,
    "height": 3321
  },
  {
    "hash": "2f44d3ef-5c2b-4750-a293-d3c93abd757c",
    "datetime": 1669737641,
    "height": 3605
  },
  {
    "hash": "2b8c036c-c44b-4f2d-b1c2-aef157704229",
    "datetime": 1669722022,
    "height": 3381
  },
  {
    "hash": "b569a5e9-363d-4a3f-9d91-966c867c6de1",
    "datetime": 1669727382,
    "height": 3042
  },
  {
    "hash": "11c50aea-4ede-4784-84d1-322ece46bbdb",
    "datetime": 1669739184,
    "height": 3227
  },
  {
    "hash": "5da9166d-140d-4b14-ab0b-674006eb51e8",
    "datetime": 1669727649,
    "height": 3161
  }
]
