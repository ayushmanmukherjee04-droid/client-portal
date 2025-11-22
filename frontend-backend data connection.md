response object is {statusCode,data,message}
# client side 
## auth
# signup
- req - post
- data
	- firstName
	- lastName
	- email
	- mobileNumber
	- app
	- description
	- password
	- confirmPassword
- response
	- in case error of sending data return array of error,message,status
	- in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- in case everything right return a object that will show  statuscode,data:tokens,client data ,message,status

## login
- req - post
- data
	- email
	- password
- response
	- in case error of sending data return array of error,message,status
	- in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- in case everything right return a object that will show  statuscode,data:tokens,client data ,message,status

## logout
- req - post
- need login token that we will get during login

# manage api
## getUrlAndToken
triger on click of app 

 - req - post
- need login token that we will get during login
- data 
	- app_id in body
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- everything right then return object with data : url and token 

## getAllUser
- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user obj that will have id,first_name,last_name,email,mobile_no,app_name,active 

## banUser
- req - post
- need login token that we will get during login
- data
	- send user_id,app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return message of success

## unbanUser
- req - post
- need login token that we will get during login
- data
	- send user_id,app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return message of success

## getBannedUser
- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user that will have id,first_name,last_name,email,mobile_no,app_name,active,
    'banned' AS status

## getActiveUser
- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user obj that will have id,first_name,last_name,email,mobile_no,app_name,active 

## getInactiveUser
- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user obj that will have id,first_name,last_name,email,mobile_no,app_name,active 

## postAddAndUpdateSecret

- req - post
- need login token that we will get during login
- data
	- secret,app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return object that have data app_name,secret

## getSecret
- req - get
- need login token that we will get during login
- data
	- app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return object with data name and secret

## postCreateRole
- req - post
- need login token that we will get during login
-  data
	- app_id, name, description
- response
	- in case error of sending data return array of error,message,status
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return obj with data that have role that have id,name,description

## putUpdateRole
- req - put
- need login token that we will get during login
-  data
	- role_id, name, description

- response
	- in case error of sending data return array of error,message,status
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return obj with data that have role that have id,name,description

## deleteRole
- req - delete
- need login token that we will get during login
-  data
	- role_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return obj with success message

## getRoles
- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return obj data that have id,name,description,app_name,"createdAt","updatedAt"

## postAssinRole
- req - post
- need login token that we will get during login
- data 
	- role_id, user_id, app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return data obj of user that have role_id,name,email,role


## putUpdateAssinRole
- req - put
- need login token that we will get during login
- data 
	- role_id, user_id, app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return data obj of user that have role_id,name,email,role

## deleteAssinRole
- req - post
- need login token that we will get during login
-  data
	- ur_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return success message

## getAlluserWithAssinRoleByAppId
- req - post
- need login token that we will get during login
-  data
	- app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user with id AS user_role_id,first_name,last_name,email,mobile_no,app_name,name AS role

## getUserWithToken
- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user with id,access_token,refresh_token,first_name,last_name,email,app_name

## getUserWithTokenByApp 
- req - post
- need login token that we will get during login
-  data
	- app_id
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of user with id,access_token,refresh_token,first_name,last_name,email,app_name

## postAddApps
- req - post
- need login token that we will get during login
-  data
	- app_name, description, secret
- response
	- - in case error of sending data return array of error,message,status
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return data that have app have name,descripition

## putUpdateApps
- req - put
- need login token that we will get during login
-  data
	- app_name, description, secret
- response
	- - in case error of sending data return array of error,message,status
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return data that have app have name,descripition

## getApp

- req - get
- need login token that we will get during login
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return array of apps that have id,app_name,descripition,secret,client_id(not show that)

## getAppById
- req - get
- need login token that we will get during login
- app_id in url variable
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return obj of apps that have id,app_name,descripition,secret,client_id(not show that)

## deleteApp
- req - get
- need login token that we will get during login
- app_id in url variable
- response
	-  in case of error like miss match,user exist then return object that will show statuscode,data:null,message,status
	- return obj of apps that have id,app_name,descripition,secret,client_id(not show that)
	- 