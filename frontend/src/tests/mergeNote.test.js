import { mergeNote } from "../utils/mergeNote";

test("merges updated fields over the existing note without dropping missing ones", () => {
  const existing = { _id: "abc123", title: "Old", description: "<p>old</p>" };
  const updated = { title: "New", description: "<p>new</p>" };

  const result = mergeNote(existing, updated);

  expect(result).toEqual({ _id: "abc123", title: "New", description: "<p>new</p>" });
});