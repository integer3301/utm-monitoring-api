export interface UTMInfo {
  shopId: string;
  url: string;
}

export interface CertificateInfo {
  certType: string;
  startDate: string;
  expireDate: string;
  isValid: string;
  issuer: string;
}

export interface UTMApiResponse {
  ownerId: string;
  rsa: CertificateInfo;
  gost: CertificateInfo;
  version: string;
  contour: string;
  rsaError: string | null;
  checkInfo: string;
  db: { createDate: string; ownerId: string };
  license: boolean;
}
