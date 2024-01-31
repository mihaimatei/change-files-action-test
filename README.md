# Change files javascript action

This action is for testing replacing content in .liquid files of a Shopify theme.

## Inputs

### `url`

**Required** An url string to be added as replace in the template files.

## Example usage

Currently, action is not published to marketplace, so use it as:
```yaml
uses: mihaimatei/change-files-action-test@v0.1
with:
  url: 'your-desired-url'
```

Later, after I publish it, you will be able to use it like this:
```yaml
uses: actions/change-files-action-test@v0.1
with:
  url: 'your-desired-url'
```