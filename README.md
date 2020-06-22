![GitHub Actions for Lighthouse Metrics](/media/cover.png)

## Usage

Create `.github/workflows/main.yml` or extend your workflow with the following code:

```yml
name: CI
on: push
jobs:
  trigger-lighthouse-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Trigger Lighthouse Metrics
        uses: lighthouse-metrics/github-actions@master
        with:
          url: 'https://example.com'
          token: {{ secrets.LIGHTHOUSE_METRICS_TOKEN }}
```

## Example

See https://github.com/lighthouse-metrics/github-actions-example

## Inputs

#### `url`

Provide the base URL of your deployment.
This URL will be used to run tests for your defined paths inside Lighthouse Metrics. Everything except the protocol (`http://` or `https://`) and the domain will be ignored.

```yml
url: 'https://example.com'
```

#### `token`

Use your token from the Dashboard after you added your repository.

```yml
token: {{ secrets.LIGHTHOUSE_METRICS_TOKEN }}
```

Make sure you store your token as a secret. Read the [GitHub Documentation](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) about using secrets in workflows.