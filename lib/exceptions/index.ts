export class AuthRequiredError extends Error {
    constructor() {
      super('Authentication required');
      this.name = 'AuthRequiredError';
    }
  }