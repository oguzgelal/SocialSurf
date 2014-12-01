Chromely - Chrome application
=============

This is the source codes of the Chrome application of Chromely.

#### How to run

- Settings -> Extensions
- Make sure [Developer Mode] is checked
- Click [Load unpacked extension...]
- Select "/public/chrome" directory (current directory you are viewing on GitHub)

#### How does it work
After you install, the application will inject a script to every open tab which starts a websocket connection to Chromely server. This way, you check-in to the page you are viewing, logs and online counts could be handled.

In the background, background.js connects to the server as well. It listens to tab and windows actions to set the application badge to the online count of the currently active tab. It receives the data directly from the server.

The popup contains an iframe. The current url data is passed to the server through the URL. The url that the iframe loads is (replace domain with localhost:3000 when testing locally) :
```javascript
http://chromely.meteor.com/chat/[current_url_encoded]
```
You can also browse the same url directly from your browser and you will land on the chat page.
#### Security
Secure websocket connections (wss://) are made to the server or the browser won't let the connections from sites that uses HTTPS. Secure connections won't work on the local server, so you can only use regular websocket connections (ws://) so HTTPS websites will not work locally.
