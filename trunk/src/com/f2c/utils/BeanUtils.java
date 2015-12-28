package com.f2c.utils;

import javax.servlet.ServletContext;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * 
 * 获取SpringBean的工具类
 * 
 * @author lihuan
 * 
 */
public class BeanUtils {

	private static ApplicationContext ctx = null;

	public BeanUtils() {
	}

	static void init(ServletContext sc) {
		if (ctx == null)
			ctx = WebApplicationContextUtils.getWebApplicationContext(sc);
	}

	public static Object getBean(String beanName) {
		return ctx.getBean(beanName);
	}

}