authRouter
POST/SIGNUP
POST/LOGIN
POST/LOGOUT

profileRouter
GET/PROFILE/VIEW
PATCH/PROFILEVIW
PATCH/PROFILE/ EDIT
PATCH/PROFILE/PASSWORD

connectionRequestRouter
POST/REQUEST/SEND/INTERETED/:USERID
POST/REQUEST/SEND/IGNORED/:USERID
POST/REQUEST/REVIEW/ACCEPTED/:REQUESTID
POST/REQUEST/REVIEW/REJECTED/:REQUESTID

userRouter
GET /user/CONNECTION
GET /user/REQUEST
GET /user/FEED-GETS YOU THE PROFILR OF ANOTHER USER ON PLATFROM

-Logic for the /feed api
-use $nin , $and ,$or,$ne and other query operator

//pagination
/feed?page=1&limit=10 =>first 1 to 10 user =>skip(0) & limit(10)
/feed?page=2&limit=10 => 2 to 20 user
/feed?page=3&limit=10 => 3 to 30 user
so

.skip() & .limit()
