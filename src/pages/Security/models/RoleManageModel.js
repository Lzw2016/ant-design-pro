import { ModelInitState } from '@/config';
import { SecurityModel } from '@/ModelsNamespace';
// import { findByPage, addRole, updateRole, delRole } from '../services/manage-by-role-controller';
// import { roleBindPermission } from '../services/manage-by-security-controller';

export default {
  namespace: SecurityModel.RoleManageModel,

  state: {
    queryParam: {
      ...ModelInitState.queryParam,
      name: undefined,
    },
    pagination: {
      ...ModelInitState.pagination,
    },
    data: [],
    selectedRowKeys: [],

    showAddRole: false,
    addRole: {},

    showUpdateRole: false,
    updateRole: {},

    showRoleBindPermission: false,
  },

  effects: {
    // *findByPage({ payload }, { select, call, put }) {
    //   let queryParam = yield select(state => state.RoleManageModel.queryParam);
    //   let pagination = yield select(state => state.RoleManageModel.pagination);
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
    // *addRole({ payload, successCallBack }, { call, put }) {
    //   // 请求数据
    //   const result = yield call(addRole, payload);
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'save', payload: { showAddRole: false } });
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *updateRole({ payload, successCallBack }, { call, put }) {
    //   const { name, roleData } = payload;
    //   // 请求数据
    //   const result = yield call(updateRole, name, roleData);
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'save', payload: { showUpdateRole: false } });
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *delRole({ payload, successCallBack }, { call, put }) {
    //   const { name } = payload;
    //   // 请求数据
    //   const result = yield call(delRole, name);
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *roleBindPermission({ payload, successCallBack }, { call, put }) {
    //   const { roleNameList, permissionStrList } = payload;
    //   // 请求数据
    //   const result = yield call(roleBindPermission, { roleNameList, permissionStrList });
    //   if (!result) return;
    //   yield put({ type: 'save', payload: { showRoleBindPermission: false } });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
