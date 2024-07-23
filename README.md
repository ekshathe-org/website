# Ekshathe

[Ekshathe](https://ekshathe.org) is a website for documenting the violence on protesters demanding reforms perpetrated by the Awami League regime, it's militia Bangladesh Student League and Bangladesh Police.

# Development:

- Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) and NodeJS
- `cd converter && npm install && npm run convert`
- `gem install bundler jekyll jekyll-compose`
- `jekyll serve --watch`

# Data:

- Data is managed by Google Sheets and converted to JSON. Assets(images and videos) are uploaded manually to Cloudflare R2.
- Download the Google Sheets and convert them into JSON (`converter`)
- File syncing is done via `rclone` (drive to r2)

# Deployment:

- `python convert.py`
- `jekyll bundle`
- Deployment is on done manually to Cloudflare pages

# TODO:

- [x] Setup CI/CD with Github Actions
- [ ] Sync Google Drive with Cloudflare R2
- [ ] Develop a backend to support file uploads to R2 (i.e. cloudflare workers)
- [ ] Stream updates to the users in real time for latest news (i.e. ReadableStream)
- [ ] Replace Google Sheets and build a proper backend
