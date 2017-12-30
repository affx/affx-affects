export class Timer {
  private innerTimestamp: number | null = null;
  private innerTimerId: number | null = null;

  public get timestamp() {
    return this.innerTimestamp;
  }

  public get timerId() {
    return this.innerTimerId;
  }

  public start(ms: number, f: () => void) {
    window.clearInterval(this.innerTimerId!);
    this.innerTimestamp = Date.now();
    this.innerTimerId = window.setTimeout(f, ms);
  }

  public reset() {
    Object.assign(this, { innerTimestamp: null, innerTimerId: null });
  }

  public compare(timestamp: number): number {
    if (!this.innerTimestamp) {
      return -1;
    }

    return timestamp - this.innerTimestamp;
  }
}
