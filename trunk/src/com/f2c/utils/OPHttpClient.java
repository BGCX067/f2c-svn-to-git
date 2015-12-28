package com.f2c.utils;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpConnectionManager;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * 开放平台专用HttpClient,按照开放平台的验证规则自动拼接rest_sig签名认证
 * 
 * @author lihuan
 * 
 */
public class OPHttpClient extends HttpClient {

	private static Logger logger = LoggerFactory.getLogger(OPHttpClient.class);
	
	public OPHttpClient() {
		super();
	}

	public OPHttpClient(HttpClientParams args) {
		super(args);
	}
	
	public OPHttpClient(HttpConnectionManager httpConnectionManager) {
		super(httpConnectionManager);
	}
	
	public OPHttpClient(HttpClientParams params, HttpConnectionManager httpConnectionManager){
		super(params, httpConnectionManager);
	}
	
	@Override
	public int executeMethod(HttpMethod method) throws IOException,
			HttpException {
		if (method instanceof PostMethod) {
			NameValuePair[] parameters = null;
			PostMethod postMethod = (PostMethod) method;
			parameters = postMethod.getParameters();
			List<String> paramList = new ArrayList<String>();
			for (NameValuePair paramter : parameters) {
				paramList.add(paramter.getName());
			}
			Collections.sort(paramList);
			StringBuilder restSig = new StringBuilder();
			for (String name : paramList) {
				restSig.append(name);
				restSig.append("=");
				restSig.append(postMethod.getParameter(name).getValue());
			}
			restSig.append(Setting.OPEN_PLATFORM_SECRET);
			String md5RestSig = MD5Util.encode32Bits(restSig.toString());
			postMethod.addParameter("rest_sig", md5RestSig);
			if (logger.isDebugEnabled()) {
				logger.debug("rest_sig：" + restSig);
				logger.debug("MD5(rest_sig)：" + md5RestSig);
			}
		} else if (method instanceof GetMethod) {
			UTF8GetMethod getMethod = (UTF8GetMethod) method;
			StringBuilder path = new StringBuilder(getMethod.getPath());
			if (path.indexOf("") != -1) {
				String param = path.toString().split("\\?")[1];
				String[] parameters = param.split("&");
				List<String> paramList = new ArrayList<String>();

				for (String paramter : parameters) {
					paramList.add(paramter);
				}
				Collections.sort(paramList);
				StringBuilder restSig = new StringBuilder();
				for (String p : paramList) {
					restSig.append(p);
				}
				restSig.append(Setting.OPEN_PLATFORM_SECRET);
				String md5RestSig = MD5Util.encode32Bits(restSig.toString());
				getMethod.addParameter("rest_sig", md5RestSig);
				if (logger.isDebugEnabled()) {
					logger.debug("rest_sig：" + restSig);
					logger.debug("MD5(rest_sig)：" + md5RestSig);
				}
			}
		}
		return super.executeMethod(method);
	}
}
