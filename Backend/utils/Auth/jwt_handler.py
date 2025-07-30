from jose import jwt, JWTError
from datetime import datetime, timedelta


# Secret key for signing the JWT
SECRET_KEY = "ThisISMYSECRET_KEY"
ALGORITHM = "HS256"


from typing import Any


def create_jwt(data: dict[str, Any], expires_in: int = 60) -> str:

    to_encode: dict[str, Any] = data.copy()
    from datetime import timezone

    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_in)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_jwt(token: str) -> dict[str, Any]:

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise ValueError("Invalid or expired token") from e
