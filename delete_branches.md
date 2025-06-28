# Branch Deletion Process

To delete branches in GitHub using the API, we need to delete the git references for each branch.

The API endpoint to use is:
```
DELETE /repos/{owner}/{repo}/git/refs/heads/{branch_name}
```

Branches to delete:
- consolidated
- consolidated-branch
- master
- temp-branch
- temp-delete-branch

Only the `main` branch will be kept.
