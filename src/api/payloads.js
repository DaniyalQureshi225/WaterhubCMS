export const loginPayload = {
  email: '',
  password: '',
}

export function buildPlanPayload(form) {
  return {
    name: form.name.trim(),
    price: Number(form.price),
    currency: 'PKR',
    duration: Number(form.duration),
    durationType: form.durationType,
    description: form.description.trim(),
    features: form.features.filter(f => f.trim()),
    status: form.status === 'active' ? 'ACTIVE' : 'INACTIVE',
  }
}
