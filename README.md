# cisco-app
Angular/Node app to retreive Amazon Instance data. 

#Stack
Angular, Node, Amazon Node SDK, Twitter Bootstrap, Protractor

#How to Run
Clone the repository
npm install
node server.js

#Login Mechanism
   Login form takes user name 'test' and password 'test' and sets a boolean flag to true in the server. Once this is set
   in the server, any client can make requests. I have hardcoded Amazon's secret key in the server, (routes.js) and once
   the user logs in with test/test, each REST call made using node server, sends the secret key.
   
   Node server exposes REST API's for Login, Logout and /api/all/instances ( which retrieves all running instances).
   Angular has an interceptor which catches 401 and redirects the user to Login if he tries to access an unauthenticated resource. 
      
#Grid and Pagination
   I have used angular ui grid to display the data. Enabled pagination by default to 5 items. I store the tokens retrieved from the
   server in an array within SessionStorage. Also a counter to track the user navigation. Pagination survives page refreshes. 
   In order to disable pagination, you can remove the query param , limit in AJAX call made in line 44 in main.js. Logout and 
   Log back in. This will fetch all data in one shot. 
   TODO: Implement a spinner while data is getting fetched.
   
#Testing
       I have written some end to end tests using protractor. Please run 'web-driver manager start' in a seperate console, to start
           web driver. Open a new console and run protractor conf.js. I have only written tests for Login/Logout/interceptor. Mode tests
       should be written for testing pagination ad grid.     
       
