# Branch Deletion

To delete branches using GitHub API:

```
DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}
```

Branches to delete:
- consolidated
- consolidated-branch
- master
- temp-branch

Only keeping main branch as requested.