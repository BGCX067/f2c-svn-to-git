package com.f2c.service;


public class BaseService {

	public boolean isEmpty(Object obj) {
		if (obj == null) {
			return true;
		}
		if (obj.equals("")) {
			return true;
		}
		return false;
	}
	
	public boolean isNotEmpty(Object obj) {
		if (obj == null) {
			return false;
		}
		if (obj.equals("")) {
			return false;
		}
		return true;
	}

}
