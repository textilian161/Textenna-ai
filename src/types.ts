export interface Substrate {
  id: string;
  name: string;
  epsilonR: number; // Dielectric constant
  tanDelta: number; // Loss tangent
  thickness: number; // Typical thickness in mm
  description: string;
}

export interface ConductiveMaterial {
  id: string;
  name: string;
  conductivity: number; // S/m
  sheetResistance: number; // Ohms/square
  description: string;
}

export type AntennaTypeId = "patch" | "cpw_monopole" | "pifa" | "dipole";

export interface AntennaType {
  id: AntennaTypeId;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  typicalSAR: "Low (Shielded)" | "Medium (High Backing)" | "High (Omnidirectional)" | "Very Low (Double Shielded)";
  bodyEffect: string;
  radiationPattern: string;
}

export interface AntennaDimensions {
  width: number;
  length: number;
  effectiveEpsilon?: number;
  deltaL?: number;
  groundWidth: number;
  groundLength: number;
  feedlineWidth: number;
  feedlineLength: number;
  gap?: number; // for CPW
  resonantFreq: number; // GHz
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
