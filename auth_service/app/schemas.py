from pydantic import BaseModel, EmailStr, constr

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: constr(min_length=2, max_length=128) 


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
