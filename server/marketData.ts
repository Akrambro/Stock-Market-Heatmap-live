import type { HoldingEntry, IndexId, StockQuote } from '../src/types/market.ts';

interface SeedStock {
  symbol: string;
  name: string;
  sector: string;
  indices: IndexId[];
  basePrice: number;
  marketCapCr: number;
  initPct: number;
  openRule?: 'O=L' | 'O=H';
  first5mFactor?: number;
}

const RAW_SEEDS: SeedStock[] = [
  // ================= NIFTY 50 (All also in NIFTY 100, 200, 500) =================
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1295.4, marketCapCr: 1752000, initPct: 1.42, openRule: 'O=L', first5mFactor: 0.62 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 4142.8, marketCapCr: 1498000, initPct: 0.88 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 1748.6, marketCapCr: 1334000, initPct: 1.15, openRule: 'O=L', first5mFactor: 0.55 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1624.5, marketCapCr: 926000, initPct: 2.79, openRule: 'O=L', first5mFactor: 0.48 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 1288.2, marketCapCr: 908000, initPct: 0.64 },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 1862.4, marketCapCr: 774000, initPct: 2.18, openRule: 'O=L', first5mFactor: 0.52 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 818.9, marketCapCr: 731000, initPct: -0.42 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 2486.0, marketCapCr: 584000, initPct: 1.05, openRule: 'O=L', first5mFactor: 0.65 },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 478.35, marketCapCr: 598000, initPct: 0.0 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 3592.0, marketCapCr: 494000, initPct: 1.65 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 6894.0, marketCapCr: 427000, initPct: 3.12, openRule: 'O=L', first5mFactor: 0.44 },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 1848.2, marketCapCr: 501000, initPct: -1.12, openRule: 'O=H', first5mFactor: 0.58 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind', sector: 'Pharma', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 1812.5, marketCapCr: 435000, initPct: -1.18, openRule: 'O=H', first5mFactor: 0.61 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Auto', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 11840.0, marketCapCr: 372000, initPct: -0.68 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Auto', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 2948.0, marketCapCr: 366000, initPct: 2.44 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 1768.4, marketCapCr: 351000, initPct: 0.24 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 1152.3, marketCapCr: 356000, initPct: -0.28 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', sector: 'Materials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 11240.0, marketCapCr: 324000, initPct: 0.72 },
  { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Utilities', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 388.45, marketCapCr: 376000, initPct: 1.64 },
  { symbol: 'TITAN', name: 'Titan Company Ltd', sector: 'Consumer', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 3294.0, marketCapCr: 292000, initPct: -1.52, openRule: 'O=H', first5mFactor: 0.54 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 264.8, marketCapCr: 333000, initPct: 0.3 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd', sector: 'Infrastructure', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1296.0, marketCapCr: 280000, initPct: 1.19 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp of India', sector: 'Utilities', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 324.6, marketCapCr: 302000, initPct: -0.22 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Auto', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 814.2, marketCapCr: 299000, initPct: -2.42, openRule: 'O=H', first5mFactor: 0.49 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', sector: 'Auto', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 9642.0, marketCapCr: 269000, initPct: 3.4, openRule: 'O=L', first5mFactor: 0.45 },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', sector: 'Energy', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 432.5, marketCapCr: 266000, initPct: 0.58 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 2512.0, marketCapCr: 241000, initPct: -3.28, openRule: 'O=H', first5mFactor: 0.42 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 568.4, marketCapCr: 297000, initPct: 1.19 },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', sector: 'Metals', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 148.6, marketCapCr: 185000, initPct: 4.18, openRule: 'O=L', first5mFactor: 0.41 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', sector: 'Metals', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 974.5, marketCapCr: 238000, initPct: 2.31 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', sector: 'Metals', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 668.2, marketCapCr: 150000, initPct: -1.62, openRule: 'O=H', first5mFactor: 0.53 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Infrastructure', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 2824.0, marketCapCr: 325000, initPct: -1.84 },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 2294.0, marketCapCr: 221000, initPct: -0.35 },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd', sector: 'Materials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 2634.0, marketCapCr: 174000, initPct: 0.44 },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 1684.5, marketCapCr: 164000, initPct: 1.92 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1662.0, marketCapCr: 265000, initPct: 2.02 },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Co', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1542.0, marketCapCr: 154000, initPct: 0.38 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Co', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 664.2, marketCapCr: 143000, initPct: -0.54 },
  { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 1528.0, marketCapCr: 123000, initPct: 1.65, openRule: 'O=L', first5mFactor: 0.56 },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Pharma', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 1246.0, marketCapCr: 104000, initPct: -0.92 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Ent', sector: 'Pharma', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 6948.0, marketCapCr: 100000, initPct: 1.35 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', sector: 'Auto', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 4862.0, marketCapCr: 133000, initPct: 0.2 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', sector: 'Auto', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 4790.0, marketCapCr: 95800, initPct: 0.45 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'FMCG', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 964.5, marketCapCr: 95200, initPct: -0.18 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 4982.0, marketCapCr: 120000, initPct: -1.34, openRule: 'O=H', first5mFactor: 0.59 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 1034.5, marketCapCr: 80600, initPct: -4.25, openRule: 'O=H', first5mFactor: 0.46 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corp', sector: 'Energy', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 304.2, marketCapCr: 132000, initPct: 0.94 },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd', sector: 'Financials', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 3012.0, marketCapCr: 113000, initPct: 2.55, openRule: 'O=L', first5mFactor: 0.51 },
  { symbol: 'TRENT', name: 'Trent Ltd', sector: 'Consumer', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 6724.0, marketCapCr: 239000, initPct: 4.52, openRule: 'O=L', first5mFactor: 0.43 },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd', sector: 'Infrastructure', indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 294.8, marketCapCr: 215000, initPct: 1.82 },

  // ================= NIFTY NEXT 50 (Completes NIFTY 100) =================
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd', sector: 'Infrastructure', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 4412.0, marketCapCr: 295000, initPct: 3.65, openRule: 'O=L', first5mFactor: 0.46 },
  { symbol: 'DLF', name: 'DLF Ltd', sector: 'Infrastructure', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 824.5, marketCapCr: 204000, initPct: 1.24 },
  { symbol: 'SIEMENS', name: 'Siemens Ltd', sector: 'Infrastructure', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 7142.0, marketCapCr: 254000, initPct: 2.15 },
  { symbol: 'ABB', name: 'ABB India Ltd', sector: 'Infrastructure', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 7420.0, marketCapCr: 157000, initPct: 0.85 },
  { symbol: 'VBL', name: 'Varun Beverages Ltd', sector: 'FMCG', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 598.4, marketCapCr: 194000, initPct: -1.42 },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Consumer', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 268.3, marketCapCr: 237000, initPct: 4.32, openRule: 'O=L', first5mFactor: 0.5 },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd', sector: 'Consumer', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 3824.0, marketCapCr: 249000, initPct: -2.18, openRule: 'O=H', first5mFactor: 0.47 },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd', sector: 'Consumer', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 4312.0, marketCapCr: 166000, initPct: 1.48 },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd', sector: 'Materials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 3082.0, marketCapCr: 156000, initPct: 0.32 },
  { symbol: 'IOC', name: 'Indian Oil Corp Ltd', sector: 'Energy', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 142.6, marketCapCr: 201000, initPct: -0.49 },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd', sector: 'Energy', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 198.4, marketCapCr: 130000, initPct: 0.92 },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 244.8, marketCapCr: 126000, initPct: 1.78, openRule: 'O=L', first5mFactor: 0.58 },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 104.2, marketCapCr: 119000, initPct: -0.84 },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 102.6, marketCapCr: 93000, initPct: 0.55 },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Inv & Fin', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1312.0, marketCapCr: 110000, initPct: 2.34 },
  { symbol: 'BAJAJHLDNG', name: 'Bajaj Holdings & Inv', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 10420.0, marketCapCr: 116000, initPct: 2.1 },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd', sector: 'Auto', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 2486.0, marketCapCr: 118000, initPct: 1.68 },
  { symbol: 'BOSCHLTD', name: 'Bosch Ltd', sector: 'Auto', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 34890.0, marketCapCr: 103000, initPct: 0.85 },
  { symbol: 'MOTHERSON', name: 'Samvardhana Motherson', sector: 'Auto', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 168.4, marketCapCr: 118000, initPct: -1.12 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories Ltd", sector: 'Pharma', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 5892.0, marketCapCr: 156000, initPct: 0.84 },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals', sector: 'Pharma', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 3290.0, marketCapCr: 111000, initPct: -0.26 },
  { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences Ltd', sector: 'Pharma', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 988.5, marketCapCr: 99400, initPct: 1.42 },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products', sector: 'FMCG', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 1246.3, marketCapCr: 127000, initPct: 0.81 },
  { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 528.4, marketCapCr: 93600, initPct: -0.31 },
  { symbol: 'MARICO', name: 'Marico Ltd', sector: 'FMCG', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 632.0, marketCapCr: 81800, initPct: 0.62 },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive India', sector: 'FMCG', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 2946.0, marketCapCr: 80100, initPct: 0.94 },
  { symbol: 'VEDL', name: 'Vedanta Ltd', sector: 'Metals', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 458.6, marketCapCr: 179000, initPct: 3.36, openRule: 'O=L', first5mFactor: 0.48 },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power', sector: 'Metals', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 942.5, marketCapCr: 96100, initPct: 1.54 },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd', sector: 'Materials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 548.2, marketCapCr: 135000, initPct: -0.64 },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd', sector: 'Materials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 25640.0, marketCapCr: 92500, initPct: -1.04 },
  { symbol: 'PFC', name: 'Power Finance Corp Ltd', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 468.2, marketCapCr: 154000, initPct: 0.63 },
  { symbol: 'RECLTD', name: 'REC Ltd', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 524.8, marketCapCr: 138000, initPct: 0.39 },
  { symbol: 'IRFC', name: 'Indian Railway Finance', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 148.9, marketCapCr: 194000, initPct: -2.65, openRule: 'O=H', first5mFactor: 0.51 },
  { symbol: 'HAVELLS', name: 'Havells India Ltd', sector: 'Consumer', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1692.0, marketCapCr: 106000, initPct: 1.12 },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life', sector: 'Financials', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 684.5, marketCapCr: 98800, initPct: 0.0 },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd', sector: 'IT', indices: ['NIFTY_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 6124.0, marketCapCr: 181000, initPct: 1.75 },

  // ================= NIFTY MIDCAP 100 & NIFTY 200 & NIFTY 500 =================
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd', sector: 'IT', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 5842.0, marketCapCr: 90800, initPct: 4.45, openRule: 'O=L', first5mFactor: 0.49 },
  { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 8240.0, marketCapCr: 55100, initPct: 2.94, openRule: 'O=L', first5mFactor: 0.55 },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd', sector: 'IT', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 2948.0, marketCapCr: 55800, initPct: 1.14 },
  { symbol: 'LTTS', name: 'L&T Technology Services', sector: 'IT', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_IT'], basePrice: 5214.0, marketCapCr: 55200, initPct: -0.58 },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Ltd', sector: 'IT', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1442.0, marketCapCr: 39500, initPct: -3.45, openRule: 'O=H', first5mFactor: 0.44 },
  { symbol: 'DIXON', name: 'Dixon Technologies India', sector: 'Consumer', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 15840.0, marketCapCr: 94800, initPct: 3.82, openRule: 'O=L', first5mFactor: 0.47 },
  { symbol: 'POLYCAB', name: 'Polycab India Ltd', sector: 'Infrastructure', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 6824.0, marketCapCr: 102000, initPct: 1.96 },
  { symbol: 'CUMMINSIND', name: 'Cummins India Ltd', sector: 'Infrastructure', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 3482.0, marketCapCr: 96500, initPct: 0.4 },
  { symbol: 'FEDERALBNK', name: 'The Federal Bank Ltd', sector: 'Financials', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 204.6, marketCapCr: 50100, initPct: 1.52 },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd', sector: 'Financials', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 64.8, marketCapCr: 47400, initPct: -1.65 },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank', sector: 'Financials', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 594.2, marketCapCr: 44200, initPct: -0.82 },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Financials', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_BANK'], basePrice: 172.4, marketCapCr: 27700, initPct: -2.44, openRule: 'O=H', first5mFactor: 0.53 },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute', sector: 'Pharma', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 1048.0, marketCapCr: 101000, initPct: 2.64 },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd', sector: 'Pharma', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 1284.0, marketCapCr: 75200, initPct: 0.2 },
  { symbol: 'LUPIN', name: 'Lupin Ltd', sector: 'Pharma', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 2112.0, marketCapCr: 96300, initPct: 1.88 },
  { symbol: 'BIOCON', name: 'Biocon Ltd', sector: 'Pharma', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 342.5, marketCapCr: 41100, initPct: -1.14 },
  { symbol: 'ALKEM', name: 'Alkem Laboratories Ltd', sector: 'Pharma', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 5492.0, marketCapCr: 65600, initPct: 0.48 },
  { symbol: 'LAURUSLABS', name: 'Laurus Labs Ltd', sector: 'Pharma', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_PHARMA'], basePrice: 538.4, marketCapCr: 29000, initPct: 3.18, openRule: 'O=L', first5mFactor: 0.48 },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Ltd', sector: 'Auto', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 224.6, marketCapCr: 65900, initPct: 1.25 },
  { symbol: 'BHARATFORG', name: 'Bharat Forge Ltd', sector: 'Auto', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 1348.0, marketCapCr: 64400, initPct: -0.95 },
  { symbol: 'MRF', name: 'MRF Ltd', sector: 'Auto', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 124600.0, marketCapCr: 52800, initPct: 0.04 },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries', sector: 'Auto', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 2792.0, marketCapCr: 53900, initPct: -1.85 },
  { symbol: 'EXIDEIND', name: 'Exide Industries Ltd', sector: 'Auto', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_AUTO'], basePrice: 446.2, marketCapCr: 37900, initPct: 3.4, openRule: 'O=L', first5mFactor: 0.46 },
  { symbol: 'SAIL', name: 'Steel Authority of India', sector: 'Metals', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 118.4, marketCapCr: 48900, initPct: 1.08 },
  { symbol: 'NMDC', name: 'NMDC Ltd', sector: 'Metals', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 234.6, marketCapCr: 68700, initPct: -0.62 },
  { symbol: 'NATIONALUM', name: 'National Aluminium Co', sector: 'Metals', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 238.9, marketCapCr: 43800, initPct: 4.68, openRule: 'O=L', first5mFactor: 0.52 },
  { symbol: 'APLAPOLLO', name: 'APL Apollo Tubes Ltd', sector: 'Metals', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 1524.0, marketCapCr: 42200, initPct: -2.05 },
  { symbol: 'HINDCOPPER', name: 'Hindustan Copper Ltd', sector: 'Metals', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 288.4, marketCapCr: 27800, initPct: 2.95 },
  { symbol: 'SUZLON', name: 'Suzlon Energy Ltd', sector: 'Utilities', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 64.2, marketCapCr: 87400, initPct: -4.15, openRule: 'O=H', first5mFactor: 0.47 },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals', sector: 'Infrastructure', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 248.6, marketCapCr: 86500, initPct: 1.44 },
  { symbol: 'VOLTAS', name: 'Voltas Ltd', sector: 'Consumer', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1692.0, marketCapCr: 55900, initPct: -0.45 },
  { symbol: 'ASTRAL', name: 'Astral Ltd', sector: 'Materials', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1794.0, marketCapCr: 48200, initPct: -1.32 },
  { symbol: 'CONCOR', name: 'Container Corp of India', sector: 'Infrastructure', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 824.0, marketCapCr: 50200, initPct: -0.3 },
  { symbol: 'TATACOMM', name: 'Tata Communications Ltd', sector: 'Telecom', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1762.0, marketCapCr: 50200, initPct: 0.96 },
  { symbol: 'INDUSTOWER', name: 'Indus Towers Ltd', sector: 'Telecom', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 348.5, marketCapCr: 91900, initPct: 0.8 },
  { symbol: 'UBL', name: 'United Breweries Ltd', sector: 'FMCG', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 1962.0, marketCapCr: 51800, initPct: 1.65 },
  { symbol: 'EMAMILTD', name: 'Emami Ltd', sector: 'FMCG', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_FMCG'], basePrice: 682.4, marketCapCr: 29800, initPct: -0.78 },
  { symbol: 'PHOENIXLTD', name: 'The Phoenix Mills Ltd', sector: 'Infrastructure', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 1648.0, marketCapCr: 58900, initPct: 2.22 },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Ltd', sector: 'Financials', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 624.5, marketCapCr: 34300, initPct: 1.33 },
  { symbol: 'PAGEIND', name: 'Page Industries Ltd', sector: 'Consumer', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500'], basePrice: 44980.0, marketCapCr: 50100, initPct: 0.0 },

  // ================= NIFTY 500 EXPANDED CONSTITUENTS =================
  { symbol: 'CDSL', name: 'Central Depository Services', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 1624.0, marketCapCr: 33900, initPct: 4.82, openRule: 'O=L', first5mFactor: 0.54 },
  { symbol: 'BSE', name: 'BSE Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 4680.0, marketCapCr: 63300, initPct: 3.45, openRule: 'O=L', first5mFactor: 0.49 },
  { symbol: 'MCX', name: 'Multi Commodity Exchange', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 6240.0, marketCapCr: 31800, initPct: 2.65 },
  { symbol: 'ANGELONE', name: 'Angel One Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 2890.0, marketCapCr: 26000, initPct: -1.78 },
  { symbol: 'CAMS', name: 'Computer Age Management', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 4480.0, marketCapCr: 22100, initPct: 1.92 },
  { symbol: 'KFINTECH', name: 'KFin Technologies Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 1142.0, marketCapCr: 19600, initPct: 2.41 },
  { symbol: 'IEX', name: 'Indian Energy Exchange', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 184.5, marketCapCr: 16400, initPct: -0.94 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 328.4, marketCapCr: 208000, initPct: 1.38 },
  { symbol: 'PAYTM', name: 'One 97 Communications Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 894.0, marketCapCr: 56900, initPct: 3.14 },
  { symbol: 'POLICYBZR', name: 'PB Fintech Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 1842.0, marketCapCr: 84000, initPct: 2.28 },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 174.2, marketCapCr: 49700, initPct: -1.25 },
  { symbol: 'DELHIVERY', name: 'Delhivery Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 368.5, marketCapCr: 27300, initPct: -2.14, openRule: 'O=H', first5mFactor: 0.45 },
  { symbol: 'TATATECH', name: 'Tata Technologies Ltd', sector: 'IT', indices: ['NIFTY_500'], basePrice: 964.0, marketCapCr: 39100, initPct: -0.86 },
  { symbol: 'KAYNES', name: 'Kaynes Technology India', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 5840.0, marketCapCr: 37400, initPct: 4.12, openRule: 'O=L', first5mFactor: 0.47 },
  { symbol: 'DATAPATTNS', name: 'Data Patterns (India) Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 2420.0, marketCapCr: 13500, initPct: 1.72 },
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1524.0, marketCapCr: 40100, initPct: 2.86 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 4280.0, marketCapCr: 86300, initPct: 3.32, openRule: 'O=L', first5mFactor: 0.44 },
  { symbol: 'GRSE', name: 'Garden Reach Shipbuilders', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1684.0, marketCapCr: 19300, initPct: 1.62 },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 442.5, marketCapCr: 92200, initPct: -1.48 },
  { symbol: 'IRCON', name: 'Ircon International Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 214.8, marketCapCr: 20200, initPct: -0.92 },
  { symbol: 'RAILTEL', name: 'RailTel Corp of India', sector: 'Telecom', indices: ['NIFTY_500'], basePrice: 412.6, marketCapCr: 13200, initPct: 0.74 },
  { symbol: 'HUDCO', name: 'Housing & Urban Dev Corp', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 234.5, marketCapCr: 46900, initPct: 1.18 },
  { symbol: 'NBCC', name: 'NBCC (India) Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 98.4, marketCapCr: 26500, initPct: 2.08 },
  { symbol: 'DEEPAKNTR', name: 'Deepak Nitrite Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 2684.0, marketCapCr: 36600, initPct: -1.16 },
  { symbol: 'NAVINFLUOR', name: 'Navin Fluorine Intl', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 3420.0, marketCapCr: 16900, initPct: 0.65 },
  { symbol: 'FLUOROCHEM', name: 'Gujarat Fluorochemicals', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 4110.0, marketCapCr: 45100, initPct: 1.24 },
  { symbol: 'SRF', name: 'SRF Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 2314.0, marketCapCr: 68600, initPct: -0.44 },
  { symbol: 'PIIND', name: 'PI Industries Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 4180.0, marketCapCr: 63400, initPct: 0.92 },
  { symbol: 'UPL', name: 'UPL Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 548.2, marketCapCr: 41100, initPct: -2.42 },
  { symbol: 'ATUL', name: 'Atul Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 7120.0, marketCapCr: 21000, initPct: 0.34 },
  { symbol: 'COROMANDEL', name: 'Coromandel International', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 1742.0, marketCapCr: 51200, initPct: 1.56 },
  { symbol: 'CHAMBLFERT', name: 'Chambal Fertilisers', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 498.6, marketCapCr: 20000, initPct: 0.82 },
  { symbol: 'KEI', name: 'KEI Industries Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 4190.0, marketCapCr: 37800, initPct: 2.38 },
  { symbol: 'KPIL', name: 'Kalpataru Projects Intl', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1248.0, marketCapCr: 20300, initPct: 1.04 },
  { symbol: 'KEC', name: 'KEC International Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1084.0, marketCapCr: 28800, initPct: 1.85 },
  { symbol: 'THERMAX', name: 'Thermax Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 4780.0, marketCapCr: 56900, initPct: -0.72 },
  { symbol: 'TIMKEN', name: 'Timken India Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 3310.0, marketCapCr: 24900, initPct: 0.42 },
  { symbol: 'SCHAEFFLER', name: 'Schaeffler India Ltd', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 3640.0, marketCapCr: 56800, initPct: -0.58 },
  { symbol: 'SOLARINDS', name: 'Solar Industries India', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 10240.0, marketCapCr: 92600, initPct: 2.74 },
  { symbol: 'MANKIND', name: 'Mankind Pharma Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 2680.0, marketCapCr: 107000, initPct: 1.44 },
  { symbol: 'GLAND', name: 'Gland Pharma Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 1742.0, marketCapCr: 28700, initPct: -1.94 },
  { symbol: 'NATCOPHARM', name: 'Natco Pharma Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 1384.0, marketCapCr: 24800, initPct: 2.18 },
  { symbol: 'JBCHEPHARM', name: 'J.B. Chemicals & Pharma', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 1842.0, marketCapCr: 28600, initPct: 0.64 },
  { symbol: 'LALPATHLAB', name: 'Dr. Lal PathLabs Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 3042.0, marketCapCr: 25400, initPct: -0.38 },
  { symbol: 'SYNGENE', name: 'Syngene International', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 864.5, marketCapCr: 34800, initPct: 0.96 },
  { symbol: 'IPCALAB', name: 'Ipca Laboratories Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 1582.0, marketCapCr: 40100, initPct: 1.28 },
  { symbol: 'AJANTPHARM', name: 'Ajanta Pharma Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 2948.0, marketCapCr: 37100, initPct: 0.52 },
  { symbol: 'RADICO', name: 'Radico Khaitan Ltd', sector: 'FMCG', indices: ['NIFTY_500'], basePrice: 2340.0, marketCapCr: 31300, initPct: 1.76 },
  { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks Ltd', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 642.5, marketCapCr: 42400, initPct: -1.08 },
  { symbol: 'DEVYANI', name: 'Devyani International', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 174.8, marketCapCr: 21100, initPct: -2.35 },
  { symbol: 'BATAINDIA', name: 'Bata India Ltd', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 1364.0, marketCapCr: 17500, initPct: -0.64 },
  { symbol: 'METROBRAND', name: 'Metro Brands Ltd', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 1218.0, marketCapCr: 33100, initPct: 0.48 },
  { symbol: 'KAJARIACER', name: 'Kajaria Ceramics Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 1194.0, marketCapCr: 19000, initPct: -1.42 },
  { symbol: 'SUPREMEIND', name: 'Supreme Industries Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 4680.0, marketCapCr: 59400, initPct: 1.15 },
  { symbol: 'BLUESTARCO', name: 'Blue Star Ltd', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 1924.0, marketCapCr: 39600, initPct: 2.54 },
  { symbol: 'AMBER', name: 'Amber Enterprises India', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 6140.0, marketCapCr: 20700, initPct: 3.12 },
  { symbol: 'CROMPTON', name: 'Crompton Greaves Cons', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 394.6, marketCapCr: 25400, initPct: 0.88 },
  { symbol: 'TATAPOWER', name: 'Tata Power Co Ltd', sector: 'Utilities', indices: ['NIFTY_500'], basePrice: 424.8, marketCapCr: 135000, initPct: 1.62 },
  { symbol: 'TORNTPOWER', name: 'Torrent Power Ltd', sector: 'Utilities', indices: ['NIFTY_500'], basePrice: 1684.0, marketCapCr: 80900, initPct: 2.14 },
  { symbol: 'JSWENERGY', name: 'JSW Energy Ltd', sector: 'Utilities', indices: ['NIFTY_500'], basePrice: 684.2, marketCapCr: 119000, initPct: -1.22 },
  { symbol: 'NHPC', name: 'NHPC Ltd', sector: 'Utilities', indices: ['NIFTY_500'], basePrice: 82.4, marketCapCr: 82800, initPct: -0.48 },
  { symbol: 'SJVN', name: 'SJVN Ltd', sector: 'Utilities', indices: ['NIFTY_500'], basePrice: 112.6, marketCapCr: 44200, initPct: -1.68 },
  { symbol: 'IGL', name: 'Indraprastha Gas Ltd', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 384.2, marketCapCr: 26900, initPct: -3.12, openRule: 'O=H', first5mFactor: 0.49 },
  { symbol: 'MGL', name: 'Mahanagar Gas Ltd', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 1294.0, marketCapCr: 12800, initPct: -1.84 },
  { symbol: 'GUJGASLTD', name: 'Gujarat Gas Ltd', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 492.5, marketCapCr: 33900, initPct: -0.62 },
  { symbol: 'PETRONET', name: 'Petronet LNG Ltd', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 334.6, marketCapCr: 50200, initPct: 0.44 },
  { symbol: 'OIL', name: 'Oil India Ltd', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 498.4, marketCapCr: 81000, initPct: 1.94 },
  { symbol: 'MRPL', name: 'Mangalore Refinery & Petro', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 158.2, marketCapCr: 27700, initPct: 0.72 },
  { symbol: 'CASTROLIND', name: 'Castrol India Ltd', sector: 'Energy', indices: ['NIFTY_500'], basePrice: 204.8, marketCapCr: 20200, initPct: 0.28 },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 2840.0, marketCapCr: 78900, initPct: 1.92 },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1984.0, marketCapCr: 72100, initPct: 2.38 },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1642.0, marketCapCr: 70700, initPct: 1.14 },
  { symbol: 'LODHA', name: 'Macrotech Developers Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1324.0, marketCapCr: 131000, initPct: 0.86 },
  { symbol: 'BRIGADE', name: 'Brigade Enterprises Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1214.0, marketCapCr: 29600, initPct: 1.52 },
  { symbol: 'SOBHA', name: 'Sobha Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 1620.0, marketCapCr: 17300, initPct: -0.94 },
  { symbol: 'TEJASNET', name: 'Tejas Networks Ltd', sector: 'Telecom', indices: ['NIFTY_500'], basePrice: 1284.0, marketCapCr: 22100, initPct: 3.48 },
  { symbol: 'CYIENT', name: 'Cyient Ltd', sector: 'IT', indices: ['NIFTY_500'], basePrice: 1924.0, marketCapCr: 21300, initPct: 0.68 },
  { symbol: 'SONACOMS', name: 'Sona BLW Precision Forg', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 642.8, marketCapCr: 39900, initPct: -0.74 },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd', sector: 'IT', indices: ['NIFTY_500'], basePrice: 6940.0, marketCapCr: 43200, initPct: -1.42 },
  { symbol: 'OFSS', name: 'Oracle Financial Services', sector: 'IT', indices: ['NIFTY_500'], basePrice: 11420.0, marketCapCr: 99100, initPct: 2.84 },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 1942.0, marketCapCr: 77900, initPct: 1.58 },
  { symbol: 'MANAPPURAM', name: 'Manappuram Finance Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 168.4, marketCapCr: 14200, initPct: -2.14 },
  { symbol: 'SUNDARMFIN', name: 'Sundaram Finance Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 4820.0, marketCapCr: 53500, initPct: 0.92 },
  { symbol: 'ABCAPITAL', name: 'Aditya Birla Capital Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 198.4, marketCapCr: 51600, initPct: -0.52 },
  { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Fin', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 274.8, marketCapCr: 33900, initPct: 0.44 },
  { symbol: 'LTF', name: 'L&T Finance Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 148.2, marketCapCr: 36900, initPct: -0.88 },
  { symbol: 'POONAWALLA', name: 'Poonawalla Fincorp Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 342.6, marketCapCr: 26600, initPct: -1.62 },
  { symbol: 'CGPOWER', name: 'CG Power & Industrial', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 724.5, marketCapCr: 110000, initPct: 2.42 },
  { symbol: 'APLAPOLLO', name: 'APL Apollo Tubes Ltd', sector: 'Metals', indices: ['NIFTY_MIDCAP_100', 'NIFTY_200', 'NIFTY_500', 'NIFTY_METAL'], basePrice: 1524.0, marketCapCr: 42200, initPct: -2.05 },
  { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes', sector: 'Metals', indices: ['NIFTY_500'], basePrice: 3420.0, marketCapCr: 23900, initPct: 0.62 },
  { symbol: 'WELCORP', name: 'Welspun Corp Ltd', sector: 'Metals', indices: ['NIFTY_500'], basePrice: 784.5, marketCapCr: 20500, initPct: 1.94 },
  { symbol: 'ESCORTS', name: 'Escorts Kubota Ltd', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 3680.0, marketCapCr: 41100, initPct: 0.78 },
  { symbol: 'TIINDIA', name: 'Tube Investments of India', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 3740.0, marketCapCr: 72300, initPct: 1.48 },
  { symbol: 'SUNDRMFAST', name: 'Sundram Fasteners Ltd', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 1242.0, marketCapCr: 26100, initPct: -0.34 },
  { symbol: 'ENDURANCE', name: 'Endurance Technologies', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 2420.0, marketCapCr: 34000, initPct: 0.92 },
  { symbol: 'UNO_MINDA', name: 'UNO Minda Ltd', sector: 'Auto', indices: ['NIFTY_500'], basePrice: 1024.0, marketCapCr: 58700, initPct: 2.18 },
  { symbol: 'APARINDS', name: 'Apar Industries Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 9420.0, marketCapCr: 37800, initPct: 3.12 },
  { symbol: 'TRITURBINE', name: 'Triveni Turbine Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 712.5, marketCapCr: 22600, initPct: 1.84 },
  { symbol: 'HONAUT', name: 'Honeywell Automation', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 44800.0, marketCapCr: 39600, initPct: -0.62 },
  { symbol: '3MINDIA', name: '3M India Ltd', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 32400.0, marketCapCr: 36500, initPct: 0.24 },
  { symbol: 'PGHH', name: 'Procter & Gamble Hygiene', sector: 'FMCG', indices: ['NIFTY_500'], basePrice: 15840.0, marketCapCr: 51400, initPct: -0.42 },
  { symbol: 'GILLETTE', name: 'Gillette India Ltd', sector: 'FMCG', indices: ['NIFTY_500'], basePrice: 9420.0, marketCapCr: 30700, initPct: 1.12 },
  { symbol: 'TATACHEM', name: 'Tata Chemicals Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 1048.0, marketCapCr: 26700, initPct: -1.14 },
  { symbol: 'ACC', name: 'ACC Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 2214.0, marketCapCr: 41500, initPct: -0.48 },
  { symbol: 'DALBHARAT', name: 'Dalmia Bharat Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 1842.0, marketCapCr: 34500, initPct: 0.64 },
  { symbol: 'RAMCOCEM', name: 'The Ramco Cements Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 924.5, marketCapCr: 21800, initPct: 1.22 },
  { symbol: 'JKCEMENT', name: 'JK Cement Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 4380.0, marketCapCr: 33800, initPct: 1.68 },
  { symbol: 'GMRINFRA', name: 'GMR Airports Ltd', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 84.2, marketCapCr: 88900, initPct: 0.94 },
  { symbol: 'IRB', name: 'IRB Infrastructure Dev', sector: 'Infrastructure', indices: ['NIFTY_500'], basePrice: 58.4, marketCapCr: 35200, initPct: -1.36 },
  { symbol: 'HFCL', name: 'HFCL Ltd', sector: 'Telecom', indices: ['NIFTY_500'], basePrice: 124.6, marketCapCr: 17900, initPct: 2.48 },
  { symbol: 'ITI', name: 'ITI Ltd', sector: 'Telecom', indices: ['NIFTY_500'], basePrice: 342.0, marketCapCr: 32800, initPct: 4.12 },
  { symbol: 'ABFRL', name: 'Aditya Birla Fashion', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 294.5, marketCapCr: 31500, initPct: -1.54 },
  { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 712.4, marketCapCr: 73400, initPct: 2.94 },
  { symbol: 'MANYAVAR', name: 'Vedant Fashions Ltd', sector: 'Consumer', indices: ['NIFTY_500'], basePrice: 1294.0, marketCapCr: 31400, initPct: -0.82 },
  { symbol: 'FORTIS', name: 'Fortis Healthcare Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 648.5, marketCapCr: 48900, initPct: 1.84 },
  { symbol: 'NH', name: 'Narayana Hrudayalaya', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 1284.0, marketCapCr: 26200, initPct: 0.72 },
  { symbol: 'MEDANTA', name: 'Global Health Ltd', sector: 'Pharma', indices: ['NIFTY_500'], basePrice: 1094.0, marketCapCr: 29300, initPct: -0.46 },
  { symbol: 'AARTIIND', name: 'Aarti Industries Ltd', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 448.6, marketCapCr: 16200, initPct: -2.18 },
  { symbol: 'TATVA', name: 'Tatva Chintan Pharma', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 912.0, marketCapCr: 2130, initPct: -1.12 },
  { symbol: 'CLEAN', name: 'Clean Science & Tech', sector: 'Materials', indices: ['NIFTY_500'], basePrice: 1482.0, marketCapCr: 15700, initPct: 0.54 },
  { symbol: 'BSOFT', name: 'Birlasoft Ltd', sector: 'IT', indices: ['NIFTY_500'], basePrice: 594.2, marketCapCr: 16400, initPct: 1.24 },
  { symbol: 'ZENSARTECH', name: 'Zensar Technologies Ltd', sector: 'IT', indices: ['NIFTY_500'], basePrice: 764.5, marketCapCr: 17300, initPct: 2.12 },
  { symbol: 'SONATSOFTW', name: 'Sonata Software Ltd', sector: 'IT', indices: ['NIFTY_500'], basePrice: 624.8, marketCapCr: 17500, initPct: -0.94 },
  { symbol: 'HAPPSTMNDS', name: 'Happiest Minds Tech', sector: 'IT', indices: ['NIFTY_500'], basePrice: 742.0, marketCapCr: 11300, initPct: -1.32 },
  { symbol: 'INTELLECT', name: 'Intellect Design Arena', sector: 'IT', indices: ['NIFTY_500'], basePrice: 924.0, marketCapCr: 12700, initPct: 1.46 },
  { symbol: 'FSL', name: 'Firstsource Solutions', sector: 'IT', indices: ['NIFTY_500'], basePrice: 364.2, marketCapCr: 25400, initPct: 2.68 },
  { symbol: 'IDBI', name: 'IDBI Bank Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 82.4, marketCapCr: 88500, initPct: 0.36 },
  { symbol: 'INDIANB', name: 'Indian Bank', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 564.2, marketCapCr: 76000, initPct: 1.42 },
  { symbol: 'MAHABANK', name: 'Bank of Maharashtra', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 56.8, marketCapCr: 43600, initPct: 0.88 },
  { symbol: 'UCOBANK', name: 'UCO Bank', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 46.2, marketCapCr: 55200, initPct: -0.64 },
  { symbol: 'CENTRALBK', name: 'Central Bank of India', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 54.8, marketCapCr: 47500, initPct: -0.92 },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 124.5, marketCapCr: 95000, initPct: 1.18 },
  { symbol: 'IOB', name: 'Indian Overseas Bank', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 54.4, marketCapCr: 102000, initPct: -0.44 },
  { symbol: 'KARURVYSYA', name: 'Karur Vysya Bank Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 224.6, marketCapCr: 17900, initPct: 1.92 },
  { symbol: 'RBLBANK', name: 'RBL Bank Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 174.2, marketCapCr: 10500, initPct: -2.38 },
  { symbol: 'CUB', name: 'City Union Bank Ltd', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 178.4, marketCapCr: 13200, initPct: 0.74 },
  { symbol: 'EQUITASBNK', name: 'Equitas Small Finance', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 68.4, marketCapCr: 7780, initPct: -1.18 },
  { symbol: 'UJJIVANSFB', name: 'Ujjivan Small Finance', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 36.8, marketCapCr: 7120, initPct: -1.62 },
  { symbol: 'NIACL', name: 'New India Assurance Co', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 198.4, marketCapCr: 32700, initPct: 0.52 },
  { symbol: 'GICRE', name: 'General Insurance Corp', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 394.6, marketCapCr: 69200, initPct: 0.94 },
  { symbol: 'STARHEALTH', name: 'Star Health & Allied Ins', sector: 'Financials', indices: ['NIFTY_500'], basePrice: 484.2, marketCapCr: 28400, initPct: -1.48 },
];

export function buildInitialStocks(): StockQuote[] {
  const now = Date.now();
  const seen = new Set<string>();
  const result: StockQuote[] = [];

  for (const seed of RAW_SEEDS) {
    if (seen.has(seed.symbol)) continue;
    seen.add(seed.symbol);

    const prevClose = Number(seed.basePrice.toFixed(2));
    const ltp = Number((prevClose * (1 + seed.initPct / 100)).toFixed(2));
    const change = Number((ltp - prevClose).toFixed(2));
    const pctChange = Number(seed.initPct.toFixed(2));

    let open = prevClose;
    let high = Math.max(prevClose, ltp);
    let low = Math.min(prevClose, ltp);

    if (seed.openRule === 'O=L') {
      open = Number(
        (prevClose * (1 + Math.max(0.001, seed.initPct * 0.002))).toFixed(2)
      );
      low = open;
      high = Number(Math.max(ltp, open * 1.004).toFixed(2));
    } else if (seed.openRule === 'O=H') {
      open = Number(
        (prevClose * (1 + Math.min(-0.001, seed.initPct * 0.002))).toFixed(2)
      );
      high = open;
      low = Number(Math.min(ltp, open * 0.996).toFixed(2));
    } else {
      const swing = Math.max(0.004, Math.abs(seed.initPct) * 0.004);
      open = Number(
        (prevClose * (1 + (seed.initPct >= 0 ? 0.002 : -0.002))).toFixed(2)
      );
      high = Number(Math.max(open, ltp, prevClose * (1 + swing)).toFixed(2));
      low = Number(Math.min(open, ltp, prevClose * (1 - swing)).toFixed(2));
    }

    // First 5-minute candle (09:15 - 09:20 IST)
    const factor = seed.first5mFactor ?? 0.5;
    const first5mOpen = open;
    let first5mClose = Number(
      (open + (ltp - open) * factor).toFixed(2)
    );
    if (seed.openRule === 'O=L' && first5mClose < open) {
      first5mClose = Number((open * 1.004).toFixed(2));
    }
    if (seed.openRule === 'O=H' && first5mClose > open) {
      first5mClose = Number((open * 0.996).toFixed(2));
    }
    const first5mChangePct =
      first5mOpen > 0
        ? Number(
            (((first5mClose - first5mOpen) / first5mOpen) * 100).toFixed(2)
          )
        : 0;

    const baseVol = Math.round(
      (seed.marketCapCr * 18) / Math.max(50, prevClose)
    );

    result.push({
      symbol: seed.symbol,
      name: seed.name,
      sector: seed.sector,
      indices: seed.indices,
      prevClose,
      open,
      high,
      low,
      ltp,
      change,
      pctChange,
      volume: baseVol,
      marketCapCr: seed.marketCapCr,
      first5mOpen,
      first5mClose,
      first5mChangePct,
      tickDirection: 'flat',
      lastTickAt: now,
    });
  }

  return result;
}

export const INITIAL_WATCHLIST: string[] = [
  'RELIANCE',
  'TCS',
  'HDFCBANK',
  'INFY',
  'BAJFINANCE',
  'TATAMOTORS',
  'TATASTEEL',
  'PERSISTENT',
  'DIXON',
  'HAL',
  'ZOMATO',
  'TRENT',
  'CDSL',
  'BSE',
];

export const INITIAL_HOLDINGS: HoldingEntry[] = [
  { symbol: 'RELIANCE', qty: 45, avgPrice: 1240.0 },
  { symbol: 'INFY', qty: 60, avgPrice: 1785.5 },
  { symbol: 'HDFCBANK', qty: 80, avgPrice: 1690.0 },
  { symbol: 'BAJFINANCE', qty: 15, avgPrice: 6620.0 },
  { symbol: 'TATAMOTORS', qty: 120, avgPrice: 845.0 },
  { symbol: 'TATASTEEL', qty: 350, avgPrice: 139.2 },
  { symbol: 'PERSISTENT', qty: 20, avgPrice: 5420.0 },
  { symbol: 'HAL', qty: 25, avgPrice: 4180.0 },
];
