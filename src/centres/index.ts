import type { CentreDefinition } from "@/config/types";

// prettier-ignore
/* CENTRE IMPORTS — `npm run create-centre` inserts new lines above the marker */
import demoCentre from "./demo-centre";
/* END CENTRE IMPORTS */

/**
 * Every centre this repository can deploy.
 *
 * Registering a centre here is the single shared-code edit required to add a
 * new site; everything else lives in `src/centres/<id>/` and
 * `public/centres/<id>/`. Deployment then only differs by `SITE_ID`.
 */
export const centreRegistry = {
  /* CENTRE REGISTRY — `npm run create-centre` inserts new lines above the marker */
  "demo-centre": demoCentre,
  /* END CENTRE REGISTRY */
} satisfies Record<string, CentreDefinition>;

export type CentreId = keyof typeof centreRegistry;

export const centreIds = Object.keys(centreRegistry) as CentreId[];
