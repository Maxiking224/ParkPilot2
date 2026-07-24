export type ParkingOfferStatus =
  | 'scheduled'
  | 'active'
  | 'expired';

export type ParkingOffer = {
  id: string;
  address: string;

  latitude: number;
  longitude: number;

  availableFrom: string;
  expiresAt: string;
  createdAt: string;

  status: ParkingOfferStatus;
};