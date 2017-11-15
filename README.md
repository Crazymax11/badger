# git-badger

Git badger is a tool which uses shieldsio to provide you a way to make custom badges for your git with history.

Git badger provides a simple rest interface:
* **POST** `/badges/:badge/:project` with body `{status: 'some status'}` creates a new record to your `project` about current `status` of `badge`.
* **GET** `/badges/:badge/:project` redirects to [shields.io](https://shields.io) svg badge with last `status` of `badge` for your `project`
* **GET** `/status` to get current status of system. Returns status of application and status of store.
* **GET** `/status/:badge/:project` returns store status for given badge and project
* **GET** `/status/:badge` returns store status for given badge
* **GET** `/status/projects/:project` returns store status for given project

The main difference from other badge services is configurability. It has built-in badges, but if you want a specific badge you can make custom badge creator. For example you want to count `TODO`s comments in your repo, when you need to make `todo-badge-creator` - javascript function that transforms `status` to object with props `color`, `subject`, `status`. Now you can use badge creator with git badger to show your badge in any repo.
[![Eslint Errors](http://localhost/badges/eslint-errors/test)](http://localhost/badges/eslint-errors/test)
## TODO

- [x] Show list of available badges on root url with examples and maybe description.
    - [x] Declare abstract badger type with next public API
        - [x] create(status): badgeMeta
        - [x] examples: [status]
        - [x] description: string - short text about badge goal
    - [x] Create template to show badges with description
    - [x] Render template with all available badges


- [ ] Show badge/project status history
- [x] Show page with all available badges
- [x] Make git-badger package which contains app and depends on git-badger-core
- [x] Make Docker image
