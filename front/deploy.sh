rm -f foag_front.tar
npm run build
tar cf dalle-service_front.tar build
hdfs dfs -rm viewfs://preprod-am6/user/r.beaumont/dalle-service_front.tar
hdfs dfs -copyFromLocal dalle-service_front.tar viewfs://preprod-am6/user/r.beaumont/dalle-service_front.tar
