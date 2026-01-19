import React, { useState } from 'react';
import { resourcesData } from '../data/resourcesData';

const ResourceLibrary = () => {
  const [selectedSem, setSelectedSem] = useState("");

  // Filter subjects based on selected semester
  const activeData = resourcesData.find(item => item.semester === selectedSem);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Digital Resource Library</h1>
      
      {/* Selection Dropdown */}
      <div className="max-w-md mx-auto mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
        <select 
          className="w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:ring-blue-500"
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
        >
          <option value="">-- Choose Semester --</option>
          <option value="1-1">Semester 1-1</option>
          <option value="1-2">Semester 1-2</option>
          <option value="2-1">Semester 2-1</option>
          <option value="2-2">Semester 2-2</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {activeData?.subjects.map((sub, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-md border-t-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-800 mb-3">{sub.name}</h3>
            <div className="flex flex-wrap gap-2">
              {sub.units.map((unit, uIdx) => (
                <a 
                  key={uIdx} 
                  href={unit.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition"
                >
                  {unit.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;