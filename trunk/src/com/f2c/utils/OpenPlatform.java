package com.f2c.utils;

import java.util.Date;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HostConfiguration;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpConnectionManager;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OpenPlatform {

	private static Logger logger = LoggerFactory.getLogger(OpenPlatform.class);
	private static HttpClient httpClient = null;

	static {
		HostConfiguration hostConfiguration = new HostConfiguration();
		HttpConnectionManagerParams params = new HttpConnectionManagerParams();
		params.setConnectionTimeout(3000);
		params.setMaxTotalConnections(2000);
		params.setStaleCheckingEnabled(true);
		params.setTcpNoDelay(true);
		params.setSoTimeout(10000);
		params.setMaxConnectionsPerHost(hostConfiguration, 1000);
		HttpConnectionManager connectionManager = new MultiThreadedHttpConnectionManager();
		connectionManager.setParams(params);
		httpClient = new OPHttpClient(connectionManager);
		httpClient.setHostConfiguration(hostConfiguration);
	}

	private static UTF8PostMethod getPostMethod(String method) {
		UTF8PostMethod postMethod = new UTF8PostMethod(
				Setting.OPEN_PLATFORM_HOST + method);
		postMethod.addParameter("app_key", Setting.OPEN_PLATFORM_APP_KEY);
		postMethod.addParameter("timestamp", getTimestamp());
		return postMethod;
	}

	private static UTF8GetMethod getGetMethod(String method) {
		UTF8GetMethod getMethod = new UTF8GetMethod(Setting.OPEN_PLATFORM_HOST
				+ method);
		getMethod.addParameter("app_key", Setting.OPEN_PLATFORM_APP_KEY);
		getMethod.addParameter("timestamp", getTimestamp());
		return getMethod;
	}

	/**
	 * 
	 * 关闭请求
	 * 
	 * @param method
	 */
	private static void releaseConnection(HttpMethod method) {
		if (method != null) {
			try {
				method.releaseConnection();
			} catch (Exception e) {

			}
		}
	}

	/**
	 * 
	 * 获取时间戳
	 * 
	 * @return
	 */
	private static String getTimestamp() {
		long timestamp = new Date().getTime();
		return String.valueOf(timestamp).substring(0, 10);
	}

	/**
	 * 获取说客用户信息
	 * 
	 * @param baAuthUid
	 *            说客用户id
	 * @return
	 */
	public static String getInfo(int baAuthUid) {
		String response = "";
		UTF8PostMethod postMethod = null;
		try {
			postMethod = getPostMethod("/user/getinfo.json");
			postMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			httpClient.executeMethod(postMethod);
			response = postMethod.getResponseBodyAsString();
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {
			OpenPlatform.releaseConnection(postMethod);
		}
		return response;
	}

	/**
	 * 
	 * 发送私聊信息给某个用户
	 * 
	 * @param baAuthUid
	 *            发送人说客用户id
	 * @param targetId
	 *            目标说客用户id
	 * @param text
	 *            发送内容
	 * @return
	 */
	public static JSONObject directMessagesAdd(int baAuthUid, int targetId,
			String text) {
		String response = "";
		UTF8PostMethod postMethod = null;
		try {
			postMethod = getPostMethod("/directmessages/add.json");
			postMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			postMethod.addParameter("target_id", String.valueOf(targetId));
			postMethod.addParameter("text", String.valueOf(text));
			httpClient.executeMethod(postMethod);
			response = postMethod.getResponseBodyAsString();
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {
			OpenPlatform.releaseConnection(postMethod);
		}
		return JSONObject.fromObject(response);
	}

	/**
	 * 
	 * 获得与某人私聊列表
	 * 
	 * @param baAuthUid
	 *            发送人说客用户id
	 * @param targetId
	 *            目标说客用户id
	 * @param maxId
	 *            分页的标识，获取max_id 之前的列表内容
	 * @param count
	 *            获取说客数量 最大上限 50 默认30
	 * @return
	 */
	public static JSONArray directMessagesDialog(int baAuthUid, int targetId,
			Integer sinceId, Integer count) {
		String response = "";
		UTF8GetMethod getMethod = null;
		try {
			getMethod = getGetMethod("/directmessages/dialog.json");
			getMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			getMethod.addParameter("target_id", String.valueOf(targetId));
			if (sinceId != null) {
				getMethod.addParameter("since_id", String.valueOf(sinceId));
			}
			if (count != null) {
				getMethod.addParameter("count", String.valueOf(count));
			}
			httpClient.executeMethod(getMethod);
			response = getMethod.getResponseBodyAsString();
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {
			OpenPlatform.releaseConnection(getMethod);
		}
		return JSONArray.fromObject(response);
	}

	/**
	 * 
	 * 获取历史对话
	 * 
	 * @param baAuthUid
	 *            发送人说客用户id
	 * @param maxId
	 *            分页的标识，获取max_id 之前的列表内容
	 * @param count
	 *            获取说客数量 最大上限 50 默认30
	 * @return
	 */
	public static JSONArray directMessagesAllDialog(int baAuthUid, Integer maxId,
			Integer count) {
		String response = "";
		UTF8GetMethod getMethod = null;
		try {
			getMethod = getGetMethod("/directmessages/alldialog.json");
			getMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			if (maxId != null) {
				getMethod.addParameter("max_id", String.valueOf(maxId));
			}
			if (count != null) {
				getMethod.addParameter("count", String.valueOf(count));
			}
			httpClient.executeMethod(getMethod);
			response = getMethod.getResponseBodyAsString();
			return JSONArray.fromObject(response);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		} finally {
			OpenPlatform.releaseConnection(getMethod);
		}
	}

	// mobile/get_uid_by_mn.json
	/**
	 * 
	 * 通过手机号获得UID
	 * 
	 * @param baAuthUid
	 *            发送人说客用户id
	 * @param mobile
	 *            手机号
	 * @return
	 */
	public static String getUIDbyMobile(int baAuthUid, String mobile) {
		String response = "";
		UTF8GetMethod getMethod = null;
		try {
			getMethod = getGetMethod("/mobile/get_uid_by_mn.json");
			getMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			getMethod.addParameter("mobile", String.valueOf(mobile));
			httpClient.executeMethod(getMethod);
			response = getMethod.getResponseBodyAsString();
			return JSONObject.fromObject(response).getString("user_id");
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		} finally {
			OpenPlatform.releaseConnection(getMethod);
		}
	}
	
	//mobile/captcha.json
	/**
	 * 
	 * 邀请并粉
	 * 
	 * @param baAuthUid
	 *            发送人说客用户id
	 * @param mobile
	 *            手机号
	 * @return
	 */
	public static JSONArray invite(int baAuthUid, List<String> mobiles) {
		String response = "";
		UTF8PostMethod postMethod = null;
		try {
			postMethod = getPostMethod("/mobile/invite.json");
			postMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			if (mobiles == null) {
				throw new RuntimeException("参数List<String> mobiles不能为空");
			}
			String mobilesStr = "";
			for (String mobile : mobiles) {
				mobilesStr += mobile + ",";
			}
			if (mobilesStr.endsWith(",")) {
				mobilesStr = mobilesStr.substring(0, mobilesStr.length() -1);
			}
			postMethod.addParameter("mobiles", mobilesStr);
			httpClient.executeMethod(postMethod);
			response = postMethod.getResponseBodyAsString();
			return JSONArray.fromObject(response);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		} finally {
			OpenPlatform.releaseConnection(postMethod);
		}
	}
	public static JSONArray invite(int baAuthUid, String mobile) {
		String response = "";
		UTF8PostMethod postMethod = null;
		try {
			postMethod = getPostMethod("/mobile/invite.json");
			postMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			if (mobile == null) {
				throw new RuntimeException("参数String mobile不能为空");
			}
			postMethod.addParameter("mobiles", mobile);
			httpClient.executeMethod(postMethod);
			response = postMethod.getResponseBodyAsString();
			return JSONArray.fromObject(response);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		} finally {
			OpenPlatform.releaseConnection(postMethod);
		}
	}

	//count/get.json
	/**
	 * 
	 * 获取私聊增量
	 * 
	 * @param baAuthUid
	 *            说客用户id
	 * @return
	 */
	public static int countDirectMessage(int baAuthUid) {
		String response = "";
		UTF8GetMethod getMethod = null;
		try {
			getMethod = getGetMethod("/count/get.json");
			getMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			getMethod.addParameter("type", "delta");
			getMethod.addParameter("key", "dr");
			getMethod.addParameter("dataid", String.valueOf(baAuthUid));
			httpClient.executeMethod(getMethod);
			response = getMethod.getResponseBodyAsString();
			JSONObject jsonObject = JSONArray.fromObject(response).getJSONObject(0);
			int count = Integer.valueOf(jsonObject.getString("value"));
			return count;
		} catch (Exception e) {
			logger.error(e.getMessage());
			return 0;
		} finally {
			OpenPlatform.releaseConnection(getMethod);
		}
	}
	//count/set.json
	/**
	 * 
	 * 清除私聊增量
	 * 
	 * @param baAuthUid
	 *            说客用户id
	 * @return
	 */
	public static JSONObject clearDirectMessageCount(int baAuthUid) {
		String response = "";
		UTF8PostMethod postMethod = null;
		try {
			postMethod = getPostMethod("/count/set.json");
			postMethod.addParameter("ba_auth_uid", String.valueOf(baAuthUid));
			postMethod.addParameter("type", "delta");
			postMethod.addParameter("key", "dr");
			postMethod.addParameter("dataid", String.valueOf(baAuthUid));
			httpClient.executeMethod(postMethod);
			response = postMethod.getResponseBodyAsString();
			return JSONObject.fromObject(response);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		} finally {
			OpenPlatform.releaseConnection(postMethod);
		}
	}
	public static void main(String[] args) throws InterruptedException {
		JSONObject object = null;
		JSONArray array = null;
		// 李欢48173783
		// 蔡峰37013942
		// 崔超33261973
		//6744852
//		object = directMessagesAdd(6744852, 48173783, "中文会乱码吗");
//		List<String> mobiles = new ArrayList<String>();
//		mobiles.add("13810138286");
//		array = invite(48173783, mobiles);
		array = directMessagesDialog(48173783, 37013942, 228248918, 1);
//		 array = directMessagesAllDialog(37013942, null, 1);
		// System.out.println(a);
		int count = countDirectMessage(48173783);
//		object = clearDirectMessageCount(48173783);

		System.out.println(count);
		System.out.println(array);
		System.out.println(object);
	}
}
