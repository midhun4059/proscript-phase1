import React, { useState } from "react";
import {
  PrescriptionData,
  Medication,
  CustomSection,
  SectionFormat,
  PatientDetails,
} from "./types";
import DoctorHeader from "./components/DoctorHeader";
import PatientInfoSection from "./components/PatientInfoSection";
import MedicationTable from "./components/MedicationTable";
import DynamicListSection from "./components/DynamicListSection";
import CustomSectionBuilder from "./components/CustomSectionBuilder";
import PrescriptionPrint from "./components/PrescriptionPrint";
import TableSectionEditor from "./components/TableSectionEditor";
import ParagraphEditor from "./components/ParagraphEditor";
import { DEFAULT_LETTERHEAD_URL } from "./constants";

const initialPatient: PatientDetails = {
  name: "",
  age: "",
  sex: "Male",
  date: new Date().toISOString().split("T")[0],
  phone: "",
};
const App: React.FC = () => {
  const [prescription, setPrescription] = useState<PrescriptionData>({
    patient: initialPatient,
    diagnoses: [],
    medications: [
      {
        id: "1",
        slNo: 1,
        medicine: "",
        dose: "",
        frequency: "",
        days: "",
        remarks: "",
      },
    ],
    labInvestigations: [],
    radiologyInvestigations: [],
    advice: [],
    customSections: [],
    letterhead: DEFAULT_LETTERHEAD_URL, // Hardcoded background
    hideSystemHeader: false,
  });

  const [sectionsPerPage, setSectionsPerPage] = React.useState<number>(5);

  // Patient Updates
  const handlePatientUpdate = (patient: PatientDetails) => {
    setPrescription((prev) => ({ ...prev, patient }));
  };

  // Medication Management
  const addMedication = () => {
    setPrescription((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          id: Math.random().toString(36).substr(2, 9),
          slNo: prev.medications.length + 1,
          medicine: "",
          dose: "",
          frequency: "",
          days: "",
          remarks: "",
        },
      ],
    }));
  };

  const updateMedication = (
    id: string,
    field: keyof Medication,
    value: string,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  };

  const removeMedication = (id: string) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id),
    }));
  };

  // List Handlers
  const addListEntry = (
    key:
      | "diagnoses"
      | "labInvestigations"
      | "radiologyInvestigations"
      | "advice",
    item: string,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      [key]: [...prev[key], item],
    }));
  };

  const removeListEntry = (
    key:
      | "diagnoses"
      | "labInvestigations"
      | "radiologyInvestigations"
      | "advice",
    index: number,
  ) => {
    setPrescription((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // Custom Sections
  const handleAddCustomSection = (section: CustomSection) => {
    setPrescription((prev) => ({
      ...prev,
      customSections: [...prev.customSections, section],
    }));
  };

  const handleUpdateCustomSection = (id: string, content: any) => {
    setPrescription((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === id ? { ...s, content } : s,
      ),
    }));
  };

  const toggleHeader = () => {
    setPrescription((prev) => ({
      ...prev,
      hideSystemHeader: !prev.hideSystemHeader,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset the prescription form? This will clear all patient and medical data.",
      )
    ) {
      setPrescription({
        patient: {
          ...initialPatient,
          date: new Date().toISOString().split("T")[0],
        },
        diagnoses: [],
        medications: [
          {
            id: "1",
            slNo: 1,
            medicine: "",
            dose: "",
            frequency: "",
            days: "",
            remarks: "",
          },
        ],
        labInvestigations: [],
        radiologyInvestigations: [],
        advice: [],
        customSections: [],
        letterhead: DEFAULT_LETTERHEAD_URL, // Preserve letterhead on reset
        hideSystemHeader: false,
      });
    }
  };
  const handleDownloadPDF = async () => {
    const el = document.getElementById("prescription-root");
    if (!el) return alert("Unable to find print area for PDF generation.");

    // load html2pdf if not present
    const CDN =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js";
    if (!(window as any).html2pdf) {
      try {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = CDN;
          s.onload = () => resolve();
          s.onerror = () => reject();
          document.head.appendChild(s);
        });
      } catch (e) {
        return alert("Failed to load PDF library. Please try Print instead.");
      }
    }

    const patient = prescription.patient || { name: "patient", phone: "" };
    const name = (patient.name || "patient").trim().replace(/\s+/g, "_");
    const phone = (patient.phone || "").trim().replace(/\s+/g, "");
    const filename = phone ? `${phone}_${name}.pdf` : `${name}.pdf`;

    const opt = {
      margin: 0.5,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    } as any;

    // Clone the print area and prepare for rendering
    const clone = el.cloneNode(true) as HTMLElement;

    // Remove print-only class so it's visible to html2canvas
    clone.classList.remove("print-only");

    // Wrap clone in a container with proper positioning for html2canvas
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "0";
    wrapper.style.top = "0";
    wrapper.style.width = "100%";
    wrapper.style.backgroundColor = "white";
    wrapper.style.zIndex = "99999";
    wrapper.style.overflow = "auto";

    clone.style.position = "relative";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.width = "100%";
    clone.style.display = "block";
    clone.style.visibility = "visible";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Wait for letterhead image to load
    const waitForImages = () => {
      const imgs = Array.from(clone.querySelectorAll<HTMLImageElement>("img"));
      return Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (!img.src) return resolve();
              if (img.complete && img.naturalHeight > 0) return resolve();
              const checkImage = () => {
                if (img.complete && img.naturalHeight > 0) {
                  resolve();
                } else {
                  setTimeout(checkImage, 100);
                }
              };
              img.onload = () => resolve();
              img.onerror = () => resolve();
              checkImage();
            }),
        ),
      );
    };

    try {
      await waitForImages();
      // Add small delay to ensure all elements are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 500));
      await (window as any).html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed. You can use Print instead.");
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Editor View */}
      <div className="no-print max-w-5xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              ProScript <span className="text-blue-600">MD</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
              Medical Management System
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-red-600 font-bold text-sm uppercase transition-colors"
            >
              Reset Data
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold transition-all border border-gray-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
          </div>
        </header>

        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-bold text-gray-600">
              Sections Per Printed Page
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={sectionsPerPage}
              onChange={(e) =>
                setSectionsPerPage(
                  Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                )
              }
              className="w-20 px-2 py-1 border rounded-md"
            />
          </div>

          <DoctorHeader />
          <PatientInfoSection
            data={prescription.patient}
            onChange={handlePatientUpdate}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicListSection
              title="Diagnosis"
              items={prescription.diagnoses}
              onAdd={(item) => addListEntry("diagnoses", item)}
              onRemove={(idx) => removeListEntry("diagnoses", idx)}
              placeholder="E.g., Hypertension, Type 2 Diabetes"
            />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6 flex flex-col justify-center items-center text-gray-400 italic text-sm text-center">
              <svg
                className="w-8 h-8 mb-2 opacity-20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.993 7.993 0 003 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4.418-3.582-8-8-8a7.993 7.993 0 00-6 2.804z" />
              </svg>
              Enter medical diagnoses or clinical findings here.
            </div>
          </div>

          <MedicationTable
            items={prescription.medications}
            onAdd={addMedication}
            onUpdate={updateMedication}
            onRemove={removeMedication}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicListSection
              title="Lab Investigations"
              items={prescription.labInvestigations}
              onAdd={(item) => addListEntry("labInvestigations", item)}
              onRemove={(idx) => removeListEntry("labInvestigations", idx)}
              isRed={true}
              placeholder="E.g., TSH, CBC, HBA1C"
            />
            <DynamicListSection
              title="Radiology Investigations"
              items={prescription.radiologyInvestigations}
              onAdd={(item) => addListEntry("radiologyInvestigations", item)}
              onRemove={(idx) =>
                removeListEntry("radiologyInvestigations", idx)
              }
              isRed={true}
              placeholder="E.g., Chest X-Ray, USG Abdomen"
            />
          </div>

          <DynamicListSection
            title="General Advice"
            items={prescription.advice}
            onAdd={(item) => addListEntry("advice", item)}
            onRemove={(idx) => removeListEntry("advice", idx)}
            placeholder="E.g., Avoid fatty foods, Morning walk 30 mins"
          />

          {/* Render Custom Sections */}
          {prescription.customSections.map((section) => (
            <div
              key={section.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-gray-800">
                  {section.title}
                </h2>
                <button
                  onClick={() =>
                    setPrescription((prev) => ({
                      ...prev,
                      customSections: prev.customSections.filter(
                        (s) => s.id !== section.id,
                      ),
                    }))
                  }
                  className="text-xs font-bold text-red-500 uppercase hover:text-red-700"
                >
                  Remove Section
                </button>
              </div>
              {section.format === SectionFormat.PARAGRAPH ? (
                <ParagraphEditor
                  content={(section.content as string) || ""}
                  onChange={(newContent) =>
                    handleUpdateCustomSection(section.id, newContent)
                  }
                />
              ) : section.format === SectionFormat.BULLET ? (
                <DynamicListSection
                  title=""
                  items={
                    (section.content &&
                      (section.content.items || [])) as string[]
                  }
                  textColor={
                    (section.content && section.content.color) || undefined
                  }
                  onAdd={(item) =>
                    handleUpdateCustomSection(section.id, {
                      ...(section.content || {}),
                      items: [
                        ...((section.content && section.content.items) || []),
                        item,
                      ],
                    })
                  }
                  onRemove={(idx) =>
                    handleUpdateCustomSection(section.id, {
                      ...(section.content || {}),
                      items: (
                        (section.content && section.content.items) ||
                        []
                      ).filter((_: any, i: number) => i !== idx),
                    })
                  }
                  placeholder="Add bullet point..."
                />
              ) : (
                // Table editor
                <div>
                  {section.content && section.content.headers ? (
                    <TableSectionEditor
                      data={{
                        headers: section.content.headers,
                        rows: section.content.rows,
                      }}
                      onChange={(data) =>
                        handleUpdateCustomSection(section.id, data)
                      }
                    />
                  ) : (
                    <div className="text-gray-400 italic text-center p-4">
                      No table data
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <CustomSectionBuilder onAddSection={handleAddCustomSection} />

          <footer className="mt-12 text-center text-gray-400 text-xs py-8 border-t">
            &copy; {new Date().getFullYear()} ProScript MD. Patient records are
            handled securely within this session.
          </footer>
        </div>
      </div>

      {/* Print View (hidden on screen) */}
      <PrescriptionPrint
        data={prescription}
        sectionsPerPage={sectionsPerPage}
      />
    </div>
  );
};

export default App;
