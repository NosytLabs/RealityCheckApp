# Deleting Branches via GitHub API

To delete branches in the GitHub repository, you can use the GitHub API with the following command:

```
DELETE /repos/{owner}/{repo}/git/refs/heads/{branch_name}
```

For example, to delete the 'consolidated' branch in this repository:

```
DELETE /repos/NosytLabs/RealityCheckApp/git/refs/heads/consolidated
```

Note that branches deleted this way cannot be restored via the UI, unlike branches deleted through the GitHub interface.

## Branches to Delete

- consolidated
- consolidated-branch
- master
- temp-branch

After deletion, only the `main` branch should remain in the repository.