
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
