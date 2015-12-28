package com.f2c.entity;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.util.Column;
import org.springframework.util.Id;
import org.springframework.util.Table;

/**
 * 
 * 好友
 * 
 * @author lihuan
 * 
 */
@Table(name = "T_FRIEND")
@XmlRootElement
public class Friend {

	/**
	 * 主键
	 */
	private String id;
	/**
	 * 哪个用户的好友
	 */
	private String userID;
	/**
	 * 好友昵称
	 */
	private String nickname;
	/**
	 * 手机号码
	 */
	private String mobile;
	/**
	 * 该好友在说客的用户ID
	 */
	private String mobileUID;
	/**
	 * 好友所在组
	 */
	private String friendGroupID;
	/**
	 * 好友状态 1：同意 2：未同意
	 */
	private Integer state = 2;

	@Id
	@Column(name = "ID")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "USER_ID")
	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	@Column(name = "NICKNAME")
	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	@Column(name = "MOBILE")
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "MOBILE_UID")
	public String getMobileUID() {
		return mobileUID;
	}

	public void setMobileUID(String mobileUID) {
		this.mobileUID = mobileUID;
	}

	@Column(name = "FRIEND_GROUP_ID")
	public String getFriendGroupID() {
		return friendGroupID;
	}

	public void setFriendGroupID(String friendGroupID) {
		this.friendGroupID = friendGroupID;
	}

	@Column(name = "STATE")
	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

}
