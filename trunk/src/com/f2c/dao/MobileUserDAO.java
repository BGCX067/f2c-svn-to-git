package com.f2c.dao;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.f2c.entity.MobileUser;

@Repository
public class MobileUserDAO extends BaseDAO<MobileUser> {

	private static Logger logger = LoggerFactory.getLogger(MobileUserDAO.class);

	public MobileUser queryByRandom() {
		StringBuilder sql = new StringBuilder();
		JdbcTemplate jdbcTemplate = this.getJdbcTemplate();
		jdbcTemplate.setMaxRows(10);
		List<Object> param = new ArrayList<Object>();
		sql.append("STATE = 0 ");
		sql.append("ORDER BY ID");
		List<MobileUser> mobileUsers = this.queryByCondition(sql.toString(), param.toArray());
		MobileUser mobileUser = null;
		if (mobileUsers != null && mobileUsers.size() > 0) {
			mobileUser = mobileUsers.get((int) (mobileUsers.size() * Math.random()));
		} else {
			logger.debug("表T_MOBILE_USER中没有可用数据!");
		}
		return mobileUser;
	}

}
