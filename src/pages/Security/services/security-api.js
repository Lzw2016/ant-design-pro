import { UrlPrefix } from '@/config';
import request from '@/utils/request';

const prefix = UrlPrefix.security;

export async function xxx() {
  return request(`${prefix}/logout.json`, { method: 'POST' });
}
