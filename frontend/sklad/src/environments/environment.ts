// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { WAREHOUSE } from "./dataset";

// import { Company } from "../app/shared/models/company.model";

export const environment = {
  production: false,
  API_SERVER: "http://192.168.10.127:8082",
  // API_SERVER: "http://192.168.10.127:8082",
  // FRONT_SERVER: "http://192.168.10.127:4200",
  FRONT_SERVER: "http://192.168.10.127:4200",
  DEFAULT_COMPANY: WAREHOUSE
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
