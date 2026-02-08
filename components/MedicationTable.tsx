
import React from 'react';
import { Medication } from '../types';

interface Props {
  items: Medication[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Medication, value: string) => void;
  onRemove: (id: string) => void;
  isPrint?: boolean;
}

const MedicationTable: React.FC<Props> = ({ items, onAdd, onUpdate, onRemove, isPrint = false }) => {
  if (isPrint) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-blue-900 border-b pb-1 mb-3">R<sub>x</sub> Medications</h3>
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-3 py-2 w-12 text-center">#</th>
              <th className="border border-gray-300 px-3 py-2">Medicine</th>
              <th className="border border-gray-300 px-3 py-2">Dose</th>
              <th className="border border-gray-300 px-3 py-2">Frequency</th>
              <th className="border border-gray-300 px-3 py-2 w-20">Days</th>
              <th className="border border-gray-300 px-3 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {items.map((med, idx) => (
              <tr key={med.id}>
                <td className="border border-gray-300 px-3 py-2 text-center">{idx + 1}</td>
                <td className="border border-gray-300 px-3 py-2 font-semibold">{med.medicine}</td>
                <td className="border border-gray-300 px-3 py-2">{med.dose}</td>
                <td className="border border-gray-300 px-3 py-2">{med.frequency}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{med.days}</td>
                <td className="border border-gray-300 px-3 py-2 italic text-gray-600">{med.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800">Medications (Rx)</h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <span>Add Medicine</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 uppercase text-xs">
              <th className="py-2 px-1 w-10">Sl</th>
              <th className="py-2 px-1 min-w-[150px]">Medicine</th>
              <th className="py-2 px-1">Dose</th>
              <th className="py-2 px-1">Frequency</th>
              <th className="py-2 px-1 w-20">Days</th>
              <th className="py-2 px-1">Remarks</th>
              <th className="py-2 px-1 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((med, idx) => (
              <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-1">{idx + 1}</td>
                <td className="py-2 px-1">
                  <input
                    type="text"
                    value={med.medicine}
                    onChange={(e) => onUpdate(med.id, 'medicine', e.target.value)}
                    placeholder="E.g. Paracetamol 500mg"
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="py-2 px-1">
                  <input
                    type="text"
                    value={med.dose}
                    onChange={(e) => onUpdate(med.id, 'dose', e.target.value)}
                    placeholder="1 tablet"
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="py-2 px-1">
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => onUpdate(med.id, 'frequency', e.target.value)}
                    placeholder="1-0-1 (B.D)"
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="py-2 px-1">
                  <input
                    type="text"
                    value={med.days}
                    onChange={(e) => onUpdate(med.id, 'days', e.target.value)}
                    placeholder="5"
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="py-2 px-1">
                  <input
                    type="text"
                    value={med.remarks}
                    onChange={(e) => onUpdate(med.id, 'remarks', e.target.value)}
                    placeholder="After meals"
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="py-2 px-1">
                  <button
                    onClick={() => onRemove(med.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove medicine"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicationTable;
