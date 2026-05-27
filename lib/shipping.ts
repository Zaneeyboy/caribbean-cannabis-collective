export type ShippingZone = 'US' | 'CARIBBEAN' | 'CANADA' | 'WORLDWIDE';

export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  priceCents: number;
  estimatedDays: string;
}

export interface ZoneConfig {
  id: ShippingZone;
  label: string;
  flag: string;
  options: ShippingOption[];
  freeThresholdCents: number | null;
  dutyNotice?: string;
  countries?: string[];
}

export const SHIPPING_ZONES: Record<ShippingZone, ZoneConfig> = {
  US: {
    id: 'US',
    label: 'United States',
    flag: '🇺🇸',
    options: [
      {
        id: 'us-standard',
        label: 'Standard Shipping',
        description: 'USPS / UPS Ground',
        priceCents: 899,
        estimatedDays: '5–7 business days',
      },
      {
        id: 'us-expedited',
        label: 'Expedited Shipping',
        description: 'UPS / FedEx 2–Day',
        priceCents: 1999,
        estimatedDays: '2–3 business days',
      },
    ],
    freeThresholdCents: 7500, // Free standard shipping over $75
  },
  CARIBBEAN: {
    id: 'CARIBBEAN',
    label: 'Caribbean',
    flag: '🌴',
    options: [
      {
        id: 'carib-standard',
        label: 'Caribbean Standard',
        description: 'DHL Express International',
        priceCents: 2499,
        estimatedDays: '7–14 business days',
      },
    ],
    freeThresholdCents: null,
    dutyNotice: 'Customer is responsible for any local import duties and taxes that may apply upon delivery.',
    countries: [
      'Antigua & Barbuda',
      'Aruba',
      'Barbados',
      'Belize',
      'Curaçao',
      'Dominica',
      'Grenada',
      'Guyana',
      'Jamaica',
      'St. Kitts & Nevis',
      'St. Lucia',
      'St. Vincent & The Grenadines',
      'Suriname',
      'Trinidad & Tobago',
    ],
  },
  CANADA: {
    id: 'CANADA',
    label: 'Canada',
    flag: '🇨🇦',
    options: [
      {
        id: 'ca-standard',
        label: 'Standard Shipping',
        description: 'Canada Post / DHL',
        priceCents: 1499,
        estimatedDays: '7–12 business days',
      },
      {
        id: 'ca-express',
        label: 'Express Shipping',
        description: 'DHL Express',
        priceCents: 2999,
        estimatedDays: '3–5 business days',
      },
    ],
    freeThresholdCents: 15000, // Free standard shipping on orders over $150 CAD equiv
    dutyNotice: 'Customer is responsible for any applicable Canadian customs duties and taxes.',
  },
  WORLDWIDE: {
    id: 'WORLDWIDE',
    label: 'Worldwide',
    flag: '🌍',
    options: [
      {
        id: 'intl-standard',
        label: 'International Standard',
        description: 'DHL / FedEx International',
        priceCents: 3499,
        estimatedDays: '10–21 business days',
      },
      {
        id: 'intl-express',
        label: 'International Express',
        description: 'DHL Express',
        priceCents: 5999,
        estimatedDays: '5–8 business days',
      },
    ],
    freeThresholdCents: null,
    dutyNotice: 'Import duties, taxes, and customs fees are the responsibility of the recipient and vary by country.',
  },
};

export function getShippingCost(zone: ShippingZone, optionId: string, subtotalCents: number): number {
  const zoneConfig = SHIPPING_ZONES[zone];
  const option = zoneConfig.options.find((o) => o.id === optionId);
  if (!option) return 0;

  // Free shipping thresholds (standard options only)
  const isStandardOption = optionId === 'us-standard' || optionId === 'ca-standard';
  if (isStandardOption && zoneConfig.freeThresholdCents !== null && subtotalCents >= zoneConfig.freeThresholdCents) {
    return 0;
  }

  return option.priceCents;
}
