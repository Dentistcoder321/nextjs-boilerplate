import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import DentalRecordsABI from '../../../../../../abi/DentalRecords.json';

const contractAddress = process.env.NEXT_PUBLIC_DENTAL_RECORDS_ADDRESS_SEPOLIA;
const alchemyRpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;

if (!contractAddress) {
  console.warn('Contract address not found in environment variables. Please check your .env.local file.');
}
if (!alchemyRpcUrl) {
  console.warn('Alchemy RPC URL not found in environment variables. Please check your .env.local file.');
}

const client = createPublicClient({
  chain: sepolia,
  transport: http(alchemyRpcUrl),
});

export async function GET(
  request: Request,
  { params }: { params: { address: string; index: string } }
) {
  if (!contractAddress) {
    return NextResponse.json(
      { error: 'Contract address not configured' },
      { status: 500 }
    );
  }

  try {
    const data = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: DentalRecordsABI,
      functionName: 'getPatientRecordByIndex',
      args: [params.address, Number(params.index)],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patient record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient record' },
      { status: 500 }
    );
  }
} 