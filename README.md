# Badger


## Overview

Badger is a simplest HTTP service that provides two simple features:

* You can store status of your application
* You can get last provided application status as [shields.io badge](https://shields.io)

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

## Deploy

TBD
