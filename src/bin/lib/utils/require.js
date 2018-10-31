export const clearCache = regex => {
  for (const moduleId of Object.keys(require.cache)) {
    if (regex.test(moduleId)) {
      delete require.cache[moduleId];
    }
  }
};
