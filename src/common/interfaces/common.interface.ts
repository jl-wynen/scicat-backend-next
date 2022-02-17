import { ScientificRelation } from "../scientific-relation.enum";

export interface IScientificFilter {
  lhs: string;
  relation: ScientificRelation;
  rhs: string | number;
  unit: string | undefined;
}

export interface IAxiosError {
  response?: {
    data: Record<string, unknown>;
    status: number;
    headers: Record<string, unknown>;
  };
  request?: Record<string, unknown>;
  message: unknown;
  config: Record<string, unknown>;
}
