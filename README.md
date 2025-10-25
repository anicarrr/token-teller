# 🔮 Token Teller

**Unveil Your Crypto Destiny with Ancient Wisdom**

Token Teller is a mystical web application that combines traditional Chinese BaZi (Four Pillars of Destiny) fortune telling with modern cryptocurrency portfolio analysis. Connect your wallet, share your birth date, and discover what the cosmic forces reveal about your digital fortune.

## ✨ Features

### 🌟 Core Functionality
- **Multi-Chain Wallet Integration**: Support for Ethereum Sepolia and ZetaChain Testnet
- **BaZi Fortune Reading**: Personalized fortune telling based on Chinese astrology and your crypto portfolio
- **AI-Powered Insights**: GPT-powered fortune generation with mystical imagery
- **Interactive Chat**: Ask questions about your fortune with an AI oracle
- **Real-Time Portfolio Analysis**: Fetch and analyze token balances with USD valuations

### 🎨 User Experience
- **Mystical UI**: Cosmic-themed interface with galaxy particles and ethereal animations
- **Responsive Design**: Optimized for desktop and mobile devices
- **Typewriter Effects**: Engaging text animations for fortune reveals
- **Dynamic Image Generation**: AI-generated mystical artwork for each reading

### 🔗 Blockchain Integration
- **Dynamic Wallet Connection**: Seamless wallet integration with multiple providers
- **Multi-Chain Support**: Ethereum Sepolia and ZetaChain Testnet networks
- **Token Balance Fetching**: Real-time portfolio analysis with USD pricing
- **Secure Transactions**: Built on wagmi and viem for reliable blockchain interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A wallet (MetaMask, WalletConnect, etc.)
- API keys for external services (see Environment Variables)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/token-teller.git
   cd token-teller
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API Key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

   # RPC URLs
   NEXT_PUBLIC_ETHEREUM_RPC_URL=your_ethereum_sepolia_rpc_url
   NEXT_PUBLIC_ZETACHAIN_RPC_URL=your_zetachain_testnet_rpc_url

   # Dynamic Wallet Environment ID
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Google AI (for image generation)
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:4000](http://localhost:4000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom mystical themes
- **Blockchain**: wagmi, viem, ethers.js
- **Wallet Integration**: Dynamic Labs SDK
- **State Management**: React Query (TanStack Query)
- **AI Services**: OpenAI GPT-3.5, Google Imagen
- **Storage**: Supabase for image storage
- **UI Components**: Radix UI primitives

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── balance/       # Token balance fetching
│   │   ├── chat/          # AI chat functionality
│   │   └── fortune/       # Fortune generation
│   ├── fortune/           # Fortune reading page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Chat.tsx          # AI chat interface
│   ├── HeroSection.tsx   # Landing page hero
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── balanceService.ts # Blockchain balance fetching
│   ├── imageService.ts   # AI image generation
│   └── supabaseService.ts # Storage service
└── contexts/             # React contexts
```

## 🔧 API Endpoints

### POST `/api/fortune`
Generate a personalized BaZi fortune reading.

**Request Body:**
```json
{
  "address": "0x...",
  "chainIds": [11155111, 7001],
  "birthDate": "2023-01-01T12:00:00.000Z"
}
```

**Response:**
```json
{
  "fortune": "Your mystical fortune text...",
  "imageUrl": "https://supabase-url/fortune-image.png"
}
```

### POST `/api/chat`
Chat with the AI oracle about your fortune.

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "content": "What does my fortune mean?"}
  ],
  "fortune": "Your previous fortune reading..."
}
```

### POST `/api/balance`
Fetch token balances for connected wallets.

**Request Body:**
```json
{
  "address": "0x...",
  "chainIds": [11155111, 7001]
}
```

## 🌐 Supported Networks

| Network | Chain ID | Purpose |
|---------|----------|---------|
| Ethereum Sepolia | 11155111 | Testnet for Ethereum-based tokens |
| ZetaChain Testnet | 7001 | Cross-chain functionality testing |

## 🎯 Key Components

### [`BalanceService`](src/lib/balanceService.ts)
Handles multi-chain token balance fetching with USD pricing integration via CoinGecko API.

### [`FortuneAPI`](src/app/api/fortune/route.ts)
Generates personalized BaZi fortune readings using OpenAI GPT and creates mystical imagery with Google Imagen.

### [`Chat Component`](src/components/Chat.tsx)
Interactive AI chat interface for asking questions about fortune readings.

### [`Dynamic Wallet Integration`](src/components/DynamicWallet.tsx)
Seamless wallet connection supporting multiple providers and networks.

## 🎨 Customization

### Themes
The app uses a custom mystical theme with:
- Cosmic color palette (purples, golds, blues)
- Galaxy particle effects
- Ethereal animations and transitions
- Custom fonts (Orbitron for mystical text)

### Adding New Chains
1. Update [`wagmi.ts`](src/lib/wagmi.ts) with new chain configuration
2. Add RPC URLs to [`balanceService.ts`](src/lib/balanceService.ts)
3. Update token list in [`tokenList.ts`](src/lib/tokenList.ts)

### Extending Fortune Logic
Modify the prompt in [`fortune/route.ts`](src/app/api/fortune/route.ts) to customize:
- BaZi calculation methods
- Fortune interpretation styles
- Additional astrological elements

## 🔒 Security Considerations

- API keys are properly configured as environment variables
- Wallet connections use secure Dynamic Labs SDK
- Input validation on all API endpoints
- Rate limiting recommended for production deployment

## 🙏 Acknowledgments

- **BaZi Tradition**: Ancient Chinese fortune telling wisdom
- **Dynamic Labs**: Wallet integration infrastructure
- **OpenAI**: AI-powered fortune generation
- **Google Imagen**: Mystical image creation
- **Supabase**: Reliable storage solutions
- **Vercel**: Seamless deployment platform

## 🤔 Decision making
Due to time constrain I pulled off the modest MVP ever, persistation and best system-design/code practices were avoided to prevent delays on the delivery. Here is a comparative list of thing i would have done differently with proper time:

| Feature | Current implementation | Desired implementation |
| :------ | :---------------: | -----------------------: |
| Date Birth Persistant  | Local Storage | DB + webhooks |
| Fortune and Chat Persistant | - | DB
| Session | By wallet widget | By wallet widget + custom auto-singup-in with wallet address + webhooks |
| Wallet balance | Hitting CoinGecko api always for USD value comparison | Redis + TTL logic + multiple currency-crypto API |
| UI & UX | basic  | tailored theme + logo/s |
| NFT & media sharing | -  | On fortune result and images generated  |

---


## ✉️ Contact (anicarrr@gmail.com).