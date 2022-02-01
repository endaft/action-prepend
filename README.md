# action-prepend

This GitHub Action is for easily pre-pending values, including other files, into a target file.

## Example

This example demonstrates using this action to pre-pend the `changelog.md` by appending calculated output from a .

```yaml
- name: ✍🏼 Create Changelog Update
  id: changelog
  uses: loopwerk/tag-changelog@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    config_file: .github/tag-changelog-config.js

- name: ✍🏼 Prepend Changelog
  uses: endaft/action-prepend@v0.0.1
  with:
    file_target: ./CHANGELOG.md
    value_in: ${{ steps.changelog.outputs.changelog }}
    is_file: 'false'
```

## Inputs

| name            | required | description                                           | default |
| --------------- | -------- | ----------------------------------------------------- | ------- |
| **file_target** | `true`   | The path to a file to which data will be pre-pended.  |         |
| **value_in**    | `true`   | The value, or file path of a value, to be pre-pended. |         |
| **is_file**     | `true`   | Whether or not to get the `in_value` is a file path.  | `false` |

## Outputs

None
