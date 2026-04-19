echo 'Waiting for MongoDB to start...'
until mongosh --host mongo:27017 --eval 'print("ready")'; do
  sleep 2
done

echo 'MongoDB is up. Checking replica set...'
mongosh --host mongo:27017 <<EOF
try {
  rs.status();
  print("Replica set already initialized");
} catch (err) {
  if (err.codeName === "NotYetInitialized") {
    var res = rs.initiate({
      _id: "rs0",
      members: [{ _id: 0, host: "mongo:27017" }]
    });
    if (res.ok) {
       print("Replica set initialized");
    } else {
       print("Failed to initiate: " + JSON.stringify(res));
    }
  } else {
    print("Error checking status: " + err.message);
  }
}
EOF
