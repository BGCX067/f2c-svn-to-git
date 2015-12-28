package com.f2c.entity;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.util.Column;
import org.springframework.util.Id;
import org.springframework.util.Table;

/**
 * 
 * 用户实体对象
 * 
 * @author lihuan
 * 
 */
@Table(name = "T_USER")
@XmlRootElement
public class User {
	/**
	 * 主键
	 */
	private String id;
	/**
	 * 昵称
	 */
	private String nickname;
	/**
	 * 是否开启短信附带昵称 0：关闭 1：开启
	 */
	private boolean nicknameSwitch;
	/**
	 * 性别 (0：保密) (1：男) (2：女)(默认为0)
	 */
	private Integer gender = 0;
	/**
	 * 该用户在facebook的UID
	 */
	private String facebookUID;
	/**
	 * 该用户在139的UID
	 */
	private String mobileUID;
	/**
	 * 账户到期时间
	 */
	private Date expirationDate;

	@Id
	@Column(name = "ID")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "NICK_NAME")
	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	@Column(name = "NICK_NAME_SWITCH")
	public boolean isNicknameSwitch() {
		return nicknameSwitch;
	}

	public void setNicknameSwitch(boolean nicknameSwitch) {
		this.nicknameSwitch = nicknameSwitch;
	}

	@Column(name = "GENDER")
	public Integer getGender() {
		return gender;
	}

	public void setGender(Integer gender) {
		this.gender = gender;
	}

	@Column(name = "FACEBOOK_UID")
	public String getFacebookUID() {
		return facebookUID;
	}

	public void setFacebookUID(String facebookUID) {
		this.facebookUID = facebookUID;
	}

	@Column(name = "MOBILE_UID")
	public String getMobileUID() {
		return mobileUID;
	}

	public void setMobileUID(String mobileUID) {
		this.mobileUID = mobileUID;
	}

	@Column(name = "EXPIRATION_DATE")
	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

}
