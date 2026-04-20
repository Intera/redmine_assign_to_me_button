# redmine_assign_to_me_button
A Redmine 5.x plugin that adds an "Assign to me" action to issue detail pages.
## Behaviour
When the current user is logged in, has edit permission on the issue, and is among the issue's assignable users, an "Assign to me" link appears in the contextual action bar of the issue detail page. Clicking the link assigns the issue to the current user via a POST request and reloads the page. The link is not rendered if the issue is already assigned to the current user.
## Installation
Clone or copy the plugin directory into `plugins/redmine_assign_to_me_button` within the Redmine root, then restart Redmine. No database migrations are required.
## Permissions
Assignment is permitted when all of the following hold:
* the user is authenticated,
* the user has `edit_issues` permission on the project, or is an administrator,
* the issue is editable,
* the user appears in the issue's assignable user list, or is an administrator,
* the issue is not already assigned to the user.
