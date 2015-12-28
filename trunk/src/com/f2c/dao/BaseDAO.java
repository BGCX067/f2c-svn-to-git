package com.f2c.dao;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.util.PageData;
import org.springframework.util.SpringEntityDAO;

public abstract class BaseDAO<T> extends SpringEntityDAO<T> {
	
	/**
	 * 分页查询公共方法
	 * 
	 * @param params
	 * @param sql
	 * @param countSql
	 * @param p
	 * @param mapper
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public PageData<Map<String, Object>> getPageData(List<Object> params,
			String sql, String countSql, PageData<Map<String, Object>> p, RowMapper<?> mapper) {
		PageData<Map<String, Object>> pageData = new PageData<Map<String, Object>>();
		if (p != null) {
			int totalCount = p.getRowCount();
			if (p.getRowCount() == -1) {
				totalCount = getJdbcTemplate().queryForInt(countSql, params.toArray());
			}
			int rowsPerPage = p.getRowsPerPage();
			int currentPage = p.getCurrentPage();
			pageData = (PageData<Map<String, Object>>) pageQuery(countSql, sql, params, rowsPerPage, currentPage, mapper);
			pageData.setRowCount(totalCount);
			pageData.count();
		}
		return pageData;
	}
	
}
