package com.example.TableMate.common.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    //런타임예외 상속받은 CustomException
    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
