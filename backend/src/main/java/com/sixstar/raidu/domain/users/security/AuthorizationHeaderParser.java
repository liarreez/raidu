package com.sixstar.raidu.domain.users.security;

import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;

public class AuthorizationHeaderParser {
  public static String parseTokenFromAuthorizationHeader(String authorization) {
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      throw new BaseException(BaseFailureResponse.INVALID_AUTHORIZED_HEADER);
    }
    return authorization.split(" ")[1];
  }
}
