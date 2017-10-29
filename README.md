# git-badger

Git badger is a tool which uses shieldsio to provide you a way to make custom badges for your git with history.

Git badger provides a simple rest interface:
* **POST** `:badge/:project` with body `{status: 'some status'}` creates a new record to your `project` about current `status` of `badge`.
* **GET** `:badge/:project` redirects to [shields.io](shields.io) svg badge with last `status` of `badge` for your `project`

The main difference from other badge services is configurability. It has built-in badges, but if you want a specific badge you can make custom badge creator. For example you want to count `TODO`s comments in your repo, when you need to make `todo-badge-creator` - javascript function that transforms `status` to object with props `color`, `subject`, `status`. Now you can use badge creator with git badger to show your badge in any repo.

## TODO

- [ ] Show badge/project status history
- [ ] Show page with all available badges
- [ ] Make git-badger package which contains app and depends on git-badger-core
- [ ] Make Docker image
