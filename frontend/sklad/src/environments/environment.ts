// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Company } from "../app/shared/models/company.model";

export const environment = {
  production: false,
  API_SERVER: "http://localhost:8082",
  // API_SERVER: "http://192.168.10.127:8082",
  // FRONT_SERVER: "http://192.168.10.127:4200",
  FRONT_SERVER: "http://localhost:4200",
  DEFAULT_COMPANY: {
    id: 0,
    name: "UAB SAFETECH",
    image: null,
    user: [],
    imageData: [
      {
        id: 6,
        name: "7.jpg",
        hash: "DoO1hiiq1_Fo826uag9OvFiUEqNDWqAfcwPh0zwWfNI",
        type: "image/jpeg",
      },
      {
        id: 7,
        name: "viber_image_2.jpg",
        hash: "oHTo67Y-Te_FwZB-D-YkNKu_6LVrv-YzO3SCNh2K7_8",
        type: "image/jpeg",
      },
      {
        id: 14,
        name: "8.jpg",
        hash: "FwhY6QFkJacIphJds5ssa275zfZus8JHP9Lp0t5Q-OU",
        type: "image/jpeg",
      },
      {
        id: 15,
        name: "1.jpg",
        hash: "Uwnr7XI6A5is1yGCl8RTeo6e8NOQ3JnIAO1-R7kjzZo",
        type: "image/jpeg",
      },
      {
        id: 16,
        name: "5.jpg",
        hash: "6NX90tjcrdGp-FnFeOMZk1PdIUWgh4yDNGCT970r3Wk",
        type: "image/jpeg",
      },
      {
        id: 17,
        name: "13.jpg",
        hash: "LSsdX6vG2eQAuZH2no4MfsaFx25XCe-vkH53OthNPtI",
        type: "image/jpeg",
      },
      {
        id: 20,
        name: "3.jpg",
        hash: "O_iKWFq_CrOuB7m0KUfs0sxjtmiVVVrPQ9qOmt3kJmI",
        type: "image/jpeg",
      },
      {
        id: 21,
        name: "11.jpg",
        hash: "He5KWkGzNw9kRNlxMCuolYyN97PlSb8yc7CmgaNnBTk",
        type: "image/jpeg",
      },
      {
        id: 22,
        name: "2.jpg",
        hash: "Hl6KFrG-8Oxu17gUhlDi3InCWyFy9amn2wyROzphpLw",
        type: "image/jpeg",
      },
      {
        id: 23,
        name: "10.jpg",
        hash: "deFZ_FpGODsx0DI-RBEmQ10vHlcEcNHxhQCJqycjS54",
        type: "image/jpeg",
      },
      {
        id: 24,
        name: "14.jpg",
        hash: "NO4smiD_s5wTZ_YbD30OaCZXTeaS3mway4qMFMxrP_I",
        type: "image/jpeg",
      },
      {
        id: 25,
        name: "15.jpg",
        hash: "HJKxfTEXMx9BiCAdX-D3N8uauUkZMa1Oo1eDxkoz2CM",
        type: "image/jpeg",
      },
      {
        id: 26,
        name: "4.jpg",
        hash: "U0n3JdriLXmHgwacU3ubDRPwhoSchSrGfT0VBKx4XKs",
        type: "image/jpeg",
      },
      {
        id: 27,
        name: "12.jpg",
        hash: "sULeVAvEzktDKkUfQVC092B6s1zPlKzpg0y6AL36kUY",
        type: "image/jpeg",
      },
      {
        id: 28,
        name: "9.jpg",
        hash: "aXKhblibaGOPguxLmhJyfxLXBwm_DbFT4S_1fTnRj6g",
        type: "image/jpeg",
      },
      {
        id: 29,
        name: "6.jpg",
        hash: "m-_nKMDhu0oI15AgPFuoGfxFTv7sFVioOSZzj7PovNo",
        type: "image/jpeg",
      }
    ],
    locations: [
      {
        id: 1,
        name: "Vilnius 1",
        image: null,
        description: "Pagrindinis",
        street_and_number: "Laisvės pr.",
        city_or_town: "Vilnius",
        country_code: "LT",
        postal_code: "LT-07522",
        phone_number: "862841926",
        phone_number_two: null
      },
      {
        id: 2,
        name: "Vilnius 2",
        image: null,
        description: "",
        street_and_number: "Tramvajų g.",
        city_or_town: "Vilnius",
        country_code: "LT",
        postal_code: "LT-02210",
        phone_number: "860154541",
        phone_number_two: "862093872"
      }
    ],
    items: [
      {
        id: 1,
        code: "EGISH-930000001",
        name: "4600TX ATM",
        image: {
          id: 25,
          name: "15.jpg",
          hash: "HJKxfTEXMx9BiCAdX-D3N8uauUkZMa1Oo1eDxkoz2CM",
          type: "image/jpeg",
          size: 11125,
          compressedSize: 5624,
          date: "2024-09-15"
        },
        color: 16777215,
        columns: [],
        parents: {
          2: 1,
          8: 1,
          10: 1,
          32: 1,
          33: 1,
          36: 1
        },
        quantity: {
          1: 5,
          2: 0
        },
        suppliers: [],
        product: false,
        description: "ATM Machine"
      },
      {
        id: 2,
        code: "EGISH-940001273",
        name: "Dispenser",
        image: {
          id: 16,
          name: "5.jpg",
          hash: "6NX90tjcrdGp-FnFeOMZk1PdIUWgh4yDNGCT970r3Wk",
          type: "image/jpeg",
          size: 8510,
          compressedSize: 8250,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [
          {
            id: 669,
            name: "plotis",
            value: "10",
            color: 16777215,
            width: null
          }
        ],
        parents: {
          34: 1,
          35: 3,
          39: 1,
          40: 2
        },
        quantity: {
          1: 2,
          2: 5
        },
        suppliers: [
          {
            id: 12,
            name: "UAB Enguva",
            image: null,
            street_and_number: "Rigos g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-14129",
            phone_number: "865491001",
            phone_number_two: "+37052041941"
          }
        ],
        product: false,
        description: "a"
      },
      {
        id: 8,
        code: "EGISH-940001113",
        name: "Computer core",
        image: {
          id: 14,
          name: "8.jpg",
          hash: "FwhY6QFkJacIphJds5ssa275zfZus8JHP9Lp0t5Q-OU",
          type: "image/jpeg",
          size: 9032,
          compressedSize: 8292,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [
          {
            id: 649,
            name: "ilgis mm",
            value: "123",
            color: 16777215,
            width: null
          },
          {
            id: 650,
            name: "plotis",
            value: "5",
            color: 16777215,
            width: null
          }
        ],
        parents: {},
        quantity: {
          1: 0,
          2: 0
        },
        suppliers: [
          {
            id: 12,
            name: "UAB Enguva",
            image: null,
            street_and_number: "Rigos g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-14129",
            phone_number: "865491001",
            phone_number_two: "+37052041941"
          },
          {
            id: 13,
            name: "UAB Ella",
            image: null,
            street_and_number: "Džiaugsmo g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-66444",
            phone_number: "862379237",
            phone_number_two: "+37052041866"
          }
        ],
        product: false,
        description: "des"
      },
      {
        id: 10,
        code: "EGISH-940026571",
        name: "BSC keyboard",
        image: {
          id: 17,
          name: "13.jpg",
          hash: "LSsdX6vG2eQAuZH2no4MfsaFx25XCe-vkH53OthNPtI",
          type: "image/jpeg",
          size: 3015,
          compressedSize: 2777,
          date: "2024-06-06"
        },
        color: 16056320,
        columns: [
          {
            id: 656,
            name: "ilgis mm",
            value: "1",
            color: 16777215,
            width: null
          }
        ],
        parents: {},
        quantity: {
          1: 25,
          2: 0
        },
        suppliers: [
          {
            id: 14,
            name: "UAB Purlita",
            image: null,
            street_and_number: "Ateities g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-93132",
            phone_number: "861936574",
            phone_number_two: "+37057781540"
          }
        ],
        product: false,
        description: ""
      },
      {
        id: 14,
        code: "EGISH-3805801420",
        name: "Power Cables",
        image: {
          id: 22,
          name: "2.jpg",
          hash: "Hl6KFrG-8Oxu17gUhlDi3InCWyFy9amn2wyROzphpLw",
          type: "image/jpeg",
          size: 4750,
          compressedSize: 4429,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [
          {
            id: 664,
            name: "ilgis mm",
            value: "990",
            color: 7935,
            width: null
          }
        ],
        parents: {},
        quantity: {
          1: 2,
          2: 0
        },
        suppliers: [
          {
            id: 14,
            name: "UAB Purlita",
            image: null,
            street_and_number: "Ateities g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-93132",
            phone_number: "861936574",
            phone_number_two: "+37057781540"
          }
        ],
        product: false,
        description: ""
      },
      {
        id: 23,
        code: "EGISH-910008633",
        name: "Frame",
        image: null,
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 0,
          2: 0
        },
        suppliers: [
          {
            id: 14,
            name: "UAB Purlita",
            image: null,
            street_and_number: "Ateities g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-93132",
            phone_number: "861936574",
            phone_number_two: "+37057781540"
          }
        ],
        product: false,
        description: ""
      },
      {
        id: 25,
        code: "EGISH-920007827",
        name: "bob",
        image: {
          id: 23,
          name: "10.jpg",
          hash: "deFZ_FpGODsx0DI-RBEmQ10vHlcEcNHxhQCJqycjS54",
          type: "image/jpeg",
          size: 2851,
          compressedSize: 2571,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 1,
          2: 0
        },
        suppliers: [
          {
            id: 15,
            name: "UAB Narvila",
            image: null,
            street_and_number: "Teatro g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-03107",
            phone_number: "864040842",
            phone_number_two: "+37062047953"
          },
          {
            id: 14,
            name: "UAB Purlita",
            image: null,
            street_and_number: "Ateities g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-93132",
            phone_number: "861936574",
            phone_number_two: "+37057781540"
          }
        ],
        product: false,
        description: ""
      },
      {
        id: 32,
        code: "EGISH-940035501",
        name: "hsdgh",
        image: {
          id: 28,
          name: "9.jpg",
          hash: "aXKhblibaGOPguxLmhJyfxLXBwm_DbFT4S_1fTnRj6g",
          type: "image/jpeg",
          size: 4638,
          compressedSize: 4235,
          date: "2024-09-15"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 1,
          2: 0
        },
        suppliers: [
          {
            id: 14,
            name: "UAB Purlita",
            image: null,
            street_and_number: "Ateities g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-93132",
            phone_number: "861936574",
            phone_number_two: "+37057781540"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 33,
        code: "EGISH-940035502",
        name: "15\" Screen",
        image: {
          id: 26,
          name: "4.jpg",
          hash: "U0n3JdriLXmHgwacU3ubDRPwhoSchSrGfT0VBKx4XKs",
          type: "image/jpeg",
          size: 2061,
          compressedSize: 1810,
          date: "2024-09-15"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 0,
          2: 0
        },
        suppliers: [
          {
            id: 14,
            name: "UAB Purlita",
            image: null,
            street_and_number: "Ateities g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-93132",
            phone_number: "861936574",
            phone_number_two: "+37057781540"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 34,
        code: "EGISH-940031606",
        name: "Feed Shaft",
        image: {
          id: 24,
          name: "14.jpg",
          hash: "NO4smiD_s5wTZ_YbD30OaCZXTeaS3mway4qMFMxrP_I",
          type: "image/jpeg",
          size: 1669,
          compressedSize: 1212,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 3,
          2: 0
        },
        suppliers: [
          {
            id: 12,
            name: "UAB Enguva",
            image: null,
            street_and_number: "Rigos g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-14129",
            phone_number: "865491001",
            phone_number_two: "+37052041941"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 35,
        code: "EGISH-940000313",
        name: "Gear",
        image: {
          id: 20,
          name: "3.jpg",
          hash: "O_iKWFq_CrOuB7m0KUfs0sxjtmiVVVrPQ9qOmt3kJmI",
          type: "image/jpeg",
          size: 1778,
          compressedSize: 1402,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 1,
          2: 0
        },
        suppliers: [
          {
            id: 13,
            name: "UAB Ella",
            image: null,
            street_and_number: "Džiaugsmo g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-66444",
            phone_number: "862379237",
            phone_number_two: "+37052041866"
          },
          {
            id: 15,
            name: "UAB Narvila",
            image: null,
            street_and_number: "Teatro g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-03107",
            phone_number: "864040842",
            phone_number_two: "+37062047953"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 36,
        code: "EGISH-930000021",
        name: "Control Board",
        image: {
          id: 15,
          name: "1.jpg",
          hash: "Uwnr7XI6A5is1yGCl8RTeo6e8NOQ3JnIAO1-R7kjzZo",
          type: "image/jpeg",
          size: 6051,
          compressedSize: 5737,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 1,
          2: 0
        },
        suppliers: [
          {
            id: 13,
            name: "UAB Ella",
            image: null,
            street_and_number: "Džiaugsmo g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-66444",
            phone_number: "862379237",
            phone_number_two: "+37052041866"
          },
          {
            id: 15,
            name: "UAB Narvila",
            image: null,
            street_and_number: "Teatro g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-03107",
            phone_number: "864040842",
            phone_number_two: "+37062047953"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 38,
        code: "EGISH-930000107",
        name: "Plastc cover",
        image: {
          id: 27,
          name: "12.jpg",
          hash: "sULeVAvEzktDKkUfQVC092B6s1zPlKzpg0y6AL36kUY",
          type: "image/jpeg",
          size: 1865,
          compressedSize: 1665,
          date: "2024-09-15"
        },
        color: 16777215,
        columns: [],
        parents: {
          39: 2
        },
        quantity: {
          1: 50,
          2: 0
        },
        suppliers: [
          {
            id: 13,
            name: "UAB Ella",
            image: null,
            street_and_number: "Džiaugsmo g.",
            city_or_town: "Vilnius",
            country_code: "LT",
            postal_code: "LT-66444",
            phone_number: "862379237",
            phone_number_two: "+37052041866"
          },
          {
            id: 15,
            name: "UAB Narvila",
            image: null,
            street_and_number: "Teatro g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-03107",
            phone_number: "864040842",
            phone_number_two: "+37062047953"
          }
        ],
        product: false,
        description: ""
      },
      {
        id: 39,
        code: "EGISH-930000130",
        name: "Electric Motor",
        image: {
          id: 29,
          name: "6.jpg",
          hash: "m-_nKMDhu0oI15AgPFuoGfxFTv7sFVioOSZzj7PovNo",
          type: "image/jpeg",
          size: 1424,
          compressedSize: 1246,
          date: "2024-09-15"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 6,
          2: 0
        },
        suppliers: [
          {
            id: 18,
            name: "UAB AT Service",
            image: null,
            street_and_number: "Pakalnės g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "Lt-05286",
            phone_number: "869330357",
            phone_number_two: "+37050310145"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 40,
        code: "EGISH-930000131",
        name: "Belt 1",
        image: {
          id: 21,
          name: "11.jpg",
          hash: "He5KWkGzNw9kRNlxMCuolYyN97PlSb8yc7CmgaNnBTk",
          type: "image/jpeg",
          size: 1671,
          compressedSize: 1413,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 54,
          2: 0
        },
        suppliers: [
          {
            id: 18,
            name: "UAB AT Service",
            image: null,
            street_and_number: "Pakalnės g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "Lt-05286",
            phone_number: "869330357",
            phone_number_two: "+37050310145"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 41,
        code: "EGISH-930000132",
        name: "Belt 2",
        image: {
          id: 21,
          name: "11.jpg",
          hash: "He5KWkGzNw9kRNlxMCuolYyN97PlSb8yc7CmgaNnBTk",
          type: "image/jpeg",
          size: 1671,
          compressedSize: 1413,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 77,
          2: 0
        },
        suppliers: [
          {
            id: 18,
            name: "UAB AT Service",
            image: null,
            street_and_number: "Pakalnės g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-05286",
            phone_number: "869330357",
            phone_number_two: "+37050310145"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 42,
        code: "EGISH-930000133",
        name: "Belt 3",
        image: {
          id: 21,
          name: "11.jpg",
          hash: "He5KWkGzNw9kRNlxMCuolYyN97PlSb8yc7CmgaNnBTk",
          type: "image/jpeg",
          size: 1671,
          compressedSize: 1413,
          date: "2024-06-06"
        },
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 100,
          2: 0
        },
        suppliers: [
          {
            id: 18,
            name: "UAB AT Service",
            image: null,
            street_and_number: "Pakalnės g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-05286",
            phone_number: "869330357",
            phone_number_two: "+37050310145"
          }
        ],
        product: false,
        description: null
      },
      {
        id: 43,
        code: "EGISH-930000134",
        name: "Belt 6",
        image: null,
        color: 16777215,
        columns: [],
        parents: {},
        quantity: {
          1: 0,
          2: 0
        },
        suppliers: [
          {
            id: 18,
            name: "UAB AT Service",
            image: null,
            street_and_number: "Pakalnės g.",
            city_or_town: "Kaunas",
            country_code: "LT",
            postal_code: "LT-05286",
            phone_number: "869330357",
            phone_number_two: "+37050310145"
          }
        ],
        product: false,
        description: null
      }
    ],
    suppliers: [
      {
        id: 18,
        name: "UAB AT Service",
        image: null,
        website: "atshop.com",
        description: "Elektronikos komponentai",
        street_and_number: "Pakalnės g.",
        city_or_town: "Kaunas",
        country_code: "LT",
        postal_code: "LT-05286",
        phone_number: "869330357",
        phone_number_two: "+37050310145"
      },
      {
        id: 15,
        name: "UAB Narvila",
        image: null,
        website: "narvila.lt",
        description: "Elektronikos komponentai",
        street_and_number: "Teatro g.",
        city_or_town: "Kaunas",
        country_code: "LT",
        postal_code: "LT-03107",
        phone_number: "864040842",
        phone_number_two: "+37062047953"
      },
      {
        id: 14,
        name: "UAB Purlita",
        image: null,
        website: "purlita.lt",
        description: "Laidai, kabeliai",
        street_and_number: "Ateities g.",
        city_or_town: "Vilnius",
        country_code: "LT",
        postal_code: "LT-93132",
        phone_number: "861936574",
        phone_number_two: "+37057781540"
      },
      {
        id: 13,
        name: "UAB Ella",
        image: null,
        website: "ella.lt",
        description: "Metalo apdirbimas",
        street_and_number: "Džiaugsmo g.",
        city_or_town: "Vilnius",
        country_code: "LT",
        postal_code: "LT-66444",
        phone_number: "862379237",
        phone_number_two: "+37052041866"
      },
      {
        id: 12,
        name: "UAB Enguva",
        image: null,
        website: "Ringuva.lt",
        description: "Guminės dalys",
        street_and_number: "Rigos g.",
        city_or_town: "Vilnius",
        country_code: "LT",
        postal_code: "LT-14129",
        phone_number: "865491001",
        phone_number_two: "+37052041941"
      }
    ],
    description: "This is an evaluation version, which is using an in-memory database for storing items. To try out the version that uses API, sign up and create new company."
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
