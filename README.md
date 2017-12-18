# Devine SOS Enhancement Suite

DSOSES is a Chrome extension for [Devine](https://devine.be) students that, as its name implies, enhances the overall user experience with the [Devine SOS Tool](https://sos.devine-tools.be) by adding a plethora of nifty features to the website _and_ beyond, so core functionality can run without the need of having the page open in an active tab.

--------------------------------------------------------------------------------

## What's implemented?

- Notifications for queue updates, even when the consultation page is not open, with notification sounds if that's your thing and customizable depending on how long the queue before you is.
- Live waiting queues, so you won't have to manually refresh the page to check for queue updates if you do prefer to leave the page open in a tab. Bonus: you can even have your position in the queue shown in the tab's title.
- Why are there placeholder images on the server but are they only implemented for student profile pictures, am I right? DSOSES can either fix broken lecturer pictures with placeholders, or hide them altogether.
- It's great to have multiple queues for bigger assignments, but since you can't (logically) enroll for more than one queue at a time, DSOSES can make queues collapsible so you can hide queues that are not interesting to you.
- Quickly see and manage your current queue from anywhere in Chrome from DSOSES' extension window, which also displays a badge with the amount of people in queue before you, if applicable.
- Got a call from 2003 and they want their pseudo-responsive design back: DSOSES gives you up to 5 columns for queues, because just 2 columns looks really silly on your 4K monitor.
- And speaking about silly looking UI: DSOSES can inject [Masonry](https://masonry.desandro.com/) to have all queue containers laid out in a cascading grid, in order to get rid of any white space (or grey space rather) if there's a significant variation in height between containers.

## What's not yet implemented?

- ~~DSOSES does not remember which tables were collapsed when the page unloads, which is kind of an issue since the page gets reloaded each time you subscribe to or unsubscribe from a queue.~~
- I'm not an expert, but I believe using JavaScript for cascading grids is a bit old-fashioned and can be done in pure CSS nowadays.
- DSOSES relies heavily on jQuery. It'd be nice to get rid of that dependency.
- [Maybe something else you'd like to see](https://github.com/Qrivi/DSOSES/issues/new).

--------------------------------------------------------------------------------

## Why is this extension in German?

It's not German, it's Dutch. Since Devine's SOS Tool is only available in Dutch, I figured it'd be nicer if the extension was too. You know: to fit in with the whole "none of our users are more acquainted with English" theme.

## I'd like to contribute!

I appreciate that! Feel free to fork, spoon or knife and submit a pull request when you're ready for desert. Or if you have a great suggestion but would rather not get your fingers dirty yourself: [submit an issue](https://github.com/Qrivi/DSOSES/issues/new) or [tweet me](https://twitter.com/Qrivi)!

## Small legal note

The [license](https://github.com/Qrivi/DSOSES/blob/master/LICENSE) covers what I'm okay with you do with this code, so I'll wrap this up by explicitly stating that I am not affiliated with nor endorsed by Devine or Hogeschool West-Vlaanderen. I started writing this extension because the Devine SOS Tool is so limited it's almost frustrating, and decided to share so I open sourced it. Please enjoy and only use dark themed text editors if you decide to edit this code.

![cool](https://github.com/Qrivi/DSOSES/blob/master/img/icon128.png)
