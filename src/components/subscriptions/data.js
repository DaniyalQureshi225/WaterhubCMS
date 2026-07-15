function addMonths(date, months) {
  const d = new Date(date)
  const target = d.getDate()
  d.setMonth(d.getMonth() + months)
  if (d.getDate() !== target) d.setDate(0)
  return d
}

function addYear(date) {
  const d = new Date(date)
  try {
    d.setFullYear(d.getFullYear() + 1)
  } catch {
    d.setFullYear(d.getFullYear() + 1, d.getMonth(), Math.min(d.getDate(), 28))
  }
  return d
}

function fmt(d) {
  return d.toISOString().split('T')[0]
}

function subDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() - n)
  return r
}

const sellers = [
  'AquaPure Solutions', 'GreenValley Waters', 'CrystalClear Water', 'FreshFlow Water Co.',
  'PureDrop Services', 'AquaDrip Solutions', 'MountainSpring Water', 'BlueWave Aqua',
  'PrimeH2O Suppliers', 'EcoWater Systems', 'ClearStream Ltd', 'Royal Aqua Services',
  'PureLife Water', 'OceanBreeze Water Co.', 'FreshAqua Distributors', 'NatureDrop Water',
  'HydroFlow Solutions', 'Sparkling Springs', 'DewDrop Water', 'CrystalSpring Ltd',
  'PureFountain Co.', 'ArtesianWell Water', 'ZenWater Solutions', 'RippleEffect Aqua',
  'ClearPond Services', 'SilverStream Water', 'AquaNova Supplies', 'PureRain Water Co.',
  'GlacierMist Water', 'SpringWell Aqua', 'BlueDrop Services', 'PureAqua Traders',
  'HydraWater Solutions', 'MountainDew Springs', 'CrystalFlows', 'FreshDrop Water',
  'WaveMaker Aqua', 'PureStream Ltd', 'ClearWater Supplies', 'NatureSpring Co.',
  'AquaVita Solutions', 'BlueFountain Water', 'PureOasis Services', 'HydroHub Supplies',
  'CrystalLake Water', 'FreshSpring Aqua', 'DiamondWater Co.', 'EliteAqua Solutions',
  'PrimeWave Water', 'GoldenDrop Services',
]

const phones = [
  '0300-1234567', '0311-2345678', '0322-3456789', '0333-4567890', '0344-5678901',
  '0301-6789012', '0312-7890123', '0323-8901234', '0334-9012345', '0345-0123456',
  '0302-1122334', '0313-2233445', '0324-3344556', '0335-4455667', '0346-5566778',
  '0303-6677889', '0314-7788990', '0325-8899001', '0336-9900112', '0347-1011123',
  '0304-1213145', '0315-1314156', '0326-1415167', '0337-1516178', '0348-1617189',
  '0305-1719201', '0316-1819202', '0327-1920213', '0338-2021224', '0349-2122235',
  '0306-2223246', '0317-2324257', '0328-2425268', '0339-2526279', '0340-2627280',
  '0307-2728291', '0318-2829302', '0329-2930313', '0341-3031324', '0350-3132335',
  '0308-3233346', '0319-3334357', '0320-3435368', '0342-3536379', '0351-3637380',
  '0309-3738391', '0321-3839302', '0330-3940313', '0343-4041324', '0352-4142335',
]

function generateExpiryDate(plan, startDate) {
  if (plan === 'Monthly') {
    return addMonths(new Date(startDate), 1)
  }
  return addYear(new Date(startDate))
}

function daysBetween(a, b) {
  return Math.max(0, Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)))
}

const REF_DATE = new Date('2026-07-03')
const today = REF_DATE

function makeSubscriptions() {
  const subs = []
  const statuses = ['active', 'active', 'active', 'active', 'expired', 'expired', 'cancelled']
  for (let i = 0; i < 50; i++) {
    const plan = i % 3 === 1 ? 'Annual' : 'Monthly'
    const baseStatus = statuses[i % statuses.length]
    const startOffset = baseStatus === 'expired' ? 400 + i * 3 : baseStatus === 'cancelled' ? 200 + i * 2 : 10 + i * 7
    const startDate = subDays(today, startOffset)
    const expiryDate = generateExpiryDate(plan, startDate)
    const status = baseStatus === 'active' && expiryDate < today ? 'expired' : baseStatus
    const amount = plan === 'Annual' ? 120000 : 15000
    subs.push({
      id: i + 1,
      sellerName: sellers[i % sellers.length],
      phone: phones[i % phones.length],
      shopName: sellers[i % sellers.length],
      email: `info@${sellers[i % sellers.length].toLowerCase().replace(/[^a-z]/g, '')}.com`,
      plan,
      status: status === 'expired' && daysBetween(expiryDate, today) < 30 ? 'expired' : status,
      startDate: fmt(startDate),
      expiryDate: fmt(expiryDate),
      daysRemaining: status === 'active' ? daysBetween(today, expiryDate) : 0,
      amount,
      autoRenewal: status === 'active' && i % 5 !== 0,
      createdAt: fmt(subDays(startDate, 30)),
      createdBy: i % 4 === 0 ? 'System' : 'Admin User',
    })
  }
  return subs
}

function makePendingApprovals() {
  const approvals = []
  for (let i = 0; i < 15; i++) {
    const plan = i % 2 === 0 ? 'Monthly' : 'Annual'
    const amount = plan === 'Annual' ? 120000 : 15000
    const reqDate = subDays(today, 1 + i * 2)
    approvals.push({
      id: i + 1,
      sellerName: sellers[sellers.length - 1 - i],
      phone: phones[phones.length - 1 - i],
      shopName: sellers[sellers.length - 1 - i],
      email: `info@${sellers[sellers.length - 1 - i].toLowerCase().replace(/[^a-z]/g, '')}.com`,
      plan,
      amount,
      paymentDate: fmt(reqDate),
      requestedOn: fmt(reqDate),
      status: 'pending',
      paymentRef: i % 3 === 0 ? `PAY-REF-${1000 + i}` : '',
    })
  }
  return approvals
}

function makeTrialUsers() {
  const trials = []
  for (let i = 0; i < 25; i++) {
    const startDate = subDays(today, i * 1.5 + 1)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)
    const remaining = daysBetween(today, endDate)
    const status = remaining <= 0 ? 'expired' : remaining <= 2 ? 'expiring' : 'active'
    trials.push({
      id: i + 1,
      sellerName: sellers[(i + 20) % sellers.length],
      phone: phones[(i + 20) % phones.length],
      trialStart: fmt(startDate),
      trialEnd: fmt(endDate),
      remainingDays: Math.max(0, remaining),
      status,
    })
  }
  return trials
}

function makeRecentActivity() {
  return [
    { action: 'Subscription Approved', seller: 'AquaPure Solutions', plan: 'Annual', time: '10 minutes ago', type: 'approve' },
    { action: 'Subscription Rejected', seller: 'FreshDrop Water', plan: 'Monthly', time: '25 minutes ago', type: 'reject' },
    { action: 'Trial Expired', seller: 'WaveMaker Aqua', plan: null, time: '1 hour ago', type: 'expire' },
    { action: 'Annual Plan Purchased', seller: 'MountainSpring Water', plan: 'Annual', time: '2 hours ago', type: 'purchase' },
    { action: 'Monthly Plan Renewed', seller: 'CrystalClear Water', plan: 'Monthly', time: '3 hours ago', type: 'renew' },
    { action: 'Subscription Approved', seller: 'PureLife Water', plan: 'Monthly', time: '4 hours ago', type: 'approve' },
    { action: 'Trial Started', seller: 'HydroHub Supplies', plan: null, time: '5 hours ago', type: 'trial' },
  ]
}

export const subscriptions = makeSubscriptions()
export const pendingApprovals = makePendingApprovals()
export const trialUsers = makeTrialUsers()
export const recentActivity = makeRecentActivity()
export const plans = [
  { id: 'monthly', name: 'Monthly Pro', price: 15000, duration: '1 Month', description: 'Perfect for small to medium water suppliers. Includes order management, customer tracking, and basic analytics.', status: 'active', features: ['Order Management', 'Customer Tracking', 'Basic Analytics', 'Delivery Scheduling', 'Email Support'] },
  { id: 'annual', name: 'Annual Premium', price: 120000, duration: '12 Months', description: 'For growing businesses. Everything in Monthly Pro plus priority support, advanced analytics, and bulk SMS.', status: 'active', features: ['Everything in Monthly Pro', 'Priority Support', 'Advanced Analytics', 'Bulk SMS', 'Custom Branding', 'API Access'] },
]
