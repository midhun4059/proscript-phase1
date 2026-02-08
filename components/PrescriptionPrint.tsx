import React from "react";
import { PrescriptionData } from "../types";
import DoctorHeader from "./DoctorHeader";
import PatientInfoSection from "./PatientInfoSection";
import DynamicListSection from "./DynamicListSection";
import MedicationTable from "./MedicationTable";
import { DOCTOR_INFO } from "../constants";

interface Props {
  data: PrescriptionData;
  sectionsPerPage?: number;
}

const PrescriptionPrint: React.FC<Props> = ({ data, sectionsPerPage = 5 }) => {
  const buildSections = () => {
    const sections: Array<{
      id: string;
      title: string;
      type: string;
      payload?: any;
      isRed?: boolean;
    }> = [];

    sections.push({
      id: "diagnosis",
      title: "Diagnosis",
      type: "list",
      payload: data.diagnoses,
    });
    sections.push({
      id: "medications",
      title: "Medications",
      type: "medications",
      payload: data.medications,
    });
    sections.push({
      id: "lab",
      title: "Lab Investigations",
      type: "list",
      payload: data.labInvestigations,
      isRed: true,
    });
    sections.push({
      id: "radio",
      title: "Radiology Investigations",
      type: "list",
      payload: data.radiologyInvestigations,
      isRed: true,
    });
    sections.push({
      id: "advice",
      title: "Advice & Instructions",
      type: "list",
      payload: data.advice,
    });

    data.customSections.forEach((s) => {
      sections.push({
        id: s.id,
        title: s.title,
        type: s.format,
        payload: s.content,
      });
    });

    return sections;
  };

  const sections = buildSections();
  const chunked: Array<Array<any>> = [];
  for (let i = 0; i < sections.length; i += sectionsPerPage) {
    chunked.push(sections.slice(i, i + sectionsPerPage));
  }

  return (
    <div id="prescription-root" className="print-only relative">
      {/* Background Letterhead - positioned absolute so it renders in cloned PDFs */}
      {data.letterhead && (
        <img
          src={data.letterhead}
          alt="letterhead"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
            opacity: 1,
            pointerEvents: "none",
          }}
        />
      )}

      <div>
        {chunked.map((pageSections, pIndex) => (
          <div
            key={pIndex}
            className="page p-8 break-after-page"
            style={{
              pageBreakAfter:
                pIndex === chunked.length - 1 ? undefined : "always",
            }}
          >
            <div className="mb-4">
              {!data.hideSystemHeader && <DoctorHeader />}
              <PatientInfoSection data={data.patient} isPrint={true} />
            </div>

            <div>
              {pageSections.map((sec: any) => (
                <div key={sec.id} className="mb-6">
                  {sec.type === "list" && (
                    <div>
                      <h3 className="text-md font-bold text-blue-900 border-b pb-0.5 mb-2">
                        {sec.title}
                      </h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {sec.payload.map((it: string, i: number) => (
                          <li key={i} className="text-gray-800">
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sec.type === "medications" && (
                    <div>
                      <h3 className="text-md font-bold text-blue-900 border-b pb-0.5 mb-2">
                        Medications
                      </h3>
                      <MedicationTable
                        items={sec.payload}
                        onAdd={() => {}}
                        onUpdate={() => {}}
                        onRemove={() => {}}
                        isPrint={true}
                      />
                    </div>
                  )}

                  {sec.type === "Bullet Points" && (
                    <div>
                      <h3 className="text-md font-bold text-blue-900 border-b pb-0.5 mb-2">
                        {sec.title}
                      </h3>
                      <ul
                        className="list-disc list-inside text-sm space-y-1"
                        style={{
                          color:
                            (sec.payload && sec.payload.color) || undefined,
                        }}
                      >
                        {((sec.payload && sec.payload.items) || []).map(
                          (it: string, i: number) => (
                            <li key={i}>{it}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {sec.type === "Paragraph Text" && (
                    <div>
                      <h3 className="text-md font-bold text-blue-900 border-b pb-0.5 mb-2">
                        {sec.title}
                      </h3>
                      <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: sec.payload || "" }}
                      />
                    </div>
                  )}

                  {sec.type === "Table" && (
                    <div>
                      <h3 className="text-md font-bold text-blue-900 border-b pb-0.5 mb-2">
                        {sec.title}
                      </h3>
                      <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            {(sec.payload.headers || []).map(
                              (h: string, i: number) => (
                                <th
                                  key={i}
                                  className="border border-gray-300 p-2 text-left"
                                >
                                  {h}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(sec.payload.rows || []).map(
                            (row: string[], ri: number) => (
                              <tr key={ri}>
                                {row.map((c: string, ci: number) => (
                                  <td
                                    key={ci}
                                    className="border border-gray-300 p-2"
                                  >
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {pIndex === chunked.length - 1 && (
                <div className="mt-12 flex justify-end">
                  <div className="text-center w-48 border-t border-gray-400 pt-2">
                    <p className="text-sm font-bold">{DOCTOR_INFO.name}</p>
                    <p className="text-xs text-gray-500">Signature</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionPrint;
