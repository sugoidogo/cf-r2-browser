# Cloudflare R2 Browser

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sugoidogo/cf-r2-browser)

This worker allows you to browse and download files from R2 buckets in your web browser.
Supports multiple domains and buckets from a single worker.
Supports configuration via `wrangler.toml` or Cloudflare dashboard.

# Setup
Deploy with the button above, or clone this repo and configure via `wrangler.toml` before deploying.
In your worker settings, you must set a custom domain (unless you want to use the default workers subdomain), bind an r2 bucket, and then create a variable binding where the key is the domain name and the value is the variable name of the bucket binding.
An example config is commented in the `wrangler.toml`.