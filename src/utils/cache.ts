export async function clearModelCache(): Promise<void> {
  try {
    const cacheKeys = await caches.keys();
    await Promise.all(
      cacheKeys
        .filter(key => key.includes('transformers'))
        .map(key => caches.delete(key))
    );
  } catch (error) {
    console.error('Failed to clear model cache:', error);
  }
}