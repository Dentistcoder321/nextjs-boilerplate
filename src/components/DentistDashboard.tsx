import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface DentistDashboardProps {
  address: string | undefined;
}

interface DentistInfo {
  name: string;
  licenseNumber: string;
  clinicName: string;
}

interface DentalRecord {
  patient: string;
  procedure: string;
  description: string;
  diagnosis: string;
  timestamp: number;
}

const DentistDashboard = ({ address }: DentistDashboardProps) => {
  const { getDentistInfo, getDentistRecordCount, getDentistRecordByIndex, addDentalRecord } = useWeb3();
  const [dentistInfo, setDentistInfo] = useState<DentistInfo | null>(null);
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [newRecord, setNewRecord] = useState({
    patientAddress: '',
    procedure: '',
    description: '',
    diagnosis: '',
  });

  useEffect(() => {
    const fetchDentistInfo = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        // Fetch dentist info and record count in parallel
        const [info, recordCount] = await Promise.all([
          getDentistInfo(address),
          getDentistRecordCount(address)
        ]);
        
        setDentistInfo(info);

        // Fetch all records in parallel
        const recordPromises = Array.from({ length: recordCount }, (_, i) => 
          getDentistRecordByIndex(address, i)
        );
        
        const records = await Promise.all(recordPromises);
        setRecords(records.sort((a, b) => b.timestamp - a.timestamp)); // Sort by timestamp descending
      } catch (err) {
        console.error('Error fetching dentist data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dentist information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDentistInfo();
  }, [address, getDentistInfo, getDentistRecordCount, getDentistRecordByIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setError('No wallet connected');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const hash = await addDentalRecord(
        newRecord.patientAddress,
        newRecord.procedure,
        newRecord.description,
        newRecord.diagnosis
      );
      
      // Wait for the transaction to be mined
      console.log('Transaction hash:', hash);
      
      // Reset form
      setNewRecord({
        patientAddress: '',
        procedure: '',
        description: '',
        diagnosis: '',
      });

      // Refresh records after a short delay to allow for blockchain confirmation
      setTimeout(async () => {
        const recordCount = await getDentistRecordCount(address);
        const records = await Promise.all(
          Array.from({ length: recordCount }, (_, i) => 
            getDentistRecordByIndex(address, i)
          )
        );
        setRecords(records.sort((a, b) => b.timestamp - a.timestamp));
      }, 2000);
    } catch (err) {
      console.error('Error adding dental record:', err);
      setError(err instanceof Error ? err.message : 'Failed to add dental record');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {dentistInfo && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dentist Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">{dentistInfo.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <p className="mt-1 text-gray-900">{dentistInfo.licenseNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
              <p className="mt-1 text-gray-900">{dentistInfo.clinicName}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="patientAddress" className="block text-sm font-medium text-gray-700">
              Patient Address
            </label>
            <input
              type="text"
              id="patientAddress"
              name="patientAddress"
              value={newRecord.patientAddress}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
              Procedure
            </label>
            <input
              type="text"
              id="procedure"
              name="procedure"
              value={newRecord.procedure}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newRecord.description}
              onChange={handleInputChange}
              className="input"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={newRecord.diagnosis}
              onChange={handleInputChange}
              className="input"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`btn ${isLoading ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}
          >
            {isLoading ? 'Adding Record...' : 'Add Record'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dental Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.patient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.procedure}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.diagnosis}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DentistDashboard; 