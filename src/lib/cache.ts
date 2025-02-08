import { LRUCache } from 'lru-cache';

export const cache = new LRUCache({
  max: 500, // Store up to 500 items
  ttl: 600 * 10000 * 24, // Cache expiration time
});
