# E-commerce-back

* To run using docker
     
     * create a network
          
               docker network create net-e
     * run MongoDB
               
               docker run -d --name mongodb --network net-e -p 27017:27017 mongo:7
     * ensure .env has:

               MONGO_URI=mongodb://mongodb:27017/<your_db_name>
     * build image
          
               docker build -t back .

     * run backend
     
               docker run  --name backend --network net-e -p 3000:3000 --env-file .env back








* Without docker 
     
   * To run use: 
     
          npm start
