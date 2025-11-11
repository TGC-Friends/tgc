export type EventType = 'None' | 'PWS' | 'Actual' | 'ROM';

export interface EventDetails {
  date: string;
  type: EventType;
  venue: string;
}

export interface FormData {
  bridename: string;
  groomname: string;
  phonenum: string;
  emailfield: string;
  howdidyouhear: string;
  eventdate1: string;
  eventtype1: EventType;
  eventvenue1: string;
  eventdate2: string;
  eventtype2: EventType;
  eventvenue2: string;
  eventdate3: string;
  eventtype3: EventType;
  eventvenue3: string;
  requiredoutfit: string[];
  noofgowns: number | '';
  preferredoutfit: string[];
  preferredoutOthers: string;
  preferredstyle: string[];
  preferredstyleOthers: string;
  preferredNeckline: string[];
  preferredNeckOthers: string;
  attendant: string;
  additionalnotes: string;
  cust_id?: string;
}

export interface ApiResponse {
  tabletform_msg?: string;
  custform_msg?: string;
  availcustID?: string | null;
  orders_msg?: string;
  customer_msg?: string;
  invoice_msg?: string;
  fittingdates_msg?: string;
  error?: string;
}

export type Attendant = 'Kelly' | 'Shermin' | 'Vivien' | 'Michelle' | 'Skylar';

export const ATTENDANTS: Attendant[] = ['Kelly', 'Shermin', 'Vivien', 'Michelle', 'Skylar'];

export const EVENT_TYPES: EventType[] = ['None', 'PWS', 'Actual', 'ROM'];

export const REQUIRED_OUTFIT_OPTIONS = ['Bridal Gown', 'Evening Gown'];

export const PREFERRED_OUTFIT_OPTIONS = [
  'Mermaid',
  'Ball',
  'A-Line',
  'Modified-Line',
  'Column',
  'Trumpet',
  'No Preference'
];

export const PREFERRED_STYLE_OPTIONS = [
  'Bead Dress',
  'Lace Dress',
  'Plain',
  'No Preference'
];

export const PREFERRED_NECKLINE_OPTIONS = [
  'Sweetheart',
  'V-Neck',
  'Off-Shoulder',
  'Straight Across',
  'Illusion',
  'Bateau_Boat_Neck'
];

