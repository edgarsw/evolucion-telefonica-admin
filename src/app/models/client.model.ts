export interface Client {
  clientId: number;
  name: string;
  taxId?: string;
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  state: string;
  city: string;
  municipality?: string;
  postalCode: number;
  phone?: string;
  email?: string;
  consignmentPriceICC: string;
  latitude?: string;
  longitude?: string;
  zoneId?: string;
  businessType?: string;
  reference?: string;
  hasPhoto?: number;
  isCommercial?: number;
  isActiveClient: number;
  classification?: string;
  subBranchTypeId: string,
}
