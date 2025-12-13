export class JwtBlacklist {
  private static _instance: JwtBlacklist;
  private blacklistedTokens = new Set<string>();

  private constructor() {}

  private static getInstance() {
    return this._instance || (this._instance = new this());
  }

  private static extractToken(token: string): string {
    if (!token) return '';
    return token.replace('Bearer ', '').trim();
  }

  public static isBlacklisted(token: string) {
    return this.getInstance().blacklistedTokens.has(token);
  }

  public static blacklist(token: string) {
    this.getInstance().blacklistedTokens.add(this.extractToken(token));
  }
}
