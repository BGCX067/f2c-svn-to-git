package com.f2c.api;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.f2c.utils.ResultsUtil;

public class BaseAPI {

	/**
	 * 创建一个空的返回集合
	 * 
	 * @return
	 */
	public Map<String, Object> createResults() {
		return new ResultsMap<String, Object>();
	}

	/**
	 * 创建返回集合,同时put错误编码
	 * 
	 * @param code
	 *            错误编码
	 * @return
	 */
	public Map<String, Object> createResults(int code) {
		Map<String, Object> results = new ResultsMap<String, Object>();
		results.put("code", code);
		return results;
	}

	/**
	 * 创建返回集合,同时put错误编码和返回数据
	 * 
	 * @param code
	 * @param data
	 * @return
	 */
	public Map<String, Object> createResults(int code, Object data) {
		Map<String, Object> results = new ResultsMap<String, Object>();
		results.put("code", code);
		results.put("data", data);
		return results;
	}

	/**
	 * 
	 * 判断对象是否为空(null || ""),为空返回true,不为空返回false
	 * 
	 * @param arg0
	 * @return
	 */
	public boolean isEmpty(Object arg0) {
		if (arg0 == null) {
			return true;
		}
		if (arg0.equals("")) {
			return true;
		}
		return false;
	}

	/**
	 * 
	 * 判断对象是否为空(null || ""),为空返回false,不为空返回true
	 * 
	 * @param arg0
	 * @return
	 */
	public boolean isNotEmpty(Object arg0) {
		if (arg0 == null) {
			return false;
		}
		if (arg0.equals("")) {
			return false;
		}
		return true;
	}
	
	/**
	 * 
	 * 将String转换成int,不是数字时抛出NumberFormatException
	 * 
	 * @param arg0
	 *            要转换的String格式数字
	 * @return
	 * @throws NumberFormatException
	 */
	public int parseInt(String arg0) throws NumberFormatException {
		return Integer.parseInt(arg0);
	}
	
	/**
	 * 
	 * 将String转换成java.util.Date,不是数字时抛出ParseException
	 * 
	 * @param arg0
	 * 要转换的String格式的日期
	 * @param format
	 * 日期格式定义
	 * @return
	 */
	public Date parseDate(String arg0, String format) throws ParseException {
		DateFormat dateformat = new SimpleDateFormat(format);
		return dateformat.parse(arg0);
	}

	private class ResultsMap<K, V> extends HashMap<K,V> implements Map<K,V> {

		private static final long serialVersionUID = 1L;

		@SuppressWarnings("unchecked")
		@Override
		public V put(K arg0, V arg1) {
			if (!isNotEmpty(arg0)) {
				throw new RuntimeException("参数不能为空!");
			}
			if (arg0.equals("code")) {
				super.put(arg0, arg1);
				return super.put((K)"msg", (V)ResultsUtil.getMessage(Integer.valueOf(arg1.toString())));
			} else {
				return super.put(arg0, arg1);
			}
		}

	}
}
