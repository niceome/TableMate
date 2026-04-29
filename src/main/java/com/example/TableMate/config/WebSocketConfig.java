package com.example.TableMate.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 서버가 클라이언트에게 보낼때 주소
        config.enableSimpleBroker("/sub");

        //클라이언트가 서버에게 보낼때 주소
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //프론트에서 이 주소로 소켓연결 시도함.
        registry.addEndpoint("/ws-tablemate")
                // 추후 프론트엔드 기술 스택 정해지면 추가
                .setAllowedOrigins("*")
                .withSockJS();
    }


}
