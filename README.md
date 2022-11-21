# TwitterDL
download all you tweet to json file

this version can only get public tweet from public user

> **Warning** **Lots of shit code**

# Usage
Go to https://developer.twitter.com/en/portal/dashboard create a new bot and then fill .env with .env.example as template first.

## help message
```
Usage:
  node dl.js [OPTION]

Options:
  -o, --output=arg output file                              (default: output.json)
      --pretty     prettify output file
  -u, --user       return user information and exit
  -t, --times=arg  execute how many times, -1 for unlimited (default: -1)
  -v, --version    not yet decided
  -h, --help       display this help
```

## ~~getUserID.js~~ merge into dl.js
```
node getUserID.js <username>
```

## dl.js
* To get tweets(write to file)
```
node dl.js [--pretty] [-o output.json] [-t -1] <username>
```

* To get user information only(print to stdout)
```
node dl.js --user [--pretty] <username>
```
