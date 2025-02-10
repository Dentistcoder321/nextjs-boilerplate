import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import DentalRecordsABI from '../../../../../abi/DentalRecords.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const alchemyRpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;

if (!contractAddress) throw new Error('Contract address not found');
if (!alchemyRpcUrl) throw new Error('Alchemy RPC URL not found');

const client = createPublicClient({
  chain: sepolia,
  transport: http(alchemyRpcUrl),
});

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const data = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: DentalRecordsABI,
      functionName: 'getDentistRecordCount',
      args: [params.address],
    });

    return NextResponse.json({ count: Number(data) });
  } catch (error) {
    console.error('Error fetching record count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch record count' },
      { status: 500 }
    );
  }
} 