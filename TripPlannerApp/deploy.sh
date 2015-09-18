#!/bin/bash

cd /home/ec2-user/Crawlersforweb/TripPlannerApp

now=`date`
echo "Start at "$now
git pull
npm install
mkdir -p .build
rm -r .build/*
cp -r public/* .build/
grunt js-task
pm2 restart 0
now=`date`
echo "Ends at "$now
