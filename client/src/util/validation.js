export function validEmail (value) {
  if (!value) return true
  const regexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return regexp.test(value) || 'E-mail must be valid'
}

export function validPassword (value) {
  return (value.length < 1 || value.length > 7) || 'Password must be 8 characters or more'
}

export function nonEmptyPassword (value) {
  return !!value || 'Password is required'
}
