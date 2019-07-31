// import lodash from 'lodash';
import { ModelInitState } from '@/config';
import { SecurityModel } from '@/ModelsNamespace';
// import { findByPage, addUser, delUser, getUser, updateUser } from '../services/manage-by-user-controller';
// import { userBindSys, userBindRole } from '../services/manage-by-security-controller';
// import { ManageEncrypt } from '../utils/crypto';

export default {
  namespace: SecurityModel.UserManageModel,

  state: {
    queryParam: {
      ...ModelInitState.queryParam,
      username: undefined,
      telephone: undefined,
      email: undefined,
      userType: undefined,
      expiredTimeStart: undefined,
      expiredTimeEnd: undefined,
      locked: undefined,
      enabled: undefined,
    },
    pagination: {
      ...ModelInitState.pagination,
    },
    data: [],
    selectedRowKeys: [],

    showUserManageAdd: false,
    addUserData: {
      userType: '0',
      locked: '0',
      enabled: '1',
    },

    showUserManageUpdate: false,
    updateUserName: undefined,
    updateUserData: {},

    showUserBindSys: false,
    showUserBindRole: false,
  },

  effects: {
    // *findByPage({ payload }, { select, call, put }) {
    //   let queryParam = yield select(state => state.UserManageModel.queryParam);
    //   let pagination = yield select(state => state.UserManageModel.pagination);
    //   queryParam = { ...queryParam, ...payload }
    //   // 请求数据
    //   const resultData = yield call(findByPage, queryParam);
    //   if (!resultData) return;
    //   const { records, total, size, current } = resultData;
    //   if (!records) return;
    //   // 保存数据
    //   pagination = { ...pagination, pageSize: size, current, total };
    //   yield put({ type: 'save', payload: { data: records, queryParam, pagination } });
    // },
    // *addUser({ payload, successCallBack }, { call, put }) {
    //   const { userData } = payload;
    //   // 密码对称加密
    //   let { password } = userData;
    //   password = ManageEncrypt(password);
    //   // 请求数据
    //   const user = yield call(addUser, { ...userData, password });
    //   if (!user) return;
    //   yield put({ type: 'save', payload: { showUserManageAdd: false } });
    //   if (successCallBack instanceof Function) successCallBack(user);
    //   yield put({ type: 'findByPage' });
    // },
    // *getUser({ payload }, { call, put }) {
    //   const { username } = payload;
    //   // 请求数据
    //   const updateUserData = yield call(getUser, username);
    //   if (!updateUserData) return;
    //   yield put({ type: 'save', payload: { updateUserData } });
    // },
    // *updateUser({ payload, successCallBack }, { call, put }) {
    //   const { username, userData } = payload;
    //   // 修改了密码 - 密码对称加密
    //   let { password } = userData;
    //   if (lodash.trim(password) !== '') {
    //     password = ManageEncrypt(password);
    //   }
    //   // 请求数据
    //   const user = yield call(updateUser, username, { ...userData, password });
    //   if (!user) return;
    //   yield put({ type: 'save', payload: { showUserManageUpdate: false } });
    //   if (successCallBack instanceof Function) successCallBack(user);
    //   yield put({ type: 'findByPage' });
    // },
    // *delUser({ payload, successCallBack }, { call, put }) {
    //   const { username } = payload;
    //   // 请求数据
    //   const user = yield call(delUser, username);
    //   if (!user) return;
    //   if (successCallBack instanceof Function) successCallBack(user);
    //   yield put({ type: 'findByPage' });
    // },
    // *userBindSys({ payload, successCallBack }, { call, put }) {
    //   const { usernameList, sysNameList } = payload;
    //   // 请求数据
    //   const result = yield call(userBindSys, { usernameList, sysNameList });
    //   if (!result) return;
    //   yield put({ type: 'save', payload: { showUserBindSys: false } });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *userBindRole({ payload, successCallBack }, { call, put }) {
    //   const { usernameList, roleNameList } = payload;
    //   // 请求数据
    //   const result = yield call(userBindRole, { usernameList, roleNameList });
    //   if (!result) return;
    //   yield put({ type: 'save', payload: { showUserBindRole: false } });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
