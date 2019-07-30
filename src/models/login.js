import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
import { login, logout, getImgCaptcha } from '@/services/security-api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    message: undefined,
    needCaptcha: false,
    captchaDigest: undefined,
    imgCaptchaData: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (window.routerBase !== '/') {
              redirect = redirect.replace(window.routerBase, '/');
            }
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put({ type: 'changeLoginStatus', payload: { captchaDigestL: undefined, imgCaptchaData: undefined } });
        yield put(routerRedux.replace(redirect || '/'));
      } else if (response.needCaptcha === true) {
        // 刷新图片验证码
        yield put({ type: 'getImgCaptcha', payload: {} });
      }
    },

    *getImgCaptcha(_, { call, put }) {
      const { captchaDigest, imgCaptchaData } = yield call(getImgCaptcha, {});
      yield put({ type: 'changeLoginStatus', payload: { captchaDigest, imgCaptchaData } });
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      yield call(logout, {});
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: [],
        },
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        // status: payload.status,
        // type: payload.type,
        // message: payload.message,
        // needCaptcha: payload.needCaptcha,
        ...payload,
      };
    },
  },
};
