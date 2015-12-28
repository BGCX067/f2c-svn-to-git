package com.f2c.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.httpclient.methods.GetMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * GetMethod的utf-8实现
 * 
 * @author lihuan
 * 
 */
public class UTF8GetMethod extends GetMethod {

	private static Logger logger = LoggerFactory.getLogger(UTF8GetMethod.class);

	public UTF8GetMethod() {
	}

	public UTF8GetMethod(String uri) {
		super(uri);
	}

	@Override
	public String getRequestCharSet() {
		return "utf-8";
	}
	
	@Override
	public String getResponseBodyAsString() throws IOException {
		try {
			InputStream inputStream = getResponseBodyAsStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, this.getRequestCharSet()));
			StringBuffer stringBuffer = new StringBuffer();
			String str = "";
			while ((str = br.readLine()) != null) {
				stringBuffer.append(str);
			}
			return stringBuffer.toString();
		} catch (IOException e) {
			logger.error(e.getMessage());
		}
		return "";
	}
	
	public void addParameter(String paramName, String paramValue) {
		StringBuilder path = new StringBuilder(super.getPath());
		if (path.indexOf("?") == -1) {
			path.append("?");
		} else {
			path.append("&");
		}
		path.append(paramName);
		path.append("=");
		path.append(paramValue);
		super.setPath(path.toString());
	}

}
