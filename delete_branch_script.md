# Branch Deletion Script

This document outlines the process for deleting branches in this repository.

## GitHub API Endpoint

To delete a branch using the GitHub API, use the following endpoint:

```
DELETE /repos/{owner}/{repo}/git/refs/heads/{branch_name}
```

For example, to delete the 'consolidated' branch:

```
DELETE /repos/NosytLabs/RealityCheckApp/git/refs/heads/consolidated
```

## Branches to Delete

The following branches will be deleted:

- consolidated
- consolidated-branch
- master
- temp-branch

After deletion, only the `main` branch will remain in the repository.

## Execution

The branch deletion will be executed using the GitHub API with proper authentication.

## Status

- [ ] consolidated
- [ ] consolidated-branch
- [ ] master
- [ ] temp-branch