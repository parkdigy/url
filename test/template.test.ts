describe('test template', () => {
  it('should encode the data to base64', () => {
    const data = 'Hello, World!';
    const resultData = data.toLowerCase();
    expect(resultData).toBe('hello, world!');
  });
});
