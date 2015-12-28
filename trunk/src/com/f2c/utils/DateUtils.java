package com.f2c.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang.StringUtils;

public class DateUtils {

	@SuppressWarnings("deprecation")
	public static String parseTo(String datetime) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		return dateFormat.format(new Date(datetime));
	}

	@SuppressWarnings("deprecation")
	public static String parseTo(String format, String datetime) {
		if (StringUtils.isEmpty(format)) {
			format = "yyyy-MM-dd hh:mm:ss";
		}
		DateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(new Date(datetime));
	}

	/**
	 * 获取今天日期
	 * 
	 * @param format
	 *            日期返回格式,默认(传递null)为yyyy-MM-dd hh:mm:ss
	 * @return
	 */
	public static String getNow(String format) {
		if (format == null) format = "yyyy-MM-dd hh:mm:ss";
		Calendar ca = Calendar.getInstance();
		ca.setTime(new Date());
		Date d = ca.getTime(); 
		DateFormat dfromat = new SimpleDateFormat(format);
		String date = dfromat.format(d);
		return date;
	}
}
