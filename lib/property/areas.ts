/**
 * Static reference data for Nigerian property areas.
 *
 * `baseRateSqm` is an indicative NGN-per-square-metre land rate used only as a
 * prior when there are too few comparables to value from. It is not a
 * valuation. Comparable sales always take precedence.
 */

export interface Area {
  code: string;
  name: string;
  lga: string;
  state: string;
  baseRateSqm: number;
}

export const AREAS: Area[] = [
  // Lagos
  { code: 'LA-IKY', name: 'Ikoyi', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 1_150_000 },
  { code: 'LA-VIC', name: 'Victoria Island', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 980_000 },
  { code: 'LA-BAN', name: 'Banana Island', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 1_450_000 },
  { code: 'LA-LK1', name: 'Lekki Phase 1', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 620_000 },
  { code: 'LA-LK2', name: 'Lekki Phase 2', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 340_000 },
  { code: 'LA-AJA', name: 'Ajah', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 185_000 },
  { code: 'LA-SAN', name: 'Sangotedo', lga: 'Eti-Osa', state: 'Lagos', baseRateSqm: 120_000 },
  { code: 'LA-IKJ', name: 'Ikeja GRA', lga: 'Ikeja', state: 'Lagos', baseRateSqm: 540_000 },
  { code: 'LA-MAG', name: 'Magodo', lga: 'Kosofe', state: 'Lagos', baseRateSqm: 310_000 },
  { code: 'LA-YAB', name: 'Yaba', lga: 'Lagos Mainland', state: 'Lagos', baseRateSqm: 280_000 },
  { code: 'LA-SUR', name: 'Surulere', lga: 'Surulere', state: 'Lagos', baseRateSqm: 240_000 },
  { code: 'LA-IKO', name: 'Ikorodu', lga: 'Ikorodu', state: 'Lagos', baseRateSqm: 65_000 },
  { code: 'LA-EPE', name: 'Epe', lga: 'Epe', state: 'Lagos', baseRateSqm: 38_000 },
  { code: 'LA-BAD', name: 'Badagry', lga: 'Badagry', state: 'Lagos', baseRateSqm: 32_000 },

  // Abuja (FCT)
  { code: 'AB-MAI', name: 'Maitama', lga: 'AMAC', state: 'FCT', baseRateSqm: 720_000 },
  { code: 'AB-ASO', name: 'Asokoro', lga: 'AMAC', state: 'FCT', baseRateSqm: 680_000 },
  { code: 'AB-WUS', name: 'Wuse II', lga: 'AMAC', state: 'FCT', baseRateSqm: 460_000 },
  { code: 'AB-GAR', name: 'Garki', lga: 'AMAC', state: 'FCT', baseRateSqm: 380_000 },
  { code: 'AB-JAB', name: 'Jabi', lga: 'AMAC', state: 'FCT', baseRateSqm: 330_000 },
  { code: 'AB-GWA', name: 'Gwarinpa', lga: 'AMAC', state: 'FCT', baseRateSqm: 210_000 },
  { code: 'AB-LUG', name: 'Lugbe', lga: 'AMAC', state: 'FCT', baseRateSqm: 95_000 },
  { code: 'AB-KUJ', name: 'Kuje', lga: 'Kuje', state: 'FCT', baseRateSqm: 45_000 },
];

export const STATES = ['Lagos', 'FCT', 'Ogun', 'Rivers', 'Oyo', 'Kano', 'Enugu'];

export function findArea(location: string): Area | undefined {
  const q = location.trim().toLowerCase();
  if (!q) return undefined;
  return (
    AREAS.find((a) => a.name.toLowerCase() === q) ??
    AREAS.find((a) => q.includes(a.name.toLowerCase())) ??
    AREAS.find((a) => a.code.toLowerCase() === q)
  );
}

export function areasInState(state: string): Area[] {
  return AREAS.filter((a) => a.state.toLowerCase() === state.toLowerCase());
}
