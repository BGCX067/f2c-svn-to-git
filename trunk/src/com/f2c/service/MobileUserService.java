package com.f2c.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f2c.dao.MobileUserDAO;
import com.f2c.entity.MobileUser;

@Service
public class MobileUserService extends BaseService {
	
	private static Logger logger = LoggerFactory.getLogger(MobileUserService.class);
	@Autowired
	private MobileUserDAO mobileUserDAO;
	protected String getMobileUserID() {
		MobileUser mobileUser = mobileUserDAO.queryByRandom();
		if (mobileUser != null) {
			return mobileUser.getId();
		} else {
			logger.debug("获取说客用户ID失败,请检查表T_MOBILE_USER!");
			return null;
		}
	}
	
	protected boolean updateStateById(String id){
		MobileUser mobileUser = mobileUserDAO.queryById(id);
		mobileUser.setState(1);
		return mobileUserDAO.update(mobileUser);
	}

}
