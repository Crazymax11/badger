# Badger


## Overview

Badger is a simplest HTTP service that provides few features:

* You can store status of your application
* You can get last provided application status as [shields.io badge](https://shields.io)
* You can get list of badges for project
* You can get json list of badge datas for project

That's it!

## Store status

To store status you need to make post request to `/badges/project-name/subject-name` with body json payload

```json
{
    "color": "red",
    "status": "any text",
    "subject": "subject"
}
```

* color must be one of brightgreen green yellowgreen yellow orange red lightgrey blue or hex format abcdef
* status will be shown at right side of badge
* subject will be shown at left side of badge

Badger stores only one status per project/subject. Badger stores all statuses in-memory.

### Curl example
`curl -X POST -d '{"color":"red","status":"80","subject":"subject"}' http://localhost:8080/badges/project/subject`

## Get last status

To get actual badge for project/subject you need to make GET request to `/badges/project/subject`, then badger will redirect you to [shields.io badge](https://shields.io).

### Markdown example

```md
![eslint](http://badge-host.domain.com/badges/webapp/eslint)
```

### Curl example
`curl http://localhost:8080/badges/project/subject`

## Get project status page

To look at status page just navigate to /badges/project

## Get json list of badges for project

To get actual list of badges for project you need to make GET request to `/badges/project/json`. Yep, you can't make subject with name `json`, it's reserved for json api. Sorry.

### Curl example

`curl http://localhost:8080/badges/project/json`

## Docker

Docker image is published at Docker Hub as msosnov/badger.
Application is running on 8080 port

# Developing

To build: `GOOS=linux GOARCH=386 go build -o badger *.go`

To docker:
* Build `docker build -t msosnov/badger .`
* Run `docker run -p 8080:8080 --rm msosnov/badger`

# OMG WHY SO BIG HISTORY AND RELEASE COUNT!?

It was big JavaScript first project before. It was a really hype train:
* lerna mono-repo (about 30-40 packages I think)
* flow types
* tests
* own npm namespace
* Vuejs
* WebComponents

It was made as flexible solution, but it did not. Also there are some overengineering solutins such as:
* Composable, configurable and autoresolable badge creators
* Abstract store with few implementations (in-memory store, mysql store, nedb store)
* Badges history per project/subject

But in real life I don't need nothing of it. All I need is to show actual repository state at README.md. So all features I need is to get *last actual state of repository* as *bagde*. New badger do that and only that.