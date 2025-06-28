# Branch Deletion Plan

## Method for Deleting Branches

To delete branches in the GitHub repository, you can use the GitHub API with the following command:

```
DELETE /repos/{owner}/{repo}/git/refs/heads/{branch_name}
```

For example, to delete the 'consolidated' branch in this repository:

```
DELETE /repos/NosytLabs/RealityCheckApp/git/refs/heads/consolidated
```

Alternatively, you can delete branches through the GitHub web interface by navigating to the branches page and clicking the delete icon next to each branch.

## Branches to Delete

The following branches should be deleted to clean up the repository:

- consolidated
- consolidated-branch
- master
- temp-branch

After deletion, only the `main` branch should remain in the repository.

## Notes

- The `consolidated-branch` was successfully merged into `main` via pull request #1
- The `master` branch could not be merged into `main` due to no common history between them
- The `main` branch now contains all necessary files for the project
