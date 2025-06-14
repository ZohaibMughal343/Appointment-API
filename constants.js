export const ChatEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: "newChat",
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: "joinChat",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);
