/**
 * Notes: 业务基类 
 * Date: 2021-03-15 04:00:00 
 */

const dbUtil = require('../../../framework/database/db_util.js');
const util = require('../../../framework/utils/util.js');
const AdminModel = require('../../../framework/platform/model/admin_model.js');
const NewsModel = require('../model/news_model.js');
const MeetModel = require('../model/meet_model.js');
const ProductModel = require('../model/product_model.js');
const BaseService = require('../../../framework/platform/service/base_service.js');

class BaseProjectService extends BaseService {
	getProjectId() {
		return util.getProjectId();
	}

	async initSetup() {
 
		let F = (c) => 'bx_' + c;
		const INSTALL_CL = 'setup_workhair';
		const COLLECTIONS = ['setup', 'admin', 'log', 'day', 'fav', 'join', 'meet', 'news', 'temp', 'user', 'enroll', 'enroll_join', 'product'];
		const CONST_PIC = '/images/cover.gif';

		const NEWS_CATE = '1=小店动态';
		const MEET_TYPE = '1=理发师,2=项目预约';
		const PRODUCT_CATE = '1=男士,2=女士,3=儿童,4=其他';


		if (await dbUtil.isExistCollection(F(INSTALL_CL))) {
			return;
		}

		console.log('### initSetup...');

		let arr = COLLECTIONS;
		for (let k = 0; k < arr.length; k++) {
			if (!await dbUtil.isExistCollection(F(arr[k]))) {
				await dbUtil.createCollection(F(arr[k]));
			}
		}

		if (await dbUtil.isExistCollection(F('admin'))) {
			let adminCnt = await AdminModel.count({});
			if (adminCnt == 0) {
				let data = {};
				data.ADMIN_NAME = 'admin';
				data.ADMIN_PASSWORD = 'e10adc3949ba59abbe56e057f20f883e';
				data.ADMIN_DESC = '超管';
				data.ADMIN_TYPE = 1;
				await AdminModel.insert(data);
			}
		}


		if (await dbUtil.isExistCollection(F('news'))) {
			let newsCnt = await NewsModel.count({});
			if (newsCnt == 0) {
				let newsArr = NEWS_CATE.split(',');
				for (let j in newsArr) {
					let title = newsArr[j].split('=')[1];
					let cateId = newsArr[j].split('=')[0];

					let data = {};
					data.NEWS_TITLE = title + '标题1';
					data.NEWS_DESC = title + '简介1';
					data.NEWS_CATE_ID = cateId;
					data.NEWS_CATE_NAME = title;
					data.NEWS_CONTENT = [{ type: 'text', val: title + '内容1' }];
					data.NEWS_PIC = [CONST_PIC];

					await NewsModel.insert(data);
				}
			}
		}

		if (await dbUtil.isExistCollection(F('meet'))) {
			let meetCnt = await MeetModel.count({});
			if (meetCnt == 0) {
				let meetArr = MEET_TYPE.split(',');
				for (let j in meetArr) {
					let title = meetArr[j].split('=')[1];
					let cateId = meetArr[j].split('=')[0];

					let data = {};
					data.MEET_TITLE = title + '标题1';
					data.MEET_OBJ = {
						desc: title + '简介1',
						cover: [CONST_PIC],
						content: [{ type: 'text', val: title + '内容1' }],
						level: 3,
						spec: '认真负责,耐心细致'
					};
					data.MEET_ADMIN_ID = '1';
					data.MEET_CATE_ID = cateId;
					data.MEET_CATE_NAME = title;
					data.MEET_DAYS = [];
					data.MEET_JOIN_FORMS = [
						{ type: 'text', title: '姓名', must: true },
						{ type: 'mobile', title: '手机', must: true }
					];

					await MeetModel.insert(data);
				}
			}
		}


		if (await dbUtil.isExistCollection(F('product'))) {
			let productCnt = await ProductModel.count({});
			if (productCnt == 0) {
				let productArr = PRODUCT_CATE.split(',');
				for (let j in productArr) {
					let title = productArr[j].split('=')[1];
					let cateId = productArr[j].split('=')[0];

					let data = {};
					data.PRODUCT_TITLE = title + '标题1';
					data.PRODUCT_CATE_ID = cateId;
					data.PRODUCT_CATE_NAME = title;
					data.PRODUCT_OBJ = { cover: [CONST_PIC], author: '作者', desc: '简介', content: [{ type: 'text', val: title + '1详情介绍' }] };
					await ProductModel.insert(data);
				}
			}
		}



		if (!await dbUtil.isExistCollection(F(INSTALL_CL))) {
			await dbUtil.createCollection(F(INSTALL_CL));
		}
	}

}

module.exports = BaseProjectService;