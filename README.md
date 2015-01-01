SocialWeb
========

### Browse web socially!

This app lets you to have instant chat with people that are browsing the same page with you.

 - Reading an article ? Discuss it with others reading it at the same time
 - Someone is browsing your Facebook page ? Say hi to them :)
 - Watching a video ? Talk about it with others.
 - Do you own a website ? Ask your visitors about the experience (SocialWeb for web developers will come some time in the future)


### Run SocialWeb

This application is built with Meteor.JS so you should have Meteor installed. Then, run the following command:
```sh
$ meteor
```
If you are having trouble running the app, click [here](https://www.meteor.com/install) for more information.


### Run Tests

The tests run on a testing framework for Meteor called Laika. You have to complete the setup of Laika. You can find the introductions [here](http://arunoda.github.io/laika/).

In order to run tests, you should have have typed the following command and started a MongoDB server.
```sh
$ meteor
```
Open a new tab in your terminal window on the same directory, and type the following command to start a new MongoDB server:
```sh
$ mongod
```
If you have a permission issue, you can make it a sudo:
```sh
$ sudo mongod
```
Then, open a new terminal tab again on the same directory. Type:
```sh
$ laika
```
Then the test cases and suites will run.
