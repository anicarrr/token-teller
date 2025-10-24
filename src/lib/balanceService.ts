import { ethers } from 'ethers'
import { tokenList } from './tokenList'
import axios from 'axios'

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  decimals: number
  address: string
  chainId: number
  chainName: string
  usdValue: number
}

export interface BalanceResponse {
  balances: TokenBalance[]
  totalUsdValue: number
}

const CHAIN_NAMES: Record<number, string> = {
  11155111: 'Ethereum Sepolia',
  7001: 'ZetaChain Testnet'
}

const RPC_URLS: Record<number, string> = {
  11155111: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL!,
  7001: process.env.NEXT_PUBLIC_ZETACHAIN_RPC_URL!
}

// CoinGecko price mapping
const COIN_IDS: Record<string, string> = {
  'USDC': 'usd-coin',
  'tZETA': 'zeta',
  'ETH': 'ethereum'
}

export class BalanceService {
  /**
   * Fetches token balances for a given address across multiple chains
   * @param address - The wallet address to fetch balances for
   * @param chainIds - Array of chain IDs to fetch balances from
   * @returns Promise<BalanceResponse> - Sorted balances with USD values and total
   */
  static async fetchBalances(address: string, chainIds: number[]): Promise<BalanceResponse> {
    // Validate address format
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid address format')
    }

    const allBalances: TokenBalance[] = []

    // Fetch balances for each chain
    for (const chainId of chainIds) {
      const chainBalances = await this.fetchChainBalances(address, chainId)
      allBalances.push(...chainBalances)
    }

    // Fetch USD prices for all tokens
    await this.addUsdValues(allBalances)

    // Sort by USD value (highest first)
    allBalances.sort((a, b) => b.usdValue - a.usdValue)

    // Calculate total USD value
    const totalUsdValue = allBalances.reduce((sum, balance) => sum + balance.usdValue, 0)

    return {
      balances: allBalances,
      totalUsdValue
    }
  }

  /**
   * Fetches balances for a specific chain
   * @param address - The wallet address
   * @param chainId - The chain ID to fetch from
   * @returns Promise<TokenBalance[]> - Array of token balances for the chain
   */
  private static async fetchChainBalances(address: string, chainId: number): Promise<TokenBalance[]> {
    const tokens = tokenList[chainId as keyof typeof tokenList] || []
    const rpcUrl = RPC_URLS[chainId]
    const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`

    if (!rpcUrl) {
      console.error(`No RPC URL configured for chain ${chainId}`)
      return []
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const balances: TokenBalance[] = []

    // Fetch native balance (ETH)
    try {
      const nativeBalance = await provider.getBalance(address)
      const formattedNativeBalance = ethers.formatEther(nativeBalance)
      
      // Only add if balance > 0
      if (parseFloat(formattedNativeBalance) > 0) {
        balances.push({
          symbol: 'ETH',
          name: 'Ethereum',
          balance: formattedNativeBalance,
          decimals: 18,
          address: ethers.ZeroAddress,
          chainId,
          chainName,
          usdValue: 0 // Will be set later
        })
      }
    } catch (error) {
      console.error(`Error fetching native balance for chain ${chainId}:`, error)
    }

    // Fetch ERC20 token balances
    for (const token of tokens) {
      try {
        // Validate contract address format
        if (!ethers.isAddress(token.address)) {
          console.error(`Invalid address format for ${token.symbol}: ${token.address}`)
          continue
        }

        const contract = new ethers.Contract(
          token.address, 
          ['function balanceOf(address) view returns (uint256)'], 
          provider
        )
        
        // Check if contract exists
        const code = await provider.getCode(token.address)
        if (code === '0x') {
          console.error(`No contract found at address ${token.address} for ${token.symbol}`)
          continue
        }

        const balance = await contract.balanceOf(address)
        const formattedBalance = ethers.formatUnits(balance, token.decimals)
        
        // Only add if balance > 0
        if (parseFloat(formattedBalance) > 0) {
          balances.push({
            symbol: token.symbol,
            name: token.name,
            balance: formattedBalance,
            decimals: token.decimals,
            address: token.address,
            chainId,
            chainName,
            usdValue: 0 // Will be set later
          })
        }
      } catch (error) {
        console.error(`Error fetching balance for ${token.symbol} at ${token.address}:`, error)
      }
    }

    return balances
  }

  /**
   * Adds USD values to token balances using CoinGecko API
   * @param balances - Array of token balances to add USD values to
   */
  private static async addUsdValues(balances: TokenBalance[]): Promise<void> {
    // Get unique symbols that we have price mappings for
    const symbols = [...new Set(balances.map(b => b.symbol))]
    const relevantSymbols = symbols.filter(symbol => COIN_IDS[symbol])
    
    if (relevantSymbols.length === 0) {
      console.log('No symbols found with price mappings')
      return
    }

    try {
      const coinIds = relevantSymbols.map(symbol => COIN_IDS[symbol]).join(',')
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`,
        { timeout: 10000 }
      )
      const prices = response.data

      // Update USD values for each balance
      balances.forEach(balance => {
        const coinId = COIN_IDS[balance.symbol]
        if (coinId && prices[coinId] && prices[coinId].usd) {
          balance.usdValue = parseFloat(balance.balance) * prices[coinId].usd
        } else {
          balance.usdValue = 0
        }
      })
    } catch (error) {
      console.error('Error fetching prices from CoinGecko:', error)
      // Set all USD values to 0 if price fetching fails
      balances.forEach(balance => {
        balance.usdValue = 0
      })
    }
  }
}