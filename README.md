## s3-proxy-server

Proxies requests to an S3 bucket behind http basic auth. Optionally prefixes paths with subdomains, e.g. `https://path.to.file.proxy-server.com/myfile.html` will request the S3 object with key `/path/to/file/myfile.html`. Requests ending in `/` will have `index.html` appended.

We use this to use an s3 bucket as a staging server for deploys of static sites.

### Deploy on Heroku

Just click the button below and fill in the required environment variables

 [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
