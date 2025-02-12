import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import DentalRecordsABI from '../../../../../abi/DentalRecords.json';

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
  { params }: { params: { address: string } }
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
      functionName: 'getPatientRecordCount',
      args: [params.address],
    });

    return NextResponse.json({ count: Number(data) });
  } catch (error) {
    console.error('Error fetching patient record count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient record count' },
      { status: 500 }
    );
  }
} 