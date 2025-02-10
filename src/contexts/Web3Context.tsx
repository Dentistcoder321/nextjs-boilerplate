'use client';

import React, { createContext, useContext } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { type Hash } from 'viem';
import DentalRecordsABI from '../abi/DentalRecords.json';

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
  timestamp: bigint;
}

interface Web3ContextType {
  address: string | undefined;
  isConnected: boolean;
  addDentalRecord: (patientAddress: string, procedure: string, description: string, diagnosis: string) => Promise<Hash>;
  getDentistInfo: (dentistAddress: string) => Promise<DentistInfo>;
  getDentistRecordCount: (dentistAddress: string) => Promise<number>;
  getDentistRecordByIndex: (dentistAddress: string, index: number) => Promise<{
    patient: string;
    procedure: string;
    description: string;
    diagnosis: string;
    timestamp: number;
  }>;
}

const Web3Context = createContext<Web3ContextType>({
  address: undefined,
  isConnected: false,
  addDentalRecord: async () => '0x0' as Hash,
  getDentistInfo: async () => ({ name: '', licenseNumber: '', clinicName: '' }),
  getDentistRecordCount: async () => 0,
  getDentistRecordByIndex: async () => ({
    patient: '',
    procedure: '',
    description: '',
    diagnosis: '',
    timestamp: 0,
  }),
});

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error('Contract address not found');
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const addDentalRecord = async (
    patientAddress: string,
    procedure: string,
    description: string,
    diagnosis: string
  ): Promise<Hash> => {
    try {
      const hash = await writeContractAsync({
        abi: DentalRecordsABI,
        address: contractAddress as `0x${string}`,
        functionName: 'addDentalRecord',
        args: [patientAddress, procedure, description, diagnosis],
      });
      return hash;
    } catch (error) {
      console.error('Error adding dental record:', error);
      throw error;
    }
  };

  const getDentistInfo = async (dentistAddress: string): Promise<DentistInfo> => {
    try {
      const response = await fetch(`/api/dentist/${dentistAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        name: data[0],
        licenseNumber: data[1],
        clinicName: data[2]
      };
    } catch (error) {
      console.error('Error fetching dentist info:', error);
      throw error;
    }
  };

  const getDentistRecordCount = async (dentistAddress: string): Promise<number> => {
    try {
      const response = await fetch(`/api/dentist/${dentistAddress}/record-count`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Number(data.count);
    } catch (error) {
      console.error('Error fetching record count:', error);
      throw error;
    }
  };

  const getDentistRecordByIndex = async (dentistAddress: string, index: number) => {
    try {
      const response = await fetch(`/api/dentist/${dentistAddress}/records/${index}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        patient: data[0],
        procedure: data[1],
        description: data[2],
        diagnosis: data[3],
        timestamp: Number(data[4])
      };
    } catch (error) {
      console.error('Error fetching record:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        addDentalRecord,
        getDentistInfo,
        getDentistRecordCount,
        getDentistRecordByIndex,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
} 