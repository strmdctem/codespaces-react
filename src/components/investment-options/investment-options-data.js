// Investment Options Data - Parsed from markdown table
// This data structure supports filtering, comparison, and analysis

export const investmentOptions = [
  {
    id: 'overnight-fund',
    name: 'Overnight Fund',
    category: 'Ultra Short Term',
    tags: ['Ultra Safe', 'Instant Liquidity', 'Emergency Fund'],

    // Financial metrics
    expectedReturns: { min: 4, max: 5 },
    riskLevel: 'Very Low',
    volatility: 'Very Low',
    returnConsistency: 'Very High (Stable)', // Investment details
    taxation: 'Income slab rate',
    exitLoad: 'None',
    investmentMode: ['Lumpsum Only'],
    partialWithdrawal: 'Yes',

    // Time-based attributes
    idealHoldingPeriod: { min: 1, max: 7, unit: 'days' },
    withdrawalSpeed: 'Same day (T+0)',

    // Suitability
    whoShouldConsider: 'Ultra-short parking',
    whatItInvestsIn: '1-day maturity debt',
    goodThings: 'Safest, zero volatility',
    thingsToNote: 'Very low returns',
    examples: ['HDFC Overnight', 'ICICI Overnight'],

    // UI properties
    color: 'success',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    description:
      'Safest fund for parking money for a few days. Offers instant liquidity.'
  },
  {
    id: 'liquid-fund',
    name: 'Liquid Fund',
    category: 'Ultra Short Term',
    tags: ['Emergency Fund', 'High Liquidity', 'Safe'],

    expectedReturns: { min: 6, max: 6.5 },
    riskLevel: 'Very Low',
    volatility: 'Very Low',
    returnConsistency: 'Very High (Stable)',
    taxation: 'Income slab rate',
    exitLoad: 'None',
    investmentMode: ['Lumpsum Preferred', 'SIP Suitable'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 1, max: 30, unit: 'days' },
    withdrawalSpeed: 'Same day or next day (T+0/T+1)',

    whoShouldConsider: 'Emergency funds',
    whatItInvestsIn: 'T-bills, repo, call money',
    goodThings: 'Instant access, very safe',
    thingsToNote: 'Might not beat inflation',
    examples: ['ICICI Liquid', 'HDFC Liquid'],

    color: 'info',
    icon: '💧',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    description:
      'A very safe and highly liquid fund for short-term parking and emergency needs.'
  },
  {
    id: 'money-market-fund',
    name: 'Money Market Fund',
    category: 'Short Term',
    tags: ['Short Parking', 'Better Yield', 'Low Risk'],

    expectedReturns: { min: 6, max: 7 },
    riskLevel: 'Very Low',
    volatility: 'Very Low',
    returnConsistency: 'Very High (Stable)',
    taxation: 'Income slab rate',
    exitLoad: 'None',
    investmentMode: ['Lumpsum Preferred', 'SIP Suitable'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 7, max: 90, unit: 'days' },
    withdrawalSpeed: 'Same day (T+0)',

    whoShouldConsider: 'Short-term parking',
    whatItInvestsIn: 'Money market instruments',
    goodThings: 'Low risk + better yield',
    thingsToNote: 'Slightly lower liquidity',
    examples: ['ICICI Money Market', 'Kotak MMF'],

    color: 'primary',
    icon: '🏦',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    description:
      'Low-risk fund for short-term parking, offering better returns than savings accounts.'
  },
  {
    id: 'arbitrage-fund',
    name: 'Arbitrage Fund',
    category: 'Tax Efficient',
    tags: ['Tax Efficient', 'Low Risk', 'Equity Taxation'],

    expectedReturns: { min: 6, max: 7 },
    riskLevel: 'Low',
    volatility: 'Low',
    returnConsistency: 'High (Stable)',
    taxation: '15% < 1 yr, 10% > 1 yr (after ₹1L exempt)',
    exitLoad: '0–0.25% if < 30 days',
    investmentMode: ['Lumpsum Preferred', 'SIP Preferred'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 90, max: 365, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Low-tax short-term option',
    whatItInvestsIn: 'Arbitrage between equity spot & futures',
    goodThings: 'Low risk + equity taxation',
    thingsToNote: 'Limited growth potential',
    examples: ['ICICI Arbitrage', 'Kotak Arbitrage'],

    color: 'secondary',
    icon: '⚖️',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    description:
      'Tax-efficient, low-risk fund using arbitrage opportunities in equity markets.'
  },
  {
    id: 'ultra-short-term-fund',
    name: 'Ultra Short-Term Fund',
    category: 'Short Term',
    tags: ['3-6 Months', 'Safe', 'Better Returns'],

    expectedReturns: { min: 6, max: 7 },
    riskLevel: 'Very Low to Low',
    volatility: 'Very Low',
    returnConsistency: 'High (Stable)',
    taxation: 'Income slab rate',
    exitLoad: 'Usually none',
    investmentMode: ['Lumpsum Preferred', 'SIP Suitable'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 90, max: 180, unit: 'days' },
    withdrawalSpeed: '1–2 business days (T+1/T+2)',

    whoShouldConsider: 'Parking for 3–6 months',
    whatItInvestsIn: 'Very short-term bonds',
    goodThings: 'Safe + slightly higher returns',
    thingsToNote: 'Mild NAV movement possible',
    examples: ['HDFC Ultra Short Term'],

    color: 'warning',
    icon: '📈',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description:
      'Safe fund for parking money for 3–6 months, with slightly higher returns than liquid funds.'
  },
  {
    id: 'low-duration-fund',
    name: 'Low Duration Fund',
    category: 'Short Term',
    tags: ['6-12 Months', 'Moderate Duration', 'Stable'],

    expectedReturns: { min: 6, max: 7 },
    riskLevel: 'Low',
    volatility: 'Low',
    returnConsistency: 'High (Stable)',
    taxation: 'Income slab rate',
    exitLoad: 'Usually none',
    investmentMode: ['Lumpsum Preferred', 'SIP Suitable'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 180, max: 365, unit: 'days' },
    withdrawalSpeed: '1–2 business days (T+1/T+2)',

    whoShouldConsider: 'Parking for 6–12 months',
    whatItInvestsIn: '6–12 month duration debt',
    goodThings: 'Safe + slightly longer yield',
    thingsToNote: 'Still short-term, not for goals',
    examples: ['Axis Low Duration', 'IDFC Low Duration'],

    color: 'info',
    icon: '🕒',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    description:
      'Stable fund for 6–12 month parking, offering better returns than savings accounts.'
  },
  {
    id: 'short-duration-fund',
    name: 'Short Duration Fund',
    category: 'Medium Term',
    tags: ['1-3 Years', 'Better Returns', 'Goal Based'],

    expectedReturns: { min: 6.5, max: 7.5 },
    riskLevel: 'Low to Moderate',
    volatility: 'Low to Moderate',
    returnConsistency: 'High',
    taxation: 'Income slab rate',
    exitLoad: 'Usually none',
    investmentMode: ['Lumpsum Preferred', 'SIP Preferred'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 365, max: 1095, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Short-term goals (1–2 yrs)',
    whatItInvestsIn: 'Short-term debt instruments',
    goodThings: 'Better than Liquid/FD',
    thingsToNote: 'May fluctuate in rate cycles',
    examples: ['HDFC Short Term', 'ICICI Short Term'],

    color: 'primary',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    description:
      'A fund for short-term goals (1–3 years), with better returns than FDs'
  },
  {
    id: 'medium-duration-fund',
    name: 'Medium Duration Fund',
    category: 'Medium Term',
    tags: ['3-4 Years', 'Moderate Risk', 'Predictable'],

    expectedReturns: { min: 7, max: 8.5 },
    riskLevel: 'Moderate',
    volatility: 'Moderate',
    returnConsistency: 'Moderate',
    taxation: 'Income slab rate',
    exitLoad: 'Usually none',
    investmentMode: ['Lumpsum Preferred', 'SIP Preferred'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 1095, max: 1460, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Medium-term goals (3–4 yrs)',
    whatItInvestsIn: 'Medium duration debt',
    goodThings: 'Predictable returns',
    thingsToNote: 'Sensitive to interest rates',
    examples: ['Kotak Medium Term', 'SBI Medium Term'],

    color: 'warning',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
    description: 'Medium-term fund for predictable returns over 3–4 years.'
  },
  {
    id: 'corporate-bond-fund',
    name: 'Corporate Bond Fund',
    category: 'Medium Term',
    tags: ['Corporate Debt', 'Good Returns', 'Stable Growth'],

    expectedReturns: { min: 7, max: 9 },
    riskLevel: 'Low',
    volatility: 'Low',
    returnConsistency: 'High',
    taxation: 'Income slab rate',
    exitLoad: 'Usually none',
    investmentMode: ['Lumpsum Preferred', 'SIP Preferred'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 730, max: 1825, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Stable growth seekers',
    whatItInvestsIn: 'Corporate debt securities',
    goodThings: 'Safe + good return',
    thingsToNote: 'NAV movement if rates change',
    examples: ['HDFC Corp Bond', 'ICICI Corp Bond'],

    color: 'success',
    icon: '🏢',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    description:
      'A fund investing in corporate bonds for stable growth and good returns.'
  },
  {
    id: 'banking-psu-debt-fund',
    name: 'Banking & PSU Debt Fund',
    category: 'Safe Debt',
    tags: ['Bank Bonds', 'PSU Bonds', 'High Stability'],

    expectedReturns: { min: 6.5, max: 8.5 },
    riskLevel: 'Low',
    volatility: 'Low',
    returnConsistency: 'High',
    taxation: 'Income slab rate',
    exitLoad: 'Usually none',
    investmentMode: ['Lumpsum Preferred', 'SIP Preferred'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 365, max: 1460, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Safe debt exposure',
    whatItInvestsIn: 'Bank & PSU issued bonds',
    goodThings: 'Strong stability',
    thingsToNote: 'No equity upside',
    examples: ['Axis Banking PSU', 'SBI Banking PSU'],

    color: 'info',
    icon: '🏛️',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #075985 100%)',
    description: 'Safe fund investing in bank and PSU bonds for high stability.'
  },
  {
    id: 'gilt-fund',
    name: 'Gilt Fund',
    category: 'Government Bonds',
    tags: ['Government Bonds', 'Long Term', 'Govt Backed'],

    expectedReturns: { min: 7, max: 9 },
    riskLevel: 'Moderate',
    volatility: 'Moderate',
    returnConsistency: 'Moderate',
    taxation: 'Income slab rate',
    exitLoad: 'None',
    investmentMode: ['Lumpsum Preferred', 'SIP Preferred'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 1095, max: 2555, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Long-term safety',
    whatItInvestsIn: 'Government bonds',
    goodThings: 'Govt-backed',
    thingsToNote: 'May fluctuate short-term',
    examples: ['ICICI Gilt', 'SBI Magnum Gilt'],

    color: 'secondary',
    icon: '🏛️',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    description:
      'Government bond fund for long-term safety and government-backed returns.'
  },
  {
    id: 'gold-fund',
    name: 'Gold Fund',
    category: 'Alternative',
    tags: ['Gold ETF', 'Inflation Hedge', 'Diversification'],

    expectedReturns: { min: 7, max: 9 },
    riskLevel: 'Moderate',
    volatility: 'Moderate to High',
    returnConsistency: 'Moderate',
    taxation: 'Income slab rate',
    exitLoad: '0–1% if < 12 months',
    investmentMode: ['SIP Preferred', 'Lumpsum Suitable'],
    partialWithdrawal: 'Yes',

    idealHoldingPeriod: { min: 1095, max: 1825, unit: 'days' },
    withdrawalSpeed: '2–3 business days (T+2/T+3)',

    whoShouldConsider: 'Diversification & inflation hedge',
    whatItInvestsIn: 'Gold ETFs',
    goodThings: 'Inflation hedge',
    thingsToNote: 'No regular income',
    examples: ['Axis Gold', 'SBI Gold'],

    color: 'warning',
    icon: '🪙',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    description:
      'Mutual fund investing in gold ETFs for diversification and inflation hedge. Invests in gold ETFs.'
  },
  // Fixed Deposits
  {
    id: 'bank-fd',
    name: 'Bank FD',
    category: 'Fixed Deposits',
    tags: ['Risk Free', 'Guaranteed Returns', 'Traditional'],

    expectedReturns: { min: 3, max: 8 },
    riskLevel: 'None',
    volatility: 'None',
    returnConsistency: 'Guaranteed if held',
    taxation: 'Income slab rate',
    exitLoad: 'Prematurely break (~0.5–1%)',
    investmentMode: ['Lumpsum Only'],
    partialWithdrawal: 'No (Multiple FDs preferred)',

    idealHoldingPeriod: { min: 7, max: 3650, unit: 'days' },
    withdrawalSpeed: 'Instant within hours',

    whoShouldConsider: 'Safest option for risk-free savings',
    whatItInvestsIn: 'Bank deposits',
    goodThings: 'Guaranteed returns, safest and simple',
    thingsToNote: 'Prefer nationalized or top private banks',
    examples: ['SBI FD', 'ICICI FD'],

    color: 'info',
    icon: '🏦',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    description: 'Guaranteed returns and highest safety.'
  },
  {
    id: 'nbfc-fd',
    name: 'Top-Rated NBFC FD',
    category: 'Fixed Deposits',
    tags: ['Better Returns', 'Rated NBFCs', 'Low Risk'],

    expectedReturns: { min: 7, max: 9 },
    riskLevel: 'Very Low',
    volatility: 'Very Low',
    returnConsistency: 'Very High (Stable)',
    taxation: 'Income slab rate',
    exitLoad: 'Prematurely break (~0.5–1.5%)',
    investmentMode: ['Lumpsum Only'],
    partialWithdrawal: 'No (Multiple FDs preferred)',

    idealHoldingPeriod: { min: 365, max: 1825, unit: 'days' },
    withdrawalSpeed: 'Instant within hours',

    whoShouldConsider: 'Relatively safe, better than bank FD',
    whatItInvestsIn: 'Company deposits',
    goodThings: 'Better returns with top ratings',
    thingsToNote: 'Slight credit risk, not insured',
    examples: ['Bajaj FD', 'Shriram FD'],

    color: 'success',
    icon: '🏢',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    description:
      'Top-rated NBFC fixed deposit offering better returns than bank FDs with low risk.'
  },
  {
    id: 'small-finance-bank-fd',
    name: 'Small Finance Bank FD',
    category: 'Fixed Deposits',
    tags: ['Highest FD Returns', 'Insured', 'Higher Risk'],

    expectedReturns: { min: 7.5, max: 9.5 },
    riskLevel: 'Moderate',
    volatility: 'Very Low',
    returnConsistency: 'High (for up to ₹5L)',
    taxation: 'Income slab rate',
    exitLoad: 'Prematurely break (~1–2%)',
    investmentMode: ['Lumpsum Only'],
    partialWithdrawal: 'No (Multiple FDs preferred)',

    idealHoldingPeriod: { min: 365, max: 1825, unit: 'days' },
    withdrawalSpeed: 'Instant within hours',

    whoShouldConsider: 'Higher-yield seekers willing to accept risk',
    whatItInvestsIn: 'Small finance bank deposits',
    goodThings: 'Highest returns in FD category, insured up to ₹5L',
    thingsToNote: 'Higher credit risk, lesser-known banks',
    examples: ['Ujjivan FD', 'AU Small Finance FD'],

    color: 'warning',
    icon: '🏛️',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description:
      'Small finance bank FD with highest returns in the FD category, insured up to ₹5L.'
  }
];

// Investment mode options for reference
export const investmentModes = [
  'Lumpsum Only', // Only lumpsum allowed (e.g., FDs)
  'Lumpsum Preferred', // Lumpsum works better (e.g., short-term debt funds)
  'Lumpsum Suitable', // Lumpsum is suitable but not preferred
  'SIP Only', // Only SIP allowed (rare)
  'SIP Preferred', // SIP works better (e.g., volatile assets, long-term funds)
  'SIP Suitable', // SIP is suitable but not preferred
  'Both Equally' // Both work equally well
];

// Categories for filtering
export const categories = [
  'All',
  'Ultra Short Term',
  'Short Term',
  'Medium Term',
  'Tax Efficient',
  'Safe Debt',
  'Government Bonds',
  'Alternative',
  'Fixed Deposits'
];

// Risk levels for filtering
export const riskLevels = [
  'None',
  'Very Low',
  'Low',
  'Low to Moderate',
  'Moderate',
  'Moderate to High'
];

// Time horizons for filtering
export const timeHorizons = [
  { label: '1 Day - 1 Week', min: 1, max: 7, unit: 'days' },
  { label: '1 Week - 1 Month', min: 7, max: 30, unit: 'days' },
  { label: '1 Month - 3 Months', min: 30, max: 90, unit: 'days' },
  { label: '3 Months - 6 Months', min: 90, max: 180, unit: 'days' },
  { label: '6 Months - 1 Year', min: 180, max: 365, unit: 'days' },
  { label: '1 Year - 3 Years', min: 365, max: 1095, unit: 'days' },
  { label: '3+ Years', min: 1095, max: 9999, unit: 'days' }
];

// Quick filter presets
export const quickFilters = [
  {
    id: 'emergency-fund',
    label: 'Emergency',
    description: 'Instant access, very safe options',
    icon: '🚨',
    filters: {
      categories: ['Ultra Short Term', 'Fixed Deposits'],
      riskLevels: ['None', 'Very Low'],
      withdrawalSpeed: [
        'Same day (T+0)',
        'Same day or next day (T+0/T+1)',
        'Instant within hours'
      ]
    }
  },
  {
    id: 'tax-efficient-low-income',
    label: 'Tax efficient ≤ 12 lacs',
    description:
      'All options are tax-efficient for income up to ₹12 lakhs (effectively tax-free)',
    icon: '💚',
    filters: {
      // Show all options except Arbitrage Fund (which is more beneficial for higher income brackets)
      excludeIds: ['arbitrage-fund']
    }
  },
  {
    id: 'tax-efficient-high-income',
    label: 'Tax efficient ≥ 12 lacs',
    description:
      'Tax-efficient options for higher income brackets (LTCG benefits)',
    icon: '💰',
    filters: {
      categories: ['Tax Efficient'],
      taxation: ['15% < 1 yr, 10% > 1 yr (after ₹1L exempt)']
    }
  },
  {
    id: 'stable',
    label: 'Stable',
    description: 'Low risk, stable return options',
    icon: '🔒',
    filters: {
      riskLevels: ['None', 'Very Low', 'Low'],
      returnConsistency: [
        'Guaranteed if held',
        'Very High (Stable)',
        'High (Stable)',
        'High'
      ]
    }
  },
  {
    id: '1-day-to-1-month',
    label: '1 day - 1 month',
    description: 'Instant access and very short parking',
    icon: '⚡',
    filters: {
      maxHoldingPeriod: 30
    }
  },
  {
    id: '1-month-to-6-months',
    label: '1 month - 6 months',
    description: 'Short-term parking needs',
    icon: '📅',
    filters: {
      minHoldingPeriod: 30,
      maxHoldingPeriod: 180
    }
  },
  {
    id: '6-months-to-2-years',
    label: '6 months - 2 years',
    description: 'Medium-term investment goals',
    icon: '🎯',
    filters: {
      minHoldingPeriod: 180,
      maxHoldingPeriod: 730
    }
  },
  {
    id: '2-years-plus',
    label: '2+ years',
    description: 'Long-term investment horizon',
    icon: '📊',
    filters: {
      minHoldingPeriod: 730
    }
  },
  {
    id: 'sip-preferred',
    label: 'SIP',
    description: 'Options that support or prefer SIP investments',
    icon: '🔄',
    filters: {
      investmentModes: ['SIP Preferred', 'SIP Suitable', 'SIP Only']
    }
  },
  {
    id: 'lumpsum-preferred',
    label: 'Lumpsum',
    description: 'Options that support or prefer lumpsum investments',
    icon: '💰',
    filters: {
      investmentModes: ['Lumpsum Preferred', 'Lumpsum Suitable', 'Lumpsum Only']
    }
  },
  {
    id: 'partial-withdrawal',
    label: 'Partial Withdrawal',
    description: 'Options that allow partial withdrawal of funds',
    icon: '🔄',
    filters: {
      partialWithdrawal: ['Yes']
    }
  }
];
