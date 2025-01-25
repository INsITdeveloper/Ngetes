export class StatsManager {
  private static instance: StatsManager;
  private startTime: Date;
  private requests: number = 0;
  private visitors: Set<string> = new Set();
  private endpoints: Set<string> = new Set();

  private constructor() {
    this.startTime = new Date();
  }

  static getInstance(): StatsManager {
    if (!StatsManager.instance) {
      StatsManager.instance = new StatsManager();
    }
    return StatsManager.instance;
  }

  incrementRequests() {
    this.requests++;
  }

  addVisitor(ip: string) {
    this.visitors.add(ip);
  }

  addEndpoint(endpoint: string) {
    this.endpoints.add(endpoint);
  }

  getRuntime(): string {
    const now = new Date();
    const diff = now.getTime() - this.startTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} day, ${hours} hour`;
  }

  getStats() {
    return {
      requests: this.requests,
      visitors: this.visitors.size,
      endpoints: this.endpoints.size,
      runtime: this.getRuntime()
    };
  }
}
