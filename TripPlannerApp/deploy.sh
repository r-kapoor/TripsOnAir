#!/bin/bash

cd /home/ec2-user/Crawlersforweb/TripPlannerApp

git pull
npm install
grunt js-task
pm2 restart 0
