# Crypto Oracle Fortune Prototype

An interactive web application that connects to users' crypto wallets, retrieves token balances, and uses AI to generate personalized "fortunes" based on BaZi (Chinese Four Pillars of Destiny). Users can interact with the app, asking follow-up questions about their fortunes or holdings, with AI providing dynamic, metaphysics-inspired responses.

## Features

- **Wallet Integration**: Connect to MetaMask or WalletConnect for Ethereum and ZetaChain.
- **Multi-Chain Support**: Supports Ethereum mainnet and ZetaChain testnet.
- **Token Balance Fetching**: Retrieves native and ERC20 token balances using ethers.js.
- **AI-Powered Fortunes**: Generates personalized BaZi-inspired fortunes using OpenAI API.
- **Interactive Chat**: Ask follow-up questions with conversation history maintained.
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS and shadcn/ui components.
- **Loading States & Error Handling**: User-friendly feedback for all operations.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Blockchain**: Wagmi, Viem, Ethers.js
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Price Data**: CoinGecko API

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── fortune/route.ts    # API for generating fortunes
│   │   └── chat/route.ts       # API for chat interactions
│   ├── layout.tsx              # Root layout with WagmiProvider
│   ├── page.tsx                # Main page with WalletConnect
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components (Button, Input, Card)
│   ├── WalletConnect.tsx       # Wallet connection and dashboard
│   └── Chat.tsx                # Chat interface
├── lib/
│   ├── wagmi.ts                # Wagmi configuration for chains
│   ├── tokenList.ts            # Curated token list for each chain
│   └── tokenFetcher.ts         # Service to fetch token balances
└── .env.local                  # Environment variables (API keys, RPC URLs)
```

## Decisions & Trade-offs

- **MVP Focus**: Prioritized core features (wallet connect, balance fetch, fortune generation, chat) over advanced features like real-time updates or extensive token lists.
- **Chain Selection**: Chose Ethereum and ZetaChain for multi-chain support as per requirements. Used testnet for ZetaChain to align with provided faucets.
- **AI Integration**: Used OpenAI for simplicity and reliability. Prompt engineering focused on BaZi theme for creative fortunes.
- **UI Framework**: Leveraged shadcn/ui for consistent, accessible components and rapid prototyping.
- **Error Handling**: Added basic error states but kept it simple for MVP; could be expanded with retries or more detailed messages.
- **Price API**: Integrated CoinGecko for USD values to enhance UX, despite potential rate limits.
- **Security**: API keys are environment variables; no sensitive data exposed in client-side code.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet for testing

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd token-teller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_TEST_WALLET_ADDRESS=your_test_wallet_address
   NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   NEXT_PUBLIC_ZETACHAIN_RPC_URL=https://zetachain-evm.public.blastapi.io
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Connect your wallet using MetaMask or WalletConnect.
2. Select a chain (Ethereum or ZetaChain).
3. Fetch your token balances.
4. Generate a personalized BaZi fortune based on your portfolio.
5. Ask follow-up questions in the chat interface.

## Deployment

Deploy to Vercel for a live preview:

1. Push to GitHub.
2. Connect to Vercel and deploy.
3. Set environment variables in Vercel dashboard.

Note: The app may have build issues due to wagmi's SSR compatibility. If deployment fails, consider using a different hosting or adjusting the Next.js config for dynamic rendering.

## Next Steps & Lessons Learned

- **Next Steps**: Add more chains, implement real-time balance updates, enhance AI prompts for better personalization, add user authentication for saved fortunes.
- **Lessons**: Balancing MVP scope with feature completeness; importance of responsive design for mobile users; integrating multiple APIs requires careful error handling.

## Contributing

Feel free to open issues or submit PRs for improvements!

## License

MIT
