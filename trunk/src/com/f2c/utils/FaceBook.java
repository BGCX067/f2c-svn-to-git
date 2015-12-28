package com.f2c.utils;

import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HostConfiguration;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpConnectionManager;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FaceBook {
	private static Logger logger = LoggerFactory.getLogger(FaceBook.class);
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
		httpClient = new HttpClient(connectionManager);
		httpClient.setHostConfiguration(hostConfiguration);
	}
	
	private static UTF8PostMethod getPostMethod(String url) {
		UTF8PostMethod postMethod = new UTF8PostMethod(url);
		return postMethod;
	}

	private static UTF8GetMethod getGetMethod(String url) {
		UTF8GetMethod getMethod = new UTF8GetMethod(url);
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
	
	//https://graph.facebook.com/740938899
	/**
	 * 获取FaceBook用户信息
	 * 
	 * @param baAuthUid
	 *            说客用户id
	 * @return
	 */
	public static JSONObject getUserInfo(int userID) {
		String response = "";
		UTF8GetMethod getMethod = null;
		try {
			getMethod = getGetMethod("https://graph.facebook.com/" + userID);
			httpClient.executeMethod(getMethod);
			response = getMethod.getResponseBodyAsString();
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {
			FaceBook.releaseConnection(getMethod);
		}
		return JSONObject.fromObject(response);
	}
	
	public static void main(String[] args) {
		System.out.println(getUserInfo(740938899));
		
	}
}
