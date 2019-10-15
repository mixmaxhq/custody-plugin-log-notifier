const notifier = require('node-notifier');
const {promisify} = require('promise-callbacks');
const exec = promisify(require('child_process').exec);

module.exports = function({ debug }, { patterns }) {
  const matchers = patterns.map((pattern) => new RegExp(pattern));

  return {
    log(process, message) {
      if (!matchers.some((matcher) => matcher.test(message))) return;

      notifier.notify({
        title: 'New message',
        message,
        closeLabel: 'Close',
        actions: 'Show'
      }, (err, response) => {
        if (err) {
          debug('Error showing notification:', err);
        } else if (response === 'activate') {
          // Activate the Terminal if necessary. We should be able to pass the `activate` option
          // through `notifier.notify` to `terminal-notifier` but it works inconsistently--it works
          // when you click the notification body but not when you click "Show" :\. And, fwiw, we
          // can't omit the `actions` and only have the user click on the notification body because
          // `activate` doesn't work unless `actions` is defined.
          exec('open -a Terminal').catch((err) => debug('Could not activate Terminal:', err));
        }
      });
    }
  };
};
