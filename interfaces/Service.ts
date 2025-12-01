export interface Service {
  id: string;
  salonId: string;
  name: string;
  description: string | null;
  price: string;
  duration: number;
  category: string | null;
  imageUrl: string | null;
  isActive: boolean;
}