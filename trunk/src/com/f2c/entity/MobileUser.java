package com.f2c.entity;

import org.springframework.util.Column;
import org.springframework.util.Id;
import org.springframework.util.Table;

@Table(name = "T_MOBILE_USER")
public class MobileUser {

	private String id;
	private Integer state;

	@Id
	@Column(name = "ID")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "STATE")
	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

}
