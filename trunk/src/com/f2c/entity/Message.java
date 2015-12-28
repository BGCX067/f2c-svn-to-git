package com.f2c.entity;


/**
 * 
 * 消息实体对象
 * 
 * @author lihuan
 * 
 */
public class Message {

	/**
	 * 昵称 发送者的昵称
	 */
	private String nickName;
	/**
	 * uuid 永远是别人的id
	 */
	private String userId;
	/**
	 * 消息体
	 */
	private String text;
	/**
	 * 发送时间
	 */
	private String creatTime;
	/**
	 * 消息类型 (in | out 自己或别人发的)
	 */
	private String type;
	/**
	 * feedId
	 */
	private int feedId;
	/**
	 * 如果是系统消息,用来标识是否已经读取,说客来的消息无视此属性
	 */
	private boolean viewed = false;

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getCreatTime() {
		return creatTime;
	}

	public void setCreatTime(String creatTime) {
		this.creatTime = creatTime;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getFeedId() {
		return feedId;
	}

	public void setFeedId(int feedId) {
		this.feedId = feedId;
	}

	public boolean getViewed() {
		return viewed;
	}

	public void setViewed(boolean viewed) {
		this.viewed = viewed;
	}

}
