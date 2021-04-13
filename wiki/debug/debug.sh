curl -H "Content-Type: application/grpc-web+proto" \
-H "x-grpc-web: 1" \
-H "Accept-Encoding: gzip, deflate" \
-X POST \
http://192.168.100.1:9201/SpaceX.API.Device.Device/Handle

https://www.npmjs.com/package/starlinkapi

grpcurl -plaintext 192.168.100.1:9200 list SpaceX.API.Device.Device


grpcurl -vv -plaintext 192.168.100.1:9200 SpaceX.API.Device.Device/Handle

grpcurl -plaintext -protoset-out dish.protoset 192.168.100.1:9200 describe SpaceX.API.Device.Device

python version:
https://github.com/sparky8512/starlink-grpc-tools


/root/go/bin/grpcurl -v -plaintext -d '{"get_status":{}}' 192.168.100.1:9200 SpaceX.API.Device.Device/Handle


https://www.reddit.com/r/Starlink/comments/jzom2w/connection_stats_and_monitoringdashboarding/


grpcurl -plaintext 192.168.100.1:9200 describe SpaceX.API.Device.Request


grpcurl -v -plaintext -d '{"get_status":{}}' 192.168.100.1:9200 SpaceX.API.Device.Device/Handle
https://www.reddit.com/r/Starlink/comments/m714q7/debug_data_valids/
http://ottawaphotos.com/starlink/v3/
