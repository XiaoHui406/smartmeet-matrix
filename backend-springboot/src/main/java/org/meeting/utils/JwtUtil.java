package org.meeting.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final String KEY = "";

    //接收业务数据,生成token并返回
    // 定义一个静态方法genToken，用于生成JWT令牌
    public static String genToken(Map<String, Object> claims) {
        // 使用JWT库创建一个JWT生成器
        return JWT.create()
                // 添加自定义的声明（claims），这里将传入的claims参数作为"claims"键的值
                .withClaim("claims", claims)
                // 设置令牌的过期时间为当前时间加上1小时（1000毫秒 * 60秒 * 60分钟）
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 12000))
                // 使用HMAC256算法和预定义的密钥（KEY）对令牌进行签名
                .sign(Algorithm.HMAC256(KEY));
    }

    //接收token,验证token,并返回业务数据
    public static Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(KEY))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }

}
