import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private subscriptionsMap: Map<string, Subscription[]> = new Map();

  constructor() {
  }

  public addSubscription(id: string, ...subs: Subscription[]) {
    if (!this.subscriptionsMap.has(id)) {
      this.subscriptionsMap.set(id, []);
    }
    const subscriptions = this.subscriptionsMap.get(id);
    subscriptions.push(...subs);
  }

  public removeSubscription(id: string, subscription: Subscription) {
    if (!this.subscriptionsMap.has(id)) {
      // TODO: Add error logs via dedicated logger service
      return;
    }

    const subscriptions = this.subscriptionsMap.get(id);
    const index = subscriptions.indexOf(subscription);

    if (index < 0) {
      // TODO: Add error logs via dedicated logger service
      return;
    }

    subscriptions.splice(index, 1);
  }

  public clearAllSubscriptions(id: string): void {
    if (!this.subscriptionsMap.has(id)) {
      // TODO: Add error logs via dedicated logger service
      return;
    }
    const subscriptions = this.subscriptionsMap.get(id);
    subscriptions.forEach(s => s.unsubscribe());
    subscriptions.length = 0;
  }
}
