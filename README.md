# git-badger

![eslint-errors](https://img.shields.io/badge/eslint--errors-297-red.svg)
![eslint-warnings](https://img.shields.io/badge/eslint--warnings-9-yellow.svg)

Git badger is a tool which uses shieldsio to provide you a way to make custom badges for your git with history.

Git badger provides a simple rest interface:
* **POST** `/badges/:badge/:project` with body `{status: 'some status'}` creates a new record to your `project` about current `status` of `badge`.
* **GET** `/badges/:badge/:project` redirects to [shields.io](https://shields.io) svg badge with last `status` of `badge` for your `project`
* **GET** `/badges/:project` shows all badges for project
* **GET** `/badges/:badge/history/:project` shows badge history for project
* **GET** `/status` to get current status of system. Returns status of application and status of store.
* **GET** `/status/:badge/:project` returns store status for given badge and project
* **GET** `/status/:badge` returns store status for given badge
* **GET** `/status/projects/:project` returns store status for given project

The main difference from other badge services is configurability. It has built-in badges, but if you want a specific badge you can make custom badge creator. For example you want to count `TODO`s comments in your repo, when you need to make `todo-badge-creator` - javascript function that transforms `status` to object with props `color`, `subject`, `status`. Now you can use badge creator with git badger to show your badge in any repo.
[![Eslint Errors](http://localhost/badges/eslint-errors/test)](http://localhost/badges/eslint-errors/test)

## Creating your own badge

### About badge
Badge is an object with next structure

```
{
  color: Color, // string (currently one of 'brightgreen', 'green', 'yellowgreen', 'orange', 'red', 'lightgrey', 'blue')
  status: Status, // any string
  subject: Subject // any string
}
```

Badges created by badge creator.
Badge creator has next structure 
```
{
  name: string, // human readable string
  create(status: Status): Badge, // badge factory - all logic is here
  examples: Status[], // examples to show peoples what your badge can do
  description: string // humad readable string
}
```

### How to create

You can create badge by yourself or you can use [yeoman badge generator](http://yeoman.io/)
```
npm i -g yo
npm i -g generator-git-badger-badge
mkdir my-badge
cd my-badge
yo git-badger-badge
```

Here we install yeoman, creating new directory for our badge and using yeoman to create badge creator package. It will create skeleton with sample badge creator and package.json. All you need is to rewrite badge creator and push it to npm.

### How to use

git-badger has an cli option `badges`. For example you created badge with name `my-badge` and created a package `git-badger-my-badge-badge`. Then you can do next
```
npm i git-badger-my-badge-badge
git-badger --badges my-badge
```

If git-badger can't require your badge by mask `git-badger-%badge-name%-badge` it will try `require(%badge-name%)`

Now open git-badger in browser and check your badge!

## Docker

Dockerfile is [here](./packages/git-badger/Dockerfile). Feel free to fork.

## Contributing guide

* `git clone git@github.com:Crazymax11/badger.git` clone the repository
* `npm i -g lerna` install [lerna](https://github.com/lerna/lerna), this is monorepo
* `lerna bootstrap` bootstrap lerna
* `lerna run build` build some of libs
* `npm start` to start server, it will start web server so you might need ot use sudo for this

We are using [commitizen](https://github.com/commitizen/cz-cli) with [cz-emoji format](https://github.com/ngryman/cz-emoji)
* `npm i -g commitizen cz-emoji` install commitizen
* `git-cz` commit!

Publish `lerna publish`

## TODO

- [x] Show list of available badges on root url with examples and maybe description.
    - [x]( Declare abstract badger type with next public API
        - [x] create(status): badgeMeta
        - [x] examples: [status]
        - [x] description: string - short text about badge goal
    - [x] Create template to show badges with description
    - [x] Render template with all available badges

- [x] Show badge/project status history
- [x] Show page with all available badges
- [x] Make git-badger package which contains app and depends on git-badger-core
- [x] Make Docker image
- [x] Describe git-badge creating guide
- [x] Provide a way to use custom badges, store in git-badger app
- [x] Describe a way to use custom badges and store in git-badger app
- [ ] Describe store creating guide 
- [ ] Describe docker guide
- [ ] Upload docker image to dockerhub
- [ ] Refactor server code
- [ ] Create abstract store for OOP guys
- [ ] Provide a way to require badge and store as is
- [x] Make badges for this repo!
- [ ] Rewrite README.md
- [ ] Make graph in history instead of two columns
