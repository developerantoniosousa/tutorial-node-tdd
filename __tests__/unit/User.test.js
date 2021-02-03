const bcrypt = require('bcryptjs');

const truncate = require('../utils/truncate');
const factories = require('../factories');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password', async () => {
    const user = await factories.create('User');

    const hash = await bcrypt.hash(user.password, 8);
    expect(await bcrypt.compare(user.password, hash)).toBeTruthy();
  })
});