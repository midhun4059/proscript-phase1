export enum SectionFormat {
  BULLET = "Bullet Points",
  PARAGRAPH = "Paragraph Text",
  TABLE = "Table",
}

export interface Medication {
  id: string;
  slNo: number;
  medicine: string;
  dose: string;
  frequency: string;
  days: string;
  remarks: string;
}

export interface CustomSection {
  id: string;
  title: string;
  format: SectionFormat;
  content: any; // Can be string[] for bullets, string for para, or any[] for table
}

export interface PatientDetails {
  name: string;
  age: string;
  sex: "Male" | "Female" | "Other";
  date: string;
  phone?: string;
}

export interface PrescriptionData {
  patient: PatientDetails;
  diagnoses: string[];
  medications: Medication[];
  labInvestigations: string[];
  radiologyInvestigations: string[];
  advice: string[];
  customSections: CustomSection[];
  letterhead?: string;
  hideSystemHeader: boolean;
  // Flags to show/hide default sections
  showDiagnosis?: boolean;
  showMedications?: boolean;
  showLabInvestigations?: boolean;
  showRadiologyInvestigations?: boolean;
  showAdvice?: boolean;
}
