export interface Salon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  coverImage: string | null;
  currency: string | null;
  requireBookingApproval: boolean;
  allowOnlineBooking: boolean;
}