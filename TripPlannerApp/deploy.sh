#!/bin/bash

cd /home/ec2-user/Crawlersforweb/TripPlannerApp

git pull
grunt js-task
pm2 restart 0
