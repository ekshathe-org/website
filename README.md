# Ekshathe

[Ekshathe](https://ekshathe.org) is a website for creating awareness about the violent attack on student protesters demanding reforms in government jobs by the Awami League regime, it's armed militia wing known as Bangladesh Student League and Bangladesh Police.

# Development:

- Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
- `gem install bundler jekyll jekyll-compose`
- `jekyll serve --watch`

# Data:

- Data is managed by Google Sheets and converted manually to JSON. Assets(images and videos) are uploaded manually to Cloudflare R2.
- Download the Google Sheets and convert them into JSON (`converter`)
- File syncing is done via `rclone` (drive to r2)

# Deployment:

- `python convert.py`
- `jekyll bundle`
- Deployment is on done manually to Cloudflare pages

# TODO:

- [ ] Setup CI/CD with Github Actions
- [ ] Sync Google Drive with Cloudflare R2
- [ ] Develop a backend to support file uploads to R2 (i.e. cloudflare workers)
- [ ] Stream updates to the users in real time for latest news (i.e. ReadableStream)
- [ ] Replace Google Sheets and build a proper backend
