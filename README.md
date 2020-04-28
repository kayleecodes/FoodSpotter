# FoodSpotter
This is a simple demo app which allows users to 1. signup for email communication regarding free food. and 2. Get an email notification when free food is spotted. 

It uses AWS to host a website using S3. Upon form submission, the website calls one of two api gateway endpoints to either: persist contact data to a database or 2. Get all previously signed up contacts and send an email notification using Simple email service. 
