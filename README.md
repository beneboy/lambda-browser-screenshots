# Lambda Browser Screenshots

[AWS Lambda](https://aws.amazon.com/lambda/) function that gives a REST API that returns a PNG screenshot of a given 
URL. Small and easy to deploy without having to worry about S3.

## What?

A batteries-included single file NodeJS application that takes a URL query string and returns a screenshot of that 
page in PNG format. Useful to integrate as a microservice with other applications. Uses Chromium/Puppeteer to render
the pages. This should "just work" without having to figure out the right versions and host Chromium in an S3 bucket
and so on.

## How?

Build using `make`:

```shell script
$ make
```
Or if you don't have `make`, run the build steps manually:

```shell script
$ cd src
$ npm install --production
$ zip -r ../function.zip .
```
Either way, you should get an output file `function.zip`. 

Now upload the `function.zip` to your Lambda in AWS.

### AWS Setup

Supports **Node 14.x** Lambda runtime.

You should set up a REST API as the trigger to the function. Make sure that you add `image/png` as a 
**Binary media type** in the REST API configuration, otherwise you'll get back base-64 encoded data.

When making the request, you must specify the HTTP header `Accept: image/png` otherwise, again, you'll get back base-64 
encoded data.

The screenshotter runs faster when you can allocate more RAM to your Lambda function, ~1600MB seems to be good to get a
screenshot back within 2-3 seconds. Depending on your region and so forth you should be able to get 1,000,000 
executions for ~$60USD. 

### Usage

The parameters that can be specified are:

- `url` (required): The URL to screenshot
- `width` (optional): The width of the browser window, defaults to `1280`
- `height` (optional): The height of the browser window, defaults to `800`

#### Example Using Curl

```shell script
$ curl -H "Accept: image/png" \
  https://FUNCTION_ID.execute-api.REGION.amazonaws.com/default/browser-shot\?url\=https://www.example.com\&width\=800\&height\=600 \
  > example.com.png
```

## Why?

There's a ton of example code out there for doing this, but it can be dependency hell to get it working. Different 
versions of Puppeteer and Chromium have bugs to deal with and don't work right.

This is a ready-to-go solution that you can build and upload to AWS Lambda without having to waste time trying to sort
out dependencies. When packaged it's less than 50MB including the `node_modules` you can easily upload to Lambda without
having to go via S3.
