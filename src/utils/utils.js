export function trimPrivateKey(key) {
  return key.slice(0, 6) + "..." + key.slice(-6);
}
export function trimPublicKey(key) {
  return key.slice(0, 6) + "..." + key.slice(-4);
}
