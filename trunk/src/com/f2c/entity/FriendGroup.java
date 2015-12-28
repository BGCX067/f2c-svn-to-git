package com.f2c.entity;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.util.Column;
import org.springframework.util.Id;
import org.springframework.util.Table;

/**
 * 
 * 好友分组
 * 
 * @author lihuan
 * 
 */
@XmlRootElement
@Table(name = "T_FRIEND_GROUP")
public class FriendGroup {

	/**
	 * 主键
	 */
	private String id;
	/**
	 * 该组所属人ID(创建人ID)
	 */
	private String userID;
	/**
	 * 组名
	 */
	private String name;
	/**
	 * 创建时间(数据库排序用)
	 */
	private Date createTime;

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

	@Column(name = "NAME")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "CREATE_TIME")
	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}
