const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  const MOCK_EVENT = {foo: "1", bar: 2};
  const MOCK_EVENT_WITH_PARTITION_KEY = {foo: "1", bar: 2, partitionKey: 'fooPartitionKey'};
  const KEY_THAT_IS_TOO_LONG = 'a'.repeat(256 + 1);
  const MOCK_EVENT_WITH_INVALID_PARTITION_KEY = {foo: "1", bar: 2, partitionKey: KEY_THAT_IS_TOO_LONG};
 
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the correct key for an event whose key we already know", () => {
    const key = deterministicPartitionKey(MOCK_EVENT);
    expect(key).toBe("7d131af31577355285b88cf96a559eb5bff31fdfa6f99d68662975b6691829f5b291a1bdc04b2a6f951c18d96151430ee1ff5dbd7e9f6332de87a8a3d0aaecc3");
  });

  it("Supports events that aren't of type object ", () => {
    expect(() => deterministicPartitionKey('mockEventThatIsAString')).not.toThrow()
    expect(() => deterministicPartitionKey(1_000_000)).not.toThrow()
  });

  it("Returns partitionKey if it is present on the event object ", () => {
    const key = deterministicPartitionKey(MOCK_EVENT_WITH_PARTITION_KEY);
    expect(key).toBe('fooPartitionKey');
  });

  it("Ignores the partitionKey if it is invalid", () => {
    const key = deterministicPartitionKey(MOCK_EVENT_WITH_INVALID_PARTITION_KEY);
    expect(key).not.toBe('fooPartitionKey');
  })


});
