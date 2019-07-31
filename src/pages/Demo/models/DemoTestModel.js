import { ModelInitState } from '@/config';
// import { findUserLoginLog } from '../services/manage-by-query-controller';

export default {
  namespace: 'Demo.TestModel',

  state: {
    queryParam: {
      ...ModelInitState.queryParam,
      sysName: undefined,
      username: undefined,
      telephone: undefined,
    },
    pagination: {
      ...ModelInitState.pagination,
    },
    data: [],

    test: 100,
  },

  effects: {
    // *findByPage({ payload }, { select, call, put }) {
    //   let queryParam = yield select(state => state.LoginLogModel.queryParam);
    //   let pagination = yield select(state => state.LoginLogModel.pagination);
    //   queryParam = { ...queryParam, ...payload }
    //   // 请求数据
    //   const resultData = yield call(findUserLoginLog, queryParam);
    //   if (!resultData) return;
    //   const { records, total, size, current } = resultData;
    //   if (!records) return;
    //   // 保存数据
    //   pagination = { ...pagination, pageSize: size, current, total };
    //   yield put({ type: 'save', payload: { data: records, queryParam, pagination } });
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
