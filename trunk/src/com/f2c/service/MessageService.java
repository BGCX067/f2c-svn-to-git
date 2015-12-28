package com.f2c.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.f2c.entity.Message;
import com.f2c.utils.DateUtils;

@Service
public class MessageService {

	public static Map<String, List<Message>> messages = new HashMap<String, List<Message>>();

	public static Map<Integer, String> content;

	static {
		content = new HashMap<Integer, String>();
		content.put(0, "welcome to F2C!you have 30d free use time now!Please click \"+\" in contacts tab to add a new China Mobile contact.Then you can send SMS to him.");
		content.put(1, "you just added \"{0}\" to your contact list.Please inform him to accept your invitation and then send him text messages, or he can not receive text messages you send.");
	}
	/**
	 * 获取机器人消息
	 * 
	 * @param userId
	 * @param text
	 * @return
	 */
	public void pushRobotMessage(String userId, String text) {
		Message message = new Message();
		message.setUserId("0000000000000000");
		message.setType("in");
		message.setNickName("F2C Robot");
		message.setFeedId(0);
		message.setCreatTime(DateUtils.getNow(null));
		message.setText(text);
		List<Message> messageList = messages.get(userId);
		if (messageList == null) {
			messageList = new ArrayList<Message>();
		}
		messageList.add(message);
		messages.put(userId, messageList);
	}
	public List<Message> getRobotMessage(String userId) {
		return messages.get(userId);
	}
	public void clearRobotMessage(String userId) {
		messages.remove(userId);
	}
}
