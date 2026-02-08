import React from "react";
import { PatientDetails } from "../types";

interface Props {
  data: PatientDetails;
  onChange?: (data: PatientDetails) => void;
  isPrint?: boolean;
}

const PatientInfoSection: React.FC<Props> = ({
  data,
  onChange,
  isPrint = false,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (onChange) {
      onChange({ ...data, [e.target.name]: e.target.value });
    }
  };

  if (isPrint) {
    return (
      <div className="grid grid-cols-4 gap-4 text-sm border border-gray-200 p-3 rounded-sm mb-6 bg-gray-50/50">
        <div className="col-span-2">
          <span className="font-bold">Patient Name: </span>{" "}
          {data.name || "____________________"}
        </div>
        <div>
          <span className="font-bold">Age: </span> {data.age || "___"}
        </div>
        <div>
          <span className="font-bold">Sex: </span> {data.sex}
        </div>
        <div className="col-span-4 mt-2">
          <span className="font-bold">Date: </span> {data.date}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
        Patient Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Patient Name"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone || ""}
            onChange={handleChange}
            placeholder="Phone number (hidden on print)"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Age
          </label>
          <input
            type="text"
            name="age"
            value={data.age}
            onChange={handleChange}
            placeholder="Years"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Sex
          </label>
          <select
            name="sex"
            value={data.sex}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;
