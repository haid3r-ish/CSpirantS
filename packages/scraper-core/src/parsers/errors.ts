export class StaleDataError extends Error {
  constructor(public readonly requestedDate: string, public readonly foundDate: string) {
    super(`Stale page detected: requested ${requestedDate}, page shows ${foundDate}`);
    this.name = 'StaleDataError';
  }
}
