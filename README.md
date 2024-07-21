# Ekshathe

[Ekshathe](https://ekshathe.org) is a website for creating awareness about the violent attack on student protesters demanding reforms in government jobs by the Awami League regime, it's armed militia wing known as Bangladesh Student League and Bangladesh Police.

# Development:

- Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
- Download the Google Sheets and convert them into JSON
- `gem install bundler jekyll jekyll-compose`
- `jekyll serve --watch`

# Data:

- Data is managed by Google Sheets and converted manually to JSON. Assets(images and videos) are uploaded manually to Cloudflare R2.

# Deployment:

- `python convert.py`
- `jekyll bundle`
- Deployment is on done manually to Cloudflare pages

# TODO:

- [ ] Setup CI/CD with Github Actions
- [ ] Develop a basic community management platform for connecting local and expat Bangladeshi's
- [ ] Replace Google Sheets and generate the JSON from a database (TBD)
