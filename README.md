# download-twitter
download all you tweet to json file

this version can only get public tweet from public user

> **Shit Code Warning**

# Usage
Go to https://developer.twitter.com/en/portal/dashboard create a new bot and then fill .env with .env.example as template first.

## getUserID.js
```
node getUserID.js <username>
```

## dl.js
* To get tweets
```
node dl.js <username> [--pretty] [-o|--out out.json]
```

* To get user id only
```
node dl.js <username> --getIdOnly
```
> **Warning**  
> `<usrname>` must be the first argument
