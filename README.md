# Holmes-Network
#### A tool for analytics of tweets.
###### Prerequisites: (node.js, npm, Elasticsearch)

* Clone the project.

* Go to the directory from terminal or IDE and type the command “npm install”, this will download 

all the dependencies.

* For all the configuration of the project go to projectDirectory/config, and you can change, any 

configuration like twitter api auth, port number, database url, etc.

* Before running the project, add your auth tokens in projectDirectory/config/twitterConfig.js.

* Also you can set a variable TWIT_COUNT (default is 1000), which specifies how many tweets

get indexed in database.

*  At the end go to the project's main directory in terminal and type node server.js, to run the 

project. You can set TWIT_COUNT variable here, e.g.:- “TWIT_COUNT=500 node server.js”.

*  After running the server, open url (if port is 8080), “http://localhost:8080/documentation”

*  Above link will list all the API's.
