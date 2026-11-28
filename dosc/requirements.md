# Social-App - Brain storming

## presigned-url S3:

- FE send request to BE
- BE [generate link] send response
- FE request with attachment to S3
- S3 request to DB to update the user with profilePicPath

## top topics

- singleton pattern.
- dependency injection.
- use AI as an Agent to plan and create a todo list and implement it.

## technology

- express
- typescript
- mongodb/mongoose
- websocket/socket.io
- graphql
- redis
- docker
- firebase
- s3 bucket/aws

## plan

## pase 1:

- setup project
- user
- auth
- post
- comment
- reaction

## pase 2:

- share post
- friend requests [accept-decline]
- block users
- websocket
- messages
- chat

## pase 3:

- notification
- graphql
- docker

=======================================

* todo:

- FCM tokens FE
- store FCM tokens into DB
- refactor login to get fcm token from FE
- review posts/ refactor
- implement comments

==========================

- review and test comments
- add reactions
- comment on private posts
- get posts only from friends