describe('test template', () => {
  it('test', () => {
    const data = 'Hello, World!';
    const resultData = data.toLowerCase();
    expect(resultData).toBe('hello, world!');
  });
});
