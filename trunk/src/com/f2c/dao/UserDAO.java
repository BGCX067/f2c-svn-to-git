package com.f2c.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.f2c.entity.User;

@Repository
public class UserDAO extends BaseDAO<User> {

	public List<User> queryByFacebookUID(String facebookUID) {
		return this.queryByProperty("FACEBOOK_UID", facebookUID);
	}

}
