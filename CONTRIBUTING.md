# How to contribute

We're looking for contributors!

- [Our Website](https://seeql.org/)
- [Developer Docs](https://seeql.org/developers) is where to report them
- [Issue Tracking](https://add-this.org/) is where to report them

## Testing

Enzyme and e2e tests are located in `./test` and ran pre-commit #TODO: this lol

## Submitting changes

- Checkout the `dev` branch
- Make a feature branch `first-last-initial-feature-description` ('sp-add-husky-tests')
- Please send a [Pull Request to SeeQL](https://github.com/oslabs-beta/seeql/pull/new/dev) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)).
- Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    >
    > A paragraph describing what changed and its impact."

## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

- We indent using two spaces (soft tabs)
- Style linting is accomplished with `Prettier/react`
- Our ESLint extends `airbnb`

Thanks,

Kate Matthews, Ariel Hyman, Tyler Sayles, Alice Wong
