package com.f2c.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.f2c.entity.Friend;
import com.f2c.entity.Message;
import com.f2c.entity.User;
import com.f2c.service.FriendService;
import com.f2c.service.MessageService;
import com.f2c.service.UserService;

/**
 * 
 * 欢迎页
 * 
 * @author lihuan
 * 
 */
@Controller
public class WelcomeController extends BaseController {

	private static final long serialVersionUID = 1L;
	private static Logger logger = LoggerFactory.getLogger(WelcomeController.class);
	@Autowired
	private UserService userService;
	@Autowired
	private FriendService friendService;
	@Autowired
	private MessageService messageService;

	@RequestMapping(value = "/welcome")
	public ModelAndView init(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String, Object> model = new HashMap<String, Object>();
		try {
			HttpSession session = request.getSession();
			User user = null;
			String facebookUID = null;
			if (session.getAttribute("facebook_uid") != null) {
				facebookUID = session.getAttribute("facebook_uid").toString();
			} else if (session.getAttribute("fb_userinfo") != null) {
				JSONObject fbUserinfo = JSONObject.fromObject(session.getAttribute("fb_userinfo"));
				String oauthToken = fbUserinfo.getString("oauth_token");
				String sessionKey = oauthToken.split("\\|")[1];
				facebookUID = fbUserinfo.getString("user_id");
				session.removeAttribute("fb_userinfo");
				session.setAttribute("facebook_uid", facebookUID);
			}

			user = userService.register(facebookUID);
			session.setAttribute("loginUser", user);
			logger.debug("当然登录用户:" + JSON.toJSONString(user));
			List<Friend> friendList =  friendService.getFriendListByUID(user.getId());
			model.put("friendList", friendList);
			model.put("friendListJson", JSON.toJSONString(friendList));
			logger.debug("当然登录用户的好友列表:" + JSON.toJSONString(friendList));
			List<Message> robotMessage = messageService.getRobotMessage(user.getId());
			if (robotMessage == null || robotMessage.size() < 0) {
				messageService.pushRobotMessage(user.getId(), MessageService.content.get(0));
			}
		} catch (RuntimeException e) {
			logger.error(e.getMessage());
		}
		return new ModelAndView("welcome");
	}

}
