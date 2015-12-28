package com.f2c.utils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

/**
 * 
 * 启动服务器时加载Spring Bean到内存中
 * 
 * @author lihuan
 * 
 */
public class InitBeanUtils extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void destroy() {
		super.destroy();
	}

	public void init() throws ServletException {
		BeanUtils.init(this.getServletContext());
	}

}
