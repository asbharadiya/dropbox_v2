# Dropbox
Prototype of Dropbox with ReactJS, NodeJS, MongoDB, PassportJS and Apache Kafka

To run this application, follow the following steps:

* Start the MongoDB server
* Follow the kafkascript file in the root directory to start the Zookeeper and Kafka server on your machine. Also follow the insturctions in this file to create Kafka topics
* If your using remote MongoDB, change DB configuration in following files accordingly
  ```sh
  kafkaend/config/dev.json
  kafkaend/config/default.json
  
  backend/config/dev.json
  backend/config/default.json
  ```
* In a new terminal, install all dependencies for the kafka backend server and start it
  ```sh
  cd kafkaend
  npm install
  npm start
  ```
* In a new terminal, install all dependencies for the main backend server and start it
  ```sh
  cd backend
  npm install
  npm start
  ```
* In a new terminal, install all dependencies for the frontend server and start it
  ```sh
  cd frontend
  npm install
  npm start
  ```
  
To run the mocha tests for the REST APIs, follow following steps: 

* First run kafka backend server in test mode
  ```sh
  cd kafkaend
  npm install
  npm test
  ```

* Then in a new terminal, run backend server tests
  ```sh
  cd backend
  npm install
  npm test
  ```
