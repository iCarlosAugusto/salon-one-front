export interface Employee {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  hiredAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}