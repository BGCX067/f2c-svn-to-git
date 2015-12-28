package com.f2c.utils;

import java.util.HashMap;
import java.util.Map;

public class ResultsUtil {

	public static final int SUCCESS = 0;
	public static final int FAILED = 1000;
	public static final int DATABASE_ERROR = 1001;
	public static final int USER_LOGIN_FAILURE = 1500; 
	public static final int PARAMETER_DATA_EMPTY  = 2000;
	public static final int PARAMETER_MOBILE_REQUIRE = 2001;
	public static final int PARAMETER_NICKNAME_REQUIRE = 2002;
	public static final int PARAMETER_FACEBOOKUID_REQUIRE = 2003;
	public static final int PARAMETER_FRIENDUID_REQUIRE = 2004;
	public static final int PARAMETER_TEXT_REQUIRE = 2005;
	public static final int PARAMETER_FRIENDID_REQUIRE = 2006;
	public static final int FRIEND_ALREAY_EXISTS = 2100; 
	public static final int MESSAGE_HASNO_LATEST = 2200; 

	private static Map<String, String> messages;

	static {
		messages = new HashMap<String, String>();
		messages.put(String.valueOf(SUCCESS), "操作成功");
		messages.put(String.valueOf(FAILED), "操作失败");
		messages.put(String.valueOf(DATABASE_ERROR), "数据库错误");
		messages.put(String.valueOf(USER_LOGIN_FAILURE), "登录信息已失效");
		messages.put(String.valueOf(PARAMETER_DATA_EMPTY), "POST数据为空");
		messages.put(String.valueOf(PARAMETER_MOBILE_REQUIRE), "手机号码是必传参数");
		messages.put(String.valueOf(PARAMETER_NICKNAME_REQUIRE), "联系人昵称是必传参数");
		messages.put(String.valueOf(PARAMETER_FACEBOOKUID_REQUIRE), "facebook登录信息错误");
		messages.put(String.valueOf(PARAMETER_FRIENDUID_REQUIRE), "联系人ID是必传参数");
		messages.put(String.valueOf(PARAMETER_TEXT_REQUIRE), "发送内容不能为空");
		messages.put(String.valueOf(PARAMETER_FRIENDID_REQUIRE), "好友ID是必传参数");
		messages.put(String.valueOf(FRIEND_ALREAY_EXISTS), "已经添加过此手机号码");
		messages.put(String.valueOf(MESSAGE_HASNO_LATEST), "没有新消息");
	}

	public static String getMessage(int code) {
		return messages.get(String.valueOf(code));
	}

}
