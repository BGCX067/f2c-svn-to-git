package com.f2c.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.commons.httpclient.methods.PostMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * PostMethod的utf-8实现
 * 
 * @author lihuan
 * 
 */
public class UTF8PostMethod extends PostMethod {

	private static Logger logger = LoggerFactory.getLogger(UTF8PostMethod.class);

	public UTF8PostMethod() {
	}

	public UTF8PostMethod(String uri) {
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
			return new String(stringBuffer.toString().getBytes());
		} catch (IOException e) {
			logger.error(e.getMessage());
		}
		return "";
	}

}
