const creator = {
  /**
   * Human readable badge name
   */
  name: 'js-size',
  /**
   * Method invokes every time than need to create badge
   * @param {string} status 
   * @return {Object} badge - meta data used to create badge with shields.io
   * @return {string} badge.color - badge color - one of shields.io colors
   * available colors for now are 'brightgreen', 'green', 'yellowgreen', 'orange', 'red', 'lightgrey', 'blue'
   * @return {string} badge.subject - text on left side of badge
   * @return {string} badge.status - text on right side of badge
   */
  create(status) {
    // it will be none if status is unknown (was not provided before but was asked for example)
    if (status === 'none') {
      return {
        color: 'lightgrey',
        status: 'unknown',
        subject: 'js size'
      };
    }

    // convert status to your type explicit
    let bytes = Number(status);

    // unit type can be calculated by division on 1024
    // array contains ready to badge unit names
    const types = ['b', 'kb', 'mb', 'gb', 'tb'];
    let type = '';
    do {
      type = types.shift();
      bytes /= 1024;
    } while (bytes >= 1024);

    // JS magic, 2 + 3 = 5.0000000000000001
    bytes = Math.round(bytes);

    return {
      color: 'green',
      subject: 'js size',
      status: `${bytes} ${type}`
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: [
    '0',
    '1',
    '1234',
    '123456',
    '123456789',
    '123456789123',
    '123456789123456',
    '123456789123456789',
    'none'
  ],
  /**
   * Human readable description of badge purpose
   */
  description:
    'Show size of javascript files in bytes. May be used for source code, may be used for bundles/dist files.',

  /**
   * Image link (may be base64) which will be used as badge logo at git badger pages
   */
  image:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC+lBMVEX33x7x2h3n0BzcxxvWwRrHsxjmzxz23h7hyxu7qReWiBJ0aQ5aUQtAOggoJAUVEwMPDgIAAAAREAIjHwQ0LwZHQAliWAyAcxCfjxO+qxfeyBvbxhugkBNwZQ5BOwgQDwI/OQhsYg2aixPLuBn13R6OgRFjWQzizBudjhNZUAseGwQSEQJORwqMfxFKQgmThRKCdRAzLgYCAgAdGgS9qxcXFQNrYA3NuRlWTgoIBwE6NAfv2B2llRQ1MAaGeRDs1R2snBUuKQYTEQJ7bw/o0hy0oxYsJwWYiRLUwBpLQwnEsRjy2x1mXAzKtxktKAUkIATDsBiUhhIKCQEEAwBzaA5MRAlCOwjOuhklIQTQvBm4phYPDQINCwIGBQGejxOVhxIBAQCNgBGLfhGqmhWcjRO/rBcHBgG1pBbaxRoWFAMvKwYbGANnXQw5NAepmBRvZQ7jzRwUEgKklBRSSgoODALZxBqtnRWKfBGEdxB2aw4MCgGBdBBfVgwYFgPArReikhTq1BwrJgXBrhd9cQ+DdhAJCAFsYQ3Gshh+cg9XTwvPuxmxoBbw2R2rmxVhVwyPgRHXwhqjkxQ3MgeRgxIFBAF5bQ9NRQkhHgT03B5bUgvlzhzkzhwgHQSzohY4Mwfr1R1qXw3MuRloXg0cGQPz2x7dxxtVTQqHehBdVAuIehCZihNIQQl1ag7TvxoLCgEDAwDt1h0qJgU7NQfp0xzCrxhyZw58cA9GPwjJtRjJthhNRglFPghDPAjRvRmmlhQ2MQcmIgWJexHYwxpgVwy6qBc8NgeqmRUiHwSQghJeVQvu1x2olxQ+OAjgyhvFshgyLQYxLQYpJQUfHARpXg2vnhVEPQjSvhpuZA0uKgbfyRuyoRa5pxZPSAonIwXVwBplWwxtYw3n0RxxZg6FeBB/cw8aGANJQgk9NweLfRGXiBJ4bA93bA5RSQpYUAunlhRkWgxQSQpTSwqhkRSShBIwLAa8qhfItBibjBO2pBYZFwNcUwt6bg+3pRb////G76G2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QwYDyIeF3DMiAAAAhhJREFUeNrtmTFLAzEUx0MRXQqSdnBQsYggiIuL2iI4iYKTiLiIFHTq1knpIIj4AUQQxKEIgoOogzgUOrnZQdTdT6EggoNa2muvTXLN9d4LyP+3XS733u9y3OUlJwQAAAAAAAAAAAAAAAAAAAAAAABCBhOyxihFeNmE4vSsbIFXYEG2s8goINUscwlIHZssAltSzzaHgDQxTi8gzZALxCSXgSZoUH6551jggHgEjlXDnfMa+snfAvXjHqP4HAcLNHXu/TteE+4ExFX0s1GgwJSve0awC+SJyw27R+BEoOhaQLoQSPoM+vgFBHUlaD0X5FwL/DLPKqCcDqc5BcrUlVDYmnCXb2Giq0XibAsThoo03MpIykeuteGtzqDAtjrWGWS5BLQKSTYBIQ6VBhU+Ac0ocAoIMdwu8MYqIEQP0RDYRHQu0GIwyS8gStEPgWXAtGsBwSnwQiJQGfEd3mkDPgdPDiFv2LfLd6pZBZ5XW26iFsgaa89Lr/VBm2OoK4HadTcaAW8LNtNo2zd9CSzT570Ly8Z414bvne/MhFX6lO/aWLXtTJ2q9Zs/oymQwr9uar7qXTdkZ9gJfFjE6yx/WkQ7BIlG13WCAbDbfj6hyB9gUPJ1LQbmPwohELe4oR2S3fIVm3jG9IUo5r4m3lV9P0l+FizZxLtXp3/qrgB4tfkDpXhocxEUId+r9Wipi+DeAxS/KQAA4N/xA20qvE7U1adgAAAAAElFTkSuQmCC'
};

module.exports = creator;
