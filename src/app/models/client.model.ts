export interface Client {
  clientId: number;
  name: string;
  taxId?: string;
  street: string;
  exteriorNumber: string;
  neighborhood: string;
  state: string;
  city: string;
  municipality?: string;
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
  subBranchTypeId: string;
  temporalLimit?: number;
  permanentLimit?: number;
  temporalLimitDate?: Date;
  balance?: number;
  percentage?: number;
  subClients?: SubClient[];
}

export interface SubClient {
  id: number;
  name: string;
  username: string;
  email: string;
  isActive: number;
  password?: string;
  clientId?: number;
}