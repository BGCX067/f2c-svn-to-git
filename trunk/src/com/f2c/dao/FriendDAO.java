package com.f2c.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.f2c.entity.Friend;

@Repository
public class FriendDAO extends BaseDAO<Friend> {

	/**
	 * 根据用户ID查询好友列表
	 * 
	 * @param userID
	 *            要查询的用户ID
	 * @return
	 */
	public List<Friend> queryFriendByUID(String userID) {
		return this.queryByCondition("USER_ID = ?", new String[] { userID });
	}

	/**
	 * 根据好友手机号码查询好友
	 * 
	 * @param mobile
	 *            手机号码
	 * @return
	 */
	public List<Friend> queryFriendByMobile(String userID, String mobile) {
		return this.queryByCondition("USER_ID = ? AND MOBILE = ?", new String[] { userID, mobile });
	}
}
