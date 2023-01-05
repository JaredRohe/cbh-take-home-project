# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

The first thing I did here was invert the logic which returns the TRIVIAL_PARTITION_KEY when `event` is undefined.  This is an extremely valuable technique in which you take care of the edge cases as early as possible in the code and "short circuit" i.e return early.  This frees up the rest of the code from being nested inside conditional logic.  It reduces cognitive load when reading your code.  I then extracted the algorithm into 3 core pieces:   

1. `getCandidateFromEvent` This function handles the core logic of the algorithm.  It determines whether or not it will leverage the partionKey defined on the event ojbect or if it will make a call to generate the partionKey.

2. `getMessageHash` This is a generic hashing method which takes a single input and hashes it.  This is convenient since the algorithm makes use of the hashing implementation multiple times.
   
3. `getValidatedCandidate` This method is concerned with ensuring that the key is properly validated and formatted before we return it. The function checks the key's length and also it's data type.

To summarize, reducing the amount of nesting here is the biggest win from a readability perspective.  Moreover, by extracting pieces of the logic into separate functions, we see a clear breakdown of each piece of work that this function is responsible for. 