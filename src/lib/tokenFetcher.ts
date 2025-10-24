import { ethers } from 'ethers'
import { tokenList } from './tokenList'
import axios from 'axios'

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  decimals: number
  address: string
  usdValue?: number
}

export async function fetchTokenBalances(address: string, chainId: number): Promise<TokenBalance[]> {
  const tokens = tokenList[chainId as keyof typeof tokenList] || []
  const provider = new ethers.JsonRpcProvider(
    chainId === 1 ? process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL : process.env.NEXT_PUBLIC_ZETACHAIN_RPC_URL
  )

  const balances: TokenBalance[] = []

  // Fetch native balance
  const nativeBalance = await provider.getBalance(address)
  balances.push({
    symbol: 'ETH',
    name: 'Ethereum',
    balance: ethers.formatEther(nativeBalance),
    decimals: 18,
    address: ethers.ZeroAddress,
  })

  // Fetch ERC20 balances
  for (const token of tokens) {
    if (token.address === ethers.ZeroAddress) continue // Skip native
    try {
      const contract = new ethers.Contract(token.address, ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)', 'function symbol() view returns (string)', 'function name() view returns (string)'], provider)
      const balance = await contract.balanceOf(address)
      const formattedBalance = ethers.formatUnits(balance, token.decimals)
      balances.push({
        symbol: token.symbol,
        name: token.name,
        balance: formattedBalance,
        decimals: token.decimals,
        address: token.address,
      })
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol}:`, error)
    }
  }

  // Fetch USD values using CoinGecko
  await addUsdValues(balances, chainId)

  return balances
}

async function addUsdValues(balances: TokenBalance[], chainId: number) {
  const coinIds: Record<number, Record<string, string>> = {
    1: { 'ETH': 'ethereum', 'USDC': 'usd-coin', 'DAI': 'dai', 'LINK': 'chainlink', 'UNI': 'uniswap', 'AAVE': 'aave' },
    7001: { 'ZETA': 'zeta', 'ETH': 'ethereum' },
  }

  const ids = coinIds[chainId] || {}
  const symbols = balances.map(b => b.symbol)
  const relevantIds = Object.keys(ids).filter(id => symbols.includes(id))

  if (relevantIds.length === 0) return

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${relevantIds.map(s => ids[s]).join(',')}&vs_currencies=usd`)
    const prices = response.data

    balances.forEach(balance => {
      const id = ids[balance.symbol]
      if (id && prices[id]) {
        balance.usdValue = parseFloat(balance.balance) * prices[id].usd
      }
    })
  } catch (error) {
    console.error('Error fetching prices:', error)
  }
}