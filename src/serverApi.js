import http from "@/server/httpServer.js";

// 发红包
export const SendRedPacket = data => {
    return http({ url: "/SendRedPacket", method: "get" }, data);
};