# Branch Deletion Script

To delete branches in GitHub using the API, we need to send DELETE requests to the Git references endpoint.

The correct API endpoint format is:
```
DELETE /repos/{owner}/{repo}/git/refs/heads/{branch_name}
```

For example, to delete the 'consolidated' branch:
```
DELETE https://api.github.com/repos/NosytLabs/RealityCheckApp/git/refs/heads/consolidated
```

Branches to delete:
- consolidated
- consolidated-branch
- master
- temp-branch
- temp-delete-branch

Only the `main` branch will be kept.

A successful deletion will return a 204 status code with no content in the response body.
