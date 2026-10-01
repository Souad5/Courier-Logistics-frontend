import type { Dictionary } from "..";
import { admin } from "./admin";
import { auth } from "./auth";
import { booking } from "./booking";
import { common } from "./common";
import { courier } from "./courier";
import { customer } from "./customer";
import { enums } from "./enums";
import { errors } from "./errors";
import { hubs } from "./hubs";
import { landing } from "./landing";
import { meta } from "./meta";
import { nav } from "./nav";
import { parcels } from "./parcels";
import { payments } from "./payments";
import { profile } from "./profile";
import { publicPages } from "./publicPages";
import { tracking } from "./tracking";
import { validation } from "./validation";

export const bn: Dictionary = {
  common,
  nav,
  enums,
  validation,
  errors,
  meta,
  landing,
  publicPages,
  tracking,
  auth,
  booking,
  customer,
  payments,
  profile,
  admin,
  courier,
  parcels,
  hubs,
};
