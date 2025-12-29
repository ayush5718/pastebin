export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function getCurrentTime(testMode: boolean, testHeader?: string): number {
  if (testMode && testHeader) {
    const testTime = parseInt(testHeader, 10);
    if (!isNaN(testTime)) {
      return testTime;
    }
  }
  return Date.now();
}
