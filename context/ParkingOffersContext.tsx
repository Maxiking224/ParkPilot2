import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { ParkingOffer } from '@/types/ParkingOffer';

type NewParkingOffer = Omit<
  ParkingOffer,
  'id' | 'createdAt' | 'status'
>;

type ParkingOffersContextValue = {
  offers: ParkingOffer[];
  addOffer: (offer: NewParkingOffer) => ParkingOffer;
  removeOffer: (offerId: string) => void;
};

const ParkingOffersContext =
  createContext<ParkingOffersContextValue | null>(null);

type ParkingOffersProviderProps = {
  children: ReactNode;
};

export function ParkingOffersProvider({
  children,
}: ParkingOffersProviderProps) {
  const [offers, setOffers] = useState<ParkingOffer[]>([]);

  function addOffer(
    newOffer: NewParkingOffer
  ): ParkingOffer {
    const now = Date.now();

    const offer: ParkingOffer = {
      ...newOffer,
      id: `${now}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,
      createdAt: new Date(now).toISOString(),
      status:
        new Date(newOffer.availableFrom).getTime() > now
          ? 'scheduled'
          : 'active',
    };

    setOffers((currentOffers) => [
      ...currentOffers,
      offer,
    ]);

    return offer;
  }

  function removeOffer(offerId: string) {
    setOffers((currentOffers) =>
      currentOffers.filter(
        (offer) => offer.id !== offerId
      )
    );
  }

  /*
   * Einmal pro Sekunde:
   * - zukünftige Angebote werden aktiv
   * - abgelaufene Angebote werden entfernt
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setOffers((currentOffers) =>
        currentOffers
          .filter(
            (offer) =>
              new Date(offer.expiresAt).getTime() > now
          )
          .map((offer) => ({
            ...offer,
            status:
              new Date(
                offer.availableFrom
              ).getTime() > now
                ? 'scheduled'
                : 'active',
          }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({
      offers,
      addOffer,
      removeOffer,
    }),
    [offers]
  );

  return (
    <ParkingOffersContext.Provider value={value}>
      {children}
    </ParkingOffersContext.Provider>
  );
}

export function useParkingOffers() {
  const context = useContext(
    ParkingOffersContext
  );

  if (!context) {
    throw new Error(
      'useParkingOffers muss innerhalb des ParkingOffersProvider verwendet werden.'
    );
  }

  return context;
}