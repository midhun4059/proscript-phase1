
import React from 'react';
import { DOCTOR_INFO } from '../constants';

const DoctorHeader: React.FC = () => {
  return (
    <div className="border-b-2 border-blue-900 pb-4 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-tight">{DOCTOR_INFO.name}</h1>
          <p className="text-sm font-semibold text-gray-700">{DOCTOR_INFO.qualification}</p>
          <p className="text-xs text-gray-600 font-medium">Reg No: {DOCTOR_INFO.registrationNo}</p>
        </div>
        <div className="text-right flex-1">
          <p className="text-xs text-gray-600 leading-relaxed">{DOCTOR_INFO.address}</p>
          <p className="text-xs text-gray-700 font-medium mt-1">Booking: {DOCTOR_INFO.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeader;
