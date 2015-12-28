package com.f2c.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.f2c.dao.FriendDAO;
import com.f2c.entity.Friend;
import com.f2c.entity.User;
import com.f2c.utils.OpenPlatform;

@Service
public class FriendService extends BaseService {

	private static Logger logger = LoggerFactory.getLogger(FriendService.class);

	@Autowired
	private MobileUserService mobileUserService;
	@Autowired
	private MessageService messageService;
	@Autowired
	private FriendDAO friendDAO;

	/**
	 * 获取机器人
	 * @return
	 */
	public Friend getRobot() {
		Friend friend = new Friend();
		friend.setId("0000000000000000");
		friend.setNickname("F2C");
		friend.setState(1);
		return friend;
	}
	
	/**
	 * 根据手机登录用户、手机号码,给登录用户添加好友
	 * 
	 * @param user
	 *            当前登录的用户
	 * @param friendMobile
	 *            要添加的手机号码
	 * @return
	 */
	public Friend add(User user, String mobile, String nickname) {
		logger.debug("添加好友操作");
		if (isEmpty(user)) {
			logger.debug("User对象不能为空");
			return null;
		}
		if (isEmpty(mobile)) {
			logger.debug("要添加人的手机号码不能为空");
			return null;
		}
		if (isEmpty(nickname)) {
			logger.debug("要添加人的昵称不能为空");
			return null;
		}
		List<Friend> friendList = getFriendByMobile(user.getId(), mobile);
		if (friendList != null && friendList.size() > 0) {
			if (logger.isDebugEnabled()) {
				logger.debug("用户" + JSON.toJSONString(user) + "已经有这个好友" + mobile);
			}
			return null;
		}
		if (logger.isDebugEnabled()) {
			logger.debug(user + JSON.toJSONString(user));
			logger.debug("friend mobile：" + mobile);
			logger.debug("friend nickname：" + nickname);
		}
		String friendUID = OpenPlatform.getUIDbyMobile(Integer.valueOf(user.getMobileUID()), mobile);
		if (friendUID == null) {
			friendUID = mobileUserService.getMobileUserID();
		}
		if (friendUID == null) {
			logger.debug("分配说客ID失败");
			return null;
		}
		if (logger.isDebugEnabled()) {
			logger.debug("要添加人的UID：" + friendUID);
		}
		try {
			Friend friend = new Friend();
			friend.setId(UUID.randomUUID().toString());
			friend.setUserID(user.getId());
			friend.setMobile(mobile);
			friend.setNickname(nickname);
			friend.setMobileUID(friendUID);
			this.friendDAO.add(friend);
			messageService.pushRobotMessage(user.getId(), MessageService.content.get(1).replace("{0}", friend.getNickname()));
			
			return friend;
		} catch (RuntimeException e) {
			logger.error(e.getMessage());
			throw e;
		}
	}

	/**
	 * 根据用户ID、手机号码获取该用户的好友
	 * @param mobile
	 * @return
	 */
	public List<Friend> getFriendByMobile(String userID, String mobile){
		return this.friendDAO.queryFriendByMobile(userID, mobile);
	}
	
	/**
	 * 根据用户ID获取该用户的好友List
	 * @param userID
	 * @return
	 */
	public List<Friend> getFriendListByUID(String userID){
		List<Friend> friendList = this.friendDAO.queryFriendByUID(userID);
		friendList.add(0, getRobot());
		return friendList;
	}
	
	/**
	 * 根据好友ID获取好友信息
	 * @param id
	 * @return
	 */
	public Friend getFriendByID(String id){
		return this.friendDAO.queryById(id);
	}

	/**
	 * 根据好友ID删除好友
	 * @param id
	 * @return
	 */
	public boolean deleteByID(String id){
		return this.friendDAO.deleteById(id);
	}

	/**
	 * 修改好友信息
	 * @param id
	 * @return
	 */
	public boolean update(Friend friend){
		return this.friendDAO.update(friend);
	}

}
