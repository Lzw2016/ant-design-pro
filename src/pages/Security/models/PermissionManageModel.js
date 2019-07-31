import { ModelInitState } from '@/config';
import { SecurityModel } from '@/ModelsNamespace';
// import { findByPage, delPermissionModel, delPermissionModels, addPermission, getPermissionModel, updatePermission } from '../services/manage-by-permission-controller';

export default {
  namespace: SecurityModel.PermissionManageModel,

  state: {
    queryParam: {
      ...ModelInitState.queryParam,
      sysName: undefined,
      title: undefined,
      resourcesType: undefined,
      permissionStr: undefined,

      targetClass: undefined,
      targetMethod: undefined,
      resourcesUrl: undefined,

      targetExist: undefined,
      needAuthorization: undefined,
    },
    pagination: {
      ...ModelInitState.pagination,
    },
    data: [],
    selectedRowKeys: [],

    showAddPermission: false,
    addPermissionData: {
      resourcesType: '4',
    },

    showUpdatePermission: false,
    updatePermissionData: {},
  },

  effects: {
    // *findByPage({ payload }, { select, call, put }) {
    //   let queryParam = yield select(state => state.PermissionManageModel.queryParam);
    //   let pagination = yield select(state => state.PermissionManageModel.pagination);
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
    // *delPermissionModel({ payload, successCallBack }, { call, put }) {
    //   const { permissionStr } = payload;
    //   // 请求数据
    //   const result = yield call(delPermissionModel, permissionStr);
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *delPermissionModels({ payload, successCallBack }, { call, put }) {
    //   const { permissionSet } = payload;
    //   // 请求数据
    //   const result = yield call(delPermissionModels, { permissionSet });
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'save', payload: { selectedRowKeys: [] } });
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *addPermission({ payload, successCallBack }, { call, put }) {
    //   // 请求数据
    //   const result = yield call(addPermission, payload);
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'save', payload: { showAddPermission: false } });
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
    // *getPermissionModel({ payload: { permissionStr } }, { call, put }) {
    //   // 请求数据
    //   const result = yield call(getPermissionModel, permissionStr);
    //   if (!result) return;
    //   yield put({ type: 'save', payload: { updatePermissionData: result } });
    // },
    // *updatePermission({ payload, successCallBack }, { call, put }) {
    //   // 请求数据
    //   const result = yield call(updatePermission, payload.oldPermissionStr, payload);
    //   if (!result) return;
    //   // 刷新数据
    //   yield put({ type: 'save', payload: { showUpdatePermission: false } });
    //   yield put({ type: 'findByPage' });
    //   if (successCallBack instanceof Function) successCallBack(result);
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
