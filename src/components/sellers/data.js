const sellerNames = [
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
]

const phones = [
  '0300-1234567', '0311-2345678', '0322-3456789', '0333-4567890', '0344-5678901',
  '0301-6789012', '0312-7890123', '0323-8901234', '0334-9012345', '0345-0123456',
  '0302-1122334', '0313-2233445', '0324-3344556', '0335-4455667', '0346-5566778',
  '0303-6677889', '0314-7788990', '0325-8899001', '0336-9900112', '0347-1011123',
  '0304-1213145', '0315-1314156', '0326-1415167', '0337-1516178', '0348-1617189',
  '0305-1719201', '0316-1819202', '0327-1920213', '0338-2021224', '0349-2122235',
]

const statuses = ['active', 'active', 'active', 'pending', 'suspended', 'inactive']
const plans = ['Monthly Pro', 'Annual Premium', 'Trial', 'Monthly Pro', 'Annual Premium']

function simpleHash(n) {
  return ((n * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
}

const REF_DATE = '2026-07-03'

function subDays(dateStr, n) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export function makeSellers() {
  const sellers = []
  for (let i = 0; i < sellerNames.length; i++) {
    const status = statuses[i % statuses.length]
    const plan = plans[i % plans.length]
    const joinDate = subDays(REF_DATE, 30 + i * 15)
    const orders = 50 + Math.floor(simpleHash(i * 3 + 1) * 2000)
    const revenue = 50000 + Math.floor(simpleHash(i * 7 + 2) * 900000)
    const custCount = 20 + Math.floor(simpleHash(i * 11 + 3) * 3500)
    sellers.push({
      id: i + 1,
      name: sellerNames[i],
      phone: phones[i % phones.length],
      email: `info@${sellerNames[i].toLowerCase().replace(/[^a-z]/g, '')}.com`,
      shopName: sellerNames[i],
      status,
      plan,
      orders,
      revenue,
      customers: custCount,
      joinDate,
      lastActive: subDays(REF_DATE, Math.floor(simpleHash(i * 5 + 4) * 14)),
      address: `${100 + i} Main Street, Lahore`,
      city: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad'][i % 5],
    })
  }
  return sellers
}

export const sellerActivity = [
  { action: 'New Seller Registered', seller: 'AquaPure Solutions', time: '10 minutes ago', type: 'register' },
  { action: 'Subscription Upgraded', seller: 'GreenValley Waters', time: '1 hour ago', type: 'upgrade' },
  { action: 'Seller Suspended', seller: 'FreshDrop Water', time: '2 hours ago', type: 'suspend' },
  { action: 'Payment Received', seller: 'MountainSpring Water', time: '3 hours ago', type: 'payment' },
  { action: 'Profile Updated', seller: 'CrystalClear Water', time: '5 hours ago', type: 'update' },
  { action: 'New Shop Opened', seller: 'HydroFlow Solutions', time: '6 hours ago', type: 'shop' },
]
