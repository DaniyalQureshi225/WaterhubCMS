const firstNames = [
  'Ahmed', 'Fatima', 'Muhammad', 'Ayesha', 'Ali', 'Sana', 'Hassan', 'Zainab',
  'Omar', 'Khadija', 'Usman', 'Amna', 'Bilal', 'Hira', 'Danish', 'Sara',
  'Farhan', 'Nadia', 'Imran', 'Rabia', 'Junaid', 'Tahira', 'Kamran', 'Shazia',
  'Naveed', 'Uzma', 'Tariq', 'Fariha', 'Asad', 'Mehwish', 'Rashid', 'Parveen',
  'Zubair', 'Nasreen', 'Waseem', 'Shahida', 'Irfan', 'Kausar', 'Shahid', 'Nargis',
  'Tanveer', 'Rukhsana', 'Javed', 'Zahida', 'Anwar', 'Naheed', 'Akram', 'Shabnam',
  'Sajid', 'Rubina',
]

const lastNames = [
  'Khan', 'Ali', 'Ahmed', 'Hussain', 'Sheikh', 'Malik', 'Iqbal', 'Shah',
  'Butt', 'Qureshi', 'Hashmi', 'Siddiqui', 'Mirza', 'Chaudhry', 'Rana', 'Abbasi',
  'Syed', 'Awan', 'Gondal', 'Cheema',
]

const phones = [
  '0300-1111111', '0311-2222222', '0322-3333333', '0333-4444444', '0344-5555555',
  '0301-6666666', '0312-7777777', '0323-8888888', '0334-9999999', '0345-1010101',
  '0302-1212121', '0313-2323232', '0324-3434343', '0335-4545454', '0346-5656565',
  '0303-6767676', '0314-7878787', '0325-8989898', '0336-9090909', '0347-1112131',
  '0304-3141516', '0315-1718191', '0326-2021222', '0337-3242526', '0348-2728292',
  '0305-3031323', '0316-3435363', '0327-3738393', '0338-4041424', '0349-4344454',
  '0306-4647484', '0317-4950515', '0328-5253545', '0339-5556575', '0350-5859606',
  '0307-6162636', '0318-6465666', '0329-6768696', '0341-7071727', '0351-7374757',
]

const statuses = ['active', 'active', 'active', 'inactive', 'suspended']
const sellers = [
  'AquaPure Solutions', 'GreenValley Waters', 'CrystalClear Water', 'FreshFlow Water Co.',
  'PureDrop Services', 'AquaDrip Solutions', 'MountainSpring Water', 'BlueWave Aqua',
  'PrimeH2O Suppliers', 'EcoWater Systems',
]

function simpleHash(n) {
  return ((n * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
}

const REF_DATE = '2026-07-03'

function subDays(dateStr, n) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export function makeCustomers() {
  const customers = []
  for (let i = 0; i < 50; i++) {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[i % lastNames.length]
    const name = `${first} ${last}`
    const status = statuses[i % statuses.length]
    const joinDate = subDays(REF_DATE, 10 + i * 7)
    const lastOrder = subDays(REF_DATE, Math.floor(simpleHash(i * 3 + 1) * 30))
    const orders = 1 + Math.floor(simpleHash(i * 7 + 2) * 50)
    const spent = 500 + Math.floor(simpleHash(i * 11 + 3) * 50000)
    customers.push({
      id: i + 1,
      name,
      phone: phones[i % phones.length],
      email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
      status,
      orders,
      totalSpent: spent,
      lastOrder,
      joinDate,
      seller: sellers[i % sellers.length],
      city: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad'][i % 5],
      address: `${100 + i} Street, ${['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad'][i % 5]}`,
    })
  }
  return customers
}

export const customerActivity = [
  { action: 'New Customer Registered', customer: 'Ahmed Khan', time: '5 minutes ago', type: 'register' },
  { action: 'Large Order Placed', customer: 'Fatima Ali', time: '30 minutes ago', type: 'order' },
  { action: 'Subscription Started', customer: 'Muhammad Hussain', time: '1 hour ago', type: 'subscribe' },
  { action: 'Account Suspended', customer: 'Sana Malik', time: '3 hours ago', type: 'suspend' },
  { action: 'First Order Completed', customer: 'Hassan Sheikh', time: '4 hours ago', type: 'firstorder' },
  { action: 'Profile Updated', customer: 'Zainab Iqbal', time: '6 hours ago', type: 'update' },
]
