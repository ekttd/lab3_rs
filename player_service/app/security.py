from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from typing import Dict, Optional
from .config import SECRET_KEY, ALGORITHM

def _extract_token_from_request(request: Request) -> Optional[str]:
    auth = request.headers.get("Authorization")
    if auth:
        auth = auth.strip()
        if auth.lower().startswith("bearer "):
            return auth[7:].strip()

    token_q = request.query_params.get("token")
    if token_q:
        return token_q.strip()

    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        return cookie_token.strip()

    return None


def verify_token(request: Request) -> Dict:
    token = _extract_token_from_request(request)
    if not token:
        raise HTTPException(status_code=403,
                            detail="Missing authentication token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if "sub" not in payload:
            raise HTTPException(status_code=403,
                                detail="Invalid token payload")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired token")
