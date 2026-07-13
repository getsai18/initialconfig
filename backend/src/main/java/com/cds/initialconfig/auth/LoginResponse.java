package com.cds.initialconfig.auth;

import com.cds.initialconfig.user.UserResponse;

public record LoginResponse(String token, UserResponse usuario) {}
