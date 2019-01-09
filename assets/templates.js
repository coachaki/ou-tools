if (typeof config === 'object') {
  config.templates = {
    dev: {
      newUser: `
      <form>
        <input name="username"/>
        <input name="password"/>
        <button type="submit" name="submit">Submit</button>
      </form>
    `,
    },
  };
}
