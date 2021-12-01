# E-Commerce-Website
ECommerce website I built using a Traversy tutorial as a template, but fully building out the the backend myself with GraphQL/Apollo and switching using Context instead of Redux. Only thing thats the same is the UI 😋 

During the beginning of the COVID-19 pandemic, I decided to use my time in quarantine to practice full-stack development. I built this ecommerce website based on a Traversy tutorial, but decided to use different technologies to implement the actual product. I basically used the Bootstrap designs from the tutorial, but implemented all the functionality on my own. Here is a list of all the differences:

Differences:
- Implemented my own file uploading on the backend
- Used React Context instead of Redux and implemented Immer for easier state management
- Used Apollo GraphQL instead of a REST API
- Implemented fuzzy search with fuse.js
- Implemented infinite scrolling
- Implemented filtering
- Implemented custom user authentication 
- Implemented authorization depending on admin/logged in status
- Made a data loading script to generated fake user data
- Automated emails to client and customer

Here is a link to the final website (may take some time for heroku to boot up after a cold start because the server shuts down when not in use): https://juliang22-ecommerce.herokuapp.com/login
