export const cleanupOldCode = (userEmail: string) => {
    const keysToKeep = new Set<string>();
    const prefix = `savedCode-${userEmail}`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) { // Add null check
        keysToKeep.add(key);
        if (keysToKeep.size > 10) {
          const oldestKey = Array.from(keysToKeep)[0]; 
          keysToKeep.delete(oldestKey);
          localStorage.removeItem(oldestKey);
        }
      }
    }
  };