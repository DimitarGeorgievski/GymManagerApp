export interface Plan {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: string;
  updatedAt: string;
}
export interface CreatePlanReq {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}