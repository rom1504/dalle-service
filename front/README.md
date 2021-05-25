## front

* Install `npm install`
* dev start `npm start`
* prod build `npm run build`
* package `tar cf dalle-service_front.tar build`
* deploy `hdfs dfs -copyFromLocal dalle-service_front.tar viewfs://preprod-am6/user/r.beaumont/dalle-service_front.tar`