Chromely - Chrome application
=============

This is the source codes of the Chrome application of Chromely.

#### How to run

- Settings -> Extensions
- Make sure [Developer Mode] is checked
- Click [Load unpacked extension...]
- Select "/public/chrome" directory (current directory you are viewing on GitHub)

#### How does it work
After you install, the application will inject a script into every open tab which opens a websocket connection to Chromely server. This way, you check-in to the page you are viewing, logs and online counts could be kept.

In the background, background.js connects to the server as well. It listens to tab and windows actions to set the application badge to the online count of the currently active tab.

The popup contains an iframe to the server which passing the current url. The url that the iframe loads is (on the server) is :
```javascript
http://chromely.meteor.com/chat/[current_url_encoded]
```
You can also browse the same url directly from your browser and you will land on the chat page.
#### Security
Secure websocket connections (wss://) are made to the server or the browser won't let the connections on the sites that uses HTTPS. Secure connections won't work on the local server because there is no certificate, so you can only use reqular websocket connections (ws://) so HTTPS websites will not work locally.
