import type { BytesLike, Provider } from "ethers";
interface Call {
    target: string;
    callData: string;
}
interface CallContext {
    contractAddress: string;
    methodName: string;
}
interface BalanceRequest {
    addressOrName: string;
    contractAddresses: string[];
    provider: Provider;
}
interface RawBalanceRequest {
    address: string;
    contractAddresses: string[];
    multicallCustomContractAddress: ContractAddress;
    provider: Provider;
}
type ReturnData = BytesLike;
type Success = boolean;
export type CallResult = [Success, ReturnData];
type ContractAddress = string;
export type AssociatedCallResult = [ContractAddress, Success, ReturnData];
type TokenInfo = Record<"symbol" | "balanceOf" | "decimals" | "name", string | number>;
type TokenInfoWithoutBalance = Record<"symbol" | "decimals" | "name", string | number>;
export type MetaByContract = Record<string, TokenInfoWithoutBalance>;
type BalancesByContract = Record<string, TokenInfo>;
/**
 * Fetches the balances in a single batch using Multicall (tryBlockAndAggregate)
 *
 * @param request - An request object used to fetch balances
 * @returns An array of tuples that contain the non-zero result data along with its smart contract address
 */
export declare function fetchRawBalances({ address, contractAddresses, multicallCustomContractAddress, provider, }: RawBalanceRequest): Promise<AssociatedCallResult[]>;
/**
 * Filters out call result data with zero balance and return non zero results associated with its contract
 *
 * @param results - An array of raw call results from multicall (balanceOf)
 * @param contractAddresses - An array of contract addresses, one element per result
 * @returns The non-zero result data, associated with its contract address
 */
export declare function getNonZeroResults(results: CallResult[], contractAddresses: string[]): AssociatedCallResult[];
/**
 * Takes an tuple of call results and returns an object with each result keyed by its contract address
 *
 * @param associatedCallResults - An array of tuples that contain the raw balance and its contract address
 * @returns An object with each raw result keyed by its contract address
 */
export declare function resultDataByContract(associatedCallResults: AssociatedCallResult[]): Record<string, BytesLike>;
/**
 * Takes an associated call result (contract address + result data) and generates:
 * 1) calls is used to fetch a token's name, symbol, and decimals
 * 2) context is useful  for mapping raw result data of a method call to its contract address
 *
 * @param associatedResults - The result data, associated with its contract address
 * @returns The calls and context
 */
export declare function buildCallsContext(associatedResults: AssociatedCallResult[]): {
    calls: {
        target: string;
        callData: string;
    }[];
    context: {
        contractAddress: string;
        methodName: string;
    }[];
};
/**
 * Decodes the raw result data for meta info such as ERC-20's (name, symbol, address)`.
 * Returns these decoded results in an object keyed by its smart contract address.
 * @param metaResults - An array of call result for each ERC-20 meta data (name, symbol, address)
 * @param context - T
 * @returns T
 */
export declare function decodeMetaResults(metaResults: CallResult[], context: CallContext[]): MetaByContract;
/**
 * Takes the meta data (name, symbol, decimals) and the balance data and normalizes
 * normalizes them into an object keyed by its smart contract address.
 *
 * @param metaDataByContract - An object of meta data (name, symbol, decimals) keyed by its contract address
 * @param balanceDataByContract - An object of raw balance data keyed by its contract address
 * @returns The non-zero balance and its name, symbol, and decimnals, keyed by its contract address
 */
export declare function balancesByContract(metaDataByContract: MetaByContract, balanceDataByContract: Record<string, ReturnData>, formatBalance: boolean): Record<string, TokenInfo>;
/**
 * Gets an Ethereum address from an Ethereum address or ENS domain
 *
 * @param addressOrName - An Ethereum address or ENS domain
 * @param provider - An abstraction of a connection to the EVM network which provides node functionality
 * @returns An Ethereum address
 */
export declare function getAddress(addressOrName: string, provider: Provider): Promise<string>;
/**
 * Returns the ERC20 balances for an Ethereum address using the
 * {@link https://github.com/mds1/multicall#multicall--- multicall smart contract}
 *
 * @param BalanceRequest - The request used to fetch ERC20 balances
 * @returns The ERC-20 balances for an address
 */
export declare function getTokenBalances({ addressOrName, contractAddresses, provider, chunkSize, formatBalance, multicallCustomContractAddress, }: BalanceRequest & {
    formatBalance?: boolean;
    multicallCustomContractAddress?: ContractAddress;
    chunkSize?: number;
}): Promise<BalancesByContract>;
/**
 * A helper function to make requests to the multicall smart contract (tryBlockAndAggregate)
 *
 * @param calls - An array of calls that will be executed in a batch by the multicall contract (tryBlockAndAggregate)
 * @param provider - An abstraction of a connection to the EVM network which provides node functionality
 * @returns The call results from tryBlockAndAggregate
 */
export declare function aggregate(calls: Call[], provider: Provider, multicallCustomContractAddress: ContractAddress): Promise<{
    results: CallResult[];
}>;
/**
 * Utility function to chunk an array into arrays of `size`
 *
 * @param array - The array to be chunked
 * @param size - The size of each chunk
 * @returns An array of chunks
 */
export declare function chunk<T>(array: T[], size: number): T[][];
export {};
