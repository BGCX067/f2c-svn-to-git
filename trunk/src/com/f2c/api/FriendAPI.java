package com.f2c.api;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.f2c.entity.Friend;
import com.f2c.entity.User;
import com.f2c.service.FriendService;
import com.f2c.service.UserService;
import com.f2c.utils.OpenPlatform;
import com.f2c.utils.ResultsUtil;

/**
 *  
 * 好友相关JSON接口
 * @author lihuan
 *
 */
@Controller
@RequestMapping("/f")
public class FriendAPI extends BaseAPI {

	private static final long serialVersionUID = 1L;
	private static Logger logger = LoggerFactory.getLogger(UserService.class);
	@Autowired
	private FriendService friendService;
	
	/**
	 * 添加好友
	 * 测试地址：http://localhost:8080/f2c/f/add.json?mobile=13810554162&nickname=Li Huan
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/add")
	public Map<String, Object> add(HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("loginUser");
		String mobile = request.getParameter("mobile");
		String nickname = request.getParameter("nickname");
		if (user == null) {
			return createResults(ResultsUtil.USER_LOGIN_FAILURE);
		}
		if (StringUtils.isEmpty(mobile)) {
			return createResults(ResultsUtil.PARAMETER_MOBILE_REQUIRE);
		}
		if (StringUtils.isEmpty(nickname)) {
			return createResults(ResultsUtil.PARAMETER_NICKNAME_REQUIRE);
		}
		logger.debug("添加联系人, user:[{}], mobile:[{}], nickname:[{}]", new Object[]{JSON.toJSONString(user), mobile, nickname});
		List<Friend> friendList = friendService.getFriendByMobile(user.getId(), mobile);
		if (friendList != null && friendList.size() > 0) {
			return createResults(ResultsUtil.FRIEND_ALREAY_EXISTS, friendList.get(0));
		}
		try {
			Friend friend = friendService.add(user, mobile, nickname);
			OpenPlatform.invite(Integer.valueOf(user.getMobileUID()), mobile);
			return createResults(ResultsUtil.SUCCESS, friend);
		} catch (RuntimeException e) {
			logger.error("添加联系人失败", e);
			return createResults(ResultsUtil.DATABASE_ERROR, e.getMessage());
		}
	}
	
	/**
	 * 删除好友
	 * 测试地址：http://localhost:8080/f2c/f/delete.json?f_id=3b78cb03-e022-4c7f-8105-042e1dfd1d0c
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/delete")
	public Map<String, Object> delete(HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("loginUser");
		String fId = request.getParameter("f_id");
		if (user == null) {
			return createResults(ResultsUtil.USER_LOGIN_FAILURE);
		}
		if (StringUtils.isEmpty(fId)) {
			return createResults(ResultsUtil.PARAMETER_FRIENDID_REQUIRE);
		}
		logger.debug("删除联系人, user:[{}], friendUID:[{}]", new Object[]{JSON.toJSONString(user), fId});
		try {
			boolean success = friendService.deleteByID(fId);
			if (success) {
				return createResults(ResultsUtil.SUCCESS, fId);
			} else {
				return createResults(ResultsUtil.FAILED);
			}
		} catch (RuntimeException e) {
			logger.error("删除联系人失败", e);
			return createResults(ResultsUtil.DATABASE_ERROR, e.getMessage());
		}
	}

	
	/**
	 * 修改好友信息
	 * 测试地址：http://localhost:8080/f2c/f/update.json?f_id=xxxxxxxxxx&f_name=xxxxxxxxxxxxx
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/update")
	public Map<String, Object> update(HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("loginUser");
		String fId = request.getParameter("f_id");
		String fName = request.getParameter("f_name");
		if (user == null) {
			return createResults(ResultsUtil.USER_LOGIN_FAILURE);
		}
		if (StringUtils.isEmpty(fId)) {
			return createResults(ResultsUtil.PARAMETER_FRIENDID_REQUIRE);
		}
		try {
			Friend friend = this.friendService.getFriendByID(fId);
			logger.debug("修改联系人信息, user:[{}], friend:[{}]", new Object[]{JSON.toJSONString(user), JSON.toJSONString(friend)});
			if (friend != null) {
				friend.setNickname(fName);
				boolean success = this.friendService.update(friend);
				if (success) {
					return createResults(ResultsUtil.SUCCESS, friend);
				} else {
					return createResults(ResultsUtil.FAILED);
				}
			} else {
				return createResults(ResultsUtil.FAILED);
			}
		} catch (RuntimeException e) {
			logger.error("修改联系人失败", e);
			return createResults(ResultsUtil.DATABASE_ERROR, e.getMessage());
		}
	}
}
