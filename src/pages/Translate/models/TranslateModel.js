// import { ModelInitState } from '../../../utils/constant';
import { translateBaidu } from '@/services/api';

export default {
  namespace: 'TranslateModel',

  state: {
  },

  effects: {
    *translateBaidu({ payload: { from, to, q }, callBack }, { call }) {
      let transResult = [];
      const resultData = yield call(translateBaidu, from, to, q);
      if (resultData && resultData.trans_result) {
        transResult = resultData.trans_result;
      }
      if (callBack instanceof Function) callBack(transResult);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
