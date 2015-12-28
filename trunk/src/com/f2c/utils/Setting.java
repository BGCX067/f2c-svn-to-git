package com.f2c.utils;

import java.util.ResourceBundle;

public class Setting {

	public static final String BASE_CHANNEL = getResourceString("BASE_CHANNEL");
	public static final String OPEN_PLATFORM_HOST = getResourceString("OPEN_PLATFORM_HOST");
	public static final String OPEN_PLATFORM_APP_KEY = getResourceString("OPEN_PLATFORM_APP_KEY");
	public static final String OPEN_PLATFORM_SECRET = getResourceString("OPEN_PLATFORM_SECRET");
	public static final String OPEN_PLATFORM_NAME = getResourceString("OPEN_PLATFORM_NAME");
	public static final String FACEBOOK_API_ID = getResourceString("FACEBOOK_API_ID");
	public static final String FACEBOOK_API_KEY = getResourceString("FACEBOOK_API_KEY");
	public static final String FACEBOOK_SECRET_KEY = getResourceString("FACEBOOK_SECRET_KEY");
	public static final String FACEBOOK_APP_URL = getResourceString("FACEBOOK_APP_URL");
	

	private static String getResourceString(String key){
		ResourceBundle bundle = ResourceBundle.getBundle("setting");
		return bundle.getString(key);
	}

}
