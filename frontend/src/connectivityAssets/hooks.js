
import { waitForTransactionReceipt } from "@wagmi/core";

import tokenAbi from "./tokenAbi.json";
import { tokenAddress } from "./environment";
import { useReadContract, useWriteContract } from "wagmi";

export const useTokenReadFunction = (functionName, args, address) => {
    const readContract = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: functionName,
        args,
        account: address,
        query: {
            enabled: false, // disable the query in onload
        },
    });
    const handleReadContract = async () => {
        try {
            const { data } = await readContract.refetch();
            return data;
        } catch (error) {
            throw new Error(error);
        }
    };

    return { handleReadContract };
};

/// write functions
export const useTokenWriteFunction = () => {
    const { writeContractAsync } = useWriteContract();

    const handleWriteContract = async (functionName, args, address) => {
        try {
            const { hash } = await writeContractAsync({
                abi: tokenAbi,
                address: tokenAddress,
                functionName,
                args,
                account: address,
            });

            const receipt = await waitForTransactionReceipt({ hash });
            return receipt;
        } catch (error) {
            throw new Error(error);
        }
    };

    return { handleWriteContract };
};

// Enhanced hooks for specific contract functions
export const useTokenBalance = (address) => {
    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        enabled: !!address,
        watch: true, // Real-time updates
    });
    
    return { 
        balance: data || 0n, 
        isLoading, 
        refetch 
    };
};

// Get vote cooldown timestamp for an address
export const useVoteCooldown = (voterAddress) => {
    const { data, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'votersToVoteExpiry',
        args: voterAddress ? [voterAddress] : undefined,
        enabled: !!voterAddress,
        watch: true,
    });
    
    return { 
        expiryTimestamp: data || 0n, 
        refetch 
    };
};

// Get total number of democratic votes
export const useDemocraticVotesLength = () => {
    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'getDemocraticVotesLength',
        watch: true,
    });
    
    return { 
        votesCount: data || 0n, 
        isLoading, 
        refetch 
    };
};

// Get individual democratic vote data
export const useDemocraticVote = (voteId) => {
    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'democraticVotes',
        args: voteId !== undefined && voteId !== null ? [voteId] : undefined,
        enabled: voteId !== undefined && voteId !== null,
        watch: true,
    });
    
    return { 
        voteData: data, 
        isLoading, 
        refetch 
    };
};

// Get democratic vote results
export const useDemocraticVoteResult = (voteId) => {
    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'getDemocraticVoteResult',
        args: voteId !== undefined && voteId !== null ? [voteId] : undefined,
        enabled: voteId !== undefined && voteId !== null,
    });
    
    return { 
        result: data, 
        isLoading, 
        refetch 
    };
};

// Get HODL activation timestamp
export const useHodlActivationTimestamp = () => {
    const { data, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'hodlActivationTimestamp',
        watch: true,
    });
    
    return { 
        hodlTimestamp: data || 0n, 
        refetch 
    };
};

// Get sale restriction status
export const useIsSaleRestricted = () => {
    const { data, refetch } = useReadContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'isSaleRestricted',
        watch: true,
    });
    
    return { 
        isSaleRestricted: !!data, 
        refetch 
    };
};