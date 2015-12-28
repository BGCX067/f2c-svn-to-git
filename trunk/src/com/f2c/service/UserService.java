package com.f2c.service;

import java.util.List;
import java.util.UUID;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.f2c.dao.UserDAO;
import com.f2c.entity.User;
import com.f2c.utils.FaceBook;

@Service
public class UserService extends BaseService {

	private static Logger logger = LoggerFactory.getLogger(UserService.class);
	@Autowired
	private UserDAO userDAO;
	@Autowired
	private MobileUserService mobileUserService;
	
	/**
	 * 判断此facebook用户是否已经是f2c的用户
	 * @param facebookUID
	 * @return
	 */
	public User getUser(String facebookUID){
		List<User> userList =  userDAO.queryByFacebookUID(facebookUID);
		if (userList != null && userList.size() > 0) {
			if (userList.size() > 1) {
				logger.error("(紧急)数据库异常：FACEBOOK_UID=" + facebookUID + "的用户在T_USER表中有多条!");
			}
			return userList.get(0);
		} else {
			return null;
		}
	}
	
	/**
	 * 
	 * 注册
	 * 	
	 * @param user
	 * @return
	 */
	public User register(String facebookUID) {
		if (isEmpty(facebookUID)) {
			logger.debug("FacebookUID不能为空");
			return null;
		}
		String mobileUID = mobileUserService.getMobileUserID();
		if (mobileUID == null) {
			logger.debug("分配说客ID失败");
			return null;
		}
		if (logger.isDebugEnabled()) {
			logger.debug("分配的说客ID：" + mobileUID);
		}
		User user = new User();
		user.setId(UUID.randomUUID().toString());
		user.setMobileUID(mobileUID);
		user.setFacebookUID(facebookUID);
		JSONObject returnObject = FaceBook.getUserInfo(Integer.valueOf(facebookUID));
		String facebookName = returnObject.getString("name");
		user.setNickname(facebookName);
		if (logger.isDebugEnabled()) {
			logger.debug("插入用户数据：" + JSON.toJSONString(user));
		}
		try {
			userDAO.add(user);
		} catch (RuntimeException e) {
			logger.error(e.getMessage());
			return null;
		}
		if (logger.isDebugEnabled()) {
			logger.debug("注册成功,将T_MOBILE_USER中ID为" + mobileUID + "的数据状态修改为：已使用(1)!");
		}
		mobileUserService.updateStateById(mobileUID);
		return user;
	}
	
	public User update(User user){
		if (this.userDAO.update(user)) {
			return user;
		} else {
			return null;
		}
	}

}
