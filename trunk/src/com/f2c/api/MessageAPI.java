package com.f2c.api;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.f2c.entity.Friend;
import com.f2c.entity.Message;
import com.f2c.entity.User;
import com.f2c.service.FriendService;
import com.f2c.service.MessageService;
import com.f2c.service.UserService;
import com.f2c.utils.DateUtils;
import com.f2c.utils.OpenPlatform;
import com.f2c.utils.ResultsUtil;

/**
 *  
 * 消息相关JSON接口
 * @author lihuan
 *
 */
@Controller
@RequestMapping("/msg")
public class MessageAPI extends BaseAPI {

	private static final long serialVersionUID = 1L;
	private static Logger logger = LoggerFactory.getLogger(UserService.class);
	@Autowired
	private FriendService friendService;
	
	/**
	 * 发送私聊信息
	 * 测试地址：http://localhost:8080/f2c/msg/send.json?friend_id=dc64fd98-f443-4e20-8438-5634bb0a81b0&text=123123
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/send")
	public Map<String, Object> add(HttpServletRequest request, HttpServletResponse response){
		try {
			HttpSession session = request.getSession();
			User user = (User) session.getAttribute("loginUser");
			String friendID = request.getParameter("friend_id");
			String text = request.getParameter("text");
			if (user == null) {
				return createResults(ResultsUtil.USER_LOGIN_FAILURE);
			}
			if (StringUtils.isEmpty(friendID)) {
				return createResults(ResultsUtil.PARAMETER_FRIENDUID_REQUIRE);
			}
			if (StringUtils.isEmpty(text)) {
				return createResults(ResultsUtil.PARAMETER_TEXT_REQUIRE);
			}
			Friend friend = this.friendService.getFriendByID(friendID);
			if (logger.isDebugEnabled()) {
				logger.debug("用户" + JSON.toJSONString(user) + "发送[" + text + "]给联系人" + JSON.toJSONString(friend));
			}
			JSONObject returnObject = OpenPlatform.directMessagesAdd(Integer.valueOf(user.getMobileUID()), Integer.valueOf(friend.getMobileUID()), text);
			Message msg = new Message();
			msg.setCreatTime(DateUtils.parseTo(returnObject.getString("create_at")));
			msg.setNickName(user.getNickname());
			msg.setText(returnObject.getString("text"));
			msg.setFeedId(returnObject.getInt("id"));
			msg.setUserId(friendID);
			msg.setType("out");
			return createResults(ResultsUtil.SUCCESS, msg);
		} catch (RuntimeException e) {
			logger.error("发送私聊信息失败,详情:", e);
			return createResults(ResultsUtil.FAILED, e.getMessage());
		}
	}
	
	/**
	 * 获取私聊信息
	 * 测试地址：http://localhost:8888/f2c/msg/history.json?friend_id=dc64fd98-f443-4e20-8438-5634bb0a81b0&max_id=233059605&count=1
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/history")
	public Map<String, Object> get(HttpServletRequest request, HttpServletResponse response){
		try {
			HttpSession session = request.getSession();
			User user = (User) session.getAttribute("loginUser");
			String friendID = request.getParameter("friend_id");
			Integer sinceId = null;
			Integer count = 3;
			if (StringUtils.isNotEmpty(request.getParameter("since_id"))) {
				sinceId = Integer.valueOf(request.getParameter("since_id"));
			}
			if (StringUtils.isNotEmpty(request.getParameter("count"))) {
				count = Integer.valueOf(request.getParameter("count"));
			}
			if (user == null) {
				return createResults(ResultsUtil.USER_LOGIN_FAILURE);
			}
			if (StringUtils.isEmpty(friendID)) {
				return createResults(ResultsUtil.PARAMETER_FRIENDUID_REQUIRE);
			}
			List<Message> msgList = new ArrayList<Message>();
			if ("0000000000000000".equals(friendID)) {
				//处理系统消息
				List<Message> sysMessageList = MessageService.messages.get(user.getId());
				if (sysMessageList != null) {
					for (Message msg : sysMessageList) {
						msgList.add(msg);
					}
				}
				return createResults(ResultsUtil.SUCCESS, msgList);
			}
			Friend friend = this.friendService.getFriendByID(friendID);
			if (logger.isDebugEnabled()) {
				logger.debug("用户" + JSON.toJSONString(user) + "获取与用户" + JSON.toJSONString(friend) + "的私聊信息" );
			}
			JSONArray returnArray = OpenPlatform.directMessagesDialog(Integer.valueOf(user.getMobileUID()), Integer.valueOf(friend.getMobileUID()), sinceId, count);

			for (int i = 0; i < returnArray.size(); i++) {
				JSONObject returnObject = returnArray.getJSONObject(i);
				Message msg = new Message();
				msg.setCreatTime(DateUtils.parseTo(returnObject.getString("create_at")));
				JSONObject userInfo = returnObject.getJSONObject("user_info");
				msg.setNickName(userInfo.getString("nickname"));
				msg.setText(returnObject.getString("text"));
				msg.setFeedId(returnObject.getInt("id"));
				msg.setUserId(friendID);
				if (userInfo.getString("id") != null && userInfo.getString("id").equals(user.getMobileUID())) {
					msg.setType("out");
				} else {
					msg.setType("in");
				}
				msgList.add(msg);
			}
//			return createResults(ResultsUtil.SUCCESS, msgList);
			return createResults(ResultsUtil.SUCCESS, new ArrayList<Message>());
		} catch (RuntimeException e) {
			logger.error("获取私聊信息失败,详情:", e);
			return createResults(ResultsUtil.FAILED, e.getMessage());
		}
	}

	/**
	 * 获取最新私聊
	 * 测试地址：http://localhost:8080/f2c/msg/latest.json
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/latest")
	public Map<String, Object> getLatestMessage(HttpServletRequest request, HttpServletResponse response){
		try {
			HttpSession session = request.getSession();
			User user = (User) session.getAttribute("loginUser");
			List<Friend> friendList = friendService.getFriendListByUID(user.getId());
			List<Message> msgList = new ArrayList<Message>();
			//处理系统消息
			List<Message> sysMessageList = MessageService.messages.get(user.getId());
			if (sysMessageList != null) {
				for (Message msg : sysMessageList) {
					msg.setViewed(true);
					msgList.add(msg);
				}
			}
			int count = OpenPlatform.countDirectMessage(Integer.valueOf(user.getMobileUID()));
			if (count != 0) {
				JSONArray returnArray = OpenPlatform.directMessagesAllDialog(Integer.valueOf(user.getMobileUID()), null, count);
				for (int i =0; i < returnArray.size(); i ++) {
					boolean isUnknow = true;
					JSONObject returnObject = returnArray.getJSONObject(i);
					Message msg = new Message();
					msg.setCreatTime(DateUtils.parseTo(returnObject.getString("create_at")));
					JSONObject userInfo = returnObject.getJSONObject("user_info");
					msg.setNickName(userInfo.getString("nickname"));
					msg.setText(returnObject.getString("text"));
					msg.setFeedId(returnObject.getInt("id"));
					if (userInfo.getString("id") != null && userInfo.getString("id").equals(user.getMobileUID())) {
						msg.setType("out");
					} else {
						msg.setType("in");
					}
					for (Friend friend : friendList) {
						if (friend.getMobileUID().equals(returnObject.getString("user_id"))) {
							msg.setUserId(friend.getId());
							isUnknow = false;
						}
					}
					if(isUnknow) {
						msg.setUserId("unknow");
					}
					msgList.add(msg);
				}
				if (msgList.size() >0) {
					OpenPlatform.clearDirectMessageCount(Integer.valueOf(user.getMobileUID()));
				}
			}
			return createResults(ResultsUtil.SUCCESS, msgList);
		} catch (RuntimeException e) {
			logger.error("获取最新私聊失败,详情:", e);
			return createResults(ResultsUtil.FAILED, e.getMessage());
		}
	}
	
	public static void main(String[] args) throws UnsupportedEncodingException {
		System.out.println(URLDecoder.decode("%E4%B8%AD%E6%96%87", "iso-8859-1"));
	}
}
