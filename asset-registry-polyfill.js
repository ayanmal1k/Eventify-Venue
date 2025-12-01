// Polyfill for React Navigation asset resolution issue
if (typeof require.resolveWeak === 'undefined') {
  require.resolveWeak = (id) => {
    try {
      return require.resolve(id);
    } catch {
      return null;
    }
  };
}

// Export empty to ensure this runs
export {};
