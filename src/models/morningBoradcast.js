/**
 * Created By K0170179 on 2018/1/17
 * 每日晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import { message } from 'antd';
import { morningBoradcast as api } from '../api';

export default {
  namespace: 'morningBoradcast',
  state: {
    newsListQuery: {
      FROM_DATE: null, // 查询参数创建时间：开始时间的缓存
      TO_DATE: null, // 查询参数创建时间：结束的缓存
      TITLE: '',  // 查询参数：标题
      CREATE_BY: '',  // 查询参数：作者
    },
    boradcastList: [], // 晨报列表
    initBoradcastList: [],  // 初始化列表数据，为首页服务
    initBoradcastFile: {},  // 首页数据文件
    pagination: {},  // 分页信息
    boradcastDetail: {},  // 晨报详情
    saveboradcastInfo: {},  // 添加晨报结果信息
    delBoradcastInfo: {},  // 删除晨报结果信息
    newUuid: [],
    delSourceFile: {},
  },
  reducers: {
    // 搜索晨报列表成功
    getBoradcastListSuccess(state, action) {
      const { payload: { resultData: { newsList = [], pageVO } }, query } = action;
      const { pageNum = 1, totalCount = 0, pageSize = 10 } = pageVO;
      const pagination = {
        total: totalCount,
        current: pageNum,
        pageSize,
      };
      const newsListQuery = {
        FROM_DATE: query.createdFrom,
        TO_DATE: query.createdTo,
        TITLE: query.title || '',
        CREATE_BY: query.createdBy || '',
      };
      return {
        ...state,
        boradcastList: newsList,
        pagination,
        newsListQuery,
      };
    },
    // 保存晨报结果
    saveBoradcastResult(state, action) {
      const { payload } = action;
      if (payload.type === 'newCreate') {
        const resultData = payload.resultData;
        const uuid = payload.uuid;
        return {
          ...state,
          saveboradcastInfo: { resultData },
          newUuid: uuid,
        };
      }
      return {
        ...state,
        saveboradcastInfo: payload,
        boradcastDetail: {
          ...state.boradcastDetail,
          [payload.newsId]: null,
        },
      };
    },
    getBoradcastDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        boradcastDetail: {
          ...state.boradcastDetail,
          [payload.newsId]: payload,
        },
      };
    },
    // 保存删除列表结果
    delBoradcastResult(state, action) {
      const { response } = action;
      return {
        ...state,
        delBoradcastInfo: response,
      };
    },
    // 初始化uuid
    resetUuid(state, action) {
      const { response } = action;
      return {
        ...state,
        newUuid: response.resultData,
      };
    },
    // 删除文件
    delFileResult(state, action) {
      const { response } = action;
      if (response.code !== '0') {
        message.error('删除文件失败', 1);
      }
      const { attachment, attaches } = response.resultData;
      if (response.resultData) {
        return {
          ...state,
          delSourceFile: { [attachment]: attaches },
        };
      }
      return {
        ...state,
      };
    },
    // 首页列表数据
    homePageList(state, action) {
      const { payload } = action;
      return {
        ...state,
        initBoradcastList: payload,
      };
    },
    // 首页晨报资源
    homePageSource(state, action) {
      const { payload: { newsId, audioSource } } = action;
      return {
        ...state,
        initBoradcastFile: {
          ...state.initBoradcastFile,
          [newsId]: audioSource,
        },
      };
    },
    // 更新文件
    uploaderFile(state, { payload }) {
      console.log(payload.newsId);
      return {
        ...state,
        boradcastDetail: {
          ...state.boradcastDetail,
          [payload.newsId]: null,
        },
      };
    },
  },
  effects: {
    // 获取晨报列表
    * getBoradcastList({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastList, payload);
      yield put({
        type: 'getBoradcastListSuccess',
        payload: response,
        query: payload,
      });
    },
    // 保存晨报
    * saveBoradcast({ payload }, { call, put }) {
      const response = yield call(api.saveBoradcast, payload);
      let query = {
        resultData: response.resultData,
      };
      if (payload.createdBy) {
        const uuidCount = 2;
        const responeUuid = yield call(api.getNewItemUuid, { uuidCount });
        query = {
          ...query,
          uuid: responeUuid.resultData,
          type: 'newCreate',
        };
      } else {
        query = {
          ...query,
          newsId: payload.newsId,
        };
      }

      if (response.code !== '0') {
        message.info('对不起，保存信息失败', 1);
      } else {
        yield put({
          type: 'saveBoradcastResult',
          payload: query,
        });
      }
    },
    // 获取晨报详情
    * getBoradcastDetail({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastDetail, payload);
      if (response.resultData) {
        const { audioFileId, otherFileId } = response.resultData;
        const [audioFileListRes, otherFileListRes] = yield [
          call(api.ceFileList, { attachment: audioFileId }),
          call(api.ceFileList, { attachment: otherFileId }),
        ];
        const [audioFileList,
          otherFileList] = [audioFileListRes.resultData, otherFileListRes.resultData];
        // 排查数据log
        console.log(audioFileList, otherFileList);
        yield put({
          type: 'getBoradcastDetailSuccess',
          payload: {
            ...response.resultData,
            audioFileList,
            otherFileList,
          },
        });
      }
    },
    // 删除晨报列表item
    * delBoradcastItem({ payload }, { call, put }) {
      const response = yield call(api.delBoradcastItem, payload);
      yield put({
        type: 'delBoradcastResult',
        response,
      });
    },
    // 初始化uuid
    * getUuid({ payload }, { call, put }) {
      const uuidCount = 2;
      const response = yield call(api.getNewItemUuid, { uuidCount });
      yield put({
        type: 'resetUuid',
        response,
      });
    },
    * delCeFile({ payload }, { call, put }) {
      const response = yield call(api.delCeFile, payload);
      yield put({
        type: 'delFileResult',
        response,
      });
    },
    // 获取首页数据
    * homaPageNews({ payload }, { call, put }) {
      const response = yield call(api.searchBoradcastList, payload);
      const listResult = response.resultData.newsList;
      if (listResult) {
        const homePageList = listResult.filter((item, index) => index < 2);
        yield put({
          type: 'homePageList',
          payload: homePageList,
        });
      }
    },
    * queryAudioFile({ payload }, { call, put }) {
      const { newsId, audioFileId } = payload;
      const res = yield call(api.ceFileList, { attachment: audioFileId });
      const audioSource = res.resultData.length && res.resultData[0];
      if (audioSource) {
        yield put({
          type: 'homePageSource',
          payload: {
            newsId,
            audioSource,
          },
        });
      }
    },
  },
};
